var mouseX, mouseY;
var running = true;
var keys = {};
var isdragging = false;
var pos = {};

overlayCanvas.addEventListener('mousemove', (event) => {
  mouseX = event.offsetX;
  mouseY = event.offsetY;
});

overlayCanvas.addEventListener('mousedown', (event) => {
  isdragging = true;
});

overlayCanvas.addEventListener('mouseup', (event) => {
  isdragging = false;
});

document.addEventListener('keydown', (event) => {
  keys[event.key] = true;
});

document.addEventListener('keyup', (event) => {
  delete keys[event.key];
  if (event.key === '1') {
    character.rightHand = character.rightHand
      ? undefined
      : weaponsLookup['sword'];
  }
  if (event.key === '2') {
    character.leftHand = character.leftHand
      ? undefined
      : weaponsLookup['shield'];
  }
});

function setBoxSize() {
  let box = Math.min(window.innerWidth, window.innerHeight);
  //box = box < 640 ? 640 : box;
  box = 1280;
  gameCanvas.height = box;
  gameCanvas.width = box;
  gameCtx.imageSmoothingEnabled = false;
  structuresCanvas.height = box;
  structuresCanvas.width = box;
  structuresCtx.imageSmoothingEnabled = false;
  resourcesCanvas.height = box;
  resourcesCanvas.width = box;
  resourcesCtx.imageSmoothingEnabled = false;
  characterCanvas.height = box;
  characterCanvas.width = box;
  characterCtx.imageSmoothingEnabled = false;
  overlayCanvas.height = box;
  overlayCanvas.width = box;
  overlayCtx.imageSmoothingEnabled = false;
  map.setTransforms();
}

window.addEventListener('resize', function (event) {
  setBoxSize();
});

async function begin() {
  setBoxSize();
  
  then = window.performance.now();
  await createImages();

  setMap(defaultMap());  
  
  draw();
  animate();
}

function draw() {
  map.setTransforms();
  map.begin();
}

function setScale() {
  draw();
  updateInformation();
}

begin();
