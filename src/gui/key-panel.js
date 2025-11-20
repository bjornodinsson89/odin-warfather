// ============================================================
// ODIN WARFATHER — API Key Panel
// Author: BjornOdinsson89
// Description:
//   UI overlay to collect + validate Torn API key for WarFather.
// ============================================================

(function () {

class WarfatherKeyPanel {
    constructor() {
        this.render();
    }

    render() {
        // Remove existing panel if any
        const old = document.getElementById("wf-api-panel");
        if (old) old.remove();

        // Overlay
        const overlay = document.createElement("div");
        overlay.id = "wf-api-overlay";
        overlay.style.position = "fixed";
        overlay.style.inset = "0";
        overlay.style.background = "rgba(0,0,0,0.6)";
        overlay.style.zIndex = "999998";

        // Panel
        const panel = document.createElement("div");
        panel.id = "wf-api-panel";
        panel.style.position = "fixed";
        panel.style.top = "120px";
        panel.style.left = "50%";
        panel.style.transform = "translateX(-50%)";
        panel.style.width = "360px";
        panel.style.background = "#111";
        panel.style.border = "1px solid #444";
        panel.style.borderRadius = "8px";
        panel.style.boxShadow = "0 0 12px rgba(0,0,0,0.7)";
        panel.style.padding = "16px";
        panel.style.color = "#eee";
        panel.style.fontFamily = "sans-serif";
        panel.style.zIndex = "999999";

        const savedKey = GM_getValue("wf_api_key", "");

        panel.innerHTML = `
            <div style="font-size:18px;font-weight:bold;margin-bottom:4px;">
                WarFather API Key
            </div>
            <div style="font-size:12px;opacity:0.8;margin-bottom:10px;">
                WarFather uses the official Torn API. Your key is stored locally in your browser via Tampermonkey.
            </div>

            <label style="font-size:12px;">Current API Key:</label>
            <input id="wf-api-input" type="text"
                style="width:100%;padding:8px;margin-top:4px;margin-bottom:6px;
                       background:#222;border:1px solid #555;color:#fff;border-radius:4px;"
                placeholder="Paste your Torn API key here"
                value="${savedKey}"/>

            <a href="https://tinyurl.com/Torn-City-custom-API-Key"
               target="_blank"
               style="display:block;margin-top:4px;margin-bottom:10px;
                      color:#6af;font-size:12px;text-decoration:underline;">
               Create custom key for Odin
            </a>

            <div style="display:flex;justify-content:space-between;margin-top:10px;">
                <button id="wf-api-cancel"
                    style="flex:0 0 30%;padding:8px;border-radius:4px;border:none;
                           background:#444;color:#eee;cursor:pointer;">
                    Cancel
                </button>
                <button id="wf-api-save"
                    style="flex:0 0 65%;padding:8px;border-radius:4px;border:none;
                           background:#4a8;color:#fff;font-weight:bold;cursor:pointer;">
                    Verify & Save
                </button>
            </div>
        `;

        overlay.appendChild(panel);
        document.body.appendChild(overlay);

        this.bind(panel, overlay);
    }

    bind(panel, overlay) {
        const input = panel.querySelector("#wf-api-input");
        const btnSave = panel.querySelector("#wf-api-save");
        const btnCancel = panel.querySelector("#wf-api-cancel");

        btnCancel.addEventListener("click", () => {
            overlay.remove();
        });

        btnSave.addEventListener("click", async () => {
            const key = input.value.trim();
            if (!key.length) {
                alert("Please paste a Torn API key.");
                return;
            }

            if (!window.SmartAPI) {
                alert("SmartAPI engine not loaded. Cannot validate key.");
                return;
            }

            btnSave.disabled = true;
            btnSave.textContent = "Validating...";

            try {
                const api = new window.SmartAPI(key, null);
                const result = await api.validateKey();

                if (!result.valid) {
                    alert("Invalid API key.\n" + (result.error || "Unknown error."));
                    btnSave.disabled = false;
                    btnSave.textContent = "Verify & Save";
                    return;
                }

                GM_setValue("wf_api_key", key);
                alert(`API Key saved.\nUser ID: ${result.user_id}\nAccess: ${result.access_level || "N/A"}`);
                overlay.remove();

            } catch (e) {
                console.error("[WarfatherKeyPanel] validate error:", e);
                alert("Error validating key.\nCheck console for details.");
                btnSave.disabled = false;
                btnSave.textContent = "Verify & Save";
            }
        });
    }
}

window.WarfatherKeyPanel = WarfatherKeyPanel;

})();
