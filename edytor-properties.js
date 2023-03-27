class EdytorProperties extends HTMLElement {
  constructor() {
    super();
  }

  _addProperty(type, label, name, defval, vals, onchange, hiddenOnStart) {
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
        if (onchange != undefined && onchange !== null) {
          if (onchange[o.value] !== undefined && onchange[o.value] !== null) {
            o.setAttribute("show-parents-of-ids", onchange[o.value].map(x => type + "_" + x).join(","));
          }
          if (onchange["_"] !== undefined && onchange["_"] !== null) {
            o.setAttribute("hide-parents-of-ids", onchange["_"].map(x => type + "_" + x).join(","));
          }
        }
      }
      i.onchange = function () {
        var toHide = this.options[this.selectedIndex].getAttribute("hide-parents-of-ids");
        if (toHide !== null && toHide != "") {
          toHide.split(',').forEach(x => { document.getElementById(x).parentElement.style.display = 'none'; });
        }
        var toShow = this.options[this.selectedIndex].getAttribute("show-parents-of-ids");
        if (toShow !== null && toShow != "") {
          toShow.split(',').forEach(x => { document.getElementById(x).parentElement.style.display = 'inline'; });
        }
      }
    }
    d.appendChild(l);
    d.appendChild(i);
    if (hiddenOnStart) {
      d.style.display = 'none';
    }
    this.appendChild(d);
  }

  _addButton(type, label, fn) {
    var b = document.createElement('button');
    b.className = 'edytor_property';
    b.innerHTML = label;
    b.addEventListener("click", fn);
    this.appendChild(b);
  }
}

window.customElements.define("edytor-properties", EdytorProperties);
