(function () {
    'use strict';

    if (window.__WF_DRAWER_LOADED__) return;
    window.__WF_DRAWER_LOADED__ = true;

    class WarfatherDrawer {
        constructor() {
            this.isOpen = false;
        }

        init() {
            this.injectOverlayButton();
            this.injectDrawer();
        }

        // =========================================================
        // 1. OVERLAY BUTTON (cannot be deleted by Torn)
        // =========================================================
        injectOverlayButton() {
            const btn = document.createElement("div");
            btn.id = "wf-overlay-button";

            btn.style.cssText = `
                position: fixed !important;
                top: 65px !important;
                left: 12px !important;
                width: 42px !important;
                height: 42px !important;
                background: rgba(0,0,0,0.85) !important;
                border: 2px solid #e33 !important;
                border-radius: 8px !important;
                z-index: 999999999 !important;
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
                cursor: pointer !important;
            `;

            // Using your bear emblem
            btn.innerHTML = `
                <img src="https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/assets/bear.png"
                    style="width: 26px; height: 26px; opacity: 0.9;">
            `;

            // Tap → toggle drawer
            btn.addEventListener("click", () => this.toggle());

            document.body.appendChild(btn);
        }

        // =========================================================
        // 2. Drawer panel
        // =========================================================
        injectDrawer() {
            const drawer = document.createElement("div");
            drawer.id = "wf-drawer";

            drawer.style.cssText = `
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 330px !important;
                height: 100vh !important;
                background: rgba(15,15,15,0.96) !important;
                border-right: 2px solid #a00 !important;
                transform: translateX(-340px);
                transition: transform 0.25s ease;
                z-index: 999999998 !important;
            `;

            drawer.innerHTML = `
                <div style="padding:20px;color:white;">Warfather Drawer Active</div>
            `;

            document.body.appendChild(drawer);
        }

        toggle() {
            const drawer = document.getElementById("wf-drawer");
            if (!drawer) return;

            this.isOpen = !this.isOpen;
            drawer.style.transform = this.isOpen
                ? "translateX(0)"
                : "translateX(-340px)";
        }
    }

    window.WarfatherDrawer = new WarfatherDrawer();

})();
