class EdytorPad extends HTMLCanvasElement {
    #mouseDown = false;

    constructor() {
        super();
    }

    #attachCallbacks() {
        var scope = this;

        this.addEventListener('mousedown', function (e) {
            scope.#mouseDown = true;
            var toolName = document.getElementById('edytor').getSelectedTool();
            var tool = document.getElementById('tool_' + toolName);
            if (!tool.isMultiClick()) {
                tool.startedCallback(e.layerX, e.layerY, e.shiftKey, e.altKey);
            }
        });

        this.addEventListener('mousemove', function (e) {
            var toolName = document.getElementById('edytor').getSelectedTool();
            var tool = document.getElementById('tool_' + toolName);
            if ((scope.#mouseDown && !tool.isMultiClick()) || tool.isMultiClick()) {
                tool.movedCallback(e.layerX, e.layerY, e.shiftKey, e.altKey);
            }
            document.getElementById("edit_info").setPosition(e.offsetX, e.offsetY);
        });

        this.addEventListener('mouseup', function (e) {
            scope.#mouseDown = false;
            var toolName = document.getElementById('edytor').getSelectedTool();
            var tool = document.getElementById('tool_' + toolName);
            if (!tool.isMultiClick()) {
                tool.endedCallback(e.layerX, e.layerY, e.shiftKey, e.altKey);
            } else {
                tool.pointedCallback(e.layerX, e.layerY);
            }
        });

        this.addEventListener('mouseout', function (e) {
            scope.#mouseDown = false;
            var toolName = document.getElementById('edytor').getSelectedTool();
            var tool = document.getElementById('tool_' + toolName);
            tool.cancelledCallback();
        });

        this.addEventListener('dblclick', function (e) {
            var toolName = document.getElementById('edytor').getSelectedTool();
            var tool = document.getElementById('tool_' + toolName);
            if (tool.isMultiClick()) {
                tool.endedCallback(e.layerX, e.layerY, e.shiftKey, e.altKey);
            }
        });
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
        this.style.zIndex = 403;
        this.style.display = 'none';

        this.#attachCallbacks();
    }

    setSize(w, h) {
        this.width = w;
        this.height = h;
    }

    show() {
        this.style.display = '';
    }

    hide() {
        this.style.display = 'none';
    }
}

window.customElements.define("edytor-pad", EdytorPad, { extends: 'canvas' });
