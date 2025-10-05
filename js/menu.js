function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");
    sidebar.classList.toggle("show");
    overlay.classList.toggle("show");
}

function closeSidebar() {
    document.getElementById("sidebar").classList.remove("show");
    document.getElementById("sidebarOverlay").classList.remove("show");
}

function setActiveNavItem(el) {
    const items = document.querySelectorAll(".sidebar-item");
    items.forEach(item => item.classList.remove("active"));
    el.classList.add("active");
    closeSidebar(); // auto-close after click on mobile
}
function openSidebar() {
  document.getElementById("sidebar").classList.add("open");
  document.getElementById("sidebarOverlay").style.display = "block";
}

function closeSidebar() {
  document.getElementById("sidebar").classList.remove("open");
  document.getElementById("sidebarOverlay").style.display = "none";
}
