// ============================================================
// ODIN WARFATHER — Drawer UI 
// ============================================================

(function () {

    class WarfatherDrawer {

        constructor() {
            this.isOpen = false;
            this.tabs = {};
            this.activeTab = null;
            this._observer = null;
            this.ready = false;
        }

        // -------------------------------------------------------
        // Initialize drawer safely
        // -------------------------------------------------------
        init() {
            try {
                this.injectButton();
                this.insertDrawer();
                this.insertTabBar();
                this.startObserver();

                // Mark drawer as fully ready
                this.ready = true;
                window.WarfatherDrawerReady = true;

                console.log("[WF Drawer] Ready");
            } catch (err) {
                console.error("[WF Drawer] INIT ERROR:", err);
            }
        }

        // -------------------------------------------------------
        // Reinsertion watcher (Torn removes DOM nodes)
        // -------------------------------------------------------
        startObserver() {
            this._observer = new MutationObserver(() => {
                if (!document.getElementById("wf-header-button")) this.injectButton();
                if (!document.getElementById("wf-drawer")) this.insertDrawer();
                if (!document.getElementById("wf-tab-bar")) this.insertTabBar();
            });

            this._observer.observe(document.body, { childList: true, subtree: true });
        }

        // -------------------------------------------------------
        // Button (bear icon)
        // -------------------------------------------------------
        injectButton() {
            if (document.getElementById("wf-header-button")) return;

            const btn = document.createElement("div");
            btn.id = "wf-header-button";

            const img = document.createElement("img");
            img.id = "wf-bear-icon";
            img.src = "https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/assets/Bear-head.png";

            btn.appendChild(img);
            btn.addEventListener("click", () => this.toggle());

            document.body.appendChild(btn);
        }

        // -------------------------------------------------------
        // Drawer panel
        // -------------------------------------------------------
        insertDrawer() {
            if (document.getElementById("wf-drawer")) return;

            const drawer = document.createElement("div");
            drawer.id = "wf-drawer";

            // Content container
            const content = document.createElement("div");
            content.id = "wf-tab-content";

            drawer.appendChild(content);
            document.body.appendChild(drawer);
        }

        // -------------------------------------------------------
        // Tab bar container
        // -------------------------------------------------------
        insertTabBar() {
            if (document.getElementById("wf-tab-bar")) return;

            const bar = document.createElement("div");
            bar.id = "wf-tab-bar";

            const drawer = document.getElementById("wf-drawer");
            if (drawer) drawer.prepend(bar);
        }

        // -------------------------------------------------------
        // Add a new tab (called from integrator)
        // -------------------------------------------------------
        addTab(name, label) {
            // Prevent attaching tabs before drawer is fully initialized
            if (!this.ready) return;

            if (this.tabs[name]) return; // already exists

            const bar = document.getElementById("wf-tab-bar");
            const contentArea = document.getElementById("wf-tab-content");

            if (!bar || !contentArea) {
                console.error("[WF Drawer] addTab() called before UI exists");
                return;
            }

            // Tab button
            const btn = document.createElement("div");
            btn.className = "wf-tab-button";
            btn.textContent = label;
            btn.dataset.tab = name;
            btn.addEventListener("click", () => this.switchTab(name));

            bar.appendChild(btn);

            // Tab content pane
            const pane = document.createElement("div");
            pane.className = "wf-tab-pane";
            pane.id = `wf-tab-${name}`;
            pane.style.display = "none";

            contentArea.appendChild(pane);

            this.tabs[name] = { btn, pane };

            // activate first tab automatically
            if (!this.activeTab) this.switchTab(name);
        }

        // -------------------------------------------------------
        // Switch tab
        // -------------------------------------------------------
        switchTab(name) {
            if (!this.tabs[name]) return;

            Object.values(this.tabs).forEach(t => {
                t.pane.style.display = "none";
                t.btn.classList.remove("active");
            });

            this.tabs[name].pane.style.display = "block";
            this.tabs[name].btn.classList.add("active");
            this.activeTab = name;
        }

        // -------------------------------------------------------
        // Open/close drawer
        // -------------------------------------------------------
        toggle() {
            this.isOpen = !this.isOpen;

            const drawer = document.getElementById("wf-drawer");
            const btn = document.getElementById("wf-header-button");

            drawer.classList.toggle("wf-open", this.isOpen);
            btn.classList.toggle("wf-open", this.isOpen);
        }
    }

    window.WarfatherDrawer = new WarfatherDrawer();

})();
