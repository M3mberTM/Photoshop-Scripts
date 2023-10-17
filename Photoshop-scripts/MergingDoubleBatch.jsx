// Written in 2023

// Written by M3mber (Discord)

// This script is for merging of single pages together to form a manga double page. Done with whole user interface and mostly for batch purposes

(function() {

    //basic variables-------------------------------------------------------
    var title = "Batch Merging images";
    var list;
    var files;
    var finalDir;

    //Reusables-------------------------------------------------------
    var group;
    var panel;
    var window;


    //Other vars-------------------------------------------------------
    var mergeIsFront = true;
    var saveExtension = "png";
    var isNamingNumbers = true;

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

    //Selecting your preferred style of merging
    group = panel.add("group");
    var txt = group.add("statictext", undefined, "Select your preferred merging style!");
    group = panel.add("group");
    var radioMergeOne = group.add("radiobutton", undefined, "1-2");
    var radioMergeTwo = group.add("radiobutton", undefined, "2-1");

    //Show selected files
    group = panel.add("group");
    list = group.add('ListBox', [0, 0, 350, 150], '', {
        numberOfColumns: 2,
        showHeaders: true,
        columnTitles: ['First File', 'Second file']
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
    var txt = group.add("statictext", undefined, "File naming");
    var radioNameNum = group.add("radiobutton", undefined, "Page <num1>-<num2>");
    var radioNameFull = group.add("radiobutton", undefined, "<FileOne>-<FileTwo>");

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
        files = File.openDialog("Select files to merge", undefined, true);
        if (!files) {
            alert("No files were selected", title, true);
            return;
        }
        if (files.length % 2 == 1) {
            files.pop();
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

    radioMergeOne.onClick = function() {
        mergeIsFront = true;
        displayList();
    };

    radioMergeTwo.onClick = function() {
        mergeIsFront = false;
        displayList();
    };

    radioJpg.onClick = function() {
        saveExtension = "jpg";
    };

    radioPng.onClick = function() {
        saveExtension = "png";
    };

    radioNameFull.onClick = function() {
        isNamingNumbers = false;
    };

    radioNameNum.onClick = function() {
        isNamingNumbers = true;
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

    function merge(fileIndex, fileTwoIndex) {
        //opening the first file to get dimensions
        openFile(files[fileIndex]);
        var doc = app.activeDocument;
        bounds = doc.activeLayer.bounds;
        var docW = bounds[2] - bounds[0];
        var docH = bounds[3] - bounds[1];
        //opening the second file to get dimensions
        openFile(files[fileTwoIndex]);
        var docTwo = app.activeDocument;
        bounds = docTwo.activeLayer.bounds;
        var docTwoW = bounds[2] - bounds[0];
        var docTwoH = bounds[3] - bounds[1];
        //editing
        var finalHeigth = docH > docTwoH ? docH : docTwoH;
        app.activeDocument = doc;
        doc.resizeCanvas(docW + docTwoW, finalHeigth, AnchorPosition.TOPLEFT);
        app.activeDocument = docTwo;
        var layer = docTwo.layers[0].duplicate(doc);
        docTwo.close(SaveOptions.DONOTSAVECHANGES);
        //Moving of the new document
        app.activeDocument = doc;
        doc.activeLayer = layer;
        layer.translate(docTwoW, 0);
        doc.flatten();
        return doc;
    }

    function saveJpg(docToSave, fName) {
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
        var file;
        var saveOptions;
        file = new File(finalDir.fullName + "/" + fName + ".png");
        saveOptions = new PNGSaveOptions();
        saveOptions.compression = 5;
        saveOptions.interlaced = false;
        docToSave.saveAs(file, saveOptions);
    }


    function getPageNum(nameOne, nameTwo) {

        var pattern = /\d+/g;
        var oneMatches = nameOne.match(pattern);
        var twoMatches = nameTwo.match(pattern);
        for (var i = 0; i < oneMatches.length; i++) {

            if (oneMatches[i] != twoMatches[i]) {
                return [oneMatches[i], twoMatches[i]];
            }
        }
    }

    function getFileName(nameOne, nameTwo) {
        if (isNamingNumbers) {
            var pageNums = getPageNum(nameOne, nameTwo);
            if (pageNums) {
                return "page " + pageNums[0] + "-" + pageNums[1];
            }
            return nameOne + "-" + nameTwo;

        } else {
            return nameOne + "-" + nameTwo;
        }
    }

    function batch() {

        if (mergeIsFront) {
            for (var index = 0; index < files.length; index += 2) {
                var fileOne = File.decode(files[index].name).replace(/\.(\w|\d)+$/, "");
                var fileTwo = File.decode(files[index + 1].name).replace(/\.(\w|\d)+$/, "");
                if (saveExtension == "jpg") {
                    saveJpg(merge(index, index + 1), getFileName(fileOne, fileTwo));
                } else {
                    savePng(merge(index, index + 1), getFileName(fileOne, fileTwo));
                }
                app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
            }
        } else {
            for (var index = 0; index < files.length; index += 2) {
                var fileOne = File.decode(files[index + 1].name).replace(/\.(\w|\d)+$/, "");
                var fileTwo = File.decode(files[index].name).replace(/\.(\w|\d)+$/, "");
                if (saveExtension == "jpg") {
                    saveJpg(merge(index+1, index), getFileName(fileOne, fileTwo));
                } else {
                    savePng(merge(index+1, index), getFileName(fileOne, fileTwo));
                }
                app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
            }
        }
    }

    function displayList() {
        if (files) {
            if (files.length >= 2) {
                list.removeAll();
                for (var index = 0; index < files.length; index += 2) {
                    if (mergeIsFront) {
                        var itemOne = list.add('item', File.decode(files[index].name));
                        itemOne.subItems[0].text = File.decode(files[index + 1].name);
                    } else {
                        var itemOne = list.add('item', File.decode(files[index + 1].name));
                        itemOne.subItems[0].text = File.decode(files[index].name);
                    }
                }
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