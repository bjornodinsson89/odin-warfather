// ============================================================
// ODIN WARFATHER — GUI CORE v1
// Minimal GUI shell used by tab modules
// ============================================================

(function() {

    class WarfatherGUI {

        static init() {
            console.log("[WF GUI] GUI layer ready.");
        }

        static getPane(id) {
            return document.getElementById(`wf-tab-${id}`);
        }
    }

    window.WarfatherGUI = WarfatherGUI;

})();
