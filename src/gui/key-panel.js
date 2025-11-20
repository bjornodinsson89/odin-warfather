(function () {
    function WarfatherKeyPanel() {
        if (document.getElementById("wf-key-box")) return;

        const box = document.createElement("div");
        box.id = "wf-key-box";
        box.style.cssText = [
            "position:fixed",
            "top:120px",
            "right:20px",
            "background:#111",
            "border:1px solid #444",
            "padding:15px",
            "color:#eee",
            "z-index:999999",
            "width:320px",
            "font-family:Arial,sans-serif",
            "font-size:13px",
        ].join(";");

        box.innerHTML = [
            "<div style='font-weight:bold;margin-bottom:8px;'>WarFather – Torn API Key Required</div>",
            "<div style='margin-bottom:8px;line-height:1.4;'>",
            "This script uses your Torn API key to <b>read</b> your faction, war and chain data via the official Torn API.",
            "<br><br>",
            "<b>Do not share</b> this key with anyone and avoid posting screenshots with it visible.",
            "<br>",
            "You can revoke it at any time from Torn’s API management page.",
            "</div>",
            "<input id='wf-key-input' type='text' ",
            "placeholder='Paste your Torn API key here' ",
            "style='width:100%;padding:6px;background:#000;border:1px solid #333;color:#ddd;margin-bottom:8px;'>",
            "<button id='wf-key-save' ",
            "style='width:100%;padding:8px;background:#222;color:#ddd;border:1px solid #555;cursor:pointer;'>",
            "Save API Key & Reload",
            "</button>"
        ].join("");

        document.body.appendChild(box);

        document.getElementById("wf-key-save").addEventListener("click", function () {
            const val = String(document.getElementById("wf-key-input").value || "").trim();
            if (val.length < 8) {
                alert("WarFather: That does not look like a valid Torn API key.");
                return;
            }
            GM_setValue("wf_api_key", val);
            box.remove();
            location.reload();
        });
    }

    window.WarfatherKeyPanel = WarfatherKeyPanel;
})();
