import { getPackageById } from "./externalServices.mjs";
import { getParam, loadHeaderFooter } from "./utils.mjs";

// Load header and footer
loadHeaderFooter().catch(error => {
    console.error('Error loading header/footer:', error);
});

// Get URL parameters
const packageId = getParam("package");
const city = getParam("city");

// Helper function to capitalize city name
function capitalizeCity(cityName) {
    return cityName.charAt(0).toUpperCase() + cityName.slice(1);
}

// Helper function to create error message template
function createErrorMessage(title, message, backLink, backText) {
    return `
        <div class="error-message">
            <h2>${title}</h2>
            <p>${message}</p>
            <a href="${backLink}" class="btn-primary">${backText}</a>
        </div>
    `;
}

// Package detail template
function packageDetailTemplate(travelPackage) {
    // Detect if we're in a subdirectory and adjust image path accordingly
    const isInSubfolder = window.location.pathname.includes('/package_pages/') ||
        window.location.pathname.includes('/package_list/');
    const imagePath = isInSubfolder ? `../public/images/${travelPackage.image}` : `./public/images/${travelPackage.image}`;

    return `
        <div class="package-detail-hero">
            <img src="${imagePath}" alt="${travelPackage.title}" class="package-detail-image">
            <div class="package-detail-overlay">
                <h1 class="package-detail-title">${travelPackage.title}</h1>
                <p class="package-detail-price">From $${travelPackage.price} ${travelPackage.currency}</p>
            </div>
        </div>
        
        <div class="package-detail-content">
            <div class="package-detail-info">
                <div class="package-detail-duration">
                    <strong>Duration:</strong> ${travelPackage.duration}
                </div>
                
                <div class="package-detail-description">
                    <p>${travelPackage.description}</p>
                </div>
                
                <div class="package-detail-highlights">
                    <h3>Package Highlights</h3>
                    <ul>
                        ${travelPackage.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="package-detail-includes">
                    <h3>What's Included</h3>
                    <ul>
                        ${travelPackage.includes.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="package-detail-actions">
                    <button class="btn-primary" onclick="bookPackage('${travelPackage.id}')">
                        Book Now - $${travelPackage.price} ${travelPackage.currency}
                    </button>
                    <a href="../package_list/index.html?city=${city}" class="btn-secondary">
                        Back to ${capitalizeCity(city)} Packages
                    </a>
                </div>
            </div>
        </div>
    `;
}

// Function to load and display package details
async function loadPackageDetail() {
    const container = document.querySelector('.package-detail-container');

    try {
        if (!packageId || !city) {
            container.innerHTML = createErrorMessage(
                "Package Not Found",
                "Sorry, the requested package could not be found.",
                "../index.html",
                "Back to Home"
            );
            return;
        }

        const travelPackage = await getPackageById(city, packageId);

        if (!travelPackage) {
            container.innerHTML = createErrorMessage(
                "Package Not Found",
                "Sorry, the requested package could not be found.",
                `../package_list/index.html?city=${city}`,
                `Back to ${capitalizeCity(city)} Packages`
            );
            return;
        }

        // Update page title
        document.title = `${travelPackage.title} - Travel to Colombia`;

        // Render package details
        container.innerHTML = packageDetailTemplate(travelPackage);

    } catch (error) {
        console.error('Error loading package details:', error);
        container.innerHTML = createErrorMessage(
            "Error Loading Package",
            "There was an error loading the package details. Please try again later.",
            `../package_list/index.html?city=${city}`,
            "Back to Packages"
        );
    }
}

// Function to handle booking - add package to cart
window.bookPackage = async function (packageId) {
    try {
        const travelPackage = await getPackageById(city, packageId);
        if (!travelPackage) {
            alert('Error: Package not found. Please try again.');
            return;
        }

        const success = window.addPackageToCart(travelPackage, city);
        if (!success) {
            alert('Error adding package to cart. Please try again.');
        }
    } catch (error) {
        console.error('Error adding package to cart:', error);
        alert('Error adding package to cart. Please try again.');
    }
};

// Load package details when page loads
loadPackageDetail();
