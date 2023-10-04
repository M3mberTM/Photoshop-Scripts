(function() {
    var doublePage = app.activeDocument;
    var doublePageName = doublePage.name;
    var layer = doublePage.layers[0];
    var theBounds = doublePage.activeLayer.bounds;
    var layerWidth = theBounds[2] - theBounds[0];
    var layerHeight = theBounds[3] - theBounds[1];
    var x0 = 0;
    var x1 = layerWidth / 2;
    var x2 = layerWidth;
    var y0 = 0;
    var y1 = layerHeight;

    //First page

    var shape = [
        [x0, y0],
        [x0, y1],
        [x1, y1],
        [x1, y0]
    ];
    var sel = doublePage.selection.select(shape);
    doublePage.selection.copy();
    var firstPart = app.documents.add(layerWidth / 2, layerHeight);
    app.activeDocument.paste();
    app.activeDocument = app.documents.getByName(doublePageName);

    //Second page

    shape = [
        [x1, y0],
        [x1, y1],
        [x2, y1],
        [x2, y0]
    ];
    sel = doublePage.selection.select(shape);
    doublePage.selection.copy();
    var secondPart = app.documents.add(layerWidth / 2, layerHeight);
    app.activeDocument.paste();

    alert("Splitting done!")
})();