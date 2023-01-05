class EdytorLayerTools extends HTMLElement {
  constructor() {
    super();
  }

  #addCheckbox() {
    var b = document.createElement('input');
    b.type = "checkbox";
    b.id = "layer_tool_tickall";
    b.addEventListener('click', function () {
      document.getElementById('layer_list').__tickAllLayers(this.checked);
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
        document.getElementById("layer_tool_tickall").checked = false;
      });
    }
    if (label == '+P') {
      b.addEventListener('click', function () {
        document.getElementById('edytor').__addPixelLayer();
        document.getElementById("layer_tool_tickall").checked = false;
      });
    }
    if (label == 'L') {
      b.addEventListener('click', function () {
        document.getElementById('edytor').__toggleLayersLocked(
          document.getElementById('layer_list').__getSelectedLayers()
        );
      });
    }
    if (label == 'H') {
      b.addEventListener('click', function () {
        document.getElementById('edytor').__toggleLayersHidden(
          document.getElementById('layer_list').__getSelectedLayers()
        );
      });
    }
    if (label == 'X') {
      b.addEventListener('click', function () {
        document.getElementById('edytor').__deleteLayers(
          document.getElementById('layer_list').__getSelectedLayers()
        );
        document.getElementById("layer_tool_tickall").checked = false;
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

  __setTickAll(b) {
    document.getElementById("layer_tool_tickall").checked = b;
  }
}

window.customElements.define('edytor-layer-tools', EdytorLayerTools);
