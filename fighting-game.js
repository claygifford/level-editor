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

async function begin() {
  then = window.performance.now();
  await createImages();

  setMap(defaultMap());
  
  draw();
  animate();
}

function draw() {
  map.begin();
}

function setScale() {
  draw();
  updateInformation();
}

begin();
