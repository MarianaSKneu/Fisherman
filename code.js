const boat = document.getElementById('Boat');
const gameBorder = document.getElementById('GameBorder');

let boatX = gameBorder.offsetWidth / 2 - boat.offsetWidth / 2;

const speed = 50;
const minX = 0;
const maxX = gameBorder.offsetWidth - boat.offsetWidth;

// moving the boat
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case "ArrowLeft" || event.key.toLowerCase() == 'a':
            boatX -=speed;
            console.log('left');
            break;
            
        case "ArrowRight" || event.key.toLowerCase() == 'd':
            boatX += speed;
            console.log('r');
            break;
    }

    if (boatX < minX) boatX = minX;
    if (boatX > maxX) boatX = maxX;
    boat.style.left = boatX + 'px';
});


// print() - відкриває принтер XD