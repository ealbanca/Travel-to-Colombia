// Checkout functionality
console.log('Checkout.js file loaded');

class Checkout {
    constructor() {
        console.log('Checkout constructor called');
        try {
            this.cart = new Cart();
            console.log('Cart instance created:', this.cart);
            this.shippingRate = 0.10; // 10% shipping rate
            this.taxRate = 0.08; // 8% tax rate
        } catch (error) {
            console.error('Error in Checkout constructor:', error);
            throw error;
        }
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
        console.log('Processing checkout with form data:', formData);
        console.log('createOrderFromCart function available:', typeof createOrderFromCart);

        try {
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

            console.log('Customer info prepared:', customerInfo);

            // Create order using the order management system
            if (typeof createOrderFromCart === 'function') {
                console.log('Using createOrderFromCart function');
                try {
                    const newOrder = createOrderFromCart(customerInfo);
                    console.log('createOrderFromCart returned:', newOrder);
                    if (newOrder) {
                        console.log('Order created successfully:', newOrder);
                        // Show success message and redirect
                        this.showSuccessMessage(newOrder);
                        return true;
                    } else {
                        console.error('createOrderFromCart returned null/undefined');
                        alert('Failed to create order. Please check that you have items in your cart and try again.');
                        return false;
                    }
                } catch (orderError) {
                    console.error('Error in createOrderFromCart:', orderError);
                    console.log('Falling back to manual order creation...');
                    // Fall through to manual order creation
                }
            }
            
            // Fallback to old method if order system not available or failed
            console.log('createOrderFromCart not available or failed, using fallback');
            
            // Check if we have cart items for fallback
            const cartItems = this.cart.getCartItems();
            console.log('Cart items for fallback:', cartItems);
            
            if (!cartItems || cartItems.length === 0) {
                console.error('No cart items available for fallback order creation');
                alert('Your cart appears to be empty. Please add items to your cart and try again.');
                return false;
            }
            
            const orderData = {
                id: this.generateOrderId(),
                customer: customerInfo,
                items: cartItems,
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

            console.log('Fallback order data created:', orderData);

            // Save order to localStorage
            this.saveOrder(orderData);
            console.log('Order saved to localStorage');

            // Clear cart
            this.cart.clearCart();
            console.log('Cart cleared');

            // Show success message and redirect
            this.showSuccessMessage(orderData);
            return true;
            
        } catch (error) {
            console.error('Error in processCheckout:', error);
            console.error('Error stack:', error.stack);
            alert(`An error occurred while processing your order: ${error.message}. Please try again.`);
            return false;
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
        console.log('showSuccessMessage called with:', orderData);
        
        try {
            if (!orderData || !orderData.id) {
                console.error('Invalid order data - missing ID:', orderData);
                alert('Order was created but there was an issue displaying the confirmation. Please check your orders page.');
                return;
            }
            
            // Handle different order data formats
            let totalAmount;
            if (orderData.totals && typeof orderData.totals.total !== 'undefined') {
                // Checkout fallback format
                totalAmount = orderData.totals.total;
            } else if (typeof orderData.total !== 'undefined') {
                // OrderManager format
                totalAmount = orderData.total;
            } else {
                console.error('Invalid order data - missing total amount:', orderData);
                alert('Order was created but there was an issue displaying the total. Please check your orders page.');
                return;
            }
            
            console.log('Order total amount:', totalAmount);
            
            alert(`Order ${orderData.id} placed successfully! Total: $${totalAmount.toFixed(2)}. 
        
Thank you for choosing Travel to Colombia! You will receive a confirmation email shortly.`);

            // Redirect to thank you page with order parameters
            console.log('Redirecting immediately to thank you page with order ID:', orderData.id);
            const redirectUrl = `../thankyou/thankyou.html?type=order&orderId=${orderData.id}`;
            console.log('Redirect URL:', redirectUrl);
            window.location.href = redirectUrl;
        } catch (error) {
            console.error('Error in showSuccessMessage:', error);
            alert('Your order was processed successfully, but there was an issue with the confirmation page. Please check your orders page to view your order.');
        }
    }

    // Initialize checkout page
    init() {
        console.log('Checkout.init() called');
        const cartItems = this.cart.getCartItems();
        console.log('Cart items found:', cartItems.length);

        // Redirect to cart if no items
        if (cartItems.length === 0) {
            console.log('No cart items, redirecting to cart');
            alert('Your cart is empty. Please add some packages before proceeding to checkout.');
            window.location.href = '../cart/index.html';
            return;
        }

        // Populate order summary
        this.populateOrderSummary();

        // Set up form submission
        const form = document.querySelector('form[name="checkout"]');
        console.log('Checkout form found:', form);
        if (form) {
            console.log('Adding submit event listener to form');
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Form submission prevented, processing checkout...');

                try {
                    const formData = new FormData(form);
                    const data = Object.fromEntries(formData.entries());
                    console.log('Form data collected:', data);

                    // Check if required fields are filled
                    const requiredFields = ['fname', 'lname', 'email', 'street', 'city', 'state', 'zip'];
                    const missingFields = requiredFields.filter(field => !data[field] || data[field].trim() === '');
                    
                    if (missingFields.length > 0) {
                        console.error('Missing required fields:', missingFields);
                        alert('Please fill in all required fields: ' + missingFields.join(', '));
                        return;
                    }

                    console.log('All required fields present, processing checkout...');
                    const result = this.processCheckout(data);
                    console.log('Checkout process result:', result);
                } catch (error) {
                    console.error('Error in form submission handler:', error);
                    alert('An error occurred while processing your order. Please try again.');
                }
            });

            // Also add a direct click handler to the submit button as backup
            const submitButton = document.getElementById('checkoutSubmit');
            if (submitButton) {
                console.log('Adding click event listener to submit button');
                const self = this; // Store reference to this
                submitButton.addEventListener('click', (e) => {
                    console.log('Submit button clicked directly');
                    console.log('Button type:', submitButton.type);
                    console.log('Form element:', submitButton.form);
                    
                    // If form submission isn't working, let's try manual processing
                    if (e.defaultPrevented || !form.checkValidity()) {
                        console.log('Form submission was prevented or form is invalid');
                        e.preventDefault();
                        
                        // Manual validation and processing
                        try {
                            const formData = new FormData(form);
                            const data = Object.fromEntries(formData.entries());
                            console.log('Manual form data collection:', data);

                            // Check if required fields are filled
                            const requiredFields = ['fname', 'lname', 'email', 'street', 'city', 'state', 'zip'];
                            const missingFields = requiredFields.filter(field => !data[field] || data[field].trim() === '');
                            
                            if (missingFields.length > 0) {
                                console.error('Missing required fields:', missingFields);
                                alert('Please fill in all required fields: ' + missingFields.join(', '));
                                return;
                            }

                            console.log('Manual processing - all required fields present');
                            const result = self.processCheckout(data);
                            console.log('Manual checkout process result:', result);
                        } catch (error) {
                            console.error('Error in manual processing:', error);
                            alert('An error occurred while processing your order. Please try again.');
                        }
                    }
                });
            }
        } else {
            console.error('Checkout form not found!');
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
        // Wait for all scripts to load, then initialize
        const initCheckout = () => {
            // Load header and footer first, then initialize checkout
            import('./utils.mjs').then(({ loadHeaderFooter }) => {
                loadHeaderFooter().then(() => {
                    console.log('Header and footer loaded, initializing checkout...');
                    const checkout = new Checkout();
                    checkout.init();
                });
            });
        };

        // Check if orders.js is loaded by looking for the global function
        if (typeof createOrderFromCart === 'function') {
            console.log('Orders.js already loaded');
            initCheckout();
        } else {
            console.log('Waiting for orders.js to load...');
            // Wait a bit for orders.js to load
            setTimeout(() => {
                if (typeof createOrderFromCart === 'function') {
                    console.log('Orders.js loaded after timeout');
                    initCheckout();
                } else {
                    console.log('Orders.js still not loaded, proceeding anyway');
                    initCheckout();
                }
            }, 100);
        }
    }
});
