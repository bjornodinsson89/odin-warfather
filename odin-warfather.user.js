// ==UserScript==
// @name         ODIN WARFATHER
// @namespace    https://github.com/bjornodinsson89/odin-warfather
// @version      1.0.0
// @description  The Ultimate Faction War & Chain Command Engine for Torn City.
// @author       BjornOdinsson89
// @match        https://www.torn.com/*
// @updateURL    https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/odin-warfather.user.js
// @downloadURL  https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/odin-warfather.user.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @resource     wfCSS https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/src/odin-warfather.css
// @resource     drawerCSS https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/src/gui/drawer-ui.css
// @require      https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/src/engines/sync-engine.js
// @require      https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/src/engines/smartapi.js
// @require      https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/src/engines/faction-engine.js
// @require      https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/src/gui/odin-gui.js
// @require      https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/src/gui/drawer-ui.js
// @require      https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/src/gui/key-panel.js
// @require      https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/src/tabs/dashboard-tab.js
// @require      https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/src/tabs/faction-tab.js
// @require      https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/src/tabs/war-tab.js
// @require      https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/src/tabs/chain-tab.js
// @require      https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/src/tabs/targets-tab.js
// @require      https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/src/tabs/console-tab.js
// @require      https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/src/gui/odin-gui-integrator.js
// ==/UserScript==

(function warfatherBootstrap() {

    // ---------------------------------------------------------
    // Load CSS resources
    // ---------------------------------------------------------
    try {
        const wf = GM_getResourceText("wfCSS");
        const dr = GM_getResourceText("drawerCSS");
        GM_addStyle(wf);
        GM_addStyle(dr);
        console.log("%c[Warfather] CSS loaded", "color:#44ff44");
    } catch (e) {
        console.log("%c[Warfather] CSS FAILED TO LOAD", "color:#ff4444", e);
    }


    // ---------------------------------------------------------
    // Wait for minimal Torn DOM + WF modules
    // ---------------------------------------------------------
    function waitForStartup() {

        if (!document.querySelector("#headerRoot")) {
            return setTimeout(waitForStartup, 100);
        }

        if (!window.OdinWarDrawer ||
            !window.WarfatherSync ||
            !window.SmartAPI ||
            !window.WarfatherFactionEngine ||
            !window.WarfatherIntegrator) {

            return setTimeout(waitForStartup, 100);
        }

        startWarfather();
    }


    // ---------------------------------------------------------
    // Primary startup
    // ---------------------------------------------------------
    function startWarfather() {

        console.log("%c[Warfather] Starting...", "color:#ff2222;font-size:14px;");

        // API Key Check
        const key = GM_getValue("wf_api_key", "");
        if (!key) {
            console.log("%c[Warfather] No API key detected — showing key panel.", "color:#ffaa00");
            new window.WarfatherKeyPanel();
            return;
        }

        // Integrator handles everything else:
        //  - Drawer
        //  - Tabs
        //  - Sync
        //  - API
        //  - Faction data
        //  - Render loops
        console.log("%c[Warfather] Integrator taking over...", "color:#99ccff;");
        // Integrator auto-executes on creation.
    }


    waitForStartup();

})();
