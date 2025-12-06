/* ====== الجسم الأساسي ====== */
body {
  margin: 0;
  background: radial-gradient(circle at top, #0b0b45, #000020);
  color: #00fffc;
  font-family: 'Press Start 2P', monospace;
  text-align: center;
  overflow: hidden;
  filter: contrast(150%) saturate(140%) brightness(120%);
}

/* ====== Canvas ====== */
canvas {
  display: block;
  margin: 10px auto;
  background: linear-gradient(to bottom, #111 0%, #000 100%);
  border: 6px solid #00fffc;
  border-radius: 12px;
  box-shadow:
    0 0 30px #00fffc inset,
    0 0 60px #ff00ff,
    0 0 20px #0ff,
    0 0 15px #fff5;
  image-rendering: pixelated;
}

/* ====== الأزرار Neon AERO ====== */
button {
  padding: 12px 20px;
  margin: 6px;
  font-size: 14px;
  font-weight: bold;
  color: #00fffc;
  background: rgba(0, 0, 50, 0.8);
  border: 2px solid #00fffc;
  border-radius: 14px;
  cursor: pointer;
  text-shadow: 0 0 8px #0ff, 0 0 15px #0ff;
  box-shadow:
    0 0 10px #0ff,
    0 0 20px #00fffc,
    0 0 30px #ff00ff inset,
    0 0 15px #fff inset;
  transition: all 0.2s ease-in-out;
}

/* Hover effect Neon Flash */
button:hover {
  background: rgba(0, 0, 100, 0.9);
  box-shadow:
    0 0 15px #0ff,
    0 0 25px #00fffc,
    0 0 40px #ff00ff inset,
    0 0 25px #fff inset;
  transform: scale(1.05);
}

/* Hidden elements */
.hidden {
  display: none;
}

/* Splash / Licence / Menus with AERO glass effect */
#splash, #licence, #mainMenu, #settingsMenu {
  background: rgba(10, 10, 40, 0.7);
  backdrop-filter: blur(8px);
  border: 2px solid #00fffc;
  border-radius: 20px;
  box-shadow:
    0 0 20px #00fffc,
    0 0 50px #ff00ff inset;
  padding: 20px;
  width: 450px;
  margin: 50px auto;
  text-align: center;
}

/* Meteor effects */
.meteor {
  position: absolute;
  width: 10px;
  height: 10px;
  background: linear-gradient(45deg, #fff, #00fffc);
  border-radius: 50%;
  opacity: 0.9;
  box-shadow: 0 0 10px #0ff, 0 0 15px #ff0;
  animation: meteorFlash 0.3s ease-in-out infinite alternate;
}

@keyframes meteorFlash {
  0% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.5); opacity: 1; }
  100% { transform: scale(1); opacity: 0.7; }
}

/* VERSION label */
.version-label {
  position: absolute;
  bottom: 5px;
  width: 100%;
  text-align: center;
  color: #0ff;
  font-size: 12px;
  text-shadow: 0 0 5px #0ff, 0 0 10px #00fffc;
  font-family: monospace;
    }    let l = "0123456789ABCDEF";
    let c = "#";
    for(let i=0; i<6; i++){
      c += l[Math.floor(Math.random()*16)];
    }
    return c;
  }

  function drawGround(){
    ctx.fillStyle = crazyMode ? randomColor() : "#050";
    ground.forEach(g => {
      ctx.fillRect(g.x, g.y, g.w, g.h);
      g.y += speed * gameSpeed;
      if (g.y > 450){
        g.y = 0;
        g.x = Math.random()*550;
      }
    });
  }

  function drawPlayer(){
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.w*player.fatMultiplier, player.h*player.fatMultiplier);
  }

  function drawBullets(){
    bullets.forEach(b => {
      ctx.fillStyle = b.color || player.shootColor;
      ctx.fillRect(b.x, b.y, b.w, b.h);
      b.y -= 7 * gameSpeed;
    });
    bullets = bullets.filter(b => b.y > -10);
  }

  function drawEnemyBullets(){
    ctx.fillStyle = crazyMode ? randomColor() : "#f80";
    enemyBullets.forEach(b => {
      ctx.fillRect(b.x, b.y, b.w, b.h);
      b.y += 5 * gameSpeed;
    });
    enemyBullets = enemyBullets.filter(b => b.y < 450);
  }

  function drawEnemies(){
    ctx.fillStyle = crazyMode ? randomColor() : "#f00";
    enemies.forEach(e => {
      ctx.fillRect(e.x, e.y, e.w, e.h);
      e.y += speed * gameSpeed;
      if (Math.random() < 0.01)
        enemyBullets.push({ x: e.x+23, y: e.y+23, w:8, h:8 });
    });
    enemies = enemies.filter(e => e.y < 450);
  }

  function spawnEnemy(){
    enemies.push({ x: Math.random()*550, y: -50, w:50, h:50 });
  }

  function showMessage(text){
    message = text;
    messageTime = Date.now();
  }

  function checkCollisions(){
    enemies.forEach((e, ei) => {
      bullets.forEach((b, bi) => {
        if (b.x < e.x+e.w && b.x+b.w > e.x && b.y < e.y+e.h && b.y+b.h > e.y){
          enemies.splice(ei,1);
          bullets.splice(bi,1);
          score++;
          doomShoot.volume = volume;
          doomShoot.play();
        }
      });
      if (player.x < e.x+e.w && player.x + player.w*player.fatMultiplier > e.x &&
          player.y < e.y+e.h && player.y + player.h*player.fatMultiplier > e.y){
        player.hp--;
        enemies.splice(ei,1);
        doomKill.volume = volume;
        doomKill.play();
        if (player.hp <= 0) gameOver = true;
      }
    });
  }

  function drawText(){
    ctx.fillStyle = "#ff0";
    ctx.font = "16px monospace";
    let hearts = "❤️".repeat(player.hp);
    ctx.fillText("Score: "+score, 10, 20);
    ctx.fillText("HP: "+hearts, 10, 40);
  }

  function drawMiniMap(){
    mctx.fillStyle = "#000";
    mctx.fillRect(0, 0, 225, 90);
    mctx.fillStyle = "#ff0";
    mctx.fillRect(player.x/2, 70, 5, 5);
    mctx.fillStyle = "#f00";
    enemies.forEach(e => {
      mctx.fillRect(e.x/2, e.y/5, 4, 4);
    });
    mctx.fillStyle = "#ff0";
    bullets.forEach(b => {
      mctx.fillRect(b.x/2, b.y/5, 2, 2);
    });
  }

  function shootBullet(){
    bullets.push({ x: player.x+23, y: player.y, w:5, h:10, color: player.shootColor });
    doomShoot.volume = volume;
    doomShoot.play();
  }

  function loop(){
    if (gameOver) return;
    ctx.clearRect(0,0,600,450);
    drawGround();
    drawPlayer();
    drawBullets();
    drawEnemyBullets();
    drawEnemies();
    checkCollisions();
    drawText();
    drawMiniMap();

    if (message && Date.now() - messageTime < 3000){
      ctx.fillStyle = "#0ff";
      ctx.font = "18px monospace";
      ctx.fillText(message, 50, 420);
    }

    if (!apiValid && gameStarted && frameCounter++ > 3){
      alert("لعبة غير مكتملة");
      return;
    }

    requestAnimationFrame(loop);
  }

  function spawnMeteor(){
    let m = document.createElement("div");
    m.classList.add("meteor");
    m.style.width = (5 + Math.random()*15) + "px";
    m.style.height = (5 + Math.random()*15) + "px";
    m.style.left = Math.random()*window.innerWidth + "px";
    m.style.top = "-20px";
    body.appendChild(m);
    let speed = 2 + Math.random()*3;
    let interval = setInterval(()=>{
      let t = parseFloat(m.style.top);
      m.style.top = (t + speed) + "px";
      if (t > window.innerHeight){
        clearInterval(interval);
        m.remove();
      }
    }, 30);
  }

  setInterval(spawnMeteor, 500);

  function startGame(){
    if (gameStarted) return;
    gameStarted = true;
    setInterval(spawnEnemy, 1200);
    loop();
  }

  // Buttons:
  document.getElementById("startBtn").onclick = () => {
    if (!apiValid){
      alert("Please load valid DesMatters.api!");
      return;
    }
    splash.classList.add("hidden");
    mainMenu.classList.remove("hidden");
  };

  document.getElementById("storyBtn").onclick = () => {
    mainMenu.classList.add("hidden");
    canvas.classList.remove("hidden");
    mini.classList.remove("hidden");
    controls.classList.remove("hidden");
    startGame();
  };

  document.getElementById("leftBtn").onclick = () => player.x = Math.max(0, player.x - 15*gameSpeed);
  document.getElementById("rightBtn").onclick = () => player.x = Math.min(550, player.x + 15*gameSpeed);
  document.getElementById("shootBtn").onclick = shootBullet;

  document.getElementById("settingsBtn").onclick = () => {
    mainMenu.classList.add("hidden");
    settingsMenu.classList.remove("hidden");
  };

  document.getElementById("backMenuBtn").onclick = () => {
    settingsMenu.classList.add("hidden");
    mainMenu.classList.remove("hidden");
  };

  document.getElementById("volUpBtn").onclick = () => volume = Math.min(1, volume + 0.1);
  document.getElementById("volDownBtn").onclick = () => volume = Math.max(0, volume - 0.1);

  document.getElementById("loadModBtn").onclick = () => {
    const code = prompt("Enter JS Mod code (player, stage, ui available):");
    try {
      new Function("player","stage","ui", code)(player, {speed, crazyMode}, {ctx, mini, mctx});
      showMessage("Mod Loaded");
    } catch(e) {
      showMessage("Mod Error");
      console.error(e);
    }
  };

  document.getElementById("cheatBtn").onclick = () => {
    let code = prompt("Enter cheat code: SD31 XX8L | D4KJ 7A2M | CL91 VV1K");
    if (code == "SD31 XX8L") {
      score *= 2;
      showMessage("Score Multiplied!");
    } else if (code == "D4KJ 7A2M"){
      player.hp = 999;
      showMessage("Invincible!");
    } else if (code == "CL91 VV1K"){
      gameSpeed *= 2;
      showMessage("Speed Boost!");
    } else {
      showMessage("Invalid Code");
    }
  };

  document.getElementById("licenceBtn").onclick = () => {
    splash.classList.add("hidden");
    licence.classList.remove("hidden");
  };

  document.getElementById("licenceBackBtn").onclick = () => {
    licence.classList.add("hidden");
    splash.classList.remove("hidden");
  };

})();
