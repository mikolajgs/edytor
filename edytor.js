class Edytor extends HTMLElement {
    // do we need those?
    #cfg = null;
    #layout = null

    // Tools
    #toolNames = [];
    #tool = "";

    // Colours
    #colourFgNames = [];
    #colourBgNames = [];
    #colourFg = "white";
    #colourBg = "black";

    // Layers
    #lastLayerNum = 0;

    constructor() {
        super();
        // do we need config since we started hardcoding ids and zindexes in the classes?
        this.#cfg = new EdytorConfig();
        var scope = this;
        // do we need layout at all?
        this.#layout = new EdytorLayout(
            function (n) {
                return scope.#cfg.GetID(n);
            },
            function (cmd, arg1) {
                return scope.Do(cmd, arg1);
            }
        );
    }

    #el_tool(n) {
        return document.getElementById('tool_' + n);
    }

    #el_pad_layer() {
        return document.getElementById('pad_layer');
    }

    #el_colour_bg(n) {
        return document.getElementById('colour_bg_' + n);
    }

    #el_colour_fg(n) {
        return document.getElementById('colour_fg_' + n);
    }

    #el_layer_container() {
        return document.getElementById('layer_container');
    }

    #el_layer_list() {
        return document.getElementById('layer_list');
    }

    __initTool(s) {
        this.#toolNames.push(s);
    }

    __initColour(t, n) {
        if (t == "bg") {
            this.#colourBgNames.push(n);
        } else {
            this.#colourFgNames.push(n);
        }
    }

    __getCurrentTool() {
        return this.#el_tool(this.#tool);
    }

    __getCurrentLayer() {
        if (this.#layer === null)
            return null;
        return this.#layer;
    }

    __getStyle(s) {
        // TODO: Taken the styles from the stroke and fill objects
    }

    __getPadCanvas() {
        return this.#el_pad_layer().getCanvas();
    }

    __centerScroll() {
        window.scrollTo(window.innerWidth / 2, window.innerHeight / 2);
    }

    __setCurrentTool(s) {
        this.#tool = s;
        for (var i = 0; i < this.#toolNames.length; i++) {
            if (this.#toolNames[i] != s) {
                this.#el_tool(this.#toolNames[i]).__toggleOff();
            } else {
                this.#el_tool(this.#toolNames[i]).__toggleOn();
            }
        }
    }

    __setCurrentColour(type, s) {
        if (type == "bg") {
            this.#colourBg = s;
            for (var i = 0; i < this.#colourBgNames.length; i++) {
                if (this.#colourBgNames[i] != s) {
                    this.#el_colour_bg(this.#colourBgNames[i]).__toggleOff();
                } else {
                    this.#el_colour_bg(this.#colourBgNames[i]).__toggleOn();
                }
            }
        } else {
            this.#colourFg = s;
            for (var i = 0; i < this.#colourFgNames.length; i++) {
                if (this.#colourFgNames[i] != s) {
                    this.#el_colour_fg(this.#colourFgNames[i]).__toggleOff();
                } else {
                    this.#el_colour_fg(this.#colourFgNames[i]).__toggleOn();
                }
            }
        }
    }

    __addVectorLayer() {
        this.#lastLayerNum++;
        this.#el_layer_container().__addVectorLayer(this.#lastLayerNum);
        this.#el_layer_list().__addVectorLayer(this.#lastLayerNum);
    }

    __addPixelLayer() {
        this.#lastLayerNum++;
        this.#el_layer_container().__addPixelLayer(this.#lastLayerNum);
        this.#el_layer_list().__addPixelLayer(this.#lastLayerNum);
    }

    __toggleLayerHidden(num) {
        this.#el_layer_list().__setLayerHidden(num, this.#el_layer_container().__toggleLayerHidden(num));
    }

    __toggleLayerLocked(num) {
        this.#el_layer_list().__setLayerLocked(num, this.#el_layer_container().__toggleLayerLocked(num));
    }

    __deleteLayer(num) {
        this.#el_layer_container().__deleteLayer(num);
        this.#el_layer_list().__deleteLayer(num);
    }

    __moveLayerUp(num) {
        this.#el_layer_container().__swapLayers(num, this.#el_layer_list().__moveLayerUp(num));
    }

    __moveLayerDown(num) {
        this.#el_layer_container().__swapLayers(num, this.#el_layer_list().__moveLayerDown(num));
    }

    __toggleLayersLocked(numList) {
        if (numList.length > 0) {
            var l = this.#el_layer_container().__getLayerLocked(numList[0]);
            for (var i = 0; i < numList.length; i++) {
                this.#el_layer_container().__setLayerLocked(numList[i], !l);
                this.#el_layer_list().__setLayerLocked(numList[i], !l);
            }
        }
    }

    __toggleLayersHidden(numList) {
        if (numList.length > 0) {
            var h = this.#el_layer_container().__getLayerHidden(numList[0]);
            for (var i = 0; i < numList.length; i++) {
                this.#el_layer_container().__setLayerHidden(numList[i], !h);
                this.#el_layer_list().__setLayerHidden(numList[i], !h);
            }
        }
    }

    __deleteLayers(numList) {
        for (var i = 0; i < numList.length; i++) {
            this.__deleteLayer(numList[i]);
        }
    }

    connectedCallback() {
        this.id = 'edytor';
        this.style.margin = 0;
        this.style.padding = 0;
        this.style.position = "relative";
    }




    #pad = null;

    #tools = {}

    // TODO: Remove below
    #colorFg = "dupa";
    #colorBg = "dupa";

    #mouseDown = false;

    #layersOrder = [];
    #layers = {};
    #layer = null;
    #layerNum = 0;

    Do(cmd, arg1) {
        switch (cmd) {
            case 'add-vector-layer': return this.AddVectorLayer();
            case 'add-pixel-layer': return this.AddPixelLayer();
            case 'delete-layers': return this.DeleteLayers(arg1);
            case 'select-layer': return this.SelectLayer(arg1);
            case 'deselect-layer': return this.DeleteLayers();
            case 'move-layer-up': return this.MoveLayerUp(arg1);
            case 'move-layer-down': return this.MoveLayerDown(arg1);
            case 'toggle-layers-lock': return this.ToggleLayersLock(arg1);
            case 'toggle-layers-hide': return this.ToggleLayersHide(arg1);
            case 'set-tool': return this.SetTool(arg1);
            case 'set-fg-color': return this.SetFgColor(arg1);
            case 'set-bg-color': return this.SetBgColor(arg1);
            case 'get-style': return this.GetStyle(arg1);
        }
        return false;
    }

    SelectLayer(num) {
        if (this.#layers[num] !== null) {
            this.#layer = this.#layers[num];
            this.#layerNum = num;
            this.#layout.SelectLayer(num);
        }
    }

    DeselectLayer() {
        this.#layer = null;
        this.#layerNum = 0;
        this.#layout.SelectLayer(-1);
    }

    MoveLayerDown(num) {
        for (var i = 0; i < this.#layersOrder.length; i++) {
            if (this.#layersOrder[i] == num) {
                if (i == 0)
                    return;
                var curZIndex = this.#layers[this.#layersOrder[i]].GetZIndex();
                this.#layers[this.#layersOrder[i]].SetZIndex(this.#layers[this.#layersOrder[i - 1]].GetZIndex());
                this.#layers[this.#layersOrder[i - 1]].SetZIndex(curZIndex);
                this.#layersOrder[i] = this.#layersOrder[i - 1];
                this.#layersOrder[i - 1] = num;
                this.#layout.MoveLayerDown(num);
                return;
            }
        }
    }

    MoveLayerUp(num) {
        for (var i = 0; i < this.#layersOrder.length; i++) {
            if (this.#layersOrder[i] == num) {
                if (i == this.#layersOrder.length - 1)
                    return;
                var curZIndex = this.#layers[this.#layersOrder[i]].GetZIndex();
                this.#layers[this.#layersOrder[i]].SetZIndex(this.#layers[this.#layersOrder[i + 1]].GetZIndex());
                this.#layers[this.#layersOrder[i + 1]].SetZIndex(curZIndex);
                this.#layersOrder[i] = this.#layersOrder[i + 1];
                this.#layersOrder[i + 1] = num;
                this.#layout.MoveLayerUp(num);
                return;
            }
        }
    }

    SetTool(name) {
        this.#tool = name;
        if (this.#tools[name].RequiresPad) {
            this.#pad.Show();
        } else {
            this.#pad.Hide();
        }
    }

    SetFgColor(name) {
        this.#colorFg = name;
    }

    SetBgColor(name) {
        this.#colorBg = name;
    }

    GetStyle(s) {
        switch (s) {
            case 'color-fg': return this.#colorFg;
            case 'color-bg': return this.#colorBg;
            case 'stroke-opacity': return document.getElementById(this.#cfg.GetID("styleStrokeOpacity")).value;
            case 'stroke-width': return document.getElementById(this.#cfg.GetID("styleStrokeWidth")).value;
            case 'stroke-linecap': return document.getElementById(this.#cfg.GetID("styleStrokeLinecap")).value;
            case 'stroke-linejoin': return document.getElementById(this.#cfg.GetID("styleStrokeLinejoin")).value;
            case 'stroke-dasharray': return document.getElementById(this.#cfg.GetID("styleStrokeDasharray")).value;
            case 'fill-opacity': return document.getElementById(this.#cfg.GetID("styleFillOpacity")).value;
            case 'fill-rule': return document.getElementById(this.#cfg.GetID("styleFillRule")).value;
        }
    }


}

window.customElements.define("edytor-ui", Edytor);

// have a look on how the tools are designed - can we make them through command in the future?


// at the bottom add an input window and log window (for now they can be visible)
// where you could just type in commands, same way it would be done with Do
// + abstract the commands into separate classes somehow so they can have arguments definion, and logic

// how can we do the same for tools?
