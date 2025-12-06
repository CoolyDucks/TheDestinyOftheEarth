// ====== DOM Elements ======
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const mainMenu = document.getElementById("mainMenu");
const settingsMenu = document.getElementById("settingsMenu");
const controls = document.getElementById("controls");

// ====== Game Variables ======
let gameStarted = false;
let score = 0;
let gameSpeed = 1;
let playerHP = 3;
let volume = 1;

// Player
let player = { x: 275, y: 370, w: 50, h: 50, color: "#00fffc" };

// Arrays
let bullets = [];
let enemies = [];
let meteors = [];
let particles = [];

// Movement flags
let moveLeft = false, moveRight = false;

// ====== Event Listeners ======
document.getElementById("storyBtn").onclick = startGame;
document.getElementById("leftBtn").onmousedown = () => moveLeft = true;
document.getElementById("leftBtn").onmouseup = () => moveLeft = false;
document.getElementById("rightBtn").onmousedown = () => moveRight = true;
document.getElementById("rightBtn").onmouseup = () => moveRight = false;
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

// ====== Functions ======
function shootBullet() {
    bullets.push({ x: player.x + 23, y: player.y, w: 5, h: 10, color: "#0ff" });
}

function spawnEnemy() {
    enemies.push({ x: Math.random() * 550, y: -50, w: 50, h: 50, color: "#ff0044" });
}

function spawnMeteor() {
    meteors.push({ x: Math.random() * 600, y: -20, size: 5 + Math.random() * 15, speed: 2 + Math.random() * 3 });
}

function spawnParticles(x, y) {
    for (let i = 0; i < 10; i++) {
        particles.push({ x, y, vx: (Math.random()-0.5)*4, vy: (Math.random()-0.5)*4, life: 30 });
    }
}

// ====== Draw Functions ======
function drawPlayer() { ctx.fillStyle = player.color; ctx.fillRect(player.x, player.y, player.w, player.h); }

function drawBullets() {
    bullets.forEach((b,i)=>{ ctx.fillStyle=b.color; ctx.fillRect(b.x,b.y,b.w,b.h); b.y-=7*gameSpeed; if(b.y<-10) bullets.splice(i,1); });
}

function drawEnemies() {
    enemies.forEach((e,i)=>{ ctx.fillStyle=e.color; ctx.fillRect(e.x,e.y,e.w,e.h); e.y+=2*gameSpeed; if(e.y>450) enemies.splice(i,1); });
}

function drawMeteors() {
    ctx.fillStyle="#888";
    meteors.forEach((m,i)=>{ ctx.beginPath(); ctx.arc(m.x,m.y,m.size,0,Math.PI*2); ctx.fill(); m.y+=m.speed; if(m.y>450) meteors.splice(i,1); });
}

function drawParticles() {
    particles.forEach((p,i)=>{ ctx.fillStyle="#0ff"; ctx.fillRect(p.x,p.y,2,2); p.x+=p.vx; p.y+=p.vy; p.life--; if(p.life<=0) particles.splice(i,1); });
}

// ====== Collision Detection ======
function checkCollisions() {
    enemies.forEach((e,ei)=>{
        bullets.forEach((b,bi)=>{
            if(b.x<e.x+e.w && b.x+b.w>e.x && b.y<e.y+e.h && b.y+b.h>e.y){
                spawnParticles(e.x+25,e.y+25);
                bullets.splice(bi,1); enemies.splice(ei,1); score++;
            }
        });
    });
}

// ====== Game Loop ======
function loop() {
    ctx.clearRect(0,0,600,450);

    // Move player
    if(moveLeft) player.x=Math.max(0,player.x-7*gameSpeed);
    if(moveRight) player.x=Math.min(550,player.x+7*gameSpeed);

    // Draw elements
    drawMeteors();
    drawPlayer();
    drawBullets();
    drawEnemies();
    drawParticles();
    checkCollisions();

    // HUD
    ctx.fillStyle="#00fffc";
    ctx.font="16px monospace";
    ctx.fillText("Score: "+score,10,20);
    ctx.fillText("HP: ❤️".repeat(playerHP),10,40);

    requestAnimationFrame(loop);
}

// ====== Start Game ======
function startGame(){
    mainMenu.classList.add("hidden");
    canvas.classList.remove("hidden");
    controls.classList.remove("hidden");
    if(!gameStarted){
        gameStarted=true;
        setInterval(spawnEnemy,1200);
        setInterval(spawnMeteor,500);
        loop();
    }
        }
