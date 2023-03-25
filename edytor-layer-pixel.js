class EdytorPixelLayer extends HTMLCanvasElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.classList.add('edytor_layer');
        this.style.margin = 0;
        this.style.padding = 0;
        this.style.position = "absolute";
        this.style.top = 0;
        this.style.left = 0;
    }
}

window.customElements.define("edytor-layer-pixel", EdytorPixelLayer, { extends: 'canvas' });
