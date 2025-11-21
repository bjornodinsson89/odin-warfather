// ============================================
// ODIN WARFATHER — Drawer UI (Overlay Version)
// ======================================

(function () {

    class WarfatherDrawer {

        constructor() {
            this.isOpen = false;
        }

        async init() {
            console.log("[WF Drawer] init() called");

            // WAIT for CSS to apply
            await this.waitForCSS();

            // Now safe to build UI
            this.createOverlayButton();
            this.createDrawer();
            this.startObserver();

            console.log("[WF Drawer] init() complete");
        }

        // --------------------------------------
        // Wait for CSS so button has dimensions
        // --------------------------------------
        waitForCSS() {
            return new Promise(resolve => {
                const check = () => {
                    const test = document.createElement("div");
                    test.id = "wf-css-test";
                    document.body.appendChild(test);

                    const width = getComputedStyle(test).getPropertyValue("--wf-css-loaded");

                    test.remove();

                    if (width) {
                        console.log("[WF Drawer] CSS confirmed loaded");
                        resolve();
                    } else {
                        console.log("[WF Drawer] Waiting for CSS…");
                        setTimeout(check, 100);
                    }
                };
                check();
            });
        }

        // ----------------------------------
        // CREATE OVERLAY BUTTON
        // ----------------------------------
        createOverlayButton() {
            if (document.getElementById("wf-header-button")) return;
            console.log("[WF Drawer] Creating overlay button");

            const btn = document.createElement("div");
            btn.id = "wf-header-button";

            const img = document.createElement("img");
            img.id = "wf-bear-icon";
            img.src =
                "https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/assets/Bear-head.png";

            btn.appendChild(img);

            btn.addEventListener("click", () => {
                console.log("[WF BUTTON] click → toggle()");
                this.toggle();
            });

            // Put this in <html> not <body>
            document.documentElement.appendChild(btn);
        }

        createDrawer() {
            if (document.getElementById("wf-drawer")) return;

            console.log("[WF Drawer] Creating drawer");

            const drawer = document.createElement("div");
            drawer.id = "wf-drawer";

            document.documentElement.appendChild(drawer);
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

        // ---------------------------------------------
        // MutationObserver: revive if Torn removes it
        // ---------------------------------------------
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
    }

    window.WarfatherDrawer = new WarfatherDrawer();

})();
