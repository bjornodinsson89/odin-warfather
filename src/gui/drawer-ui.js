// Prevent double-load
if (window.__WF_DRAWER_LOADED__) {
    console.log("[WF] Drawer already loaded, skipping duplicate.");
    return;
}
window.__WF_DRAWER_LOADED__ = true;


// ===============================
// ODIN WARFATHER — Drawer UI
// ===============================

(function() {

    class OdinWarDrawer {

        constructor() {
            this.side = GM_getValue("wf_drawer_side", "left"); // future
            this.isOpen = false;
        }

        init() {
            // Prevent double render
            if (document.getElementById("wf-drawer")) return;

            this._injectButton();
            this._injectDrawer();

            console.log("%c[WF Drawer] Initialized", "color:#8f8");
        }

        // ------------------------------------------
        // Inject header button near TornTools button
        // ------------------------------------------
        _injectButton() {
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
