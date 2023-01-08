class EdytorPad extends HTMLCanvasElement {
    #getToolFn = null;
    #mouseDown = false;

    constructor() {
        super();
    }

    connectedCallback() {
        this.id = "pad_layer";
        this.style.margin = 0;
        this.style.padding = 0;
        this.style.position = "absolute";
        this.style.top = 0;
        this.style.left = 0;
        this.style.zIndex = 401;
        this.style.display = 'none';

        var self = this;
        window.addEventListener("resize", function () {
            self.#setSize();
        });

        this.#setSize();

        this.#getToolFn = function () {
            return document.getElementById('edytor').__getCurrentTool();
        }

        //this.#attachEvents();
    }

    #setSize() {
        this.width = window.innerWidth * 2;
        this.height = window.innerHeight * 2;
    }

    /*#attachEvents() {
        var scope = this;
        this.addEventListener('mousedown', function (e) {
            scope.#mouseDown = true;
            if (!scope.#getToolFn().IsMultiClick) {
                scope.#getToolFn().DrawStart(e.layerX, e.layerY);
            }
        });
        this.addEventListener('mousemove', function (e) {
            if ((scope.#mouseDown && !scope.#getToolFn().IsMultiClick) || scope.#getToolFn().IsMultiClick) {
                scope.#getToolFn().DrawMove(e.layerX, e.layerY);
            }
        });
        this.addEventListener('mouseup', function (e) {
            scope.#mouseDown = false;
            if (!scope.#getToolFn().IsMultiClick) {
                scope.#getToolFn().DrawEnd(e.layerX, e.layerY);
            } else {
                scope.#getToolFn().DrawPoint(e.layerX, e.layerY);
            }
        });
        this.addEventListener('mouseout', function (e) {
            scope.#mouseDown = false;
            scope.#getToolFn().DrawCancel();
        });
        this.addEventListener('dblclick', function (e) {
            scope.#mouseDown = false;
            if (scope.#getToolFn().IsMultiClick) {
                scope.#getToolFn().DrawEnd(e.layerX, e.layerY);
            }
        });
    }*/

    __show() {
        this.style.display = '';
    }

    __hide() {
        this.style.display = 'none';
    }
}

window.customElements.define("edytor-pad", EdytorPad, { extends: 'canvas' });