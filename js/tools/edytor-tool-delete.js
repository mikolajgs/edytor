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
            case "rectangle":
                document.getElementById("edytor").drawRectanglePathOnCtx(ctx, points);
                break;
            case "rounded_rectangle":
                document.getElementById("edytor").drawRoundedRectanglePathOnCtx(ctx, points, points[4]);
                break;
            case "ellipse":
                document.getElementById("edytor").drawEllipsePathOnCtx(ctx, points);
                break;
            }
            ctx.fill();

        } else if (shape == "free" || shape == "polygon") {
            if (points.length < 3) {
                return;
            }

            document.getElementById("edytor").drawPolygonPathOnCtx(ctx, points);
            ctx.fill();
        }
    }
}

window.customElements.define("edytor-tool-delete", EdytorDeleteTool);
