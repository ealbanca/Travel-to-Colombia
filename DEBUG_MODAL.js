// Test Script for Login Modal Debugging
// Copy and paste this into the browser console to test modal functionality

console.log('=== MODAL DEBUG TEST STARTED ===');

// Test 1: Check if modal exists
const modal = document.getElementById('authModal');
console.log('1. Modal exists:', !!modal);

if (modal) {
    // Test 2: Check modal elements
    const closeBtn = modal.querySelector('.close');
    const authTabs = modal.querySelectorAll('.auth-tab');
    const authForms = modal.querySelectorAll('.auth-form');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    console.log('2. Modal elements:');
    console.log('   - Close button:', !!closeBtn);
    console.log('   - Auth tabs:', authTabs.length);
    console.log('   - Auth forms:', authForms.length);
    console.log('   - Login form:', !!loginForm);
    console.log('   - Signup form:', !!signupForm);
    
    // Test 3: Try opening modal
    console.log('3. Opening modal...');
    if (window.openLoginModal) {
        window.openLoginModal();
        console.log('   Modal opened via openLoginModal()');
    } else {
        modal.style.display = 'block';
        console.log('   Modal opened via direct style change');
    }
    
    // Test 4: Test close button
    if (closeBtn) {
        console.log('4. Testing close button...');
        closeBtn.click();
        console.log('   Close button clicked');
    }
    
    // Test 5: Test tab switching
    if (authTabs.length > 1) {
        console.log('5. Testing tab switching...');
        authTabs[1].click(); // Click signup tab
        console.log('   Signup tab clicked');
        
        setTimeout(() => {
            authTabs[0].click(); // Click login tab
            console.log('   Login tab clicked');
        }, 1000);
    }
} else {
    console.log('❌ Modal not found! Checking if it needs to be created...');
    
    // Try to create modal
    if (window.ensureAuthModal) {
        window.ensureAuthModal();
        console.log('Attempted to create modal via ensureAuthModal()');
    }
}

// Test 6: Check login link
const loginLink = document.getElementById('loginLink');
console.log('6. Login link exists:', !!loginLink);

if (loginLink) {
    console.log('   Login link text:', loginLink.textContent);
    console.log('   Login link href:', loginLink.href);
}

console.log('=== MODAL DEBUG TEST COMPLETED ===');
console.log('Check the console messages above for any errors.');
console.log('If you see errors, the modal elements might not be properly initialized.');
