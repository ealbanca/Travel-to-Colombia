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