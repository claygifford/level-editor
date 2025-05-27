const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => resolve({ img });
    img.onerror = reject;
    img.src = src;
  });
};

async function getMonsters() {
  // get slime ball.
  let items;
  let monsterRequests = [];
  let monsterImageUrls = [];
  let idle, bash, hit, swing;

  for (let i = 0; i <= 47; i++) {
    let imageUrl = `characters/male_hero/male_hero_${i}.png`;
    monsterRequests.push(loadImage(imageUrl));
    monsterImageUrls.push(imageUrl);
  }

  items = await Promise.all(monsterRequests);
  character.idle = items.splice(0, 8);
  character.walk = items.splice(0, 8);
  character.jump = items.splice(0, 8);
  character.turn = items.splice(0, 8);
  character.hurt = items.splice(0, 8);
  character.death = items.splice(0, 8);

  monsterRequests = [];
  monsterImageUrls = [];

  for (let i = 0; i <= 11; i++) {
    let imageUrl = `characters/actions/wood_sword/sword_${i}.png`;
    monsterRequests.push(loadImage(imageUrl));
    monsterImageUrls.push(imageUrl);
  }

  items = await Promise.all(monsterRequests);
  idle = items.splice(0, 1);
  items.splice(0, 3);
  swing = items.splice(0, 4);
  stab = items.splice(0, 3);
  weaponsLookup.sword = sword('wood', idle, swing, stab);

  monsterRequests = [];
  monsterImageUrls = [];

  for (let i = 0; i <= 11; i++) {
    let imageUrl = `characters/actions/shield/shield_${i}.png`;
    monsterRequests.push(loadImage(imageUrl));
    monsterImageUrls.push(imageUrl);
  }

  items = await Promise.all(monsterRequests);
  idle = items.splice(0, 1);
  items.splice(0, 3);
  bash = items.splice(0, 4);
  hit = items.splice(0, 3);

  weaponsLookup.shield = shield('wood', idle, bash, hit);

  monsterRequests = [];
  monsterImageUrls = [];

  for (let i = 0; i < 55; i++) {
    let imageUrl = `characters/slimeball/slimeball_${i}.png`;
    monsterRequests.push(loadImage(imageUrl));
    monsterImageUrls.push(imageUrl);
  }

  items = await Promise.all(monsterRequests);
  monsterRequests = [];
  monsterImageUrls = [];

  let wake = items.splice(0, 8);
  idle = items.splice(0, 8);
  let walk = items.splice(0, 8);
  let jump = items.splice(0,8);
  let turn = items.splice(0,8);
  let death  = items.splice(0,8);

  monstersLookup.slimeball = slimeball('slimeball', wake, idle, walk, jump, turn, death);
}

function getForestGroups(count, items) {
  let result = [];
  let groups = Array.from(Array(count), () => new Array(0));
  for (let i = 0; i <= count-1; i++) {
    for (let j=0; j<=count-1; j++) {
      groups[j].push(items.splice(0, 1)[0]);
    }
  }

  for (let i = 0; i <= count - 1; i++) {
    result.push(tile(groups[i], true));
  }
  return result;
}

function addEmptyBlocks(items, values, count) {
  for (let i = 0; i < count; i++) {
    values.push(ground(createBlocks(items, 1, 1, 0, 1), 1, 1));
  }
}

async function loadForestTiles(values) {
  let items;
  let imageUrls = [];
  let requests = [];

  for (let i = 0; i < 197; i++) {
    let imageUrl = `pallette/forest/forest_${i}.png`;
    requests.push(loadImage(imageUrl));
    imageUrls.push(imageUrl);
  }

  items = await Promise.all(requests);

  for (let i = 23; i < 100; i++) {    
    if (i >= 34 && i <= 37) continue;
    if (i >= 43 && i <= 44) continue;
    if (i >= 56 && i <= 59) continue;
    if (i >= 65 && i <= 66) continue;
    if (i >= 78 && i <= 81) continue;
    if (i >= 87 && i <= 88) continue;

    if ((i >= 72 && i <= 75) || (i >= 94 && i <= 97)) {
      addEmptyBlocks(items, values, 1);
      continue;
    }

    values.push(ground(createBlocks(items, 1, 1, i, 1), 1, 1));
  }
  addEmptyBlocks(items, values, 5);
  values.push(ground(createBlocks(items, 1, 1, 111, 0), 1, 1));
  values.push(ground(createBlocks(items, 1, 1, 112, 0), 1, 1));
  values.push(ground(createBlocks(items, 1, 1, 113, 0), 1, 1));
  values.push(ground(createBlocks(items, 1, 1, 114, 0), 1, 1));
  values.push(ground(createBlocks(items, 1, 1, 115, 0), 1, 1));
  addEmptyBlocks(items, values, 11);
  values.push(ground(createBlocks(items, 1, 1, 133, 0), 1, 1));
  values.push(ground(createBlocks(items, 1, 1, 134, 0), 1, 1));
  values.push(ground(createBlocks(items, 1, 1, 135, 0), 1, 1));
  values.push(ground(createBlocks(items, 1, 1, 136, 0), 1, 1));
  values.push(ground(createBlocks(items, 1, 1, 137, 0), 1, 1));
  addEmptyBlocks(items, values, 11);
  values.push(ground(createBlocks(items, 1, 1, 155, 0), 1, 1));
  values.push(ground(createBlocks(items, 1, 1, 156, 0), 1, 1));
  values.push(ground(createBlocks(items, 1, 1, 157, 0), 1, 1));
  values.push(ground(createBlocks(items, 1, 1, 158, 0), 1, 1));
  values.push(ground(createBlocks(items, 1, 1, 159, 0), 1, 1));

  values.push(ground(createBlocks(items, 2, 4, 72, -54), 2, 4));
}

async function loadForestPaths(values, path) {
  let items;
  let imageUrls = [];
  let requests = [];   

  for (let i = 0; i < 39; i++) {
    let imageUrl = getPath(path, i);
    requests.push(loadImage(imageUrl));
    imageUrls.push(imageUrl);
  }
  
  items = await Promise.all(requests);

  for (let i = 8; i < 31; i++) {
    if (i % 8 === 0 || i % 8 === 7) continue;
    values.push(ground(createBlocks(items, 1, 1, i, 1), 1, 1));
  }
}

async function loadForestFencesAndWalls() {
  let imageUrls = [];
  let requests = [];
  
  for (let i = 0; i < 179; i++) {
    let imageUrl = `resources/forest/forest_fences_and_walls_${i}.png`;
    requests.push(loadImage(imageUrl));
    imageUrls.push(imageUrl);
  }

  items = await Promise.all(requests);

  fencesAndWalls.push(structure(createBlocks(items, 2, 4, 10, 1), 2, 4));
  fencesAndWalls.push(structure(createBlocks(items, 3, 3, 16, -4), 3, 3));
  fencesAndWalls.push(structure(createBlocks(items, 3, 1, 19, -5), 3, 1));
  fencesAndWalls.push(structure(createBlocks(items, 1, 3, 61, -59), 1, 3));
  fencesAndWalls.push(structure(createBlocks(items, 3, 3, 20, -8), 3, 3));
  fencesAndWalls.push(structure(createBlocks(items, 2, 2, 23, -10), 2, 2));
  fencesAndWalls.push(structure(createBlocks(items, 2, 2, 53, -40), 2, 2));
  fencesAndWalls.push(structure(createBlocks(items, 3, 1, 40, -26), 3, 1));
  fencesAndWalls.push(structure(createBlocks(items, 3, 1, 43, -29), 3, 1));
  fencesAndWalls.push(structure(createBlocks(items, 2, 4, 55, -44), 2, 4));
  fencesAndWalls.push(structure(createBlocks(items, 2, 1, 76, -62), 2, 1));
  fencesAndWalls.push(structure(createBlocks(items, 2, 3, 77, -65), 2, 3));
  fencesAndWalls.push(structure(createBlocks(items, 6, 3, 80, -68), 6, 3));
  fencesAndWalls.push(structure(createBlocks(items, 2, 5, 83, -73), 2, 5));
  fencesAndWalls.push(structure(createBlocks(items, 2, 1, 88, -74), 2, 1));
  fencesAndWalls.push(structure(createBlocks(items, 2, 1, 121, -107), 2, 1));
  fencesAndWalls.push(structure(createBlocks(items, 1, 1, 107, 0), 1, 1));
  fencesAndWalls.push(structure(createBlocks(items, 1, 1, 108, 0), 1, 1));
  fencesAndWalls.push(structure(createBlocks(items, 1, 1, 122, -108), 1, 1));
  fencesAndWalls.push(structure(createBlocks(items, 1, 2, 123, -109), 1, 2));
  fencesAndWalls.push(structure(createBlocks(items, 2, 3, 137, -125), 2, 3));
  fencesAndWalls.push(structure(createBlocks(items, 3, 3, 113, -101), 3, 3));
  fencesAndWalls.push(structure(createBlocks(items, 3, 3, 116, -104), 3, 3));
}

async function loadForestCollections() {
  let imageUrls = [];
  let requests = [];

  for (let i = 0; i < 119; i++) {
    let imageUrl = `resources/forest/forest_resources_${i}.png`;
    requests.push(loadImage(imageUrl));
    imageUrls.push(imageUrl);
  }

  items = await Promise.all(requests);

  collections.push(collection(createBlocks(items, 2, 1, 13, -2), 2, 1));
  collections.push(collection(createBlocks(items, 2, 1, 14, -3), 2, 1));
  collections.push(collection(createBlocks(items, 2, 3, 15, -6), 2, 3));
  collections.push(collection(createBlocks(items, 2, 1, 18, -7), 2, 1));
  collections.push(collection(createBlocks(items, 1, 1, 19, 0), 1, 1));
  collections.push(collection(createBlocks(items, 1, 1, 20, 0), 1, 1));
  collections.push(collection(createBlocks(items, 1, 1, 21, 0), 1, 1));
  collections.push(collection(createBlocks(items, 1, 1, 22, 0), 1, 1));
  collections.push(collection(createBlocks(items, 1, 1, 31, 0), 1, 1));
  collections.push(collection(createBlocks(items, 1, 1, 32, 0), 1, 1));
  collections.push(collection(createBlocks(items, 1, 1, 33, 0), 1, 1));
  collections.push(collection(createBlocks(items, 1, 1, 34, 0), 1, 1));
  collections.push(collection(createBlocks(items, 1, 1, 37, 0), 1, 1));  
  collections.push(collection(createBlocks(items, 2, 2, 38, -28), 2, 2));
  collections.push(collection(createBlocks(items, 1, 1, 40, 0), 1, 1));
  collections.push(collection(createBlocks(items, 1, 1, 41, 0), 1, 1));
  collections.push(collection(createBlocks(items, 1, 1, 42, 0), 1, 1));
  collections.push(collection(createBlocks(items, 1, 1, 43, 0), 1, 1));
  collections.push(collection(createBlocks(items, 1, 1, 44, 0), 1, 1));
  collections.push(collection(createBlocks(items, 1, 1, 45, 0), 1, 1));
  collections.push(collection(createBlocks(items, 1, 1, 46, 0), 1, 1));

  collections.push(collection(createBlocks(items, 1, 1, 49, 0), 1, 1));
  collections.push(collection(createBlocks(items, 1, 1, 52, 0), 1, 1));
  collections.push(collection(createBlocks(items, 1, 1, 53, 0), 1, 1));
  collections.push(collection(createBlocks(items, 1, 1, 54, 0), 1, 1));
  collections.push(collection(createBlocks(items, 1, 1, 55, 0), 1, 1));
  collections.push(collection(createBlocks(items, 1, 1, 56, 0), 1, 1));
  collections.push(collection(createBlocks(items, 1, 1, 57, 0), 1, 1));
  collections.push(collection(createBlocks(items, 1, 1, 58, 0), 1, 1));
  collections.push(collection(createBlocks(items, 2, 1, 61, -50), 2, 1));
  collections.push(collection(createBlocks(items, 2, 1, 62, -51), 2, 1));
  collections.push(collection(createBlocks(items, 2, 2, 63, -53), 2, 2));
  collections.push(collection(createBlocks(items, 2, 2, 65, -55), 2, 2));
  collections.push(collection(createBlocks(items, 1, 1, 67, 0), 1, 1));
  collections.push(collection(createBlocks(items, 1, 1, 68, 0), 1, 1));
  collections.push(collection(createBlocks(items, 1, 1, 69, 0), 1, 1));
  collections.push(collection(createBlocks(items, 1, 1, 70, 0), 1, 1));

  collections.push(collection(createBlocks(items, 1, 1, 80, 0), 1, 1));
  collections.push(collection(createBlocks(items, 1, 1, 81, 0), 1, 1));
  collections.push(collection(createBlocks(items, 1, 1, 82, 0), 1, 1));
  collections.push(collection(createBlocks(items, 2, 1, 85, -74), 2, 1));
  collections.push(collection(createBlocks(items, 2, 1, 86, -75), 2, 1));
  collections.push(collection(createBlocks(items, 2, 1, 87, -76), 2, 1));
  collections.push(collection(createBlocks(items, 2, 1, 88, -77), 2, 1));


  collections.push(collection(createBlocks(items, 2, 1, 90, -79), 2, 1));
  collections.push(collection(createBlocks(items, 2, 1, 91, -80), 2, 1));
}

function getPath(path, index) {
  return `${path}${index}.png`;
}

function createBlocks(items, row, column, leftOffset, rightOffset) {
  const o = items.reduce((obj, value, index) => {
    obj[index] = value;
    return obj;
  }, {});

  let index = 0 + leftOffset;
  let set = [];
  for (let i=0; i<row; i++) {
    for (let j=0; j<column; j++) {      
      set.push(o[index]);
      index++;
    }
    
    index += leftOffset + rightOffset;
  }
  return set;
}

async function loadForestAsset(tileCount, row, column, leftOffset, rightOffset, path) {
  let imageUrls = [];
  let requests = [];
  let items;

  for (let i = 0; i < tileCount; i++) {    
    let imageUrl = getPath(path, i);
    requests.push(loadImage(imageUrl));
    imageUrls.push(imageUrl);
  }

  items = await Promise.all(requests);

  assets.push(
    structure(
      createBlocks(items, row, column, leftOffset, rightOffset),
      row,
      column
    )
  );
}

async function createImages() {
  await loadForestTiles(floors);
  await loadForestAsset(71, 5, 11, 1, 0, 'pallette/forest/forest_bridge_horizontal_');
  await loadForestAsset(49, 9, 3, 1, 1, 'pallette/forest/forest_bridge_vertical_');
  await loadForestAsset(107, 5, 4, 1, 13, 'pallette/forest/forest_fountain_');
  await loadForestPaths(paths, 'pallette/forest/forest_path_');

  await loadForestFencesAndWalls();
  await loadForestCollections();

  await getMonsters();
  
  tilesLookup = [
    ...floors,
    ...paths,
    ...assets,
    ...fencesAndWalls,
    ...collections,
  ].reduce(function (r, e) {

    for (let i = 0; i < e.items.length; i++) {
      let child = e.items[i];
      let key = getImgKey(child.img);
      r[key] = { key: key, img: child.img };
    }
    return r;
  }, {});
}
