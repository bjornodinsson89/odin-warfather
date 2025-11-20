// ============================================================
// ODIN WARFATHER — Console Tab
// Author: BjornOdinsson89
// Description:
//     Dev console for WarFather. Displays:
//       • Engine logs
//       • API errors
//       • Sync updates
//       • Manual API tester
// ============================================================

export class WarfatherConsoleTab {

    constructor(modules) {
        this.sync = modules.sync;
        this.api = modules.api;
        this.faction = modules.faction;

        // Internal log buffer
        this.logs = [];
        this.maxLogs = 200;

        // Monkey-patch console (safe)
        this._patchConsole();
    }

    // --------------------------------------------------------
    // Patch console.log → also write to GUI console
    // --------------------------------------------------------
    _patchConsole() {
        const self = this;
        const orig = console.log;

        console.log = function (...args) {
            orig.apply(console, args);

            const msg = args.join(" ");
            self._pushLog(msg);
        };
    }

    _pushLog(msg) {
        if (this.logs.length >= this.maxLogs) {
            this.logs.shift();
        }

        const ts = new Date().toLocaleTimeString();
        this.logs.push(`[${ts}] ${msg}`);

        this.render();
    }

    // --------------------------------------------------------
    // Render console UI
    // --------------------------------------------------------
    render() {
        const el = document.querySelector("#odin-tab-console");
        if (!el) return;

        const content = this.logs
            .map((l) => `<div class="wf-log-line">${l}</div>`)
            .join("");

        el.innerHTML = `
            <div class="wf-section">
                <h2 class="wf-title">WarFather Console</h2>

                <div id="wf-console-output" class="wf-console-output">
                    ${content}
                </div>

                <div class="wf-console-input">
                    <input id="wf-console-cmd" class="wf-input" 
                        placeholder="Enter API command... (e.g., user/1234)">
                    <button id="wf-console-run" class="wf-button">Run</button>
                </div>
            </div>
        `;

        document
            .getElementById("wf-console-run")
            .addEventListener("click", () => this.runCommand());

        // Auto-scroll
        const out = document.getElementById("wf-console-output");
        if (out) out.scrollTop = out.scrollHeight;
    }

    // --------------------------------------------------------
    // Manual API tester
    // --------------------------------------------------------
    async runCommand() {
        const input = document.getElementById("wf-console-cmd");
        if (!input) return;

        const cmd = input.value.trim();
        if (!cmd.length) return;

        console.log(`Running API command: ${cmd}`);

        try {
            const data = await this.api.request(cmd, "", { force: true });
            console.log("API RESPONSE:", JSON.stringify(data, null, 2));
        } catch (err) {
            console.log("ERROR:", err);
        }

        input.value = "";
        this.render();
    }
}

window.WarfatherConsoleTab = WarfatherConsoleTab;
