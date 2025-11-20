// ===============================
// ODIN WARFATHER — Drawer UI
// ===============================
(function () {

    class WarfatherDrawer {

        constructor() {
            this.isOpen = false;
        }

        init() {
            if (document.getElementById("wf-drawer")) return;

            this.injectButton();
            this.injectDrawer();

            console.log("[WF Drawer] Loaded");
        }

        injectButton() {
            const btn = document.createElement("div");
            btn.id = "wf-header-button";

            const img = document.createElement("img");
            img.id = "wf-bear-icon";
            img.src = "https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/assets/Bear-head.png";

            btn.appendChild(img);

            // Button click toggle
            btn.addEventListener("click", () => {
                console.log("[WF BUTTON] Click → toggle()");
                this.toggle();
            });

            document.body.appendChild(btn);
        }

        injectDrawer() {
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
