class EdytorShapeTool extends EdytorTool {
    RequiresPad = true;

    constructor() {
        super();
    }

    connectedCallback() {
        super._init('shape', 'fa-shapes', 'Shape');
        super._addProperty("Style", "style", "", {
            "stroke": "stroke",
            "fill": "fill",
            "stroke+fill": "stroke+fill"
        });
        super._addProperty("Width", "width", "3", null);
        super._addProperty("Linecap", "linecap", "", {
            "butt": "butt",
            "square": "square",
            "round": "round"
        });
        super._addProperty("Linejoin", "linejoin", "", {
            "miter": "miter",
            "round": "round",
            "bevel": "bevel"
        });
        super._addProperty("Corners", "corners", "", {
            "normal": "normal",
            "rounded": "rounded",
        });
        super._addProperty("Radii", "corner_radii", "3 3 3 3", null);
    }

    __toggleOn() {
        super.__toggleOn();
    }

    __toggleOff() {
        super.__toggleOff();
    }
}

window.customElements.define("edytor-tool-shape", EdytorShapeTool);