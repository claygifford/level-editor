function getEmptyValues(mapSize) {
  let structure = {
    board: [[]],
    boardAnimations: [],
    resources: [[]],
    structures: [[]],
    monsters: [],
  };

  for (let i = 0; i < mapSize; i++) {
    structure.board[i] = [];
    structure.resources[i] = [];
    structure.structures[i] = [];
    for (let j = 0; j < mapSize; j++) {
      structure.board[i][j] = undefined;
      structure.resources[i][j] = undefined;
      structure.structures[i][j] = undefined;
    }
  }
  return structure;
}

function defaultMap() {
  let structure = getEmptyValues(40);

  structure.board[0][0] = {key: 'forest_23'};
  structure.board[0][39] =  {key: 'forest_89'};
  structure.board[39][0] =  {key: 'forest_25'};
  structure.board[39][39] =  {key: 'forest_93'};
  for (let i = 1; i < 39; i++) {
    for (let j = 1; j < 39; j++) {
      structure.board[i][j] = {key: 'forest_46'};
    }
  }

  for (let i = 1; i < 39; i++) {
    structure.board[i][0] = {key: 'forest_24'};
    structure.board[0][i] = {key: 'forest_45'};
    structure.board[i][39] ={key: 'forest_90'};
    structure.board[39][i] = {key: 'forest_71'};
  }

  structure.monsters = [{ type: 'slimeball', position: {x: 2, y: 2} }];

  return {
    scale: 2.5,
    characterPosition: { x: 0, y: 0 },
    structure,
  };
}

function createTiles(screen, values) {
  for (let i = 0; i < screen.length; i++) {
    for (let j = 0; j < screen.length; j++) {
      let square = screen[i][j];
      if (square && square.key)
        values[i][j] = tilesLookup[square.key];
    }
  }
  return values;
}

function createMonsters(set, monsters) {
  for (let i = 0; i < set.length; i++) {    
    let monster = set[i];
    let copy = monstersLookup[monster.type];
    copy.position = monster.position;
    monsters.push(copy);
  }
  return monsters;
}

function setMap(config) {
  const { structure, scale, characterPosition } = config;

  const empty = getEmptyValues(40);
  const { board, resources,  monsters, structures } = structure;

  map.board = createTiles(board, empty.board);
  map.boardAnimations = empty.boardAnimations;
  map.resources = createTiles(resources, empty.resources);
  map.structures = createTiles(structures, empty.structures);
  map.monsters = createMonsters(monsters, empty.monsters);

  character.position = characterPosition;
  map.scale = scale;
  map.setScale();
}
var level1 = {};

var menu = {};
