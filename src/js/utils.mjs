export async function renderWithTemplate(
    templateFn,
    parentElement,
    data,
    callback,
    position = "afterbegin",
    clear = true,
) {
    if (clear) {
        parentElement.innerHTML = "";
    }
    const htmlString = await templateFn(data);
    parentElement.insertAdjacentHTML(position, htmlString);
    if (callback) {
        callback(data);
    }
}

function loadTemplate(path) {
    return async function () {
        const res = await fetch(path);
        if (res.ok) {
            const html = await res.text();
            return html;
        } else {
            console.error(`Failed to load template: ${path}`, res.status, res.statusText);
            return '';
        }
    };
}

export async function loadHeaderFooter() {
    console.log('loadHeaderFooter - Current path:', window.location.pathname);

    // Detect if we're in a subdirectory and adjust paths accordingly
    const isInSubfolder = window.location.pathname.includes('/package_pages/') ||
        window.location.pathname.includes('/package_list/') ||
        window.location.pathname.includes('/cart/') ||
        window.location.pathname.includes('/checkout/');

    const basePath = isInSubfolder ? '../' : './';

    // Use relative paths that work from the HTML file location
    const headerTemplateFn = loadTemplate(`${basePath}public/partials/header.html`);
    const footerTemplateFn = loadTemplate(`${basePath}public/partials/footer.html`);
    const headerEl = document.querySelector("#main-header");
    const footerEl = document.querySelector("#main-footer");

    // Load templates (they already use absolute paths, so no path fixing needed)
    const headerTemplate = await headerTemplateFn();
    const footerTemplate = await footerTemplateFn();

    // Insert the templates using absolute paths from root
    if (headerEl && headerTemplate) {
        headerEl.innerHTML = headerTemplate;
    } else {
        console.error('Header element not found or template failed to load');
    }

    if (footerEl && footerTemplate) {
        footerEl.innerHTML = footerTemplate;
    } else {
        console.error('Footer element not found or template failed to load');
    }

    // Set up footer copyright information
    setupFooter();
}

// Function to set up footer copyright information
export function setupFooter() {
    const d = new Date();
    let year = d.getFullYear();
    const currentYearElement = document.getElementById("currentYear");
    if (currentYearElement) {
        currentYearElement.innerHTML = "<br><br>" + "Hared Albancando Robles<br><br>Final Project WDD 330<br><br>" + year + " &copy;";
    }
}// Function to get URL parameters
export function getParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Function for rendering lists with templates
export function renderListWithTemplate(templateFn, parentElement, list, position = "afterbegin", clear = true) {
    if (clear) {
        parentElement.innerHTML = "";
    }
    const htmlStrings = list.map(templateFn);
    parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}