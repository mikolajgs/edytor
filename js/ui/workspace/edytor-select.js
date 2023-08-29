class EdytorSelect extends HTMLCanvasElement {
    #mouseDown = false;

    #shape          = "";
    #points         = [];
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

    resetPosition() {
        this.style.top = 0;
        this.style.left = 0;
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

    clear() {
        var ctx = this.getContext("2d");
        ctx.clearRect(
            0,
            0,
            parseInt(document.getElementById("size_width").innerHTML),
            parseInt(document.getElementById("size_height").innerHTML)
        );
    }

    setSelection(shape, points) {
        this.resetPosition();
        this.clear();
        this.#shape = shape;
        this.#points = points;
    }

    getSelectionShape() {
        return this.#shape;
    }
    getSelectionPoints() {
        return this.#points;
    }
    getSelectionInverted() {
        return this.#inverted;
    }

    getMoveLeft() {
        return parseInt(this.style.left.replace("px", ""));
    }
    getMoveTop() {
        return parseInt(this.style.top.replace("px", ""));
    }

    setMoveLeft(v) {
        this.style.left = v + "px";
    }
    setMoveTop(v) {
        this.style.top = v + "px";
    }

    invert() {
        this.clear();
        this.#inverted = (this.#inverted ? false : true);
    }

    selectAll() {
        this.resetPosition();
        this.clear();
        this.#inverted = false;
        this.#shape = "rectangle";
        this.#points = [
            0,
            0,
            parseInt(document.getElementById("size_width").innerHTML),
            parseInt(document.getElementById("size_height").innerHTML)
        ];
    }

    deselectAll() {
        this.resetPosition();
        this.clear();
        this.#inverted = false;
        this.#shape = "";
        this.#points = [];
    }

    isSelection() {
        return (this.#points.length > 1 ? true : false);
    }

    #drawFreeOrPolygon() {
        var ctx = this.getContext("2d");
        document.getElementById("edytor").drawPolygonPathOnCtx(ctx, this.#points);
        ctx.stroke();

        if (this.#inverted) {
            this.#drawOutlineForInverted();
        }
    }

    #drawRectangle() {
        var ctx = this.getContext("2d");
        document.getElementById("edytor").drawRectanglePathOnCtx(ctx, this.#points);
        ctx.stroke();

        if (this.#inverted) {
            this.#drawOutlineForInverted();
        }
    }

    #drawRoundedRectangle() {
        var ctx = this.getContext("2d");
        document.getElementById("edytor").drawRoundedRectanglePathOnCtx(ctx, this.#points, this.#points[4]);
        ctx.stroke();

        if (this.#inverted) {
            this.#drawOutlineForInverted();
        }
    }

    #drawEllipse() {
        var ctx = this.getContext("2d");
        document.getElementById("edytor").drawEllipsePathOnCtx(ctx, this.#points);
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

            this.clear();

            switch (this.#shape) {
            case "rectangle":         this.#drawRectangle(); break;
            case "rounded_rectangle": this.#drawRoundedRectangle(); break;
            case "ellipse":           this.#drawEllipse(); break;
            }

        } else if (this.#shape == "free" || this.#shape == "polygon") {
            if (this.#points.length < 3) {
                return;
            }

            this.clear();
            this.#drawFreeOrPolygon();
        }

        this.#animationFrame++;
        if (this.#animationFrame > 9)
            this.#animationFrame = 0;
    }
}

window.customElements.define("edytor-select", EdytorSelect, { extends: 'canvas' });
