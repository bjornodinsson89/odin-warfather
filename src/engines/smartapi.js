// ============================================================
// ODIN WARFATHER — SmartAPI Engine
// Author: BjornOdinsson89
// Description: Thin wrapper around Torn API with key validation.
// ============================================================

(function () {

class SmartAPI {
    constructor(apiKey, syncEngine = null) {
        this.key = apiKey || "";
        this.sync = syncEngine;
        this.base = "https://api.torn.com/";
    }

    // --------------------------------------------------------
    // Core request helper
    // endpoint: "user", "faction", "key", etc.
    // extra: string beginning with "&" or "?&"
    // opts: { force: true, noSync: true, ... }
    // --------------------------------------------------------
    async request(endpoint, extra = "", opts = {}) {
        if (!this.key) {
            throw new Error("No API key set in SmartAPI.");
        }

        const sep = endpoint.includes("?") ? "&" : "?";
        const url = `${this.base}${endpoint}${sep}key=${this.key}${extra}`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.error) {
            // You can expand this later with better handling
            console.warn("[SmartAPI] API Error:", data.error);
            throw data.error;
        }

        if (this.sync && !opts.noSync && typeof this.sync.handleApiResponse === "function") {
            try {
                this.sync.handleApiResponse(endpoint, data);
            } catch (e) {
                console.warn("[SmartAPI] Sync handler error:", e);
            }
        }

        return data;
    }

    // =========================================================
    // API KEY VALIDATION (Instance Wrapper)
    // Uses Torn endpoint:
    //   https://api.torn.com/key/?selections=info&key=XXXX
    // =========================================================
    async validateKey() {
        return SmartAPI.validateKeyStatic(this.key);
    }

    // =========================================================
    // STATIC: Validate arbitrary key string
    // Returns:
    //   { valid: true, user_id, access_level, permissions }
    //   or
    //   { valid: false, error, code, details? }
    // =========================================================
    static async validateKeyStatic(key) {
        if (!key || typeof key !== "string") {
            return {
                valid: false,
                error: "No key provided."
            };
        }

        const url = `https://api.torn.com/key/?selections=info&key=${encodeURIComponent(key)}`;

        try {
            const res = await fetch(url);
            const data = await res.json();

            if (data.error) {
                return {
                    valid: false,
                    error: data.error.error,
                    code: data.error.code
                };
            }

            return {
                valid: true,
                user_id: data.user_id,
                access_level: data.access_level,
                permissions: data.selections
            };

        } catch (e) {
            console.error("[SmartAPI] validateKeyStatic network error:", e);
            return {
                valid: false,
                error: "Network error contacting Torn API.",
                details: e
            };
        }
    }
}

window.SmartAPI = SmartAPI;

})();
