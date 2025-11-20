// ==UserScript==
// @name         ODIN WARFATHER
// @namespace    https://github.com/bjornodinsson89/odin-warfather
// @version      1.0.0
// @description  Faction War Engine
// @author       BjornOdinsson89
// @match        https://www.torn.com/*
// @match        https://www.torn.com/*?*
// @match        https://www.torn.com/*#*
// @match        https://*.torn.com/*
// @updateURL    https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/odin-warfather.user.js
// @downloadURL  https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/odin-warfather.user.js
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @run-at       document-end
// @resource     odinCSS https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/src/odin-warfather.css
// @require      https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/src/gui/key-panel.js
// @require      https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/src/engines/sync-engine.js
// @require      https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/src/engines/smartapi.js
// @require      https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/src/engines/faction-engine.js
// @require      https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/src/gui/odin-gui.js
// @require      https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/src/gui/dashboard-tab.js
// @require      https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/src/gui/faction-tab.js
// @require      https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/src/gui/war-tab.js
// @require      https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/src/gui/chain-tab.js
// @require      https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/src/gui/targets-tab.js
// @require      https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/src/gui/console-tab.js
// @require      https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/src/gui/odin-gui-integrator.js
// ==/UserScript==

(function warfatherBootstrap() {
    const css = GM_getResourceText("odinCSS");
    GM_addStyle(css);

    function waitForModules() {
        if (!window.WarfatherSync ||
            !window.SmartAPI ||
            !window.WarfatherFactionEngine ||
            !window.OdinWarGUI ||
            !window.WarfatherGUI ||
            !window.WarfatherDashboardTab ||
            !window.WarfatherFactionTab ||
            !window.WarfatherWarTab ||
            !window.WarfatherChainTab ||
            !window.WarfatherTargetsTab ||
            !window.WarfatherConsoleTab ||
            !window.WarfatherKeyPanel) {
            return setTimeout(waitForModules, 100);
        }
        startWarfather();
    }

    async function startWarfather() {
        const apiKey = GM_getValue("wf_api_key", "");

        if (!apiKey) {
            new window.WarfatherKeyPanel();
            return;
        }

        const userID = parseInt(
            document.querySelector("a[href*='XID=']")?.href?.match(/XID=(\d+)/)?.[1]
        ) || 0;

        let factionID = GM_getValue("wfFactionID", 0);

        if (!factionID && window.SmartAPI) {
            try {
                const apiProbe = new window.SmartAPI(apiKey, null);
                const me = await apiProbe.request("user", "&selections=profile");
                factionID = me.faction?.faction_id || 0;
                GM_setValue("wfFactionID", factionID);
            } catch (e) {
                console.log("[WarFather] Faction detection failed");
            }
        }

        window.WF_STATE = { userID, factionID };

        const sync = new window.WarfatherSync(window.WF_STATE);
        const api = new window.SmartAPI(apiKey, sync);
        const faction = new window.WarfatherFactionEngine(sync, api);

        window.WF_ENGINES = { sync, api, faction };

        window.OdinWarGUI.init();
        window.WarfatherGUI.init();

        createTabs(sync, api, faction);

        console.log("%c[Warfather] FULLY INITIALIZED", "color:#ff4444;font-weight:bold;");
    }

    function createTabs(sync, api, faction) {
        new window.WarfatherDashboardTab({ sync, api, faction });
        new window.WarfatherFactionTab({ sync, api, faction });
        new window.WarfatherWarTab({ sync, api, faction });
        new window.WarfatherChainTab({ sync, api, faction });
        new window.WarfatherTargetsTab({ sync, api, faction });
        new window.WarfatherConsoleTab({ sync, api, faction });
    }

    waitForModules();
})();
