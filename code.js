// BOAT
const boat = document.getElementById('Boat');
const gameBorder = document.getElementById('GameBorder');

let t = 0;
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

const speedHook= 3;
//const STEP_MS = 20; 
const PAUSE_AT_BOTTOM_MS = 1000;

// the less number - the more speed
const STEP_MS_HOOK = 18; 
const STEP_MS_Fish = 20; 
// hook is not moving - space - hook starts moving down
// hook is moving - the boat is not
// (space again - hook goes up)
// hook goes to the bottom - hits bottom, pause - goes up 

// hook movement and catching fish logic
let isHookMoving = false;
let hookCapacity = 1;
let caughtFish = null;

const HOOK_CATCH_DISTANCE = 50;
let score = 0;

const scoreEl = document.querySelector('#Score span');


document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' || event.code === 'ArrowDown') event.preventDefault();
    // dont scroll page
    // moving the boat
    // works only when the hook is not down and notebook is not down
    if (!isHookMoving && !notebookDown) {
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
    
    // for the notebook buttons left/right to get fish info
    else if(notebookDown) {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            btnLeft.click(); // trigger same logic as button
        } 
        else if (event.key === 'ArrowRight') {
            event.preventDefault();
            btnRight.click();
        }
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


    const hookDownInterval = setInterval(() => {
        hookY -= speedHook;
        hookwireY -= speedHook;
        hookwireHeight += speedHook;

        if (hookY <= bottomHookBottom) hookY = bottomHookBottom;

        hook.style.bottom = hookY + 'px';
        hookwire.style.bottom = hookwireY + 'px';
        hookwire.style.height = hookwireHeight + 'px';
        
        // checks if the value is anything or null
        // if null - check fishes
        if(!caughtFish) catchFish(fishes);


        // hits a bottom - wait - start go up
        if (hookY <= bottomHookBottom) {
            clearInterval(hookDownInterval);
            setTimeout(startHookUp, PAUSE_AT_BOTTOM_MS)   
        }

        // if hook has caught the fisch - stop movement and go up
        if(caughtFish){
            clearInterval(hookDownInterval);
            startHookUp();
        }
       
    }, STEP_MS_HOOK);
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

        if(caughtFish) {
            hookX = parseFloat(window.getComputedStyle(hook).left);
            caughtFish.style.left = (hookX + hook.offsetWidth/2 - caughtFish.offsetWidth/2) + 'px';
            caughtFish.style.bottom = (hookY - caughtFish.offsetHeight/5) + 'px';
        }

        if (hookY >= topHookBottom){
            clearInterval(hookUpInterval);
            isHookMoving = false;

            if(caughtFish){
                // went to the top - remove fish from dom
                caughtFish.remove();
                // remove from array - create new array , where elements are all but the caught fish
                fishes = fishes.filter(f => f !== caughtFish);
                caughtFish = null;

                score++;
                scoreEl.textContent = score;

                // create new fish
                const newFish = createFish(fishIndex);
                fishes.push(newFish);
                setTimeout(() => swimIntoBorder(newFish), 300);
            }
        }
    }, STEP_MS_HOOK);
}

// The getBoundingClientRect() method returns a DOMRect object with eight properties: 
// left, top, right, bottom, x, y, width, height.
// this works with the whole window
// to make it just a gameBorder pixels - need to use
// const gameRect = gameBorder.getBoundingClientRect();
// to get needed element
// element.left - gameborder.left

// hookProperties = hook.getBoundingClientRect();
//console.log(hookProperties);  --> 
/* DOMRect { x: 681.1666870117188, y: 131.39999389648438, width: 30, height: 50, top: 131.39999389648438, right: 711.1666870117188, bottom: 181.39999389648438, left: 681.1666870117188 } */

// x = left, y = top

// get return 'undefined' when the element is not in the dom


// when hookCenter is around 20px near fishCenter - the fish is caught
// then the hook goes up with the fish (startHookUp with the fish)
// when reaching the boat - the TopHookBottom - the fish dissapears and score+1
// create new fish

// fish goes on the hook
// the hook can only hold 1 fish
// if another fish comes close and hook has already 1 fish caught - ignore it

function catchFish(fishes){
    if (caughtFish) return;

    const gameRect = gameBorder.getBoundingClientRect();

    const hookProperties = hook.getBoundingClientRect();
    // center = (x + width/2 ; y + height/2)
    const hookCenterX = hookProperties.x + hookProperties.width / 2 - gameRect.left;
    const hookCenterY = hookProperties.y + hookProperties.height / 2 - gameRect.top;

    fishes.forEach(fish => {

        const fishProperties = fish.getBoundingClientRect();
        const fishCenterX = fishProperties.x + fishProperties.width / 2 - gameRect.left;
        const fishCenterY = fishProperties.y + fishProperties.height / 2 - gameRect.top;

        const distanceX = hookCenterX - fishCenterX;
        const distanceY = hookCenterY - fishCenterY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        // distanceX * distanceX  is not the same as distanceX^2
    
        console.log(`distance to ${fish.id}:  ${distance}` )
        // if fish is near - fish is caught

        if (distance < HOOK_CATCH_DISTANCE){
            fish.isCaught = true;
            caughtFish = fish;

            // align fish to hook
            const hookX = parseFloat(window.getComputedStyle(hook).left);
            const hookY = parseFloat(window.getComputedStyle(hook).bottom);
            fish.style.left = (hookX + hook.offsetWidth/2 - fish.offsetWidth/2) + 'px';
            fish.style.bottom = (hookY - fish.offsetHeight/2) + 'px';
        }
    }) 
}



// ///////////////////////////////////////////////////////
//  FISH
// ///////////////////////////////////////////////////////

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

// flip the fish image when moving left so it "faces" the movement direction
function setFishFlip(direction, fish) {
    // direction: -1 left, 1 right
    fish.style.transform = (direction === 1) ? 'scaleX(1)' : 'scaleX(-1)';
}


// when the page is started - pick any 5 fishes from images folder
// asign any y value
// fish start swimming to game border


const numberOfFishes = 5;

const water = document.getElementById('Water');

let fishImageFiles = [];

function createFish(index){
    fishIndex ++;

    let imgIndex = Math.floor(Math.random() * fishImageFiles.length);
    let imgName = fishImageFiles[imgIndex];
    let bottomValue = Math.floor(Math.random() * 60);

    const fish = document.createElement('img')

    fish.src = 'images/fishesImgs/' + imgName;
    fish.alt = 'fish' + (index + 1);
    fish.classList.add('fish');
    fish.id = 'Fish' + (index + 1);
    fish.style.bottom = bottomValue + '%';
    fish.isCaught = false;

    water.appendChild(fish);
    fishes.push(fish);
    return fish;
}


// swimming of the fishes in the water

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
    }, STEP_MS_Fish);

}




// swim into botder then start swimLocalFish
function swimIntoBorder(fish){
    let fishX = -fish.offsetWidth - Math.round(Math.random() * 200);
    fish.style.left = fishX + 'px';
    setFishFlip(1, fish); // face right when entering

    // firstly swin to this point
    fish.style.visibility = 'visible';
    const entryX = Math.round(gameBorder.offsetWidth * 0.10) + Math.round(Math.random() * 40); // small random offset

    const swimIntoBorderInterval = setInterval( () => {
        /*
        if (fish.isCaught) {
            clearInterval(swimInterval);
            return;
        }
        */
       
        // fishX = parseFloat(window.getComputedStyle(fish).left);
        fishX +=speedFish;
        fish.style.left = fishX + "px";
        //fish.style.visibility = 'visible';

        if(fishX >= entryX){
            clearInterval(swimIntoBorderInterval);
            setTimeout(() => swimLocalFish(fish), PAUSE_MS);
        }
    
    }, STEP_MS_Fish);

}


let fishes = [];
let fishIndex = 0;

let dataAboutFishes = [];

// function to get data about the fishes for images and notebook
async function getFishData() {
    try {
        const response = await fetch('fishesData.json');
        const data = await response.json();       
        return data;
    }
    catch (error) {
        console.log('An error happened. Cant access data.')
    }

}

// firstly get all data
getFishData().then((data) =>{
    dataAboutFishes = data;

    createFirstFishes();

    // and fill in notebook
    fillNotebook(IndexDataAbout);
})

function createFirstFishes(){
    // if data exist
    if (dataAboutFishes){
        // then asign the images to the fishImageFiles[]
        dataAboutFishes.forEach(item =>{
            fishImageFiles.push(item.imageFile);
        })

        // loop that creates the first fishes
        for(let i = 0; i < numberOfFishes; i++){
            const fish = createFish(i);

            setTimeout(() => swimIntoBorder(fish), 190 * (1 + i))
        }
    }

}





//  NOTEBOOK

// when clicking on notebook button - notebook appears from top of the screeen (goes down to visible field)

const notebookBtn = document.createElement('div');
notebookBtn.id ='NotebookButton';

const notebook = document.createElement('div');
notebook.id = 'Notebook';

const notebookImg = document.createElement('img');
notebookImg.src = 'images/Notebook200px.png';
notebookImg.alt = 'notebook';

const notebookImgLight = document.createElement('img');
notebookImgLight.src = 'images/NotebookLight200px.png';
notebookImgLight.alt = 'notebookLight';
notebookImgLight.classList.add('light');

notebookBtn.appendChild(notebookImg);
notebookBtn.appendChild(notebookImgLight);


const shadow = document.createElement('div');
shadow.id = 'Shadow';

// notebook goes down from the top, shadow appears
// notebook goes up - shadow dissapears

let notebookDown = false;

function getNotebook(){
    if (!notebookDown){
        //notebook.style.top = 100 + 'px';
        notebook.style.transform = 'translateY(600px)'
        notebookDown = true;
        shadow.classList.add('visible');
    }

    else if (notebookDown){
        //notebook.style.top = -1200 + 'px';
        notebook.style.transform = 'translateY(-600px)'
        notebookDown = false;
        shadow.classList.remove('visible');
    }
    
}

// notebook loops / rings (decor) to the left
const notebookLoops = document.createElement('div');
notebookLoops.classList.add('notebookLoops');
let numberOfLopps = 3;

for (let i=0; i<numberOfLopps; i++){
    const loop = document.createElement('div');
    loop.id = 'loop' + (i+1);
    loop.style.width = '60px';
    loop.style.height = '25px';
    loop.style.backgroundColor = 'rgb(101, 98, 98)';
    loop.style.border = '2px solid black';
    loop.style.borderRadius = '8px';

    notebookLoops.appendChild(loop);
}

// the layout of the notebook
notebook.innerHTML = `
    <h1>Journal</h1>
    <div id='fishImg'><img id="fishImageHere" src="" alt="fish image"></img></div>
    <button id='btnleftArrow'>&lt;</button>
    <button id='btnRightArrow'>&gt;</button>
    <h2 id='h2nameFish'>Name fish </h2>
    <p id='fishDecriptionP'>fish text </p>
`
notebook.appendChild(notebookLoops);

notebookBtn.addEventListener('click', getNotebook);
// clickong on the shadow = clicking on the notebookButton
shadow.addEventListener('click', getNotebook);

gameBorder.appendChild(notebookBtn);
gameBorder.appendChild(notebook);
gameBorder.appendChild(shadow);


// get inforamtion about the fishes
// dataAboutFishes[]
// for now have only 4 fishes types
const btnLeft = document.getElementById('btnleftArrow');
const btnRight = document.getElementById('btnRightArrow');
/*const fishImgBox = document.getElementById('fishImg');*/
const h2name = document.getElementById('h2nameFish');
const pDesc = document.getElementById('fishDecriptionP');

const fishImgNotebook = document.getElementById('fishImageHere');


let IndexDataAbout = 0;

btnLeft.addEventListener('click', () =>{
    IndexDataAbout = IndexDataAbout - 1;
    fillNotebook(IndexDataAbout);
})

btnRight.addEventListener('click', () =>{
    IndexDataAbout = IndexDataAbout + 1;
    fillNotebook(IndexDataAbout);
})

function fillNotebook(index){
    if (!dataAboutFishes) {
        fishImgNotebook.src = '';
        h2name.textContent = 'No data';
        pDesc.textContent = '';
        return
    };
    const maxIndexNumber = dataAboutFishes.length;

    if (maxIndexNumber == 0) {
        fishImgNotebook.src = '';
        h2name.textContent = 'No data';
        pDesc.textContent = '';
        return;
    }

    else if (index < 0) {
        IndexDataAbout = maxIndexNumber - 1
    }
    else if (index >= maxIndexNumber) {
        IndexDataAbout = 0;
    }

    const fishInfo = dataAboutFishes[IndexDataAbout];

    fishImgNotebook.src = `images/fishesImgs/${fishInfo.imageFile}`;
    h2name.textContent = `${fishInfo.name}`;
    pDesc.textContent = `${fishInfo.text}`;
}

/*
const len = dataAboutFishes.length;
  if (len === 0) {
    // optional: clear UI / show placeholder
    if (fishImgImg) fishImgImg.src = '';
    h2name.textContent = 'No data';
    pDesc.textContent = '';
    return;
  }

*/ 

// fill in notebook firstly with first fish info
// in the getData().then
// so after the data has been loaded


// CONTROLLS
// fade away after 10 s = 10 000 miliseconds
setTimeout(() => {
  const controls = document.getElementById('Controlls');
  controls.classList.add('hidden');
}, 10000); 

