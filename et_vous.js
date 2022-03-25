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

    vous = Array.from(document.querySelectorAll("[name=vous]:checked"), e => e.value)
    // Question 2    
    if (vous.includes("sport")) {
	score += 5;
    }
    if (vous.includes("trans")) {
	score += 5;
    }
    if (vous.includes("vie")) {
	score += 100;
    }
    if (vous.includes("bobo")) {
	score -= 10;
    }

    // Question 3
    paris = Array.from(document.querySelectorAll("[name=paris]:checked"), e => e.value);
    if (paris.includes("heres")) {
	score -=10;
    }
    if (paris.includes("velib")) {
	score += 5;
    }
    if (paris.includes("balad")) {
	score += 5;
    }
    if (paris.includes("tout")){
	score +=100;
    }

    //Question 4
    if(form["repar"].value === "jam") {
	score -= 10;
    } else if (form["repar"].value === "tout") {
	score += 10;
    } else if (form["repar"].value ==="bloc") {
	score += 100;
    }

    //Question 5
    auto = Array.from(document.querySelectorAll("[name=auto]:checked"), e => e.value);
    if (auto.includes("boeu")) {
	score += 5;
    }
    if (auto.includes("assass")) {
	score += 5;
    }
    if (auto.includes("voit")) {
	score -= 5;
    }
    if (auto.includes("4head")) {
	score += 10;
    }

    // Result
    var rep = document.getElementById("rep");
    rep.innerHTML = "<p <style='font-size: 20px'> <strong> Votre résultat </strong> : </p>"; 
    if (score > 100) {
	rep.innerHTML += "<p>Vous êtes un <bold> fou </bold> du vélo! C'est votre vie, et même plus. <br> Faites attention quand même.</p>";
    } else if (score > 40) {
	rep.innerHTML += "<p> Le vélo vous motive beaucoup ! Utilisateur régulier, connaisseur, vous ne le laissez pas vous dominer non plus. </p>";
    } else if (score > 0) {
	rep.innerHTML += "<p> Le vélo ne vous fait ni chaud ni froid. Pourquoi pas de temps en temps, pas de quoi révolutionner votre mobilité non plus. Centriste </p>";
    } else {
	rep.innerHTML+="<p> J'hésite à ban votre IP </p>";
    }

    
}
