// ===============================
// ODIN WARFATHER — Drawer UI
// ===============================

(function () {

    class WarfatherDrawer {

        constructor() {
            this.isOpen = false;
        }

        init() {
            // Safety: don't build twice
            if (document.getElementById("wf-drawer")) {
                console.log("[WF Drawer] Drawer already exists, skipping init");
                return;
            }

            this.injectButton();
            this.injectDrawer();

            console.log("[WF Drawer] init() finished");
        }

        // ------------------------------------------
        // Create floating button (bear icon)
        // ------------------------------------------
        injectButton() {
            console.log("[WF Drawer] injectButton()");

            const btn = document.createElement("div");
            btn.id = "wf-header-button";

            // Use your GitHub-hosted bear image
            btn.innerHTML = `
                <img src="https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/assets/Bear-head.png"
                    style="width: 26px; height: 26px; opacity: 0.9;">
            `;

            btn.style.cssText = `
                position: fixed;
                top: 6px;
                left: 50%;
                transform: translateX(-50%);
                width: 42px !important;
                height: 42px !important;
                background: transparent !important;
                border: none !important;
                border-radius: 50% !important;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 999999;
            `;

            // Tap → toggle drawer
            btn.addEventListener("click", () => this.toggle());

            document.body.appendChild(btn);
        }

        // ------------------------------------------
        // Drawer panel
        // ------------------------------------------
        injectDrawer() {
            console.log("[WF Drawer] injectDrawer()");

            const drawer = document.createElement("div");
            drawer.id = "wf-drawer";
            drawer.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                height: 100vh;
                width: 330px;
                background: rgba(20,20,20,0.96);
                border-right: 2px solid #444;
                transform: translateX(-360px);
                transition: transform 0.25s ease;
                z-index: 99998;
            `;

            drawer.innerHTML = `
                <div style="padding: 10px; color: #eee; font-family: monospace;">
                    <h2 style="margin:0 0 8px 0; font-size: 16px;">WarFather Drawer</h2>
                    <p style="font-size: 12px; opacity: 0.8;">
                        Drawer test panel — layer 2.
                    </p>
                </div>
            `;

            document.body.appendChild(drawer);

            console.log("[WF Drawer] Drawer init() completed");
        }

        // ------------------------------------------
        // Toggle open/close
        // ------------------------------------------
        toggle() {
            const drawer = document.getElementById("wf-drawer");
            if (!drawer) {
                console.log("[WF Drawer] toggle() called but drawer missing");
                return;
            }

            this.isOpen = !this.isOpen;
            drawer.style.transform = this.isOpen
                ? "translateX(0)"
                : "translateX(-360px)";

            console.log("[WF Drawer] Drawer toggled:", this.isOpen);
        }
    }

    // Expose globally
    window.WarfatherDrawer = new WarfatherDrawer();

})();
