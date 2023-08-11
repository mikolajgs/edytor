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

    clear() {
        var ctx = this.getContext("2d");
        ctx.clearRect(
            0,
            0,
            parseInt(document.getElementById("size_width").innerHTML),
            parseInt(document.getElementById("size_height").innerHTML)
        );
    }

    clearDirtyArea() {
        var ctx = this.getContext("2d");
        if (this.#inverted) {
            this.clear();
            return;
        }
        if (this.#dirtyArea.length == 4) {
            ctx.clearRect(
                this.#dirtyArea[0] - 2,
                this.#dirtyArea[1] - 2,
                this.#dirtyArea[2] - this.#dirtyArea[0] + 2,
                this.#dirtyArea[3] - this.#dirtyArea[1] + 2
            );
        }
    }

    setSelection(shape, points, newDirtyArea) {
        this.clear();
        this.#shape = shape;
        this.#points = points;
        this.#dirtyArea = newDirtyArea;
    }

    getSelectionShape() {
        return this.#shape;
    }
    getSelectionPoints() {
        return this.#points;
    }
    getSelectionDirtyArea() {
        return this.#dirtyArea;
    }
    getSelectionInverted() {
        return this.#inverted;
    }

    invert() {
        this.clear();
        this.#inverted = (this.#inverted ? false : true);
    }

    selectAll() {
        this.clear();
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
        this.clear();
        this.#inverted = false;
        this.#shape = "";
        this.#points = [];
        this.#dirtyArea = [];
    }

    moveSelection(moveX, moveY) {
        var newPts = [];
        var newDirtyArea = [];
        var w = parseInt(document.getElementById("size_width").innerHTML);
        var h = parseInt(document.getElementById("size_height").innerHTML);

        this.clear();

        if (this.#shape == "free" || this.#shape == "polygon") {
            for (var i=0; i<this.#points.length; i++) {
                var pt = [];
                pt[0] = this.#points[i][0] + moveX;
                pt[1] = this.#points[i][1] + moveY;
                if (pt[0] < 0) pt[0] = 0;
                if (pt[1] < 0) pt[1] = 0;
                if (pt[0] > w) pt[0] = w;
                if (pt[1] > h) pt[1] = h;
                newPts.push(pt);
            }
            this.#points = newPts;
        }

        if (this.#shape == "rectangle") {
            var ptX = this.#points[0] + moveX;
            var ptY = this.#points[1] + moveY;
            var newW = this.#points[2];
            var newH = this.#points[3];
            if (ptX < 0) {
                newW = newW - Math.abs(ptX);
                ptX = 0;
            }
            if (ptY < 0) {
                newH = newH - Math.abs(ptY);
                ptY = 0;
            }
            if (ptX + newW > w) {
                newW = Math.abs(w-ptX);
            }
            if (ptY + newH > h) {
                newH = Math.abs(h-ptY);
            }
            this.#points = [ptX, ptY, newW, newH];
        }
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
