/** 
* Helper function to prepend a 0 to single digit numbers.
* @summary Adapt a nuber to a desired length if it has less digits by prepending 0s to it.
* @param {int} num - The number to adapat.
* @param {int} len=2 - The desired length.
* @return {int} The adapted number.
*/
function n(num, len = 2) {
    return `${num}`.padStart(len, '0');
}


/** 
* Turning pages by clicking buttons.
* @summary Allow the user to navigate between pages by simplify clicking on two buttons.
* @param {String} direction - Either 'left' or 'right.
*   Defined by which button has been pressed and determining the which page to turn.
*/
function turn(direction) {
    const page = document.getElementById("page_content");

    // regex to match file and their extension separatly
    // work with files path containing multiple dots or appendices starting with '?' or '#'
    const myRegexp = new RegExp(/(\d{2})(\.[^.]*?)(?=\?|#|$)/);

    // apply this regex to our source file
    const extension = page.src.match(myRegexp);

    let nextIndex;
    if (direction == "left") {
        // reverse modulo for 27 frames, used for going from frame 1 to frame 27
        nextIndex = ((+extension[1] - 2) + 27) % 27 + 1;
    } else {
        // modulo for 27 frames, used for going from frame 27 to frame 1
        nextIndex = (+extension[1] + 1) % 27;
    }

    // determine the source file of next page by updating the regex with the new file index
    let nextPage = page.src.replace(myRegexp, "") + n(nextIndex) + extension[2];

    // update image and page number
    page.src = nextPage;
    document.getElementById("page_number").innerText = `${nextIndex}/27`;
}


/** --DEPRECATED--
* Turning pages by simply clicking on the image.
* @summary Allow the user to navigate between pages by simplify clicking on the left or right side of the image.
*   This function is now obselete and has been replaced by buttons.
* @param {click} event - Position of the click in the image.
*/

document.getElementById("page_content").addEventListener('click', function (event) {
    // get source file
    const source = this.src;

    // regex to match file and their extension separatly
    // work with files path containing multiple dots or appendices starting with '?' or '#'
    const myRegexp = new RegExp(/(\d{2})(\.[^.]*?)(?=\?|#|$)/);


    // apply this regex to our source file
    const extension = source.match(myRegexp);

    // get horizontal position of click on image
    const coords = this.getBoundingClientRect();
    const xPos = event.pageX - coords.left;

    let nextIndex;
    if ((coords.width / 2) >= xPos) {
        // reverse modulo for 27 frames, used for going from frame 1 to frame 27
        nextIndex = ((+extension[1] - 2) + 27) % 27 + 1;
    } else {
        // modulo for 27 frames, used for going from frame 27 to frame 1
        nextIndex = (+extension[1] + 1) % 27;
    }

    // determine the source file of next page by updating the regex with the new file index
    let nextPage = source.replace(myRegexp, "") + n(nextIndex) + extension[2];

    // update image and page number
    this.src = nextPage;
    document.getElementById("page_number").innerText = `${nextIndex}/27`;
});

