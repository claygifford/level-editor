var monstersLookup = {
  slimeball: {},
  male_hero: {},
};

var weaponsLookup = {
  sword: {},
  shield: {},
};

var map = {
  last_spawn: 0,
  showCoolFont: true,
  showToolbar: false,
  monsters: [],
  camera: { x: 0, y: 0 },
  window: { x: 0, y: 0, width: 0, height: 0 },
  scale: 1,
  tileSize: 16,
  tiles: 40,
  screenSize: 640,
  get offset() {
    return this.tileSize * this.scale;
  },
  cameraCoordinates: function (mouseX, mouseY) {
    return this.coordinates(mouseX - this.camera.x, mouseY - this.camera.y);
  },
  coordinates: function (mouseX, mouseY) {
    return {
      i: Math.floor(mouseX / this.offset),
      j: Math.floor(mouseY / this.offset),
    };
  },
  cameraOffset: function () {
    return {
      x: this.camera.x / this.tileSize,
      y: this.camera.y / this.tileSize,
    };
  },
  setScale: function () {
    this.tileSize = this.scale * 16;
    this.screenSize = 640 / this.scale;

    this.setCamera(character.position.x, character.position.y);
    this.setTransforms();
  },
  transform: function (ctx) {
    ctx.setTransform(
      this.scale,
      0,
      0,
      this.scale,
      this.camera.x.toFixed(0),
      this.camera.y.toFixed(0)
    );
  },
  setTransforms: function () {
    this.window = {
      x: -this.camera.x / this.scale,
      y: -this.camera.y / this.scale,
      width: this.screenSize,
      height: this.screenSize,
    };
    this.transform(gameCtx);
    this.transform(resourcesCtx);
    this.transform(structuresCtx);
    this.transform(characterCtx);

    overlayCtx.setTransform(this.scale, 0, 0, this.scale, 0, 0);
  },
  setCamera: function (x, y) {
    let offsetX = -x * this.scale * this.tileSize;
    let offsetY = -y * this.scale * this.tileSize;

    //let limit = -map.scale * map.tiles * (map.tileSize-4);
    let upperLimit = 0;
    if (this.scale === 1) {
      upperLimit = -320;
    } else if (this.scale === 1.25) {
      upperLimit = -610;
    } else if (this.scale === 1.5) {
      upperLimit = -1012;
    } else if (this.scale === 1.75) {
      upperLimit = -1504;
    } else {
      upperLimit = -3600 + this.screenSize / 2;
    }
    //let uppperLimit = -3600 + this.screenSize / 2;
    let lowerLimit = -this.screenSize / 2;
    offsetX = Math.min(offsetX, lowerLimit);
    offsetY = Math.min(offsetY, lowerLimit);
    offsetX = Math.max(offsetX, upperLimit);
    offsetY = Math.max(offsetY, upperLimit);

    let garbageX = offsetX + this.screenSize / 2;
    let garbageY = offsetY + this.screenSize / 2;

    this.camera.x = garbageX;
    this.camera.y = garbageY;
  },
  drawRect: function (ctx, left, top, width, height) {
    ctx.rect(left, top, width, height);
  },
  drawPixel: function (ctx, img, left, top) {
    let size = this.tileSize;
    ctx.drawImage(img, left * size, top * size, size, size);
  },
  drawCharacter: function (ctx, img, left, top, size) {
    ctx.drawImage(
      img,
      left * this.tileSize,
      top * this.tileSize,
      size * this.scale,
      size * this.scale
    );
  },
  drawHand: function (ctx, img, left, top, size, nudgeLeft, nudgeRight) {
    ctx.drawImage(
      img,
      left * this.tileSize + nudgeLeft,
      top * this.tileSize + nudgeRight,
      size * this.scale,
      size * this.scale
    );
  },
  drawMonsters: function () {
    for (let i = 0; i < this.monsters.length; i++) {
      let monster = this.monsters[i];

      let img = monster.getImage();
      this.drawCharacter(
        characterCtx,
        img,
        monster.position.x,
        monster.position.y,
        monster.size
      );
    }
  },
  moveObject: function (object, targetX, targetY, speed) {
    let dx = targetX - object.position.x;
    let dy = targetY - object.position.y;
    object.position.x += dx * speed;
    object.position.y += dy * speed;
  },
  drawAndMoveMonsters: function () {
    for (let i = 0; i < this.monsters.length; i++) {
      let monster = this.monsters[i];
      if (!this.showCoolFont) {
        this.moveObject(
          monster,
          character.position.x,
          character.position.y,
          0.001
        );
      }
      let img = monster.getImage();
      this.drawCharacter(
        characterCtx,
        img,
        monster.position.x,
        monster.position.y,
        monster.size
      );
    }
  },
  drawFonts: function () {
    if (this.showCoolFont) {
      overlayCtx.drawImage(coolFont[0].img, 50, 30, 200, 30);
    }

    if (this.fonts && this.fonts.length > 0) {
      overlayCtx.font = '14px StardewValley';
      overlayCtx.shadowColor = '#3131318c';
      overlayCtx.shadowBlur = 4;
      overlayCtx.fillStyle = 'white';
      overlayCtx.strokeStyle = 'black';
      overlayCtx.lineWidth = 1;
      overlayCtx.shadowBlur = 0;
      for (let i = 0; i < this.fonts.length; i++) {
        let font = this.fonts[i];
        overlayCtx.strokeText(font.text, font.pos.x, font.pos.y);
        overlayCtx.fillText(font.text, font.pos.x, font.pos.y);
      }
    }
  },
  drawHealth: function () {
    if (this.showToolbar) {
      overlayCtx.fillStyle = 'white';
      overlayCtx.font = '8px StardewValley';
      overlayCtx.fillText('Health', 9, 7);
      overlayCtx.beginPath();
      overlayCtx.rect(9, 9, 102, 10);
      overlayCtx.fill();
      overlayCtx.closePath();

      overlayCtx.beginPath();
      overlayCtx.rect(10, 10, character.health, 8);
      overlayCtx.fillStyle = 'red';
      overlayCtx.fill();
      overlayCtx.closePath();
    }
  },
  drawScore: function () {
    if (this.showToolbar) {
      overlayCtx.font = '18px StardewValley';
      overlayCtx.fillStyle = 'white';
      overlayCtx.fillText(`Score: ${character.score}`, 250, 20);
    }
  },
  drawTime: function () {
    if (this.showToolbar) {
      let diff = Math.floor((Date.now() - this.time) / 1000);
      if (this.last_spawn + diff > 15) {
        this.last_spawn += diff;
      }
      //spawn in a new monster
      overlayCtx.font = '18px StardewValley';
      overlayCtx.fillStyle = 'white';
      overlayCtx.fillText(`Time: ${diff}`, 150, 20);
    }
  },
  draw: function (ctx, panel, boxLength, boxHeight) {
    for (let i = 0; i < boxHeight; i++) {
      for (let j = 0; j < boxLength; j++) {
        if (panel[i][j]) {
          this.drawPixel(ctx, panel[i][j].img, i, j);
        }
      }
    }
  },
  drawBoard: function (ctx, panel) {
    this.draw(ctx, panel, map.tiles, map.tiles);
  },
  zoomIn: function () {
    if (this.scale < 3) this.scale += 0.25;
  },
  zoomOut: function () {
    if (this.scale > 1) this.scale -= 0.25;
  },
  drawHero: function () {
    const { x, y } = character.position;
    if (Object.keys(keys).length > 0) {
      let acceleration = keys['z'] ? 0.25 : 1 / elapsed;
      if (keys['s']) {
        const pos = character.position.y + acceleration;
        if (pos < 38) {
          character.position.y = pos;
          character.animation = keys['z'] ? jumpAnimation : walkAnimation;
        }
      }
      if (keys['a']) {
        const pos = character.position.x - acceleration;
        if (pos > 0) {
          character.direction = 'left';
          character.position.x = pos;
          character.animation = keys['z'] ? jumpAnimation : walkAnimation;
        }
      }
      if (keys['w']) {
        const pos = character.position.y - acceleration;
        if (pos > 0) {
          character.position.y = pos;
          character.animation = keys['z'] ? jumpAnimation : walkAnimation;
        }
      }
      if (keys['d']) {
        const pos = character.position.x + acceleration;
        if (pos < 38) {
          character.position.x = pos;
          character.direction = 'right';
          character.animation = keys['z'] ? jumpAnimation : walkAnimation;
        }
      }

      if (keys['x']) {
        character.animation = turnAnimation;
      }
      if (keys['c']) {
        character.animation = hurtAnimation;
      }
      if (keys['v']) {
        character.animation = deathAnimation;
      }

      if (keys['q']) {
        if (character.rightHand) {
          character.rightHand.animation = swingAnimation;
        }
      }
      if (keys['e']) {
        if (character.leftHand) {
          character.leftHand.animation = bashAnimation;
        }
      }
    }

    // center zoom around character.
    if (x != character.position.x || y != character.position.y) {
      this.setCamera(character.position.x, character.position.y);
      this.setTransforms();
    }

    if (character.isDead === false) {
      let posX = Math.floor(character.position.x);
      let posY = Math.floor(character.position.y);
      for (let i = 0; i < this.monsters.length; i++) {
        let monster = this.monsters[i];
        let monX = Math.floor(monster.position.x);
        let monY = Math.floor(monster.position.y);
        if (posX === monX && posY === monY) {
          character.animation = hurtAnimation;
          character.health -= 5;
          if (character.health < 0) {
            character.animation = deathAnimation;
            character.isDead = true;
          }
        }
      }
    }

    this.clearWindow(characterCtx);
    let img = character.getImage();
    this.drawCharacter(
      characterCtx,
      img,
      character.position.x,
      character.position.y,
      character.size
    );
    if (character.leftHand) {
      let hand = character.leftHand.getImage();
      this.drawHand(
        characterCtx,
        hand,
        character.position.x,
        character.position.y,
        character.size / 1.5,
        32,
        36
      );
    }
    if (character.rightHand) {
      let hand = character.rightHand.getImage();
      this.drawHand(
        characterCtx,
        hand,
        character.position.x,
        character.position.y,
        character.size / 1.5,
        0,
        30
      );
    }
  },
  clearOverlay: function () {
    overlayCtx.clearRect(0, 0, 640, 640);
  },
  clearWindow: function (ctx) {
    ctx.clearRect(
      map.window.x,
      map.window.y,
      map.window.width,
      map.window.height
    );
  },
  drawGame: function () {
    this.clearWindow(gameCtx);
    map.drawBoard(gameCtx, this.board);
  },
  drawResources: function () {
    this.clearWindow(resourcesCtx);
    map.drawBoard(resourcesCtx, this.resources);
  },
  drawStructures: function () {
    this.clearWindow(structuresCtx);
    map.drawBoard(structuresCtx, this.structures);
  },
  drawBoardAnimations: function () {
    for (let i = 0; i < this.boardAnimations.length; i++) {
      let boardAnimation = this.boardAnimations[i];
      if (boardAnimation) {
        let img = boardAnimation.getImage();
        let { x, y } = boardAnimation.position;
        map.drawPixel(gameCtx, img, x, y);
      }
    }
  },
  goToLocation: function (x, y) {
    character.position.x = x;
    character.position.y = y;
    this.setCamera(character.position.x, character.position.y);
    this.setTransforms();
  },
  begin: function () {
    map.clearWindow(gameCtx);
    map.clearWindow(structuresCtx);
    map.clearWindow(resourcesCtx);
    map.clearWindow(overlayCtx);

    this.drawHero();
    this.drawMonsters();
    this.drawGame();
    this.drawResources();
    this.drawStructures();
    this.drawFonts();
    this.drawHealth();
    this.drawScore();
    this.drawTime();
  },
};

var character = {
  isDead: false,
  animation: undefined,
  direction: 'right',
  ticks: 0,
  health: 100,
  score: 0,
  position: { x: 0, y: 0 },
  size: 32,
  getImage: function () {
    this.ticks++;
    if (this.animation) {
      let img = this.animation(this);
      if (img) return img;
      this.animation = undefined;
      this.ticks = 0;
    }
    if (this.isDead) {
      let death =
        character.direction === 'left'
          ? character.death.slice(7, 8)
          : character.death.slice(3, 4);
      return death[0].img;
    }
    let idle =
      character.direction === 'left'
        ? this.idle.slice(4, 8)
        : this.idle.slice(0, 4);
    if (this.ticks < 10) return idle[0].img;
    if (this.ticks < 20) return idle[1].img;
    if (this.ticks < 30) return idle[2].img;
    if (this.ticks < 40) return idle[3].img;
    this.ticks = 0;
    return idle[0].img;
  },
};

function sword(type, idle, swing, stab) {
  return {
    type,
    idle,
    swing,
    stab,
    direction: 'right',
    ticks: 0,
    getImage: function () {
      this.ticks++;
      if (this.animation) {
        let img = this.animation(this);
        if (img) return img;
        this.animation = undefined;
        this.ticks = 0;
      }
      return idle[0].img;
    },
  };
}

function shield(type, idle, bash, hit) {
  return {
    type,
    idle,
    bash,
    hit,
    direction: 'right',
    ticks: 0,
    getImage: function () {
      this.ticks++;
      if (this.animation) {
        let img = this.animation(this);
        if (img) return img;
        this.animation = undefined;
        this.ticks = 0;
      }
      this.ticks = 0;
      return idle[0].img;
    },
  };
}

function slimeball(type, wake, idle, walk, jump, turn, death) {
  return {
    type,
    animation: undefined,
    position: { x: 10, y: 10 },
    direction: 'right',
    ticks: 0,
    size: 24,
    idle,
    wake,
    idle,
    walk,
    jump,
    turn,
    death,
    getImage: function () {
      this.ticks++;
      if (this.animation) {
        let img = this.animation(this);
        if (img) return img;
        this.animation = undefined;
        this.ticks = 0;
      }
      let idle =
        this.direction === 'right'
          ? this.idle.slice(0, 4)
          : this.idle.slice(4, 8);
      if (this.ticks < 10) return idle[0].img;
      if (this.ticks < 20) return idle[1].img;
      if (this.ticks < 30) return idle[2].img;
      if (this.ticks < 40) return idle[3].img;
      this.ticks = 0;
      return idle[0].img;
    },
  };
}

function demon(type, wake, idle, walk, jump, turn, death) {
  return {
    type,
    animation: undefined,
    position: { x: 10, y: 10 },
    direction: 'right',
    ticks: 0,
    size: 24,
    idle,
    wake,
    idle,
    walk,
    jump,
    turn,
    death,
    getImage: function () {
      this.ticks++;
      if (this.animation) {
        let img = this.animation(this);
        if (img) return img;
        this.animation = undefined;
        this.ticks = 0;
      }
      let idle =
        this.direction === 'right'
          ? this.idle.slice(0, 4)
          : this.idle.slice(4, 8);
      if (this.ticks < 10) return idle[0].img;
      if (this.ticks < 20) return idle[1].img;
      if (this.ticks < 30) return idle[2].img;
      if (this.ticks < 40) return idle[3].img;
      this.ticks = 0;
      return idle[0].img;
    },
  };
}

function walkAnimation(character) {
  let walk =
    character.direction === 'left'
      ? character.walk.slice(4, 8)
      : character.walk.slice(0, 4);

  character.ticks++;
  if (character.ticks < 8) return walk[0].img;
  if (character.ticks < 16) return walk[1].img;
  if (character.ticks < 24) return walk[2].img;
  if (character.ticks < 32) return walk[3].img;
}

function jumpAnimation(character) {
  let jump =
    character.direction === 'left'
      ? character.jump.slice(4, 8)
      : character.jump.slice(0, 4);

  character.ticks++;
  if (character.ticks < 8) return jump[0].img;
  if (character.ticks < 16) return jump[1].img;
  if (character.ticks < 24) return jump[2].img;
  if (character.ticks < 32) return jump[3].img;
}

function turnAnimation(character) {
  let turn =
    character.direction === 'left'
      ? character.turn.slice(4, 8)
      : character.turn.slice(0, 4);

  character.ticks++;
  if (character.ticks < 8) return turn[0].img;
  if (character.ticks < 16) return turn[1].img;
  if (character.ticks < 24) return turn[2].img;
  if (character.ticks < 32) return turn[3].img;
}

function hurtAnimation(character) {
  let hurt =
    character.direction === 'left'
      ? character.hurt.slice(4, 8)
      : character.hurt.slice(0, 4);

  character.ticks++;
  if (character.ticks < 8) return hurt[0].img;
  if (character.ticks < 16) return hurt[1].img;
  if (character.ticks < 24) return hurt[2].img;
  if (character.ticks < 32) return hurt[3].img;
}

function deathAnimation(character) {
  let death =
    character.direction === 'left'
      ? character.death.slice(4, 8)
      : character.death.slice(0, 4);

  character.ticks++;
  if (character.ticks < 8) return death[0].img;
  if (character.ticks < 16) return death[1].img;
  if (character.ticks < 24) return death[2].img;
  if (character.ticks < 32) return death[3].img;
}

function swingAnimation(item) {
  let swing = item.swing;
  item.ticks++;
  if (item.ticks < 8) return swing[0].img;
  if (item.ticks < 16) return swing[1].img;
  if (item.ticks < 24) return swing[2].img;
  if (item.ticks < 32) return swing[3].img;
}

function bashAnimation(item) {
  let bash = item.bash;
  item.ticks++;
  if (item.ticks < 8) return bash[0].img;
  if (item.ticks < 16) return bash[1].img;
  if (item.ticks < 24) return bash[2].img;
  if (item.ticks < 32) return bash[3].img;
}
