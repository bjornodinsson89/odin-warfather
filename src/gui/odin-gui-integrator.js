// ============================================================
// ODIN WARFATHER — Drawer Integrator 
// ============================================================

(function () {

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

        console.log("[WF Integrator] Drawer detected");

        // --- FULL TAB SET ---
        drawer.addTab("dashboard", "Dashboard");
        drawer.addTab("faction", "Faction");
        drawer.addTab("war", "War");
        drawer.addTab("chain", "Chain");
        drawer.addTab("targets", "Targets");
        drawer.addTab("factionTargets", "Faction Targets");
        drawer.addTab("settings", "Settings");
        drawer.addTab("console", "Console");

        console.log("[WF Integrator] Tabs attached.");
    }

    waitForDrawer();

})();
