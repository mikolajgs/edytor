class Edytor {
    #cfg = null;
    #layout = null;
    #grid = null;
    #pad = null;

    #tools = {}
    #tool = "";
    #colorFg = "#ffffff";
    #colorBg = "#000000";

    #mouseDown = false;

    #layersOrder = [];
    #layers = {};
    #layer = null;
    #layerNum = 0;
    #lastLayerNum = 0;

    Do(cmd, arg1) {
        switch (cmd) {
            case 'add-vector-layer': return this.AddVectorLayer();
            case 'add-pixel-layer': return this.AddPixelLayer();
            case 'delete-layers': return this.DeleteLayers(arg1);
            case 'toggle-layers-lock': return this.ToggleLayersLock(arg1);
            case 'toggle-layers-hide': return this.ToggleLayersHide(arg1);
            case 'move-layer-up': return this.MoveLayerUp(arg1);
            case 'move-layer-down': return this.MoveLayerDown(arg1);
            case 'set-tool': return this.SetTool(arg1);
            case 'set-fg-color': return this.SetFgColor(arg1);
            case 'set-bg-color': return this.SetBgColor(arg1);
            case 'select-layer': return this.SelectLayer(arg1);
            case 'deselect-layer': return this.DeselectLayer();
        }
        return false;
    }


    AddVectorLayer() {
        this.#lastLayerNum++;
        var l = new VectorLayer(this.#cfg.GetID('layerContainer'), this.#cfg.GetID('vectorPrefix') + this.#lastLayerNum);
        l.SetZIndex(this.#getZIndexForNewLayer());
        l.Init(this.#lastLayerNum);
        this.#layersOrder.push(this.#lastLayerNum);
        this.#layers[this.#lastLayerNum] = l;

        this.#layout.AddVectorLayer(this.#lastLayerNum);
    }
    AddPixelLayer() {
        this.#lastLayerNum++;
        var l = new PixelLayer(this.#cfg.GetID('layerContainer'), this.#cfg.GetID('pixelPrefix') + this.#lastLayerNum);
        l.SetZIndex(this.#getZIndexForNewLayer());
        l.Init(this.#lastLayerNum);
        this.#layersOrder.push(this.#lastLayerNum);
        this.#layers[this.#lastLayerNum] = l;

        this.#layout.AddPixelLayer(this.#lastLayerNum);
    }

    DeleteLayers(numList) {
        for (var j = 0; j < numList.length; j++) {
            if (this.#layers[numList[j]] !== null) {
                this.#layers[numList[j]].Delete();
                delete this.#layers[numList[j]];
            }
        }
        // TODO: Refactor me
        var newLayersOrder = [];
        for (var i = 0; i < this.#layersOrder.length; i++) {
            var f = false;
            for (var j = 0; j < numList.length; j++) {
                if (this.#layersOrder[i] == numList[j]) {
                    f = true;
                }
            }
            if (!f) {
                newLayersOrder.push(this.#layersOrder[i]);
            }
        }
        this.#layersOrder = newLayersOrder;
        this.#layout.DeleteLayers(numList);
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


    #alertMissingElement(s) {
        if (document.getElementById(s) == null) {
            alert("HTML element with id='" + s + "' not found");
            return;
        }
    }

    constructor() {
        this.#cfg = new Config();
        var scope = this;

        this.#alertMissingElement(this.#cfg.GetID("container"));

        this.#layout = new Layout(
            function (n) {
                return scope.#cfg.GetID(n);
            },
            function (cmd, arg1) {
                return scope.Do(cmd, arg1);
            }
        );
        this.#layout.Init();

        this.#grid = new Grid(this.#cfg.GetID('layerContainer'), this.#cfg.GetID('grid'));
        this.#grid.Init(this.#cfg.GetZIndex('grid'));

        this.#pad = new Pad(this.#cfg.GetID('layerContainer'), this.#cfg.GetID('pad'));
        this.#pad.Init(this.#cfg.GetZIndex('pad'), function () {
            return scope.#tools[scope.#tool];
        });

        var toolNames = this.#initTools();
        this.#layout.InitSidebars(this.#cfg.GetZIndex('sidebarLeft'), this.#cfg.GetZIndex('sidebarRight'), function (n) {
            return scope.#tools[n].Icon;
        }, toolNames, this.#cfg.GetColors());
    }

    #getZIndexForNewLayer() {
        var zIndex = this.#cfg.GetZIndex('layerStart');
        if (this.#layersOrder.length > 0) {
            var num = this.#layersOrder[this.#layersOrder.length - 1];
            zIndex = this.#layers[num].GetZIndex() + 10;
        }
        return zIndex
    }

    #initTools() {
        var scope = this;
        var fnGetStyle = function (s) {
            return scope.GetStyle(s);
        }
        var fnGetCurrentLayerSVG = function () {
            if (scope.#layer === null)
                return null;
            return scope.#layer.GetSVG();
        }
        var fnGetCurrentLayerCanvas = function () {
            if (scope.#layer === null)
                return null;
            return scope.#layer.GetCanvas();
        }
        this.#tools = {
            'rectangle': new RectangleTool(this.#pad.GetCanvas(), fnGetStyle, fnGetCurrentLayerSVG),
            'pencil': new PencilTool(this.#pad.GetCanvas(), fnGetStyle, fnGetCurrentLayerCanvas),
            'polygon': new PolygonTool(this.#pad.GetCanvas(), fnGetStyle, fnGetCurrentLayerSVG)
        }
        return ['rectangle', 'pencil', 'polygon'];
    }


    ToggleLayersHide(nums) { alert('toggle layers hide'); }
    ToggleLayersLock(nums) { alert('toggle layers lock'); }

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
}

var EdytorInstance = null;

function Init() {
    EdytorInstance = new Edytor();
}

document.addEventListener("DOMContentLoaded", Init, false);