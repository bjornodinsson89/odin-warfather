(function () {

    class WarfatherDrawer {

        constructor() {
            this.isOpen = false;
        }

        init() {
            if (document.getElementById("wf-drawer")) return;

            this.injectButton();
            this.injectDrawer();

            console.log("[WF Drawer] Initialized");
        }

        injectButton() {
            const btn = document.createElement("div");
            btn.id = "wf-header-button";
            btn.textContent = "≡ WARFATHER";
            btn.style.cssText = `
                position: fixed;
                top: 120px;
                left: 5px;
                background: #111;
                color: #fff;
                padding: 6px 14px;
                border-radius: 6px;
                z-index: 99999;
                font-size: 14px;
                cursor: pointer;
            `;
            btn.addEventListener("click", () => this.toggle());
            document.body.appendChild(btn);
        }

        injectDrawer() {
            const drawer = document.createElement("div");
            drawer.id = "wf-drawer";
            drawer.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                height: 100vh;
                width: 350px;
                background: rgba(20,20,20,0.96);
                border-right: 2px solid #444;
                transform: translateX(-360px);
                transition: transform 0.25s ease;
                z-index: 99998;
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
        }
    }

    window.WarfatherDrawer = new WarfatherDrawer();

})();
