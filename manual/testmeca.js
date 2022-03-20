let guidon_selectors;
let guidon_options;

let moyeu_selectors;
let moyeu_options;

window.onload = function () {
    guidon_selectors = document.querySelectorAll("#guidon select");
    guidon_options = guidon_selectors[0].querySelectorAll('option');

    for (let i = 1; i < guidon_selectors.length; i++) {
        for (let opt of guidon_options) {
            guidon_selectors[i].appendChild(opt.cloneNode(true));
        }
    }

    moyeu_selectors = document.querySelectorAll("#moyeulibre select");
    moyeu_options = moyeu_selectors[0].querySelectorAll('option');

    for (let i = 1; i < moyeu_selectors.length; i++) {
        for (let opt of moyeu_options) {
            moyeu_selectors[i].appendChild(opt.cloneNode(true));
        }
    }
}

function giveSelection(selected) {
    if (selected.value != "empty") {
        let selectors, options;
        if (selected.parentNode.id === "guidon") {
            selectors = guidon_selectors;
            options = guidon_options;
        } else {
            selectors = moyeu_selectors;
            options = moyeu_options;
        }
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
