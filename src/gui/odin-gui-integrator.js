// ============================================================
// ODIN WARFATHER — Drawer Integrator v2 (FINAL)
// Author: BjornOdinsson89
// Purpose:
//    Connect all tabs + engines to the NEW Drawer UI only.
//    Removes dependency on old OdinWarGUI.
// ============================================================

(function() {

    // Wait until drawer is loaded
    function waitForDrawer() {
        if (!window.WarfatherDrawer) {
            return setTimeout(waitForDrawer, 100);
        }
        attachTabs();
    }

    function attachTabs() {

        const drawer = window.WarfatherDrawer;
        if (!drawer) {
            console.log("[WF Integrator] ERROR: Drawer not found.");
            return;
        }

        console.log("[WF Integrator] Drawer detected:", drawer);

        // -----------------------------
        // Add tab containers to drawer
        // -----------------------------
        drawer.addTab("dashboard", "Dashboard");
        drawer.addTab("faction",   "Faction");
        drawer.addTab("war",       "War");
        drawer.addTab("chain",     "Chain");
        drawer.addTab("targets",   "Targets");
        drawer.addTab("console",   "Console");

        console.log("[WF Integrator] Tabs attached.");
    }

    // Auto-start integrator
    waitForDrawer();

})();
