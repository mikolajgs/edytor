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

    #layers = [];
    #layer = null;
    #lastLayerNum = 0;

    constructor() {
        this.#cfg = new Config();
        var scope = this;

        if (document.getElementById(this.#cfg.GetID("container")) == null) {
            alert("div with id='"+this.#cfg.GetID('container')+"' not found");
            return;
        }
        this.#layout = new Layout(function(n) {
            return scope.#cfg.GetID(n);
        }, function() {
            return scope.AddVectorLayer();
        }, function() {
            return scope.AddPixelLayer();
        }, function(nums) {
            return scope.DeleteLayers(nums);
        }, function(nums) {
            alert('toggle layers lock');
        }, function(nums) {
            alert('toggle layers hide');
        }, function(nums) {
            alert('move layer up');
        }, function(nums) {
            alert('move layer down');
        }
        );
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
        }, function(n) {
            scope.SetTool(n);
        }, toolNames, this.#cfg.GetColors(), function(t, c) {
            scope.SetColor(t, c);
        });

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
        if (this.#layers.length>0) {
            zIndex = this.#layers[this.#layers.length-1].GetZIndex()+10;
        }
        return zIndex
    }

    AddVectorLayer() {
        this.#lastLayerNum++;
        var l = new VectorLayer(this.#cfg.GetID('layerContainer'), this.#cfg.GetID('vector'));
        l.SetZIndex(this.#getZIndexForNewLayer());
        l.Init();
        this.#layers.push(l);
        this.#layout.AddVectorLayer(this.#lastLayerNum);
    }
    AddPixelLayer() {
        this.#lastLayerNum++;
        var l = new PixelLayer(this.#cfg.GetID('layerContainer'), this.#cfg.GetID('pixel'));
        l.SetZIndex(this.#getZIndexForNewLayer());
        l.Init();
        this.#layers.push(l);
        this.#layout.AddPixelLayer(this.#lastLayerNum);
    }

    DeleteLayers(nums) {

    }

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

    SetColor(fgbg, name) {
        if (fgbg == "fg") {
            this.#colorFg = name;
        } else {
            this.#colorBg = name;
        }
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