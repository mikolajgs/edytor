class EdytorTool extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this._init('tool', 'lbl');
  }

  _init(n, l) {
    this.id = "tool_" + n;
    this.setAttribute("edytor-tool-name", n);
    this.className = "edytor_toggle_off edytor_sidebar_toggle edytor_tool";
    this.textContent = l;

    this.addEventListener('click', function () {
      document.getElementById('edytor').__selectTool(n);
    });

    document.getElementById('edytor').__initTool(n);

    var d = document.createElement('edytor-properties');
    d.id = "tool_config_" + n;
    d.style.display = 'none';
    document.getElementById("tool_config").appendChild(d);
  }

  _addProperty(type, label, name, defval, vals) {
    document.getElementById("tool_config_" + this.getAttribute("edytor-tool-name"))._addProperty(type, label, name, defval, vals);
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
