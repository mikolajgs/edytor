class EdytorShapeTool extends EdytorTool {
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
        this.#resetDirtyArea();
        this.#resetShapeArea();
        this.#resetPosAndPoints();

        super.init('shape', 'fa-shapes', 'Shape');
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
        super.addProperty("Style", "style", "", {
            "stroke": "stroke",
            "fill": "fill",
            "stroke+fill": "stroke+fill"
        }, {
            "stroke": ["width", "linecap", "linejoin"],
            "stroke+fill": ["width", "linecap", "linejoin"],
            "_": ["width", "linecap", "linejoin"]
        }, false);
        super.addProperty("Width", "width", "3", null, null, false);
        super.addProperty("Linecap", "linecap", "", {
            "butt": "butt",
            "square": "square",
            "round": "round"
        }, null, false);
        super.addProperty("Linejoin", "linejoin", "", {
            "miter": "miter",
            "round": "round",
            "bevel": "bevel"
        }, null, false);
        super.addProperty("Radius", "corner_radius", "3", null, null, true);
        super.addProperty("1:1", "1_to_1", false, null, null, false);
        super.addProperty("Draw from center", "draw_from_center", false, null, null, false);
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
            parseInt(super.getProperty('width')),
            parseInt(super.getProperty('width'))
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
            parseInt(super.getProperty('width')),
            parseInt(super.getProperty('width'))
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

        ctx.strokeStyle = document.getElementById('edytor').getSelectedFgColour();
        ctx.fillStyle   = document.getElementById('edytor').getSelectedBgColour();
        ctx.lineWidth   = super.getProperty('width');
        ctx.lineCap     = super.getProperty('linecap');
        ctx.lineJoin    = super.getProperty('linejoin');
    }

    #fillAndStroke(ctx) {
        if (super.getProperty('style') == "fill" || super.getProperty('style') == "stroke+fill") {
            ctx.fill();
        }

        if (super.getProperty('style') == "stroke" || super.getProperty('style') == "stroke+fill") {
            ctx.stroke();
        }
    }


    #drawCtxPolygon(ctx) {
        document.getElementById("edytor").drawPolygonPathOnCtx(ctx, this.#points);
        this.#fillAndStroke(ctx);
    }

    #drawCtxRestOfShapes(ctx) {
        switch (super.getProperty("shape")) {
            case "rectangle":
                document.getElementById("edytor").drawRectanglePathOnCtx(ctx, this.#shapeArea);
                break;

            case "rounded_rectangle":
                document.getElementById("edytor").drawRoundedRectanglePathOnCtx(ctx, this.#shapeArea, parseInt(super.getProperty("corner_radius")));
                break;

            case "ellipse":
                document.getElementById("edytor").drawEllipsePathOnCtx(ctx, this.#shapeArea);
                break;
        }

        this.#fillAndStroke(ctx);
    }

    startedCallback(x, y, shiftKey, altKey) {
        // polygon does not use startedCallback
        var layer = super.getLayer(true);
        if (layer === null) {
            return;
        }

        this.#resetDirtyArea();
        this.#resetShapeArea();
        this.#resetPosAndPoints();
        super.clearPad();

        this.#startPos = [x, y];

        if (super.getProperty("shape") == "free") {
            var layerCtx = layer.getContext('2d');
            this.#setCtxStyle(layerCtx);
            layerCtx.beginPath();

            this.#prevPos = [-1, -1];
        } else {
            var padCtx = document.getElementById('pad_layer').getContext('2d');
            this.#setCtxStyle(padCtx);

            this.#updateDirtyArea(x, y);
        }
    }

    pointedCallback(x, y) {
        // used by polygon only
        var layer = super.getLayer(true);
        if (layer === null) {
            return;
        }

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

        var layer = super.getLayer(false);
        if (layer === null) {
            return;
        }

        if (super.getProperty("shape") != "free") {
            this.#updateShapeArea(x, y);
            this.#updateDirtyAreaFromShapeArea();
            super.clearPadArea(this.#dirtyArea);

            if (!this.#isShapeAreaExist()) {
                return;
            }
        }

        var layerCtx = layer.getContext('2d');
        var padCtx = document.getElementById('pad_layer').getContext('2d');

        if (super.getProperty("shape") == "free") {
            if (this.#prevPos[0] != x || this.#prevPos[1] != y) {
                layerCtx.lineTo(x, y);
                layerCtx.stroke();
            }

            this.#prevPos[0] = x;
            this.#prevPos[1] = y;

            return;
        }

        this.#drawCtxRestOfShapes(padCtx);
    }

    endedCallback(x, y, shiftKey, altKey) {
        var layer = super.getLayer(false);
        if (layer === null) {
            return;
        }

        if (super.getProperty("shape") != "free") {

            if (super.getProperty("shape") != "polygon") {
                this.#updateShapeArea(x, y);
                this.#updateDirtyAreaFromShapeArea();
            } else {
                this.#updateDirtyArea(x, y);
            }

            super.clearPadArea(this.#dirtyArea);

            if (super.getProperty("shape") != "polygon") {
                if (!this.#isShapeAreaExist()) {
                    return;
                }
            }
        }

        var ctx = layer.getContext('2d');
        this.#setCtxStyle(ctx);

        if (super.getProperty("shape") == "free") {
            ctx.closePath();
            this.#fillAndStroke(ctx);

            return;
        }

        if (super.getProperty("shape") == "polygon") {
            this.#drawCtxPolygon(ctx);
            this.#resetPosAndPoints();

            return;
        }

        this.#drawCtxRestOfShapes(ctx);
    }

    cancelledCallback() {
        this.selectedCallback();

        var layer = super.getLayer(false);
        if (layer === null) {
            return;
        }

        if (super.getProperty("shape") == "free") {
            var ctx = layer.getContext('2d');
            ctx.closePath();
        }
    }

    selectedCallback() {
        this.#resetDirtyArea();
        this.#resetShapeArea();
        this.#resetPosAndPoints();

        super.clearPad();
    }
}

window.customElements.define("edytor-tool-shape", EdytorShapeTool);
