class EdytorMagicWandTool extends EdytorTool {
    RequiresPad = true;

    constructor() {
        super();
    }

    connectedCallback() {
        super._init('magic_wand', 'fa-wand-magic-sparkles', 'Magic Wand');
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

    toggleOn() {
        super.toggleOn();
    }

    toggleOff() {
        super.toggleOff();
    }
}

window.customElements.define("edytor-tool-magic-wand", EdytorMagicWandTool);
