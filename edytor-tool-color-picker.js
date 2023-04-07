class EdytorColorPickerTool extends EdytorTool {
    RequiresPad = true;

    constructor() {
        super();
    }

    connectedCallback() {
        super._init('color_picker', 'fa-eye-dropper', 'Color Picker');
    }

    __isMultiClick() {
        return false;
    }

    __toggleOn() {
        super.__toggleOn();
    }

    __toggleOff() {
        super.__toggleOff();
    }

    __drawStart(x, y) {
        document.getElementById("edytor").__selectColourFromXY("fg", x, y);
    }
    __drawMove(x, y, shiftKey, altKey) {
        document.getElementById("edytor").__selectColourFromXY("fg", x, y);
    }
    __drawEnd(x, y, shiftKey, altKey) {
    }
    __drawCancel() {
    }
}

window.customElements.define("edytor-tool-color-picker", EdytorColorPickerTool);