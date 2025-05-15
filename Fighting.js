const gameCanvas = document.getElementById('GameCanvas');
const gameCtx = gameCanvas.getContext('2d', { antialias: false });

const resourcesCanvas = document.getElementById('ResourcesCanvas');
const resourcesCtx = resourcesCanvas.getContext('2d', { antialias: false });

const characterCanvas = document.getElementById('CharacterCanvas');
const characterCtx = characterCanvas.getContext('2d', { antialias: false });

const overlayCanvas = document.getElementById('OverlayCanvas');
const overlayCtx = overlayCanvas.getContext('2d', { antialias: false });

var scale = 1;
var tileSize = 16;
const gridSize = gameCanvas.width / tileSize;

var board = [[]];
var resources = [[]];
var selection;
const palletteForest = [];
var mouseX, mouseY;
var running = false;
var keypress = false;
var keys = {};
var then, now, elapsed;
var fpsInterval = 1000 / 60;
var isdragging = false;
var characterAmination;

let box = {
  x: 0,
  y: 0,
  size: 75,
};

var pos = {};

overlayCanvas.addEventListener('mousemove', (event) => {
  mouseX = event.offsetX;
  mouseY = event.offsetY;
  drawMousePosition();
  updateInformation();
});

overlayCanvas.addEventListener('mousedown', (event) => {
  isdragging = true;
  let i = Math.floor(mouseX / tileSize);
  let j = Math.floor(mouseY / tileSize);
  pos = { i, j };
  //   mouseX = event.offsetX;
  //   mouseY = event.offsetY;
  //   drawBox();
});

overlayCanvas.addEventListener('mouseup', (event) => {
  isdragging = false;
  drawBox();
  pos = {};
});

function drawMousePosition() {
  if (!mouseX || !mouseY) return;
  overlayCtx.reset();
  overlayCtx.strokeStyle = 'red';
  let i = Math.floor(mouseX / tileSize);
  let j = Math.floor(mouseY / tileSize);

  //starting point...

  overlayCtx.rect(i * tileSize, j * tileSize, tileSize, tileSize);
  overlayCtx.stroke();
}

function drawBox() {
  let i = Math.floor(mouseX / tileSize);
  let j = Math.floor(mouseY / tileSize);
  if (selection) {
    const maxX = Math.max(pos.i, i);
    const minX = Math.min(pos.i, i);
    const maxY = Math.max(pos.j, j);
    const minY = Math.min(pos.j, j);
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        if (selection.category === 'pallette') {
          board[x][y] = selection.item.img;
        } else if (selection.category === 'resource') {
          resources[x][y] = selection.item.img;
        }
      }
    }
  }
  drawBoard();
  drawResources();
}

document.addEventListener('keydown', (event) => {
  keypress = true;
  keys[event.key] = true;
});

document.addEventListener('keyup', (event) => {
  keypress = false;
  keys[event.key] = false;
});

// Draw the box
function drawBoard() {
  gameCtx.mozImageSmoothingEnabled = false;
  gameCtx.webkitImageSmoothingEnabled = false;
  gameCtx.msImageSmoothingEnabled = false;
  gameCtx.imageSmoothingEnabled = false;

  for (i = 0; i < 50; i++) {
    for (j = 0; j < 50; j++) {
      if (board[i][j]) {
        gameCtx.drawImage(
          board[i][j].img,
          i * tileSize,
          j * tileSize,
          tileSize,
          tileSize
        );
      } else {
      }
    }
  }
}

function spawnAnimation(character) {
  character.ticks++;
  if (character.ticks < 20) return character.spawn[0].img;
  if (character.ticks < 40) return character.spawn[1].img;
  if (character.ticks < 60) return character.spawn[2].img;
  if (character.ticks < 80) return character.spawn[3].img;
}

function runAnimation(character) {
  character.ticks++;
  if (character.ticks < 8) return character.run[0].img;
  if (character.ticks < 16) return character.run[1].img;
  if (character.ticks < 24) return character.run[2].img;
  if (character.ticks < 32) return character.run[3].img;
}

var character = {
  animation: undefined,
  ticks: 0,
  position: {x: 20, y:20},
  size: 32,
  getImage: function() {
    this.ticks++;
    if (this.animation) {
      let img = this.animation(this);
      if (img) return img;
      this.animation = undefined;
      this.ticks = 0;
    }
    if (this.ticks < 10) return this.idle[0].img;
    if (this.ticks < 20) return this.idle[1].img;
    if (this.ticks < 30) return this.idle[2].img;
    if (this.ticks < 40) return this.idle[3].img;    
    this.ticks = 0;
    return this.idle[0].img;
  }
}

function drawCharacter() {

  if (keypress) {
    if (keys['s']){
      character.position.y += 1 / elapsed;
      character.animation = runAnimation;
    }
    if (keys['a']){
      character.position.x -= 1 / elapsed;
      character.animation = runAnimation;
    }
    if (keys['w']) {
      character.position.y -= 1 / elapsed;
      character.animation = runAnimation;
    }
    if (keys['d']) {
      character.position.x += 1 / elapsed;
      character.animation = runAnimation;
    }
  }
    
  characterCtx.reset();
  characterCtx.imageSmoothingEnabled = false;

  let img = character.getImage();

  characterCtx.drawImage(
    img,
    character.position.x * tileSize,
    character.position.y * tileSize,
    character.size * scale,
    character.size * scale
  );
}

function drawResources() {
  resourcesCtx.imageSmoothingEnabled = false;

  for (let i = 0; i < 50; i++) {
    for (let j = 0; j < 50; j++) {
      if (resources[i][j]) {
        resourcesCtx.drawImage(
          resources[i][j].img,
          i * tileSize,
          j * tileSize,
          tileSize,
          tileSize
        );
      } else {
      }
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  if (!running) return;

  // calc elapsed time since last loop
  now = window.performance.now();
  elapsed = now - then;

  // if enough time has elapsed, draw the next frame
  if (elapsed > fpsInterval) {
    then = now - (elapsed % fpsInterval);
    drawCharacter();
  }
}

const loadImage = (src, category, group) => {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => resolve({ img, group, category });
    img.onerror = reject;
    img.src = src;
  });
};

async function createImages() {
  let imageUrls = [];
  let requests = [];
  let characterRequests = [];
  let characterImageUrls = [];

  for (let i = 0; i < 197; i++) {
    let imageUrl = `pallette/forest/forest_${i}.png`;
    requests.push(loadImage(imageUrl, 'pallette', 'general'));
    imageUrls.push(imageUrl);
  }

  for (let i = 0; i < 71; i++) {
    let imageUrl = `pallette/forest/forest_bridge_horizontal_${i}.png`;
    requests.push(loadImage(imageUrl, 'pallette', 'bridge_horizontal'));
    imageUrls.push(imageUrl);
  }

  for (let i = 0; i < 49; i++) {
    let imageUrl = `pallette/forest/forest_bridge_vertical_${i}.png`;
    requests.push(loadImage(imageUrl, 'pallette', 'bridge_vertical'));
    imageUrls.push(imageUrl);
  }

  for (let i = 0; i < 107; i++) {
    let imageUrl = `pallette/forest/forest_fountain_${i}.png`;
    requests.push(loadImage(imageUrl, 'pallette', 'fountain'));
    imageUrls.push(imageUrl);
  }

  for (let i = 0; i < 39; i++) {
    let imageUrl = `pallette/forest/forest_path_${i}.png`;
    requests.push(loadImage(imageUrl, 'pallette', 'path'));
    imageUrls.push(imageUrl);
  }

  for (let i = 0; i < 179; i++) {
    let imageUrl = `resources/forest/forest_fences_and_walls_${i}.png`;
    requests.push(loadImage(imageUrl, 'resource', 'fences_and_walls'));
    imageUrls.push(imageUrl);
  }

  for (let i = 0; i < 119; i++) {
    let imageUrl = `resources/forest/forest_resources_${i}.png`;
    requests.push(loadImage(imageUrl, 'resource', 'resources'));
    imageUrls.push(imageUrl);
  }

  for (let i = 0; i < 79; i++) {
    let imageUrl = `characters/human/male/mplayer_human_${i}.png`;
    characterRequests.push(loadImage(imageUrl, 'character', 'human-male'));
    characterImageUrls.push(imageUrl);
  }

  const images = await Promise.all(requests);
  const characterImages = await Promise.all(characterRequests);
  for (let i = 0; i < images.length; i++) {
    palletteForest.push({ img: images[i], src: imageUrls[i] });
  }

  character.spawn = characterImages.splice(0, 4);
  characterImages.splice(0, 4);
  character.idle = characterImages.splice(0, 4);
  characterImages.splice(0, 4);
  character.run = characterImages.splice(0, 4);
  //const [spawn, ...rest] = characterImages;

  //spawn, idle, run, jump [idle, run], land, roll, turn, hit and death
}

function palleteSelection(item, category) {
  const brushes = document.getElementById('active-brush');
  const container = document.createElement('div');

  let img = new Image();
  img.src = item.src;
  img.width = '128';
  img.height = '128';
  container.appendChild(img);

  brushes.replaceChildren(container);
  selection = { category, item };
}

async function begin() {
  then = window.performance.now();

  await createImages();

  const general = document.getElementById('general');
  const bridge_horizontal = document.getElementById('bridge_horizontal');
  const bridge_vertical = document.getElementById('bridge_vertical');
  const fountain = document.getElementById('fountain');
  const path = document.getElementById('path');
  const fences_and_walls = document.getElementById('fences_and_walls');
  const resources = document.getElementById('resources');
  for (let i = 0; i < palletteForest.length; i++) {
    const { group, category, img } = palletteForest[i].img;
    const container = document.createElement('div');
    container.appendChild(img);
    container.addEventListener('click', () =>
      palleteSelection(palletteForest[i], category)
    );

    if (group === 'general') {
      general.appendChild(container);
    } else if (group === 'path') {
      path.appendChild(container);
    } else if (group === 'bridge_vertical') {
      bridge_vertical.appendChild(container);
    } else if (group === 'bridge_horizontal') {
      bridge_horizontal.appendChild(container);
    } else if (group === 'fountain') {
      fountain.appendChild(container);
    } else if (group === 'fences_and_walls') {
      fences_and_walls.appendChild(container);
    } else if (group === 'resources') {
      resources.appendChild(container);
    }
    //brushes.appendChild(container);
  }

  onClear();

  animate();
}

function updateInformation() {
  let information = document.getElementById('information');
  information.innerText = `Zoom level: ${scale}\r\nMouse position\r\nX: ${mouseX} Y: ${mouseY}`;
}

function draw() {
  gameCtx.reset();
  resourcesCtx.reset();
  overlayCtx.reset();

  drawBoard();
  drawMousePosition();
  drawResources();
}

function setScale() {
  tileSize = scale * 16;
  gameCtx.scale(scale, scale);
  resourcesCtx.scale(scale, scale);
  characterCtx.scale(scale, scale);
  overlayCtx.scale(scale, scale);
  draw();
  updateInformation();
}
function onClear() {
  for (let i = 0; i < 50; i++) {
    board[i] = [];
    resources[i] = [];
    for (let j = 0; j < 50; j++) {
      board[i][j] = undefined;
      resources[i][j] = undefined;
    }
  }

  draw();
}

function onSave() {}

function onZoomIn() {
  if (scale < 3) {
    scale += 0.25;
  }
  setScale();
}

function onZoomReset() {
  scale = 1;
  setScale();
}

function onZoomOut() {
  if (scale > 0) {
    scale -= 0.25;
  }
  setScale();
}

function onStartAnimate() {
  character.animation = spawnAnimation;
  running = true;
}
function onStopAnimate() {
  running = false;
}
begin();
