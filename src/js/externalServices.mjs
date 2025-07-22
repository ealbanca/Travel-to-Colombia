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
        const response = await fetch(`./data/${city.toLowerCase()}-packages.json`);
        if (!response.ok) {
            throw new Error(`Failed to load ${city} packages`);
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