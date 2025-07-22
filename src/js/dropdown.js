// Enhanced dropdown functionality for better mobile experience
document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        // Handle click on dropdown toggle for mobile
        toggle.addEventListener('click', function(e) {
            // Only prevent default on mobile/tablet
            if (window.innerWidth <= 768) {
                e.preventDefault();
                
                // Toggle the dropdown menu
                if (menu.style.display === 'block') {
                    menu.style.display = 'none';
                } else {
                    // Close other dropdowns first
                    document.querySelectorAll('.dropdown-menu').forEach(m => {
                        if (m !== menu) m.style.display = 'none';
                    });
                    menu.style.display = 'block';
                }
            }
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!dropdown.contains(e.target)) {
                menu.style.display = 'none';
            }
        });
    });
    
    // Close dropdowns on window resize
    window.addEventListener('resize', function() {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.style.display = 'none';
        });
    });
});
