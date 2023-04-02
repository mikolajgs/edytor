class EdytorWorkspaceRulers extends HTMLElement {
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
        this.style.zIndex = 81;
        this.id = "workspace_rulers";

        var top = document.createElement('canvas', { is: "edytor-ruler-horizontal" });
        top.id = "ruler_top";
        this.appendChild(top);

        var bottom = document.createElement('canvas', { is: "edytor-ruler-horizontal" });
        bottom.id = "ruler_bottom";
        this.appendChild(bottom);

        var left = document.createElement('canvas', { is: "edytor-ruler-horizontal" });
        left.id = "ruler_left";
        this.appendChild(left);

        var right = document.createElement('canvas', { is: "edytor-ruler-horizontal" });
        right.id = "ruler_right";
        this.appendChild(right);
    }

    SetPosition(v) {
        this.style.top = (v - 30) + "px";
        this.style.left = (v - 30) + "px";
    }

    SetSize(w, h) {
        this.style.width = (w + 2 * 30) + "px";
        this.style.height = (h + 2 * 30) + "px";

        /*document.getElementById("layer_container").SetSize(w, h);
        document.getElementById("grid_layer").SetSize(w, h);
        document.getElementById("pad_layer").SetSize(w, h);*/
    }
}

window.customElements.define("edytor-workspace-rulers", EdytorWorkspaceRulers);
