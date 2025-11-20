// ============================================================
// ODIN WARFATHER — Faction Tab
// Author: BjornOdinsson89 (https://www.torn.com/profiles.php?XID=3666214)
// Description: Hybrid faction roster with watcher integration
// ============================================================

export class WarfatherFactionTab {

    constructor(modules) {
        this.sync = modules.sync;
        this.api = modules.api;
        this.faction = modules.faction;

        // Bind engine updates to GUI refresh
        this.faction.onRosterUpdate = () => this.render();
        this.faction.onWatcherUpdate = () => this.render();

        // Start streaming watcher updates
        this.faction.bindWatcherStream();
    }

    // --------------------------------------------------------
    // Render entire roster table
    // --------------------------------------------------------
    render() {
        const el = document.querySelector("#odin-tab-faction");
        if (!el) return;

        const roster = this.faction.getRosterForGUI();

        let rows = "";
        for (const m of roster) {
            rows += this.buildRow(m);
        }

        el.innerHTML = `
            <div class="wf-section">
                <h2 class="wf-title">
                    Faction Roster
                    <button id="wf-toggle-watcher" class="wf-button">
                        Toggle Chain Watcher
                    </button>
                </h2>

                <table class="wf-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Level</th>
                            <th>Status</th>
                            <th>Watcher</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        `;

        // Bind the watch toggle button (for YOU)
        document
            .getElementById("wf-toggle-watcher")
            .addEventListener("click", () => {
                this.faction.toggleMyWatcher();
            });
    }

    // --------------------------------------------------------
    // Build a single row
    // --------------------------------------------------------
    buildRow(m) {
        const statusColor = this.getStatusColor(m.status);

        // Glowing watcher icon
        const watcherIcon = m.watcher
            ? `<span class="wf-watcher-glow"></span>`
            : `<span class="wf-watcher-off"></span>`;

        return `
            <tr class="wf-row">
                <td><a href="https://www.torn.com/profiles.php?XID=${m.id}" target="_blank">${m.name}</a></td>
                <td>${m.level}</td>
                <td style="color:${statusColor}">${m.status}</td>
                <td>${watcherIcon}</td>
            </tr>
        `;
    }

    // --------------------------------------------------------
    // Status → color
    // --------------------------------------------------------
    getStatusColor(s) {
        if (s === "online") return "#00ff66";
        if (s === "hospital") return "#ff4444";
        if (s === "travel") return "#3399ff";
        return "#999";
    }
}
