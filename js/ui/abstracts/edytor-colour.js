class EdytorColour extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    var type = "fg";
    if (this.getAttribute("type") == "bg") {
      type = "bg";
    }
    var name = this.getAttribute("name");
    var val = this.getAttribute("value");

    this.id = "colour_" + type + "_" + name;
    this.className = "edytor_toggle_off edytor_sidebar_toggle edytor_colour";
    this.style.backgroundColor = val;
    this.innerHTML = '&nbsp;';

    this.addEventListener('click', function () {
      document.getElementById('colour_picker_' + type).value = val;
      document.getElementById('edytor').selectColour(type, val);
    });

    document.getElementById('edytor').initColour(type, name);
  }

  toggleOn() {
    this.classList.remove('edytor_toggle_off');
    this.classList.add('edytor_toggle_on');
  }

  toggleOff() {
    this.classList.remove('edytor_toggle_on');
    this.classList.add('edytor_toggle_off');
  }
}

window.customElements.define('edytor-colour', EdytorColour);
