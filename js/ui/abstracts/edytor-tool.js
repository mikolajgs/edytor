class EdytorTool extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.init('tool', 'lbl');
  }

  init(name, className, alt) {
    this.id = "tool_" + name;
    this.setAttribute("edytor-tool-name", name);
    this.className = "edytor_toggle_off edytor_sidebar_toggle edytor_tool";
    this.innerHTML = '<i class="fa-solid ' + className + '" alt="' + alt + '"></i>';

    this.addEventListener('click', function () {
      document.getElementById("edit_info").setPosition(0, 0);
      document.getElementById('edytor').selectTool(name);
    });

    document.getElementById('edytor').initTool(name);

    var d = document.createElement('edytor-properties');
    d.id = "tool_config_" + name;
    d.style.display = 'none';
    document.getElementById("tool_config").appendChild(d);

    var title = document.createElement('div');
    title.className = "edytor_property edytor_property_title";
    title.innerHTML = alt;
    d.appendChild(title);
  }

  getToolCfgId() {
    return "tool_config_" + this.getAttribute("edytor-tool-name");
  }

  getToolPropertyIdPrefix() {
    return "tool_property_" + this.getAttribute("edytor-tool-name");
  }

  getToolPropertyId(name) {
    return this.getToolPropertyIdPrefix()+"_"+name;
  }

  toggleOn() {
    this.classList.remove('edytor_toggle_off');
    this.classList.add('edytor_toggle_on');
    document.getElementById(this.getToolCfgId()).style.display = '';
  }

  toggleOff() {
    this.classList.remove('edytor_toggle_on');
    this.classList.add('edytor_toggle_off');
    document.getElementById(this.getToolCfgId()).style.display = 'none';
  }

  addProperty(label, name, defval, vals, onchange, hiddenOnStart) {
    document.getElementById(this.getToolCfgId()).addProperty(
      this.getToolPropertyIdPrefix(), label, name, defval, vals, onchange, hiddenOnStart
    );
  }

  addButton(label, fn) {
    document.getElementById(this.getToolCfgId()).addButton(
      this.getToolPropertyIdPrefix(), label, fn
    );
  }

  getProperty(name) {
    var p = document.getElementById(this.getToolPropertyId(name));
    if (p.tagName.toLowerCase() == "input" && p.getAttribute("type").toLowerCase() == "checkbox") {
      return (p.checked ? "true" : "false");
    }
    return p.value;
  }

  getLayer(showError) {
    var edytor = document.getElementById('edytor');

    var layerNum = edytor.getSelectedLayer();
    if (layerNum === 0 || layerNum === null) {
      if (showError === true) {
        edytor.showError("No layer has been selected");
      }
      return null;
    }

    var layer = document.getElementById('layer_' + layerNum);
    if (layer.tagName.toLowerCase() !== 'canvas') {
      if (showError === true) {
        edytor.showError("No pixel layer has been selected");
      }
      return null;
    }
    if (layer.getAttribute("locked") === "true") {
      if (showError === true) {
        edytor.showError("Layer is locked for editing");
      }
      return null;
    }
    if (layer.style.display === 'none') {
      return null;
    }
    return layer;
  }


  // Functions related to drawing, clearing, points, input area etc.
  calculateDirtyArea(curDirtyArea, x1, y1, x2, y2, w, h, dx, dy) {
    var newDirtyArea = [];
    newDirtyArea[0] = Math.min((x1-dx < 0 ? 0 : x1-dx), curDirtyArea[0]);
    newDirtyArea[1] = Math.min((y1-dy < 0 ? 0 : y1-dy), curDirtyArea[1]);
    newDirtyArea[2] = Math.max((x2+dx > w ? w : x2+dx), curDirtyArea[2]);
    newDirtyArea[3] = Math.max((y2+dy > h ? h : y2+dy), curDirtyArea[3]);
    return newDirtyArea;
  }

  clearPad() {
    document.getElementById('pad_layer').getContext('2d').clearRect(
      0, 0,
      document.getElementById('pad_layer').width,
      document.getElementById('pad_layer').height
    );
  }

  clearPadArea(dirtyArea) {
    document.getElementById('pad_layer').getContext('2d').clearRect(
      dirtyArea[0],
      dirtyArea[1],
      dirtyArea[2] - dirtyArea[0],
      dirtyArea[3] - dirtyArea[1]
    );
  }

  calculateShapeArea(curShapeArea, x1, y1, x2, y2, equalRatio, drawFromCenter) {
    if (drawFromCenter) {
      var w = Math.abs(x2 - x1);
      var h = (equalRatio ? Math.abs(x2 - x1) : Math.abs(y2 - y1));

      return [
        x1 - w,
        y1 - h,
        x1 + w,
        y1 + h
      ];
    }

    if (equalRatio) {
      if (y2 >= y1) {
        y2 = y1 + Math.abs(x2 - x1);
      } else {
        y2 = y1 - Math.abs(x2 - x1);
      }
    }
    return [
      (x1 < x2 ? x1 : x2),
      (y1 < y2 ? y1 : y2),
      (x1 < x2 ? x2 : x1),
      (y1 < y2 ? y2 : y1)
    ];
  }
}
