class EdytorTool extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this._init('tool', 'lbl');
  }

  _init(name, className, alt) {
    this.id = "tool_" + name;
    this.setAttribute("edytor-tool-name", name);
    this.className = "edytor_toggle_off edytor_sidebar_toggle edytor_tool";
    this.innerHTML = '<i class="fa-solid ' + className + '" alt="' + alt + '"></i>';

    this.addEventListener('click', function () {
      document.getElementById("edit_info").SetPosition(0, 0);
      document.getElementById('edytor').__selectTool(name);
    });

    document.getElementById('edytor').__initTool(name);

    var d = document.createElement('edytor-properties');
    d.id = "tool_config_" + name;
    d.style.display = 'none';
    document.getElementById("tool_config").appendChild(d);

    var title = document.createElement('div');
    title.className = "edytor_property edytor_property_title";
    title.innerHTML = alt;
    d.appendChild(title);
  }

  _addProperty(label, name, defval, vals, onchange, hiddenOnStart) {
    document.getElementById("tool_config_" + this.getAttribute("edytor-tool-name"))._addProperty("tool_property_" + this.getAttribute("edytor-tool-name"), label, name, defval, vals, onchange, hiddenOnStart);
  }

  _addButton(label, fn) {
    document.getElementById("tool_config_" + this.getAttribute("edytor-tool-name"))._addButton("tool_property_" + this.getAttribute("edytor-tool-name"), label, fn);
  }

  _getProperty(name) {
    var p = document.getElementById("tool_property_" + this.getAttribute("edytor-tool-name") + "_" + name);
    if (p.tagName.toLowerCase() == "input" && p.getAttribute("type").toLowerCase() == "checkbox") {
      return (p.checked ? "true" : "false");
    }
    return p.value;
  }

  _getLayer(showAlert) {
    var layer = document.getElementById('edytor').__getSelectedLayer();
    if (layer === 0 || layer === null) {
      if (showAlert === true)
        alert('No layer has been selected');
      return null;
    }
    if (document.getElementById('layer_' + layer).tagName.toLowerCase() !== 'canvas') {
      if (showAlert === true)
        alert('No pixel layer has been selected');
      return null;
    }
    if (document.getElementById('layer_' + layer).getAttribute("locked") === "true") {
      if (showAlert === true)
        alert('Layer is locked for editing');
      return null;
    }
    if (document.getElementById('layer_' + layer).style.display === 'none') {
      return null;
    }
    return layer;
  }

  _getLowerValue(candidate, current) {
    if (candidate < 0) {
      return 0;
    }
    if (candidate < current) {
      return candidate;
    }
    return current;
  }

  _getHigherValue(candidate, current, max) {
    if (candidate > max) {
      return max;
    }
    if (candidate > current) {
      return candidate;
    }
    return current;
  }

  _setClearArea(o, x, y, w, h, dx, dy) {
    o['_clearArea'][0] = this._getLowerValue(x - dx, o['_clearArea'][0]);
    o['_clearArea'][1] = this._getLowerValue(y - dy, o['_clearArea'][1]);
    o['_clearArea'][2] = this._getHigherValue(x + dx, o['_clearArea'][2], w);
    o['_clearArea'][3] = this._getHigherValue(y + dy, o['_clearArea'][3], h);
  }

  _setClearAreaFromInputArea(o, w, h, dx, dy) {
    o['_inputArea'][0] = this._getLowerValue(o['_inputArea'][0] - dx, o['_inputArea'][0]);
    o['_inputArea'][1] = this._getLowerValue(o['_inputArea'][1] - dy, o['_inputArea'][1]);
    o['_inputArea'][2] = this._getHigherValue(o['_inputArea'][2] + dx, o['_inputArea'][2], w);
    o['_inputArea'][3] = this._getHigherValue(o['_inputArea'][3] + dy, o['_inputArea'][3], h);
  }

  _resetClearArea(o) {
    o['_clearArea'] = [999999, 999999, 0, 0];
  }

  _resetInputArea(o) {
    o['_inputArea'] = [999999, 999999, 0, 0];
  }

  _setInputArea(o, x1, y1, x2, y2, equalRatio, drawFromCenter) {
    if (drawFromCenter) {
      var w = Math.abs(x2 - x1);
      var h = (equalRatio ? Math.abs(x2 - x1) : Math.abs(y2 - y1));
      o['_inputArea'][0] = x1 - w;
      o['_inputArea'][1] = y1 - h;
      o['_inputArea'][2] = x1 + w;
      o['_inputArea'][3] = y1 + h;
      return;
    }

    if (equalRatio) {
      if (y2 >= y1) {
        y2 = y1 + Math.abs(x2 - x1);
      } else {
        y2 = y1 - Math.abs(x2 - x1);
      }
    }
    o['_inputArea'][0] = (x1 < x2 ? x1 : x2);
    o['_inputArea'][1] = (y1 < y2 ? y1 : y2);
    o['_inputArea'][2] = (x1 < x2 ? x2 : x1);
    o['_inputArea'][3] = (y1 < y2 ? y2 : y1);
  }

  _clearPad(o) {
    if (o !== undefined) {
      document.getElementById('pad_layer').getContext('2d').clearRect(
        o['_clearArea'][0],
        o['_clearArea'][1],
        o['_clearArea'][2] - o['_clearArea'][0],
        o['_clearArea'][3] - o['_clearArea'][1]
      );
      return;
    }
    document.getElementById('pad_layer').getContext('2d').clearRect(
      0, 0,
      document.getElementById('pad_layer').width,
      document.getElementById('pad_layer').height
    );
  }

  __toggleOn() {
    this.classList.remove('edytor_toggle_off');
    this.classList.add('edytor_toggle_on');
    document.getElementById("tool_config_" + this.getAttribute("edytor-tool-name")).style.display = '';
  }

  __toggleOff() {
    this.classList.remove('edytor_toggle_on');
    this.classList.add('edytor_toggle_off');
    document.getElementById("tool_config_" + this.getAttribute("edytor-tool-name")).style.display = 'none';
  }
}
