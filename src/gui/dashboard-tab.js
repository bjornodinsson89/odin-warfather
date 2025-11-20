// ============================================================
// ODIN WARFATHER — Dashboard Tab
// Author: BjornOdinsson89 (https://www.torn.com/profiles.php?XID=3666214)
// Summary: Central overview — chain, war, members online, watchers.
// ============================================================

export class WarfatherDashboardTab {

    constructor(modules) {
        this.sync = modules.sync;
        this.api = modules.api;
        this.faction = modules.faction;
        
        this.chainStatus = {};
        this.warState = {};
        this.onlineCount = 0;
        this.watcherCount = 0;

        // Bind updates
        this.sync.onChainStatus((data) => {
            this.chainStatus = data || {};
            this.render();
        });

        this.sync.onWarState((data) => {
            this.warState = data || {};
            this.render();
        });

        this.faction.onRosterUpdate = () => this._updateCounts();
        this.faction.onWatcherUpdate = () => this._updateCounts();
    }

    _updateCounts() {
        const roster = this.faction.getRosterForGUI();
        this.onlineCount = roster.filter(m => m.status === "online").length;
        this.watcherCount =
            roster.filter(m => m.watcher === true).length;
        this.render();
    }

    // ------------------------
    // Render into GUI container
    // ------------------------
    render() {
        const el = document.querySelector("#odin-tab-dashboard");
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
