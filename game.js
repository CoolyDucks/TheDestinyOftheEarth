(function(){
  const body = document.body;
  const splash = document.getElementById("splash");
  const licence = document.getElementById("licence");
  const mainMenu = document.getElementById("mainMenu");
  const settingsMenu = document.getElementById("settingsMenu");
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const mini = document.getElementById("miniMap");
  const mctx = mini.getContext("2d");
  const controls = document.getElementById("controls");

  const doomShoot = new Audio("https://www.soundjay.com/mechanical/sounds/mechanical-gun-01.ogg");
  const doomKill  = new Audio("https://www.soundjay.com/mechanical/sounds/mechanical-hit-01.ogg");

  const tipsArr = [
    "did you no loki hate spider man",
    "try Fortnite logo odeesy",
    "Original game is From GitHub mean original version is from GitHub",
    "Try X ray Ultimate in Minecraft and get banned sucker",
    "Cj follow the train",
    "Another Versions From Destiny is not original only GitHub"
  ];
  const tipsDiv = document.getElementById("tips");
  setInterval(()=>{ 
    tipsDiv.innerText = tipsArr[Math.floor(Math.random()*tipsArr.length)]; 
  }, 2000);

  let maxHP = 3,
      gameOver = false,
      speed = 2,
      score = 0,
      gameSpeed = 1,
      crazyMode = false,
      message = "",
      messageTime = 0,
      gameStarted = false;
  
  let player = {
    x: 275, y: 370,
    w: 50, h: 50,
    color: "#ff0",
    hp: maxHP,
    fatMultiplier: 1,
    shootColor: "#ff0"
  };
  let ground = [], bullets = [], enemyBullets = [], enemies = [];
  let volume = 1;

  for(let i=0; i<30; i++){
    ground.push({ x: Math.random()*560, y: Math.random()*450, w:50, h:5 });
  }

  let apiValid = false, frameCounter = 0;

  document.getElementById("apiFile").onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    if (text.includes("screenloop.ini") && text.includes("googlecode.ini") && text.includes("map.ini"))
      apiValid = true;
    else {
      apiValid = false;
      alert("API file invalid!");
    }
  };

  function randomColor(){
    let l = "0123456789ABCDEF";
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
