class EdytorPad extends HTMLCanvasElement {
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

        this.#attachEvents();
    }

    #setSize() {
        this.width = window.innerWidth * 2;
        this.height = window.innerHeight * 2;
    }

    #attachEvents() {
        var scope = this;
        this.addEventListener('mousedown', function (e) {
            scope.#mouseDown = true;
            var toolName = document.getElementById('edytor').__getSelectedTool();
            var tool = document.getElementById('tool_' + toolName);
            if (!tool.IsMultiClick) {
                tool.__drawStart(e.layerX, e.layerY, e.shiftKey);
            }
        });
        this.addEventListener('mousemove', function (e) {
            var toolName = document.getElementById('edytor').__getSelectedTool();
            var tool = document.getElementById('tool_' + toolName);
            if ((scope.#mouseDown && !tool.IsMultiClick) || tool.IsMultiClick) {
                tool.__drawMove(e.layerX, e.layerY, e.shiftKey);
            }
        });
        this.addEventListener('mouseup', function (e) {
            scope.#mouseDown = false;
            var toolName = document.getElementById('edytor').__getSelectedTool();
            var tool = document.getElementById('tool_' + toolName);
            if (!tool.IsMultiClick) {
                tool.__drawEnd(e.layerX, e.layerY, e.shiftKey);
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
            if (tool.IsMultiClick) {
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