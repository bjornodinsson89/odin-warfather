// ==UserLibrary==
// @name         odin-gui
// @version      1.0.0
// @description  Odin GUI drawer and overlay buttons module
// @author       BjornOdinsson89
// @license      MIT
// ==/UserLibrary==

/* ============================================================
   ODIN GUI MODULE — DRAWER + BUTTON OVERLAYS
   ============================================================ */

class OdinGUI {
  constructor(options = {}) {
    this.side = options.side || "right";
    this.width = options.width || 280;
    this.ember = options.ember ?? true;
    this._build();
    this._createTargetButton();
  }

  /* ------------------------------
     Build the logo trigger + drawer
     ------------------------------ */
  _build() {
    // --- Logo trigger ---
    this.trigger = document.createElement("div");
    this.trigger.id = "odin-ui-trigger";
    this.trigger.title = "Open Odin Drawer";
    this.trigger.style.cssText = `
      position:fixed;top:18px;right:30px;
      width:40px;height:40px;border-radius:50%;
      background:url('https://i.postimg.cc/CnBrnNYV/Logo.png') no-repeat center/contain;
      box-shadow:0 0 8px rgba(255,0,0,0.5);
      cursor:pointer;z-index:99999;
      transition:transform .2s,box-shadow .3s;
    `;
    this.trigger.onmouseenter = () =>
      (this.trigger.style.transform = "scale(1.1)");
    this.trigger.onmouseleave = () =>
      (this.trigger.style.transform = "scale(1)");
    this.trigger.onclick = () => this.toggle();

    // --- Drawer ---
    this.drawer = document.createElement("div");
    this.drawer.id = "odin-ui-drawer";
    this.drawer.style.cssText = `
      position:fixed;${this.side}:-${this.width}px;top:70px;
      width:${this.width}px;height:70%;
      background:linear-gradient(145deg,#222,#0f0f0f);
      border-radius:8px 0 0 8px;
      border:2px solid #700;color:#ddd;
      box-shadow:0 0 20px rgba(255,0,0,0.3);
      overflow:hidden;z-index:99998;
      transition:all .35s;
    `;
    this.drawer.innerHTML = `
      <div class="odin-ui-tabs">
        <button data-tab="dash"><img src="https://i.postimg.cc/RW6CVr2D/Dashboard.png"/><span>Dash</span></button>
        <button data-tab="war"><img src="https://i.postimg.cc/R6Mzt2bL/War.png"/><span>War</span></button>
        <button data-tab="faction"><img src="https://i.postimg.cc/5Y9ZyL6t/Faction.png"/><span>Faction</span></button>
        <button data-tab="chain"><img src="https://i.postimg.cc/CzZpbGJf/Chain.png"/><span>Chain</span></button>
        <button data-tab="targets"><img src="https://i.postimg.cc/NKhSTWKq/Targets.png"/><span>Targets</span></button>
        <button data-tab="console"><img src="https://i.postimg.cc/rRjbkm8R/Console.png"/><span>Console</span></button>
        <button data-tab="settings">⚙️<span>Settings</span></button>
      </div>
      <div class="odin-ui-content"></div>
      <div class="odin-ui-resize"></div>
    `;

    document.body.append(this.trigger, this.drawer);

    // Tab logic
    this.tabs = this.drawer.querySelectorAll(".odin-ui-tabs button");
    this.content = this.drawer.querySelector(".odin-ui-content");
    this.tabs.forEach((btn) =>
      btn.addEventListener("click", () => this.switchTab(btn.dataset.tab))
    );

    // Resize handle
    const handle = this.drawer.querySelector(".odin-ui-resize");
    handle.style.cssText = `
      position:absolute;top:0;right:0;width:6px;height:100%;
      cursor:ew-resize;background:transparent;
    `;
    let resizing = false,
      startX = 0,
      startW = 0;
    handle.addEventListener("mousedown", (e) => {
      resizing = true;
      startX = e.clientX;
      startW = this.drawer.offsetWidth;
    });
    window.addEventListener("mousemove", (e) => {
      if (!resizing) return;
      const dx = startX - e.clientX;
      this.drawer.style.width = startW + dx + "px";
    });
    window.addEventListener("mouseup", () => (resizing = false));

    this._injectStyles();
    this.switchTab("dash");
  }

  /* ------------------------------
     Drawer open / close
     ------------------------------ */
  toggle(force) {
    const dir = this.side;
    const open = force ?? !this.drawer.classList.contains("open");
    this.drawer.classList.toggle("open", open);
    this.drawer.style[dir] = open ? "0" : `-${this.drawer.offsetWidth}px`;
  }

  switchTab(tab) {
    this.tabs.forEach((b) =>
      b.classList.toggle("active", b.dataset.tab === tab)
    );
    this.content.innerHTML = `
      <div class="odin-ui-tab">
        <h3>${tab.toUpperCase()}</h3>
        <div class="odin-ui-tab-body">/* TODO: render ${tab} data here */</div>
      </div>`;
    if (this._onTabChange) this._onTabChange(tab);
  }

  onTabChange(cb) {
    this._onTabChange = cb;
  }

  /* ------------------------------
     Optional Add-to-Target button
     ------------------------------ */
  _createTargetButton() {
    const btn = document.createElement("div");
    btn.id = "odin-target-overlay";
    btn.title = "Add to Targets";
    btn.style.cssText = `
      position:fixed;bottom:40px;right:40px;
      width:36px;height:36px;border-radius:50%;
      background:url('https://i.postimg.cc/NKhSTWKq/Targets.png') no-repeat center/contain;
      box-shadow:0 0 10px rgba(255,0,0,0.5);
      cursor:pointer;z-index:99999;
      transition:transform .2s, box-shadow .3s;
    `;
    btn.onclick = () => {
      btn.classList.toggle("active");
      // TODO: connect to your TargetEngine or backend here
    };
    btn.onmouseenter = () => (btn.style.transform = "scale(1.1)");
    btn.onmouseleave = () => (btn.style.transform = "scale(1)");

    const s = document.createElement("style");
    s.textContent = `
      #odin-target-overlay.active {
        box-shadow:0 0 14px #f00,inset 0 0 8px #900;
      }`;
    document.head.appendChild(s);
    document.body.appendChild(btn);
  }

  /* ------------------------------
     Inject shared CSS
     ------------------------------ */
  _injectStyles() {
    if (document.getElementById("odin-ui-styles")) return;
    const s = document.createElement("style");
    s.id = "odin-ui-styles";
    s.textContent = `
      .odin-ui-tabs{
        display:flex;justify-content:space-around;background:#181818;
        border-bottom:1px solid #700;padding:6px;
      }
      .odin-ui-tabs button{
        background:none;border:none;cursor:pointer;color:#aaa;font-size:12px;
        display:flex;flex-direction:column;align-items:center;
        transition:transform .2s,color .3s;
      }
      .odin-ui-tabs button img{width:22px;height:22px;}
      .odin-ui-tabs button.active,.odin-ui-tabs button:hover{
        color:#f44;transform:translateY(-2px);
      }
      .odin-ui-content{flex:1;padding:10px;overflow:auto;position:relative;z-index:2;}
      #odin-ui-drawer::before{
        content:'';position:absolute;inset:0;
        background:url('data:image/svg+xml;utf8,\
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">\
          <defs><pattern id="braid" width="40" height="40" patternUnits="userSpaceOnUse">\
          <path d="M0,20 Q10,0 20,20 T40,20 M0,20 Q10,40 20,20 T40,20" stroke="%23f00" stroke-width="1.5" fill="none" opacity="0.3"/>\
          </pattern></defs>\
          <rect width="100%" height="100%" fill="url(%23braid)">\
          <animate attributeName='x' from='0' to='40' dur='10s' repeatCount='indefinite'/>\
          </rect></svg>') repeat;
        pointer-events:none;animation:braidFlow 10s linear infinite;
      }
      @keyframes braidFlow{0%{background-position:0 0;}100%{background-position:40px 0;}}
      .odin-ui-tab-body{padding:6px;color:#ddd;font-size:14px;}
    `;
    document.head.appendChild(s);
  }
}
