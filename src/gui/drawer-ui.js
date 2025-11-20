// =======================================================
// WARFATHER DRAWER — HARDCORE DEBUG LOCATOR MODE
// =======================================================

(function () {

    class WarfatherDrawer {

        constructor() {
            this.isOpen = true; // FORCE OPEN
        }

        init() {
            setTimeout(() => this._safeInit(), 250);
        }

        _safeInit() {
            console.log("[WF Drawer DEBUG] Running drawer locator");

            // Remove old
            const old = document.getElementById("wf-drawer");
            if (old) old.remove();

            this.injectDrawer();

            console.log("[WF Drawer DEBUG] Drawer injected");
        }

        injectDrawer() {
            const drawer = document.createElement("div");
            drawer.id = "wf-drawer";

            drawer.style.cssText = `
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100vw !important;
                height: 100vh !important;

                /* 🔥 FIRE RED LOCATOR */
                background: rgba(255, 0, 0, 0.5) !important;
                border: 5px solid yellow !important;
                z-index: 999999 !important;

                transform: none !important;
                transition: none !important;

                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 32px;
                font-weight: bold;
                color: #fff;
            `;

            drawer.textContent = "DRAWER LOCATOR — IF YOU SEE THIS, DRAWER WORKS";

            document.body.appendChild(drawer);
        }
    }

    window.WarfatherDrawer = new WarfatherDrawer();

})();
