// Odin Warfather — Sync Engine
// Handles multi-faction real-time sync via Firebase Realtime Database
// Author: BjornOdinsson89 (https://www.torn.com/profiles.php?XID=3666214)

/* ============================================================
   FIREBASE CONFIG (replace with your values)
   ============================================================ */

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "odin-warfather-67d3b.firebaseapp.com",
    databaseURL: "https://odin-warfather-67d3b-default-rtdb.firebaseio.com",
    projectId: "odin-warfather-67d3b",
    storageBucket: "odin-warfather-67d3b.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

/* ============================================================
   WARFATHER SYNC ENGINE
   ============================================================ */

class WarfatherSync {

    constructor(state) {
        this.state = state;

        // Init Firebase
        this.app = firebase.initializeApp(firebaseConfig);

        // Anonymous Auth (required for rules)
        firebase.auth().signInAnonymously().catch(err =>
            console.error("Firebase Auth error:", err)
        );

        // DB Reference
        this.db = firebase.database();

        // Create faction namespace if missing
        this._bootstrapFaction();
    }

    /* ------------------------------------------------------------
       AUTO-CREATE FACTION NODE ON FIRST RUN
       ------------------------------------------------------------ */

    _bootstrapFaction() {
        const fID = this.state.factionID;
        const baseRef = this.db.ref(`factions/${fID}`);

        baseRef.once("value").then(snap => {
            if (!snap.exists()) {
                console.log(`[Warfather] Bootstrapping faction ${fID}.`);

                baseRef.set({
                    factionID: fID,
                    createdAt: Date.now(),
                    targets: {},
                    war: {},
                    chain: {},
                    notes: {},
                    members: {},
                    chainWatchers: {}
                });
            } else {
                console.log(`[Warfather] Faction ${fID} already exists.`);
            }
        });
    }

    /* ============================================================
       TARGET SYNC
       ============================================================ */

    addTarget(target) {
        const fID = this.state.factionID;

        return this.db.ref(`factions/${fID}/targets/${target.id}`).set({
            ...target,
            factionID: fID,
            updatedBy: this.state.userID,
            updatedAt: Date.now()
        });
    }

    onTargetsUpdated(callback) {
        const fID = this.state.factionID;

        this.db.ref(`factions/${fID}/targets`)
            .on("value", snap => callback(snap.val() || {}));
    }

    removeTarget(id) {
        const fID = this.state.factionID;
        return this.db.ref(`factions/${fID}/targets/${id}`).remove();
    }

    /* ============================================================
       WAR SYNC
       ============================================================ */

    pushWarEvent(evt) {
        const fID = this.state.factionID;

        return this.db.ref(`factions/${fID}/war/events`).push().set({
            ...evt,
            factionID: fID,
            createdAt: Date.now(),
            createdBy: this.state.userID
        });
    }

    onWarEvents(callback) {
        const fID = this.state.factionID;

        this.db.ref(`factions/${fID}/war/events`)
            .on("value", snap => callback(snap.val() || {}));
    }

    updateWarState(warState) {
        const fID = this.state.factionID;

        return this.db.ref(`factions/${fID}/war/state`).set({
            ...warState,
            factionID: fID,
            updatedAt: Date.now(),
            updatedBy: this.state.userID
        });
    }

    onWarState(callback) {
        const fID = this.state.factionID;

        this.db.ref(`factions/${fID}/war/state`)
            .on("value", snap => callback(snap.val() || {}));
    }

    /* ============================================================
       CHAIN STATUS SYNC
       ============================================================ */

    updateChainStatus(data) {
        const fID = this.state.factionID;

        return this.db.ref(`factions/${fID}/chain/status`).set({
            ...data,
            factionID: fID,
            updatedAt: Date.now()
        });
    }

    onChainStatus(callback) {
        const fID = this.state.factionID;

        this.db.ref(`factions/${fID}/chain/status`)
            .on("value", snap => callback(snap.val() || {}));
    }

    /* ============================================================
       MEMBER ACTIVITY SYNC
       ============================================================ */

    updateMemberActivity(activityObj) {
        const fID = this.state.factionID;
        const uID = this.state.userID;

        return this.db.ref(`factions/${fID}/members/${uID}`).update({
            ...activityObj,
            factionID: fID,
            userID: uID,
            updatedAt: Date.now()
        });
    }

    onMembersUpdated(callback) {
        const fID = this.state.factionID;

        this.db.ref(`factions/${fID}/members`)
            .on("value", snap => callback(snap.val() || {}));
    }

    /* ============================================================
       🔥 CHAIN WATCHER SYSTEM (NEW)
       ============================================================ */

    setChainWatcher(active) {
        const fID = this.state.factionID;
        const uID = this.state.userID;

        return this.db.ref(`factions/${fID}/chainWatchers/${uID}`).set({
            active,
            updatedAt: Date.now()
        });
    }

    onChainWatchersUpdated(callback) {
        const fID = this.state.factionID;

        this.db.ref(`factions/${fID}/chainWatchers`)
            .on("value", snap => callback(snap.val() || {}));
    }
}

/* ============================================================
   EXPORT
   ============================================================ */

updateWarState(stateObj) {
        const fID = this.state.factionID;
        const ref = this.db.ref(`factions/${fID}/war/state`);
        return ref.set(stateObj);
    }
}

// export to global scope
window.WarfatherSync = WarfatherSync;
