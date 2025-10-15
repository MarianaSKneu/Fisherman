// BOAT
const boat = document.getElementById('Boat');
const gameBorder = document.getElementById('GameBorder');

let boatX = gameBorder.offsetWidth / 2 - boat.offsetWidth / 2;

const speedBoat = 20;
const minX = 0;
const maxXBoat = gameBorder.offsetWidth - boat.offsetWidth;

const hook = document.getElementById('Hook');
const hookwire = document.getElementById('HookWire');

const topHookBottom = parseFloat(window.getComputedStyle(hook).bottom);
const bottomHookBottom = 0;

let hookY = topHookBottom;
let hookX = parseFloat(window.getComputedStyle(hook).left);

let hookwireY = parseFloat(window.getComputedStyle(hookwire).bottom);
let hookwireX = parseFloat(window.getComputedStyle(hookwire).left);
let hookwireHeight = parseFloat(hookwire.offsetHeight);

const minHookLeft = hook.offsetLeft - boat.offsetLeft ;
const maxHookLeft = maxXBoat + hook.offsetWidth;

let isHookMoving = false;

const speedHook= 3;
const STEP_MS = 20; 
const PAUSE_AT_BOTTOM_MS = 1500;

// hook is not moving - space - hook starts moving down
// hook is moving - the boat is not
// (space again - hook goes up)
// hook goes to the bottom - hits bottom, pause - goes up 


document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' || event.code === 'ArrowDown') event.preventDefault();
    // dont scroll page
    // moving the boat
    if (!isHookMoving) {
        // normalize key to lowercase to handle 'A' vs 'a'
        const k = (event.key || '').toLowerCase();
        if (k === 'arrowleft' || k === 'a') {
            boatX -= speedBoat;
            hookX -= speedBoat;
            hookwireX -=speedBoat;
            if (boatX < minX) boatX = minX;
            if (hookX < minHookLeft) {hookX = minHookLeft; hookwireX = minHookLeft;}

        } else if (k === 'arrowright' || k === 'd') {
            boatX += speedBoat;
            hookX += speedBoat;
            hookwireX += speedBoat;
            if (boatX > maxXBoat) boatX = maxXBoat;
            if(hookX > maxHookLeft) {hookX = maxHookLeft; hookwireX = maxHookLeft;}
        }

        boat.style.left = boatX + 'px';
        hook.style.left = hookX + 'px';
        hookwire.style.left = hookwireX + 'px';
    }
    
    // hook
    // moves when hitting space
    if (event.code === 'Space' || event.code === 'ArrowDown') {
        // only start a new cycle if hook isn't already moving
        if (!isHookMoving) startHookDown();
    }
});

// hook is moving down
function startHookDown(){
    isHookMoving = true;

    hookY = parseFloat(window.getComputedStyle(hook).bottom);
    hookwireY = parseFloat(window.getComputedStyle(hookwire).bottom)
    hookwireHeight = parseFloat(hookwire.offsetHeight);

//    console.log(hookwireHeight + ' ' + hookwireY);

    const hookDownInterval = setInterval(() => {
        hookY -= speedHook;
        hookwireY -= speedHook;
        hookwireHeight += speedHook;

        if (hookY <= bottomHookBottom) hookY = bottomHookBottom;

        hook.style.bottom = hookY + 'px';
        hookwire.style.bottom = hookwireY + 'px';
        hookwire.style.height = hookwireHeight + 'px';

        // hits a bottom - wait - start go up
        if (hookY <= bottomHookBottom) {
            clearInterval(hookDownInterval);
            setTimeout(startHookUp, PAUSE_AT_BOTTOM_MS)   
        }
       
    }, STEP_MS);
}

// hook is going up
function startHookUp(){
    hookY = parseFloat(window.getComputedStyle(hook).bottom);
    hookwireY = parseFloat(window.getComputedStyle(hookwire).bottom);
    hookwireHeight = parseFloat(hookwire.offsetHeight);

    const hookUpInterval = setInterval(() => {
        hookY += speedHook;
        hookwireY += speedHook;
        hookwireHeight -= speedHook;

        if(hookY >= topHookBottom) hookY = topHookBottom;

        hook.style.bottom = hookY + 'px';
        hookwire.style.bottom = hookwireY + 'px';
        hookwire.style.height = hookwireHeight + 'px';

        if (hookY >= topHookBottom){
            clearInterval(hookUpInterval);
            isHookMoving = false;
        }
    }, STEP_MS);
}




//  FISH

// 1. pick direction
// 2. calculate distance
// 3. swim
// 4. wait
// 5. repeat



// min X values for fish
const minXF = 0;

const speedFish = 3;
const minDistance = 300;
const PAUSE_MS = 1400;   // wait between moves
//const STEP_MS = 20;      // how often we update fish position



// flip the fish image when moving left so it "faces" the movement direction
function setFishFlip(direction, fish) {
    // direction: -1 left, 1 right
    fish.style.transform = (direction === 1) ? 'scaleX(1)' : 'scaleX(-1)';
}


// when the page is started - pick any 5 fishes from images folder
// asign any y value
// fish start swimming to game border

// when fish is caught = number of fiches -1
// pick any fish from images, fish starts swimming into game border


const numberOfFishes = 5;

const water = document.getElementById('Water');

const fishImageFiles = [
    'Fish200px.png',
    'Fishv4-200px.png',
    'Fishv5-200px.png',
    'Fishv6-200px.png'
];

function createFish(index){

    let imgIndex = Math.floor(Math.random() * fishImageFiles.length);
    let imgName = fishImageFiles[imgIndex];
    let bottomValue = Math.floor(Math.random() * 60);

    const fish = document.createElement('img')

    fish.src = 'images/fishesImgs/' + imgName;
    fish.classList.add('fish');
    fish.id = 'Fish' + (index + 1);
    fish.style.bottom = bottomValue + '%';
    fish.isCaught = false;

    water.appendChild(fish);

    return fish;
}


// swimming of the fishes in the water
/*
    const maxXF = gameBorder.offsetWidth - fish.offsetWidth;
    let fishX = parseFloat(fish.style.left);
    console.log('fishX : ' + fishX);

*/ 

function swimLocalFish(fish){
    const maxXF = gameBorder.offsetWidth - fish.offsetWidth;
    let fishX = parseFloat(fish.style.left);

    let direction = Math.random() < 0.5 ? -1 : 1; // -1 = left, +1 = right
    let maxTravel = direction === 1 ? (maxXF - fishX) : (fishX - minXF) ;
    if (maxTravel < minDistance) direction =  -direction;

    setFishFlip(direction, fish);

    let distance = minDistance + Math.random() * (maxXF - minDistance);

    // target position (future position)
    let targetX = Math.max(minXF, Math.min(maxXF, fishX + direction * distance));

    const swimInterval = setInterval(()=>{

        if (fish.isCaught) {
            clearInterval(swimInterval);
            return;
        }

        // move closer to target
        if (direction === 1 && fishX < targetX) {
            fishX += speedFish;
            if (fishX > targetX) fishX = targetX;
        } else if (direction === -1 && fishX > targetX) {
            fishX -= speedFish;
            if (fishX < targetX) fishX = targetX;
        }

        fish.style.left = fishX + "px";

        // check if arrived
        if (fishX === targetX) {
            clearInterval(swimInterval);
            setTimeout(() => swimLocalFish(fish), PAUSE_MS); // wait, then swim again
        }
    }, STEP_MS);

}




// swim into botder then start swimLocalFish
function swimIntoBorder(fish){
    let fishX = -fish.offsetWidth - Math.round(Math.random() * 200);
    fish.style.left = fishX + 'px';
    setFishFlip(1, fish); // face right when entering

    // firstly swin to this point
    
    const entryX = Math.round(gameBorder.offsetWidth * 0.10) + Math.round(Math.random() * 40); // small random offset

    const swimIntoBorderInterval = setInterval( () => {
        
        if (fish.isCaught) {
            clearInterval(swimInterval);
            return;
        }

        // fishX = parseFloat(window.getComputedStyle(fish).left);
        fishX +=speedFish;
        fish.style.left = fishX + "px";
        fish.style.visibility = 'visible';

        if(fishX >= entryX){
            clearInterval(swimIntoBorderInterval);
            setTimeout(() => swimLocalFish(fish), PAUSE_MS);
        }
    
    }, STEP_MS);

}

let fishes = [];

for(let i = 0; i < numberOfFishes; i++){
    const fish = createFish(i);
    fishes.push(fish);

    setTimeout(() => swimIntoBorder(fish), 190 * (1 + i))
}






//  NOTEBOOK

// when clicking on notebook button - notebook appears from top of the screeen (goes down to visible field)
const notebookBtn = document.getElementById('NotebookButton');
const notebook = document.getElementById('Notebook');
const shadow = document.getElementById('Shadow');

let notebookDown = false;

function getNotebook(){
    if (!notebookDown){
        notebook.style.top = 200 + 'px';
        notebookDown = true;
        shadow.style.visibility = 'visible';    
        shadow.style.backgroundColor = ' rgba(0, 0, 0, 0.223)';
        shadow.style.zIndex = 9
    }

    else if (notebookDown){
        notebook.style.top = -1200 + 'px';
        notebookDown = false;
        shadow.style.visibility = 'hidden';
        shadow.style.backgroundColor = ' rgba(0, 0, 0, 0)';
        shadow.style.zIndex = -10
    }
    
}




// CONTROLLS
// fade away after 10 s = 10 000 miliseconds
setTimeout(() => {
  const controls = document.getElementById('Controlls');
  controls.classList.add('hidden');
}, 10000); 

