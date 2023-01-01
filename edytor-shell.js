class EdytorShell extends HTMLInputElement {
  constructor() {
    super();
    this.type = "text";
  }

  connectedCallback() {
    this.id = "shell";
    this.className = "edytor_shell";

    var self = this;
    window.addEventListener("resize", function () {
      self.#setSize();
    });
    this.#setSize();
  }

  #setSize() {
    this.style.width = (window.innerWidth - 6) + 'px';
  }
}

window.customElements.define("edytor-shell", EdytorShell, { extends: 'input' });