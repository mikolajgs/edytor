class EdytorLayerContainer extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    this.style.margin = 0;
    this.style.padding = 0;
    this.style.position = "absolute";
    this.style.top = 0;
    this.style.left = 0;
    this.id = "layer_container";

    var self = this;
    window.addEventListener("resize", function () {
      self.#setSize();
    });
    this.#setSize();
  }

  #setSize() {
    this.style.width = (window.innerWidth * 2) + 'px';
    this.style.height = (window.innerHeight * 2) + 'px';
  }
}

window.customElements.define("edytor-layer-container", EdytorLayerContainer);