// ============================================================
// ODIN WARFATHER — War Tab
// Author: BjornOdinsson89 (https://www.torn.com/profiles.php?XID=3666214)
// Description: Real-time war overview, synced with Firebase.
// Displays:
//   • Active war enemy
//   • Live score (us vs them)
//   • Live war events (attacks, revives, chains, specials)
//   • War timer (if applicable)
//   • Push new war events (admin)
// ============================================================

export class WarfatherWarTab {

    constructor(modules) {
        this.sync = modules.sync;
        this.api = modules.api;
        this.faction = modules.faction;

        this.warState = {};
        this.enemyName = null;
        this.enemyID = null;
        this.warEvents = {};

        // Sync engine listeners
        this.sync.onWarState((state) => {
            this.warState = state || {};
            this.render();
        });

        this.sync.onWarEvents((events) => {
            this.warEvents = events || {};
            this.renderEvents();
        });
    }

    // --------------------------------------------------------
    // Main render function
    // --------------------------------------------------------
    render() {
        const el = document.querySelector("#odin-tab-war");
        if (!el) return;

        if (!this.warState.active) {
            el.innerHTML = `
                <div class="wf-section">
                    <h2 class="wf-title">War Status</h2>
                    <div>No active ranked war detected.</div>
                </div>
            `;
            return;
        }

        // Extract enemy details
        this.enemyID = this.warState.enemyFactionID || 0;
        this.enemyName = this.warState.enemyFaction || "Unknown";

        el.innerHTML = `
            <div class="wf-section">
                <h2 class="wf-title">
                    War vs ${this.enemyName} [${this.enemyID}]
                </h2>

                <div class="wf-subtitle">Live Score</div>

                <div class="wf-war-score">
                    <span class="wf-war-us">${this.warState.score?.us ?? 0}</span>
                    <span class="wf-war-sep">:</span>
                    <span class="wf-war-them">${this.warState.score?.them ?? 0}</span>
                </div>

                <div class="wf-subtitle">Recent War Events</div>
                <div id="wf-war-events" class="wf-war-events"></div>

                <button id="wf-push-war-event" class="wf-button">
                    Push Manual War Event
                </button>
            </div>
        `;

        // Bind manual push button
        document
            .getElementById("wf-push-war-event")
            .addEventListener("click", () => this.pushManualEvent());

        // Render events
        this.renderEvents();
    }

    // --------------------------------------------------------
    // Render war event list
    // --------------------------------------------------------
    renderEvents() {
        const container = document.querySelector("#wf-war-events");
        if (!container) return;

        const events = Object.values(this.warEvents)
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, 25); // only recent 25 for performance

        if (events.length === 0) {
            container.innerHTML = `<div class="wf-subtitle">No war events yet.</div>`;
            return;
        }

        let html = "";
        for (const e of events) {
            const ts = new Date(e.createdAt).toLocaleString();
            html += `
                <div class="wf-war-event">
                    <span class="wf-war-event-time">${ts}</span>
                    <span class="wf-war-event-text">${e.text || "(event)"}</span>
                </div>
            `;
        }

        container.innerHTML = html;
    }

    // --------------------------------------------------------
    // Manual event — useful for testing
    // --------------------------------------------------------
    pushManualEvent() {
        const text = prompt("Enter war event text:");
        if (!text) return;

        this.sync.pushWarEvent({
            text,
            type: "manual",
            at: Date.now()
        });
    }
}
