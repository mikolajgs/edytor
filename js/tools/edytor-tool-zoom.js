class EdytorZoomTool extends EdytorTool {
    RequiresPad = true;

    isMultiClick() {
        return false;
    }


    constructor() {
        super();
    }

    connectedCallback() {
        super.init('zoom', 'fa-magnifying-glass', "Zoom");
    }


    toggleOn() {
        super.toggleOn();
    }

    toggleOff() {
        super.toggleOff();
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

window.customElements.define("edytor-tool-zoom", EdytorZoomTool);