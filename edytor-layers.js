class EdytorLayers extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.id = "layers"
  }

  __tickAllLayers(b) {

  }

  __getSelectedLayers() {
    return [];
  }
}

window.customElements.define('edytor-layers', EdytorLayers);
