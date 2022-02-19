class Config {
    #id = {
        container: "edytor",
        layerContainer: "layer_container",
        grid: "grid_layer",
        pad: "pad_layer",
        pixel: "pixel_layer",
        vector: "vector_layer",
        sidebarLeft: "sidebar_left",
        sidebarRight: "sidebar_right"
    }
    #colors = {
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

    GetColors() {
        return this.#colors;
    }
    GetID(s) {
        return this.#id[s];
    }
}