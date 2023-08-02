class EdytorSelect extends HTMLCanvasElement {
    #mouseDown = false;

    #shape          = "";
    #points         = [];
    #dirtyArea      = [];
    #inverted       = false;

    #animationFrame = 0;

    #color1 = "rgb(0,0,0)";
    #color2 = "rgb(255,255,255)";

    #interval = [];

    constructor() {
        super();
    }

    connectedCallback() {
        this.id = "select_layer";
        this.style.margin = 0;
        this.style.padding = 0;
        this.style.display = "block";
        this.style.position = "absolute";
        this.style.top = 0;
        this.style.left = 0;
        this.style.boxSizing = "border-box";
        this.style.width = "100%";
        this.style.border = "0";
        this.style.zIndex = 401;

        this.#interval = setInterval(this.animationInterval, 500);
    }

    setSize(w, h) {
        this.width = w;
        this.height = h;
    }

    show() {
        this.style.display = '';
    }

    hide() {
        this.style.display = 'none';
    }

    animationInterval() {
        document.getElementById("select_layer").draw();
    }

    clearDirtyArea() {
        var ctx = this.getContext("2d");
        if (this.#inverted) {
            ctx.clearRect(
                0,
                0,
                parseInt(document.getElementById("size_width").innerHTML),
                parseInt(document.getElementById("size_height").innerHTML)
            );
            return;
        }
        if (this.#dirtyArea.length == 4) {
            ctx.clearRect(
                this.#dirtyArea[0],
                this.#dirtyArea[1],
                this.#dirtyArea[2] - this.#dirtyArea[0],
                this.#dirtyArea[3] - this.#dirtyArea[1]
            );
        }
    }

    setSelection(shape, points, newDirtyArea) {
        this.clearDirtyArea();
        this.#shape = shape;
        this.#points = points;
        this.#dirtyArea = newDirtyArea;
    }

    invert() {
        this.clearDirtyArea();
        this.#inverted = (this.#inverted ? false : true);
    }

    selectAll() {
        this.clearDirtyArea();
        this.#inverted = false;
        this.#shape = "rectangle";
        this.#points = [
            0,
            0,
            parseInt(document.getElementById("size_width").innerHTML),
            parseInt(document.getElementById("size_height").innerHTML)
        ];
        this.#dirtyArea = [
            0,
            0,
            parseInt(document.getElementById("size_width").innerHTML),
            parseInt(document.getElementById("size_height").innerHTML)
        ];
    }

    deselectAll() {
        this.clearDirtyArea();
        this.#inverted = false;
        this.#shape = "";
        this.#points = [];
        this.#dirtyArea = [];
    }

    #drawFreeOrPolygon() {
        var ctx = this.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(this.#points[0][0], this.#points[0][1]);
        for (var i = 1; i < this.#points.length; i++) {
            ctx.lineTo(this.#points[i][0], this.#points[i][1]);
        }
        ctx.closePath();
        ctx.stroke();

        if (this.#inverted) {
            this.#drawOutlineForInverted();
        }
    }

    #drawRectangle() {
        var ctx = this.getContext("2d");
        ctx.beginPath();
        ctx.rect(
            this.#points[0],
            this.#points[1],
            this.#points[2],
            this.#points[3]
        );
        ctx.closePath();
        ctx.stroke();

        if (this.#inverted) {
            this.#drawOutlineForInverted();
        }
    }

    #drawRoundedRectangle() {
        var r = this.#points[4];
        var w = this.#points[2];
        var h = this.#points[3];
        var x = this.#points[0];
        var y = this.#points[1];

        var ctx = this.getContext("2d");
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
        ctx.stroke();

        if (this.#inverted) {
            this.#drawOutlineForInverted();
        }
    }

    #drawEllipse() {
        var w = this.#points[2];
        var h = this.#points[3];
        var x = this.#points[0];
        var y = this.#points[1];
        var cx = x + (w / 2);
        var cy = y + (h / 2);

        var ctx = this.getContext("2d");
        ctx.beginPath();
        ctx.ellipse(cx, cy, (w / 2), (h / 2), 0, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.stroke();

        if (this.#inverted) {
            this.#drawOutlineForInverted();
        }
    }

    #drawOutlineForInverted() {
        var ctx = this.getContext("2d");
        ctx.beginPath();
        ctx.rect(
            0,
            0,
            parseInt(document.getElementById("size_width").innerHTML),
            parseInt(document.getElementById("size_height").innerHTML)
        );
        ctx.closePath();
        ctx.stroke();
    }

    draw() {
        var ctx = this.getContext("2d");
        ctx.lineDashOffset = this.#animationFrame;
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = "rgb(255,255,255,255)";
        ctx.lineWidth = 1;
        ctx.lineCap = "square";

        if (
            this.#shape == "rectangle" ||
            this.#shape == "rounded_rectangle" ||
            this.#shape == "ellipse"
        ) {

            if (this.#shape == "rounded_rectangle" && this.#points.length < 5) {
                return;
            }
            if (this.#points.length < 4) {
                return;
            }

            this.clearDirtyArea();

            switch (this.#shape) {
            case "rectangle":         this.#drawRectangle(); break;
            case "rounded_rectangle": this.#drawRoundedRectangle(); break;
            case "ellipse":           this.#drawEllipse(); break;
            }

        } else if (this.#shape == "free" || this.#shape == "polygon") {
            if (this.#points.length < 3) {
                return;
            }

            this.clearDirtyArea();
            this.#drawFreeOrPolygon();
        }

        this.#animationFrame++;
        if (this.#animationFrame > 9)
            this.#animationFrame = 0;
    }
}

window.customElements.define("edytor-select", EdytorSelect, { extends: 'canvas' });
