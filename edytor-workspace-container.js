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

        var select = document.createElement('canvas', { is: "edytor-select" });
        this.appendChild(select);

        var pad = document.createElement('canvas', { is: "edytor-pad" });
        this.appendChild(pad);
    }

    setPosition(v) {
        this.style.top = v + "px";
        this.style.left = v + "px";
    }

    setSize(w, h) {
        this.style.width = w + "px";
        this.style.height = h + "px";

        document.getElementById("layer_container").setSize(w, h);
        document.getElementById("grid_layer").setSize(w, h);
        document.getElementById("select_layer").setSize(w, h);
        document.getElementById("pad_layer").setSize(w, h);
    }
}

window.customElements.define("edytor-workspace-container", EdytorWorkspaceContainer);
