class EdytorMoveTool extends EdytorTool {
    RequiresPad = true;

    isMultiClick() {
        return false;
    }


    #startPos = [];


    constructor() {
        super();
    }

    connectedCallback() {
        super.init('move', 'fa-up-down-left-right', 'Move');
    }


    toggleOn() {
        super.toggleOn();
    }

    toggleOff() {
        super.toggleOff();
    }


    startedCallback(x, y) {
        var layer = super.getLayer(true);
        if (layer === null) {
            return;
        }

        this.#startPos = [x, y];
    }

    movedCallback(x, y, shiftKey, altKey) {
        var layer = super.getLayer(true);
        if (layer === null) {
            return;
        }
        
        layer.style.left = (x - this.#startPos[0]) + "px";
        layer.style.top  = (y - this.#startPos[1]) + "px";
    }

    endedCallback(x, y, shiftKey, altKey) {
        var layer = super.getLayer(true);
        if (layer === null) {
            return;
        }
        var ctx = layer.getContext("2d");

        var moveX = x - this.#startPos[0];
        var moveY = y - this.#startPos[1];

        var imgData = ctx.getImageData(
            (moveX < 0 ? Math.abs(moveX) : 0),
            (moveY < 0 ? Math.abs(moveY) : 0),
            layer.width - Math.abs(moveX),
            layer.height - Math.abs(moveY)
        );

        ctx.clearRect(0, 0, layer.width, layer.height);
        ctx.putImageData(
            imgData,
            (moveX < 0 ? 0 : moveX),
            (moveY < 0 ? 0 : moveY)
        );

        layer.style.left = "0px";
        layer.style.top  = "0px";
    }

    cancelledCallback() {
        var layer = super.getLayer(true);
        if (layer === null) {
            return;
        }
        
        layer.style.left = "0px";
        layer.style.top  = "0px";
    }

    selectedCallback() {
        return false;
    }
}

window.customElements.define("edytor-tool-move", EdytorMoveTool);