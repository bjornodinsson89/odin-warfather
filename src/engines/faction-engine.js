// ============================================================
// ODIN WARFATHER — Faction Engine (Hybrid Omega Version)
// Author: BjornOdinsson89 (https://www.torn.com/profiles.php?XID=3666214)
// Description: Enhanced faction engine with watcher integration,
// real-time updates, sorting, status parsing, and GUI hooks.
// ============================================================

class WarfatherFactionEngine {

    constructor(sync, api) {
        this.sync = sync;       // WarfatherSync instance
        this.api = api;         // SmartAPI instance

        this.roster = {};       // Faction members from Torn API
        this.chainWatchers = {}; // { userID: { active, updatedAt } }

        // Optional GUI callbacks
        this.onRosterUpdate = null;
        this.onWatcherUpdate = null;
    }

    // ------------------------------------------------------------
    // Bind listener for chain watcher updates
    // ------------------------------------------------------------
    bindWatcherStream() {
        this.sync.onChainWatchersUpdated((data) => {
            this.chainWatchers = data;
            if (this.onWatcherUpdate) this.onWatcherUpdate(data);
        });
    }

    // ------------------------------------------------------------
    // Load faction roster from Torn API
    // ------------------------------------------------------------
    async loadFaction() {
        const data = await this.api.faction("basic,members");

        if (!data.error) {
            this.roster = data.members || {};
            if (this.onRosterUpdate) this.onRosterUpdate(this.getRosterForGUI());
            return this.roster;
        }
        return {};
    }

    // ------------------------------------------------------------
    // Status interpretation (online, hospital, travel, etc.)
    // ------------------------------------------------------------
    parseStatus(m) {
        if (!m.status) return "offline";

        const state = m.status.state;

        if (state === "Hospital") return "hospital";
        if (state === "Traveling") return "travel";
        if (state === "Okay") return "online";

        return state.toLowerCase();
    }

    // ------------------------------------------------------------
    // Toggle MY chain watcher flag
    // ------------------------------------------------------------
    async toggleMyWatcher() {
        const uid = this.sync.state.userID;
        const current = this.chainWatchers[uid]?.active || false;
        return this.sync.setChainWatcher(!current);
    }

    // ------------------------------------------------------------
    // Merge roster & watcher data for GUI
    // ------------------------------------------------------------
    getRosterForGUI() {
        const out = [];

        for (const id in this.roster) {
            const m = this.roster[id];

            out.push({
                id,
                name: m.name,
                level: m.level,
                status: this.parseStatus(m),
                watcher: this.chainWatchers[id]?.active || false
            });
        }

        // Hybrid Omega sorting:
        // 1. Chain watchers first
        // 2. Then online
        // 3. Then highest level
        out.sort((a, b) => {
            if (a.watcher && !b.watcher) return -1;
            if (!a.watcher && b.watcher) return 1;

            if (a.status === "online" && b.status !== "online") return -1;
            if (b.status === "online" && a.status !== "online") return 1;

            return b.level - a.level;
        });

        return out;
    }
}

// Export to global scope
window.WarfatherFactionEngine = WarfatherFactionEngine;
