class EdytorEraserTool extends EdytorTool {
    RequiresPad = true;
    IsMultiClick = false;

    #topLeft = [0, 0];
    #bottomRight = [0, 0];
    #prevPos = [-1, -1];

    #ctx = null;

    constructor() {
        super();
    }

    connectedCallback() {
        super._init('eraser', 'fa-eraser', "Eraser");
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

        this.#ctx = document.getElementById('layer_' + layer).getContext('2d');

        this.#ctx.globalCompositeOperation = 'destination-out';
        this.#ctx.strokeStyle = 'rgb(255,255,255,1)';
        this.#ctx.lineWidth = super._getProperty('width');
        this.#ctx.lineCap = super._getProperty('linecap');
        this.#ctx.lineJoin = super._getProperty('linejoin');
        this.#ctx.beginPath();
        this.#ctx.moveTo(x, y);
    }
    __drawMove(x, y) {
        var layer = this.#getLayer(false);
        if (layer === null) {
            return;
        }

        if (x < this.#topLeft[0])
            this.#topLeft[0] = x;
        if (x > this.#bottomRight[0])
            this.#bottomRight[0] = x;
        if (y < this.#topLeft[1])
            this.#topLeft[1] = y;
        if (y > this.#bottomRight[1])
            this.#bottomRight[1] = y;

        if (this.#prevPos[0] != -1 && this.#prevPos[0] != x && this.#prevPos[1] != y) {
            this.#ctx.lineTo(x, y);
            this.#ctx.stroke();
        }

        this.#prevPos[0] = x;
        this.#prevPos[1] = y;
    }
    __drawEnd(x, y) {
        var layer = this.#getLayer(false);
        if (layer === null) {
            return;
        }

        this.#ctx.closePath();
    }
    __drawCancel() {
        var layer = this.#getLayer(false);
        if (layer === null) {
            return;
        }

        this.#ctx = document.getElementById('layer_' + layer).getContext('2d');

        this.#ctx.closePath();
    }
}

window.customElements.define("edytor-tool-eraser", EdytorEraserTool);