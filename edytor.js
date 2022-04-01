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

    constructor() {
        this.#cfg = new Config();
        var scope = this;

        if (document.getElementById(this.#cfg.GetID("container")) == null) {
            alert("div with id='"+this.#cfg.GetID('container')+"' not found");
            return;
        }
        this.#layout = new Layout(function(n) {
            return scope.#cfg.GetID(n);
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

        this.AddVectorLayer(this.#cfg.GetZIndex('layerStart'));
        this.AddPixelLayer(this.#cfg.GetZIndex('layerStart')+10);

        var toolNames = this.#initTools();
        this.#layout.InitSidebars(this.#cfg.GetZIndex('sidebarLeft'), this.#cfg.GetZIndex('sidebarRight'), function(n) {
            return scope.#tools[n].GetIcon();
        }, function(n) {
            scope.SetTool(n);
        }, toolNames, this.#cfg.GetColors(), function(t, c) {
            scope.SetColor(t, c);
        });
    }

    AddVectorLayer(zIndex) {
        var l = new VectorLayer(this.#cfg.GetID('layerContainer'), this.#cfg.GetID('vector'));
        l.SetZIndex(zIndex);
        l.Init();
        this.#layers.push(l);
    }
    AddPixelLayer(zIndex) {
        var l = new PixelLayer(this.#cfg.GetID('layerContainer'), this.#cfg.GetID('pixel'));
        l.SetZIndex(zIndex);
        l.Init();
        this.#layers.push(l);
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