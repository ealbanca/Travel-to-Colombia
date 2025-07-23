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
    // wait what?  we are returning a new function? this is called currying and can be very helpful.
    return async function () {
        const res = await fetch(path);
        if (res.ok) {
            const html = await res.text();
            return html;
        }
    };
}

export async function loadHeaderFooter() {
    // Detect if we're in a subdirectory by checking the current path
    const isInSubfolder = window.location.pathname.includes('/package_list/') || 
                         window.location.pathname.includes('/package_pages/');
    const basePath = isInSubfolder ? '../' : './';
    
    console.log('loadHeaderFooter - Current path:', window.location.pathname);
    console.log('loadHeaderFooter - Is in subfolder:', isInSubfolder);
    console.log('loadHeaderFooter - Base path:', basePath);

    // header template will still be a function! But one where we have pre-supplied the argument.
    const headerTemplateFn = loadTemplate(`${basePath}public/partials/header.html`);
    const footerTemplateFn = loadTemplate(`${basePath}public/partials/footer.html`);
    const headerEl = document.querySelector("#main-header");
    const footerEl = document.querySelector("#main-footer");

    // Load and adjust paths in templates
    const headerTemplate = await headerTemplateFn();
    const footerTemplate = await footerTemplateFn();

    // Fix image and link paths for subfolders
    const fixedHeaderTemplate = isInSubfolder ?
        headerTemplate
            .replace(/src="\.\/public\/images\//g, 'src="../public/images/')
            .replace(/href="\.\/index\.html"/g, 'href="../index.html"')
            .replace(/href="\.\/contact\.html"/g, 'href="../contact.html"')
            .replace(/href="\.\/cart\.html"/g, 'href="../cart.html"')
            .replace(/href="package_list\/index\.html"/g, function(match) {
                // If we're in package_pages, go to ../package_list/index.html
                // If we're in package_list, go to ./index.html
                return window.location.pathname.includes('/package_pages/') ? 
                    'href="../package_list/index.html' : 'href="./index.html';
            })
            .replace(/href="package_list\/index\.html\?city=/g, function(match) {
                return window.location.pathname.includes('/package_pages/') ? 
                    'href="../package_list/index.html?city=' : 'href="./index.html?city=';
            })
        : headerTemplate;

    const fixedFooterTemplate = isInSubfolder ?
        footerTemplate.replace(/src="public\/images\//g, 'src="../public/images/')
        : footerTemplate;

    // Insert the fixed templates
    headerEl.innerHTML = fixedHeaderTemplate;
    footerEl.innerHTML = fixedFooterTemplate;
    
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