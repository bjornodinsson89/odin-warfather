(function () {

    class WarfatherDrawer {

        constructor() {
            this.isOpen = false;
        }

        init() {
            if (document.getElementById("wf-drawer")) return;

            this.injectButton();
            this.injectDrawer();
            this.bindGestureBlocks();

            WF_LOG("[Drawer] init() complete");
        }

        // -------------------------------------------------
        // BUTTON — floating round button (center top)
        // -------------------------------------------------
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
            btn.addEventListener("touchstart", () => this.toggle());

            document.body.appendChild(btn);
        }

        // -------------------------------------------------
        // DRAWER — smaller + centered + hotzone safe
        // -------------------------------------------------
        injectDrawer() {
            const drawer = document.createElement("div");
            drawer.id = "wf-drawer";
            drawer.style.cssText = `
                position: fixed;
                top: 20%;
                left: -260px; /* moved 4px off edge & shrunk */
                width: 260px; /* 30% smaller */
                height: 60%; /* 40% shorter */
                background: rgba(20,20,20,0.96);
                border-right: 2px solid #444;
                border-radius: 0 12px 12px 0;
                box-shadow: 0 0 12px #000;

                display: flex;
                flex-direction: column;
                overflow-y: auto;

                transform: translateX(0);
                transition: left 0.28s ease-out;
                z-index: 99999;
                pointer-events: auto;
            `;

            drawer.addEventListener("touchstart", e => e.stopPropagation());
            drawer.addEventListener("touchmove", e => e.stopPropagation());
            drawer.addEventListener("click", e => e.stopPropagation());

            document.body.appendChild(drawer);
        }

        // -------------------------------------------------
        // GESTURE BLOCKER — stops Torn mobile from closing
        // -------------------------------------------------
        bindGestureBlocks() {
            document.addEventListener("touchstart", e => {
                if (this.isOpen) e.stopPropagation();
            }, true);

            document.addEventListener("touchmove", e => {
                if (this.isOpen) e.stopPropagation();
            }, true);
        }

        // -------------------------------------------------
        // TOGGLE drawer
        // -------------------------------------------------
        toggle() {
            const drawer = document.getElementById("wf-drawer");
            if (!drawer) return;

            this.isOpen = !this.isOpen;

            drawer.style.left = this.isOpen
                ? "0px"
                : "-260px";

            WF_LOG(`[Drawer] toggled: ${this.isOpen}`);
        }
    }

    window.WarfatherDrawer = new WarfatherDrawer();

})();
