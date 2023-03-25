class EdytorWorkspaceContainer extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.style.margin = 0;
        this.style.padding = 0;
        this.style.display = "block";
        this.style.position = "absolute";
        this.style.top = "0";
        this.style.left = "0";
        this.id = "workspace_container";

        var layerContainer = document.createElement("edytor-layer-container");
        this.appendChild(layerContainer);

        var grid = document.createElement('canvas', { is: "edytor-grid" });
        this.appendChild(grid);

        var pad = document.createElement('canvas', { is: "edytor-pad" });
        this.appendChild(pad);
    }

    SetPosition(v) {
        this.style.top = v + "px";
        this.style.left = v + "px";
    }

    SetSize(w, h) {
        this.style.width = w + "px";
        this.style.height = h + "px";

        document.getElementById("layer_container").SetSize(w, h);
        document.getElementById("grid_layer").SetSize(w, h);
        document.getElementById("pad_layer").SetSize(w, h);
    }
}

window.customElements.define("edytor-workspace-container", EdytorWorkspaceContainer);
