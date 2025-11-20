(function () {
    'use strict';

    if (window.__WF_DRAWER_LOADED__) {
        if (window.WF_DEBUG) WF_DEBUG('drawer-ui.js already loaded, skipping');
        return;
    }
    window.__WF_DRAWER_LOADED__ = true;

    class WarfatherDrawer {
        constructor() {
            this.isOpen = false;
        }

        init() {
            if (window.WF_DEBUG) WF_DEBUG('WarfatherDrawer.init()');
            if (document.getElementById('wf-drawer')) {
                if (window.WF_DEBUG) WF_DEBUG('wf-drawer already exists in DOM');
                return;
            }

            this.injectButton();
            this.injectDrawer();

            if (window.WF_DEBUG) WF_DEBUG('WarfatherDrawer.init finished');
        }

        injectButton() {
            if (window.WF_DEBUG) WF_DEBUG('injectButton()');

            const btn = document.createElement('div');
            btn.id = 'wf-header-btn';
            btn.className = 'wf-header-button';
            btn.title = 'Open WarFather';

            btn.addEventListener('click', () => {
                if (window.WF_DEBUG) WF_DEBUG('Header button clicked');
                this.toggle();
            });

            document.body.appendChild(btn);
        }

        injectDrawer() {
            if (window.WF_DEBUG) WF_DEBUG('injectDrawer()');

            const drawer = document.createElement('div');
            drawer.id = 'wf-drawer';
            drawer.className = 'wf-drawer';

            // simple placeholder content so we SEE it when it opens
            drawer.innerHTML = `
                <div class="wf-drawer-inner" style="padding:10px;color:#fff;">
                    <strong>WarFather drawer test</strong><br>
                    If you can read this, the drawer is working.
                </div>
            `;

            document.body.appendChild(drawer);
        }

        toggle() {
            const drawer = document.getElementById('wf-drawer');
            if (!drawer) {
                if (window.WF_DEBUG) WF_DEBUG('toggle() called but wf-drawer is missing');
                return;
            }

            this.isOpen = !this.isOpen;
            drawer.classList.toggle('wf-open', this.isOpen);

            if (window.WF_DEBUG) WF_DEBUG('Drawer toggled → ' + (this.isOpen ? 'OPEN' : 'CLOSED'));
        }
    }

    window.WarfatherDrawer = new WarfatherDrawer();
})();
