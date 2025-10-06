// BOAT
const boat = document.getElementById('Boat');
const gameBorder = document.getElementById('GameBorder');

let boatX = gameBorder.offsetWidth / 2 - boat.offsetWidth / 2;

const speedBoat = 20;
const minX = 0;
const maxXBoat = gameBorder.offsetWidth - boat.offsetWidth;


const hook = document.getElementById('Hook');
const hookwire = document.getElementById('HookWire');
const water = document.getElementById('Water');

const topHookBottom = parseFloat(window.getComputedStyle(hook).bottom);
const bottomHookBottom = 0;

let hookY = topHookBottom;
//let minHookBottom = 0;
//let maxHookBottom = water.offsetHeight - 30;

let isHookMoving = false;

const speedHook= 3;
const STEP_MS = 20; 
const PAUSE_AT_BOTTOM_MS = 1500;

// hook is not moving - space - hook starts moving down
// hook is moving - the boat is not
// (space again - hook goes up)
// hook goes to the bottom - hits bottom, pause - goes up 


document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') event.preventDefault();
    
    // moving the boat
    if (!isHookMoving) {
        // normalize key to lowercase to handle 'A' vs 'a'
        const k = (event.key || '').toLowerCase();
        if (k === 'arrowleft' || k === 'a') {
            boatX -= speedBoat;
        } else if (k === 'arrowright' || k === 'd') {
            boatX += speedBoat;
        }

        if (boatX < minX) boatX = minX;
        if (boatX > maxXBoat) boatX = maxXBoat;
        boat.style.left = boatX + 'px';
    }
    
    // hook
    if (event.code === 'Space') {
        // only start a new cycle if hook isn't already moving
        if (!isHookMoving) startHookDown();
    }
});

function startHookDown(){
    isHookMoving = true;

    hookY = parseFloat(window.getComputedStyle(hook).bottom);

    const hookDownInterval = setInterval(() => {
        hookY -= speedHook;

        if (hookY <= bottomHookBottom) hookY = bottomHookBottom;

        hook.style.bottom = hookY + 'px';

        if (hookY <= bottomHookBottom) {
            clearInterval(hookDownInterval);
            setTimeout(startHookUp, PAUSE_AT_BOTTOM_MS)   
        }
       
    }, STEP_MS);
}

function startHookUp(){
    hookY = parseFloat(window.getComputedStyle(hook).bottom);

    const hookUpInterval = setInterval(() => {
        hookY += speedHook;

        if(hookY >= topHookBottom) hookY = topHookBottom;
        hook.style.bottom = hookY + 'px';

        if (hookY >= topHookBottom){
            clearInterval(hookUpInterval);
            isHookMoving = false;
        }
    }, STEP_MS);
}




//  FISH

// 1. direction
// 2. distance
// 3. swim
// 4. wait
// 5. repeat

// const maxXF = gameBorder.offsetWidth - fish1.offsetWidth;
const speedFish1 = 3;
const minXF = 0;


const minDistance = 300;
const PAUSE_MS = 1400;   // wait between moves
//const STEP_MS = 20;      // how often we update fish position

// flip the fish image when moving left so it "faces" the movement direction
function setFishFlip(direction, fish) {
    // direction: -1 left, 1 right
    fish.style.transform = (direction === 1) ? 'scaleX(1)' : 'scaleX(-1)';
}
/*
// fish movement
function swimFish(fish) {
    direction = chooseDirection();

    // 2. choose some distance
    // distance = any number within the border

    setFishFlip(direction, fish)

    let distance = minDistance + Math.random() * (maxXF - minDistance);

    // target position (future position)
    let targetX = Math.max(minXF, Math.min(maxX, fish1X + direction * distance));

    // 3. swim 
    const swimInterval = setInterval(() => {
            if (fish.isCaught) {
                clearInterval(swimInterval); // stop swimming if caught
                return;
            }

            // move closer to target
            if (direction === 1 && fish1X < targetX) {
                fish1X += speedFish1;
                if (fish1X > targetX) fish1X = targetX;
            } else if (direction === -1 && fish1X > targetX) {
                fish1X -= speedFish1;
                if (fish1X < targetX) fish1X = targetX;
            }

            fish.style.visibility = 'visible';
            fish.style.left = fish1X + "px";

            // check if arrived
            if (fish1X === targetX) {
                clearInterval(swimInterval);
                setTimeout(swimFish(fish), PAUSE_MS); // wait, then swim again
            }
        }, STEP_MS);

}
*/
const fishes = document.getElementsByClassName('fish');
// returns an HTML Collection --> need to turn into an array
const fishesArray = Array.from(fishes);

fishesArray.forEach(fish => {
    fish.isCaught = false;
    
    // start out of border
    let fishX = -fish.offsetWidth - Math.round(Math.random() * 200);
    fish.style.left = fishX + 'px';
    
    // then swim to point
    const entryX = Math.round(gameBorder.offsetWidth * 0.20) + Math.round(Math.random() * 40 - 20); // small random offset


    function swimLocalFish(){
        const speedFish1 = 3;
        const minXF = 0;
        const maxXF = gameBorder.offsetWidth - fish.offsetWidth;
        

        let direction = Math.random() < 0.5 ? -1 : 1; // -1 = left, +1 = right
        let maxTravel = direction === 1 ? (maxXF - fishX) : (fishX - minXF) ;
        if (maxTravel < minDistance) direction =  -direction;

        setFishFlip(direction, fish);

        let distance = minDistance + Math.random() * (maxXF - minDistance);

        // target position (future position)
        let targetX = Math.max(minXF, Math.min(maxXF, fishX + direction * distance));

        const swimInterval = setInterval(()=>{
            // move closer to target
            if (direction === 1 && fishX < targetX) {
                fishX += speedFish1;
                if (fishX > targetX) fishX = targetX;
            } else if (direction === -1 && fishX > targetX) {
                fishX -= speedFish1;
                if (fishX < targetX) fishX = targetX;
            }

            fish.style.visibility = 'visible';
            fish.style.left = fishX + "px";

            // check if arrived
            if (fishX === targetX) {
                clearInterval(swimInterval);
                setTimeout(swimLocalFish, PAUSE_MS); // wait, then swim again
            }
        }, STEP_MS);

    }

    // swim into botder then start swimLocalFish

    function swimIntoBorder(){
        fish.style.visibility = 'visible';
        setFishFlip(1, fish); // face right when entering


        const swimIntoBorderInterval = setInterval( () => {
            
            fishX = parseFloat(window.getComputedStyle(fish).left);
            fishX +=speedFish1;
            fish.style.left = fishX + "px";

            if(fishX >= entryX){
                clearInterval(swimIntoBorderInterval);
                setTimeout(swimLocalFish, PAUSE_MS);
            }
        
        }, STEP_MS);

    }

    // start with swimming into the game border
    setTimeout(swimIntoBorder, 190)

});

