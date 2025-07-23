// Function to load local travel packages
export async function getTravelPackages(city) {
    try {
        // Detect if we're in a subdirectory and adjust path accordingly
        const isInSubfolder = window.location.pathname.includes('/package_list/') ||
            window.location.pathname.includes('/package_pages/');
        const basePath = isInSubfolder ? '../' : './';
        const jsonPath = `${basePath}public/json/${city.toLowerCase()}-packages.json`;

        const response = await fetch(jsonPath);

        if (!response.ok) {
            throw new Error(`Failed to load ${city} packages - Status: ${response.status}`);
        }
        const data = await response.json();
        return data.packages;
    } catch (error) {
        console.error(`Error loading ${city} packages:`, error);
        return [];
    }
}

// Function to get a specific package by ID
export async function getPackageById(city, packageId) {
    try {
        const packages = await getTravelPackages(city);
        const travelPackage = packages.find(pkg => pkg.id === packageId);
        if (!travelPackage) {
            throw new Error(`Package ${packageId} not found`);
        }
        return travelPackage;
    } catch (error) {
        console.error(`Error loading package ${packageId}:`, error);
        return null;
    }
}

// Mock API base URL - replace with your actual API endpoint
const API_BASE_URL = "https://your-api-endpoint.com/api";

// Local storage keys for mock user system
const USERS_STORAGE_KEY = "travel_colombia_users";

// Helper functions for mock user system
function getStoredUsers() {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
}

function saveUser(userData) {
    const users = getStoredUsers();
    const newUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email.toLowerCase(),
        password: userData.password, // In real app, this would be hashed
        createdAt: new Date().toISOString()
    };
    
    // Check if user already exists
    if (users.some(user => user.email === newUser.email)) {
        throw new Error("User with this email already exists");
    }
    
    users.push(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    return newUser;
}

function findUser(email, password) {
    const users = getStoredUsers();
    return users.find(user => 
        user.email === email.toLowerCase() && 
        user.password === password
    );
}

function generateMockJWT(user) {
    // Create a mock JWT with user info
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(JSON.stringify({
        sub: user.id,
        name: user.name,
        email: user.email,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours from now
    }));
    const signature = "mock_signature_" + Date.now();
    
    return `${header}.${payload}.${signature}`;
}

// Authentication functions
export async function loginRequest(credentials) {
    try {
        // For development - mock login with stored users
        const user = findUser(credentials.email, credentials.password);
        
        if (user) {
            const token = generateMockJWT(user);
            console.log("Login successful for:", user.email);
            return Promise.resolve(token);
        } else {
            throw new Error("Invalid email or password");
        }
        
        // Uncomment below for actual API integration:
        /*
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Login failed");
        }

        const data = await response.json();
        return data.token;
        */
    } catch (error) {
        console.error("Login request failed:", error);
        throw error;
    }
}

export async function signupRequest(userData) {
    try {
        // For development - mock signup with local storage
        const newUser = saveUser(userData);
        console.log("User created successfully:", newUser.email);
        return Promise.resolve({ 
            message: "User created successfully",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            }
        });
        
        // Uncomment below for actual API integration:
        /*
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Signup failed");
        }

        const data = await response.json();
        return data;
        */
    } catch (error) {
        console.error("Signup request failed:", error);
        throw error;
    }
}

// Debug function to view stored users (for development only)
export function getStoredUsersDebug() {
    return getStoredUsers();
}

// Function to clear all stored users (for development only)
export function clearStoredUsers() {
    localStorage.removeItem(USERS_STORAGE_KEY);
    console.log("All stored users cleared");
}

// Function to clear user data on logout (if specifically requested)
export function clearUserDataOnLogout() {
    localStorage.removeItem(USERS_STORAGE_KEY);
    localStorage.removeItem("so_token");
    console.log("All user data and tokens cleared");
}