class EdytorLineTool extends EdytorTool {
    RequiresPad = true;

    isMultiClick() {
        return false;
    }


    #dirtyArea = [];
    #startPos = [];


    constructor() {
        super();
    }

    connectedCallback() {
        this.#resetDirtyArea();
        this.#resetStartPos();

        super.init('line', 'fa-minus', 'Line');
        super.addProperty("Width", "width", "3", null);
        super.addProperty("Linecap", "linecap", "", {
            "butt": "butt",
            "square": "square",
            "round": "round"
        });
        super.addProperty("Linejoin", "linejoin", "", {
            "miter": "miter",
            "round": "round",
            "bevel": "bevel"
        });
        super.addProperty("Angle", "angle", "", {
            "": "",
            "horizontal": "horizontal",
            "vertical": "vertical",
            "diagonal": "diagonal"
        });
    }


    toggleOn() {
        super.toggleOn();
    }

    toggleOff() {
        super.toggleOff();
    }


    #updateDirtyArea(x, y) {
        this.#dirtyArea = super.calculateDirtyArea(
            this.#dirtyArea,
            x,
            y,
            x,
            y,
            document.getElementById('pad_layer').width,
            document.getElementById('pad_layer').height,
            parseInt(super.getProperty('width')),
            parseInt(super.getProperty('width'))
        );
    }

    #resetDirtyArea() {
        this.#dirtyArea = [999999, 999999, 0, 0];
    }

    #resetStartPos() {
        this.#startPos = [-1, -1];
    }


    #setCtxStyle(ctx) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = document.getElementById('edytor').getSelectedFgColour();
        ctx.lineWidth   = super.getProperty('width');
        ctx.lineCap     = super.getProperty('linecap');
        ctx.lineJoin    = super.getProperty('linejoin');
    }

    #drawCtxLine(ctx, x, y) { 
        ctx.beginPath();
        ctx.moveTo(this.#startPos[0], this.#startPos[1]);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.closePath();
    }

    #alignXYToAngle(x, y) {
        if (super.getProperty('angle') == "diagonal") {
            if (y > this.#startPos[1]) {
                y = this.#startPos[1] + (x - this.#startPos[0]);
            } else {
                y = this.#startPos[1] - (x - this.#startPos[0]);
            }

        } else if (super.getProperty('angle') == "horizontal") {
            y = this.#startPos[1];

        } else if (super.getProperty('angle') == "vertical") {
            x = this.#startPos[0];
        }

        return [x, y];
    }


    startedCallback(x, y, shiftKey, altKey) {
        var layer = super.getLayer(true);
        if (layer === null) {
            return;
        }

        this.#resetDirtyArea();
        super.clearPad();

        var padCtx = document.getElementById('pad_layer').getContext('2d');
        this.#setCtxStyle(padCtx);

        this.#updateDirtyArea(x, y);
        this.#startPos = [x, y];
    }

    movedCallback(x, y, shiftKey, altKey, useLayer) {
        var layer = super.getLayer(false);
        if (layer === null) {
            return;
        }

        var finalXY = this.#alignXYToAngle(x, y);
        x = finalXY[0];
        y = finalXY[1];

        this.#updateDirtyArea(x, y);
        super.clearPadArea(this.#dirtyArea);

        if (x != this.#startPos[0] || y != this.#startPos[1]) {
            if (useLayer) {
                var ctx = layer.getContext('2d');
                this.#setCtxStyle(ctx);
                this.#drawCtxLine(ctx, x, y);
            } else {
                var padCtx = document.getElementById('pad_layer').getContext('2d');
                this.#drawCtxLine(padCtx, x, y);
            }
        }
    }

    endedCallback(x, y, shiftKey, altKey) {
        this.movedCallback(x, y, shiftKey, altKey, true);
    }

    cancelledCallback() {
        var layer = super.getLayer(false);
        if (layer === null) {
            return;
        }

        super.clearPad();
    }

    selectedCallback() {
        this.#resetDirtyArea();
        this.#resetStartPos();

        super.clearPad();
    }
}

window.customElements.define("edytor-tool-line", EdytorLineTool);
