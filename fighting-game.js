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

  if (showingStartScreen) {
    showingStartScreen = false;
    map.showCoolFont = false;
    map.showToolbar = true;
    map.clearOverlay();
    setMap(map1);
    draw();
  }

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
  if (event.key === 'Escape') {
    map.clearOverlay();
    setMap(startMenu);
    draw();
  }

  // SECRET BONUS EASTER EGG
  // press m to go to the secret map
  if (event.key === 'm') {
    map.clearOverlay();
    setMap(map2);
    draw();
  }
});

document.addEventListener('wheel', (event) => {
  if (event.deltaY < 0) {
    map.zoomIn();
  } else {
    map.zoomOut();
  }
  map.setScale();
  map.clearOverlay();
  draw();
});

function setBoxSize() {
  let box = Math.min(window.innerWidth, window.innerHeight);
  //box = box < 640 ? 640 : box;
  box = 640;
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

var showingStartScreen = true;
async function begin() {
  setBoxSize();

  then = window.performance.now();
  await createImages();

  setMap(startMenu);

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
