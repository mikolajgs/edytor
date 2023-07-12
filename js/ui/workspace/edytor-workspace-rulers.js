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
        bottom.setAttribute("flip", "true");
        this.appendChild(bottom);

        var left = document.createElement('canvas', { is: "edytor-ruler-vertical" });
        left.id = "ruler_left";
        this.appendChild(left);

        var right = document.createElement('canvas', { is: "edytor-ruler-vertical" });
        right.id = "ruler_right";
        right.setAttribute("flip", "true");
        this.appendChild(right);
    }

    setPosition(v, w, h) {
        this.style.top = (v - 30) + "px";
        this.style.left = (v - 30) + "px";

        document.getElementById("ruler_top").setPosition(30, 0);
        document.getElementById("ruler_bottom").setPosition(30, 30+h);
        document.getElementById("ruler_left").setPosition(0, 30);
        document.getElementById("ruler_right").setPosition(30+w, 30);
    }

    setSize(w, h) {
        this.style.width = (w + 2 * 30) + "px";
        this.style.height = (h + 2 * 30) + "px";

        document.getElementById("ruler_top").setSize(w, 30);
        document.getElementById("ruler_bottom").setSize(w, 30);
        document.getElementById("ruler_left").setSize(30, h);
        document.getElementById("ruler_right").setSize(30, h);
    }
}

window.customElements.define("edytor-workspace-rulers", EdytorWorkspaceRulers);
