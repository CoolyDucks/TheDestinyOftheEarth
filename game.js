(function(){
  const splash = document.getElementById("splash");
  const licence = document.getElementById("licence");
  const mainMenu = document.getElementById("mainMenu");
  const settingsMenu = document.getElementById("settingsMenu");
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const mini = document.getElementById("miniMap");
  const mctx = mini.getContext("2d");
  const controls = document.getElementById("controls");

  let maxHP = 3, gameOver = false, speed = 2, score = 0, gameSpeed = 1;
  let crazyMode = false, message = "", messageTime = 0, gameStarted = false;
  let player = { x:275, y:370, w:50, h:50, color:"#ff0", hp:maxHP, fatMultiplier:1, shootColor:"#ff0" };
  let ground = [], bullets = [], enemyBullets = [], enemies = [];
  for(let i=0;i<30;i++){ground.push({x:Math.random()*560,y:Math.random()*450,w:50,h:5});}
  let volume=1;

  // Tips
  const tipsArr=["Tip 1","Tip 2","Tip 3","Tip 4"];
  const tipsDiv=document.getElementById("tips");
  setInterval(()=>{ tipsDiv.innerText=tipsArr[Math.floor(Math.random()*tipsArr.length)]; },3000);

  function randomColor(){return "#"+Math.floor(Math.random()*16777215).toString(16).padStart(6,"0");}

  function drawGround(){ctx.fillStyle=crazyMode?randomColor():"#050";ground.forEach(g=>{ctx.fillRect(g.x,g.y,g.w,g.h);g.y+=speed*gameSpeed;if(g.y>450){g.y=0;g.x=Math.random()*550;}});}
  function drawPlayer(){ctx.fillStyle=player.color;ctx.fillRect(player.x,player.y,player.w*player.fatMultiplier,player.h*player.fatMultiplier);}
  function drawBullets(){bullets.forEach(b=>{ctx.fillStyle=b.color||player.shootColor;ctx.fillRect(b.x,b.y,b.w,b.h);b.y-=7*gameSpeed;}); bullets=bullets.filter(b=>b.y>-10);}
  function drawEnemies(){ctx.fillStyle=crazyMode?randomColor():"#f00";enemies.forEach(e=>{ctx.fillRect(e.x,e.y,e.w,e.h);e.y+=speed*gameSpeed;if(Math.random()<0.01)enemyBullets.push({x:e.x+23,y:e.y+23,w:8,h:8});}); enemies=enemies.filter(e=>e.y<450);}
  function spawnEnemy(){enemies.push({x:Math.random()*550,y:-50,w:50,h:50});}
  function shootBullet(){bullets.push({x:player.x+23,y:player.y,w:5,h:10,color:player.shootColor});}
  function checkCollisions(){enemies.forEach((e,ei)=>{bullets.forEach((b,bi)=>{if(b.x<e.x+e.w && b.x+b.w>e.x && b.y<e.y+e.h && b.y+b.h>e.y){enemies.splice(ei,1);bullets.splice(bi,1);score++;}});if(player.x<e.x+e.w && player.x+player.w*player.fatMultiplier>e.x && player.y<e.y+e.h && player.y+player.h*player.fatMultiplier>e.y){player.hp--;enemies.splice(ei,1);if(player.hp<=0)gameOver=true;}});}
  function drawText(){ctx.fillStyle="#ff0";ctx.font="16px monospace";let hearts="❤️".repeat(player.hp);ctx.fillText("Score: "+score,10,20);ctx.fillText("HP: "+hearts,10,40);}
  function drawMiniMap(){mctx.fillStyle="#000";mctx.fillRect(0,0,225,90);mctx.fillStyle="#ff0";mctx.fillRect(player.x/2,70,5,5);mctx.fillStyle="#f00";enemies.forEach(e=>{mctx.fillRect(e.x/2,e.y/5,4,4);});}

  function loop(){ 
    if(gameOver) return;
    ctx.clearRect(0,0,600,450);
    drawGround(); drawPlayer(); drawBullets(); drawEnemies(); checkCollisions(); drawText(); drawMiniMap();
    requestAnimationFrame(loop);
  }

  function startGame(){if(gameStarted)return;gameStarted=true; setInterval(spawnEnemy,1200); loop();}

  // Buttons
  document.getElementById("startBtn").onclick=()=>{splash.classList.add("hidden");mainMenu.classList.remove("hidden");};
  document.getElementById("storyBtn").onclick=()=>{mainMenu.classList.add("hidden");canvas.classList.remove("hidden");mini.classList.remove("hidden");controls.classList.remove("hidden");startGame();};
  document.getElementById("leftBtn").onclick=()=>player.x=Math.max(0,player.x-15*gameSpeed);
  document.getElementById("rightBtn").onclick=()=>player.x=Math.min(550,player.x+15*gameSpeed);
  document.getElementById("shootBtn").onclick=shootBullet;
  document.getElementById("settingsBtn").onclick=()=>{mainMenu.classList.add("hidden");settingsMenu.classList.remove("hidden");};
  document.getElementById("backMenuBtn").onclick=()=>{settingsMenu.classList.add("hidden");mainMenu.classList.remove("hidden");};
  document.getElementById("volUpBtn").onclick=()=>volume=Math.min(1,volume+0.1);
  document.getElementById("volDownBtn").onclick=()=>volume=Math.max(0,volume-0.1);
  document.getElementById("licenceBtn").onclick=()=>{splash.classList.add("hidden");licence.classList.remove("hidden");};
  document.getElementById("licenceBackBtn").onclick=()=>{licence.classList.add("hidden");splash.classList.remove("hidden");};
})();
