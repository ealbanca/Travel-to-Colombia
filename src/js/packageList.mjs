import { getTravelPackages } from "./externalServices.mjs";
import { renderListWithTemplate, getParam } from "./utils.mjs";

// Helper function to capitalize city name
function capitalizeCity(cityName) {
    return cityName.charAt(0).toUpperCase() + cityName.slice(1);
}

function packageCardTemplate(travelPackage) {
    // Detect if we're in a subdirectory and adjust image path accordingly
    const isInSubfolder = window.location.pathname.includes('/package_list/');
    const imagePath = isInSubfolder ? `../public/images/${travelPackage.image}` : `./public/images/${travelPackage.image}`;

    // Get the current city from URL parameters for the detail page link
    const currentCity = getParam('city');

    const detailUrl = `../package_pages/index.html?package=${travelPackage.id}&city=${currentCity}`;

    return `<li class="package-card">
    <a href="${detailUrl}">
    <img
      src="${imagePath}"
      alt="${travelPackage.title}"
    />
    <div class="package-info">
        <h3 class="package__title">${travelPackage.title}</h3>
        <p class="package__duration">${travelPackage.duration}</p>
        <p class="package__description">${travelPackage.description}</p>
        <div class="package__highlights">
            <ul>
                ${travelPackage.highlights.slice(0, 3).map(highlight => `<li>${highlight}</li>`).join('')}
            </ul>
        </div>
        <p class="package__price">From $${travelPackage.price} ${travelPackage.currency}</p>
    </div>
    </a>
  </li>`;
}

export default async function packageList(selector, city) {
    // get the element we will insert the list into from the selector
    const el = document.querySelector(selector);
    // get the list of packages
    const packages = await getTravelPackages(city);

    // render out the package list to the element
    renderListWithTemplate(packageCardTemplate, el, packages);
    
    const capitalizedCity = capitalizeCity(city);
    document.querySelector(".title").innerHTML = `${capitalizedCity} Travel Packages`;

    // Update the page title with the city name
    document.title = `${capitalizedCity} Travel Packages - Travel to Colombia`;
}