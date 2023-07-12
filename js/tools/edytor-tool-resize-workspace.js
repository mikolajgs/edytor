class EdytorResizeWorkspaceTool extends EdytorTool {
    RequiresPad = true;

    constructor() {
        super();
    }

    connectedCallback() {
        super._init('resize-workspace', 'fa-arrows-left-right', 'Resize');
        super._addProperty("Operation", "operation", "", {
            "extend_side": "extend",
            "shrink_side": "shrink",
            "scale": "scale"
        }, {
            "extend_side": ["side", "value"],
            "shrink_side": ["side", "value"],
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
            var v = parseInt(self.__getProperty("value"));
            var w = parseInt(self.__getProperty("width"));
            var h = parseInt(self.__getProperty("height"));
            var s = self.__getProperty("side");
            if (self.__getProperty("operation") == "extend_side") {
                if (!isNaN(v)) {
                    document.getElementById('edytor').__extendWorkspaceSide(s, v);
                } else {
                    document.getElementById("edytor").__showError("Invalid value");
                }
            } else if (self.__getProperty("operation") == "shrink_side") {
                if (!isNaN(v)) {
                    document.getElementById('edytor').__shrinkWorkspaceSide(s, v);
                } else {
                    document.getElementById("edytor").__showError("Invalid value");
                }
            } else {
                if (!isNaN(w) && !isNaN(h)) {
                    document.getElementById('edytor').__scaleWorkspace(w, h);
                } else {
                    document.getElementById("edytor").__showError("Invalid width or height");
                }
            }
        });
    }

    isMultiClick() {
        return false;
    }

    toggleOn() {
        super.toggleOn();
    }

    toggleOff() {
        super.toggleOff();
    }


    __getProperty(name) {
        return super._getProperty(name);
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
