class EdytorShapeTool extends EdytorTool {
    RequiresPad = true;
    IsMultiClick = false;

    _inputArea = [999999, 999999, 0, 0];
    _clearArea = [999999, 999999, 0, 0];

    #startPos = [-1, -1];
    #padCtx = null;

    constructor() {
        super();
    }

    connectedCallback() {
        super._init('shape', 'fa-shapes', 'Shape');
        super._addProperty("Shape", "shape", "", {
            "rectangle": "rectangle",
            "rounded_rectangle": "rounded_rectangle",
            "oval": "oval",
            "free": "free",
            "polygon": "polygon"
        });
        super._addProperty("Style", "style", "", {
            "stroke": "stroke",
            "fill": "fill",
            "stroke+fill": "stroke+fill"
        });
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
        super._addProperty("Radii", "corner_radii", "3 3 3 3", null);
        super._addProperty("Ratio", "ratio", "", {
            "": "",
            "1:1": "1:1"
        });
    }

    #setInputArea(x, y) {
        super._setInputArea(this,
            this.#startPos[0], this.#startPos[1],
            x, y,
            (super._getProperty('ratio') == "1:1" ? true : false)
        );
    }

    #setClearArea() {
        super._setClearAreaFromInputArea(
            this,
            document.getElementById('pad_layer').width,
            document.getElementById('pad_layer').height,
            parseInt(super._getProperty('width')),
            parseInt(super._getProperty('width'))
        );
    }

    #shouldDraw() {
        if (this._inputArea[0] != this._inputArea[2] || this._inputArea[1] != this._inputArea[3]) {
            return true;
        }
        return false;
    }

    __toggleOn() {
        super.__toggleOn();
    }

    __toggleOff() {
        super.__toggleOff();
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
        this.#padCtx.fillStyle = document.getElementById('edytor').__getSelectedBgColour();
        this.#padCtx.lineWidth = super._getProperty('width');
        this.#padCtx.lineCap = super._getProperty('linecap');
        this.#padCtx.lineJoin = super._getProperty('linejoin');

        this.#setClearArea();
        this.#startPos = [x, y];
    }

    __drawMove(x, y, shiftKey, altKey) {
        var layer = super._getLayer(false);
        if (layer === null) {
            return;
        }

        this.#setInputArea(x, y);
        this.#setClearArea();
        super._clearPad(this);

        if (!this.#shouldDraw()) {
            return;
        }

        if (super._getProperty('style') == "stroke" || super._getProperty('style') == "stroke+fill") {
            this.#padCtx.beginPath();
            this.#padCtx.rect(
                this._inputArea[0],
                this._inputArea[1],
                Math.abs(this._inputArea[2] - this._inputArea[0]),
                Math.abs(this._inputArea[3] - this._inputArea[1])
            );
            this.#padCtx.stroke();
        }
        if (super._getProperty('style') == "fill" || super._getProperty('style') == "stroke+fill") {
            this.#padCtx.fillRect(
                this._inputArea[0],
                this._inputArea[1],
                Math.abs(this._inputArea[2] - this._inputArea[0]),
                Math.abs(this._inputArea[3] - this._inputArea[1])
            );
        }
    }

    __drawEnd(x, y, shiftKey, altKey) {
        var layer = super._getLayer(false);
        if (layer === null) {
            return;
        }

        this.#setInputArea(x, y);
        this.#setClearArea();
        super._clearPad(this);

        if (!this.#shouldDraw()) {
            return;
        }

        var ctx = document.getElementById('layer_' + layer).getContext('2d');
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = document.getElementById('edytor').__getSelectedFgColour();
        ctx.fillStyle = document.getElementById('edytor').__getSelectedBgColour();
        ctx.lineWidth = super._getProperty('width');
        ctx.lineCap = super._getProperty('linecap');
        ctx.lineJoin = super._getProperty('linejoin');
        if (super._getProperty('style') == "stroke" || super._getProperty('style') == "stroke+fill") {
            ctx.beginPath();
            ctx.rect(
                this._inputArea[0],
                this._inputArea[1],
                Math.abs(this._inputArea[2] - this._inputArea[0]),
                Math.abs(this._inputArea[3] - this._inputArea[1])
            );
            ctx.stroke();
        }
        if (super._getProperty('style') == "fill" || super._getProperty('style') == "stroke+fill") {
            ctx.fillRect(
                this._inputArea[0],
                this._inputArea[1],
                Math.abs(this._inputArea[2] - this._inputArea[0]),
                Math.abs(this._inputArea[3] - this._inputArea[1])
            );
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

window.customElements.define("edytor-tool-shape", EdytorShapeTool);
