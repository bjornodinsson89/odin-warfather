// Odin Warfather — Sync Engine
// Handles multi-faction real-time sync via Firebase Realtime Database
// Author: BjornOdinsson89

/* ============================================================
   CONFIG (you will replace values using your Firebase console)
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
   INITIALIZATION
   ============================================================ */

class WarfatherSync {

    constructor(state) {
        // state = { userID, factionID, playername }
        this.state = state;

        // Initialize Firebase App
        this.app = firebase.initializeApp(firebaseConfig);
        this.db = firebase.database();

        // Create faction namespace if missing
        this._bootstrapFaction();
    }

    /* -----------------------------------------------------------
       Create faction root node automatically if missing
       ----------------------------------------------------------- */

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
                    members: {}
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

        const ref = this.db.ref(`factions/${fID}/targets/${target.id}`);

        return ref.set({
            ...target,
            factionID: fID,
            updatedBy: this.state.userID,
            updatedAt: Date.now()
        });
    }

    onTargetsUpdated(callback) {
        const fID = this.state.factionID;
        const ref = this.db.ref(`factions/${fID}/targets`);

        ref.on("value", snap => {
            callback(snap.val() || {});
        });
    }

    removeTarget(playerID) {
        const fID = this.state.factionID;
        const ref = this.db.ref(`factions/${fID}/targets/${playerID}`);
        return ref.remove();
    }

    /* ============================================================
       WAR SYNC (war timeline + war state)
       ============================================================ */

    pushWarEvent(eventObj) {
        const fID = this.state.factionID;
        const ref = this.db.ref(`factions/${fID}/war/events`).push();

        return ref.set({
            ...eventObj,
            factionID: fID,
            createdAt: Date.now(),
            createdBy: this.state.userID
        });
    }

    onWarEvents(callback) {
        const fID = this.state.factionID;
        const ref = this.db.ref(`factions/${fID}/war/events`);

        ref.on("value", snap => callback(snap.val() || {}));
    }

    updateWarState(stateObj) {
        const fID = this.state.factionID;
        const ref = this.db.ref(`factions/${fID}/war/state`);

        return ref.set({
            ...stateObj,
            factionID: fID,
            updatedBy: this.state.userID,
            updatedAt: Date.now()
        });
    }

    onWarState(callback) {
        const fID = this.state.factionID;
        const ref = this.db.ref(`factions/${fID}/war/state`);
        ref.on("value", snap => callback(snap.val() || {}));
    }

    /* ============================================================
       CHAIN SYNC
       ============================================================ */

    updateChainStatus(chainObj) {
        const fID = this.state.factionID;
        const ref = this.db.ref(`factions/${fID}/chain/status`);

        return ref.set({
            ...chainObj,
            factionID: fID,
            updatedBy: this.state.userID,
            updatedAt: Date.now()
        });
    }

    onChainStatus(callback) {
        const fID = this.state.factionID;
        const ref = this.db.ref(`factions/${fID}/chain/status`);
        ref.on("value", snap => callback(snap.val() || {}));
    }

    /* ============================================================
       MEMBER ACTIVITY SYNC
       ============================================================ */

    updateMemberActivity(activityObj) {
        const fID = this.state.factionID;
        const uID = this.state.userID;

        const ref = this.db.ref(`factions/${fID}/members/${uID}`);

        return ref.set({
            ...activityObj,
            factionID: fID,
            userID: uID,
            updatedAt: Date.now()
        });
    }

    onMembersUpdated(callback) {
        const fID = this.state.factionID;
        const ref = this.db.ref(`factions/${fID}/members`);
        ref.on("value", snap => callback(snap.val() || {}));
    }

    /* ============================================================
       NOTES / BROADCASTS
       ============================================================ */

    pushFactionNote(noteObj) {
        const fID = this.state.factionID;
        const ref = this.db.ref(`factions/${fID}/notes`).push();

        return ref.set({
            ...noteObj,
            factionID: fID,
            createdBy: this.state.userID,
            createdAt: Date.now()
        });
    }

    onNotes(callback) {
        const fID = this.state.factionID;
        const ref = this.db.ref(`factions/${fID}/notes`);
        ref.on("value", snap => callback(snap.val() || {}));
    }
}

// Export global for other modules
window.WarfatherSync = WarfatherSync;
