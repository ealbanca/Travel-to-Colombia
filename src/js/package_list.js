import packageList from "./packageList.mjs";
import { getParam, loadHeaderFooter } from "./utils.mjs";

// Load header and footer
loadHeaderFooter();
const city = getParam("city");
console.log('City from URL parameter:', city);
// If city parameter is present, load packages for that city
if (city) {
    console.log('Loading packages for city:', city);
    packageList(".package-grid", city);
} else {
    console.error('No city parameter found in URL');
    document.querySelector(".title").innerHTML = "No City Selected";
}