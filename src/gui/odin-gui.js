// ============================================================
// ODIN WARFATHER — Drawer GUI Framework
// Author: BjornOdinsson89
// Description:
//   • Sliding drawer UI
//   • Tab system for all WarFather modules
//   • Minimal dependencies
//   • Used by WarfatherGUI integrator
// ============================================================

(function() {

    class OdinWarGUI {

        constructor() {
            this.tabs = {};
            this.activeTab = null;

            this._buildDrawer();
        }

        // ----------------------------------------------------
        // Build drawer HTML structure
        // ----------------------------------------------------
        _buildDrawer() {

            // Drawer toggle button
            const toggle = document.createElement("div");
            toggle.id = "odin-drawer-toggle";
            toggle.textContent = "☰ WARFATHER";
            toggle.style.cssText = `
                position: fixed;
                top: 120px;
                left: 0;
                background: #111;
                color: #fff;
                padding: 8px 12px;
                cursor: pointer;
                z-index: 99999;
                border: 1px solid #333;
                border-radius: 0 4px 4px 0;
                font-size: 13px;
                letter-spacing: 1px;
            `;
            document.body.appendChild(toggle);

            toggle.addEventListener("click", () => this.toggleDrawer());

            // Drawer container
            const drawer = document.createElement("div");
            drawer.id = "odin-drawer";
            drawer.style.cssText = `
                position: fixed;
                top: 0;
                left: -260px;
                width: 260px;
                height: 100vh;
                background: #0f0f0f;
                border-right: 1px solid #333;
                z-index: 99998;
                transition: left 0.3s ease;
                overflow-y: auto;
                padding-top: 60px;
            `;
            document.body.appendChild(drawer);

            // Tab buttons container
            const nav = document.createElement("div");
            nav.id = "odin-drawer-nav";
            nav.style.cssText = `
                display: flex;
                flex-direction: column;
                gap: 6px;
                padding: 0 10px;
            `;
            drawer.appendChild(nav);

            // Main content container
            const content = document.createElement("div");
            content.id = "odin-drawer-content";
            content.style.cssText = `
                position: fixed;
                left: 260px;
                top: 0;
                height: 100vh;
                width: calc(100vw - 260px);
                background: #131313;
                color: #ddd;
                padding: 15px;
                overflow-y: auto;
                z-index: 99997;
                display: none;
            `;
            document.body.appendChild(content);

            this.drawer = drawer;
            this.content = content;
            this.nav = nav;
            this.toggleBtn = toggle;
        }

        // ----------------------------------------------------
        // Drawer open/close
        // ----------------------------------------------------
        toggleDrawer() {
            const open = this.drawer.style.left !== "0px";

            this.drawer.style.left = open ? "0px" : "-260px";
            this.content.style.display = open ? "block" : "none";

            if (this.activeTab) this.showTab(this.activeTab);
        }

        // ----------------------------------------------------
        // Create a new tab
        // ----------------------------------------------------
        addTab(name, label) {

            // Create button
            const btn = document.createElement("button");
            btn.className = "wf-button";
            btn.textContent = label;
            btn.style.width = "100%";
            btn.dataset.tab = name;

            this.nav.appendChild(btn);

            // Create container
            const tabEl = document.createElement("div");
            tabEl.id = "odin-tab-" + name;
            tabEl.style.display = "none";

            this.content.appendChild(tabEl);

            this.tabs[name] = tabEl;

            btn.addEventListener("click", () => this.showTab(name));
        }

        // ----------------------------------------------------
        // Switch tabs
        // ----------------------------------------------------
        showTab(name) {
            for (const t in this.tabs) {
                this.tabs[t].style.display = "none";
            }
            this.tabs[name].style.display = "block";
            this.activeTab = name;
        }
    }

    // Expose globally
    window.OdinWarGUI = new OdinWarGUI();

})();
