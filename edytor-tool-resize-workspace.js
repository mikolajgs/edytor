class EdytorResizeWorkspaceTool extends EdytorTool {
    RequiresPad = false;

    constructor() {
        super();
    }

    __isMultiClick() {
        return false;
    }

    connectedCallback() {
        super._init('resize-workspace', 'fa-arrows-left-right', 'Resize');
        super._addProperty("Operation", "operation", "", {
            "extend_side": "extend",
            "shrink_size": "shrink",
            "scale": "scale"
        }, {
            "extend_side": ["side", "value"],
            "shrink_size": ["side", "value"],
            "scale": ["width", "height"],
            "_": ["side", "value", "width", "height"]
        }, false);
        super._addProperty("Side", "side", "", {
            "left": "left",
            "top": "top",
            "right": "right",
            "bottom": "bottom"
        }, null, false);
        super._addProperty("Value", "value", "50", null, null, false);
        super._addProperty("Width", "width", "1920", null, null, true);
        super._addProperty("Height", "height", "1080", null, null, true);
        var self = this;
        super._addButton("Resize", function () {
        });
    }

    __getProperty(name) {
        return super._getProperty(name);
    }

    __toggleOn() {
        super.__toggleOn();
    }

    __toggleOff() {
        super.__toggleOff();
    }

    __drawStart(x, y, shiftKey, altKey) {
        return false;
    }

    __drawPoint(x, y) {
        return false;
    }

    __drawMove(x, y, shiftKey, altKey) {
        return false;
    }

    __drawEnd(x, y, shiftKey, altKey) {
        return false;
    }

    __drawCancel() {
        return false;
    }
}

window.customElements.define("edytor-tool-resize-workspace", EdytorResizeWorkspaceTool);
