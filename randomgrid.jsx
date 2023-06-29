var doc = app.activeDocument;

var currentpage;

var gapsize;

var myDialog = app.dialogs.add({ name: "Options", canCancel: true });
with (myDialog) {
    //Add a dialog column.
    with (dialogColumns.add()) {
        //Create another border panel.
        with (borderPanels.add()) {
            with (dialogColumns.add()) {
                staticTexts.add({ staticLabel: "Page:" });
            }
            with (dialogColumns.add()) {
                //Create a number entry field. Note that this field uses editValue
                //rather than editText (as a textEditBox would).
                var pagenum = parseInt(app.activeWindow.activePage.name);
                var INcurrentpage = integerEditboxes.add({ editValue: pagenum });
            }
        }
        with (borderPanels.add()) {
            with (dialogColumns.add()) {
                staticTexts.add({ staticLabel: "Gapsize:" });
            }
            with (dialogColumns.add()) {
                //Create a number entry field. Note that this field uses editValue
                //rather than editText (as a textEditBox would).
                var INcurrentgapsize = integerEditboxes.add({ editValue: 4 });
            }
        }
        //Create another border panel.
        with (borderPanels.add()) {
            staticTexts.add({ staticLabel: "Action to perform:" });
            var myRadioButtonGroup = radiobuttonGroups.add();
            with (myRadioButtonGroup) {
                var generatebutton = radiobuttonControls.add({ staticLabel: "Generate Grid", checkedState: true });
                var clearbutton = radiobuttonControls.add({ staticLabel: "Clear Grid" });
            }
        }
    }
}
//Display the dialog box.
if (myDialog.show() == true) {
    currentpage = doc.pages.item(INcurrentpage.editContents);
    gapsize = parseInt(INcurrentgapsize.editContents);
    if (generatebutton.checkedState) {
        cleargrid();
        generategrid();
    }
    else if (clearbutton.checkedState) {
        cleargrid();
    }
    myDialog.destroy();
}
else {
    myDialog.destroy()
}


function generategrid() {
    with (currentpage) {
        var margintop = currentpage.marginPreferences.top;
        var marginbottom = doc.documentPreferences.pageHeight - currentpage.marginPreferences.top;

        if (currentpage.name == 1 || currentpage.name % 2 == 0) {
            var marginleft = currentpage.marginPreferences.left;
            var marginright = doc.documentPreferences.pageWidth - currentpage.marginPreferences.right;
        }
        else {
            var marginleft = doc.documentPreferences.pageWidth + currentpage.marginPreferences.left;
            var marginright = doc.documentPreferences.pageWidth * 2 - currentpage.marginPreferences.right;
        }

        for (var a = 0; a < 5; a++) {
            var height = marginbottom - margintop;
            var divider = getRandomInt(2, 7);
            var guidepos = marginbottom - (height / divider);
            marginbottom = guidepos;

            var options = { orientation: HorizontalOrVertical.horizontal, location: guidepos };
            gridline(options, gapsize);
        }

        for (var a = 0; a < 5; a++) {
            var width = marginright - marginleft;
            var divider = getRandomInt(2, 7);
            var guidepos = marginright - (width / divider);
            marginright = guidepos;

            var options = { orientation: HorizontalOrVertical.vertical, location: guidepos };
            gridline(options, gapsize);
        }
    }
}

function cleargrid() {
    with (currentpage) {
        while (currentpage.guides.length > 0) {
            var currentguide = currentpage.guides.firstItem();
            currentguide.remove();
        }
    }
}

function gridline(INoptions, gapsize) {
    var options = INoptions;
    options.location = options.location - gapsize / 2;
    currentpage.guides.add(undefined, options);
    options = INoptions;
    options.location = options.location + gapsize / 2;
    currentpage.guides.add(undefined, options);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}