(function () {

    class WarfatherDrawer {

        constructor() {
            this.isOpen = false;
        }

        init() {
            // Ensure page is ready
            document.addEventListener("DOMContentLoaded", () => {
                this._safeInit();
            });

            // Fallback for SPA navigation / Torn internal reloads
            setTimeout(() => this._safeInit(), 500);
        }

        _safeInit() {
            if (document.getElementById("wf-drawer")) return;

            this.injectButton();
            this.injectDrawer();

            console.log("[WF Drawer] Initialized (safe)");
        }

        injectButton() {
            const btn = document.createElement("div");
            btn.id = "wf-header-button";

            // 🔥 Replace text with bear icon
            btn.innerHTML = `<img src="https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/assets/bear-icon.png"
                               style="height:26px;width:auto;" />`;

            btn.style.cssText = `
                position: fixed;
                top: 90px;
                left: 10px;
                background: rgba(0,0,0,0.75);
                padding: 8px 10px;
                border-radius: 10px;
                z-index: 99999;
                cursor: pointer;
                border: 2px solid #a00;
            `;

            btn.addEventListener("click", () => this.toggle());

            document.body.appendChild(btn);
        }

        injectDrawer() {
            const drawer = document.createElement("div");
            drawer.id = "wf-drawer";

            drawer.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                height: 100vh;
                width: 360px;
                background: rgba(15,15,15,0.98);
                border-right: 3px solid #a00;
                transform: translateX(-380px);
                transition: transform 0.25s ease;
                z-index: 99998;
                overflow-y: auto;
            `;

            document.body.appendChild(drawer);
        }

        toggle() {
            const drawer = document.getElementById("wf-drawer");
            if (!drawer) {
                console.log("[WF Drawer] ERROR: Drawer missing");
                return;
            }

            this.isOpen = !this.isOpen;

            drawer.style.transform = this.isOpen
                ? "translateX(0)"
                : "translateX(-380px)";
        }
    }

    window.WarfatherDrawer = new WarfatherDrawer();

})();
