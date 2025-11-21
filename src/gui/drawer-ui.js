// ===============================
// ODIN WARFATHER — Drawer UI
// ===============================
(function () {

    class WarfatherDrawer {

        constructor() {
            this.isOpen = false;
            this._observer = null;
        }

        init() {
            console.log("[WF Drawer] init() called");
            this.injectButton();
            this.insertDrawer();
            this.startObserver();
            console.log("[WF Drawer] init() complete");
        }

        startObserver() {
            this._observer = new MutationObserver(() => {
                if (!document.getElementById("wf-header-button")) {
                    console.warn("[WF Drawer] Button removed → reinserting");
                    this.injectButton();
                }
                if (!document.getElementById("wf-drawer")) {
                    console.warn("[WF Drawer] Drawer removed → reinserting");
                    this.insertDrawer();
                }
            });

            this._observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        injectButton() {
            if (document.getElementById("wf-header-button")) return;

            console.log("[WF Drawer] injectButton() creating button");

            const btn = document.createElement("div");
            btn.id = "wf-header-button";
            btn.className = window.innerWidth < 900 ? "mobile" : "desktop";

            const img = document.createElement("img");
            img.id = "wf-bear-icon";
            img.src = "https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/assets/Bear-head.png";

            btn.appendChild(img);

            btn.addEventListener("click", () => {
                console.log("[WF Drawer] Button pressed → toggle()");
                this.toggle();
            });

            document.body.appendChild(btn);
        }

        insertDrawer() {
            if (document.getElementById("wf-drawer")) return;

            console.log("[WF Drawer] injectDrawer() creating drawer");

            const drawer = document.createElement("div");
            drawer.id = "wf-drawer";
            document.body.appendChild(drawer);

            console.log("[WF Drawer] drawer exists:", !!drawer);
        }

        toggle() {
            const drawer = document.getElementById("wf-drawer");
            const btn = document.getElementById("wf-header-button");

            if (!drawer || !btn) {
                console.error("[WF Drawer] toggle() failed → missing element");
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
