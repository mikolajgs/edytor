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

    this.id = "colour_" + type + "_" + name;
    this.className = "edytor_toggle_off edytor_sidebar_toggle edytor_colour";
    this.style.backgroundColor = this.name;
    this.innerHTML = '&nbsp;';

    this.addEventListener('click', function () {
      document.getElementById('edytor').__selectColour(type, name);
    });

    document.getElementById('edytor').__initColour(type, name);
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

window.customElements.define('edytor-colour', EdytorColour);
