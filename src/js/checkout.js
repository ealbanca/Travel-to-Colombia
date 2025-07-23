// Checkout functionality
class Checkout {
    constructor() {
        this.cart = new Cart();
        this.shippingRate = 0.10; // 10% shipping rate
        this.taxRate = 0.08; // 8% tax rate
    }

    // Calculate shipping cost
    calculateShipping(subtotal) {
        return subtotal * this.shippingRate;
    }

    // Calculate tax
    calculateTax(subtotal) {
        return subtotal * this.taxRate;
    }

    // Calculate total
    calculateTotal(subtotal, shipping, tax) {
        return subtotal + shipping + tax;
    }

    // Populate order summary
    populateOrderSummary() {
        const cartItems = this.cart.getCartItems();
        const itemCount = this.cart.getCartCount();
        const subtotal = this.cart.getCartTotal();
        const shipping = this.calculateShipping(subtotal);
        const tax = this.calculateTax(subtotal);
        const total = this.calculateTotal(subtotal, shipping, tax);

        // Update DOM elements
        const numItemsElement = document.getElementById('num-items');
        const cartTotalElement = document.getElementById('cartTotal');
        const shippingElement = document.getElementById('shipping');
        const taxElement = document.getElementById('tax');
        const orderTotalElement = document.getElementById('orderTotal');

        if (numItemsElement) numItemsElement.textContent = itemCount;
        if (cartTotalElement) cartTotalElement.textContent = `$${subtotal.toFixed(2)}`;
        if (shippingElement) shippingElement.textContent = `$${shipping.toFixed(2)}`;
        if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
        if (orderTotalElement) orderTotalElement.textContent = `$${total.toFixed(2)}`;
    }

    // Process checkout
    processCheckout(formData) {

        // Prepare customer information for order
        const customerInfo = {
            firstName: formData.fname,
            lastName: formData.lname,
            email: formData.email || 'guest@example.com',
            phone: formData.phone || '',
            address: {
                street: formData.street,
                city: formData.city,
                state: formData.state,
                zip: formData.zip
            }
        };

        // Create order using the order management system
        if (typeof createOrderFromCart === 'function') {
            const newOrder = createOrderFromCart(customerInfo);
            if (newOrder) {
                // Show success message and redirect
                this.showSuccessMessage(newOrder);
                return true;
            }
        } else {
            // Fallback to old method if order system not available
            const orderData = {
                id: this.generateOrderId(),
                customer: customerInfo,
                items: this.cart.getCartItems(),
                totals: {
                    subtotal: this.cart.getCartTotal(),
                    shipping: this.calculateShipping(this.cart.getCartTotal()),
                    tax: this.calculateTax(this.cart.getCartTotal()),
                    total: this.calculateTotal(
                        this.cart.getCartTotal(),
                        this.calculateShipping(this.cart.getCartTotal()),
                        this.calculateTax(this.cart.getCartTotal())
                    )
                },
                orderDate: new Date().toISOString()
            };

            // Save order to localStorage
            this.saveOrder(orderData);

            // Clear cart
            this.cart.clearCart();

            // Show success message and redirect
            this.showSuccessMessage(orderData);
            return true;
        }
    }

    // Generate a unique order ID
    generateOrderId() {
        return 'TC-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    // Save order to localStorage
    saveOrder(orderData) {
        const orders = JSON.parse(localStorage.getItem('travelColombiaOrders') || '[]');
        orders.push(orderData);
        localStorage.setItem('travelColombiaOrders', JSON.stringify(orders));
    }

    // Show error messages
    showErrors(errors) {
        const errorContainer = document.querySelector('.error-messages') || this.createErrorContainer();
        errorContainer.innerHTML = `
            <div class="alert alert-error">
                <h4>Please correct the following errors:</h4>
                <ul>
                    ${errors.map(error => `<li>${error}</li>`).join('')}
                </ul>
            </div>
        `;
        errorContainer.scrollIntoView({ behavior: 'smooth' });
    }

    // Create error container if it doesn't exist
    createErrorContainer() {
        const container = document.createElement('div');
        container.className = 'error-messages';
        const form = document.querySelector('form[name="checkout"]');
        form.parentNode.insertBefore(container, form);
        return container;
    }

    // Show success message
    showSuccessMessage(orderData) {
        alert(`Order ${orderData.id} placed successfully! Total: $${orderData.totals.total.toFixed(2)}. 
        
Thank you for choosing Travel to Colombia! You will receive a confirmation email shortly.`);

        // Redirect to thank you page with order parameters
        setTimeout(() => {
            window.location.href = `../thankyou/thankyou.html?type=order&orderId=${orderData.id}`;
        }, 2000);
    }

    // Initialize checkout page
    init() {
        const cartItems = this.cart.getCartItems();

        // Redirect to cart if no items
        if (cartItems.length === 0) {
            alert('Your cart is empty. Please add some packages before proceeding to checkout.');
            window.location.href = '../cart/index.html';
            return;
        }

        // Populate order summary
        this.populateOrderSummary();

        // Set up form submission
        const form = document.querySelector('form[name="checkout"]');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());

                this.processCheckout(data);
            });
        }

        // Add input formatting for card number and expiration
        this.setupInputFormatting();
    }

    // Setup input formatting for better UX
    setupInputFormatting() {
        // Format card number (add spaces every 4 digits)
        const cardNumberInput = document.querySelector('input[name="cardNumber"]');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\s/g, '');
                let formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
                e.target.value = formattedValue;
            });
        }

        // Format expiration date (MM/YY)
        const expirationInput = document.querySelector('input[name="expiration"]');
        if (expirationInput) {
            expirationInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                }
                e.target.value = value;
            });
            expirationInput.setAttribute('placeholder', 'MM/YY');
            expirationInput.setAttribute('maxlength', '5');
        }

        // Format security code (numbers only)
        const codeInput = document.querySelector('input[name="code"]');
        if (codeInput) {
            codeInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '');
            });
            codeInput.setAttribute('maxlength', '4');
        }

        // Format ZIP code
        const zipInput = document.querySelector('input[name="zip"]');
        if (zipInput) {
            zipInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 5) {
                    value = value.substring(0, 5) + '-' + value.substring(5, 9);
                }
                e.target.value = value;
            });
        }
    }
}

// Initialize checkout when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Check if we're on the checkout page
    if (window.location.pathname.includes('/checkout/')) {
        // Load header and footer first, then initialize checkout
        import('./utils.mjs').then(({ loadHeaderFooter }) => {
            loadHeaderFooter().then(() => {
                const checkout = new Checkout();
                checkout.init();
            });
        });
    }
});
