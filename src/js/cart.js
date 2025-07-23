// Cart management functions
class Cart {
    constructor() {
        this.storageKey = 'travelColombiaCart';
    }

    // Get cart items from local storage
    getCartItems() {
        const cartData = localStorage.getItem(this.storageKey);
        return cartData ? JSON.parse(cartData) : [];
    }

    // Save cart items to local storage
    saveCartItems(items) {
        localStorage.setItem(this.storageKey, JSON.stringify(items));
    }

    // Add item to cart
    addToCart(packageData) {
        const cartItems = this.getCartItems();

        // Check if item already exists in cart
        const existingItemIndex = cartItems.findIndex(item => item.id === packageData.id);

        if (existingItemIndex > -1) {
            // Item already exists, increase quantity
            cartItems[existingItemIndex].quantity += 1;
        } else {
            // Add new item with quantity 1
            const cartItem = {
                ...packageData,
                quantity: 1,
                addedAt: new Date().toISOString()
            };
            cartItems.push(cartItem);
        }

        this.saveCartItems(cartItems);
        this.updateCartCount();
        return true;
    }

    // Remove item from cart
    removeFromCart(packageId) {
        const cartItems = this.getCartItems();
        const filteredItems = cartItems.filter(item => item.id !== packageId);
        this.saveCartItems(filteredItems);
        this.updateCartCount();
    }

    // Update quantity of item in cart
    updateQuantity(packageId, newQuantity) {
        const cartItems = this.getCartItems();
        const itemIndex = cartItems.findIndex(item => item.id === packageId);

        if (itemIndex > -1) {
            if (newQuantity <= 0) {
                this.removeFromCart(packageId);
            } else {
                cartItems[itemIndex].quantity = parseInt(newQuantity);
                this.saveCartItems(cartItems);
                this.updateCartCount();
            }
        }
    }

    // Get total number of items in cart
    getCartCount() {
        const cartItems = this.getCartItems();
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    }

    // Get total price of cart
    getCartTotal() {
        const cartItems = this.getCartItems();
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Clear entire cart
    clearCart() {
        localStorage.removeItem(this.storageKey);
        this.updateCartCount();
    }

    // Update cart count display in header
    updateCartCount() {
        const count = this.getCartCount();
        const cartLinks = document.querySelectorAll('a[href*="cart"]');

        cartLinks.forEach(cartLink => {
            // Remove existing badge if any
            const existingBadge = cartLink.querySelector('.cart-badge');
            if (existingBadge) {
                existingBadge.remove();
            }

            // Add badge if count > 0
            if (count > 0) {
                const badge = document.createElement('span');
                badge.className = 'cart-badge';
                badge.textContent = count;
                badge.style.cssText = `
                    background-color: #FFD700;
                    color: #006994;
                    border-radius: 50%;
                    padding: 2px 6px;
                    font-size: 12px;
                    font-weight: bold;
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    min-width: 18px;
                    text-align: center;
                `;

                // Make cart link position relative to position the badge
                cartLink.style.position = 'relative';
                cartLink.appendChild(badge);
            }
        });
    }
}

// Create global cart instance
const cart = new Cart();

// Function to add package to cart (called from book now button)
function addPackageToCart(packageData, city) {
    // Add city information to package data
    const packageWithCity = {
        ...packageData,
        city: city
    };

    const success = cart.addToCart(packageWithCity);

    if (success) {
        // Show success message
        showCartNotification(`${packageData.title} has been added to your cart!`, 'success');
        return true;
    }
    return false;
}

// Function to show cart notifications
function showCartNotification(message, type = 'success') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.cart-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `cart-notification cart-notification-${type}`;
    notification.textContent = message;

    // Styles for notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-weight: 500;
        max-width: 300px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Cart page rendering functions
function renderCartPage() {
    const cartItems = cart.getCartItems();
    const cartContainer = document.querySelector('.cart-items');

    if (!cartContainer) {
        console.error('Cart container not found');
        return;
    }

    if (cartItems.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <h3>Your cart is empty</h3>
                <p>Browse our amazing travel packages and start planning your Colombian adventure!</p>
                <a href="../index.html" class="btn-primary">Browse Packages</a>
            </div>
        `;
        return;
    }

    const cartHTML = cartItems.map(item => createCartItemHTML(item)).join('');
    const cartTotal = cart.getCartTotal();

    cartContainer.innerHTML = `
        ${cartHTML}
        <div class="cart-summary">
            <div class="cart-total">
                <h3>Total: $${cartTotal.toFixed(2)} USD</h3>
            </div>
            <div class="cart-actions">
                <button class="btn-secondary" onclick="clearCartConfirm()">Clear Cart</button>
                <button class="btn-primary" onclick="proceedToCheckout()">Proceed to Checkout</button>
            </div>
        </div>
    `;

    // Update cart count in header
    cart.updateCartCount();
}

// Create HTML for individual cart item
function createCartItemHTML(item) {
    // Detect if we're in a subdirectory and adjust image path accordingly
    const isInSubfolder = window.location.pathname.includes('/cart/');
    const imagePath = isInSubfolder ? `../public/images/${item.image}` : `./public/images/${item.image}`;

    return `
        <li class="cart-item" data-package-id="${item.id}">
            <div class="cart-item-image">
                <img src="${imagePath}" alt="${item.title}">
            </div>
            <div class="cart-item-details">
                <h3>${item.title}</h3>
                <p class="cart-item-city">${item.city.charAt(0).toUpperCase() + item.city.slice(1)}</p>
                <p class="cart-item-duration">${item.duration}</p>
                <p class="cart-item-description">${item.description}</p>
            </div>
            <div class="cart-item-quantity">
                <label for="quantity-${item.id}">Quantity:</label>
                <input 
                    type="number" 
                    id="quantity-${item.id}" 
                    min="1" 
                    value="${item.quantity}" 
                    onchange="updateCartQuantity('${item.id}', this.value)"
                >
            </div>
            <div class="cart-item-price">
                <p class="item-price">$${item.price} USD</p>
                <p class="item-total">Total: $${(item.price * item.quantity).toFixed(2)} USD</p>
            </div>
            <div class="cart-item-actions">
                <button class="btn-remove" onclick="removeFromCartConfirm('${item.id}', '${item.title}')">
                    Remove
                </button>
            </div>
        </li>
    `;
}

// Global functions for cart operations (accessible from HTML)
window.updateCartQuantity = function (packageId, newQuantity) {
    cart.updateQuantity(packageId, newQuantity);
    renderCartPage(); // Re-render to update totals
};

window.removeFromCartConfirm = function (packageId, packageTitle) {
    if (confirm(`Are you sure you want to remove "${packageTitle}" from your cart?`)) {
        cart.removeFromCart(packageId);
        renderCartPage(); // Re-render cart
        showCartNotification(`${packageTitle} has been removed from your cart.`, 'success');
    }
};

window.clearCartConfirm = function () {
    if (confirm('Are you sure you want to clear your entire cart?')) {
        cart.clearCart();
        renderCartPage(); // Re-render cart
        showCartNotification('Your cart has been cleared.', 'success');
    }
};

window.proceedToCheckout = function () {
    const cartItems = cart.getCartItems();
    if (cartItems.length === 0) {
        alert('Your cart is empty. Please add some packages before proceeding to checkout.');
        return;
    }

    // For now, just show an alert. In a real app, this would redirect to checkout
    alert('Proceeding to checkout... This feature will be implemented in the next phase.');
};

// Initialize cart count when page loads
document.addEventListener('DOMContentLoaded', function () {
    cart.updateCartCount();

    // If we're on the cart page, render the cart
    if (window.location.pathname.includes('/cart/')) {
        // Load header and footer first, then render cart
        import('./utils.mjs').then(({ loadHeaderFooter }) => {
            loadHeaderFooter().then(() => {
                renderCartPage();
            });
        });
    }
});

// Make functions globally accessible
window.addPackageToCart = addPackageToCart;
window.renderCartPage = renderCartPage;
window.cart = cart;

// Initialize cart count when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    cart.updateCartCount();
});

// Also initialize when header is loaded (for pages that load header dynamically)
document.addEventListener('headerLoaded', () => {
    cart.updateCartCount();
});
