class EdytorLeft extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    this.id = "sidebar_left";

    var self = this;
    window.addEventListener("resize", function () {
      self.#setSize();
    });
    this.#setSize();
  }

  #setSize() {
    this.style.height = (window.innerHeight - 80) + 'px';
  }
}

window.customElements.define("edytor-left", EdytorLeft);