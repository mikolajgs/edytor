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
        }
        return false;
    }

    constructor() {
        this.#cfg = new Config();
        var scope = this;

        if (document.getElementById(this.#cfg.GetID("container")) == null) {
            alert("div with id='"+this.#cfg.GetID('container')+"' not found");
            return;
        }
        this.#layout = new Layout(function(n) {
            return scope.#cfg.GetID(n);
        }, function(cmd, arg1) { 
            return scope.Do(cmd, arg1);
        });
        this.#layout.InitBody();
        this.#layout.InitContainer();
        this.#layout.InitLayerContainer();

        this.#grid = new Grid(this.#cfg.GetID('layerContainer'), this.#cfg.GetID('grid'));
        this.#grid.Init(this.#cfg.GetZIndex('grid'));

        this.#pad = new Pad(this.#cfg.GetID('layerContainer'), this.#cfg.GetID('pad'));
        
        this.#pad.Init(this.#cfg.GetZIndex('pad'), function() {
            return scope.#tools[scope.#tool];
        });

        var toolNames = this.#initTools();
        this.#layout.InitSidebars(this.#cfg.GetZIndex('sidebarLeft'), this.#cfg.GetZIndex('sidebarRight'), function(n) {
            return scope.#tools[n].GetIcon();
        }, toolNames, this.#cfg.GetColors());

        this.AddVectorLayer();
        this.AddPixelLayer();
        this.AddPixelLayer();
        this.AddPixelLayer();
        this.AddPixelLayer();
        this.AddPixelLayer();
        this.AddVectorLayer();
        this.AddVectorLayer();
    }

    #getZIndexForNewLayer() {
        var zIndex = this.#cfg.GetZIndex('layerStart');
        if (this.#layersOrder.length>0) {
            var num = this.#layersOrder[this.#layersOrder.length-1];
            zIndex = this.#layers[num].GetZIndex()+10;
        }
        return zIndex
    }

    AddVectorLayer() {
        this.#lastLayerNum++;
        var l = new VectorLayer(this.#cfg.GetID('layerContainer'), this.#cfg.GetID('vector'));
        l.SetZIndex(this.#getZIndexForNewLayer());
        l.Init(this.#lastLayerNum);
        this.#layersOrder.push(this.#lastLayerNum);
        this.#layers[this.#lastLayerNum] = l;
        this.#layout.AddVectorLayer(this.#lastLayerNum);
    }
    AddPixelLayer() {
        this.#lastLayerNum++;
        var l = new PixelLayer(this.#cfg.GetID('layerContainer'), this.#cfg.GetID('pixel'));
        l.SetZIndex(this.#getZIndexForNewLayer());
        l.Init(this.#lastLayerNum);
        this.#layersOrder.push(this.#lastLayerNum);
        this.#layers[this.#lastLayerNum] = l;
        this.#layout.AddPixelLayer(this.#lastLayerNum);
    }

    DeleteLayers(numList) { 
        // TODO: Refactor me
        var newLayers = [];
        for (var j=0; j<numList.length; j++) {
            if (this.#layers[numList[j]] !== null) {
                this.#layers[numList[j]].Delete();
                delete this.#layers[numList[j]];
                var newLayersOrder = [];
                for (var i=0; i<this.#layersOrder; i++) {
                    if (this.#layersOrder[i] != numList[j]) {
                        newLayersOrder.push(this.#layersOrder[i]);
                    }
                }
                this.#layersOrder = newLayersOrder;
            }
        }
        this.#layout.DeleteLayer(numList);
    }
    ToggleLayersHide(nums) { alert('toggle layers hide'); }
    ToggleLayersLock(nums) { alert('toggle layers lock'); }
    MoveLayerDown(num) { alert('move layer down'); }
    MoveLayerUp(num) { alert('move layer up'); }

    GetStyle(s) {
        switch(s) {
            case 'color-fg': return this.#colorFg;
            case 'color-bg': return this.#colorBg;
            case 'stroke-opacity': return document.getElementById('stroke_opacity').value;
            case 'stroke-width': return document.getElementById('stroke_width').value;
            case 'stroke-linecap': return document.getElementById('stroke_linecap').value;
            case 'stroke-linejoin': return document.getElementById('stroke_linejoin').value;
            case 'stroke-dasharray': return document.getElementById('stroke_dasharray').value;
            case 'fill-opacity': return document.getElementById('fill_opacity').value;
            case 'fill-rule': return document.getElementById('fill_rule').value;
        }
    }

    SetTool(name) {
        this.#tool = name;
        if (this.#tools[name].RequiresPad()) {
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

    #initTools() {
        var scope = this;
        this.#tools = {
            'rectangle': new RectangleTool(this.#pad.GetCanvas(), function(s) {
                return scope.GetStyle(s);
            }, function() {
                return scope.#layers[0].GetSVG();
            }, function() {
                return scope.#layers[1].GetCanvas();
            }),
            'pencil': new PencilTool(this.#pad.GetCanvas(), function(s) {
                return scope.GetStyle(s);
            }, function() {
                return scope.#layers[0].GetSVG();
            }, function() {
                return scope.#layers[1].GetCanvas();
            }),
            'polygon': new PolygonTool(this.#pad.GetCanvas(), function(s) {
                return scope.GetStyle(s);
            }, function() {
                return scope.#layers[0].GetSVG();
            }, function() {
                return scope.#layers[1].GetCanvas();
            })
        }
        return ['rectangle', 'pencil', 'polygon'];
    }
}

var EdytorInstance = null;

function Init() {
    EdytorInstance = new Edytor();
}

document.addEventListener("DOMContentLoaded", Init, false);