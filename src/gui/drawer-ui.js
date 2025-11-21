// ======================================================================
// ODIN WARFATHER — Drawer UI
// ======================================================================

(function () {

    class WarfatherDrawer {

        constructor() {
            this.isOpen = false;
        }

        init() {
            console.log("[WF Drawer] init() called");

            this.injectButton();
            this.injectDrawer();

            console.log("[WF Drawer] init() complete");
        }


        // ---------------------------------------------------------
        // BUTTON
        // ---------------------------------------------------------
        injectButton() {
            if (document.getElementById("wf-header-button")) {
                console.log("[WF Drawer] Button already exists");
                return;
            }

            console.log("[WF Drawer] injectButton() creating button");

            const btn = document.createElement("div");
            btn.id = "wf-header-button";

            const img = document.createElement("img");
            img.id = "wf-bear-icon";
            img.src = "https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/assets/Bear-head.png";

            btn.appendChild(img);

            btn.addEventListener("click", () => {
                console.log("[WF Drawer] Button click → toggle()");
                this.toggle();
            });

            document.body.appendChild(btn);
        }


        // ---------------------------------------------------------
        // DRAWER
        // ---------------------------------------------------------
        injectDrawer() {
            if (document.getElementById("wf-drawer")) {
                console.log("[WF Drawer] Drawer already exists");
                return;
            }

            console.log("[WF Drawer] injectDrawer() creating drawer");

            const drawer = document.createElement("div");
            drawer.id = "wf-drawer";

            document.body.appendChild(drawer);
        }


        // ---------------------------------------------------------
        // TOGGLE SYSTEM
        // ---------------------------------------------------------
        toggle() {
            const drawer = document.getElementById("wf-drawer");
            const btn = document.getElementById("wf-header-button");

            if (!drawer || !btn) {
                console.log("[WF Drawer] toggle() aborted — missing elements");
                return;
            }

            this.isOpen = !this.isOpen;

            if (this.isOpen) {
                drawer.classList.add("wf-open");
                btn.classList.add("wf-open");
            } else {
                drawer.classList.remove("wf-open");
                btn.classList.remove("wf-open");
            }

            console.log("[WF Drawer] Drawer toggled:", this.isOpen);
        }
    }

    window.WarfatherDrawer = new WarfatherDrawer();

})();
