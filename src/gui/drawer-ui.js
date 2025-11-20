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
            console.log("[WF Drawer] init running");

            this.injectButton();
            this.injectDrawer();

            console.log("[WF Drawer] init COMPLETE");
        }

        // ---------------------------------------
        // SAFE BUTTON — TOP MIDDLE OF PAGE
        // ---------------------------------------
        injectButton() {
            const btn = document.createElement("div");
            btn.id = "wf-overlay-button";

            btn.style.cssText = `
                position: fixed !important;
                top: 10px !important;
                left: 50% !important;
                transform: translateX(-50%) !important;

                width: 60px !important;
                height: 60px !important;

                background: rgba(0,0,0,0.9) !important;
                border: 3px solid #ff4444 !important;
                border-radius: 50% !important;

                display: flex !important;
                justify-content: center !important;
                align-items: center !important;

                z-index: 2147483647 !important;
                pointer-events: auto !important;
                touch-action: manipulation !important;
            `;

            btn.innerHTML = `
                <span style="color:#ff4444;font-size:26px;font-weight:bold;">
                    ☰
                </span>
            `;

            // MULTI-METHOD LISTENERS (mobile safe)
            btn.addEventListener("click", () => {
                console.log("[WF BUTTON] CLICK fired → toggle()");
                this.toggle();
            });

            btn.addEventListener("touchstart", () => {
                console.log("[WF BUTTON] TOUCH fired → toggle()");
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
                pointer-events: auto !important;
            `;

            drawer.innerHTML = `
                <div style="padding:20px;color:white;">
                    Drawer Loaded (TEST MODE)
                </div>
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

            console.log("[WF Drawer] Drawer toggled:", this.isOpen);
        }
    }

    window.WarfatherDrawer = new WarfatherDrawer();
    window.WarfatherDrawer.init();

})();
