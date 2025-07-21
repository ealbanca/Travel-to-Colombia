import { loadHeaderFooter } from "./utils.mjs";

// Load header and footer first
loadHeaderFooter().then(() => {
    // After header and footer are loaded, set up the current year
    const d = new Date();
    let year = d.getFullYear();
    const currentYearElement = document.getElementById("currentYear");
    if (currentYearElement) {
        currentYearElement.innerHTML = "<br><br>" + "Hared Albancando Robles<br><br>Final Project WDD 330<br><br>" + year + " &copy;";
    }
});