class EdytorNewWorkspaceTool extends EdytorTool {
    RequiresPad = true;

    isMultiClick() {
        return false;
    }


    constructor() {
        super();
    }

    connectedCallback() {
        super.init('new-workspace', 'fa-file', 'New');
        super.addProperty("Width", "width", "1920", null, null, false);
        super.addProperty("Height", "height", "1080", null, null, false);
        var self = this;
        super.addButton("Start new image", function () {
            var w = parseInt(self.getProperty("width"));
            var h = parseInt(self.getProperty("height"));
            if (!isNaN(w) && !isNaN(h)) {
                document.getElementById('edytor').newWorkspace(w, h, 400);
            } else {
                document.getElementById("edytor").showError("Invalid width or height");
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
        return super.getProperty(name);
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

window.customElements.define("edytor-tool-new-workspace", EdytorNewWorkspaceTool);
