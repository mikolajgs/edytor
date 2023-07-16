class EdytorEraserTool extends EdytorTool {
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
        super.init('eraser', 'fa-eraser', "Eraser");
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


    startedCallback(x, y) {
        var layerNum = super.getLayer(true);
        if (layerNum === null) {
            return;
        }

        var ctx = document.getElementById('layer_' + layerNum).getContext('2d');

        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgb(255,255,255,1)';
        ctx.lineWidth = super.getProperty('width');
        ctx.lineCap = super.getProperty('linecap');
        ctx.lineJoin = super.getProperty('linejoin');
        ctx.beginPath();
        ctx.moveTo(x, y);

        this.#startPos = [x, y];
        this.#prevPos = [-1, -1];
    }

    movedCallback(x, y, shiftKey, altKey) {
        var layerNum = super.getLayer(false);
        if (layerNum === null) {
            return;
        }

        var ctx = document.getElementById('layer_' + layerNum).getContext('2d');

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
        var layerNum = super.getLayer(false);
        if (layerNum === null) {
            return;
        }

        document.getElementById('layer_' + layerNum).getContext('2d').closePath();
    }

    cancelledCallback() {
        this.endedCallback(0, 0, false, false);
    }

    selectedCallback() {
        return false;
    }
}

window.customElements.define("edytor-tool-eraser", EdytorEraserTool);
