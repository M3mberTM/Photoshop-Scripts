// Written in 2023

// Written by M3mber (Discord)

// This script is for the splitting of manga double pages. Has a user interface and is mostly done for batch purposes

(function() {

    //basic variables-------------------------------------------------------
    var title = "Batch Splitting images";
    var list;
    var files;
    var finalDir;

    //Reusables-------------------------------------------------------
    var group;
    var panel;
    var window;


    //Enums-----------------------------------------------------------
    const fileNaming = {
        NUMA: "NUMA",
        NAMEA: "NAMEA",
        NUMB: "NUMB",
        NAMEB: "NAMEB"
    };

    const saveExtensions = {
        PNG: "PNG",
        JPG: "JPG"
    };


    //Other vars-------------------------------------------------------
    var saveExtension = saveExtensions.PNG;
    var isSplitOne = true;
    var currFileNaming = fileNaming.NUMAB;



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

    //Selecting your preferred style of splitting
    group = panel.add("group");
    var txt = group.add("statictext", undefined, "Preferred splitting");
    var radioSplitOne = group.add("radiobutton", undefined, "1-2");
    var radioSplitTwo = group.add("radiobutton", undefined, "2-1");

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
    var txt = group.add("statictext", undefined, "File naming");
    var radioPNumA = group.add("radiobutton", undefined, "Page <num> A/B");
    var radioNameA = group.add("radiobutton", undefined, "<FileName> A/B");
    var radioPNumB = group.add("radiobutton", undefined, "Page <num> 1/2");
    var radioNameB = group.add("radiobutton", undefined, "<FileName> 1/2");

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

    radioNameA.onClick = function() {
        currFileNaming = fileNaming.NAMEA;
    };

    radioNameB.onClick = function() {
        currFileNaming = fileNaming.NAMEB;
    };

    radioPNumA.onClick = function() {
        currFileNaming = fileNaming.NUMA;
    };

    radioPNumB.onClick = function() {
        currFileNaming = fileNaming.NUMB;
    };

    radioSplitOne.onClick = function() {
        isSplitOne = true;
    };

    radioSplitTwo.onClick = function() {
        isSplitOne = false;
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


    function split(file) { //splitting the image
        openFile(file);
        var doc = app.activeDocument;
        var docW = doc.width;
        var docH = doc.height;
        var x0 = 0;
        var x1 = docW / 2;
        var x2 = docW;
        var y0 = 0;
        var y1 = docH;

        var selPOne = [
            [x0, y0],
            [x0, y1],
            [x1, y1],
            [x1, y0]
        ];

        var selPTwo = [
            [x1, y0],
            [x1, y1],
            [x2, y1],
            [x2, y0]
        ];

        //make the selection of one page
        doc.selection.select(selPOne);
        doc.selection.copy();

        //make the new document
        var pOne = app.documents.add(docW / 2, docH);
        app.activeDocument.paste();
        pOne = app.activeDocument;
        pOne.flatten();

        //make the selection of the second page
        app.activeDocument = doc;
        doc.selection.select(selPTwo);
        doc.selection.copy();

        //make the second document
        var pTwo = app.documents.add(docW / 2, docH);
        app.activeDocument.paste();
        pTwo = app.activeDocument;
        pTwo.flatten();

        app.activeDocument = doc;
        doc.close(SaveOptions.DONOTSAVECHANGES);
        // returns the two documents
        return [pOne, pTwo];
    }

    function getPageNum(fileName) {
        var firstFile = files[0].name.replace(/\.(\w|\d)+$/, "");
        var lastFile = files[files.length - 1].name.replace(/\.(\w|\d)+$/, "");
        var pattern = /\d+/g;
        var oneMatches = fileName.match(pattern);
        var firstMatches = firstFile.match(pattern);
        var lastMatches = lastFile.match(pattern);
        for (var i = 0; i < firstMatches.length; i++) {

            if (firstMatches[i] != lastMatches[i]) {
                if (firstMatches[i] != oneMatches[i]) {

                }
                return oneMatches[i];
            }
        }
    }

    function getFileNames(ogFileName) {
        if (currFileNaming == fileNaming.NAMEA) { //<FileName> A/B
            return [ogFileName + " A", ogFileName + " B"];
        } else if (currFileNaming == fileNaming.NAMEB) { //<FileName> 1/2
            return [ogFileName + " 1", ogFileName + " 2"];
        }

        if (files.length >= 2) {
            var currPageNum = getPageNum(ogFileName);
            if (currFileNaming == fileNaming.NUMA) { // Page <num> A/B
                return ["Page " + currPageNum + " A", "Page " + currPageNum + " B"];
            } else { // Page <num> 1/2
                return ["Page " + currPageNum + " 1", "Page " + currPageNum + " 2"];
            }
        } else {
            return [ogFileName + "A", ogFileName + "B"];
        }


    }

    function batch() {
        if (files) {
            for (var index = 0; index < files.length; index++) {
                var pages = split(files[index]);
                var fileNames = getFileNames(File.decode(files[index].name).replace(/\.(\w|\d)+$/, ""));
                if (isSplitOne) {
                    if (saveExtension == saveExtensions.PNG) {
                        savePng(pages[0], fileNames[0]);
                        app.activeDocument.close();
                        savePng(pages[1], fileNames[1]);
                        app.activeDocument.close();
                    } else {
                        saveJpg(pages[0], fileNames[0]);
                        app.activeDocument.close();
                        saveJpg(pages[1], fileNames[1]);
                        app.activeDocument.close();
                    }
                } else {
                    if (saveExtension == saveExtensions.PNG) {
                        savePng(pages[0], fileNames[1]);
                        app.activeDocument.close();
                        savePng(pages[1], fileNames[0]);
                        app.activeDocument.close();
                    } else {
                        saveJpg(pages[0], fileNames[1]);
                        app.activeDocument.close();
                        saveJpg(pages[1], fileNames[0]);
                        app.activeDocument.close();
                    }
                }
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
        // split(files[0]);
        alert("Script is done running", title, false);
    }

})();