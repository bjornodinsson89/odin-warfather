(function () {

    class WarfatherDrawer {

        constructor() {
            this.isOpen = false;
            this.touchLock = false; // prevents Torn auto-close
        }

        init() {
            if (document.getElementById("wf-drawer")) return;

            this.injectButton();
            this.injectDrawer();
            this.bindGestureBlocks();

            WF_LOG("[Drawer] init() complete");
        }

        injectButton() {
            const btn = document.createElement("div");
            btn.id = "wf-header-button";
            btn.innerHTML = "≡";
            btn.style.cssText = `
                position: fixed;
                top: 65px;
                left: 50%;
                transform: translateX(-50%);
                width: 70px;
                height: 70px;
                border-radius: 50%;
                background: rgba(0,0,0,0.85);
                display: flex;
                align-items: center;
                justify-content: center;
                color: #ff3c3c;
                font-size: 40px;
                z-index: 100000;
                cursor: pointer;
                border: 2px solid #ff3c3c;
                box-shadow: 0px 0px 12px #000;
            `;

            btn.addEventListener("click", () => this.toggle());
            btn.addEventListener("touchend", () => this.toggle());

            document.body.appendChild(btn);
        }

        injectDrawer() {
            const drawer = document.createElement("div");
            drawer.id = "wf-drawer";
            drawer.style.cssText = `
                position: fixed;
                top: 20%;
                left: -260px;
                width: 260px;
                height: 60%;
                background: rgba(20,20,20,0.96);
                border-right: 2px solid #444;
                border-radius: 0 12px 12px 0;
                box-shadow: 0 0 12px #000;
                display: flex;
                flex-direction: column;
                overflow-y: auto;
                transition: left 0.25s ease-out;
                z-index: 99999;
            `;

            drawer.addEventListener("touchstart", e => e.stopPropagation(), true);
            drawer.addEventListener("touchmove", e => e.stopPropagation(), true);
            drawer.addEventListener("click", e => e.stopPropagation(), true);

            document.body.appendChild(drawer);
        }

        // ----------------------------------------------------
        // Block Torn’s global cancel behavior during toggle
        // ----------------------------------------------------
        bindGestureBlocks() {
            document.addEventListener("touchend", e => {
                if (this.touchLock) e.stopPropagation();
            }, true);

            document.addEventListener("touchcancel", e => {
                if (this.touchLock) e.stopPropagation();
            }, true);
        }

        // ----------------------------------------------------
        // FIXED TOGGLE — prevents auto-close on quick tap
        // ----------------------------------------------------
        toggle() {
            const drawer = document.getElementById("wf-drawer");
            if (!drawer) return;

            this.isOpen = !this.isOpen;

            // Activate lock to prevent Torn cancelling tap
            this.touchLock = true;
            setTimeout(() => this.touchLock = false, 220);

            drawer.style.left = this.isOpen ? "0px" : "-260px";

            WF_LOG(`[Drawer] toggled → ${this.isOpen}`);
        }
    }

    window.WarfatherDrawer = new WarfatherDrawer();

})();
