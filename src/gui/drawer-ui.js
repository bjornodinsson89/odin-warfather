// ============================================================
// ODIN WARFATHER — FINAL STABLE DRAWER MODULE
// ============================================================

(function () {
    'use strict';

    if (window.__WF_DRAWER_LOADED__) return;
    window.__WF_DRAWER_LOADED__ = true;

    class WarfatherDrawer {

        constructor() {
            this.isOpen = false;
        }

        init() {
            if (document.getElementById("wf-drawer")) return;

            this.injectButton();
            this.injectDrawer();

            if (window.WF_LOG) WF_LOG("[Drawer] init complete");
        }

        // ============================================================
        //     FLOATING BEAR BUTTON (TOP MIDDLE)
        // ============================================================
        injectButton() {
            const btn = document.createElement("img");
            btn.id = "wf-header-button";

            // your bear logo
            btn.src = "https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/media/bear-head.png";

            btn.style.cssText = `
                position: fixed;
                top: 10px;
                left: 50%;
                transform: translateX(-50%);
                width: 52px;
                height: 52px;
                z-index: 2147483647;
                cursor: pointer;
                opacity: 0.92;
                pointer-events: auto;
            `;

            // 🚨 IMPORTANT: ONLY ONE EVENT → NO DOUBLE TOGGLE
            btn.addEventListener("click", e => {
                e.stopPropagation();
                this.toggle();
            });

            document.body.appendChild(btn);

            if (window.WF_LOG) WF_LOG("[Drawer] Button injected");
        }

        // ============================================================
        //     SMALLER DRAWER (CENTERED VERTICALLY)
        // ============================================================
        injectDrawer() {

            const drawer = document.createElement("div");
            drawer.id = "wf-drawer";

            drawer.style.cssText = `
                position: fixed;
                top: 20%;
                left: -260px;   /* offscreen position */
                width: 260px;   /* 30% smaller width */
                height: 60%;    /* 40% smaller height */
                background: rgba(20,20,20,0.96);
                border-right: 2px solid #444;
                border-radius: 0 12px 12px 0;
                box-shadow: 0 0 12px rgba(0,0,0,0.8);
                overflow-y: auto;
                transition: left .28s ease-out;
                z-index: 2147483646;
                pointer-events: auto;
            `;

            // Prevent Torn Mobile from intercepting drawer interactions
            drawer.addEventListener("touchstart", e => e.stopPropagation(), true);
            drawer.addEventListener("touchmove", e => e.stopPropagation(), true);
            drawer.addEventListener("click", e => e.stopPropagation(), true);

            document.body.appendChild(drawer);

            if (window.WF_LOG) WF_LOG("[Drawer] Drawer injected");
        }

        // ============================================================
        //     TOGGLE HANDLER (NOW 100% STABLE)
        // ============================================================
        toggle() {
            const drawer = document.getElementById("wf-drawer");
            if (!drawer) {
                if (window.WF_LOG) WF_LOG("[Drawer] toggle() FAILED – no drawer");
                return;
            }

            this.isOpen = !this.isOpen;

            drawer.style.left = this.isOpen
                ? "0px"
                : "-260px";

            if (window.WF_LOG)
                WF_LOG(`[Drawer] Toggled → ${this.isOpen ? "OPEN" : "CLOSED"}`);
        }
    }

    window.WarfatherDrawer = new WarfatherDrawer();
})();
