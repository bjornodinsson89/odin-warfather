(function () {

    class WarfatherDrawer {

        constructor() {
            this.isOpen = false;
            this._observer = null;
        }

        init() {
            console.log("[WF Drawer] init() called");

            this.injectButton();
            this.injectDrawer();
            this.startObserver();

            console.log("[WF Drawer] init() complete");
        }

        /* -----------------------------
           Auto-repair if Torn removes UI
        ----------------------------- */
        startObserver() {
            this._observer = new MutationObserver(() => {

                if (!document.getElementById("wf-header-button")) {
                    console.log("[WF Drawer] Button missing → reinserting");
                    this.injectButton();
                }

                if (!document.getElementById("wf-drawer")) {
                    console.log("[WF Drawer] Drawer missing → reinserting");
                    this.injectDrawer();
                }

            });

            this._observer.observe(document.body, { childList: true, subtree: true });
        }

        /* -----------------------------
           Button
        ----------------------------- */
        injectButton() {
            if (document.getElementById("wf-header-button")) return;

            console.log("[WF Drawer] injectButton() creating button");

            const btn = document.createElement("div");
            btn.id = "wf-header-button";

            const img = document.createElement("img");
            img.id = "wf-bear-icon";
            img.src = "https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/assets/Bear-head.png";

            btn.appendChild(img);
            btn.addEventListener("click", () => this.toggle());

            document.body.appendChild(btn);
        }

        /* -----------------------------
           Drawer
        ----------------------------- */
        injectDrawer() {
            if (document.getElementById("wf-drawer")) return;

            console.log("[WF Drawer] injectDrawer() creating drawer");

            const drawer = document.createElement("div");
            drawer.id = "wf-drawer";

            document.body.appendChild(drawer);
        }

        /* -----------------------------
           Toggle
        ----------------------------- */
        toggle() {
            const drawer = document.getElementById("wf-drawer");
            const btn = document.getElementById("wf-header-button");

            if (!drawer || !btn) {
                console.error("[WF Drawer] toggle() failed: elements missing");
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
