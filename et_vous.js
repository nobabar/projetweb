function calculate_score() {
    form = document.formulaire;
    let score = 0;

    // Question 1
    if (form["user_util"].value === "Jamais") {
	score -= 10;
    } else if (form["user_util"].value === "Une fois par an") {
	score -= 5;
    } else if (form["user_util"].value === "Une fois par jour") {
	score += 10;
    } else if (form["user_util"].value === "Je télétravaille depuis ma selle") {
	score += 100;
    }

    console.log(score);
    vous = Array.from(document.querySelectorAll("[name=vous]:checked"), e => e.value)
    // Question 2    
    if (vous[0]) {
	score += 5;
    }
    if (vous[1]) {
	score += 5;
    }
    if (vous[2]) {
	score += 100;
    }
    if (vous[3]) {
	score -= 10;
    }
    console.log(score);

    // Question 3
    if (form["user_paris"].value === "Une hérésie") {
	score -=10;
    }
    if (form["user_paris"].value === "Le vélib") {
	score += 5;
    }
    if (form["user_paris"].value === "Pour se balader le weekend") {
	score += 5;
    }
    if (form["user_paris"].value === "Pour tout"){
	score +=100;
    }
    console.log(score);

    //Question 4
    repar = Array.from(document.querySelectorAll("[name=repar]:checked"), e => e.value)
    if(repar[0]) {
	score -= 10;
    } else if (repar[2]) {
	score += 10;
    } else if (repar[3]) {
	score += 100;
    }
    console.log(score);

    //Question 5
    auto = Array.from(document.querySelectorAll("[name=repar]:checked"), e => e.value)
    if (auto[0]) {
	score += 5;
    }
    if (auto[1]) {
	score += 5;
    }
    if (auto[2]) {
	score -= 5;
    }
    if (auto[3]) {
	score += 10;
    }
    console.log(score);
}
