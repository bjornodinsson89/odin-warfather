// ===============================
// ODIN WARFATHER — Drawer UI (Persistent Button Version)
// ===============================
(function () {

    class WarfatherDrawer {

        constructor() {
            this.isOpen = false;
            this._observer = null;
        }

        init() {
            console.log("[WF Drawer] Loaded");

            this.injectButton();
            this.insertDrawer();
            this.startObserver();
        }

        // --- Always reinsert if Torn removes it ---
        startObserver() {
            this._observer = new MutationObserver(() => {
                const btn = document.getElementById("wf-header-button");
                if (!btn) {
                    console.log("[WF Drawer] Button missing → Reinserting...");
                    this.injectButton();
                }
                const drawer = document.getElementById("wf-drawer");
                if (!drawer) {
                    console.log("[WF Drawer] Drawer missing → Reinserting...");
                    this.insertDrawer();
                }
            });

            this._observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        injectButton() {
            // Do not double-create
            if (document.getElementById("wf-header-button")) return;

            const btn = document.createElement("div");
            btn.id = "wf-header-button";

            const img = document.createElement("img");
            img.id = "wf-bear-icon";
            img.src = "https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/assets/Bear-head.png";

            btn.appendChild(img);

            btn.addEventListener("click", () => {
                console.log("[WF BUTTON] Click → toggle()");
                this.toggle();
            });

            document.body.appendChild(btn);
        }

        insertDrawer() {
            if (document.getElementById("wf-drawer")) return;

            const drawer = document.createElement("div");
            drawer.id = "wf-drawer";
            document.body.appendChild(drawer);
        }

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
