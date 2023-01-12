class EdytorLineTool extends EdytorTool {
    RequiresPad = true;
    IsMultiClick = false;

    #topLeft = [0, 0];
    #bottomRight = [0, 0];

    #startPos = [-1, -1];
    #endPos = [-1, -1];

    #ctx = null;
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
    }

    #getLayer(showAlert) {
        var layer = document.getElementById('edytor').__getSelectedLayer();
        if (layer === 0 || layer === null) {
            if (showAlert === true)
                alert('No layer has been selected');
            return null;
        }
        if (document.getElementById('layer_' + layer).tagName.toLowerCase() !== 'canvas') {
            if (showAlert === true)
                alert('No pixel layer has been selected');
            return null;
        }
        if (document.getElementById('layer_' + layer).getAttribute("locked") === "true") {
            if (showAlert === true)
                alert('Layer is locked for editing');
            return null;
        }
        if (document.getElementById('layer_' + layer).style.display === 'none') {
            return null;
        }
        return layer;
    }

    #setCorners(x, y) {
        var x_left = x - parseInt(super._getProperty('width'));
        var x_right = x + parseInt(super._getProperty('width'));
        var y_top = y - parseInt(super._getProperty('width'));
        var y_bottom = y + parseInt(super._getProperty('width'));

        this.#topLeft[0] = (x_left < 0 ? 0 : (x_left < this.#topLeft[0] ? x_left : this.#topLeft[0]));
        this.#topLeft[1] = (y_top < 0 ? 0 : (y_top < this.#topLeft[1] ? y_top : this.#topLeft[1]));
        this.#bottomRight[0] = (x_right > this.width ? this.width : (x_right > this.#bottomRight[0] ? x_right : this.#bottomRight[0]));
        this.#bottomRight[1] = (y_bottom > this.height ? this.height : (y_bottom > this.#bottomRight[1] ? y_bottom : this.#bottomRight[1]));
    }

    #clearPad() {
        this.#padCtx.clearRect(
            this.#topLeft[0],
            this.#topLeft[1],
            (this.#bottomRight[0] - this.#topLeft[0]),
            (this.#bottomRight[1] - this.#topLeft[1])
        );
    }

    __toggleOn() {
        super.__toggleOn();
    }

    __toggleOff() {
        super.__toggleOff();
    }

    __drawStart(x, y) {
        var layer = this.#getLayer(true);
        if (layer === null) {
            return;
        }

        this.#padCtx = document.getElementById('pad_layer').getContext('2d');
        this.#padCtx.globalCompositeOperation = 'source-over';
        this.#padCtx.strokeStyle = document.getElementById('edytor').__getSelectedFgColour();
        this.#padCtx.lineWidth = super._getProperty('width');
        this.#padCtx.lineCap = super._getProperty('linecap');
        this.#padCtx.lineJoin = super._getProperty('linejoin');

        this.#setCorners(x, y);

        this.#startPos = [x, y];
    }

    __drawMove(x, y) {
        var layer = this.#getLayer(false);
        if (layer === null) {
            return;
        }

        this.#setCorners(x, y);
        this.#clearPad();

        if (x != this.#startPos[0] || y != this.#startPos[1]) {
            this.#padCtx.beginPath();
            this.#padCtx.moveTo(this.#startPos[0], this.#startPos[1]);
            this.#padCtx.lineTo(x, y);
            this.#padCtx.stroke();
            this.#padCtx.closePath();
        }
    }

    __drawEnd(x, y) {
        var layer = this.#getLayer(false);
        if (layer === null) {
            return;
        }

        this.#setCorners(x, y);
        this.#clearPad();

        if (x != this.#startPos[0] || y != this.#startPos[1]) {
            this.#ctx = document.getElementById('layer_' + layer).getContext('2d');
            this.#ctx.globalCompositeOperation = 'source-over';
            this.#ctx.strokeStyle = document.getElementById('edytor').__getSelectedFgColour();
            this.#ctx.lineWidth = super._getProperty('width');
            this.#ctx.lineCap = super._getProperty('linecap');
            this.#ctx.lineJoin = super._getProperty('linejoin');
            this.#ctx.beginPath();
            this.#ctx.moveTo(this.#startPos[0], this.#startPos[1]);
            this.#ctx.lineTo(x, y);
            this.#ctx.stroke();
            this.#ctx.closePath();
        }
    }

    __drawCancel() {
        var layer = this.#getLayer(true);
        if (layer === null) {
            return;
        }

        this.#padCtx = document.getElementById('pad_layer').getContext('2d');
        this.#padCtx.clearRect(0, 0, this.width, this.height);
    }
}

window.customElements.define("edytor-tool-line", EdytorLineTool);