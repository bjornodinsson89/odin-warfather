// ============================================================
// ODIN WARFATHER — Dashboard Tab (Drawer v2 Compatible)
// Author: BjornOdinsson89
// Summary: Central overview — chain, war, members online, watchers.
// ============================================================

(function () {

    class WarfatherDashboardTab {

        constructor() {
            this.chainStatus = {};
            this.warState = {};
            this.onlineCount = 0;
            this.watcherCount = 0;

            // Module bindings (SAFE placeholders)
            this.sync = window.WF_SyncEngine || null;
            this.api = window.WF_SmartAPI || null;
            this.faction = window.WF_FactionEngine || null;

            this._bindUpdates();
            this.render();
        }

        // ------------------------------------------------------
        // Bind update callbacks if engines exist
        // ------------------------------------------------------
        _bindUpdates() {

            if (this.sync) {
                this.sync.onChainStatus((data) => {
                    this.chainStatus = data || {};
                    this.render();
                });

                this.sync.onWarState((data) => {
                    this.warState = data || {};
                    this.render();
                });
            }

            if (this.faction) {
                this.faction.onRosterUpdate = () => this._updateCounts();
                this.faction.onWatcherUpdate = () => this._updateCounts();
            }
        }

        _updateCounts() {
            if (!this.faction || !this.faction.getRosterForGUI) return;

            const roster = this.faction.getRosterForGUI();
            this.onlineCount = roster.filter(m => m.status === "online").length;
            this.watcherCount = roster.filter(m => m.watcher === true).length;

            this.render();
        }

        // ------------------------------------------------------
        // RENDER OUTPUT INTO THE TAB PANE
        // ------------------------------------------------------
        render() {
            const el = document.querySelector("#wf-tab-dashboard");
            if (!el) return;

            el.innerHTML = `
                <div class="wf-section">
                    <h2 class="wf-title">Faction Overview</h2>

                    <div class="wf-block">
                        <div><strong>Online Members:</strong> ${this.onlineCount}</div>
                        <div><strong>Chain Watchers:</strong> ${this.watcherCount}</div>
                    </div>

                    <hr>

                    <h3>Chain Status</h3>
                    <div class="wf-block">
                        ${this.chainStatus?.chain || "No Chain Active"}
                    </div>

                    <h3>War Status</h3>
                    <div class="wf-block">
                        ${this.warState?.state || "Not in War"}
                    </div>
                </div>
            `;
        }
    }

    // Register tab class globally
    window.WarfatherDashboardTab = WarfatherDashboardTab;

})();
