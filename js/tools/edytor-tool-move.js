class EdytorMoveTool extends EdytorTool {
    RequiresPad = true;

    isMultiClick() {
        return false;
    }


    #startPos = [];
    #startSelectLayerPos = [];
    #cancelled = false;


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
        this.#cancelled = false;

        var layer = super.getLayer(true);
        if (layer === null) {
            return;
        }

        this.#startPos = [x, y];

        var selectLayer = document.getElementById("select_layer");
        this.#startSelectLayerPos = [
            selectLayer.getMoveLeft(),
            selectLayer.getMoveTop()
        ];
    }

    movedCallback(x, y, shiftKey, altKey) {
        var layer = super.getLayer(true);
        if (layer === null) {
            return;
        }
        
        var moveX = x - this.#startPos[0];
        var moveY = y - this.#startPos[1];

        var selectLayer = document.getElementById("select_layer");
        if (!selectLayer.isSelection()) {
            layer.style.left = moveX + "px";
            layer.style.top  = moveY + "px";
            return;
        }

        selectLayer.setMoveLeft(this.#startSelectLayerPos[0] + moveX);
        selectLayer.setMoveTop(this.#startSelectLayerPos[1] + moveY);
    }

    endedCallback(x, y, shiftKey, altKey) {
        if (this.#cancelled) {
            return;
        }

        var layer = super.getLayer(true);
        if (layer === null) {
            return;
        }
        var ctx = layer.getContext("2d");

        var moveX = x - this.#startPos[0];
        var moveY = y - this.#startPos[1];

        var selectLayer = document.getElementById("select_layer");
        if (!selectLayer.isSelection()) {
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

            return;
        }
    }

    cancelledCallback() {
        var layer = super.getLayer(true);
        if (layer === null) {
            return;
        }

        var selectLayer = document.getElementById("select_layer");
        if (!selectLayer.isSelection()) {
            layer.style.left = "0px";
            layer.style.top  = "0px";

            return;
        }

        this.#cancelled = true;
    }

    selectedCallback() {
        return false;
    }
}

window.customElements.define("edytor-tool-move", EdytorMoveTool);