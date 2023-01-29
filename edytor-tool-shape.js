class EdytorShapeTool extends EdytorTool {
    RequiresPad = true;
    IsMultiClick = false;

    _inputArea = [999999, 999999, 0, 0];
    _clearArea = [999999, 999999, 0, 0];

    #startPos = [-1, -1];
    #prevPos = [-1, -1];
    #ctx = null;
    #padCtx = null;

    constructor() {
        super();
    }

    connectedCallback() {
        super._init('shape', 'fa-shapes', 'Shape');
        super._addProperty("Shape", "shape", "", {
            "rectangle": "rectangle",
            "rounded_rectangle": "rounded_rectangle",
            "ellipse": "ellipse",
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
        super._addProperty("Radius", "corner_radius", "3", null);
        super._addProperty("Ratio", "ratio", "", {
            "": "",
            "1:1": "1:1"
        });
        super._addProperty("Align", "align", "", {
            "": "",
            "straight": "straight"
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

    #setCtxStyle(ctx) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = document.getElementById('edytor').__getSelectedFgColour();
        ctx.fillStyle = document.getElementById('edytor').__getSelectedBgColour();
        ctx.lineWidth = super._getProperty('width');
        ctx.lineCap = super._getProperty('linecap');
        ctx.lineJoin = super._getProperty('linejoin');
    }

    __drawStart(x, y, shiftKey, altKey) {
        var layer = super._getLayer(true);
        if (layer === null) {
            return;
        }

        super._resetInputArea(this);
        super._resetClearArea(this);

        this.#startPos = [x, y];

        if (super._getProperty("shape") == "free") {
            this.#ctx = document.getElementById('layer_' + layer).getContext('2d');
            this.#setCtxStyle(this.#ctx);
            this.#ctx.beginPath();
            this.#prevPos = [-1, -1];
            this.#ctx.moveTo(x, y);
        } else {
            this.#padCtx = document.getElementById('pad_layer').getContext('2d');
            this.#setCtxStyle(this.#padCtx);
            this.#setClearArea();
        }
    }

    #drawCtxRectangle(ctx) {
        ctx.beginPath();
        ctx.rect(
            this._inputArea[0],
            this._inputArea[1],
            Math.abs(this._inputArea[2] - this._inputArea[0]),
            Math.abs(this._inputArea[3] - this._inputArea[1])
        );
        ctx.closePath();
        if (super._getProperty('style') == "fill" || super._getProperty('style') == "stroke+fill") {
            ctx.fill();
        }
        if (super._getProperty('style') == "stroke" || super._getProperty('style') == "stroke+fill") {
            ctx.stroke();
        }
    }

    #drawCtxRoundedRectangle(ctx) {
        var r = parseInt(super._getProperty("corner_radius"));
        var w = Math.abs(this._inputArea[2] - this._inputArea[0]);
        var h = Math.abs(this._inputArea[3] - this._inputArea[1]);
        var x = this._inputArea[0];
        var y = this._inputArea[1];
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        if (super._getProperty('style') == "fill" || super._getProperty('style') == "stroke+fill") {
            ctx.fill();
        }
        if (super._getProperty('style') == "stroke" || super._getProperty('style') == "stroke+fill") {
            ctx.stroke();
        }
    }

    #drawCtxEllipse(ctx) {
        var w = Math.abs(this._inputArea[2] - this._inputArea[0]);
        var h = Math.abs(this._inputArea[3] - this._inputArea[1]);
        var x = this._inputArea[0];
        var y = this._inputArea[1];
        var cx = x + (w / 2);
        var cy = y + (h / 2);
        ctx.beginPath();
        ctx.ellipse(cx, cy, (w / 2), (h / 2), 0, 0, 2 * Math.PI);
        ctx.closePath();
        if (super._getProperty('style') == "fill" || super._getProperty('style') == "stroke+fill") {
            ctx.fill();
        }
        if (super._getProperty('style') == "stroke" || super._getProperty('style') == "stroke+fill") {
            ctx.stroke();
        }
    }

    #drawMoveFree(x, y) {
        if (this.#prevPos[0] != x || this.#prevPos[1] != y) {
            this.#ctx.lineTo(x, y);
            this.#ctx.stroke();
        }

        this.#prevPos[0] = x;
        this.#prevPos[1] = y;
    }

    __drawMove(x, y, shiftKey, altKey) {
        var layer = super._getLayer(false);
        if (layer === null) {
            return;
        }

        if (super._getProperty("shape") != "free") {
            this.#setInputArea(x, y);
            this.#setClearArea();
            super._clearPad(this);

            if (!this.#shouldDraw()) {
                return;
            }
        }

        switch (super._getProperty("shape")) {
            case "rectangle": this.#drawCtxRectangle(this.#padCtx); break;
            case "rounded_rectangle": this.#drawCtxRoundedRectangle(this.#padCtx); break;
            case "ellipse": this.#drawCtxEllipse(this.#padCtx); break;
            case "free": this.#drawMoveFree(x, y); break;
        }
    }

    #drawEndFree() {
        this.#ctx.closePath();
        if (super._getProperty('style') == "fill" || super._getProperty('style') == "stroke+fill") {
            this.#ctx.fill();
        }
        if (super._getProperty('style') == "stroke" || super._getProperty('style') == "stroke+fill") {
            this.#ctx.stroke();
        }
    }

    __drawEnd(x, y, shiftKey, altKey) {
        var layer = super._getLayer(false);
        if (layer === null) {
            return;
        }

        if (super._getProperty("shape") != "free") {
            this.#setInputArea(x, y);
            this.#setClearArea();
            super._clearPad(this);

            if (!this.#shouldDraw()) {
                return;
            }
        }

        var ctx = document.getElementById('layer_' + layer).getContext('2d');
        this.#setCtxStyle(ctx);

        switch (super._getProperty("shape")) {
            case "rectangle": this.#drawCtxRectangle(ctx); break;
            case "rounded_rectangle": this.#drawCtxRoundedRectangle(ctx); break;
            case "ellipse": this.#drawCtxEllipse(ctx); break;
            case "free": this.#drawEndFree(); break;
        }
    }

    __drawCancel() {
        var layer = super._getLayer(false);
        if (layer === null) {
            return;
        }

        if (super._getProperty("shape") != "free") {
            super._clearPad();
        } else {
            this.#ctx = document.getElementById('layer_' + layer).getContext('2d');
            this.#ctx.closePath();
        }
    }
}

window.customElements.define("edytor-tool-shape", EdytorShapeTool);
