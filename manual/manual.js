/*
document.getElementById("page_content").addEventListener('click', function (event) {
    const source = this.src;
    const myRegexp = new RegExp(/(\d{2})(\.[^.]*?)(?=\?|#|$)/);
    const extension = source.match(myRegexp);

    const coords = this.getBoundingClientRect();
    const xPos = event.pageX - coords.left;

    let nextIndex;
    if ((coords.width / 2) >= xPos) {
        nextIndex = ((+extension[1] - 2) + 27) % 27 + 1;
    } else {
        nextIndex = (+extension[1] + 1) % 27;
    }

    let nextPage = source.replace(myRegexp, "") + n(nextIndex) + extension[2];
    this.src = nextPage;
});
*/

function turn(direction) {
    const page = document.getElementById("page_content");
    const myRegexp = new RegExp(/(\d{2})(\.[^.]*?)(?=\?|#|$)/);
    const extension = page.src.match(myRegexp);

    let nextIndex;
    if (direction == "left") {
        nextIndex = ((+extension[1] - 2) + 27) % 27 + 1;
    } else {
        nextIndex = (+extension[1] + 1) % 27;
    }

    let nextPage = page.src.replace(myRegexp, "") + n(nextIndex) + extension[2];

    page.src = nextPage;
    document.getElementById("page_number").innerText = `${nextIndex}/27`
}

function n(num, len = 2) {
    return `${num}`.padStart(len, '0');
}
