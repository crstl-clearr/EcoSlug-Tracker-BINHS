// EcoSlug Tracker - Main JavaScript File

// Navigation functions
function navigateToLog() {
    window.location.href = 'log.html';
}

function navigateToWeather() {
    window.location.href = 'weather.html';
}

function navigateToPestCount() {
    window.location.href = 'pest-count.html';
}

function navigateToPestReduction() {
    window.location.href = 'calculator.html';
}

function navigateToCalculator() {
    window.location.href = 'calculator.html';
}

function navigateHome() {
    window.location.href = 'index.html';
}



// Weather functionality
class WeatherService {
    constructor() {
        this.apiKey = null; // Will use a free weather service
        this.lastApplication = this.getLastApplicationDate();
    }

    // Get user's location
    async getUserLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by this browser.'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    });
                },
                (error) => {
                    reject(error);
                },
                { timeout: 10000, enableHighAccuracy: true }
            );
        });
    }

    // Get weather data using OpenWeatherMap API (free tier)
    async getWeatherData(lat, lon) {
        try {
            // Using OpenWeatherMap free API (requires API key)
            // For demo purposes, we'll simulate weather data
            return this.getSimulatedWeatherData(lat, lon);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            return this.getSimulatedWeatherData(lat, lon);
        }
    }

    // Simulated weather data for demo purposes
    getSimulatedWeatherData(lat, lon) {
        const conditions = ['sunny', 'cloudy', 'rainy', 'windy'];
        const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
        
        return {
            location: 'Your Location',
            temperature: Math.floor(Math.random() * 15) + 15, // 15-30°C
            condition: randomCondition,
            humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
            windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
            pressure: Math.floor(Math.random() * 50) + 1000, // 1000-1050 hPa
            description: this.getWeatherDescription(randomCondition)
        };
    }

    getWeatherDescription(condition) {
        const descriptions = {
            sunny: 'Clear and sunny',
            cloudy: 'Partly cloudy',
            rainy: 'Light rain',
            windy: 'Windy conditions'
        };
        return descriptions[condition] || 'Pleasant weather';
    }

    getWeatherIcon(condition) {
        const icons = {
            sunny: 'images/weather-sunny.svg',
            cloudy: 'images/weather-cloudy.svg',
            rainy: 'images/weather-rainy.svg',
            windy: 'images/weather-windy.svg'
        };
        return icons[condition] || 'images/weather-icon.svg';
    }

    // Generate weather-based advice
    getWeatherAdvice(weatherData) {
        const { condition, windSpeed, temperature, humidity } = weatherData;
        
        // Ideal conditions for pesticide application
        if (condition === 'sunny' && windSpeed < 10 && temperature > 18 && temperature < 28 && humidity > 50) {
            return {
                icon: 'images/advice-good.svg',
                text: 'Perfect weather! Ideal conditions for pesticide application.',
                isGoodWeather: true
            };
        }
        
        // Good conditions with minor considerations
        if (condition === 'cloudy' && windSpeed < 15 && temperature > 15) {
            return {
                icon: 'images/advice-thumbs-up.svg',
                text: 'Good weather! You can apply pesticide with caution.',
                isGoodWeather: true
            };
        }
        
        // Poor conditions
        if (condition === 'rainy' || windSpeed > 15) {
            return {
                icon: 'images/advice-warning.svg',
                text: 'Not recommended! Wait for better weather conditions.',
                isGoodWeather: false
            };
        }
        
        // Default advice
        return {
            icon: 'images/advice-info.svg',
            text: 'Check weather conditions carefully before application.',
            isGoodWeather: null
        };
    }

    // Get last application date from localStorage
    getLastApplicationDate() {
        const stored = localStorage.getItem('lastPesticideApplication');
        return stored ? new Date(stored) : null;
    }

    // Set last application date
    setLastApplicationDate(date) {
        localStorage.setItem('lastPesticideApplication', date.toISOString());
        this.lastApplication = date;
        
        // Auto-sync to cloud if user is signed in
        this.syncToCloudIfSignedIn();
    }

    // Calculate countdown for next application (assume 14 days between applications)
    getNextApplicationCountdown() {
        if (!this.lastApplication) {
            return {
                days: 0,
                hours: 0,
                minutes: 0,
                text: 'No previous application recorded'
            };
        }

        const now = new Date();
        const nextApplication = new Date(this.lastApplication);
        nextApplication.setDate(nextApplication.getDate() + 14); // 14 days later

        const timeDiff = nextApplication - now;
        
        if (timeDiff <= 0) {
            return {
                days: 0,
                hours: 0,
                minutes: 0,
                text: 'Ready for next application'
            };
        }

        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

        return {
            days,
            hours,
            minutes,
            text: `${days}d ${hours}h ${minutes}m until next application`
        };
    }
    
    // Sync data to cloud if user is signed in (helper method)
    syncToCloudIfSignedIn() {
        if (typeof googleAuthService !== 'undefined' && googleAuthService.isSignedIn()) {
            setTimeout(() => {
                googleAuthService.syncToCloud().catch(error => {
                    console.error('Auto-sync failed:', error);
                });
            }, 1000);
        }
    }
}

// Pest count functionality
class PestCountManager {
    constructor() {
        this.data = this.loadData();
    }

    loadData() {
        const stored = localStorage.getItem('pestCountData');
        return stored ? JSON.parse(stored) : {
            treated: { before: null, after: null },
            control: { before: null, after: null }
        };
    }

    saveData() {
        localStorage.setItem('pestCountData', JSON.stringify(this.data));
    }

    updateCount(category, timing, value) {
        this.data[category][timing] = parseInt(value);
        this.saveData();
        
        // Auto-sync to cloud if user is signed in
        this.syncToCloudIfSignedIn();
    }

    generateNumberOptions() {
        const options = ['<option value="">Select count...</option>'];
        for (let i = 0; i <= 100; i++) {
            options.push(`<option value="${i}">${i}</option>`);
        }
        return options.join('');
    }

    getEffectivenessCalculation() {
        const { treated, control } = this.data;
        
        if (treated.before === null || treated.after === null || 
            control.before === null || control.after === null) {
            return null;
        }

        const treatedReduction = ((treated.before - treated.after) / treated.before) * 100;
        const controlReduction = ((control.before - control.after) / control.before) * 100;
        const effectiveness = treatedReduction - controlReduction;

        return {
            treatedReduction: treatedReduction.toFixed(1),
            controlReduction: controlReduction.toFixed(1),
            effectiveness: effectiveness.toFixed(1)
        };
    }
    
    // Sync data to cloud if user is signed in (helper method)
    syncToCloudIfSignedIn() {
        if (typeof googleAuthService !== 'undefined' && googleAuthService.isSignedIn()) {
            setTimeout(() => {
                googleAuthService.syncToCloud().catch(error => {
                    console.error('Auto-sync failed:', error);
                });
            }, 1000);
        }
    }
}

// Global instances
const weatherService = new WeatherService();
const pestCountManager = new PestCountManager();

// Initialize weather page
async function initWeatherPage() {
    const loadingElement = document.getElementById('loading');
    const weatherContainer = document.getElementById('weatherData');
    const errorContainer = document.getElementById('errorMessage');

    try {
        // Show loading state
        if (loadingElement) loadingElement.style.display = 'block';
        if (errorContainer) errorContainer.style.display = 'none';

        // Get location and weather data
        const location = await weatherService.getUserLocation();
        const weatherData = await weatherService.getWeatherData(location.lat, location.lon);
        const advice = weatherService.getWeatherAdvice(weatherData);
        const countdown = weatherService.getNextApplicationCountdown();

        // Update weather display
        document.getElementById('location').textContent = weatherData.location;
        const weatherIconElement = document.getElementById('weatherIcon');
        const iconSrc = weatherService.getWeatherIcon(weatherData.condition);
        weatherIconElement.innerHTML = `<img src="${iconSrc}" alt="${weatherData.condition}" style="width: 48px; height: 48px; object-fit: contain;">`;
        document.getElementById('temperature').textContent = `${weatherData.temperature}°C`;
        document.getElementById('humidity').textContent = `${weatherData.humidity}%`;
        document.getElementById('windSpeed').textContent = `${weatherData.windSpeed} km/h`;
        document.getElementById('pressure').textContent = `${weatherData.pressure} hPa`;
        document.getElementById('description').textContent = weatherData.description;

        // Update advice
        const adviceIconElement = document.getElementById('adviceIcon');
        adviceIconElement.innerHTML = `<img src="${advice.icon}" alt="Advice" style="width: 32px; height: 32px; object-fit: contain;">`;
        document.getElementById('adviceText').textContent = advice.text;

        // Update countdown
        document.getElementById('countdownTime').textContent = countdown.text;

        // Hide loading, show content
        if (loadingElement) loadingElement.style.display = 'none';
        if (weatherContainer) weatherContainer.style.display = 'block';

    } catch (error) {
        console.error('Error initializing weather page:', error);
        
        // Show error message
        if (loadingElement) loadingElement.style.display = 'none';
        if (errorContainer) {
            errorContainer.style.display = 'block';
            errorContainer.textContent = 'Unable to load weather data. Please check your location settings and try again.';
        }
    }
}

// Initialize pest count page
function initPestCountPage() {
    // Populate dropdown menus
    const dropdowns = document.querySelectorAll('.dropdown-select');
    const options = pestCountManager.generateNumberOptions();
    
    dropdowns.forEach(dropdown => {
        dropdown.innerHTML = options;
        
        // Set saved values
        const category = dropdown.dataset.category;
        const timing = dropdown.dataset.timing;
        const savedValue = pestCountManager.data[category]?.[timing];
        
        if (savedValue !== null) {
            dropdown.value = savedValue;
        }

        // Add change listener
        dropdown.addEventListener('change', (e) => {
            const value = e.target.value;
            if (value !== '') {
                pestCountManager.updateCount(category, timing, value);
            }
        });
    });
}

// Page initialization based on current page
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    
    switch (currentPage) {
         case 'log.html':
            if (typeof initLogPage === 'function') {
                initLogPage(); // defined in log.js
            }
            break;
        case 'weather.html':
            initWeatherPage();
            break;
        case 'pest-count.html':
            initPestCountPage();
            break;
        case 'calculator.html':
            // Calculator page is intentionally left blank
            break;
        default:
            // Home page or other pages
            break;
    }
});

// Utility function to format dates
function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Update countdown timer every minute (for weather page)
if (window.location.href.includes('weather.html')) {
    setInterval(() => {
        const countdown = weatherService.getNextApplicationCountdown();
        const countdownElement = document.getElementById('countdownTime');
        if (countdownElement) {
            countdownElement.textContent = countdown.text;
        }
    }, 60000); // Update every minute
}

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("show");
  document.getElementById("sidebarOverlay").classList.toggle("show");
}

function closeSidebar() {
  document.getElementById("sidebar").classList.remove("show");
  document.getElementById("sidebarOverlay").classList.remove("show");
}

function setActiveNavItem(el) {
  // remove active class from all items
  document.querySelectorAll(".sidebar-item").forEach(item => {
    item.classList.remove("active");
  });
  // add active class to clicked one
  el.classList.add("active");
  closeSidebar();
}

// ------------------ GOOGLE SIGN-IN ------------------
window.googleAuthService = {
    user: null,

    init() {
        google.accounts.id.initialize({
            client_id: "973644214985-cgb7ehk0d902nhbmja3vkn6ialt8uio9.apps.googleusercontent.com",
            callback: this.handleCredentialResponse.bind(this)
        });
        google.accounts.id.renderButton(
            document.getElementById("googleButton"),
            { theme: "outline", size: "large" }
        );
        google.accounts.id.prompt();
    },

    handleCredentialResponse(response) {
        const data = jwt_decode(response.credential); // Requires jwt-decode lib OR custom parsing
        this.user = data;
        this.updateUI();
    },

    updateUI() {
        if (!this.user) return;
        document.getElementById("name").textContent = this.user.name;
        document.getElementById("email").textContent = this.user.email;
        document.getElementById("avatar").src = this.user.picture;
        document.getElementById("profile").hidden = false;
        document.getElementById("googleButton").style.display = "none";
    },

    signOut() {
        this.user = null;
        document.getElementById("profile").hidden = true;
        document.getElementById("googleButton").style.display = "block";
    },

    isSignedIn() {
        return !!this.user;
    },

    async syncToCloud() {
        if (!this.user) return;
        // Example sync: send localStorage data to your backend
        console.log("Syncing data for", this.user.email);
    }
};

// Bind sign-out button
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("signOutBtn");
    if (btn) {
        btn.addEventListener("click", () => googleAuthService.signOut());
    }
    if (window.google) {
        googleAuthService.init();
    }
});

function openSidebar() {
    document.getElementById("sidebar").classList.add("open");
    document.getElementById("sidebarOverlay").classList.add("active");
}

function closeSidebar() {
    document.getElementById("sidebar").classList.remove("open");
    document.getElementById("sidebarOverlay").classList.remove("active");
}

