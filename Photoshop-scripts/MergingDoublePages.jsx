(function() {

    //basic variables
    var title = "Merging images";


    //Reusables
    var group;
    var panel;
    var window;


    //Other vars
    var pnlPC;
    var pnlPS;
    var allDocuments = [];
    var fileOne;
    var fileTwo;

    for (var i = 0; i < app.documents.length; i++) {
        allDocuments.push(app.documents[i].name);
    }

    window = new Window("dialog", title); //creation of the window
    window.alignChildren = "fill";


    //Radios: which way of choosing files
    panel = window.add("panel", undefined, "");
    group = panel.add("group");
    var radioPC = group.add("radiobutton", undefined, "Pick files from computer");
    var radioPS = group.add("radiobutton", undefined, "Pick photoshop files");


    //Selecting files from computer
    pnlPC = window.add("panel", undefined, "Choosing files from PC");
    group = pnlPC.add("group");
    var btnFileOne = group.add("button", undefined, "First file...");
    var txtFileOnePath = group.add("statictext", undefined, "", {
        truncate: "middle"
    });
    txtFileOnePath.preferredSize = [200, -1];
    group = pnlPC.add("group");
    var btnFileTwo = group.add("button", undefined, "Second file...");
    var txtFileTwoPath = group.add("statictext", undefined, "", {
        truncate: "middle"
    });
    txtFileTwoPath.preferredSize = [200, -1];
    pnlPC.enabled = false;


    //Selecting files from Photoshop
    pnlPS = window.add("panel", undefined, "Choosing files from Photoshop");
    group = pnlPS.add("group");
    group.add("statictext", undefined, "First file: ");
    var dropDownOne = group.add("dropdownlist", undefined, allDocuments);
    group.alignment = "left";
    group = pnlPS.add("group");
    group.add("statictext", undefined, "Second file: ");
    var dropDownTwo = group.add("dropdownlist", undefined, allDocuments);
    group.alignment = "left";

    pnlPS.enabled = false;


    //closing the window
    group = window.add("group");
    group.alignment = "center";
    var btnOk = group.add("button", undefined, "OK");
    var btnCancel = group.add("button", undefined, "Cancel");


    //Event handlers
    btnFileOne.onClick = function() {
        var file = File.openDialog();
        if (file) {
            txtFileOnePath.text = file.fullName;
            fileOne = file;
        }
        if (txtFileOnePath.text == txtFileTwoPath.text) {
            alert("You are selecting the same file twice");
        }
    };

    btnFileTwo.onClick = function() {
        var file = File.openDialog();
        if (file) {
            txtFileTwoPath.text = file.fullName;
            fileTwo = file;
        }
        if (txtFileOnePath.text == txtFileTwoPath.text) {
            alert("You are selecting the same file twice");
        }
    };

    btnOk.onClick = function() {
        window.close(1);
    };

    btnCancel.onClick = function() {
        window.close(0);
    };

    radioPC.onClick = function() {
        if (radioPC.value == true) { //Enable the PC selection
            pnlPS.enabled = false;
            pnlPC.enabled = true;
        }
    };

    radioPS.onClick = function() {
        if (radioPS.value == true) { //Enable the dropdown list of PS documents
            pnlPC.enabled = false;
            pnlPS.enabled = true;
        }
    }


    dropDownOne.onChange = function() {
        if (dropDownOne.selection != null && dropDownTwo.selection != null) {
            if (dropDownOne.selection.text == dropDownTwo.selection.text) {
                alert("You are selecting the same file twice");
            }
        }


    }
    dropDownTwo.onChange = function() {
        if (dropDownOne.selection != null && dropDownTwo.selection != null) {
            if (dropDownOne.selection.text == dropDownTwo.selection.text) {
                alert("You are selecting the same file twice");
            }
        }

    }

    //Processing functions

    function mergePCFiles() {
        var docArr = [];
        //open up the necessary files
        openFile(fileOne);
        docArr.push(app.activeDocument.name);
        openFile(fileTwo);
        docArr.push(app.activeDocument.name);

        //pasting the first part
        app.activeDocument = documents.getByName(docArr[0]);
        var document = app.activeDocument;
        var theBounds = document.activeLayer.bounds;
        var layerWidth = theBounds[2] - theBounds[0];
        var layerHeight = theBounds[3] - theBounds[1];
        document.selection.selectAll();
        document.selection.copy();
        var finalDoc = app.documents.add(layerWidth * 2, layerHeight);
        app.activeDocument.paste();
        document = app.activeDocument;
        var currentX = layerWidth;
        document.selection.selectAll();
        document.selection.translate(-(currentX / 2), 0);

        //pasting the second part
        app.activeDocument = documents.getByName(docArr[1]);
        document = app.activeDocument;
        theBounds = document.activeLayer.bounds;
        layerWidth = theBounds[2] - theBounds[0];
        layerHeight = theBounds[3] - theBounds[1];
        document.selection.selectAll();
        document.selection.copy();
        app.activeDocument = finalDoc;
        app.activeDocument.paste();
        document = app.activeDocument;
        document.selection.selectAll();
        document.selection.translate((currentX), 0);
        document.selection.deselect();

        app.activeDocument = documents.getByName(docArr[0]);
        app.activeDocument.close();
        app.activeDocument = documents.getByName(docArr[1]);
        app.activeDocument.close();
    }

    function openFile(file) {
        app.open(file);
    }

    function mergePSFiles() {
        //pasting the first part
        app.activeDocument = documents.getByName(dropDownOne.selection.text);
        var document = app.activeDocument;
        var theBounds = document.activeLayer.bounds;
        var layerWidth = theBounds[2] - theBounds[0];
        var layerHeight = theBounds[3] - theBounds[1];
        document.selection.selectAll();
        document.selection.copy();
        var finalDoc = app.documents.add(layerWidth * 2, layerHeight);
        app.activeDocument.paste();
        document = app.activeDocument;
        var currentX = layerWidth;
        document.selection.selectAll();
        document.selection.translate(-(currentX / 2), 0);

        //pasting the second part
        app.activeDocument = documents.getByName(dropDownTwo.selection.text);
        document = app.activeDocument;
        theBounds = document.activeLayer.bounds;
        layerWidth = theBounds[2] - theBounds[0];
        layerHeight = theBounds[3] - theBounds[1];
        document.selection.selectAll();
        document.selection.copy();
        app.activeDocument = finalDoc;
        app.activeDocument.paste();
        document = app.activeDocument;
        document.selection.selectAll();
        document.selection.translate((currentX), 0);
        document.selection.deselect();
    }



    //Showing the window
    if (window.show() == 1) {
        if (radioPC.value) {
            mergePCFiles();
        } else if (radioPS.value) {
            if (dropDownOne.selection != null && dropDownTwo.selection != null) {
                mergePSFiles();
            }
        }
        alert("Script is done running", title, false);
    }

})();