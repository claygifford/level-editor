var then, now, elapsed;
var fpsInterval = 1000 / 60;
var running = false;

function animate() {
  requestAnimationFrame(animate);
  if (!running) return;

  // calc elapsed time since last loop
  now = window.performance.now();
  elapsed = now - then;

  // if enough time has elapsed, draw the next frame
  if (elapsed > fpsInterval) {
    then = now - (elapsed % fpsInterval);
    map.drawHero();
    map.drawMonsters();
    map.drawGame();
    map.drawResources();
    map.drawStructures();
    map.drawBoardAnimations();
  }
}
