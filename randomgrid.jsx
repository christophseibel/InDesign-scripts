#include "seedrandom.js";

var doc = app.activeDocument;

var currentpage;

var gapsize;

var horizontaldivide;
var verticaldivide;

var seed = Math.random();

var optionDialog = app.dialogs.add({ name: "Options", canCancel: true });
with (optionDialog) {
    with (dialogColumns.add()) {
        with (borderPanels.add()) {
            with (dialogColumns.add()) {
                staticTexts.add({ staticLabel: "Page:" });
            }
            with (dialogColumns.add()) {
                var pagenum = parseInt(app.activeWindow.activePage.name);
                var INcurrentpage = integerEditboxes.add({ editValue: pagenum });
            }
        }
        with (borderPanels.add()) {
            with (dialogColumns.add()) {
                staticTexts.add({ staticLabel: "Gapsize:" });
            }
            with (dialogColumns.add()) {
                var INcurrentgapsize = integerEditboxes.add({ editValue: 4 });
            }
        }
        with (borderPanels.add()) {
            with (dialogColumns.add()) {
                staticTexts.add({ staticLabel: "Seed:" });
            }
            with (dialogColumns.add()) {
                var currentseed = realEditboxes.add({ editValue: seed });
            }
        }
        with (borderPanels.add()) {
            staticTexts.add({ staticLabel: "Divide Horizontaly:" });
            var myRadioButtonGroup = radiobuttonGroups.add();
            with (myRadioButtonGroup) {
                var horizontalbutton = radiobuttonControls.add({ staticLabel: "From Bottom", checkedState: true });
                radiobuttonControls.add({ staticLabel: "From Top" });
            }
        }
        with (borderPanels.add()) {
            staticTexts.add({ staticLabel: "Divide Verticaly:" });
            var myRadioButtonGroup = radiobuttonGroups.add();
            with (myRadioButtonGroup) {
                var verticalbutton = radiobuttonControls.add({ staticLabel: "From Left", checkedState: true });
                radiobuttonControls.add({ staticLabel: "From Right" });
            }
        }
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

if (optionDialog.show() == true) {
    currentpage = doc.pages.item(INcurrentpage.editContents);
    gapsize = parseInt(INcurrentgapsize.editContents);

    horizontaldivide = horizontalbutton.checkedState;
    verticaldivide = verticalbutton.checkedState;
    seed = currentseed.editContents;

    if (generatebutton.checkedState) {
        cleargrid();
        generategrid();
    }
    else if (clearbutton.checkedState) {
        cleargrid();
    }
    optionDialog.destroy();
}
else {
    optionDialog.destroy()
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
            if (horizontaldivide) {
                var guidepos = marginbottom - (height / divider);
                marginbottom = guidepos;
            }
            else {
                var guidepos = margintop + (height / divider);
                margintop = guidepos;
            }

            var options = { orientation: HorizontalOrVertical.horizontal, location: guidepos };
            gridline(options, gapsize);
        }

        for (var a = 0; a < 5; a++) {
            var width = marginright - marginleft;
            var divider = getRandomInt(2, 7);
            if (verticaldivide) {
                var guidepos = marginright - (width / divider);
                marginright = guidepos;
            }
            else {
                var guidepos = marginleft + (width / divider);
                marginleft = guidepos;
            }

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
    var myrng = new Math.seedrandom(seed);
    min = Math.ceil(min);
    max = Math.floor(max);
    var random = myrng();
    if (isNaN(random)) {
        random = 0;
    }
    return Math.floor(random * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}