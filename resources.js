var tiles = [];
var tilesLookup = {};
var floors = [];
var paths = [];
var assets = [];
var collections = [];
var fencesAndWalls = [];

function getImgKey(img) {
  const fullPath = img.src;
  filename = fullPath.substring(fullPath.lastIndexOf('/') + 1);
  return filename.substring(0, filename.lastIndexOf('.'));
}

function tile(items, animates) {
  return {
    type: 'tile',
    key: getImgKey(items[0].img),
    items: items,
    animates: animates,
    img: items[0].img,
  };
}

function tileAnimation(tile, position) {
  return {
    ticks: 0,
    tile: tile,
    position: position,
    getImage: function () {
      this.ticks++;
      if (this.ticks < 10) return tile.items[0].img;
      if (this.ticks < 20) return tile.items[1].img;
      if (this.ticks < 30) return tile.items[2].img;
      if (this.ticks < 40) return tile.items[3].img;
      this.ticks = 0;
      return this.tile.img;
    },
  };
}

function ground(items, row, column, animates) {
  return {
    key: getImgKey(items[0].img),
    row: row,
    column: column,
    type: 'ground',
    items: items,
    animates: animates,
  };
}

function asset(items, row, column, animates) {
  return {
    row: row,
    column: column,
    type: 'asset',
    items: items,
    animates: animates,
  };
}

function structure(items, row, column, animates) {
  return {
    key: getImgKey(items[0].img),
    row: row,
    column: column,
    type: 'structure',
    items: items,
    animates: animates,
  };
}

function wall(items, row, column, animates) {
  return {
    key: getImgKey(items[0].img),
    row: row,
    column: column,
    type: 'wall',
    items: items,
    animates: animates,
  };
}

function collection(items, row, column, animates) {
  return {
    key: getImgKey(items[0].img),
    row: row,
    column: column,
    type: 'collection',
    items: items,
    animates: animates,
  };
}
