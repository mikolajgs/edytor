class EdytorPad extends HTMLCanvasElement {
    #mouseDown = false;

    constructor() {
        super();
    }

    connectedCallback() {
        this.id = "pad_layer";
        this.style.margin = 0;
        this.style.padding = 0;
        this.style.display = "block";
        this.style.position = "absolute";
        this.style.top = 0;
        this.style.left = 0;
        this.style.boxSizing = "border-box";
        this.style.width = "100%";
        this.style.border = "0";
        this.style.zIndex = 401;
        this.style.display = 'none';

        this.#attachEvents();
    }

    SetSize(w, h) {
        this.width = w;
        this.height = h;
    }

    #attachEvents() {
        var scope = this;
        this.addEventListener('mousedown', function (e) {
            scope.#mouseDown = true;
            var toolName = document.getElementById('edytor').__getSelectedTool();
            var tool = document.getElementById('tool_' + toolName);
            if (!tool.__isMultiClick()) {
                tool.__drawStart(e.layerX, e.layerY, e.shiftKey, e.altKey);
            }
        });
        this.addEventListener('mousemove', function (e) {
            var toolName = document.getElementById('edytor').__getSelectedTool();
            var tool = document.getElementById('tool_' + toolName);
            if ((scope.#mouseDown && !tool.__isMultiClick()) || tool.__isMultiClick()) {
                tool.__drawMove(e.layerX, e.layerY, e.shiftKey, e.altKey);
            }
            document.getElementById("edit_info").SetPosition(e.offsetX, e.offsetY);
        });
        this.addEventListener('mouseup', function (e) {
            scope.#mouseDown = false;
            var toolName = document.getElementById('edytor').__getSelectedTool();
            var tool = document.getElementById('tool_' + toolName);
            if (!tool.__isMultiClick()) {
                tool.__drawEnd(e.layerX, e.layerY, e.shiftKey, e.altKey);
            } else {
                tool.__drawPoint(e.layerX, e.layerY);
            }
        });
        this.addEventListener('mouseout', function (e) {
            scope.#mouseDown = false;
            var toolName = document.getElementById('edytor').__getSelectedTool();
            var tool = document.getElementById('tool_' + toolName);
            tool.__drawCancel();
        });
        this.addEventListener('dblclick', function (e) {
            scope.#mouseDown = false;
            var toolName = document.getElementById('edytor').__getSelectedTool();
            var tool = document.getElementById('tool_' + toolName);
            if (tool.__isMultiClick()) {
                tool.__drawEnd(e.layerX, e.layerY);
            }
        });
    }

    __show() {
        this.style.display = '';
    }

    __hide() {
        this.style.display = 'none';
    }
}

window.customElements.define("edytor-pad", EdytorPad, { extends: 'canvas' });
