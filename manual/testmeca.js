
let selectors;
let options;

window.onload = function () {
    selectors = document.querySelectorAll("select")
    options = selectors[0].querySelectorAll('option');

    for (let i = 1; i < selectors.length; i++) {
        for (let opt of options) {
            selectors[i].appendChild(opt.cloneNode(true));
        }
    }
}

function giveSelection(selected) {
    if (selected.value != "empty") {
        for (let sel of selectors) {
            if (sel !== selected) {
                sel.options[selected.getAttribute("oldvalue")].hidden = false;
                for (let i = 0; i < options.length; i++) {
                    if (options[i].dataset.id == selected.value) {
                        sel.options[i].hidden = true;
                    }
                }
            }
        }
        selected.setAttribute("oldvalue", selected.value);
    }
}
