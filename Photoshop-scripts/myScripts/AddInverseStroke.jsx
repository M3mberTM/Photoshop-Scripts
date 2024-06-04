// Written in 2024

// Edited by M3mber (Discord), original version by Luigi

// A simple script for giving stroke to manga text layers
(function() {

    var docRef = app.activeDocument;
    // var layers = [];

    var layers = getSelectedLayersInfo();
    var final_info = 'Added stroke to the following layers: ';


    // if we _really_ want to get artLayers we can select them one by one with IDs
    for (var i = 0; i < layers.length; i++) {
        selectByID(layers[i].id);
        stroke_adding();
        final_info += activeDocument.activeLayer.name + ', ';
    }

    // and reselecting everything back
    for (var i = 0; i < layers.length; i++) {
        selectByID(layers[i].id, true);
    }

    alert(final_info, 'Add Inverse Stroke Script', true);


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








    // Add a stroke on a text layer
    // Stroke will be the inverse of the text layer's color
    // Original script shared by cicerociceronis, edited by Luigi from Plastic Tears (https://plastictearsmanga.com/).

    var percentage = 0.0025 //This is the percentage of the layer's height will use to create the stroke. I've tested it in many manga series and it seems this is the number that works the best.

    function getStrokeSize() {
        try {
            var ref = new ActionReference();
            ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
            var desc = executeActionGet(ref).getObjectValue(stringIDToTypeID('layerEffects')).getObjectValue(stringIDToTypeID('frameFX'));
            return desc.getUnitDoubleValue(stringIDToTypeID('size'));
        } catch (e) {}
    };

    function stroke_adding() {
        var percentage = 0.0025 //This is the percentage of the layer's height will use to create the stroke. I've tested it in many manga series and it seems this is the number that works the best.

        function getStrokeSize() {
            try {
                var ref = new ActionReference();
                ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
                var desc = executeActionGet(ref).getObjectValue(stringIDToTypeID('layerEffects')).getObjectValue(stringIDToTypeID('frameFX'));
                return desc.getUnitDoubleValue(stringIDToTypeID('size'));
            } catch (e) {}
        };


        var textRed = app.activeDocument.activeLayer.textItem.color.rgb.red
        var textBlue = app.activeDocument.activeLayer.textItem.color.rgb.blue
        var textGreen = app.activeDocument.activeLayer.textItem.color.rgb.green
        var textRed = Math.abs(textRed - 255)
        var textBlue = Math.abs(textBlue - 255)
        var textGreen = Math.abs(textGreen - 255)


        function newStroke(size) {
            function newStrokeEffect(strokeSize, strokeColor, strokePosition) {
                var effectDescriptor = new ActionDescriptor();
                var effectColor = new ActionDescriptor();
                var strokeOpacity = 100.0; // 0 - 100 %
                var strokeBlend = "Nrml"; // Normal[Nrml], ColorBurn[CBrn], SoftLight[SftL}, Color[Clr ]

                effectDescriptor.putBoolean(charIDToTypeID("enab"), true);
                effectDescriptor.putEnumerated(charIDToTypeID("Styl"), charIDToTypeID("FStl"), charIDToTypeID(strokePosition));
                effectDescriptor.putEnumerated(charIDToTypeID("PntT"), charIDToTypeID("FrFl"), charIDToTypeID("SClr"));
                effectDescriptor.putEnumerated(charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID(strokeBlend));
                effectDescriptor.putUnitDouble(charIDToTypeID("Opct"), charIDToTypeID("#Prc"), strokeOpacity);
                effectDescriptor.putUnitDouble(charIDToTypeID("Sz  "), charIDToTypeID("#Pxl"), strokeSize);
                effectColor.putDouble(charIDToTypeID("Rd  "), strokeColor.rgb.red);
                effectColor.putDouble(charIDToTypeID("Grn "), strokeColor.rgb.green);
                effectColor.putDouble(charIDToTypeID("Bl  "), strokeColor.rgb.blue);
                effectDescriptor.putObject(charIDToTypeID("Clr "), charIDToTypeID("RGBC"), effectColor);
                return (effectDescriptor);
            }

            var tmpC = new SolidColor();
            tmpC.rgb.red = textRed
            tmpC.rgb.blue = textBlue
            tmpC.rgb.green = textGreen

            var layerOptions = new ActionDescriptor();
            var refr01 = new ActionReference();
            var layerProperties = new ActionDescriptor();

            layerOptions.putUnitDouble(charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 100.0);

            var layerEffects = newStrokeEffect(size, tmpC, "OutF");

            layerOptions.putObject(charIDToTypeID("FrFX"), charIDToTypeID("FrFX"), layerEffects);

            refr01.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("Lefx"));
            refr01.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
            layerProperties.putReference(charIDToTypeID("null"), refr01);
            layerProperties.putObject(charIDToTypeID("T   "), charIDToTypeID("Lefx"), layerOptions);

            try {
                executeAction(charIDToTypeID("setd"), layerProperties, DialogModes.NO);
            } catch (ex) {
                if (ex != "Error: User cancelled the operation")
                    alert(scriptName + " newLayerEffect() exception caught? line[" + ex.line + "] " + ex);
            }

        }

        var canvasHeight = app.activeDocument.height; // Gets the height of the canvas, I used height to prevent messing it up on double spreads.
        var strokeSize = canvasHeight * percentage; // It now calculates the stroke size based on the canvas height, instead of the text size.

        strokeStatus = getStrokeSize()

        if (typeof strokeStatus !== "number") {
            newStroke(strokeSize);
        } else {
            newStroke(getStrokeSize() + 1) //In case the stroke is too small, you can run it again and it'll make the stroke 1 pixel bigger.
        }
    }

})();