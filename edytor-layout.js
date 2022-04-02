class Layout {
    #ref = {
        container: null,
        layerContainer: null,
        sidebarLeft: null,
        sidebarRight: null,
        toolContainer: null,
        colorFgContainer: null,
        colorBgContainer: null,
        strokeContainer: null,
        fillContainer: null,
        propertyContainer: null,
        layerListContainer: null,
        layerToolsContainer: null
    }

    #getToolIconFn = null;
    #setToolFn = null;
    #setColorFn = null;
    #getIDFn = null;
    #addVectorLayerFn = null;
    #addPixelLayerFn = null;
    #deleteLayersFn = null;
    #moveLayerUpFn = null;
    #moveLayerDownFn = null;
    #toggleLayersLockFn = null;
    #toggleLayersHideFn = null;
    #tools = [];
    #colors = {};

    InitBody() {
        // Just in case
        document.body.style.margin = 0;
        document.body.style.padding = 0;
    }

    InitContainer() {
        // We don't want this in the CSS
        this.#ref.container.style.margin = 0;
        this.#ref.container.style.padding = 0;
        this.#ref.container.style.position = "relative";
    }

    InitLayerContainer() {
        this.#ref.layerContainer = document.createElement('div');
        this.#ref.layerContainer.id = this.#getIDFn('layerContainer');
        // Again, we don't want the positioning to be in the CSS file
        this.#ref.layerContainer.style.margin = 0;
        this.#ref.layerContainer.style.padding = 0;
        this.#ref.layerContainer.style.position = "absolute";
        this.#ref.layerContainer.style.top = 0;
        this.#ref.layerContainer.style.left = 0;
        this.#ref.container.appendChild(this.#ref.layerContainer);
        var w = window.innerWidth;
        var h = window.innerHeight;
        this.#ref.layerContainer.style.width = (w*2) + 'px';
        this.#ref.layerContainer.style.height = (h*2) + 'px';
    }

    #addSidebarDivToContainer(ref, className, id, zIndex, side) {
        this.#ref[ref] = document.createElement('div');
        this.#ref[ref].className = className;
        this.#ref[ref].id = id;
        this.#ref[ref].style.zIndex = zIndex;
        this.#ref[ref].style.position = "fixed";
        this.#ref[ref].style.top = 0;
        if (side == "right") {
            this.#ref[ref].style.right = 0;
        } else if (side == "left") {
            this.#ref[ref].style.left = 0;
        }
        this.#ref.container.appendChild(this.#ref[ref]);
    }

    #resizeSidebarsToWindow() {
        var h = window.innerHeight;
        this.#ref.sidebarLeft.style.height = h + 'px';
        this.#ref.sidebarRight.style.height = h + 'px';
    }

    #initSidebars(zIndexSidebarLeft, zIndexSidebarRight) {
        this.#addSidebarDivToContainer('sidebarLeft', 'sidebar_left', this.#getIDFn('sidebarLeft'), zIndexSidebarLeft, 'left');
        this.#addSidebarDivToContainer('sidebarRight', 'sidebar_right', this.#getIDFn('sidebarRight'), zIndexSidebarRight, 'right');
        this.#resizeSidebarsToWindow();
    }

    #setScroll() {
        var w = window.innerWidth;
        var h = window.innerHeight;
        window.scrollTo(w/2,h/2);
    }

    #addSidebarTitle(ref, t) {
        var d = document.createElement('div');
        d.className = "sidebar_title";
        d.innerHTML = t;
        this.#ref[ref].appendChild(d);
    }

    #addSidebarContainer(ref, n) {
        this.#ref[n] = document.createElement('div');
        this.#ref[n].className = "sidebar_container";
        this.#ref[n].style.display = "flex";
        this.#ref[n].style.flexFlow = "row wrap";
        this.#ref[n].id = this.#getIDFn(n);
        this.#ref[ref].appendChild(this.#ref[n]);
    }

    #addSidebarToggle(ref, n, id, className, innerHtml, additionalFn, clickFn, addX) {
        var t = document.createElement('div');
        t.className = "toggle_off sidebar_toggle "+className;
        t.innerHTML = innerHtml;
        t.id = id;

        if (additionalFn != null) {
            additionalFn(t);
        }

        var scope = this;
        t.addEventListener('click', function() {
            clickFn(n);

            var tools = scope.#ref[ref].querySelectorAll('.'+className);
            for (var i=0; i<tools.length; i++) {
                tools[i].classList.remove('toggle_on');
                tools[i].classList.add('toggle_off');
                if (addX) {
                    tools[i].innerHTML = '';
                }
            }

            this.classList.remove('toggle_off');
            this.classList.add('toggle_on');
            if (addX) {
                this.innerHTML = 'X';
            }
        });

        this.#ref[ref].appendChild(t);
    }

    #addSidebarLeftTool(ref, n) {
        var scope = this;
        this.#addSidebarToggle(ref, n, 'tool_'+n, 'tool', this.#getToolIconFn(n), null, function(nm) {
            scope.#setToolFn(nm);
        }, false);
    }

    #addSidebarLeftColor(ref, fgbg, n) {
        var scope = this;
        this.#addSidebarToggle(ref, n, 'color_'+fgbg+'_'+n, 'color', '', function(o) {
            o.style.background = scope.#colors[n];
        }, function(nm) {
            scope.#setColorFn(fgbg, nm);
        }, true);
    }

    #addSidebarProperty(ref, label, id, className, defval, vals) {
        var d = document.createElement('div');
        d.className = "sidebar_property "+className;
        var l = document.createElement('label');
        l.innerHTML = label;

        var i = null;
        if (vals == null) {
            i = document.createElement('input');
            i.type = "text";
            i.value = defval;
            i.id = id;
        } else {
            i = document.createElement('select');
            i.id = id;
            for (const key in vals) {
                var o = document.createElement('option');
                o.value = key;
                o.innerHTML = vals[key];
                i.appendChild(o);
            }
        }
        d.appendChild(l);
        d.appendChild(i);
        this.#ref[ref].appendChild(d);
    }

    #initTools() {
        this.#addSidebarTitle('sidebarLeft',"Tools");
        this.#addSidebarContainer('sidebarLeft', 'toolContainer');
        for (var i=0; i<this.#tools.length; i++) {
            this.#addSidebarLeftTool('toolContainer', this.#tools[i]);
        }
    }

    #initColors() {
        this.#addSidebarTitle('sidebarLeft',"Fg Color");
        this.#addSidebarContainer('sidebarLeft', 'colorFgContainer');
        var i = 0;
        var firstColor = "";
        for (const key in this.#colors) {
            if (i == 0) {
                firstColor = key;
            }
            this.#addSidebarLeftColor('colorFgContainer', "fg", key);
            i++;
        }

        this.#addSidebarTitle('sidebarLeft',"Bg Color");
        this.#addSidebarContainer('sidebarLeft', 'colorBgContainer');
        for (const key in this.#colors) {
            this.#addSidebarLeftColor('colorBgContainer', "bg", key);
        }

        this.#setColorFn("fg", firstColor);
        this.#setColorFn("bg", firstColor);
    }

    #initStroke() {
        this.#addSidebarTitle('sidebarLeft',"Stroke");
        this.#addSidebarContainer('sidebarLeft', 'strokeContainer');
        this.#addSidebarProperty('sidebarLeft', "Width", "stroke_width", "", "3");
        this.#addSidebarProperty('sidebarLeft', "Opacity", "stroke_opacity", "", "100%");
        this.#addSidebarProperty('sidebarLeft', "Linecap", "stroke_linecap", "", "", {"butt": "butt", "square": "square", "round": "round"});
        this.#addSidebarProperty('sidebarLeft', "Linejoin", "stroke_linejoin", "", "", {"miter": "miter", "round": "round", "bevel": "bevel"});
        this.#addSidebarProperty('sidebarLeft', "Dasharray", "stroke_dasharray", "", "5");
    }

    #initFill() {
        this.#addSidebarTitle('sidebarLeft',"Fill");
        this.#addSidebarContainer('sidebarLeft', 'fillContainer');
        this.#addSidebarProperty('sidebarLeft', "Opacity", "fill_opacity", "", "100%");
        this.#addSidebarProperty('sidebarLeft', "Rule", "fill_rule", "", "", {"nonzero": "nonzero", "evenodd": "evenodd", "inherit": "inherit"});
    }

    #initProperties() {
        this.#addSidebarTitle('sidebarRight',"Properties");
        this.#addSidebarContainer('sidebarRight', 'propertyContainer');
        for (var i=0; i<10; i++) {
            this.#addSidebarProperty('sidebarRight', "Property "+i, "property_"+i, "property", "");
        }
    }

    #initLayers() {
        this.#addSidebarTitle('sidebarRight', "Layers");
        this.#addSidebarContainer('sidebarRight', 'layerListContainer');
        this.#addSidebarContainer('sidebarRight', 'layerToolsContainer');
        this.#initLayerTools();
    }

    #addLayerToolButton(ref, label, fn) {
        var b = document.createElement('button');
        b.className = 'toggle_off layer_button';
        b.innerHTML = label;
        b.addEventListener('click', fn);
        this.#ref[ref].appendChild(b);
    }

    #initLayerTools() {
        var scope = this;
        this.#addLayerToolButton('layerToolsContainer', '+V', function(e) { scope.#addVectorLayerFn(); });
        this.#addLayerToolButton('layerToolsContainer', '+P', function(e) { scope.#addPixelLayerFn(); });
        this.#addLayerToolButton('layerToolsContainer', 'L', function(e) { });
        this.#addLayerToolButton('layerToolsContainer', 'H', function(e) { });
        this.#addLayerToolButton('layerToolsContainer', 'X', function(e) { });
    }

    constructor(getIDFn, addVectorLayerFn, addPixelLayerFn, deleteLayersFn, toggleLayersLockFn, toggleLayersHideFn, moveLayerUpFn, moveLayerDownFn) {
        this.#getIDFn = getIDFn;
        this.#addVectorLayerFn = addVectorLayerFn;
        this.#addPixelLayerFn = addPixelLayerFn;
        this.#deleteLayersFn = deleteLayersFn;
        this.#toggleLayersLockFn = toggleLayersLockFn;
        this.#toggleLayersHideFn = toggleLayersHideFn;
        this.#moveLayerUpFn = moveLayerUpFn;
        this.#moveLayerDownFn = moveLayerDownFn;

        this.#ref.container = document.getElementById(this.#getIDFn('container'));
        if (this.#ref.container == null) {
            alert("div with id='"+this.#getIDFn('container')+"' not found");
            return;
        }
    }

    InitSidebars(zIndexSidebarLeft, zIndexSidebarRight, getToolIconFn, setToolFn, tools, colors, setColorFn) {
        this.#getToolIconFn = getToolIconFn;
        this.#setToolFn = setToolFn;
        this.#setColorFn = setColorFn;
        this.#tools = tools;
        this.#colors = colors;
        this.#initSidebars(zIndexSidebarLeft, zIndexSidebarRight);
        this.#setScroll();
        this.#initTools();
        this.#initColors();
        this.#initStroke();
        this.#initFill();
        this.#initLayers();
        this.#initProperties();
    }

    AddVectorLayer(num) {
        this.AddLayer('V', num);
    }

    AddPixelLayer(num) {
        this.AddLayer('P', num);
    }

    // functions for the layer tool buttons
    // change everything to one function where you would call command and args

    // delete X button and delete the layer
    // delete layer by id
    // selecting current layer when drawing
    // selecting tool vs a type of layer + add 'v:' or 'p:' prefix for tools?
    // moving up
    // moving down

    AddLayer(t, num) {
        var d = document.createElement('div');
        d.className = "sidebar_layer";
        d.id = this.#getIDFn('layerPrefix')+num;

        var sel = document.createElement('input');
        sel.type = 'checkbox';
        sel.className = 'select_layer';
        sel.id = this.#getIDFn('layerSelect')+num;
        d.appendChild(sel);

        var typ = document.createElement('label');
        typ.className = 'layer_type';
        typ.innerHTML = t;
        d.appendChild(typ);

        var nam = document.createElement('input');
        nam.type = 'text';
        nam.value = 'Layer '+num;
        nam.className = 'layer_name';
        nam.id = this.#getIDFn('layerName')+num;
        d.appendChild(nam);

        var scope = this;
        var btns = [
            { lbl: 'L', id: this.#getIDFn('layerActionLockPrefix')+num, fn: function(e) { 
                var ids = [];
                var idArr = this.id.split('_');
                ids.push(parseInt(idArr[idArr.length-1]));
                scope.#toggleLayersLockFn(ids);
            } },
            { lbl: 'H', id: this.#getIDFn('layerActionHidePrefix')+num, fn: function(e) {
                var ids = [];
                var idArr = this.id.split('_');
                ids.push(parseInt(idArr[idArr.length-1]));
                scope.#toggleLayersHideFn(ids);
            } },
            { lbl: 'U', id: this.#getIDFn('layerActionMoveUpPrefix')+num, fn: function(e) {
                var ids = [];
                var idArr = this.id.split('_');
                ids.push(parseInt(idArr[idArr.length-1]));
                scope.#moveLayerUpFn(ids);
            } },
            { lbl: 'D', id: this.#getIDFn('layerActionMoveDownPrefix')+num, fn: function(e) {
                var ids = [];
                var idArr = this.id.split('_');
                ids.push(parseInt(idArr[idArr.length-1]));
                scope.#moveLayerDownFn(ids);
            } },
            { lbl: 'X', id: this.#getIDFn('layerActionDeletePrefix')+num, fn: function(e) {
                var ids = [];
                var idArr = this.id.split('_');
                ids.push(parseInt(idArr[idArr.length-1]));
                scope.#deleteLayersFn(ids);
            } }
        ];

        for (var i=0; i<btns.length; i++) {
            var b = document.createElement('button');
            b.className = 'toggle_off layer_button';
            b.innerHTML = btns[i].lbl;
            b.id = btns[i].id;
            b.addEventListener('click', btns[i].fn)
            d.appendChild(b);
        }

        this.#ref.layerListContainer.prepend(d);     
    }
}