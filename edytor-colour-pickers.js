class EdytorColourPickers extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    [
      { name: 'fg', defaultColor: '#ffffff' },
      { name: 'bg', defaultColor: '#ff0000' }
    ].forEach(t => {
      var i = document.createElement('input');
      i.type = "color";
      i.id = "colour_picker_" + t.name;
      i.value = t.defaultColor;
      i.addEventListener('input', (e) => {
        document.getElementById('edytor').__selectColour(t.name, e.target.value);
      });
      i.addEventListener('change', (e) => {
        document.getElementById('edytor').__selectColour(t.name, e.target.value);
      });
      this.appendChild(i);

      document.getElementById('edytor').__selectColour(t.name, i.value);
    });
  }
}

window.customElements.define('edytor-colour-pickers', EdytorColourPickers);
