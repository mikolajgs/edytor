class EdytorPencilTool extends EdytorTool {
    RequiresPad = true;

    isMultiClick() {
        return false;
    }


    #startPos = [-1, -1];
    #prevPos = [-1, -1];
 

    constructor() {
        super();
    }

    connectedCallback() {
        super.init('pencil', 'fa-pencil', 'Pencil');
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
        super.addProperty("Straight", "straight", "", {
            "": "",
            "horizontal": "horizontal",
            "vertical": "vertical",
            "diagonal-down": "diagonal-down",
            "diagonal-up": "diagonal-up"
        });
    }


    toggleOn() {
        super.toggleOn();
    }

    toggleOff() {
        super.toggleOff();
    }


    startedCallback(x, y, shiftKey, altKey) {
        var layer = super.getLayer(true);
        if (layer === null) {
            return;
        }

        var ctx = layer.getContext('2d');

        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = document.getElementById('edytor').getSelectedFgColour();
        ctx.lineWidth = super.getProperty('width');
        ctx.lineCap = super.getProperty('linecap');
        ctx.lineJoin = super.getProperty('linejoin');
        ctx.beginPath();
        ctx.moveTo(x, y);

        this.#startPos = [x, y];
        this.#prevPos = [-1, -1];
    }

    movedCallback(x, y, shiftKey, altKey) {
        var layer = super.getLayer(false);
        if (layer === null) {
            return;
        }

        var ctx = layer.getContext('2d');

        if (super.getProperty('straight') == "diagonal-down") {
            y = this.#startPos[1] + (x - this.#startPos[0]);
        } else if (super.getProperty('straight') == "diagonal-up") {
            y = this.#startPos[1] - (x - this.#startPos[0]);
        } else if (super.getProperty('straight') == "vertical") {
            y = this.#startPos[1];
        } else if (super.getProperty('straight') == "horizontal") {
            x = this.#startPos[0];
        }

        if (this.#prevPos[0] != x || this.#prevPos[1] != y) {
            ctx.lineTo(x, y);
            ctx.stroke();
        }

        this.#prevPos[0] = x;
        this.#prevPos[1] = y;
    }

    endedCallback(x, y, shiftKey, altKey) {
        var layer = super.getLayer(false);
        if (layer === null) {
            return;
        }

        layer.getContext('2d').closePath();
    }

    cancelledCallback() {
        this.endedCallback(0, 0, false, false);
    }

    selectedCallback() {
        return false;
    }
}

window.customElements.define("edytor-tool-pencil", EdytorPencilTool);
