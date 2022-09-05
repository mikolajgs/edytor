class PolygonTool {
    Name = "Polygon"
    Icon = "v:pgon"
    RequiresPad = true
    IsMultiClick = true

    #points = [];
    #refDrawedObject = null;
    #ref = {
        pad: null
    };

    #getSVGFunc = null;
    #getStyleFunc = null;

    constructor(pad, getStyleFunc, getSVGFunc) {
        this.#ref.pad = pad;
        this.#getStyleFunc = getStyleFunc;
        this.#getSVGFunc = getSVGFunc;
    }

    DrawStart(x, y) {
    }
    DrawPoint(x, y) {
        if (this.#getSVGFunc() === null) {
            alert('No vector layer has been selected');
            return;
        }

        this.#points.push([x, y]);
        if (this.#points.length == 2) {
            if (this.#refDrawedObject == null) {
                this.#refDrawedObject = document.createElementNS("http://www.w3.org/2000/svg", 'polygon');
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
            this.#refDrawedObject.setAttribute("points", this.#points[0][0] + " " + this.#points[0][1] + " " + this.#points[1][0] + " " + this.#points[1][1]);
            this.#getSVGFunc().appendChild(this.#refDrawedObject);
        }
        if (this.#points.length > 2 && (this.#points[this.#points.length - 1] != x && this.#points[this.#points.length - 1] != y)) {
            this.#refDrawedObject.setAttribute("points", this.#refDrawedObject.getAttribute("points") + " " + x + " " + y);
        }
    }
    DrawMove(x, y) {
    }
    DrawEnd(x, y) {
        if (this.#getSVGFunc() === null) {
            return;
        }

        if (this.#points[this.#points.length - 1][0] == this.#points[this.#points.length - 2][0] && this.#points[this.#points.length - 1][1] == this.#points[this.#points.length - 2][1]) {
            this.#points.pop();
        }
        this.#points = [];
        this.#refDrawedObject = null;
    }
    DrawCancel() {
        //this.#refDrawedObject.parentNode.removeChild(this.#refDrawedObject);
    }
}