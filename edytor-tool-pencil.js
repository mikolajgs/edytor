class EdytorPencilTool extends EdytorTool {
    RequiresPad = true;
    IsMultiClick = false;

    _corners = [999999, 999999, 0, 0];

    #prevPos = [-1, -1];
    #ctx = null;

    constructor() {
        super();
    }

    connectedCallback() {
        super._init('pencil', 'fa-pencil', 'Pencil');
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
    }

    __toggleOn() {
        super.__toggleOn();
    }

    __toggleOff() {
        super.__toggleOff();
    }

    __drawStart(x, y) {
        var layer = super._getLayer(true);
        if (layer === null) {
            return;
        }

        super._resetCorners(this);

        this.#ctx = document.getElementById('layer_' + layer).getContext('2d');

        this.#ctx.globalCompositeOperation = 'source-over';
        this.#ctx.strokeStyle = document.getElementById('edytor').__getSelectedFgColour();
        this.#ctx.lineWidth = super._getProperty('width');
        this.#ctx.lineCap = super._getProperty('linecap');
        this.#ctx.lineJoin = super._getProperty('linejoin');
        this.#ctx.beginPath();
        this.#ctx.moveTo(x, y);
    }
    __drawMove(x, y) {
        var layer = super._getLayer(false);
        if (layer === null) {
            return;
        }

        super._setCorners(this, x, y,
            document.getElementById('layer_' + layer).width,
            document.getElementById('layer_' + layer).height,
            parseInt(super._getProperty('width')),
            parseInt(super._getProperty('width'))
        );

        if (this.#prevPos[0] != -1 && this.#prevPos[0] != x && this.#prevPos[1] != y) {
            this.#ctx.lineTo(x, y);
            this.#ctx.stroke();
        }

        this.#prevPos[0] = x;
        this.#prevPos[1] = y;
    }
    __drawEnd(x, y) {
        var layer = super._getLayer(false);
        if (layer === null) {
            return;
        }

        this.#ctx.closePath();
    }
    __drawCancel() {
        var layer = super._getLayer(false);
        if (layer === null) {
            return;
        }

        this.#ctx = document.getElementById('layer_' + layer).getContext('2d');
        this.#ctx.closePath();
    }
}

window.customElements.define("edytor-tool-pencil", EdytorPencilTool);