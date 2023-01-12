class EdytorPencilTool extends EdytorTool {
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
        var layer = document.getElementById('edytor').__getSelectedLayer();
        if (layer === 0 || layer === null) {
            alert('No layer has been selected');
            return;
        }
        if (document.getElementById('layer_' + layer).tagName.toLowerCase() !== 'canvas') {
            alert('No pixel layer has been selected');
            return;
        }
        if (document.getElementById('layer_' + layer).getAttribute("locked") === "true") {
            alert('Layer is locked for editing');
            return;
        }
        if (document.getElementById('layer_' + layer).style.display === 'none') {
            return;
        }

        this.#ctx = document.getElementById('layer_' + layer).getContext('2d');

        this.#ctx.strokeStyle = document.getElementById('edytor').__getSelectedFgColour();
        this.#ctx.lineWidth = super._getProperty('width');
        this.#ctx.lineCap = super._getProperty('linecap');
        this.#ctx.lineJoin = super._getProperty('linejoin');
        this.#ctx.beginPath();
        this.#ctx.moveTo(x, y);
    }
    __drawMove(x, y) {
        var layer = document.getElementById('edytor').__getSelectedLayer();
        if (layer === 0 || layer === null) {
            return;
        }
        if (document.getElementById('layer_' + layer).tagName.toLowerCase() !== 'canvas') {
            return;
        }
        if (document.getElementById('layer_' + layer).getAttribute("locked") === "true") {
            return;
        }
        if (document.getElementById('layer_' + layer).style.display === 'none') {
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
        var layer = document.getElementById('edytor').__getSelectedLayer();
        if (layer === 0 || layer === null) {
            return;
        }
        if (document.getElementById('layer_' + layer).tagName.toLowerCase() !== 'canvas') {
            return;
        }
        if (document.getElementById('layer_' + layer).getAttribute("locked") === "true") {
            return;
        }
        if (document.getElementById('layer_' + layer).style.display === 'none') {
            return;
        }

        this.#ctx.closePath();
    }
    __drawCancel() {
        var layer = document.getElementById('edytor').__getSelectedLayer();
        if (layer === 0 || layer === null) {
            return;
        }
        if (document.getElementById('layer_' + layer).tagName.toLowerCase() !== 'canvas') {
            return;
        }
        if (document.getElementById('layer_' + layer).getAttribute("locked") === "true") {
            return;
        }
        if (document.getElementById('layer_' + layer).style.display === 'none') {
            return;
        }

        this.#ctx.closePath();
    }
}

window.customElements.define("edytor-tool-pencil", EdytorPencilTool);