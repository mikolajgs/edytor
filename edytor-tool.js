class EdytorTool extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this._init('tool', 'lbl');
  }

  _init(n, l) {
    this.id = "tool_" + n;
    this.className = "edytor_toggle_off edytor_sidebar_toggle edytor_tool";
    this.textContent = l;

    this.addEventListener('click', function () {
      document.getElementById('edytor').__selectTool(n);
    });

    document.getElementById('edytor').__initTool(n);
  }

  __toggleOn() {
    this.classList.remove('edytor_toggle_off');
    this.classList.add('edytor_toggle_on');
  }

  __toggleOff() {
    this.classList.remove('edytor_toggle_on');
    this.classList.add('edytor_toggle_off');
  }
}
