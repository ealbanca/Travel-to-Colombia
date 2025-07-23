// Orders management functions
class OrderManager {
    constructor() {
        this.storageKey = 'travelColombiaOrders';
    }

    // Get all orders from localStorage
    getOrders() {
        const ordersData = localStorage.getItem(this.storageKey);
        return ordersData ? JSON.parse(ordersData) : [];
    }

    // Save orders to localStorage
    saveOrders(orders) {
        localStorage.setItem(this.storageKey, JSON.stringify(orders));
    }

    // Add a new order
    addOrder(orderData) {
        const orders = this.getOrders();
        const newOrder = {
            id: 'ORD-' + Date.now(),
            date: new Date().toISOString(),
            status: 'confirmed',
            ...orderData
        };
        orders.unshift(newOrder); // Add to beginning of array (newest first)
        this.saveOrders(orders);
        return newOrder;
    }

    // Get orders for a specific user
    getUserOrders(userEmail) {
        const orders = this.getOrders();
        return orders.filter(order => order.customerEmail === userEmail);
    }
}

// Create global order manager instance
const orderManager = new OrderManager();

// Function to create an order from cart (called after successful checkout)
function createOrderFromCart(customerInfo) {
    // Get cart items
    const cartItems = JSON.parse(localStorage.getItem('travelColombiaCart')) || [];
    
    if (cartItems.length === 0) {
        console.error('No items in cart to create order');
        return null;
    }

    // Calculate total
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Get user email - prioritize logged-in user's email from token
    let userEmail = customerInfo.email || 'guest@example.com';
    
    // If user is logged in, try to get email from token
    const token = localStorage.getItem('so_token');
    if (token) {
        try {
            // Try to get user info from stored user data first
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
            if (currentUser.email) {
                userEmail = currentUser.email;
            } else {
                // Try to decode JWT token to get email
                const tokenParts = token.split('.');
                if (tokenParts.length === 3) {
                    const payload = JSON.parse(atob(tokenParts[1]));
                    if (payload.email) {
                        userEmail = payload.email;
                    }
                }
            }
        } catch (error) {
            console.log('Could not decode user info from token');
        }
    }

    // Create order data
    const orderData = {
        items: cartItems,
        total: total,
        customerInfo: {
            ...customerInfo,
            email: userEmail // Use the determined email
        },
        customerEmail: userEmail // Store email separately for easy filtering
    };

    // Save order
    const newOrder = orderManager.addOrder(orderData);
    
    // Clear cart after creating order
    localStorage.removeItem('travelColombiaCart');
    
    return newOrder;
}

// Function to render orders page
function renderOrdersPage() {
    const ordersContent = document.getElementById('orders-content');
    if (!ordersContent) return;

    // Check if user is logged in using the correct token key
    const token = localStorage.getItem('so_token');
    
    if (!token) {
        ordersContent.innerHTML = `
            <div class="no-auth">
                <h3>Please log in to view your orders</h3>
                <p>You need to be logged in to see your order history.</p>
                <button class="btn-primary" onclick="openLoginModal()">Log In</button>
            </div>
        `;
        return;
    }

    // Get user email from token or fallback to stored user data
    let userEmail = 'guest@example.com';
    
    try {
        // Try to get user info from stored user data first
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (currentUser.email) {
            userEmail = currentUser.email;
        } else {
            // Try to decode JWT token to get email
            const tokenParts = token.split('.');
            if (tokenParts.length === 3) {
                const payload = JSON.parse(atob(tokenParts[1]));
                userEmail = payload.email || payload.sub || 'guest@example.com';
            }
        }
    } catch (error) {
        console.log('Could not decode user info, using guest email');
    }

    // Get user's orders
    const userOrders = orderManager.getUserOrders(userEmail);

    if (userOrders.length === 0) {
        ordersContent.innerHTML = `
            <div class="no-orders">
                <h3>No orders yet</h3>
                <p>You haven't made any bookings yet. Start exploring our amazing travel packages!</p>
                <a href="../index.html" class="btn-primary">Browse Packages</a>
            </div>
        `;
        return;
    }

    // Render orders
    const ordersHTML = userOrders.map(order => createOrderHTML(order)).join('');
    ordersContent.innerHTML = `
        <div class="orders-list">
            ${ordersHTML}
        </div>
    `;
}

// Function to create HTML for a single order
function createOrderHTML(order) {
    const orderDate = new Date(order.date).toLocaleDateString();
    const orderTime = new Date(order.date).toLocaleTimeString();
    
    const itemsHTML = order.items.map(item => `
        <div class="order-item">
            <img src="../public/images/${item.image}" alt="${item.title}" class="order-item-image">
            <div class="order-item-details">
                <h4>${item.title}</h4>
                <p class="order-item-city">${item.city}</p>
                <p class="order-item-duration">${item.duration}</p>
                <p class="order-item-quantity">Quantity: ${item.quantity}</p>
                <p class="order-item-price">$${(item.price * item.quantity).toFixed(2)} USD</p>
            </div>
        </div>
    `).join('');

    return `
        <div class="order-card">
            <div class="order-header">
                <div class="order-info">
                    <h3>Order #${order.id}</h3>
                    <p class="order-date">${orderDate} at ${orderTime}</p>
                    <span class="order-status status-${order.status}">${order.status.toUpperCase()}</span>
                </div>
                <div class="order-total">
                    <strong>Total: $${order.total.toFixed(2)} USD</strong>
                </div>
            </div>
            <div class="order-items">
                ${itemsHTML}
            </div>
            <div class="order-customer">
                <h4>Customer Information:</h4>
                <p><strong>Name:</strong> ${order.customerInfo.firstName} ${order.customerInfo.lastName}</p>
                <p><strong>Email:</strong> ${order.customerInfo.email}</p>
                <p><strong>Phone:</strong> ${order.customerInfo.phone}</p>
            </div>
        </div>
    `;
}

// Initialize orders page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only render if we're on the orders page
    if (window.location.pathname.includes('/orders/')) {
        // Add some debugging
        console.log('Orders page loaded');
        console.log('Token exists:', !!localStorage.getItem('so_token'));
        console.log('Current user:', localStorage.getItem('currentUser'));
        
        renderOrdersPage();
    }
});

// Make functions globally accessible
window.createOrderFromCart = createOrderFromCart;
window.renderOrdersPage = renderOrdersPage;
window.orderManager = orderManager;
