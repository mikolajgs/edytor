class EdytorRectangleTool extends EdytorTool {
    /*Name = "Rectangle"
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

    #getLayerFunc = null;
    #getStyleFunc = null;*/

    constructor() {
        super();
    }

    connectedCallback() {
        super._init('rectangle', 'v:rec');
    }

    __toggleOn() {
        super.__toggleOn();
    }

    __toggleOff() {
        super.__toggleOff();
    }

    /*DrawStart(x, y) {
        if (this.#getLayerFunc() === null) {
            alert('No layer has been selected');
            return;
        }
        if (this.#getLayerFunc().GetSVG() === null) {
            alert('No vector layer has been selected');
            return;
        }
        if (this.#getLayerFunc().Locked) {
            alert('Layer is locked for editing');
            return;
        }
        if (this.#getLayerFunc().Hidden) {
            return;
        }

        this.#startPoint = [x, y];
    }
    DrawMove(x, y) {
        if (this.#getLayerFunc() === null) {
            return;
        }
        if (this.#getLayerFunc().GetSVG() === null) {
            return;
        }
        if (this.#getLayerFunc().Locked) {
            return;
        }
        if (this.#getLayerFunc().Hidden) {
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
                this.#getLayerFunc().GetSVG().appendChild(this.#refDrawedObject);
            }
            this.#refDrawedObject.setAttribute("width", (this.#startPoint[0] < this.#movePoint[0] ? this.#movePoint[0] - this.#startPoint[0] : this.#startPoint[0] - this.#movePoint[0]));
            this.#refDrawedObject.setAttribute("height", (this.#startPoint[1] < this.#movePoint[1] ? this.#movePoint[1] - this.#startPoint[1] : this.#startPoint[1] - this.#movePoint[1]));
            this.#refDrawedObject.setAttribute("x", (this.#startPoint[0] < this.#movePoint[0] ? this.#startPoint[0] : this.#movePoint[0]));
            this.#refDrawedObject.setAttribute("y", (this.#startPoint[1] < this.#movePoint[1] ? this.#startPoint[1] : this.#movePoint[1]));
        } else {
            if (this.#refDrawedObject != null) {
                this.#refDrawedObject.parentNode.removeChild(this.#refDrawedObject);
            }
        }
    }
    DrawEnd(x, y) {
        if (this.#getLayerFunc() === null) {
            return;
        }
        if (this.#getLayerFunc().GetSVG() === null) {
            return;
        }
        if (this.#getLayerFunc().Locked) {
            return;
        }
        if (this.#getLayerFunc().Hidden) {
            return;
        }

        this.#endPoint = [x, y];
        this.#refDrawedObject = null;
    }
    DrawCancel() {
        //this.#refDrawedObject.parentNode.removeChild(this.#refDrawedObject);
    }*/
}

window.customElements.define("edytor-tool-rectangle", EdytorRectangleTool);