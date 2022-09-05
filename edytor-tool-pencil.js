class PencilTool {
    Name = "Pencil"
    Icon = "p:pen"
    RequiresPad = true
    IsMultiClick = false

    #getCanvasFunc = null;
    #getStyleFunc = null;

    #topLeft = [0, 0];
    #bottomRight = [0, 0];
    #prevPos = [-1, -1];
    #ref = {
        pad: null
    }

    constructor(pad, getStyleFunc, getCanvasFunc) {
        this.#ref.pad = pad;
        this.#getStyleFunc = getStyleFunc;
        this.#getCanvasFunc = getCanvasFunc;
    }

    DrawStart(x, y) {
        if (this.#getCanvasFunc() === null) {
            alert('No pixel layer has been selected');
            return;
        }

        this.#ref.pixel = this.#getCanvasFunc();
        this.#ref.pixelCtx = this.#ref.pixel.getContext('2d');
        this.#ref.pixelCtx.strokeStyle = this.#getStyleFunc('color-fg');
        this.#ref.pixelCtx.lineWidth = this.#getStyleFunc('stroke-width');
        this.#ref.pixelCtx.lineCap = this.#getStyleFunc('stroke-linecap');
        this.#ref.pixelCtx.lineJoin = this.#getStyleFunc('stroke-linejoin');
        // todo
        //this.#ref.pixelCtx.setLineDash(this.#ref.edytor.GetStrokeDasharray());
        this.#ref.pixelCtx.beginPath();
        this.#ref.pixelCtx.moveTo(x, y);
    }
    DrawMove(x, y) {
        if (this.#getCanvasFunc() === null) {
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
            this.#ref.pixelCtx.lineTo(x, y);
            this.#ref.pixelCtx.stroke();
        }

        this.#prevPos[0] = x;
        this.#prevPos[1] = y;
    }
    DrawEnd(x, y) {
        if (this.#getCanvasFunc() === null) {
            return;
        }

        this.#ref.pixelCtx.closePath();
    }
    DrawCancel() {
        if (this.#getCanvasFunc() === null) {
            return;
        }

        this.#ref.pixelCtx.closePath();
    }
}