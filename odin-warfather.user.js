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
// @require      https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/src/gui/consyole-tab.js
// @require      https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/src/gui/odin-gui-integrator.js
// ==/UserScript==

(function() {
    const css = GM_getResourceText("odinCSS");
    GM_addStyle(css);

    const init = () => {
        if (!window.OdinWarGUI || !window.WarfatherGUI) {
            setTimeout(init, 120);
            return;
        }

        const userID = parseInt(
            document.querySelector("a[href*='XID=']")?.href?.match(/XID=(\d+)/)?.[1]
        ) || 0;

        const factionID =
            window?.wfFactionID ||
            GM_getValue("wfFactionID") ||
            0;

        window.WF_STATE = { userID, factionID };

        window.WarfatherGUI.init();
    };

    init();
})();
