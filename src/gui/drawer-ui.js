// ===============================
// ODIN WARFATHER — Drawer UI
// ===============================

(function () {

    class WarfatherDrawer {

        constructor() { this.isOpen = false; }

        init() {
            if (document.getElementById("wf-drawer")) return;
            this.injectButton();
            this.injectDrawer();
            console.log("[WF Drawer] Loaded");
        }

        injectButton() {
            console.log("[WF Drawer] injectButton()");

            const btn = document.createElement("div");
            btn.id = "wf-header-button";

            // IMPORTANT → FORCE the image to load and render
            const imgURL = "https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/assets/Bear-head.png";

            btn.innerHTML = `
                <img id="wf-bear-icon"
                     src="${imgURL}"
                     style="
                        width: 48px !important;
                        height: 48px !important;
                        display: block !important;
                        object-fit: contain !important;
                        pointer-events: none !important;
                     ">
            `;

            btn.style.cssText = `
                position: fixed;
                top: 8px !important;
                left: 50% !important;
                transform: translateX(-50%) !important;
                width: 48px !important;
                height: 48px !important;
                padding: 0 !important;
                margin: 0 !important;
                background: transparent !important;
                border: none !important;
                border-radius: 50% !important;
                overflow: visible !important;
                z-index: 999999 !important;
                cursor: pointer !important;
            `;

            btn.addEventListener("click", () => this.toggle());

            document.body.appendChild(btn);

            // Force visibility after browser paints the button
            requestAnimationFrame(() => {
                const i = document.getElementById("wf-bear-icon");
                if (i) i.style.opacity = "1";
            });
        }


        injectDrawer() {
            const drawer = document.createElement("div");
            drawer.id = "wf-drawer";

            drawer.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 330px;
                height: 100vh;
                background: rgba(20,20,20,0.96);
                border-right: 2px solid #444;
                transform: translateX(-360px);
                transition: transform 0.25s ease;
                z-index: 99998;
            `;

            drawer.innerHTML = `
                <div style="padding: 10px; color: #eee;">
                    <h2>WarFather Drawer</h2>
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
                : "translateX(-360px)";

            console.log("[WF Drawer] Drawer toggled:", this.isOpen);
        }
    }

    window.WarfatherDrawer = new WarfatherDrawer();

})();
