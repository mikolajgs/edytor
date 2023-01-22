class EdytorShapeTool extends EdytorTool {
    RequiresPad = true;
    IsMultiClick = false;

    _corners = [999999, 999999, 0, 0];

    #startPos = [-1 - 1];
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
    }

    #setCorners(x, y) {
        super._setCorners(this, x, y,
            document.getElementById('pad_layer').width,
            document.getElementById('pad_layer').height,
            parseInt(super._getProperty('width')),
            parseInt(super._getProperty('width'))
        );
    }

    __toggleOn() {
        super.__toggleOn();
    }

    __toggleOff() {
        super.__toggleOff();
    }

    __drawStart(x, y, shiftKey) {
        var layer = super._getLayer(true);
        if (layer === null) {
            return;
        }

        super._resetCorners(this);

        this.#padCtx = document.getElementById('pad_layer').getContext('2d');
        this.#padCtx.globalCompositeOperation = 'source-over';
        this.#padCtx.strokeStyle = document.getElementById('edytor').__getSelectedFgColour();
        this.#padCtx.lineWidth = super._getProperty('width');
        this.#padCtx.lineCap = super._getProperty('linecap');
        this.#padCtx.lineJoin = super._getProperty('linejoin');
        this.#setCorners(x, y);
        this.#startPos = [x, y];
    }

    __drawMove(x, y, shiftKey) {
        var layer = super._getLayer(false);
        if (layer === null) {
            return;
        }

        this.#setCorners(x, y);
        super._clearPad(this);

        if (x != this.#startPos[0] || y != this.#startPos[1]) {
            this.#padCtx.beginPath();
            this.#padCtx.rect(
                (this.#startPos[0] < x ? this.#startPos[0] : x),
                (this.#startPos[1] < y ? this.#startPos[1] : y),
                Math.abs(x - this.#startPos[0]),
                Math.abs(y - this.#startPos[1])
            );
            this.#padCtx.stroke();
        }
    }

    __drawEnd(x, y, shiftKey) {
        var layer = super._getLayer(false);
        if (layer === null) {
            return;
        }

        this.#setCorners(x, y);

        if (x != this.#startPos[0] || y != this.#startPos[1]) {
            var ctx = document.getElementById('layer_' + layer).getContext('2d');
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = document.getElementById('edytor').__getSelectedFgColour();
            ctx.lineWidth = super._getProperty('width');
            ctx.lineCap = super._getProperty('linecap');
            ctx.lineJoin = super._getProperty('linejoin');
            ctx.beginPath();
            ctx.rect(
                (this.#startPos[0] < x ? this.#startPos[0] : x),
                (this.#startPos[1] < y ? this.#startPos[1] : y),
                Math.abs(x - this.#startPos[0]),
                Math.abs(y - this.#startPos[1])
            );
            ctx.stroke();
        }

        super._clearPad(this);
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