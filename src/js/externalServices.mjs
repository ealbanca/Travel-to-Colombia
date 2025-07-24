// Function to load travel packages from local JSON files
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

// Function to get a package by ID
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

// Local storage keys
const USERS_STORAGE_KEY = "travel_colombia_users";

// Function to get stored users
function getStoredUsers() {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
}
// Function to save a new user
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
    } catch (error) {
        console.error("Signup request failed:", error);
        throw error;
    }
}
