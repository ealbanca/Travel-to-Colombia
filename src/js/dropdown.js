// Dropdown menu functionality
document.addEventListener('DOMContentLoaded', function () {
    const dropdowns = document.querySelectorAll('.dropdown');

    // Helper function to close all dropdowns
    function closeAllDropdowns() {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.style.display = 'none';
        });
    }

    // Helper function to close all other dropdowns except the specified one
    function closeOtherDropdowns(currentMenu) {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            if (menu !== currentMenu) {
                menu.style.display = 'none';
            }
        });
    }

    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');

        // Handle click on dropdown toggle for mobile
        if (toggle && menu) {
            toggle.addEventListener('click', function (e) {
                // Only prevent default on mobile/tablet
                if (window.innerWidth <= 768) {
                    e.preventDefault();

                    // Toggle the dropdown menu
                    if (menu.style.display === 'block') {
                        menu.style.display = 'none';
                    } else {
                        // Close other dropdowns first
                        closeOtherDropdowns(menu);
                        menu.style.display = 'block';
                    }
                }
            });
        }
    });

    // Close dropdown when clicking outside (single global event listener)
    document.addEventListener('click', function (e) {
        // Check if click is outside all dropdowns
        const clickedDropdown = e.target.closest('.dropdown');
        if (!clickedDropdown) {
            closeAllDropdowns();
        }
    });

    // Close dropdowns on window resize
    window.addEventListener('resize', closeAllDropdowns);
});
