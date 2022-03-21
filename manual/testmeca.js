let guidon_selectors;
let guidon_options;

let moyeu_selectors;
let moyeu_options;

const sum = arr => arr.reduce((a, b) => a + b, 0);

window.onload = function () {
    guidon_selectors = document.querySelectorAll("#guidon select");
    guidon_options = guidon_selectors[0].querySelectorAll("option");

    for (let i = 1; i < guidon_selectors.length; i++) {
        for (let opt of guidon_options) {
            guidon_selectors[i].appendChild(opt.cloneNode(true));
        }
    }

    moyeu_selectors = document.querySelectorAll("#moyeulibre select");
    moyeu_options = moyeu_selectors[0].querySelectorAll("option");

    for (let i = 1; i < moyeu_selectors.length; i++) {
        for (let opt of moyeu_options) {
            moyeu_selectors[i].appendChild(opt.cloneNode(true));
        }
    }
}

function giveSelection(selected) {
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
            if (selected.getAttribute("oldvalue") != 0) {
                sel.options[selected.getAttribute("oldvalue")].hidden = false;
            }
            if (selected.value != 0) {
                for (let i = 0; i < options.length; i++) {
                    if (options[i].dataset.id == selected.value) {
                        sel.options[i].hidden = true;
                    }
                }
            }
        }
    }
    selected.setAttribute("oldvalue", selected.value);
}

const roue_answers = [
    ["jante"],
    ["fond de jante"],
    ["chambre à air", "chambre a air"],
    ["pneu"],
    ["valve"],
    ["rayon", "rayons"],
    ["tête de rayon", "tete de rayon", "vis de rayon"]
];
const questions_answers = [
    ["q1perc", "q2derailleur", "q3angle"],
    ["q4secher", "q4perforant", "q4gratter", "q4gonfler"]
];
const selector_answers = [1, 2, 3, 4, 5];

function checkResults() {
    let score = 0;

    let questions_checked = Array.from(document.querySelectorAll("#questions input:checked"), e => e.value);
    score += sum(questions_answers[0].map(i => questions_checked.includes(i)));
    score += sum(questions_answers[1].map(i => questions_checked.includes(i))) / 4;

    let guidon_fields = Array.from(document.querySelectorAll("#guidon select"), e => e.value);
    score += sum(selector_answers.map((_, i) => guidon_fields[i] == selector_answers[i]));

    let moyeu_fields = Array.from(document.querySelectorAll("#moyeulibre select"), e => e.value);
    score += sum(selector_answers.map((_, i) => moyeu_fields[i] == selector_answers[i]));

    let roue_fields = Array.from(document.querySelectorAll("#roue input"), e => e.value);
    score += sum(roue_answers.map((_, i) => roue_answers[i].includes(roue_fields[i])));

    document.getElementById("results").innerHTML = `Vous obtenez une note de ${score}/20.`;
    document.getElementById("correction").hidden = false;
}

function goodResults() {
    document.quiz.reset();
    resetDisplay();

    for (let question of [].concat(...questions_answers)) {
        document.getElementById(question).click();
    }

    let guidon_fields = document.querySelectorAll("#guidon select");
    let moyeu_fields = document.querySelectorAll("#moyeulibre select");
    selector_answers.map(i => moyeu_fields[i - 1].selectedIndex = guidon_fields[i - 1].selectedIndex = i);

    let roue_fields = document.querySelectorAll("#roue input");
    roue_answers.map((_, i) => roue_fields[i].value = roue_answers[i][0]);

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetDisplay() {
    document.getElementById("results").innerHTML = "";
    document.getElementById("correction").hidden = true;
}
