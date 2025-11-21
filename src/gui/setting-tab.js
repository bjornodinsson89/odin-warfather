// ============================================================
// ODIN WARFATHER — Settings Tab 
// ============================================================

(function () {

    function WarfatherSettingsTab() {}

    WarfatherSettingsTab.prototype.render = function () {
        var el = document.getElementById("wf-tab-settings");
        if (!el) return;

        el.innerHTML =
            '<div class="wf-section">' +
                '<h2 class="wf-title">Settings</h2>' +

                '<div class="wf-block">' +
                    '<div><strong>Drawer Side:</strong></div>' +
                    '<button id="wf-settings-side" class="wf-button">Toggle Side</button>' +
                '</div>' +

                '<hr>' +

                '<div class="wf-block">' +
                    '<div><strong>Reset API Key:</strong></div>' +
                    '<button id="wf-settings-reset" class="wf-button">Reset Key</button>' +
                '</div>' +
            '</div>';

        var btn1 = document.getElementById("wf-settings-side");
        if (btn1) {
            btn1.addEventListener("click", function () {
                alert("Drawer side toggling will be enabled in Layer 5.");
            });
        }

        var btn2 = document.getElementById("wf-settings-reset");
        if (btn2) {
            btn2.addEventListener("click", function () {
                GM_deleteValue("wf_api_key");
                alert("API Key cleared. Reload page.");
            });
        }
    };

    window.WarfatherSettingsTab = WarfatherSettingsTab;

})();
