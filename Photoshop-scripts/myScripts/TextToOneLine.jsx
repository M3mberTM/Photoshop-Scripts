// Written in 2024

// Written by m3mber (Discord)

// A script for removing whitespace at the beginning and end of lines on text layers

(function() {



    var docRef = app.activeDocument;
    // var layers = [];

    var layers = getSelectedLayersInfo();


    // if we _really_ want to get artLayers we can select them one by one with IDs
    for (var i = 0; i < layers.length; i++) {
        selectByID(layers[i].id);
        textToOneLine();
    }

    // and reselecting everything back
    for (var i = 0; i < layers.length; i++) {
        selectByID(layers[i].id, true);
    }


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




    function textToOneLine() {
        var currLayer = app.activeDocument.activeLayer;
        if (currLayer.kind == LayerKind.TEXT) {
            // if the current layer is a text layer, get it's text
            const currText = currLayer.textItem.contents;
            const lines = currText.split(/\n|\r/gm);
            const editedLines = [];

            for (var i = 0; i < lines.length; i++) {
                var currLine = lines[i]
                if (currLine.charAt(currLine.length - 1) === '-') {
                    currLine = currLine.substring(0, currLine.length - 1);
                } else {
                    currLine = currLine + " ";
                }
                editedLines.push(currLine);
            }

            var newText = editedLines.join("");

            currLayer.textItem.contents = newText;

        }
    }
})();