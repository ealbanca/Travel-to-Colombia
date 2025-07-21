export async function loadHeaderFooter() {
    // header template will still be a function! But one where we have pre-supplied the argument.
    // headerTemplate and footerTemplate will be almost identical, but they will remember the path we passed in when we created them
    // why is it important that they stay functions?  The renderWithTemplate function is expecting a template function...if we sent it a string it would break, if we changed it to expect a string then it would become less flexible.
    const headerTemplateFn = loadTemplate("/partials/header.html");
    const footerTemplateFn = loadTemplate("/partials/footer.html");
    const headerEl = document.querySelector("#main-header");
    const footerEl = document.querySelector("#main-footer");
    await renderWithTemplate(headerTemplateFn, headerEl);
    await renderWithTemplate(footerTemplateFn, footerEl);
}