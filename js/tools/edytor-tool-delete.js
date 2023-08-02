class EdytorDeleteTool extends EdytorTool {
    RequiresPad = false;

    isMultiClick() {
        return false;
    }

    constructor() {
        super();
    }

    connectedCallback() {
        super.init('delete', 'fa-trash', 'Delete');
        super.addButton("Delete", function () {
            document.getElementById('tool_delete').deleteSelection();
        });
    }


    toggleOn() {
        super.toggleOn();
    }

    toggleOff() {
        super.toggleOff();
    }

    startedCallback(x, y, shiftKey, altKey) {
    }

    pointedCallback(x, y) {
    }

    movedCallback(x, y, shiftKey, altKey) {
    }

    endedCallback(x, y, shiftKey, altKey) {
    }

    cancelledCallback() {
    }

    selectedCallback() {
    }

    #drawFreeOrPolygon(ctx, points, inverted) {
        ctx.beginPath();
        ctx.moveTo(points[0][0], points[0][1]);
        for (var i = 1; i < points.length; i++) {
            ctx.lineTo(points[i][0], points[i][1]);
        }
        ctx.closePath();
        ctx.fill();
    }

    #drawRectangle(ctx, points, inverted) {
        ctx.beginPath();
        ctx.rect(
            points[0],
            points[1],
            points[2],
            points[3]
        );
        ctx.closePath();
        ctx.fill();
    }

    #drawRoundedRectangle(ctx, points, inverted) {
        var r = points[4];
        var w = points[2];
        var h = points[3];
        var x = points[0];
        var y = points[1];

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
        ctx.fill();
    }

    #drawEllipse(ctx, points, inverted) {
        var w = points[2];
        var h = points[3];
        var x = points[0];
        var y = points[1];
        var cx = x + (w / 2);
        var cy = y + (h / 2);

        ctx.beginPath();
        ctx.ellipse(cx, cy, (w / 2), (h / 2), 0, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
    }

    deleteSelection() {
        var layer = super.getLayer(true);
        if (layer === null) {
            return;
        }

        var edytor = document.getElementById("edytor");
        var selectLayer = document.getElementById("select_layer");
        if (!selectLayer.isSelection()) {
            edytor.showError("No selection to delete");
            return;
        }

        var shape    = selectLayer.getSelectionShape();
        var points   = selectLayer.getSelectionPoints();
        var inverted = selectLayer.getSelectionInverted();

        var ctx = layer.getContext("2d");
        ctx.lineWidth = 0;
        ctx.lineCap   = "square";
        ctx.fillStyle = "rgba(255,255,255,1)";
        ctx.globalCompositeOperation 
        	= (inverted ? 'destination-in' : 'destination-out');

        if (
            shape == "rectangle" ||
            shape == "rounded_rectangle" ||
            shape == "ellipse"
        ) {

            if (shape == "rounded_rectangle" && points.length < 5) {
                return;
            }
            if (points.length < 4) {
                return;
            }

            switch (shape) {
            case "rectangle":         this.#drawRectangle(ctx, points, inverted); break;
            case "rounded_rectangle": this.#drawRoundedRectangle(ctx, points, inverted); break;
            case "ellipse":           this.#drawEllipse(ctx, points, inverted); break;
            }

        } else if (shape == "free" || shape == "polygon") {
            if (points.length < 3) {
                return;
            }

            this.#drawFreeOrPolygon(ctx, points, inverted);
        }
    }
}

window.customElements.define("edytor-tool-delete", EdytorDeleteTool);
