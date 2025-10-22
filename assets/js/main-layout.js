document.addEventListener('DOMContentLoaded', () => {
    const pageWrapper = document.querySelector('.page-wrapper');
    const sidebar = document.querySelector('.sidebar');
    const resizer = document.querySelector('.sidebar-resizer');
    const toggleBtn = document.querySelector('.sidebar-toggle-button');

    if (!pageWrapper || !sidebar || !resizer || !toggleBtn) {
        console.warn('Sidebar layout elements not found. Skipping layout script.');
        return;
    }

    // --- Config ---
    const STORAGE_KEY_WIDTH = 'sidebarWidth';
    const STORAGE_KEY_COLLAPSED = 'sidebarCollapsed';
    const MIN_WIDTH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-min-width') || '220');
    const MAX_WIDTH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-max-width') || '500');

    // --- State Initialization ---
    const initLayout = () => {
        // Load collapsed state
        const isCollapsed = localStorage.getItem(STORAGE_KEY_COLLAPSED) === 'true';
        if (isCollapsed) {
            pageWrapper.classList.add('sidebar-collapsed');
        }

        // Load saved width
        const savedWidth = localStorage.getItem(STORAGE_KEY_WIDTH);
        if (savedWidth && !isCollapsed) {
            const newWidth = Math.max(MIN_WIDTH, Math.min(parseInt(savedWidth), MAX_WIDTH));
            document.documentElement.style.setProperty('--sidebar-width', `${newWidth}px`);
        }
    };

    // --- Toggle/Collapse Logic ---
    const handleToggle = () => {
        const isCollapsed = pageWrapper.classList.toggle('sidebar-collapsed');
        localStorage.setItem(STORAGE_KEY_COLLAPSED, isCollapsed);

        // If we are un-collapsing, restore the saved width
        if (!isCollapsed) {
            const savedWidth = localStorage.getItem(STORAGE_KEY_WIDTH) || `${MIN_WIDTH}px`;
            document.documentElement.style.setProperty('--sidebar-width', savedWidth);
        }
    };

    // --- Resize Logic ---
    const startResize = (e) => {
        // Don't resize if collapsed
        if (pageWrapper.classList.contains('sidebar-collapsed')) {
            return;
        }
        
        e.preventDefault();
        document.addEventListener('mousemove', doResize);
        document.addEventListener('mouseup', stopResize);
    };

    const doResize = (e) => {
        let newWidth = e.clientX;
        
        // Enforce min/max width
        if (newWidth < MIN_WIDTH) newWidth = MIN_WIDTH;
        if (newWidth > MAX_WIDTH) newWidth = MAX_WIDTH;

        document.documentElement.style.setProperty('--sidebar-width', `${newWidth}px`);
    };

    const stopResize = () => {
        document.removeEventListener('mousemove', doResize);
        document.removeEventListener('mouseup', stopResize);
        
        // Save the new width
        const newWidth = document.documentElement.style.getPropertyValue('--sidebar-width');
        if (newWidth) {
            localStorage.setItem(STORAGE_KEY_WIDTH, newWidth);
        }
    };

    // --- Attach Event Listeners ---
    toggleBtn.addEventListener('click', handleToggle);
    resizer.addEventListener('mousedown', startResize);

    // --- Run Initialization ---
    initLayout();
});