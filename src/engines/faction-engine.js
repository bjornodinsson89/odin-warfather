// ============================================================
// ODIN WARFATHER — Faction Engine
// Author: BjornOdinsson89 (https://www.torn.com/profiles.php?XID=3666214)
// Description: Warfather faction roster logic + chain watcher integration
// ============================================================

class WarfatherFactionEngine {

    constructor(sync, api) {
        this.sync = sync;       // WarfatherSync instance
        this.api = api;         // SmartAPI instance
        this.roster = {};       // Fetched faction members
        this.chainWatchers = {}; // { userID: { active, updatedAt } }
    }

    // -----------------------------
    // Initialize watchers listener
    // -----------------------------
    bindWatcherStream() {
        this.sync.onChainWatchersUpdated(data => {
            this.chainWatchers = data;
            if (this.onWatcherUpdate) this.onWatcherUpdate(data);
        });
    }

    // -----------------------------
    // Load faction info from Torn
    // -----------------------------
    async loadFaction() {
        const fid = this.sync.state.factionID;
        const data = await this.api.faction("basic,members");

        if (!data.error) {
            this.roster = data.members || {};
            return this.roster;
        }
        return {};
    }

    // -----------------------------
    // Toggle chain watcher
    // -----------------------------
    async toggleMyWatcher() {
        const uid = this.sync.state.userID;
        const current = this.chainWatchers[uid]?.active || false;
        return this.sync.setChainWatcher(!current);
    }

    // -----------------------------
    // Get merged roster for GUI
    // -----------------------------
    getRosterForGUI() {
        const out = [];
        for (const id in this.roster) {
            const m = this.roster[id];
            const cw = this.chainWatchers[id]?.active || false;

            out.push({
                id,
                name: m.name,
                level: m.level,
                status: m.status?.state || "offline",
                watcher: cw
            });
        }
        return out;
    }
}

// Export
window.WarfatherFactionEngine = WarfatherFactionEngine;
