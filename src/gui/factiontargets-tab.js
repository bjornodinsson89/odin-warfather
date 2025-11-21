// ============================================================
// ODIN WARFATHER — Faction Targets Tab (Layer 3 Stub)
// ============================================================
// This will later sync with Firebase, but for now it is STUB UI only.
// ============================================================

(function () {

    function WarfatherFactionTargetsTab() {
        this.targets = [];
    }

    WarfatherFactionTargetsTab.prototype.render = function () {
        var el = document.getElementById("wf-tab-factiontargets");
        if (!el) return;

        var list = "";
        var i;
        if (this.targets.length === 0) {
            list = "<div>No shared targets yet.</div>";
        } else {
            for (i = 0; i < this.targets.length; i++) {
                list += "<div class=\"wf-block\">" + this.targets[i] + "</div>";
            }
        }

        el.innerHTML =
            '<div class="wf-section">' +
                '<h2 class="wf-title">Faction Targets</h2>' +

                '<div class="wf-block">' +
                    '<input id="wf-ft-new" class="wf-input" placeholder="Player name or XID">' +
                    '<button id="wf-ft-add" class="wf-button">Add Target</button>' +
                '</div>' +

                '<hr>' +
                '<div id="wf-ft-list">' + list + '</div>' +
            '</div>';

        var addBtn = document.getElementById("wf-ft-add");
        if (addBtn) {
            addBtn.addEventListener("click", function () {
                var input = document.getElementById("wf-ft-new");
                if (!input) return;

                var val = input.value;
                if (val === "") return;

                window.WarfatherFactionTargetsTabInstance.targets.push(val);
                window.WarfatherFactionTargetsTabInstance.render();
            });
        }
    };

    // Create a global instance for Layer 3 testing
    window.WarfatherFactionTargetsTab = WarfatherFactionTargetsTab;
    window.WarfatherFactionTargetsTabInstance = new WarfatherFactionTargetsTab();

})();
