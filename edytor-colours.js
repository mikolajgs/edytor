class EdytorColours extends HTMLElement {
  #colours = {
    "white": "#ffffff",
    "black": "#000000",
    "silver": "#c0c0c0",
    "gray": "#808080",
    "maroon": "#800000",
    "red": "#ff0000",
    "purple": "#800080",
    "fuchsia": "#ff00ff",
    "green": "#008000",
    "lime": "#00ff00",
    "olive": "#808000",
    "yellow": "#ffff00",
    "navy": "#000080",
    "blue": "#0000ff",
    "teal": "#008080",
    "aqua": "#00ffff"
  }

  constructor() {
    super();
  }

  connectedCallback() {
    var type = "fg";
    if (this.getAttribute("type") == "bg") {
      type = "bg";
    }
    this.id = "colours_" + type;

    var i = 0;
    var firstColor = "";
    for (const key in this.#colours) {
      if (i == 0) {
        firstColor = this.#colours[key];
      }
      var colour = document.createElement('edytor-colour');
      colour.setAttribute('type', type);
      colour.setAttribute('name', key);
      colour.setAttribute('value', this.#colours[key]);
      colour.style.backgroundColor = this.#colours[key];
      this.appendChild(colour);
      i++;
    }

    document.getElementById('colour_picker_' + type).value = firstColor;
    document.getElementById('edytor').__selectColour(type, firstColor);
  }
}

window.customElements.define('edytor-colours', EdytorColours);
