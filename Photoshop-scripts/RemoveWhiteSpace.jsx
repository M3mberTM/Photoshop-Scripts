// Written in 2023

// Written by M3mber (Discord)

// A script for removing whitespace at the beginning and end of lines on text layers

(function() {
 
 

var docRef = app.activeDocument;
    // var layers = [];

    var layers = getSelectedLayersInfo();


    // if we _really_ want to get artLayers we can select them one by one with IDs
    for (var i = 0; i < layers.length; i++) {
        selectByID(layers[i].id);
        removeWhitespace();
    }

    // and reselecting everything back
    for (var i = 0; i < layers.length; i++) {
        selectByID(layers[i].id, true);
    }

   //  alert("Script is done", 'Remove whitespace script', true);


    function getSelectedLayersInfo() {
        var lyrs = [];
        var lyr;
        var ref = new ActionReference();
        var desc;
        var tempIndex = 0;
        var ref2;
        ref.putProperty(stringIDToTypeID("property"), stringIDToTypeID("targetLayers"));
        ref.putEnumerated(charIDToTypeID('Dcmn'), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));

        var targetLayers = executeActionGet(ref).getList(stringIDToTypeID("targetLayers"));
        for (var i = 0; i < targetLayers.count; i++) {
            ref2 = new ActionReference();

            // if there's a background layer in the document, AM indices start with 1, without it from 0. ¯\_(ツ)_/¯ 
            try {
                activeDocument.backgroundLayer;
                ref2.putIndex(charIDToTypeID('Lyr '), targetLayers.getReference(i).getIndex());
                desc = executeActionGet(ref2);
                tempIndex = desc.getInteger(stringIDToTypeID("itemIndex")) - 1;

            } catch (o) {
                ref2.putIndex(charIDToTypeID('Lyr '), targetLayers.getReference(i).getIndex() + 1);
                desc = executeActionGet(ref2);
                tempIndex = desc.getInteger(stringIDToTypeID("itemIndex"));
            }

            lyr = {};
            lyr.index = tempIndex;
            lyr.id = desc.getInteger(stringIDToTypeID("layerID"));
            lyr.name = desc.getString(charIDToTypeID("Nm  "));
            lyrs.push(lyr);
        }

        return lyrs;
    }

    function selectByID(id, add) {
        if (add == undefined) add = false;
        var desc1 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putIdentifier(charIDToTypeID('Lyr '), id);
        desc1.putReference(charIDToTypeID('null'), ref1);
        if (add) desc1.putEnumerated(stringIDToTypeID("selectionModifier"), stringIDToTypeID("selectionModifierType"), stringIDToTypeID("addToSelection"));
        executeAction(charIDToTypeID('slct'), desc1, DialogModes.NO);
    } // end of selectByID()




function removeWhitespace() {
var currLayer = app.activeDocument.activeLayer;
 if (currLayer.kind == LayerKind.TEXT) {
    // if the current layer is a text layer, get it's text
    var currText = currLayer.textItem.contents;
    var lines = currText.split(/\n|\r/gm);

    for (var i = 0; i < lines.length; i++) {
      lines[i] = lines[i].replace(/^\s+|\s+$/gm,'');
    }

    var newText = "";
    for (var i = 0; i < lines.length-1; i++) {
      newText = newText + lines[i] + "\r";
    }

    newText = newText + lines[lines.length-1];
    
    currLayer.textItem.contents = newText;


 } else {
    alert("Not a text layer: " + currLayer.name);
 }
}
})();