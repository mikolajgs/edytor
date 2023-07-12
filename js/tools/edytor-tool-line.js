class EdytorLineTool extends EdytorTool {
    RequiresPad = true;

    _clearArea = [999999, 999999, 0, 0];

    #startPos = [-1 - 1];
    #padCtx = null;

    constructor() {
        super();
    }

    connectedCallback() {
        super._init('line', 'fa-minus', 'Line');
        super._addProperty("Width", "width", "3", null);
        super._addProperty("Linecap", "linecap", "", {
            "butt": "butt",
            "square": "square",
            "round": "round"
        });
        super._addProperty("Linejoin", "linejoin", "", {
            "miter": "miter",
            "round": "round",
            "bevel": "bevel"
        });
        super._addProperty("Angle", "angle", "", {
            "": "",
            "horizontal": "horizontal",
            "vertical": "vertical",
            "diagonal": "diagonal"
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


    #setClearArea(x, y) {
        super._setClearArea(this, x, y,
            document.getElementById('pad_layer').width,
            document.getElementById('pad_layer').height,
            parseInt(super._getProperty('width')),
            parseInt(super._getProperty('width'))
        );
    }

    __drawStart(x, y, shiftKey, altKey) {
        var layer = super._getLayer(true);
        if (layer === null) {
            return;
        }

        super._resetClearArea(this);

        this.#padCtx = document.getElementById('pad_layer').getContext('2d');
        this.#padCtx.globalCompositeOperation = 'source-over';
        this.#padCtx.strokeStyle = document.getElementById('edytor').__getSelectedFgColour();
        this.#padCtx.lineWidth = super._getProperty('width');
        this.#padCtx.lineCap = super._getProperty('linecap');
        this.#padCtx.lineJoin = super._getProperty('linejoin');
        this.#setClearArea(x, y);
        this.#startPos = [x, y];
    }

    __drawMove(x, y, shiftKey, altKey) {
        var layer = super._getLayer(false);
        if (layer === null) {
            return;
        }

        if (super._getProperty('angle') == "diagonal") {
            if (y > this.#startPos[1]) {
                y = this.#startPos[1] + (x - this.#startPos[0]);
            } else {
                y = this.#startPos[1] - (x - this.#startPos[0]);
            }
        } else if (super._getProperty('angle') == "horizontal") {
            y = this.#startPos[1];
        } else if (super._getProperty('angle') == "vertical") {
            x = this.#startPos[0];
        }

        this.#setClearArea(x, y);
        super._clearPad(this);

        if (this._inputArea != this.#startPos[0] || y != this.#startPos[1]) {
            this.#padCtx.beginPath();
            this.#padCtx.moveTo(this.#startPos[0], this.#startPos[1]);
            this.#padCtx.lineTo(x, y);
            this.#padCtx.stroke();
            this.#padCtx.closePath();
        }
    }

    __drawEnd(x, y, shiftKey, altKey) {
        var layer = super._getLayer(false);
        if (layer === null) {
            return;
        }

        if (super._getProperty('angle') == "diagonal") {
            if (y > this.#startPos[1]) {
                y = this.#startPos[1] + (x - this.#startPos[0]);
            } else {
                y = this.#startPos[1] - (x - this.#startPos[0]);
            }
        } else if (super._getProperty('angle') == "horizontal") {
            y = this.#startPos[1];
        } else if (super._getProperty('angle') == "vertical") {
            x = this.#startPos[0];
        }

        this.#setClearArea(x, y);
        super._clearPad(this);

        if (x != this.#startPos[0] || y != this.#startPos[1]) {
            var ctx = document.getElementById('layer_' + layer).getContext('2d');
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = document.getElementById('edytor').__getSelectedFgColour();
            ctx.lineWidth = super._getProperty('width');
            ctx.lineCap = super._getProperty('linecap');
            ctx.lineJoin = super._getProperty('linejoin');
            ctx.beginPath();
            ctx.moveTo(this.#startPos[0], this.#startPos[1]);
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.closePath();
        }
    }

    __drawCancel() {
        var layer = super._getLayer(false);
        if (layer === null) {
            return;
        }

        super._clearPad();
    }
}

window.customElements.define("edytor-tool-line", EdytorLineTool);
