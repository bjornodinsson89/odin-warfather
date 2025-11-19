// ============================================================
//  ODIN WARFATHER — SMARTAPI v3 ENGINE (Connected Version)
//  Author: BjornOdinsson89 (https://www.torn.com/profiles.php?XID=3666214)
// ============================================================

import { WarfatherSync } from './engines/sync-engine.js';

class SmartAPI {
    constructor(apiKey, sync, options = {}) {
        this.apiKey = apiKey;
        this.sync = sync; // <-- CONNECTED SYNC ENGINE
        this.base = "https://api.torn.com";
        this.ttl = options.ttl || 5000;
        this.cache = new Map();
        this.logEnabled = true;
    }

    log(...a) {
        if (this.logEnabled) console.log("%c[SmartAPI]", "color:#f55", ...a);
    }

    async request(endpoint, params = "", opts = {}) {
        const url = `${this.base}/${endpoint}?key=${this.apiKey}${params}`;
        const key = url;
        const now = Date.now();

        const cached = this.cache.get(key);
        if (!opts.force && cached && now - cached.time < this.ttl) {
            return cached.data;
        }

        try {
            const res = await fetch(url);
            const data = await res.json();

            if (!data.error) {
                this.cache.set(key, { time: now, data });
            }

            return data;
        } catch (e) {
            return { error: { code: 0, error: e.message }};
        }
    }

    // ------------------------------
    // INTEGRATED SYNC FEATURES
    // ------------------------------

    async updateWarState(fid) {
        const war = await this.request(`faction/${fid}`, "&selections=rankedwars");

        if (!war.error && this.sync) {
            this.sync.updateWarState(war);
        }

        return war;
    }

    async syncFactionMembers(fid) {
        const data = await this.request(`faction/${fid}`, "&selections=basic,members");

        if (!data.error && this.sync) {
            for (const id in data.members) {
                this.sync.updateMemberActivity({
                    userID: id,
                    name: data.members[id].name,
                    status: data.members[id].status?.state
                });
            }
        }

        return data;
    }

    async syncChainStatus(fid) {
        const data = await this.request(`faction/${fid}`, "&selections=chain");

        if (!data.error && this.sync) {
            this.sync.updateChainStatus(data.chain || {});
        }

        return data;
    }
}

window.SmartAPI = SmartAPI;
