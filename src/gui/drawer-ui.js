// ============================================================
// WARFATHER — Drawer UI (Auto-init, verified listeners)
// ============================================================

(function () {
    'use strict';

    if (window.__WF_DRAWER_LOADED__) return;
    window.__WF_DRAWER_LOADED__ = true;

    class WarfatherDrawer {

        constructor() {
            this.isOpen = false;
        }

        init() {
            console.log("[WF Drawer] init() running");

            this.injectOverlayButton();
            this.injectDrawer();

            console.log("[WF Drawer] init() completed");
        }

        // ---------------------------------------
        // OVERLAY BUTTON (untouchable by Torn)
        // ---------------------------------------
        injectOverlayButton() {
            const btn = document.createElement("div");
            btn.id = "wf-overlay-button";

            btn.style.cssText = `
                position: fixed !important;
                top: 70px !important;
                left: 12px !important;
                width: 44px !important;
                height: 44px !important;
                background: rgba(0,0,0,0.88) !important;
                border: 2px solid #d22 !important;
                border-radius: 8px !important;
                z-index: 2147483647 !important;
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
                cursor: pointer !important;
            `;

            btn.innerHTML = `
                <img src="https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/assets/bear.png"
                    style="width:28px;height:28px;opacity:0.95;">
            `;

            // DEBUG TAP
            btn.addEventListener("click", () => {
                console.log("[WF Button] CLICK detected → toggle()");
                this.toggle();
            });

            document.body.appendChild(btn);
        }

        // ---------------------------------------
        // Drawer panel
        // ---------------------------------------
        injectDrawer() {
            const drawer = document.createElement("div");
            drawer.id = "wf-drawer";

            drawer.style.cssText = `
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 330px !important;
                height: 100vh !important;
                background: rgba(15,15,15,0.97) !important;
                border-right: 2px solid #a00 !important;
                transform: translateX(-340px);
                transition: transform 0.25s ease-out;
                z-index: 2147483646 !important;
            `;

            drawer.innerHTML = `
                <div style="padding:20px;color:white;">Drawer active</div>
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

    // AUTO INIT
    window.WarfatherDrawer = new WarfatherDrawer();
    window.WarfatherDrawer.init();

})();
