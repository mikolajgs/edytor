class EdytorRight extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    this.id = "sidebar_right";

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

window.customElements.define("edytor-right", EdytorRight);