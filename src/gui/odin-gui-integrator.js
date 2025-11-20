// ============================================================
// ODIN WARFATHER — GUI Integrator
// Namespace: window.WarfatherGUI
// Purpose:
//   • Bootstraps all engines (Sync, API, Faction)
//   • Creates GUI tabs in Odin Drawer
//   • Connects modules via window.* namespace
//   • Starts update loops and event streams
// ============================================================

// ------------------------------------------------------------
// GLOBAL NAMESPACE
// ------------------------------------------------------------
window.WarfatherGUI = {
    engines: {},
    tabs: {},
    initCalled: false
};


// ------------------------------------------------------------
// MAIN INITIALIZER
// ------------------------------------------------------------
window.WarfatherGUI.init = async function() {

    if (this.initCalled) return;
    this.initCalled = true;

    console.log("%c[WarfatherGUI] Initializing...", "color:#ff4444;");

    // ----------------------------------------
    // 1. Load Engines (via window namespace)
    // ----------------------------------------
    const SyncEngine      = window.WarfatherSync;
    const SmartAPIEngine  = window.SmartAPI;
    const FactionEngine   = window.WarfatherFactionEngine;

    // Read player info from page or your existing GUI base file
    const userID     = window.ODIN_PLAYER_ID ?? 0;
    const factionID  = window.ODIN_FACTION_ID ?? 0;

    // Engine state
    const state = { userID, factionID };

    // Create engines
    const sync    = new SyncEngine(state);
    const api     = new SmartAPIEngine();
    const faction = new FactionEngine(sync, api);

    // Store engines globally
    this.engines = { sync, api, faction };

    console.log("[WarfatherGUI] Engines loaded.");

    // ----------------------------------------
    // 2. Load Tabs (via window namespace)
    // ----------------------------------------
    const DashboardTab = window.WarfatherDashboardTab;
    const FactionTab   = window.WarfatherFactionTab;
    const WarTab       = window.WarfatherWarTab;
    const ChainTab     = window.WarfatherChainTab;
    const TargetsTab   = window.WarfatherTargetsTab;
    const ConsoleTab   = window.WarfatherConsoleTab;

    // Create tab instances
    const dashboard = new DashboardTab({ sync, api, faction });
    const factionTab = new FactionTab({ sync, api, faction });
    const warTab = new WarTab({ sync, api, faction });
    const chainTab = new ChainTab({ sync, api, faction });
    const targetsTab = new TargetsTab({ sync, api, faction });
    const consoleTab = new ConsoleTab({ sync, api, faction });

    this.tabs = {
        dashboard,
        faction: factionTab,
        war: warTab,
        chain: chainTab,
        targets: targetsTab,
        console: consoleTab
    };

    console.log("[WarfatherGUI] Tabs created.");

    // ----------------------------------------
    // 3. Attach GUI Layout (Drawer Tabs)
    // ----------------------------------------
    this.attachDrawerTabs();

    // ----------------------------------------
    // 4. Kick initial renders
    // ----------------------------------------
    dashboard.render();
    factionTab.render();
    warTab.render();
    chainTab.render();
    targetsTab.render();
    consoleTab.render();

    // ----------------------------------------
    // 5. Prime engines
    // ----------------------------------------
    await faction.loadFaction();       // load roster
    chainTab.refreshChain();           // load chain data
    console.log("[WarfatherGUI] Initialization complete.");
};


// ------------------------------------------------------------
// ADD TABS TO ODIN DRAWER UI
// ------------------------------------------------------------
// ADD TABS TO ODIN DRAWER UI
window.WarfatherGUI.attachDrawerTabs = function () {
    const GUI = window.OdinWarGUI;

    if (!GUI) {
        console.log("ERROR: OdinWarGUI not found.");
        return;
    }

    GUI.addTab("dashboard", "Dashboard");
    GUI.addTab("faction",   "Faction");
    GUI.addTab("war",       "War");
    GUI.addTab("chain",     "Chain");
    GUI.addTab("targets",   "Targets");
    GUI.addTab("console",   "Console");

    console.log("[WarfatherGUI] Drawer tabs attached.");
};

// AUTO-ATTACH TABS ON PAGE LOAD (NO .init() CALL)
setTimeout(() => {
    if (window.WarfatherGUI && window.WarfatherGUI.attachDrawerTabs) {
        window.WarfatherGUI.attachDrawerTabs();
    } else {
        console.log("[WarfatherGUI] GUI not ready for tabs.");
    }
}, 1200);
