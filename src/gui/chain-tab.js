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

    render() { /* ... unchanged ... */ }
    refreshChain() { /* ... unchanged ... */ }
    startTimer(seconds) { /* ... unchanged ... */ }
}

window.WarfatherChainTab = WarfatherChainTab;
