
//Global Authentication Modal Handler, to login and signup users from any page

import { openLoginModal, closeLoginModal } from './utils.mjs';

// Make modal functions globally available
window.openLoginModal = openLoginModal;
window.closeLoginModal = closeLoginModal;
