// ===============================
// ODIN WARFATHER — Drawer UI (Stable Version)
// ===============================

(function () {

    class WarfatherDrawer {

        constructor() {
            this.isOpen = false;
        }

        init() {
            console.log("[WF Drawer] init() called");

            this.injectButton();
            this.injectDrawer();
            this.observeForRemoval();

            console.log("[WF Drawer] init() completed");
        }

        // Watch for Torn wiping the elements and reinsert if missing
        observeForRemoval() {
            const observer = new MutationObserver(() => {
                const btn = document.getElementById("wf-header-button");
                if (!btn) {
                    console.log("[WF Drawer] Button missing → reinjectButton()");
                    this.injectButton();
                }
                const drawer = document.getElementById("wf-drawer");
                if (!drawer) {
                    console.log("[WF Drawer] Drawer missing → injectDrawer()");
                    this.injectDrawer();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        injectButton() {
            if (document.getElementById("wf-header-button")) {
                console.log("[WF Drawer] injectButton() called but button already exists");
                return;
            }

            console.log("[WF Drawer] injectButton() creating button");

            const btn = document.createElement("div");
            btn.id = "wf-header-button";

            const img = document.createElement("img");
            img.id = "wf-bear-icon";
            img.src = "https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/assets/Bear-head.png";

            btn.appendChild(img);

            // Debounce to avoid double-toggles
            let locked = false;
            btn.addEventListener("click", () => {
                if (locked) return;
                locked = true;

                console.log("[WF BUTTON] CLICK fired → toggle()");
                this.toggle();

                setTimeout(() => {
                    locked = false;
                }, 200);
            });

            document.body.appendChild(btn);
        }

        injectDrawer() {
            if (document.getElementById("wf-drawer")) {
                console.log("[WF Drawer] injectDrawer() called but drawer already exists");
                return;
            }

            console.log("[WF Drawer] injectDrawer() creating drawer");

            const drawer = document.createElement("div");
            drawer.id = "wf-drawer";

            // placeholder content for now so you can see it
            drawer.textContent = "WarFather drawer ready…";

            document.body.appendChild(drawer);
        }

        toggle() {
            const drawer = document.getElementById("wf-drawer");
            const btn = document.getElementById("wf-header-button");

            if (!drawer || !btn) {
                console.log("[WF Drawer] toggle() called but elements missing");
                return;
            }

            this.isOpen = !this.isOpen;

            drawer.classList.toggle("wf-open", this.isOpen);
            btn.classList.toggle("wf-open", this.isOpen);

            console.log("[WF Drawer] Drawer toggled:", this.isOpen);
        }
    }

    window.WarfatherDrawer = new WarfatherDrawer();

})();
