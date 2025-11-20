// Odin Warfather — Sync Engine
// Handles multi-faction real-time sync via Firebase Realtime Database
// Author: BjornOdinsson89 (https://www.torn.com/profiles.php?XID=3666214)

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
        this.state = state;

        this.app = firebase.initializeApp(firebaseConfig);
        firebase.auth().signInAnonymously().catch(err => console.error("Auth error:", err));
        this.db = firebase.database();

        this._bootstrapFaction();
    }

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

        ref.on("value", snap => callback(snap.val() || {}));
    }

    removeTarget(playerID) {
        const fID = this.state.factionID;
        const ref = this.db.ref(`factions/${fID}/targets/${playerID}`);
        return ref.remove();
    }

    /* ============================================================
       WAR SYNC
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
        const ref = this.db.ref(`factions/${f
