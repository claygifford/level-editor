var selection;
var mouseX, mouseY;
var running = false;
var keys = {};

var isdragging = false;
var drawFont = false;
var pos = {};
var showInformation = true;

overlayCanvas.addEventListener('mousemove', (event) => {
  mouseX = event.offsetX;
  mouseY = event.offsetY;
  drawMousePosition();
});

overlayCanvas.addEventListener('mousedown', (event) => {
  isdragging = true;
  pos = map.cameraCoordinates(mouseX, mouseY);
});

overlayCanvas.addEventListener('mouseup', (event) => {
  isdragging = false;
  drawBox();
  pos = {};
});

function drawMousePosition() {
  if (!mouseX || !mouseY) return;

  overlayCtx.clearRect(0, 0, 640, 640);

  let nudge = { x: -map.camera.x % map.offset, y: -map.camera.y % map.offset };

  let i = Math.floor((mouseX + nudge.x) / map.offset);
  let j = Math.floor((mouseY + nudge.y) / map.offset);

  overlayCtx.strokeStyle = 'blue';
  overlayCtx.beginPath();
  map.drawRect(
    overlayCtx,
    i * map.tileSize - (nudge.x * map.tileSize) / map.offset,
    j * map.tileSize - (nudge.y * map.tileSize) / map.offset,
    map.tileSize,
    map.tileSize
  );
  overlayCtx.stroke();
  overlayCtx.closePath();

  overlayCtx.beginPath();
  overlayCtx.strokeStyle = 'black';
  map.drawRect(overlayCtx, 0, 0, map.screenSize, map.screenSize);
  overlayCtx.stroke();
  overlayCtx.closePath();

  //if draw font
  if (drawFont) {
    overlayCtx.font = '36px StardewValley';
    overlayCtx.shadowColor = '#3131318c';
    overlayCtx.shadowBlur = 4;
    overlayCtx.fillStyle = 'white';
    overlayCtx.strokeStyle = '#333';
    overlayCtx.lineWidth = 1;
    overlayCtx.strokeText('Press Any Key to Start', 20, 80);
    overlayCtx.fillText('Press Any Key to Start', 20, 80);
    overlayCtx.shadowBlur = 0;
  }
}

function addStructure(asset, x, y) {
  let index = 0;

  for (let i = 0; i < asset.row; i++) {
    for (let j = 0; j < asset.column; j++) {
      if (asset.items.length > index) {
        let item = asset.items[index];
        map.structures[x + j][y + i] = item;
      }
      index++;
    }
  }
}

function addGround(asset, x, y) {
  let index = 0;

  for (let i = 0; i < asset.row; i++) {
    for (let j = 0; j < asset.column; j++) {
      if (asset.items.length > index) {
        let item = asset.items[index];
        map.board[x + j][y + i] = item;
      }
      index++;
    }
  }
}

function drawBox() {
  let { i, j } = map.cameraCoordinates(mouseX, mouseY);
  if (selection) {
    const maxX = Math.max(pos.i, i);
    const minX = Math.min(pos.i, i);
    const maxY = Math.max(pos.j, j);
    const minY = Math.min(pos.j, j);
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        if (selection.type === 'structure') {
          addStructure(selection, x, y);
        } else if (selection.type === 'wall') {
          addStructure(selection, x, y);
        } else if (selection.type === 'resource') {
          addStructure(selection, x, y);
        } else if (selection.type === 'ground') {
          addGround(selection, x, y);
        } else if (selection.type === 'collection') {
          addStructure(selection, x, y);
        }
      }
    }
  }
  map.drawGame();
  map.drawResources();
  map.drawStructures();
}

document.addEventListener('keydown', (event) => {
  keys[event.key] = true;
});

document.addEventListener('keyup', (event) => {
  delete keys[event.key];

  if (event.key === '7') {
    map.goToLocation(1, 1);
  }
  if (event.key === '8') {
    map.goToLocation(18, 1);
  }
  if (event.key === '9') {
    map.goToLocation(36, 1);
  }
  if (event.key === '6') {
    map.goToLocation(36, 18);
  }
  if (event.key === '3') {
    map.goToLocation(36, 36);
  }
  if (event.key === '2') {
    map.goToLocation(18, 36);
  }
  if (event.key === '1') {
    map.goToLocation(1, 36);
  }
  if (event.key === '4') {
    map.goToLocation(1, 18);
  }
});

function tileSelection(tile) {
  const brushes = document.getElementById('active-brush');
  const name = document.getElementById('active-brush-name');
  const container = document.createElement('div');

  let img = new Image();
  img.src = tile.img.src;
  img.width = '128';
  img.height = '128';
  container.appendChild(img);

  brushes.replaceChildren(container);
  selection = tile;

  name.innerText = tile.key;
}

function groundSelection(ground) {
  const brushes = document.getElementById('active-brush');
  const name = document.getElementById('active-brush-name');

  let index = 0;
  const element = document.createElement('div');
  element.style.display = 'grid';
  element.style.gridTemplateColumns = `repeat(${ground.column}, 16px)`;
  element.style.gridTemplateRows = `repeat(${ground.row}, 16px)`;
  element.style.columnGap = '0';
  element.style.rowGap = '0';
  for (var j = 0; j < ground.column; j++) {
    for (var k = 0; k < ground.row; k++) {
      let img = new Image();
      img.src = ground.items[index].img.src;
      img.width = '16';
      img.height = '16';
      element.appendChild(img);
      index++;
    }
  }

  brushes.replaceChildren(element);
  selection = ground;

  name.innerText = ground.key;
}

function wallSelection(wall) {
  const brushes = document.getElementById('active-brush');
  const name = document.getElementById('active-brush-name');

  let index = 0;
  const element = document.createElement('div');
  element.style.display = 'grid';
  element.style.gridTemplateColumns = `repeat(${wall.column}, 16px)`;
  element.style.gridTemplateRows = `repeat(${wall.row}, 16px)`;
  element.style.columnGap = '0';
  element.style.rowGap = '0';
  for (var j = 0; j < wall.column; j++) {
    for (var k = 0; k < wall.row; k++) {
      let img = new Image();
      img.src = wall.items[index].img.src;
      img.width = '16';
      img.height = '16';
      element.appendChild(img);
      index++;
    }
  }

  brushes.replaceChildren(element);
  selection = wall;

  name.innerText = wall.key;
}

function addTilesToScreen(div, items) {
  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    const container = document.createElement('div');
    container.appendChild(item.img);
    container.addEventListener('click', () => tileSelection(item));
    div.appendChild(container);
  }
}

function addGroundToScreen(div, asset) {
  let index = 0;
  const element = document.createElement('div');
  element.style.display = 'grid';
  element.style.gridTemplateColumns = `repeat(${asset.column}, 16px)`;
  element.style.gridTemplateRows = `repeat(${asset.row}, 16px)`;
  element.style.columnGap = '0';
  element.style.rowGap = '0';
  for (var j = 0; j < asset.column; j++) {
    for (var k = 0; k < asset.row; k++) {
      let item = asset.items[index];
      const container = document.createElement('div');
      let img = new Image();
      img.src = item.img.src;
      img.width = '16';
      img.height = '16';
      container.appendChild(img);
      container.addEventListener('click', () => groundSelection(asset));
      element.appendChild(container);
      index++;
    }
  }
  div.appendChild(element);
}

function addStructureToScreen(div, asset) {
  let index = 0;
  const element = document.createElement('div');
  element.style.display = 'grid';
  element.style.gridTemplateColumns = `repeat(${asset.column}, 16px)`;
  element.style.gridTemplateRows = `repeat(${asset.row}, 16px)`;
  element.style.columnGap = '0';
  element.style.rowGap = '0';
  for (var j = 0; j < asset.column; j++) {
    for (var k = 0; k < asset.row; k++) {
      let item = asset.items[index];
      const container = document.createElement('div');
      let img = new Image();
      img.src = item.img.src;
      img.width = '16';
      img.height = '16';
      container.appendChild(img);
      container.addEventListener('click', () => wallSelection(asset));
      element.appendChild(container);
      index++;
    }
  }
  div.appendChild(element);
}

async function begin() {
  then = window.performance.now();
  await createImages();

  const generalDiv = document.getElementById('general');
  const bridgeHorizontalDiv = document.getElementById('bridge_horizontal');
  const bridgeVerticalDiv = document.getElementById('bridge_vertical');
  const fountainDiv = document.getElementById('fountain');
  const pathDiv = document.getElementById('path');
  const fencesAndWallsDiv = document.getElementById('fences_and_walls');
  const collectionsDiv = document.getElementById('collections');

  for (let i = 0; i < floors.length; i++) {
    let floor = floors[i];
    addGroundToScreen(generalDiv, floor);
  }

  let [bridgeHorizontalAsset, bridgeVerticalAsset, fountainAsset] = assets;
  addStructureToScreen(bridgeHorizontalDiv, bridgeHorizontalAsset);
  addStructureToScreen(bridgeVerticalDiv, bridgeVerticalAsset);
  addStructureToScreen(fountainDiv, fountainAsset);

  for (let i = 0; i < paths.length; i++) {
    let path = paths[i];
    addGroundToScreen(pathDiv, path);
  }

  for (let i = 0; i < fencesAndWalls.length; i++) {
    let wall = fencesAndWalls[i];
    addStructureToScreen(fencesAndWallsDiv, wall);
  }

  for (let i = 0; i < collections.length; i++) {
    let collection = collections[i];
    addStructureToScreen(collectionsDiv, collection);
  }

  setMap(defaultMap());

  map.setScale();

  draw();
  animate();
}

function updateInformation() {
  const { scale, tileSize, screenSize, camera } = map;
  let information = document.getElementById('information');
  information.innerText = `Zoom level: ${scale}\r\nMouse position\r\nX: ${mouseX} Y: ${mouseY} tileSize: ${tileSize} \r\nscreenSize: ${screenSize}\r\character: ${character.position.x} ${character.position.y}\r\camera: ${camera.x} ${camera.y}`;
}

function draw() {
  map.begin();
}

function setScale() {
  draw();
  updateInformation();
}

function saveToFile(content, filename, contentType) {
  const element = document.createElement('a');
  const file = new Blob([content], { type: contentType });

  element.href = URL.createObjectURL(file);
  element.download = filename;

  document.body.appendChild(element);
  element.click();

  document.body.removeChild(element);
  URL.revokeObjectURL(element.href);
}

function reshape(key, value) {
  if (key === 'img') {
    return undefined;
  }
  return value;
}

function onSave() {
  var obj = {
    scale: map.scale,
    characterPosition: character.position,
    structure: {
      board: map.board,
      resources: map.resources,
      structures: map.structures,
      monsters: map.monsters.map((m) => {
        m.key, m.position;
      }),
    },
  };

  saveToFile(JSON.stringify(obj, reshape, 4), 'topdowngame.txt', 'text/plain');
}

function onZoomIn() {
  map.zoomIn();
  map.setScale();
  setScale();
}

function onZoomReset() {
  map.scale = 1.5;
  map.setScale();
  setScale();
}

function onZoomOut() {
  map.zoomOut();
  map.setScale();
  setScale();
}

function onStartAnimate() {
  running = true;
}
function onStopAnimate() {
  running = false;
}
function onAddFont() {
  drawFont = true;
}
function onRemoveFont() {
  drawFont = false;
}
function onLoadMap1() {
  setMap(map1);
}
function onEquip(hand, item) {
  character[hand] = weaponsLookup[item];
}
begin();
