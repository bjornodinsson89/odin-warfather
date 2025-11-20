// ============================================
// ODIN WARFATHER — Drawer UI (Overlay Version)
// ============================================
(function () {

    class WarfatherDrawer {

        constructor() {
            this.isOpen = false;
        }

        init() {
            console.log("[WF Drawer] init() called");

            // Delay to avoid Torn nuking our overlay
            setTimeout(() => {
                console.log("[WF Drawer] Delayed init running…");

                this.createOverlayButton();
                this.createDrawer();
                this.startObserver();

                console.log("[WF Drawer] init() complete");
            }, 500);
        }

        // ------------------------------
        // MutationObserver auto-fix
        // ------------------------------
        startObserver() {
            this._observer = new MutationObserver(() => {
                if (!document.getElementById("wf-header-button")) {
                    console.log("[WF Drawer] Button missing → restoring");
                    this.createOverlayButton();
                }
                if (!document.getElementById("wf-drawer")) {
                    console.log("[WF Drawer] Drawer missing → restoring");
                    this.createDrawer();
                }
            });

            this._observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        // ----------------------------------
        // CREATE FIXED OVERLAY BUTTON
        // ----------------------------------
        createOverlayButton() {
            if (document.getElementById("wf-header-button")) return;

            console.log("[WF Drawer] Creating overlay button");

            const btn = document.createElement("div");
            btn.id = "wf-header-button";
            btn.style.position = "fixed";
            btn.style.zIndex = "999999";

            // bear img
            const img = document.createElement("img");
            img.id = "wf-bear-icon";
            img.src =
                "https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/assets/Bear-head.png";

            btn.appendChild(img);

            // Always toggle drawer
            btn.addEventListener("click", () => {
                console.log("[WF BUTTON] click → toggle()");
                this.toggle();
            });

            document.documentElement.appendChild(btn); // <-- overlay root (not body)
        }

        // ----------------------------------
        // CREATE DRAWER
        // ----------------------------------
        createDrawer() {
            if (document.getElementById("wf-drawer")) return;

            console.log("[WF Drawer] Creating drawer");

            const drawer = document.createElement("div");
            drawer.id = "wf-drawer";

            document.documentElement.appendChild(drawer);
        }

        // ----------------------------------
        // TOGGLE DRAWER OPEN/CLOSE
        // ----------------------------------
        toggle() {
            const drawer = document.getElementById("wf-drawer");
            const btn = document.getElementById("wf-header-button");

            if (!drawer || !btn) return;

            this.isOpen = !this.isOpen;

            drawer.classList.toggle("wf-open", this.isOpen);
            btn.classList.toggle("wf-open", this.isOpen);

            console.log("[WF Drawer] Drawer toggled:", this.isOpen);
        }
    }

    window.WarfatherDrawer = new WarfatherDrawer();
})();
