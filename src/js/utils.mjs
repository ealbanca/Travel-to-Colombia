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

// Function to load a templates (header and footer)
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

// Function to load header and footer templates
export async function loadHeaderFooter() {
    console.log('loadHeaderFooter - Current path:', window.location.pathname);

    // Detect if we're in a subdirectory and adjust paths accordingly
    const isInSubfolder = window.location.pathname.includes('/package_pages/') ||
        window.location.pathname.includes('/package_list/') ||
        window.location.pathname.includes('/cart/') ||
        window.location.pathname.includes('/checkout/') ||
        window.location.pathname.includes('/contact/') ||
        window.location.pathname.includes('/thankyou/') ||
        window.location.pathname.includes('/orders/') ||
        window.location.pathname.includes('/login/');

    const basePath = isInSubfolder ? '../' : './';
    console.log('loadHeaderFooter - Is in subfolder:', isInSubfolder);
    console.log('loadHeaderFooter - Base path:', basePath);

    // Relative paths that work from the HTML file location
    const headerPath = `${basePath}public/partials/header.html`;
    const footerPath = `${basePath}public/partials/footer.html`;
    console.log('loadHeaderFooter - Header path:', headerPath);
    console.log('loadHeaderFooter - Footer path:', footerPath);
    
    const headerTemplateFn = loadTemplate(headerPath);
    const footerTemplateFn = loadTemplate(footerPath);
    const headerEl = document.querySelector("#main-header");
    const footerEl = document.querySelector("#main-footer");

    console.log('loadHeaderFooter - Header element found:', !!headerEl);
    console.log('loadHeaderFooter - Footer element found:', !!footerEl);

    try {
        // Load templates 
        console.log('loadHeaderFooter - Loading header template...');
        const headerTemplate = await headerTemplateFn();
        console.log('loadHeaderFooter - Header template loaded:', !!headerTemplate);
        
        console.log('loadHeaderFooter - Loading footer template...');
        const footerTemplate = await footerTemplateFn();
        console.log('loadHeaderFooter - Footer template loaded:', !!footerTemplate);

        // Insert the templates with dynamic path replacement
        if (headerEl && headerTemplate) {
            console.log('loadHeaderFooter - Inserting header template...');
            const processedHeaderTemplate = headerTemplate.replace(/\{\{basePath\}\}/g, basePath);
            headerEl.innerHTML = processedHeaderTemplate;
            console.log('loadHeaderFooter - Header template inserted');
            // Dispatch event to notify that header is loaded
            document.dispatchEvent(new CustomEvent('headerLoaded'));
            // Initialize auth state after header is loaded
            initializeAuthState();
        } else {
            console.error('loadHeaderFooter - Header element or template missing');
        }

        if (footerEl && footerTemplate) {
            console.log('loadHeaderFooter - Inserting footer template...');
            const processedFooterTemplate = footerTemplate.replace(/\{\{basePath\}\}/g, basePath);
            footerEl.innerHTML = processedFooterTemplate;
            console.log('loadHeaderFooter - Footer template inserted');
        } else {
            console.error('loadHeaderFooter - Footer element or template missing');
        }
    } catch (error) {
        console.error('loadHeaderFooter - Error loading templates:', error);
        throw error;
    }

    // Set up footer copyright information
    setupFooter();

    // Initialize cart count display after header is loaded
    initializeCartCount();
    
    // Ensure auth modal exists on the page FIRST
    ensureAuthModal();
    
    // Initialize auth state and modal functionality with a delay to ensure DOM is ready
    setTimeout(() => {
        console.log('Initializing auth state...');
        initializeAuthState();
    }, 200); // Increased delay to ensure everything is loaded
}

// Function to initialize cart count display
function initializeCartCount() {
    // Wait a bit for the header to be fully rendered and cart.js to be loaded
    setTimeout(() => {
        if (typeof cart !== 'undefined' && cart.updateCartCount) {
            cart.updateCartCount();
        }
    }, 100);
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

// Local Storage functions
export function setLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

export function getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

// Alert message function
export function alertMessage(message, type = "error") {
    const alertContainer = document.getElementById("alertContainer") || document.body;
    
    // Remove existing alerts
    const existingAlerts = alertContainer.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Create new alert
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${type}`;
    alertDiv.textContent = message;
    alertDiv.style.display = 'block';
    
    if (document.getElementById("alertContainer")) {
        alertContainer.appendChild(alertDiv);
    } else {
        // If no alert container, show as a temporary overlay
        alertDiv.style.position = 'fixed';
        alertDiv.style.top = '20px';
        alertDiv.style.left = '50%';
        alertDiv.style.transform = 'translateX(-50%)';
        alertDiv.style.zIndex = '9999';
        alertDiv.style.padding = '10px 20px';
        alertDiv.style.borderRadius = '5px';
        alertDiv.style.minWidth = '200px';
        alertDiv.style.textAlign = 'center';
        
        if (type === 'error') {
            alertDiv.style.backgroundColor = '#f8d7da';
            alertDiv.style.color = '#721c24';
            alertDiv.style.border = '1px solid #f5c6cb';
        } else if (type === 'success') {
            alertDiv.style.backgroundColor = '#d4edda';
            alertDiv.style.color = '#155724';
            alertDiv.style.border = '1px solid #c3e6cb';
        }
        
        document.body.appendChild(alertDiv);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.parentNode.removeChild(alertDiv);
            }
        }, 3000);
    }
}

// Initialize authentication state in header
function initializeAuthState() {
    const token = getLocalStorage('so_token');
    const loginLink = document.getElementById('loginLink');
    const userMenu = document.getElementById('userMenu');
    const userGreeting = document.getElementById('userGreeting');
    const logoutLink = document.getElementById('logoutLink');
    
    if (token && isTokenValid(token)) {
        // User is logged in
        if (loginLink) loginLink.style.display = 'none';
        if (userMenu) userMenu.style.display = 'block';
        
        // Try to get user info from token
        try {
            const decoded = jwtDecode(token);
            const userName = decoded.name || decoded.email || 'User';
            if (userGreeting) userGreeting.textContent = `Welcome, ${userName}!`;
        } catch (e) {
            if (userGreeting) userGreeting.textContent = 'Welcome, User!';
        }
        
        // Add logout functionality
        if (logoutLink) {
            logoutLink.addEventListener('click', async (e) => {
                e.preventDefault();
                // Import logout function dynamically to avoid circular imports
                const { logout } = await import('./auth.mjs');
                logout();
            });
        }
    } else {
        // User is not logged in
        if (loginLink) loginLink.style.display = 'block';
        if (userMenu) userMenu.style.display = 'none';
        
        // Add login modal functionality
        if (loginLink) {
            loginLink.addEventListener('click', (e) => {
                e.preventDefault();
                openLoginModal();
            });
        }
    }
    
    // Initialize modal functionality - ensure this happens after modal exists
    setTimeout(() => {
        initializeLoginModal();
    }, 50);
}

// Helper function to validate JWT token
function isTokenValid(token) {
    if (token && typeof token === "string" && token.split(".").length === 3) {
        try {
            // Import jwtDecode dynamically to avoid issues
            import('https://cdn.jsdelivr.net/npm/jwt-decode@4.0.0/build/esm/index.js')
                .then(module => {
                    const { jwtDecode } = module;
                    const decoded = jwtDecode(token);
                    let currentDate = new Date();
                    return decoded.exp * 1000 > currentDate.getTime();
                })
                .catch(() => false);
            return true; // Basic validation passed
        } catch (e) {
            return false;
        }
    }
    return false;
}

// Modal functionality
export function openLoginModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.style.display = 'block';
        // Clear any existing alerts
        clearModalAlerts();
    }
}

export function closeLoginModal() {
    console.log('Closing login modal...');
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.style.display = 'none';
        // Clear forms
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        if (loginForm) loginForm.reset();
        if (signupForm) signupForm.reset();
        clearModalAlerts();
        console.log('Modal closed successfully');
    } else {
        console.error('Modal not found when trying to close!');
    }
}

function initializeLoginModal() {
    const modal = document.getElementById('authModal');
    
    console.log('Initializing login modal...', modal ? 'Modal found' : 'Modal NOT found');
    
    if (!modal) {
        console.error('Auth modal not found! Creating it now...');
        ensureAuthModal();
        // Try again after a short delay
        setTimeout(() => {
            initializeLoginModal();
        }, 100);
        return;
    }
    
    const closeBtn = modal.querySelector('.close');
    const authTabs = modal.querySelectorAll('.auth-tab');
    const authForms = modal.querySelectorAll('.auth-form');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    console.log('Modal elements found:', {
        closeBtn: !!closeBtn,
        authTabs: authTabs.length,
        authForms: authForms.length,
        loginForm: !!loginForm,
        signupForm: !!signupForm
    });
    
    // Close modal functionality
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            console.log('Close button clicked');
            closeLoginModal();
        });
    } else {
        console.error('Close button not found!');
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeLoginModal();
        }
    });
    
    // Tab switching functionality
    authTabs.forEach((tab, index) => {
        tab.addEventListener('click', (e) => {
            console.log(`Tab ${index} clicked:`, tab.getAttribute('data-tab'));
            const targetTab = tab.getAttribute('data-tab');
            
            // Remove active class from all tabs and forms
            authTabs.forEach(t => t.classList.remove('active'));
            authForms.forEach(f => f.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Show corresponding form
            const targetForm = document.getElementById(`${targetTab}Form`);
            if (targetForm) {
                targetForm.classList.add('active');
                console.log(`Switched to ${targetTab} form`);
            } else {
                console.error(`Target form not found: ${targetTab}Form`);
            }
            
            // Clear any existing alerts
            clearModalAlerts();
        });
    });
    
    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Login form submitted');
            clearModalAlerts();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            console.log('Login attempt with email:', email);
            
            if (!email || !password) {
                showModalAlert('Please fill in all fields', 'error');
                return;
            }
            
            const creds = { email, password };
            
            try {
                // Import login function dynamically to avoid circular imports
                const { login } = await import('./auth.mjs');
                await login(creds, window.location.pathname);
            } catch (error) {
                console.error('Login error:', error);
                showModalAlert(error.message || 'Login failed', 'error');
            }
        });
    } else {
        console.error('Login form not found!');
    }
    
    // Signup form submission
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Signup form submitted');
            clearModalAlerts();
            
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            console.log('Signup attempt with:', { name, email, passwordLength: password.length });
            
            // Validation
            if (!name || !email || !password || !confirmPassword) {
                showModalAlert('Please fill in all fields', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showModalAlert('Passwords do not match', 'error');
                return;
            }
            
            if (password.length < 6) {
                showModalAlert('Password must be at least 6 characters long', 'error');
                return;
            }
            
            const userData = { name, email, password };
            
            try {
                // Import signup function dynamically to avoid circular imports
                const { signup } = await import('./auth.mjs');
                await signup(userData);
                // Clear signup form
                signupForm.reset();
                showModalAlert('Account created successfully! Logging you in...', 'success');
                
                // The signup function will handle auto-login, so we just wait and close modal
                setTimeout(() => {
                    closeLoginModal();
                }, 2000);
                
            } catch (error) {
                console.error('Signup error:', error);
                showModalAlert(error.message || 'Signup failed', 'error');
            }
        });
    } else {
        console.error('Signup form not found!');
    }
}

function showModalAlert(message, type = 'error') {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) return;
    
    clearModalAlerts();
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${type}`;
    alertDiv.textContent = message;
    alertDiv.style.display = 'block';
    
    alertContainer.appendChild(alertDiv);
}

function clearModalAlerts() {
    const alertContainer = document.getElementById('alertContainer');
    if (alertContainer) {
        alertContainer.innerHTML = '';
    }
}

// Ensure auth modal exists on page
function ensureAuthModal() {
    // Check if modal already exists
    if (document.getElementById('authModal')) {
        return;
    }
    
    // Create modal HTML
    const modalHTML = `
        <div id="authModal" class="modal" style="display: none;">
            <div class="modal-content">
                <span class="close">&times;</span>
                
                <div class="auth-tabs">
                    <button class="auth-tab active" data-tab="login">Login</button>
                    <button class="auth-tab" data-tab="signup">Sign Up</button>
                </div>

                <div id="alertContainer"></div>

                <!-- Login Form -->
                <form id="loginForm" class="auth-form active">
                    <div class="form-group">
                        <label for="loginEmail">Email:</label>
                        <input type="email" id="loginEmail" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="loginPassword">Password:</label>
                        <input type="password" id="loginPassword" name="password" required>
                    </div>
                    <button type="submit" class="auth-btn">Login</button>
                </form>

                <!-- Signup Form -->
                <form id="signupForm" class="auth-form">
                    <div class="form-group">
                        <label for="signupName">Full Name:</label>
                        <input type="text" id="signupName" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="signupEmail">Email:</label>
                        <input type="email" id="signupEmail" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="signupPassword">Password:</label>
                        <input type="password" id="signupPassword" name="password" required minlength="6">
                    </div>
                    <div class="form-group">
                        <label for="confirmPassword">Confirm Password:</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" required minlength="6">
                    </div>
                    <button type="submit" class="auth-btn">Sign Up</button>
                </form>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}