import { loadHeaderFooter, getParam } from "./utils.mjs";
import { login, signup } from "./auth.mjs";

loadHeaderFooter();

// Get redirect parameter
const redirect = getParam("redirect") || "/";

// DOM elements
const modal = document.getElementById("authModal");
const openModalBtn = document.getElementById("openLoginModal");
const closeBtn = document.querySelector(".close");
const authTabs = document.querySelectorAll(".auth-tab");
const authForms = document.querySelectorAll(".auth-form");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

// Open modal
openModalBtn.addEventListener("click", () => {
    modal.style.display = "block";
});

// Close modal
closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

// Close modal when clicking outside
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

// Tab switching functionality
authTabs.forEach(tab => {
    tab.addEventListener("click", () => {
        const targetTab = tab.getAttribute("data-tab");
        
        // Remove active class from all tabs and forms
        authTabs.forEach(t => t.classList.remove("active"));
        authForms.forEach(f => f.classList.remove("active"));
        
        // Add active class to clicked tab
        tab.classList.add("active");
        
        // Show corresponding form
        const targetForm = document.getElementById(`${targetTab}Form`);
        if (targetForm) {
            targetForm.classList.add("active");
        }
        
        // Clear any existing alerts
        clearAlerts();
    });
});

// Login form submission
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearAlerts();
    
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    
    if (!email || !password) {
        showAlert("Please fill in all fields", "error");
        return;
    }
    
    const creds = { email, password };
    
    try {
        await login(creds, redirect);
    } catch (error) {
        showAlert(error.message || "Login failed", "error");
    }
});

// Signup form submission
signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearAlerts();
    
    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
        showAlert("Please fill in all fields", "error");
        return;
    }
    
    if (password !== confirmPassword) {
        showAlert("Passwords do not match", "error");
        return;
    }
    
    if (password.length < 6) {
        showAlert("Password must be at least 6 characters long", "error");
        return;
    }
    
    const userData = { name, email, password };
    
    try {
        await signup(userData);
        // Show success message
        showAlert("Account created successfully! Logging you in...", "success");
        
        // Clear signup form
        signupForm.reset();
        
        // The auth.mjs signup function will handle auto-login
        // No need to switch to login tab or ask user to login manually
        
    } catch (error) {
        showAlert(error.message || "Signup failed", "error");
    }
});

// Helper functions
function showAlert(message, type = "error") {
    const alertContainer = document.getElementById("alertContainer");
    if (!alertContainer) return;
    
    clearAlerts();
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${type}`;
    alertDiv.textContent = message;
    alertDiv.style.display = 'block';
    
    alertContainer.appendChild(alertDiv);
}

function clearAlerts() {
    const alertContainer = document.getElementById("alertContainer");
    if (alertContainer) {
        alertContainer.innerHTML = '';
    }
}

// Check if user is already logged in and redirect
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('so_token');
    if (token) {
        // User is already logged in, redirect to home or intended page
        window.location.href = redirect === "/" ? "/" : redirect;
    }
});
