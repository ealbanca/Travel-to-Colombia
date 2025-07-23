/**
 * Global Authentication Modal Handler
 * Include this script on any page where you want the login modal functionality
 */

import { openLoginModal, closeLoginModal } from './utils.mjs';

// Make modal functions globally available
window.openLoginModal = openLoginModal;
window.closeLoginModal = closeLoginModal;

// Export for module usage
export { openLoginModal, closeLoginModal };
