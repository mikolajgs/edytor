class RectangleTool {
    Name = "Rectangle"
    Icon = "v:rec"
    RequiresPad = true
    IsMultiClick = false

    #startPoint = [0, 0];
    #movePoint = [0, 0];
    #endPoint = [0, 0];
    #refDrawedObject = null;
    #ref = {
        pad: null
    }

    #getSVGFunc = null;
    #getStyleFunc = null;

    constructor(pad, getStyleFunc, getSVGFunc) {
        this.#ref.pad = pad;
        this.#getStyleFunc = getStyleFunc;
        this.#getSVGFunc = getSVGFunc;
    }

    DrawStart(x, y) {
        if (this.#getSVGFunc() === null) {
            alert('No vector layer has been selected');
            return;
        }
        this.#startPoint = [x, y];
    }
    DrawMove(x, y) {
        if (this.#getSVGFunc() === null) {
            return;
        }

        this.#movePoint = [x, y];
        if (this.#movePoint[1] != this.#startPoint[1] && this.#movePoint[0] != this.#startPoint[0]) {
            if (this.#refDrawedObject == null) {
                this.#refDrawedObject = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
                this.#refDrawedObject.setAttribute("fill", this.#getStyleFunc('color-fg'));
                this.#refDrawedObject.setAttribute("fill-opacity", this.#getStyleFunc('fill-opacity'));
                this.#refDrawedObject.setAttribute("fill-rule", this.#getStyleFunc('fill-rule'));
                this.#refDrawedObject.setAttribute("stroke", this.#getStyleFunc('color-bg'));
                this.#refDrawedObject.setAttribute("stroke-width", this.#getStyleFunc('stroke-width'));
                this.#refDrawedObject.setAttribute("stroke-opacity", this.#getStyleFunc('stroke-opacity'));
                this.#refDrawedObject.setAttribute("stroke-linecap", this.#getStyleFunc('stroke-linecap'));
                this.#refDrawedObject.setAttribute("stroke-linejoin", this.#getStyleFunc('stroke-linejoin'));
                this.#refDrawedObject.setAttribute("stroke-dasharray", this.#getStyleFunc('stroke-dasharray'));
            }
            this.#refDrawedObject.setAttribute("width", (this.#startPoint[0] < this.#movePoint[0] ? this.#movePoint[0] - this.#startPoint[0] : this.#startPoint[0] - this.#movePoint[0]));
            this.#refDrawedObject.setAttribute("height", (this.#startPoint[1] < this.#movePoint[1] ? this.#movePoint[1] - this.#startPoint[1] : this.#startPoint[1] - this.#movePoint[1]));
            this.#refDrawedObject.setAttribute("x", (this.#startPoint[0] < this.#movePoint[0] ? this.#startPoint[0] : this.#movePoint[0]))
            this.#refDrawedObject.setAttribute("y", (this.#startPoint[1] < this.#movePoint[1] ? this.#startPoint[1] : this.#movePoint[1]))
            this.#getSVGFunc().appendChild(this.#refDrawedObject);
        } else {
            if (this.#refDrawedObject != null) {
                this.#refDrawedObject.parentNode.removeChild(this.#refDrawedObject);
            }
        }
    }
    DrawEnd(x, y) {
        if (this.#getSVGFunc() === null) {
            return;
        }

        this.#endPoint = [x, y];
        this.#refDrawedObject = null;
    }
    DrawCancel() {
        //this.#refDrawedObject.parentNode.removeChild(this.#refDrawedObject);
    }
}