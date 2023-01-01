class EdytorDspTool extends EdytorTool {
    /*Name = "TestGroup"
    Icon = "v:tgrp"
    RequiresPad = true
    IsMultiClick = false

    #startPoint = [0, 0];
    #movePoint = [0, 0];
    #endPoint = [0, 0];
    #refDrawedObject = null;
    #ref = {
        pad: null
    };

    #getLayerFunc = null;
    #getStyleFunc = null;*/

    constructor() {
        super();
    }

    connectedCallback() {
        super._init('dsp', 'v:dsp');
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
                this.#refDrawedObject = document.createElementNS("http://www.w3.org/2000/svg", 'g');
                this.#refDrawedObject.innerHTML = '<line x1="10" y1="10" x2="85" y2="10" style="stroke: #006600;"/>';
                this.#refDrawedObject.innerHTML += '<rect x="10" y="20" height="50" width="75" style="stroke: #006600; fill: #006600"/>';
                this.#refDrawedObject.innerHTML += '<text x="10" y="90" style="stroke: #660000; fill: #660000">Text grouped with shapes</text>';
                this.#getLayerFunc().GetSVG().appendChild(this.#refDrawedObject);
            }
            this.#refDrawedObject.setAttribute("transform",
                "translate(" +
                (this.#startPoint[0] < this.#movePoint[0] ? this.#startPoint[0] : this.#movePoint[0]) +
                "," +
                (this.#startPoint[1] < this.#movePoint[1] ? this.#startPoint[1] : this.#movePoint[1]) +
                ") " +
                "scale(" +
                (Math.abs(this.#startPoint[0] - this.#movePoint[0]) / 75) +
                "," +
                (Math.abs(this.#startPoint[1] - this.#movePoint[1]) / 55) +
                ") "
            );
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

    }*/
}

window.customElements.define("edytor-tool-dsp", EdytorDspTool);