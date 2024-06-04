// Written in 2024

// Written by m3mber (Discord)

// <Functionality of the file>

(function() {


var title = "Font picking";
var fonts = app.fonts;
var fontNames =[];
// putting 
for (var i = 0; i < fonts.length; i++) {
fontNames.push(fonts[i].postScriptName);
}

var g;
var p;
var w;
var listFonts;
var btnOk;
var btnCancel;

w = new Window("dialog", title);
w.alignChildren = "fill";
p = w.add("panel", undefined, "Options");
g = p.add("group");
g.alignment = "center";
g.add("statictext", undefined, "Pick the font:");
listFonts = g.add("dropdownlist", undefined, fontNames);


g = w.add("group");
g.alignChildren = "center";
btnOk = g.add("button", undefined, "Ok");
btnCancel = g.add("button", undefined, "Cancel");

//UI Event handlers

btnOk.onClick = function() {
    w.close(1);
};

btnCancel.onClick = function() {
    w.close(0);
};

function batch() {
var docRef = app.activeDocument;
    // var layers = [];

    var layers = getSelectedLayersInfo();


    // if we _really_ want to get artLayers we can select them one by one with IDs
    for (var i = 0; i < layers.length; i++) {
        selectByID(layers[i].id);
        changeFonts();
    }

    // and reselecting everything back
    for (var i = 0; i < layers.length; i++) {
        selectByID(layers[i].id, true);
    }

   //  alert("Script is done", 'Remove whitespace script', true);

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


function changeFonts() {
    var chosenFont;
    var currLayer = app.activeDocument.activeLayer;

    chosenFont = listFonts.selection.text;
    chosenFont = fonts.getByName(chosenFont);
 if (currLayer.kind == LayerKind.TEXT) { 
    alert(currLayer.textItem.style);
    currLayer.textItem.font = chosenFont.postScriptName; 
 } 

}


// Show the window

    if (w.show() == 1) {
        batch();
        alert("Script is done running", title, false);
    }



})();