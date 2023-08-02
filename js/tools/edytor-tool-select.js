class EdytorSelectTool extends EdytorTool {
    RequiresPad = true;

    isMultiClick() {
        if (super.getProperty("shape") == "polygon") {
            return true;
        }
        return false;
    }


    #dirtyArea = [];
    #shapeArea = [];
    #startPos  = [];
    #prevPos   = [];
    #points    = [];

    constructor() {
        super();
    }

    connectedCallback() {
        super.init('select', 'fa-arrow-pointer', 'Select');
        super.addProperty("Shape", "shape", "", {
            "rectangle": "rectangle",
            "rounded_rectangle": "rounded_rectangle",
            "ellipse": "ellipse",
            "free": "free",
            "polygon": "polygon"
        }, {
            "rounded_rectangle": ["corner_radius", "1_to_1", "draw_from_center"],
            "rectangle": ["1_to_1", "draw_from_center"],
            "ellipse": ["1_to_1", "draw_from_center"],
            "_": ["corner_radius", "1_to_1", "draw_from_center"]
        }, false);
        super.addProperty("Radius", "corner_radius", "3", null, null, true);
        super.addProperty("1:1", "1_to_1", false, null, null, false);
        super.addProperty("Draw from center", "draw_from_center", false, null, null, false);
        super.addButton("Invert", function () {
            document.getElementById('select_layer').invert();
        });
        super.addButton("Select All", function () {
            document.getElementById('select_layer').selectAll();
        });
        super.addButton("Deselect All", function () {
            document.getElementById('select_layer').deselectAll();
        });
    }


    toggleOn() {
        super.toggleOn();
    }

    toggleOff() {
        super.toggleOff();
    }


    #updateDirtyArea(x, y) {
        this.#dirtyArea = super.calculateDirtyArea(
            this.#dirtyArea,
            x,
            y,
            x,
            y,
            document.getElementById('pad_layer').width,
            document.getElementById('pad_layer').height,
            3, // line thickness
            3  // line thickness
        );
    }

    #updateShapeArea(x, y) {
        var drawFromCenter = false;
        if (super.getProperty("shape") == "rectangle" ||
            super.getProperty("shape") == "rounded_rectangle" ||
            super.getProperty("shape") == "ellipse")
        {
            drawFromCenter = (super.getProperty('draw_from_center') == "true" ? true : false);
        }

        this.#shapeArea = super.calculateShapeArea(
            this.#shapeArea,
            this.#startPos[0],
            this.#startPos[1],
            x,
            y,
            (super.getProperty('1_to_1') == "true" ? true : false),
            drawFromCenter
        );
    }

    #updateDirtyAreaFromShapeArea() {
        this.#dirtyArea = super.calculateDirtyArea(
            this.#dirtyArea,
            this.#shapeArea[0],
            this.#shapeArea[1],
            this.#shapeArea[2],
            this.#shapeArea[3],
            document.getElementById('pad_layer').width,
            document.getElementById('pad_layer').height,
            3, // line thickness
            3  // line thickness
        );
    }

    #resetDirtyArea() {
        this.#dirtyArea = [999999, 999999, 0, 0];
    }

    #resetShapeArea() {
        this.#shapeArea = [999999, 999999, 0, 0];
    }

    #resetPosAndPoints() {
        this.#startPos = [-1, -1];
        this.#prevPos  = [-1, -1];
        this.#points   = [];
    }

    #isShapeAreaExist() {
        if (this.#shapeArea[0] != this.#shapeArea[2] || this.#shapeArea[1] != this.#shapeArea[3]) {
            return true;
        }
        return false;
    }


    #setCtxStyle(ctx) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = "#ffffff";
        ctx.fillStyle = "";
        ctx.lineWidth = 0.5;
        ctx.setLineDash([5, 5]);
    }

    #drawCtxRectangle(ctx) {
        ctx.beginPath();
        ctx.rect(
            this.#shapeArea[0],
            this.#shapeArea[1],
            Math.abs(this.#shapeArea[2] - this.#shapeArea[0]),
            Math.abs(this.#shapeArea[3] - this.#shapeArea[1])
        );
        ctx.closePath();
        ctx.stroke();
    }

    #drawCtxRoundedRectangle(ctx) {
        var r = parseInt(super.getProperty("corner_radius"));
        var w = Math.abs(this.#shapeArea[2] - this.#shapeArea[0]);
        var h = Math.abs(this.#shapeArea[3] - this.#shapeArea[1]);
        var x = this.#shapeArea[0];
        var y = this.#shapeArea[1];

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
    }

    #drawCtxEllipse(ctx) {
        var w = Math.abs(this.#shapeArea[2] - this.#shapeArea[0]);
        var h = Math.abs(this.#shapeArea[3] - this.#shapeArea[1]);
        var x = this.#shapeArea[0];
        var y = this.#shapeArea[1];
        var cx = x + (w / 2);
        var cy = y + (h / 2);

        ctx.beginPath();
        ctx.ellipse(cx, cy, (w / 2), (h / 2), 0, 0, 2 * Math.PI);
        ctx.closePath();
        
        ctx.stroke();
    }

    #drawCtxMoveFree(ctx, x, y) {
        if (this.#prevPos[0] != x || this.#prevPos[1] != y) {
            this.#points.push([x, y]);
        }

        this.#prevPos[0] = x;
        this.#prevPos[1] = y;

        ctx.beginPath();
        ctx.moveTo(this.#points[0][0], this.#points[0][1]);
        for (var i = 1; i < this.#points.length; i++) {
            ctx.lineTo(this.#points[i][0], this.#points[i][1]);
        }
        ctx.closePath();
        ctx.stroke();
    }

    #drawCtxEndFree(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.#points[0][0], this.#points[0][1]);
        for (var i = 1; i < this.#points.length; i++) {
            ctx.lineTo(this.#points[i][0], this.#points[i][1]);
        }
        ctx.closePath();
        ctx.stroke();
    }

    #drawCtxPolygon(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.#points[0][0], this.#points[0][1]);
        for (var i = 1; i < this.#points.length; i++) {
            ctx.lineTo(this.#points[i][0], this.#points[i][1]);
        }
        ctx.closePath();
        ctx.stroke();
    }

    #setSelectFromRectangle() {
        var s = document.getElementById("select_layer");
        s.setSelection(
            "rectangle",
            [
                this.#shapeArea[0],
                this.#shapeArea[1],
                Math.abs(this.#shapeArea[2] - this.#shapeArea[0]),
                Math.abs(this.#shapeArea[3] - this.#shapeArea[1])
            ],
            this.#dirtyArea
        );
    }

    #setSelectFromRoundedRectangle() {
        var s = document.getElementById("select_layer");
        s.setSelection(
            "rounded_rectangle",
            [
                this.#shapeArea[0],
                this.#shapeArea[1],
                Math.abs(this.#shapeArea[2] - this.#shapeArea[0]),
                Math.abs(this.#shapeArea[3] - this.#shapeArea[1]),
                parseInt(super.getProperty("corner_radius"))
            ],
            this.#dirtyArea
        );
    }

    #setSelectFromEllipse() {
        var s = document.getElementById("select_layer");
        s.setSelection(
            "ellipse",
            [
                this.#shapeArea[0],
                this.#shapeArea[1],
                Math.abs(this.#shapeArea[2] - this.#shapeArea[0]),
                Math.abs(this.#shapeArea[3] - this.#shapeArea[1])
            ],
            this.#dirtyArea
        );
    }

    #setSelectFromFree() {
        var s = document.getElementById("select_layer");
        s.setSelection(
            "free",
            this.#points,
            this.#dirtyArea
        );
    }

    #setSelectFromPolygon() {
        var s = document.getElementById("select_layer");
        s.setSelection(
            "polygon",
            this.#points,
            this.#dirtyArea
        );
    }

    #setSelect() {
        if (
            super.getProperty("shape") == "rectangle" ||
            super.getProperty("shape") == "rounded_rectangle" ||
            super.getProperty("shape") == "ellipse"
        ) {
            if (
                this.#shapeArea.length != 4 ||
                this.#shapeArea[0] >= this.#shapeArea[2] ||
                this.#shapeArea[1] >= this.#shapeArea[3]
            ) {
                select.shape     = "";
                select.points    = [];
                select.dirtyArea = [];
            }
            switch (super.getProperty("shape")) {
            case "rectangle":
                this.#setSelectFromRectangle();
                break;
            case "rounded_rectangle":
                this.#setSelectFromRoundedRectangle();
                break;
            case "ellipse":
                this.#setSelectFromEllipse();
                break;
            }
            return;
        }

        if (
            super.getProperty("shape") == "free" ||
            super.getProperty("shape") == "polygon"
        ) {
            if (this.#points.length < 3) {
                select.shape     = "";
                select.points    = [];
                select.dirtyArea = [];
            }
            switch (super.getProperty("shape")) {
                case "free":
                    this.#setSelectFromFree();
                    break;
                case "polygon":
                    this.#setSelectFromPolygon();
                    break;
            }
            return;
        }
    }

    startedCallback(x, y, shiftKey, altKey) {
        // polygon does not use startedCallback
        this.#resetDirtyArea();
        this.#resetShapeArea();
        this.#resetPosAndPoints();
        super.clearPad();

        this.#startPos = [x, y];

        var padCtx = document.getElementById('pad_layer').getContext('2d');
        this.#setCtxStyle(padCtx);
        this.#updateDirtyArea(x, y);

        if (super.getProperty("shape") == "free") {
            this.#prevPos = [-1, -1];
            this.#points  = [x, y];
        }
    }

    pointedCallback(x, y) {
        // used by polygon only
        // polygon does not use shape area
        this.#updateDirtyArea(x, y);
        super.clearPadArea(this.#dirtyArea);

        this.#points.push([x, y]);

        if (this.#points.length > 1) {
            var padCtx = document.getElementById('pad_layer').getContext('2d');
            this.#setCtxStyle(padCtx);

            this.#drawCtxPolygon(padCtx);
        }
    }

    movedCallback(x, y, shiftKey, altKey) {
        // polygon should not use movedCallback
        if (super.getProperty("shape") == "polygon") {
            return;
        }

        this.#updateShapeArea(x, y);
        this.#updateDirtyAreaFromShapeArea();
        super.clearPadArea(this.#dirtyArea);

        if (super.getProperty("shape") != "free") {
            if (!this.#isShapeAreaExist()) {
                return;
            }
        }

        var padCtx = document.getElementById('pad_layer').getContext('2d');
        switch (super.getProperty("shape")) {
            case "rectangle":         this.#drawCtxRectangle(padCtx); break;
            case "rounded_rectangle": this.#drawCtxRoundedRectangle(padCtx); break;
            case "ellipse":           this.#drawCtxEllipse(padCtx); break;
            case "free":              this.#drawCtxMoveFree(padCtx, x, y); break;
        }
    }

    endedCallback(x, y, shiftKey, altKey) {
        super.clearPadArea(this.#dirtyArea);

        if (super.getProperty("shape") != "free") {

            if (super.getProperty("shape") != "polygon") {
                this.#updateShapeArea(x, y);
                this.#updateDirtyAreaFromShapeArea();
            } 

            if (super.getProperty("shape") != "polygon") {
                if (!this.#isShapeAreaExist()) {
                    return;
                }
            }
        }

        this.#setSelect();
    }

    cancelledCallback() {
        this.selectedCallback();
    }

    selectedCallback() {
        this.#resetDirtyArea();
        this.#resetShapeArea();
        this.#resetPosAndPoints();

        super.clearPad();
    }
}

window.customElements.define("edytor-tool-select", EdytorSelectTool);
