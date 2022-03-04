document.getElementById("page").addEventListener('click', function (event) {
    const source = this.src;
    const myRegexp = new RegExp(/(\d{2})(\.[^.]*?)(?=\?|#|$)/);
    const extension = source.match(myRegexp);

    const coords = this.getBoundingClientRect();
    const xPos = event.pageX - coords.left;

    let nextIndex = +extension[1];
    if ((coords.width / 2) >= xPos && extension[1] > 1) {
        nextIndex--;
    } else if ((coords.width / 2) < xPos && extension[1] < 27) {
        nextIndex++;
    }

    let nextPage = source.replace(myRegexp, "") + n(nextIndex) + extension[2];
    this.src = nextPage;
});

function n(num, len = 2) {
    return `${num}`.padStart(len, '0');
}
