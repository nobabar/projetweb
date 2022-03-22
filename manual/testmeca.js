// fields and options for the drop-down lists
let guidon_selectors;
let guidon_options;

let moyeu_selectors;
let moyeu_options;


/** 
* Compute the sum of an array.
* @param {Array} arr - the array to sum up.
* @return {Number|String} Returns a number in case of numeric or boolean values.
*   Returns a string by concatenation in case of strings or arrays.
*/
const sum = arr => arr.reduce((a, b) => a + b, 0);

/** 
* Initialize fields and options variables for the drop-down lists
* @summary Retrieve an array of drop-down lists and an array of their options with JQuery and css selectors.
*   Launch when the window and its objects are properly loaded.
*/
window.onload = function () {
    // Select all drop-down lists of the #guidon section and their options
    guidon_selectors = document.querySelectorAll("#guidon select");
    guidon_options = guidon_selectors[0].querySelectorAll("option");

    // Only the option of the first drop down list of the section are initialized, copy them in the other lists
    for (let i = 1; i < guidon_selectors.length; i++) {
        for (let opt of guidon_options) {
            guidon_selectors[i].appendChild(opt.cloneNode(true));
        }
    }

    // Select all drop-down lists of the #moyeulibre section and their options
    moyeu_selectors = document.querySelectorAll("#moyeulibre select");
    moyeu_options = moyeu_selectors[0].querySelectorAll("option");

    // Only the option of the first drop down list of the section are initialized, copy them in the other lists
    for (let i = 1; i < moyeu_selectors.length; i++) {
        for (let opt of moyeu_options) {
            moyeu_selectors[i].appendChild(opt.cloneNode(true));
        }
    }
}


/** 
* Remove the selected option of a drop-down list to other lists.
* @param {Option} selected - The selected option.
*/
function giveSelection(selected) {
    // choose the correct drop-dowwn lists and options
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
            // in case you are switching from two options
            if (selected.getAttribute("oldvalue") != 0) {
                // put the old option back into the other lists
                sel.options[selected.getAttribute("oldvalue")].hidden = false;
            }
            // if you're selecting an option
            if (selected.value != 0) {
                for (let i = 0; i < options.length; i++) {
                    if (options[i].dataset.id == selected.value) {
                        // remove it from other lists
                        sel.options[i].hidden = true;
                    }
                }
            }
        }
    }
    // set the option to retrieve it after next change
    selected.setAttribute("oldvalue", selected.value);
}

// correct answers for each section
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


/** 
* Check the answers provided and grant a mark.
*/
function checkResults() {
    let score = 0;

    // multiple choice questions section
    // retrieve the values of the checked boxes for these questions
    let questions_checked = Array.from(document.querySelectorAll("#questions input:checked"), e => e.value);
    // check if the provided answers are correct
    score += sum(questions_answers[0].map(i => questions_checked.includes(i)));
    score += sum(questions_answers[1].map(i => questions_checked.includes(i))) / 4;


    // guidon section
    let guidon_fields = Array.from(document.querySelectorAll("#guidon select"), e => e.value);
    score += sum(selector_answers.map((e, i) => guidon_fields[i] == e));

    // moyeu section
    let moyeu_fields = Array.from(document.querySelectorAll("#moyeulibre select"), e => e.value);
    score += sum(selector_answers.map((e, i) => moyeu_fields[i] == e));

    // roue section
    let roue_fields = Array.from(document.querySelectorAll("#roue input"), e => e.value);
    score += sum(roue_answers.map((e, i) => e.includes(roue_fields[i])));

    // display final score as a mark
    document.getElementById("results").innerHTML = `Vous obtenez une note de ${score}/20.`;

    // reveal the button to correct the answers
    document.getElementById("correction").hidden = false;
}

/** 
* Correct the answers provided.
*/
function goodResults() {
    // reset current answers
    document.quiz.reset();
    // hide this button back along with the mark
    resetDisplay();

    // multiple choice questions section
    // click every correct box
    for (let question of [].concat(...questions_answers)) {
        document.getElementById(question).click();
    }

    // guidon and moyeu sections
    let guidon_fields = document.querySelectorAll("#guidon select");
    let moyeu_fields = document.querySelectorAll("#moyeulibre select");
    selector_answers.map(i => moyeu_fields[i - 1].selectedIndex = guidon_fields[i - 1].selectedIndex = i);

    // roue section
    let roue_fields = document.querySelectorAll("#roue input");
    roue_answers.map((e, i) => roue_fields[i].value = e[0]);

    // gently scroll to top of window
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetDisplay() {
    // hide mark - Oh, bye mark
    document.getElementById("results").innerHTML = "";
    // hide correction button
    document.getElementById("correction").hidden = true;
}
