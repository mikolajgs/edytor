class EdytorColorPickerTool extends EdytorTool {
    RequiresPad = true;

    isMultiClick() {
        return false;
    }


    constructor() {
        super();
    }

    connectedCallback() {
        super.init('color_picker', 'fa-eye-dropper', 'Color Picker');
    }

    
    toggleOn() {
        super.toggleOn();
    }

    toggleOff() {
        super.toggleOff();
    }


    startedCallback(x, y) {
        document.getElementById("edytor").selectColourFromXY("fg", x, y);
    }

    movedCallback(x, y, shiftKey, altKey) {
        document.getElementById("edytor").selectColourFromXY("fg", x, y);
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

window.customElements.define("edytor-tool-color-picker", EdytorColorPickerTool);