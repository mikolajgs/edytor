class EdytorLayerTools extends HTMLElement {
  constructor() {
    super();
  }

  #addCheckbox() {
    var b = document.createElement('input');
    b.type = "checkbox";
    b.id = "layer_tool_tickall";
    b.addEventListener('click', function () {
      document.getElementById('layers').__tickAllLayers(this.checked);
    });
    this.appendChild(b);
  }

  #addButton(label) {
    var b = document.createElement('button');
    b.className = "edytor_toggle_off";
    b.textContent = label;
    if (label == '+V') {
      b.addEventListener('click', function () {
        document.getElementById('edytor').__addVectorLayer();
      });
    }
    if (label == '+P') {
      b.addEventListener('click', function () {
        document.getElementById('edytor').__addPixelLayer();
      });
    }
    if (label == 'L') {
      b.addEventListener('click', function () {
        document.getElementById('edytor').__toggleLayersLock(
          document.getElementById('layers').__getSelectedLayers()
        );
      });
    }
    if (label == 'H') {
      b.addEventListener('click', function () {
        document.getElementById('edytor').__toggleLayersHide(
          document.getElementById('layers').__getSelectedLayers()
        );
      });
    }
    if (label == 'X') {
      b.addEventListener('click', function () {
        document.getElementById('edytor').__deleteLayers(
          document.getElementById('layers').__getSelectedLayers()
        );
      });
    }
    this.appendChild(b);
  }

  connectedCallback() {
    this.id = "layer_tools"
    this.#addCheckbox();
    this.#addButton('+V');
    this.#addButton('+P');
    this.#addButton('L');
    this.#addButton('H');
    this.#addButton('X');
  }
}

window.customElements.define('edytor-layer-tools', EdytorLayerTools);
