// Written in 2023

// Written by M3mber (Discord)

// A simple script for batch conversion of psd files into png/jpg

(function() {

    //basic variables-------------------------------------------------------
    var title = "Batch psd conversion";
    var list;
    var files;
    var finalDir;

    //Reusables-------------------------------------------------------
    var group;
    var panel;
    var window;


    //Enums-----------------------------------------------------------
    const saveExtensions = {
        PNG: "PNG",
        JPG: "JPG"
    };


    //Other vars-------------------------------------------------------
    var saveExtension = saveExtensions.PNG;


    //Options-------------------------------------------------------
    app.displayDialogs = DialogModes.NO;
    app.preferences.rulerUnits = Units.PIXELS;


    //DESIGN-------------------------------------------------------
    //creation of the window
    window = new Window("dialog", title);
    window.alignChildren = "fill";

    //Selecting files from computer
    panel = window.add("panel", undefined, "Selection");
    group = panel.add("group");
    var txt = group.add("statictext", undefined, "Select your files");
    var btnSelectFiles = group.add("button", undefined, "Select");
    txt.preferredSize = [200, -1];

    //Show selected files
    group = panel.add("group");
    list = group.add('ListBox', [0, 0, 450, 150], '', {
        numberOfColumns: 1,
        showHeaders: true,
        columnTitles: ['Files loaded:']
    });

    //Saving
    panel = window.add("panel", undefined, "Saving...");

    //Select the final directory where the saved files will be
    group = panel.add("group");
    var txtDir = group.add("statictext", undefined, "Select final directory", {
        truncate: "middle"
    });
    var btnSelectDir = group.add("button", undefined, "Select");
    txtDir.preferredSize = [200, -1];

    group = panel.add("group");
    var txt = group.add("statictext", undefined, "Preferred extension");
    var radioPng = group.add("radiobutton", undefined, "png");
    var radioJpg = group.add("radiobutton", undefined, "jpg");

    //closing the window
    group = window.add("group");
    group.alignment = "center";
    var btnOk = group.add("button", undefined, "OK");
    var btnCancel = group.add("button", undefined, "Cancel");



    //Buttons and toggles-------------------------------------------------------
    btnSelectFiles.onClick = function() {
        files = File.openDialog("Select files to split", undefined, true);
        if (!files) {
            alert("No files were selected", title, true);
            return;
        }
        displayList();
    };

    btnSelectDir.onClick = function() {
        finalDir = Folder.selectDialog("Select your final directory");
        if (!finalDir) {
            alert("No directory was selected", title, true);
            return;
        } else {
            txtDir.text = finalDir.fullName;
        }
    };


    radioJpg.onClick = function() {
        saveExtension = saveExtensions.JPG;
    };

    radioPng.onClick = function() {
        saveExtension = saveExtensions.PNG;
    };

    btnOk.onClick = function() {
        window.close(1);
    };

    btnCancel.onClick = function() {
        window.close(0);
    };


    //OTHER FUNCTIONS-------------------------------------------------------
    function openFile(file) {
        app.open(file);
    }



    function saveJpg(docToSave, fName) {
        app.activeDocument = docToSave;
        var file;
        var saveOptions;
        file = new File(finalDir.fullName + "/" + fName + ".jpg");
        saveOptions = new JPEGSaveOptions();
        saveOptions.embedColorProfile = true;
        saveOptions.quality = 12;
        saveOptions.formatOptions = FormatOptions.STANDARDBASELINE;
        docToSave.saveAs(file, saveOptions);
    }

    function savePng(docToSave, fName) {
        app.activeDocument = docToSave;
        var file;
        var saveOptions;
        file = new File(finalDir.fullName + "/" + fName + ".png");
        saveOptions = new PNGSaveOptions();
        saveOptions.compression = 5;
        saveOptions.interlaced = false;
        docToSave.saveAs(file, saveOptions);
    }

    function batch() {
        if (files) {
            for (var index = 0; index < files.length; index++) {
                openFile(files[index]);
                var doc = app.activeDocument;
                var fileName = files[index].name.replace(/\.(\w|\d)+$/, "");
                if (saveExtension == saveExtensions.PNG) {
                    savePng(doc, fileName);
                } else {
                    saveJpg(doc, fileName);
                }
                doc.close(SaveOptions.DONOTSAVECHANGES);
            }
        }
    }

    function displayList() {
        if (files) {
            list.removeAll();
            for (var index = 0; index < files.length; index++) {
                list.add('item', File.decode(files[index].name));
            }
        } else {
            alert("No files were selected", title, true);
        }
    }



    //Showing the window-------------------------------------------------------
    if (window.show() == 1) {
        batch();
        alert("Script is done running", title, false);
    }

})();