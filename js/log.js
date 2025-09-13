// EcoSlug Tracker - Log Functionality

class LogManager {
    constructor() {
        this.logEntries = this.loadLogData();
        this.isEditMode = false;
        this.currentEditingId = null;
    }

    // Load log data from localStorage
    loadLogData() {
        const stored = localStorage.getItem('pesticideLog');
        return stored ? JSON.parse(stored) : [];
    }

    // Save log data to localStorage
    saveLogData() {
        localStorage.setItem('pesticideLog', JSON.stringify(this.logEntries));
    }

    // Get next entry number
    getNextEntryNumber() {
        if (this.logEntries.length === 0) return 1;
        return Math.max(...this.logEntries.map(entry => entry.entryNumber)) + 1;
    }

    // Add new entry
    addEntry(entryData) {
        const newEntry = {
            id: Date.now().toString(),
            entryNumber: this.getNextEntryNumber(),
            dateApplied: entryData.dateApplied,
            timeApplied: entryData.timeApplied,
            plantArea: entryData.plantArea,
            dosageAmount: entryData.dosageAmount,
            notesRemarks: entryData.notesRemarks || '',
            createdAt: new Date().toISOString()
        };
        
        this.logEntries.unshift(newEntry); // Add to beginning of array
        this.saveLogData();
        return newEntry;
    }

    // Update existing entry
    updateEntry(id, entryData) {
        const index = this.logEntries.findIndex(entry => entry.id === id);
        if (index !== -1) {
            this.logEntries[index] = {
                ...this.logEntries[index],
                dateApplied: entryData.dateApplied,
                timeApplied: entryData.timeApplied,
                plantArea: entryData.plantArea,
                dosageAmount: entryData.dosageAmount,
                notesRemarks: entryData.notesRemarks || '',
                updatedAt: new Date().toISOString()
            };
            this.saveLogData();
            return this.logEntries[index];
        }
        return null;
    }

    // Delete entry
    deleteEntry(id) {
        const index = this.logEntries.findIndex(entry => entry.id === id);
        if (index !== -1) {
            this.logEntries.splice(index, 1);
            this.saveLogData();
            return true;
        }
        return false;
    }

    // Get entry by ID
    getEntryById(id) {
        return this.logEntries.find(entry => entry.id === id);
    }

    // Export log data
    exportToText() {
        let exportText = `EcoSlug Tracker - Application Log Export\n`;
        exportText += `Export Date: ${new Date().toLocaleString()}\n`;
        exportText += `Total Entries: ${this.logEntries.length}\n\n`;
        
        exportText += `${'Entry#'.padEnd(8)} | ${'Date'.padEnd(12)} | ${'Time'.padEnd(8)} | ${'Plant/Area'.padEnd(20)} | ${'Dosage'.padEnd(20)} | Notes\n`;
        exportText += `${'-'.repeat(8)} | ${'-'.repeat(12)} | ${'-'.repeat(8)} | ${'-'.repeat(20)} | ${'-'.repeat(20)} | ${'-'.repeat(30)}\n`;
        
        this.logEntries
            .sort((a, b) => a.entryNumber - b.entryNumber)
            .forEach(entry => {
                exportText += `${entry.entryNumber.toString().padEnd(8)} | `;
                exportText += `${entry.dateApplied.padEnd(12)} | `;
                exportText += `${entry.timeApplied.padEnd(8)} | `;
                exportText += `${entry.plantArea.substring(0, 20).padEnd(20)} | `;
                exportText += `${entry.dosageAmount.substring(0, 20).padEnd(20)} | `;
                exportText += `${entry.notesRemarks}\n`;
            });
        
        return exportText;
    }
}

// Global log manager instance
const logManager = new LogManager();

// Initialize log page
function initLogPage() {
    renderLogTable();
    updateStats();
}

// Render log table
function renderLogTable() {
    const tableBody = document.getElementById('logTableBody');
    const emptyState = document.getElementById('emptyState');
    const logTable = document.getElementById('logTable');
    
    if (logManager.logEntries.length === 0) {
        logTable.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    logTable.style.display = 'table';
    emptyState.style.display = 'none';
    
    tableBody.innerHTML = '';
    
    // Sort entries by entry number (most recent first)
    const sortedEntries = [...logManager.logEntries].sort((a, b) => b.entryNumber - a.entryNumber);
    
    sortedEntries.forEach(entry => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="entry-number">#${entry.entryNumber}</td>
            <td class="date-cell">${formatDate(entry.dateApplied)}</td>
            <td class="time-cell">${formatTime(entry.timeApplied)}</td>
            <td class="plant-area">${escapeHtml(entry.plantArea)}</td>
            <td class="dosage">${escapeHtml(entry.dosageAmount)}</td>
            <td class="notes">${escapeHtml(entry.notesRemarks || '-')}</td>
            <td class="actions-column" style="display: none;">
                <button class="btn-edit-small" onclick="editEntry('${entry.id}')" title="Edit Entry">
                    <img src="images/edit-icon.svg" alt="Edit" style="width: 16px; height: 16px;">
                </button>
                <button class="btn-delete-small" onclick="deleteEntry('${entry.id}')" title="Delete Entry">
                    <img src="images/delete-icon.svg" alt="Delete" style="width: 16px; height: 16px;">
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Update statistics
function updateStats() {
    const totalEntries = document.getElementById('totalEntries');
    const count = logManager.logEntries.length;
    totalEntries.textContent = `${count} ${count === 1 ? 'entry' : 'entries'}`;
}

// Toggle edit mode
function toggleEditMode() {
    logManager.isEditMode = !logManager.isEditMode;
    const editButton = document.getElementById('editButton');
    const addButton = document.getElementById('addButton');
    const actionsColumns = document.querySelectorAll('.actions-column');
    
    if (logManager.isEditMode) {
        editButton.style.display = 'none';
        addButton.style.display = 'flex';
        actionsColumns.forEach(col => col.style.display = 'table-cell');
        showMessage('Edit mode enabled. You can now edit or delete entries.', 'info');
    } else {
        editButton.style.display = 'flex';
        addButton.style.display = 'none';
        actionsColumns.forEach(col => col.style.display = 'none');
        showMessage('Edit mode disabled.', 'info');
    }
}

// Show edit modal
function showEditModal(entryId = null) {
    const modal = document.getElementById('editModal');
    const overlay = document.getElementById('modalOverlay');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('entryForm');
    
    // Reset form
    form.reset();
    document.getElementById('entryId').value = entryId || '';
    
    if (entryId) {
        // Edit mode
        const entry = logManager.getEntryById(entryId);
        if (entry) {
            modalTitle.textContent = `Edit Entry #${entry.entryNumber}`;
            document.getElementById('dateApplied').value = entry.dateApplied;
            document.getElementById('timeApplied').value = entry.timeApplied;
            document.getElementById('plantArea').value = entry.plantArea;
            document.getElementById('dosageAmount').value = entry.dosageAmount;
            document.getElementById('notesRemarks').value = entry.notesRemarks;
        }
    } else {
        // Add mode
        modalTitle.textContent = 'Add New Entry';
        // Set default date and time to now
        const now = new Date();
        document.getElementById('dateApplied').value = now.toISOString().split('T')[0];
        document.getElementById('timeApplied').value = now.toTimeString().split(' ')[0].substring(0, 5);
    }
    
    modal.style.display = 'block';
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Hide edit modal
function hideEditModal() {
    const modal = document.getElementById('editModal');
    const overlay = document.getElementById('modalOverlay');
    
    modal.style.display = 'none';
    overlay.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Save entry
function saveEntry() {
    const form = document.getElementById('entryForm');
    const entryId = document.getElementById('entryId').value;
    
    // Validate form
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const entryData = {
        dateApplied: document.getElementById('dateApplied').value,
        timeApplied: document.getElementById('timeApplied').value,
        plantArea: document.getElementById('plantArea').value.trim(),
        dosageAmount: document.getElementById('dosageAmount').value.trim(),
        notesRemarks: document.getElementById('notesRemarks').value.trim()
    };
    
    try {
        if (entryId) {
            // Update existing entry
            logManager.updateEntry(entryId, entryData);
            showMessage('Entry updated successfully!', 'success');
        } else {
            // Add new entry
            logManager.addEntry(entryData);
            showMessage('New entry added successfully!', 'success');
        }
        
        renderLogTable();
        updateStats();
        hideEditModal();
        
    } catch (error) {
        console.error('Error saving entry:', error);
        showMessage('Error saving entry. Please try again.', 'error');
    }
}

// Edit entry
function editEntry(entryId) {
    showEditModal(entryId);
}

// Delete entry
function deleteEntry(entryId) {
    const entry = logManager.getEntryById(entryId);
    if (!entry) return;
    
    if (confirm(`Are you sure you want to delete Entry #${entry.entryNumber}?\n\nThis action cannot be undone.`)) {
        if (logManager.deleteEntry(entryId)) {
            showMessage('Entry deleted successfully.', 'success');
            renderLogTable();
            updateStats();
        } else {
            showMessage('Error deleting entry.', 'error');
        }
    }
}

// Export log data
function exportLogData() {
    if (logManager.logEntries.length === 0) {
        showMessage('No entries to export.', 'info');
        return;
    }
    
    try {
        const exportText = logManager.exportToText();
        const blob = new Blob([exportText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pesticide-log-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showMessage('Log exported successfully!', 'success');
    } catch (error) {
        console.error('Export error:', error);
        showMessage('Error exporting log.', 'error');
    }
}

// Show message
function showMessage(text, type) {
    const container = document.getElementById('messageContainer');
    container.className = type === 'success' ? 'success-message' : 
                        type === 'error' ? 'error-message' : 'info-message';
    container.textContent = text;
    container.style.display = 'block';
    
    setTimeout(() => {
        container.style.display = 'none';
    }, 4000);
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour12 = parseInt(hours) % 12 || 12;
    const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('log.html')) {
        initLogPage();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (!window.location.pathname.includes('log.html')) return;
    
    // ESC to close modal
    if (e.key === 'Escape') {
        hideEditModal();
    }
    
    // Ctrl/Cmd + N to add new entry
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        showEditModal();
    }
});
