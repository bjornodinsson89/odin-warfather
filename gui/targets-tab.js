// ============================================================
// ODIN WARFATHER — Targets Tab
// Author: BjornOdinsson89 (https://www.torn.com/profiles.php?XID=3666214)
// Description:
// Shared faction target list synced via Firebase.
// Features:
//   • Add target by ID
//   • Remove target
//   • Live updates from sync engine
//   • Auto-refresh table
// ============================================================

export class WarfatherTargetsTab {

    constructor(modules) {
        this.sync = modules.sync;
        this.api = modules.api;

        this.targets = {};

        // Listen for DB updates
        this.sync.onTargetsUpdated((data) => {
            this.targets = data || {};
            this.render();
        });
    }

    // --------------------------------------------------------
    // Main render
    // --------------------------------------------------------
    render() {
        const el = document.querySelector("#odin-tab-targets");
        if (!el) return;

        let rows = "";
        for (const id in this.targets) {
            const t = this.targets[id];
            rows += this.buildRow(t);
        }

        el.innerHTML = `
            <div class="wf-section">
                <h2 class="wf-title">Faction Targets</h2>

                <div class="wf-add-target">
                    <input id="wf-target-id" type="text" 
                        placeholder="Enter Player ID..." class="wf-input">
                    <button id="wf-add-target-btn" class="wf-button">
                        Add Target
                    </button>
                </div>

                <table class="wf-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Level</th>
                            <th>Notes</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        `;

        // Add target button
        document
            .getElementById("wf-add-target-btn")
            .addEventListener("click", () => this.addTarget());
    }

    // --------------------------------------------------------
    // Build a table row
    // --------------------------------------------------------
    buildRow(t) {
        return `
            <tr class="wf-row">
                <td>${t.id}</td>
                <td><a href="https://www.torn.com/profiles.php?XID=${t.id}" target="_blank">${t.name || 'Loading...'}</a></td>
                <td>${t.level || '-'}</td>
                <td>${t.note || ''}</td>
                <td>
                    <button class="wf-button wf-remove" data-id="${t.id}">
                        X
                    </button>
                </td>
            </tr>
        `;
    }

    // --------------------------------------------------------
    // Add a new target
    // --------------------------------------------------------
    async addTarget() {
        const input = document.getElementById("wf-target-id");
        if (!input) return;

        const id = parseInt(input.value.trim());
        if (!id) {
            alert("Invalid ID");
            return;
        }

        const data = await this.api.userProfile(id, "basic");
        if (data.error) {
            alert("Invalid user or Torn API error.");
            return;
        }

        const target = {
            id,
            name: data.name,
            level: data.level,
            note: "",
        };

        // Write to Firebase
        this.sync.addTarget(target);

        input.value = "";
        this.render();
    }

    // --------------------------------------------------------
    // Remove target
    // --------------------------------------------------------
    removeTarget(id) {
        this.sync.removeTarget(id);
    }
}

// Attach event delegation for removal
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("wf-remove")) {
        const id = e.target.getAttribute("data-id");
        const tab = window.__ODIN_TARGETS_TAB;
        if (tab) tab.removeTarget(id);
    }
});
