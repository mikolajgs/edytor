class Pad {
    #id = {
        pad: "",
        container: ""
    }
    #ref = {
        pad: null,
        container: null
    }
    #getToolFn = null;
    #mouseDown = false;

    constructor(idContainer, idPad) {
        this.#id.container = idContainer;
        this.#id.pad = idPad;

        this.#ref.container = document.getElementById(this.#id.container);
        if (this.#ref.container == null) {
            alert("div with id='"+this.#id.container+"' not found");
            return;
        }
    }

    #resizeToWindow() {
        var w = window.innerWidth;
        var h = window.innerHeight;
        this.#ref.pad.width = w*2;
        this.#ref.pad.height = h*2;
        this.#ref.pad.style.display = 'none';
    }

    #attachEvents() {
        var scope = this;
        this.#ref.pad.addEventListener('mousedown', function(e) {
            scope.#mouseDown = true;
            if (!scope.#getToolFn().IsMultiClick()) {
                scope.#getToolFn().DrawStart(e.layerX, e.layerY);
            }
        });
        this.#ref.pad.addEventListener('mousemove', function(e) {
            if ((scope.#mouseDown && !scope.#getToolFn().IsMultiClick()) || scope.#getToolFn().IsMultiClick()) {
                scope.#getToolFn().DrawMove(e.layerX, e.layerY);
            }
        });
        this.#ref.pad.addEventListener('mouseup', function(e) {
            scope.#mouseDown = false;
            if (!scope.#getToolFn().IsMultiClick()) {
                scope.#getToolFn().DrawEnd(e.layerX, e.layerY);
            } else {
                scope.#getToolFn().DrawPoint(e.layerX, e.layerY);
            }
        });
        this.#ref.pad.addEventListener('mouseout', function(e) {
            scope.#mouseDown = false;
            scope.#getToolFn().DrawCancel();
        });
        this.#ref.pad.addEventListener('dblclick', function(e) {
            scope.#mouseDown = false;
            if (scope.#getToolFn().IsMultiClick()) {
                scope.#getToolFn().DrawEnd(e.layerX, e.layerY);
            }
        });
    }

    Init(zIndex, getToolFn) {
        this.#ref.pad = document.createElement('canvas');
        this.#ref.pad.id = this.#id.pad;
        this.#ref.pad.classList.add('layer');
        this.#ref.pad.style.margin = 0;
        this.#ref.pad.style.padding = 0;
        this.#ref.pad.style.position = "absolute";
        this.#ref.pad.style.top = 0;
        this.#ref.pad.style.left = 0;
        this.#ref.pad.style.zIndex = zIndex;
        this.#ref.container.appendChild(this.#ref.pad);
        this.#resizeToWindow();

        this.#getToolFn = getToolFn;
        this.#attachEvents();
    }

    GetCanvas() {
        return this.#ref.pad;
    }

    Show() {
        this.#ref.pad.style.display = '';
    }

    Hide() {
        this.#ref.pad.style.display = 'none';
    }
}