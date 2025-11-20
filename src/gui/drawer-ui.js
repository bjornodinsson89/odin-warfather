// ============================================================
// ODIN WARFATHER — Drawer UI System
// Author: BjornOdinsson89
// Description:
//     - Inserts WarFather button into Torn header
//     - Controls drawer slide left/right
//     - Resizable drawer
//     - Detachable floating window mode
//     - Saves state via GM storage
// ============================================================

(function() {

class WarfatherDrawer {

    constructor() {
        this.side = GM_getValue("wf_drawer_side", "left");
        this.size = GM_getValue("wf_drawer_width", 340);
        this.detached = GM_getValue("wf_drawer_detached", false);
        this.position = GM_getValue("wf_detach_position", { x: 100, y: 100 });

        this.root = null;
        this.headerBtn = null;
    }

    init() {
        this.injectHeaderButton();
        this.createDrawer();
        this.applyMode();
    }

    injectHeaderButton() {
        const nav = document.querySelector("#headerRoot .header__right #navigation");
        if (!nav) return setTimeout(() => this.injectHeaderButton(), 250);

        const btn = document.createElement("div");
        btn.id = "wf-header-btn";
        btn.className = "wf-header-btn";
        btn.innerHTML = `
            <img src="https://raw.githubusercontent.com/bjornodinsson89/odin-warfather/main/src/gui/icons/bear32.png"
                 width="32" height="32" />
        `;
        btn.onclick = () => this.toggleDrawer();

        nav.appendChild(btn);
        this.headerBtn = btn;
    }

    createDrawer() {
        const drawer = document.createElement("div");
        drawer.id = "wf-drawer";
        drawer.className = "wf-drawer";
        drawer.style.width = this.size + "px";

        drawer.innerHTML = `
            <div id="wf-drawer-resize" class="wf-resizer"></div>
            <div id="wf-drawer-tabs" class="wf-tabs"></div>
            <div id="wf-drawer-content" class="wf-content"></div>
        `;

        document.body.appendChild(drawer);
        this.root = drawer;

        this.enableResize();
    }

    toggleDrawer() {
        this.root.classList.toggle("wf-open");
    }

    registerTab(key, label, icon, callback) {
        const tab = document.createElement("div");
        tab.className = "wf-tab-btn";
        tab.innerHTML = `<img src="${icon}" /><span>${label}</span>`;
        tab.onclick = () => callback();
        document.querySelector("#wf-drawer-tabs").appendChild(tab);
    }

    enableResize() {
        const resizer = document.getElementById("wf-drawer-resize");
        let active = false;

        resizer.addEventListener("mousedown", (e) => {
            active = true;
            e.preventDefault();
        });

        window.addEventListener("mousemove", (e) => {
            if (!active) return;
            let w = this.side === "left"
                ? e.clientX
                : window.innerWidth - e.clientX;
            w = Math.max(220, Math.min(550, w));
            this.root.style.width = w + "px";
            GM_setValue("wf_drawer_width", w);
        });

        window.addEventListener("mouseup", () => active = false);
    }

    setSide(side) {
        this.side = side;
        GM_setValue("wf_drawer_side", side);
        this.applyMode();
    }

    setDetached(detached) {
        this.detached = detached;
        GM_setValue("wf_drawer_detached", detached);
        this.applyMode();
    }

    applyMode() {
        const d = this.root;
        if (!d) return;

        d.classList.remove("wf-left", "wf-right", "wf-detached");

        if (this.detached) {
            d.classList.add("wf-detached");
            d.style.left = this.position.x + "px";
            d.style.top = this.position.y + "px";
        } else {
            d.classList.add(this.side === "left" ? "wf-left" : "wf-right");
        }
    }
}

unsafeWindow.OdinWarDrawer = new WarfatherDrawer();

})();
