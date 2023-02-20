class EdytorProperties extends HTMLElement {
  constructor() {
    super();
  }

  _addProperty(type, label, name, defval, vals) {
    var d = document.createElement('div');
    d.className = "edytor_property";
    var l = document.createElement('label');
    l.textContent = label + ":";
    var i = null;
    if (vals == null) {
      i = document.createElement('input');
      if (defval === false || defval === true) {
        i.type = "checkbox";
        if (defval === true) {
          i.checked = true;
        }
      } else {
        i.type = "text";
        i.value = defval;
      }
      i.id = type + "_" + name;
    } else {
      i = document.createElement('select');
      i.id = type + "_" + name;
      for (const key in vals) {
        var o = document.createElement('option');
        o.value = key;
        o.innerHTML = vals[key];
        i.appendChild(o);
      }
    }
    d.appendChild(l);
    d.appendChild(i);
    this.appendChild(d);
  }
}

window.customElements.define("edytor-properties", EdytorProperties);
