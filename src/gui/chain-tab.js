export class WarfatherChainTab {

    constructor(modules) {
        this.sync = modules.sync;
        this.api = modules.api;
        this.faction = modules.faction;

        this.chain = {};
        this.timerInterval = null;

        this.sync.onChainStatus((data) => {
            this.chain = data || {};
            this.render();
        });

        this.faction.onWatcherUpdate = () => this.render();
    }

    render() {
        const el = document.querySelector("#odin-tab-chain");
        if (!el) return;

        const chain = this.chain || {};

        const hits = chain.hits ?? 0;
        const max = chain.max ?? 100;
        const xp = chain.xp ?? 0;
        const timeLeft = chain.timeout ?? 0;

        const roster = this.faction.getRosterForGUI();
        const watchers = roster.filter(m => m.watcher === true).length;
        const online = roster.filter(m => m.status === "online").length;

        el.innerHTML = `
            <div class="wf-section">
                <h2 class="wf-title">Faction Chain</h2>

                <div class="wf-chain-stats">
                    <div><strong>Hits:</strong> ${hits} / ${max}</div>
                    <div><strong>XP:</strong> ${xp}</div>
                    <div><strong>Watchers:</strong> ${watchers}</div>
                    <div><strong>Online:</strong> ${online}</div>
                </div>

                <h3 class="wf-subtitle">Time Remaining</h3>
                <div id="wf-chain-timer" class="wf-chain-timer">00:00</div>

                <hr>

                <h3 class="wf-subtitle">Actions</h3>
                <button id="wf-refresh-chain" class="wf-button">Refresh Chain</button>
            </div>
        `;

        document
            .getElementById("wf-refresh-chain")
            .addEventListener("click", () => this.refreshChain());

        this.startTimer(timeLeft);
    }

    async refreshChain() {
        const fid = this.sync.state.factionID;
        const data = await this.api.request(`faction/${fid}`, "&selections=chain", { force: true });

        if (!data.error) {
            this.sync.updateChainStatus(data.chain || {});
        }
    }

    startTimer(seconds) {
        if (this.timerInterval) clearInterval(this.timerInterval);

        const el = document.getElementById("wf-chain-timer");
        if (!el) return;

        const update = () => {
            if (seconds <= 0) {
                el.textContent = "00:00";
                clearInterval(this.timerInterval);
                return;
            }

            const m = Math.floor(seconds / 60).toString().padStart(2, "0");
            const s = Math.floor(seconds % 60).toString().padStart(2, "0");
            el.textContent = `${m}:${s}`;
            seconds -= 1;
        };

        update();
        this.timerInterval = setInterval(update, 1000);
    }
}

// EXPORT CORRECT TAB CLASS
window.WarfatherChainTab = WarfatherChainTab;
