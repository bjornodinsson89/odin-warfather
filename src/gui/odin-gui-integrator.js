// ============================================================
// ODIN WARFATHER — INTEGRATOR v2
// Author: BjornOdinsson89
// Purpose:
//   ✔ Connect tabs to the new WarFather Drawer UI
//   ✔ Create tab content panels inside drawer
//   ✔ Connect Sync, API, Faction engines
//   ✔ Auto-render first tab
//   ✔ Ensure proper initialization order
// ============================================================

(function () {

function log(msg) {
    console.log(`%c[Integrator] ${msg}`, "color:#ff4444");
}

class WarfatherIntegrator {

    constructor() {
        this.ready = false;
        this.init();
    }

    // --------------------------------------------------------
    // Wait for drawer + engines
    // --------------------------------------------------------
    init() {
        if (!window.OdinWarDrawer ||
            !window.WarfatherSync ||
            !window.SmartAPI ||
            !window.WarfatherFactionEngine) {
            return setTimeout(() => this.init(), 200);
        }
        this.setup();
    }

    // --------------------------------------------------------
    // Full system bootstrap
    // --------------------------------------------------------
    setup() {
        log("Initializing WarFather GUI...");

        // 1. Drawer UI
        const Drawer = window.OdinWarDrawer;
        Drawer.init();

        // 2. Create GUI panel containers INSIDE drawer
        this.createPanels();

        // 3. Build engines AFTER panels exist
        const userID = parseInt(
            document.querySelector("a[href*='XID=']")?.href?.match(/XID=(\d+)/)?.[1]
        ) || 0;

        const factionID = GM_getValue("wfFactionID", 0);

        const state = { userID, factionID };
        const sync = new window.WarfatherSync(state);
        const api = new window.SmartAPI(GM_getValue("wf_api_key", ""), sync);
        const faction = new window.WarfatherFactionEngine(sync, api);

        window.WF_ENGINES = { sync, api, faction };

        // 4. Register tabs into drawer
        this.registerTabs(Drawer, { sync, api, faction });

        // 5. Initial loads
        faction.loadFaction();
        api.syncChainStatus(factionID);
        api.updateWarState(factionID);

        this.ready = true;
        log("Warfather fully initialized.");
    }

    // --------------------------------------------------------
    // Create tab panel containers
    // --------------------------------------------------------
    createPanels() {
        const content = document.querySelector("#wf-drawer-content");
        if (!content) return setTimeout(() => this.createPanels(), 100);

        const names = [
            "dashboard",
            "faction",
            "war",
            "chain",
            "targets",
            "console"
        ];

        for (const name of names) {
            const div = document.createElement("div");
            div.id = `odin-tab-${name}`;
            div.className = "wf-tab-panel";
            div.style.display = "none";
            content.appendChild(div);
        }
    }

    // --------------------------------------------------------
    // Register visible tab buttons
    // --------------------------------------------------------
    registerTabs(Drawer, engines) {

        const icons = {
            dashboard: "https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/src/gui/icons/dashboard.png",
            faction:   "https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/src/gui/icons/faction.png",
            war:       "https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/src/gui/icons/war.png",
            chain:     "https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/src/gui/icons/chain.png",
            targets:   "https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/src/gui/icons/targets.png",
            console:   "https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/src/gui/icons/console.png",
        };

        const tabs = {
            dashboard: new window.WarfatherDashboardTab(engines),
            faction:   new window.WarfatherFactionTab(engines),
            war:       new window.WarfatherWarTab(engines),
            chain:     new window.WarfatherChainTab(engines),
            targets:   new window.WarfatherTargetsTab(engines),
            console:   new window.WarfatherConsoleTab(engines)
        };

        for (const key in tabs) {
            Drawer.registerTab(
                key,
                key.charAt(0).toUpperCase() + key.slice(1),
                icons[key],
                () => this.activateTab(key, tabs[key])
            );
        }

        this.activateTab("dashboard", tabs.dashboard);
    }

    // --------------------------------------------------------
    // Switch active tab
    // --------------------------------------------------------
    activateTab(key, tabObj) {
        const panels = document.querySelectorAll(".wf-tab-panel");
        panels.forEach(p => p.style.display = "none");

        const panel = document.querySelector(`#odin-tab-${key}`);
        if (panel) panel.style.display = "block";

        if (tabObj.render) tabObj.render();
    }
}

window.WarfatherIntegrator = new WarfatherIntegrator();

})();
