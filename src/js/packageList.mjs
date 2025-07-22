import { getTravelPackages } from "./externalServices.mjs";
import { renderListWithTemplate } from "./utils.mjs";

function packageCardTemplate(travelPackage) {
    // Detect if we're in a subdirectory and adjust image path accordingly
    const isInSubfolder = window.location.pathname.includes('/package_list/');
    const imagePath = isInSubfolder ? `../public/images/${travelPackage.image}` : `./public/images/${travelPackage.image}`;
    
    return `<li class="package-card">
    <a href="/package_details/index.html?package=${travelPackage.id}">
    <img
      src="${imagePath}"
      alt="${travelPackage.title}"
    />
    <div class="package-info">
        <h3 class="package__title">${travelPackage.title}</h3>
        <p class="package__duration">${travelPackage.duration}</p>
        <p class="package__description">${travelPackage.description}</p>
        <div class="package__highlights">
            <h4>Highlights:</h4>
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
    console.log(packages);
    // render out the package list to the element
    renderListWithTemplate(packageCardTemplate, el, packages);
    document.querySelector(".title").innerHTML = `${city.charAt(0).toUpperCase() + city.slice(1)} Travel Packages`;
}

// Get the city from the URL
const params = new URLSearchParams(window.location.search);
const city = params.get("city");

// Only run if city exists
if (city) {
    // Call packageList with the selector for your package grid and the city
    packageList(".package-grid", city);
}