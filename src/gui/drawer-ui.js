// ===============================
// ODIN WARFATHER — Drawer UI (Stable Version)
// ===============================

(function () {

    class WarfatherDrawer {

        constructor() {
            this.isOpen = false;
            this.buttonReady = false;
        }

        init() {
            console.log("[WF Drawer] Loaded");

            this.waitForStableDOM(() => {
                this.injectButton();
                this.injectDrawer();
                this.observeForRemoval();
            });
        }

        // Wait until Torn's header stops rebuilding
        waitForStableDOM(callback) {
            let last = document.body.innerHTML.length;
            let count = 0;

            const timer = setInterval(() => {
                const now = document.body.innerHTML.length;

                if (now === last) count++;
                else count = 0;

                last = now;

                // 3 stable frames = DOM has stopped changing
                if (count >= 3) {
                    clearInterval(timer);
                    callback();
                }
            }, 120);
        }

        observeForRemoval() {
            const observer = new MutationObserver(() => {
                if (!document.getElementById("wf-header-button")) {
                    console.log("[WF Drawer] Button missing → Reinserting");
                    this.injectButton();
                }
                if (!document.getElementById("wf-drawer")) {
                    console.log("[WF Drawer] Drawer missing → Reinserting");
                    this.injectDrawer();
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
        }

        injectButton() {
            if (document.getElementById("wf-header-button")) return;

            const btn = document.createElement("div");
            btn.id = "wf-header-button";

            const img = document.createElement("img");
            img.id = "wf-bear-icon";
            img.src = "https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/assets/Bear-head.png";

            btn.appendChild(img);

            // fix double toggle by debouncing click
            let lock = false;
            btn.addEventListener("click", () => {
                if (lock) return;
                lock = true;
                this.toggle();
                setTimeout(() => lock = false, 180);
            });

            document.body.appendChild(btn);
        }

        injectDrawer() {
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

            console.log("[WF Drawer] Toggled:", this.isOpen);
        }
    }

    window.WarfatherDrawer = new WarfatherDrawer();

})();
