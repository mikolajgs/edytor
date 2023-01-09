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

  #addButton(name, className, alt) {
    var b = document.createElement('button');
    b.className = "edytor_toggle_off";
    b.innerHTML = '<i class="fa-solid ' + className + '" alt="' + alt + '"></i>';
    if (name == '+V') {
      b.addEventListener('click', function () {
        document.getElementById('edytor').__addVectorLayer();
        document.getElementById("layer_tool_tickall").checked = false;
      });
    }
    if (name == '+P') {
      b.addEventListener('click', function () {
        document.getElementById('edytor').__addPixelLayer();
        document.getElementById("layer_tool_tickall").checked = false;
      });
    }
    if (name == 'L') {
      b.addEventListener('click', function () {
        document.getElementById('edytor').__toggleLayersLocked(
          document.getElementById('layer_list').__getTickedLayers()
        );
      });
    }
    if (name == 'H') {
      b.addEventListener('click', function () {
        document.getElementById('edytor').__toggleLayersHidden(
          document.getElementById('layer_list').__getTickedLayers()
        );
      });
    }
    if (name == 'X') {
      b.addEventListener('click', function () {
        document.getElementById('edytor').__deleteLayers(
          document.getElementById('layer_list').__getTickedLayers()
        );
        document.getElementById("layer_tool_tickall").checked = false;
      });
    }
    this.appendChild(b);
  }

  connectedCallback() {
    this.id = "layer_tools"
    this.#addCheckbox();
    //this.#addButton('+V');
    this.#addButton('+P', 'fa-plus', 'Add layer');
    this.#addButton('L', 'fa-lock', 'Lock/unlock layer');
    this.#addButton('H', 'fa-eye-slash', 'Show/hide layer');
    this.#addButton('X', 'fa-trash', 'Delete layer');
  }

  __setTickAll(b) {
    document.getElementById("layer_tool_tickall").checked = b;
  }
}

window.customElements.define('edytor-layer-tools', EdytorLayerTools);
