class EdytorColours extends HTMLElement {
  #colours = {
    "black": "black",
    "silver": "silver",
    "gray": "gray",
    "white": "white",
    "maroon": "maroon",
    "red": "red",
    "purple": "purple",
    "fuchsia": "fuchsia",
    "green": "green",
    "lime": "lime",
    "olive": "olive",
    "yellow": "yellow",
    "navy": "navy",
    "blue": "blue",
    "teal": "teal",
    "aqua": "aqua"
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
        firstColor = key;
      }
      var colour = document.createElement('edytor-colour');
      colour.setAttribute('type', type);
      colour.setAttribute('name', key);
      colour.setAttribute('value', this.#colours[key]);
      colour.style.backgroundColor = this.#colours[key];
      this.appendChild(colour);
      i++;
    }

    document.getElementById('edytor').__setCurrentColour(type, firstColor);
  }
}

window.customElements.define('edytor-colours', EdytorColours);