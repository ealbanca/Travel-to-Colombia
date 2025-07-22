const baseURL =
    import.meta.env?.VITE_SERVER_URL || "https://your-fallback-url.com";
function convertToJson(res) {
    if (res.ok) {
        return res.json();
    } else {
        throw new Error("Bad Response");
    }
}

// Function to load local travel packages
export async function getTravelPackages(city) {
    try {
        // Detect if we're in a subdirectory and adjust path accordingly
        const isInSubfolder = window.location.pathname.includes('/package_list/');
        const basePath = isInSubfolder ? '../' : './';
        const jsonPath = `${basePath}public/json/${city.toLowerCase()}-packages.json`;
        
        console.log('Loading packages from:', jsonPath);
        console.log('Is in subfolder:', isInSubfolder);
        
        const response = await fetch(jsonPath);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`Failed to load ${city} packages - Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Loaded data:', data);
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