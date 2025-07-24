//This module provides login, signup, and authentication state management.

import { loginRequest, signupRequest } from "./externalServices.mjs";
import { alertMessage, getLocalStorage, setLocalStorage } from "./utils.mjs";
import { jwtDecode } from "https://cdn.jsdelivr.net/npm/jwt-decode@4.0.0/build/esm/index.js";

const tokenKey = "so_token";

export async function login(creds, redirect = "/") {
    try {
        const token = await loginRequest(creds);
        setLocalStorage(tokenKey, token);
        // Try reading it back:
        window.location = redirect;
    } catch (err) {
        alertMessage(err.message || "Login failed");
    }
}
// Signup function to create a new user and log them in
export async function signup(userData) {
    try {
        const result = await signupRequest(userData);
        alertMessage("Account created successfully! Logging you in...", "success");

        // Automatically log in the user after successful signup
        setTimeout(async () => {
            try {
                const loginCreds = {
                    email: userData.email,
                    password: userData.password
                };
                await login(loginCreds, window.location.pathname);
            } catch (loginError) {
                alertMessage("Account created but auto-login failed. Please log in manually.", "error");
            }
        }, 1000); // Small delay to show the success message

        return result;
    } catch (err) {
        alertMessage(err.message || "Signup failed");
        throw err;
    }
}
// Check if token is valid or not
export function isTokenValid(token) {
    // First, check if the token is actually present
    if (token && typeof token === "string" && token.split(".").length === 3) {
        try {
            const decoded = jwtDecode(token);
            let currentDate = new Date();
            if (decoded.exp * 1000 < currentDate.getTime()) {
                return false;
            } else {
                return true;
            }
        } catch (e) {
            return false;
        }
    } else {
        // No token or not in JWT format
        return false;
    }
}

// Logout function to clear the token and user data
export function logout() {
    // Remove auth token
    localStorage.removeItem(tokenKey);

    // Also remove current user data to ensure clean logout
    localStorage.removeItem('currentUser');

    console.log("User logged out");

    // Instead of redirecting, refresh the auth state on current page, allowing the user to stay on the same page
    if (typeof window.updateAuthState === 'function') {
        window.updateAuthState();
    } else {
        // Reload the page to refresh auth state
        window.location.reload();
    }
}
