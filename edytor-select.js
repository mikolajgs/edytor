class EdytorSelect extends HTMLCanvasElement {
    #mouseDown = false;

    constructor() {
        super();
    }

    connectedCallback() {
        this.id = "select_layer";
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
    }

    SetSize(w, h) {
        this.width = w;
        this.height = h;
    }

    __show() {
        this.style.display = '';
    }

    __hide() {
        this.style.display = 'none';
    }
}

window.customElements.define("edytor-select", EdytorSelect, { extends: 'canvas' });
