import { getPackageById } from "./externalServices.mjs";
import { getParam, loadHeaderFooter } from "./utils.mjs";

console.log('=== Package Detail Script Loading ===');

// Load header and footer
loadHeaderFooter().then(() => {
    console.log('Header and footer loaded successfully');
}).catch(error => {
    console.error('Error loading header/footer:', error);
});

// Get URL parameters
const packageId = getParam("package");
const city = getParam("city");

console.log('Package Detail Page Loaded');
console.log('Package ID:', packageId);
console.log('City:', city);
console.log('Current URL:', window.location.href);

// Package detail template
function packageDetailTemplate(travelPackage) {
    // Detect if we're in a subdirectory and adjust image path accordingly
    const isInSubfolder = window.location.pathname.includes('/package_pages/') || 
                         window.location.pathname.includes('/package_list/');
    const imagePath = isInSubfolder ? `../public/images/${travelPackage.image}` : `./public/images/${travelPackage.image}`;
    
    console.log('Template - image path:', imagePath);
    console.log('Template - travel package:', travelPackage);
    
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
                    <h2>About This Package</h2>
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
                        Back to ${city.charAt(0).toUpperCase() + city.slice(1)} Packages
                    </a>
                </div>
            </div>
        </div>
    `;
}

// Function to load and display package details
async function loadPackageDetail() {
    try {
        if (!packageId || !city) {
            document.querySelector('.package-detail-container').innerHTML = `
                <div class="error-message">
                    <h2>Package Not Found</h2>
                    <p>Sorry, the requested package could not be found.</p>
                    <a href="../index.html" class="btn-primary">Back to Home</a>
                </div>
            `;
            return;
        }

        console.log('Loading package:', packageId, 'from city:', city);
        
        const travelPackage = await getPackageById(city, packageId);
        
        if (!travelPackage) {
            document.querySelector('.package-detail-container').innerHTML = `
                <div class="error-message">
                    <h2>Package Not Found</h2>
                    <p>Sorry, the requested package could not be found.</p>
                    <a href="../package_list/index.html?city=${city}" class="btn-primary">Back to ${city.charAt(0).toUpperCase() + city.slice(1)} Packages</a>
                </div>
            `;
            return;
        }

        // Update page title
        document.title = `${travelPackage.title} - Travel to Colombia`;
        
        // Render package details
        const container = document.querySelector('.package-detail-container');
        container.innerHTML = packageDetailTemplate(travelPackage);
        
    } catch (error) {
        console.error('Error loading package details:', error);
        document.querySelector('.package-detail-container').innerHTML = `
            <div class="error-message">
                <h2>Error Loading Package</h2>
                <p>There was an error loading the package details. Please try again later.</p>
                <a href="../package_list/index.html?city=${city}" class="btn-primary">Back to Packages</a>
            </div>
        `;
    }
}

// Function to handle booking (placeholder)
window.bookPackage = function(packageId) {
    alert(`Booking package ${packageId}! This would redirect to a booking form.`);
    // Here you could redirect to a booking page:
    // window.location.href = `../booking/index.html?package=${packageId}&city=${city}`;
};

// Load package details when page loads
loadPackageDetail();
