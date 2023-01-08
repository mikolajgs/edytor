class EdytorMoveTool extends EdytorTool {
    RequiresPad = true;

    constructor() {
        super();
    }

    connectedCallback() {
        super._init('move', 'fa-up-down-left-right', 'Move');
        super._addProperty("stroke", "Width", "width", "3", null);
        super._addProperty("stroke", "Opacity", "opacity", "100%", null);
        super._addProperty("stroke", "Linecap", "linecap", "", {
            "butt": "butt",
            "square": "square",
            "round": "round"
        });
        super._addProperty("stroke", "Linejoin", "linejoin", "", {
            "miter": "miter",
            "round": "round",
            "bevel": "bevel"
        });
        super._addProperty("stroke", "Dasharray", "dasharray", "5", null);
    }

    __toggleOn() {
        super.__toggleOn();
    }

    __toggleOff() {
        super.__toggleOff();
    }
}

window.customElements.define("edytor-tool-move", EdytorMoveTool);