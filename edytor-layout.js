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
    #getIDFn = null;
    #doFn = null;
    #tools = [];
    #colors = {};


    AddVectorLayer(num) {
        this.#addLayer('V', num);
    }

    AddPixelLayer(num) {
        this.#addLayer('P', num);
    }

    DeleteLayers(numList) {
        for (var j = 0; j < numList.length; j++) {
            var el = document.getElementById(this.#getIDFn('layerPrefix') + numList[j]);
            if (el !== null) {
                el.remove();
            }
        }
    }

    SelectLayer(num) {
        var els = this.#ref.layerListContainer.querySelectorAll("div.sidebar_layer");
        for (var i = 0; i < els.length; i++) {
            var idArr = els[i].id.split('_');
            if (parseInt(idArr[idArr.length - 1]) == num) {
                els[i].classList.add("sidebar_layer_selected");
            } else {
                els[i].classList.remove("sidebar_layer_selected");
            }
        }
    }


    Init() {
        this.#initBody();
        this.#initContainer();
        this.#initLayerContainer();
    }

    InitSidebars(zIndexSidebarLeft, zIndexSidebarRight, getToolIconFn, tools, colors) {
        this.#getToolIconFn = getToolIconFn;
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


    constructor(getIDFn, doFn) {
        this.#getIDFn = getIDFn;
        this.#doFn = doFn;

        this.#ref.container = document.getElementById(this.#getIDFn('container'));
        if (this.#ref.container == null) {
            alert("div with id='" + this.#getIDFn('container') + "' not found");
            return;
        }
    }


    #_arrOfNumsFromID(s) {
        var ids = [];
        var idArr = s.split('_');
        ids.push(parseInt(idArr[idArr.length - 1]));
        return ids
    }
    #_numFromID(s) {
        var idArr = s.split('_');
        return parseInt(idArr[idArr.length - 1]);
    }
    #_arrOfNumsOfSelectedLayers() {
        var ids = [];
        var els = this.#ref.layerListContainer.querySelectorAll("div.sidebar_layer > input.select_layer");
        for (var i = 0; i < els.length; i++) {
            if (els[i].checked) {
                var idArr = els[i].id.split('_');
                ids.push(parseInt(idArr[idArr.length - 1]));
            }
        }
        return ids;
    }

    #addLayer(t, num) {
        var d = document.createElement('div');
        d.className = "sidebar_layer";
        d.id = this.#getIDFn('layerPrefix') + num;
        var h = '<input type="checkbox" class="select_layer" id="' + this.#getIDFn('layerSelectPrefix') + num + '"/>' +
            '<label class="layer_type" id="' + this.#getIDFn('layerTypePrefix') + num + '">' + t + '</label>' +
            '<input type="text" value="Layer ' + num + '" class="layer_name" id="' + this.#getIDFn('layerNamePrefix') + num + '"/>' +
            '<button class="toggle_off layer_button" id="' + this.#getIDFn('layerActionLockPrefix') + num + '">L</button>' +
            '<button class="toggle_off layer_button" id="' + this.#getIDFn('layerActionHidePrefix') + num + '">H</button>' +
            '<button class="toggle_off layer_button" id="' + this.#getIDFn('layerActionMoveUpPrefix') + num + '">U</button>' +
            '<button class="toggle_off layer_button" id="' + this.#getIDFn('layerActionMoveDownPrefix') + num + '">D</button>' +
            '<button class="toggle_off layer_button" id="' + this.#getIDFn('layerActionDeletePrefix') + num + '">X</button>';
        d.innerHTML = h;

        this.#ref.layerListContainer.prepend(d);

        var scope = this;
        document.getElementById(this.#getIDFn('layerTypePrefix') + num).addEventListener('click', function (e) {
            scope.#doFn('select-layer', scope.#_numFromID(this.id));
        });
        document.getElementById(this.#getIDFn('layerActionLockPrefix') + num).addEventListener('click', function (e) {
            scope.#doFn('toggle-layers-lock', scope.#_arrOfNumsFromID(this.id));
        });
        document.getElementById(this.#getIDFn('layerActionHidePrefix') + num).addEventListener('click', function (e) {
            scope.#doFn('toggle-layers-hide', scope.#_arrOfNumsFromID(this.id));
        });
        document.getElementById(this.#getIDFn('layerActionMoveUpPrefix') + num).addEventListener('click', function (e) {
            scope.#doFn('move-layer-up', scope.#_numFromID(this.id));
        });
        document.getElementById(this.#getIDFn('layerActionMoveDownPrefix') + num).addEventListener('click', function (e) {
            scope.#doFn('move-layer-down', scope.#_numFromID(this.id));
        });
        document.getElementById(this.#getIDFn('layerActionDeletePrefix') + num).addEventListener('click', function (e) {
            scope.#doFn('delete-layers', scope.#_arrOfNumsFromID(this.id));
        });
    }


    #initBody() {
        // Just in case
        document.body.style.margin = 0;
        document.body.style.padding = 0;
    }

    #initContainer() {
        // We don't want this in the CSS
        this.#ref.container.style.margin = 0;
        this.#ref.container.style.padding = 0;
        this.#ref.container.style.position = "relative";
    }

    #initLayerContainer() {
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
        this.#ref.layerContainer.style.width = (w * 2) + 'px';
        this.#ref.layerContainer.style.height = (h * 2) + 'px';
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
        window.scrollTo(w / 2, h / 2);
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
        t.className = "toggle_off sidebar_toggle " + className;
        t.innerHTML = innerHtml;
        t.id = id;

        if (additionalFn != null) {
            additionalFn(t);
        }

        var scope = this;
        t.addEventListener('click', function () {
            clickFn(n);

            var tools = scope.#ref[ref].querySelectorAll('.' + className);
            for (var i = 0; i < tools.length; i++) {
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
        this.#addSidebarToggle(ref, n, 'tool_' + n, 'tool', this.#getToolIconFn(n), null, function (nm) {
            scope.#doFn('set-tool', nm);
        }, false);
    }

    #addSidebarLeftColor(ref, fgbg, n) {
        var scope = this;
        this.#addSidebarToggle(ref, n, 'color_' + fgbg + '_' + n, 'color', '', function (o) {
            o.style.background = scope.#colors[n];
        }, function (nm) {
            scope.#doFn('set-' + fgbg + '-color', nm);
        }, true);
    }

    #addSidebarProperty(ref, label, id, className, defval, vals) {
        var d = document.createElement('div');
        d.className = "sidebar_property " + className;
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
        this.#addSidebarTitle('sidebarLeft', "Tools");
        this.#addSidebarContainer('sidebarLeft', 'toolContainer');
        for (var i = 0; i < this.#tools.length; i++) {
            this.#addSidebarLeftTool('toolContainer', this.#tools[i]);
        }
    }

    #initColors() {
        this.#addSidebarTitle('sidebarLeft', "Fg Color");
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

        this.#addSidebarTitle('sidebarLeft', "Bg Color");
        this.#addSidebarContainer('sidebarLeft', 'colorBgContainer');
        for (const key in this.#colors) {
            this.#addSidebarLeftColor('colorBgContainer', "bg", key);
        }

        this.#doFn("set-fg-color", firstColor);
        this.#doFn("set-bg-color", firstColor);
    }

    #initStroke() {
        this.#addSidebarTitle('sidebarLeft', "Stroke");
        this.#addSidebarContainer('sidebarLeft', 'strokeContainer');
        this.#addSidebarProperty('sidebarLeft', "Width", "stroke_width", "", "3");
        this.#addSidebarProperty('sidebarLeft', "Opacity", "stroke_opacity", "", "100%");
        this.#addSidebarProperty('sidebarLeft', "Linecap", "stroke_linecap", "", "", { "butt": "butt", "square": "square", "round": "round" });
        this.#addSidebarProperty('sidebarLeft', "Linejoin", "stroke_linejoin", "", "", { "miter": "miter", "round": "round", "bevel": "bevel" });
        this.#addSidebarProperty('sidebarLeft', "Dasharray", "stroke_dasharray", "", "5");
    }

    #initFill() {
        this.#addSidebarTitle('sidebarLeft', "Fill");
        this.#addSidebarContainer('sidebarLeft', 'fillContainer');
        this.#addSidebarProperty('sidebarLeft', "Opacity", "fill_opacity", "", "100%");
        this.#addSidebarProperty('sidebarLeft', "Rule", "fill_rule", "", "", { "nonzero": "nonzero", "evenodd": "evenodd", "inherit": "inherit" });
    }

    #initProperties() {
        this.#addSidebarTitle('sidebarRight', "Properties");
        this.#addSidebarContainer('sidebarRight', 'propertyContainer');
        for (var i = 0; i < 10; i++) {
            this.#addSidebarProperty('sidebarRight', "Property " + i, "property_" + i, "property", "");
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
        this.#addLayerToolButton('layerToolsContainer', '+V', function (e) {
            scope.#doFn('add-vector-layer', []);
        });
        this.#addLayerToolButton('layerToolsContainer', '+P', function (e) {
            scope.#doFn('add-pixel-layer', []);
        });
        this.#addLayerToolButton('layerToolsContainer', 'L', function (e) {
            scope.#doFn('toggle-layers-lock', []);
        });
        this.#addLayerToolButton('layerToolsContainer', 'H', function (e) {
            scope.#doFn('toggle-layers-hide', []);
        });
        this.#addLayerToolButton('layerToolsContainer', 'X', function (e) {
            scope.#doFn('delete-layers', scope.#_arrOfNumsOfSelectedLayers());
        });
    }


    // selecting current layer when drawing - layout.js
    // selecting tool vs a type of layer + add 'v:' or 'p:' prefix for tools?
    // moving up
    // moving down


}