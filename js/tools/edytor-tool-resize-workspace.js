class EdytorResizeWorkspaceTool extends EdytorTool {
    RequiresPad = true;

    isMultiClick() {
        return false;
    }


    constructor() {
        super();
    }

    connectedCallback() {
        super.init('resize-workspace', 'fa-arrows-left-right', 'Resize');
        super.addProperty("Operation", "operation", "", {
            "extend_side": "extend",
            "shrink_side": "shrink",
            "scale": "scale"
        }, {
            "extend_side": ["side", "value"],
            "shrink_side": ["side", "value"],
            "scale": ["width", "height"],
            "_": ["side", "value", "width", "height"]
        }, false);
        super.addProperty("Side", "side", "", {
            "left": "left",
            "top": "top",
            "right": "right",
            "bottom": "bottom"
        }, null, false);
        super.addProperty("Value", "value", "50", null, null, false);
        super.addProperty("Width", "width", "1920", null, null, true);
        super.addProperty("Height", "height", "1080", null, null, true);
        var self = this;
        super.addButton("Resize", function () {
            var v = parseInt(self.__getProperty("value"));
            var w = parseInt(self.__getProperty("width"));
            var h = parseInt(self.__getProperty("height"));
            var s = self.getProperty("side");
            if (self.ggetProperty("operation") == "extend_side") {
                if (!isNaN(v)) {
                    document.getElementById('edytor').extendWorkspaceSide(s, v);
                } else {
                    document.getElementById("edytor").showError("Invalid value");
                }
            } else if (self.getProperty("operation") == "shrink_side") {
                if (!isNaN(v)) {
                    document.getElementById('edytor').shrinkWorkspaceSide(s, v);
                } else {
                    document.getElementById("edytor").showError("Invalid value");
                }
            } else {
                if (!isNaN(w) && !isNaN(h)) {
                    document.getElementById('edytor').scaleWorkspace(w, h);
                } else {
                    document.getElementById("edytor").showError("Invalid width or height");
                }
            }
        });
    }


    toggleOn() {
        super.toggleOn();
    }

    toggleOff() {
        super.toggleOff();
    }


    getProperty(name) {
        return super._getProperty(name);
    }


    startedCallback(x, y) {
        return false;
    }

    movedCallback(x, y, shiftKey, altKey) {
        return false;
    }

    endedCallback(x, y, shiftKey, altKey) {
        return false;
    }

    cancelledCallback() {
        return false;
    }

    selectedCallback() {
        return false;
    }
}

window.customElements.define("edytor-tool-resize-workspace", EdytorResizeWorkspaceTool);
