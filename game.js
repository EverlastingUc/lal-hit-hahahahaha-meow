(() => {
  "use strict";
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  const ui = id => document.getElementById(id);
  const keys = Object.create(null);
  const worldWidth = 3900;
  const platforms = [
    [0,455,650,100],[720,420,250,135],[1030,455,480,100],
    [1580,410,260,145],[1900,455,470,100],[2430,420,280,135],
    [2780,455,430,100],[3260,410,260,145],[3570,455,400,100]
  ];
  const coins = [[250,390],[350,350],[800,355],[900,355],[1160,390],[1280,380],
    [1690,345],[1770,345],[2050,390],[2180,380],[2510,355],[2630,355],
    [2910,390],[3050,390],[3370,345],[3450,345],[3700,390]]
    .map(([x,y]) => ({x,y,taken:false}));
  const enemySeeds = [
    {x:500,min:430,max:610,y:417},{x:1330,min:1100,max:1450,y:417},
    {x:2150,min:1980,max:2300,y:417},{x:3000,min:2830,max:3150,y:417},
    {x:3450,min:3300,max:3480,y:372}
  ];
  let enemies = [];
  let particles = [];
  let state = "title", camera = 0, score = 0, coinCount = 0, health = 3, frame = 0;
  const player = {x:70,y:300,w:34,h:54,vx:0,vy:0,onGround:false,jumps:0,face:1,slash:0,invuln:0,anim:0};
  const clamp = (v,min,max) => Math.max(min,Math.min(max,v));
  const rect = (x,y,w,h,color) => {ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),w,h);};
  const rounded = (x,y,w,h,r,color) => {ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();};

  function reset() {
    Object.assign(player,{x:70,y:300,vx:0,vy:0,onGround:false,jumps:0,face:1,slash:0,invuln:0,anim:0});
    camera=0;score=0;coinCount=0;health=3;frame=0;particles=[];
    coins.forEach(c=>c.taken=false);
    enemies=enemySeeds.map(e=>({...e,alive:true,dir:1}));
    updateHud();
  }
  function updateHud(){
    ui("health").textContent=health;
    ui("coins").textContent=coinCount;
    ui("score").textContent=String(score).padStart(5,"0");
  }
  function showOverlay(title,text,button,kicker="WORLD 01 · FORGOTTEN VILLAGE"){
    ui("overlay-title").innerHTML=title;
    ui("overlay-text").textContent=text;
    ui("start").innerHTML=button+' <span>→</span>';
    ui("overlay-kicker").textContent=kicker;
    ui("overlay").hidden=false;
  }
  function hideOverlay(){ui("overlay").hidden=true;}
  function startGame(){
    if(state!=="playing") reset();
    state="playing";hideOverlay();canvas.focus();
  }
  function background(){
    const g=ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0,"#829fba");g.addColorStop(.58,"#d8b8a0");g.addColorStop(1,"#e9c99a");
    ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    for(let i=0;i<7;i++){
      const x=((i*210-camera*.16)%1300+1300)%1300-150;
      ctx.fillStyle=i%2?"#77899a":"#657c8c";ctx.beginPath();
      ctx.moveTo(x,340);ctx.lineTo(x+125,125+(i%3)*35);ctx.lineTo(x+260,340);ctx.fill();
    }
    ctx.fillStyle="#f8e2ae";ctx.beginPath();ctx.arc(760,125,48,0,Math.PI*2);ctx.fill();
    for(let i=0;i<5;i++){
      const x=((i*260-camera*.28)%1150+1150)%1150-100,y=95+(i%2)*65;
      ctx.fillStyle="#fff3df88";ctx.beginPath();ctx.arc(x,y,22,0,Math.PI*2);
      ctx.arc(x+25,y-8,28,0,Math.PI*2);ctx.arc(x+53,y,20,0,Math.PI*2);ctx.fill();
    }
    for(let i=0;i<5;i++){
      const x=((i*340-camera*.4)%1500+1500)%1500-120;
      rect(x,280,75,65,"#586b70");
      for(let j=0;j<3;j++){
        ctx.fillStyle="#43565e";ctx.beginPath();ctx.moveTo(x-15-j*7,285+j*20);
        ctx.lineTo(x+37,255+j*20);ctx.lineTo(x+90+j*7,285+j*20);ctx.fill();
      }
    }
    for(let i=0;i<11;i++){
      const x=((i*155-camera*.62)%1300+1300)%1300-100;
      rect(x+20,290,12,120,"#665044");
      for(let j=0;j<5;j++){
        ctx.fillStyle=["#e98d9a","#f2a6ac","#d97d91"][j%3];
        ctx.beginPath();ctx.arc(x+(j%3)*22,280+Math.floor(j/3)*22,28,0,Math.PI*2);ctx.fill();
      }
    }
  }
  function drawPlatform([x,y,w]){
    const sx=x-camera;rect(sx,y,w,100,"#5c493f");rect(sx,y,w,12,"#718b62");rect(sx,y+12,w,5,"#9a7657");
    for(let xx=12;xx<w;xx+=38){rect(sx+xx,y+29,2,14,"#493b36");rect(sx+xx+12,y+65,15,3,"#715749");}
  }
  function drawPlayer(){
    const x=player.x-camera,y=player.y;
    ctx.save();ctx.translate(x+player.w/2,y+player.h/2);ctx.scale(player.face,1);
    ctx.globalAlpha=.2;ctx.fillStyle="#18202b";ctx.beginPath();ctx.ellipse(0,30,24,5,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
    const step=player.onGround&&Math.abs(player.vx)>.1?Math.sin(player.anim)*4:0;
    rounded(-12,10+step,10,18,3,"#26364a");rounded(3,10-step,10,18,3,"#26364a");
    rect(-14,25+step,14,5,"#171f2b");rect(2,25-step,14,5,"#171f2b");
    rounded(-15,-13,30,29,7,"#c63e39");rect(-15,-4,30,6,"#f0c66e");rect(5,-13,5,29,"#8d272b");
    rounded(-21,-9,9,20,4,"#d64c43");rounded(12,-9,9,20,4,"#d64c43");
    ctx.fillStyle="#e9b995";ctx.beginPath();ctx.arc(0,-23,12,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#20232c";ctx.beginPath();ctx.arc(0,-27,12,Math.PI,Math.PI*2);ctx.fill();
    rect(-12,-26,25,4,"#f1c96e");rect(8,-25,15,3,"#f1c96e");
    ctx.fillStyle="#e34d42";ctx.beginPath();ctx.moveTo(-8,-17);ctx.lineTo(-23,-11);ctx.lineTo(-13,-4);ctx.fill();
    if(player.slash>0){
      ctx.strokeStyle="#f5f1dc";ctx.lineWidth=6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(13,-5);ctx.lineTo(43,-31);ctx.stroke();
      ctx.strokeStyle="#d7e7ec";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(17,-3);ctx.lineTo(47,-29);ctx.stroke();
      ctx.strokeStyle="#f4c66a";ctx.lineWidth=4;ctx.beginPath();ctx.arc(8,-4,10,-.7,.7);ctx.stroke();
    }else{
      ctx.strokeStyle="#dce5e7";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(15,3);ctx.lineTo(29,-13);ctx.stroke();
      ctx.strokeStyle="#d6a84f";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(13,2);ctx.lineTo(19,8);ctx.stroke();
    }
    ctx.restore();
  }
  function drawEnemy(e){
    const x=e.x-camera,y=e.y;
    rounded(x-15,y-27,30,27,9,"#3a4a62");
    ctx.fillStyle="#f1b78f";ctx.beginPath();ctx.arc(x,y-32,12,0,Math.PI*2);ctx.fill();
    rect(x-10,y-39,20,5,"#252b38");rect(x-8,y-33,5,3,"#f8e8cb");rect(x+3,y-33,5,3,"#f8e8cb");
    rect(x-13,y-2,10,5,"#263245");rect(x+3,y-2,10,5,"#263245");
  }
  function drawGate(){
    const x=3710-camera;rect(x,350,18,105,"#9d3534");rect(x+95,350,18,105,"#9d3534");
    rect(x-15,340,143,13,"#d34c40");rect(x-5,326,123,10,"#ed7560");rect(x+20,365,53,7,"#f1c66a");
  }
  function burst(x,y,color){
    for(let i=0;i<9;i++)particles.push({x,y,vx:(Math.random()-.5)*5,vy:(Math.random()-.5)*5,life:25,color});
  }
  function hurt(){
    if(player.invuln>0)return;
    health--;player.invuln=90;player.vy=-6;player.vx=-player.face*3;updateHud();
    if(health<=0){state="over";showOverlay("GAME <em>OVER</em>","Your score: "+score+" · Coins: "+coinCount+". Regroup and try again.","RETRY","THE VILLAGE IS NOT LOST");}
  }
  function update(){
    if(state!=="playing")return;frame++;
    const left=keys.ArrowLeft||keys.a||keys.A,right=keys.ArrowRight||keys.d||keys.D;
    player.vx=left?-4.1:right?4.1:0;if(player.vx)player.face=player.vx>0?1:-1;
    if(player.vx)player.anim+=.19;
    player.vy=Math.min(player.vy+.58,14);
    const oldY=player.y;player.x=clamp(player.x+player.vx,0,worldWidth-player.w);player.y+=player.vy;player.onGround=false;
    for(const [x,y,w] of platforms){
      if(player.x+player.w>x&&player.x<x+w&&oldY+player.h<=y+8&&player.y+player.h>=y&&player.vy>=0){
        player.y=y-player.h;player.vy=0;player.onGround=true;player.jumps=0;
      }
    }
    if(player.y>650){hurt();player.y=240;player.vy=0;}
    if(player.slash>0)player.slash--;if(player.invuln>0)player.invuln--;
    for(const c of coins){
      if(!c.taken&&Math.abs(player.x+17-c.x)<25&&Math.abs(player.y+25-c.y)<35){
        c.taken=true;coinCount++;score+=100;burst(c.x,c.y,"#f5c85e");
      }
    }
    for(const e of enemies)if(e.alive){
      e.x+=e.dir*1.1;if(e.x<e.min||e.x>e.max)e.dir*=-1;
      const px=player.x+17,py=player.y+28,ex=e.x,ey=e.y-16;
      if(player.slash>0&&Math.abs(px-ex)<58&&Math.abs(py-ey)<42){e.alive=false;score+=250;burst(ex,ey,"#ffdf91");}
      else if(player.invuln===0&&Math.abs(px-ex)<27&&Math.abs(py-ey)<35)hurt();
    }
    camera=clamp(player.x-W*.36,0,worldWidth-W);updateHud();
    if(player.x>3740){state="won";showOverlay("VILLAGE <em>CLEARED!</em>","You reached the Forgotten Village gate. Coins collected: "+coinCount+". The next chapter awaits.","PLAY AGAIN","CHAPTER 01 COMPLETE");}
  }
  function draw(){
    background();platforms.forEach(drawPlatform);
    for(const c of coins)if(!c.taken){
      const x=c.x-camera;ctx.fillStyle="#f5c85e";ctx.beginPath();ctx.ellipse(x,c.y,8,12,Math.sin(frame/10)*.2,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle="#fff0b1";ctx.lineWidth=2;ctx.stroke();
    }
    enemies.forEach(e=>{if(e.alive)drawEnemy(e);});drawGate();
    for(let i=particles.length-1;i>=0;i--){
      const p=particles[i];p.x+=p.vx;p.y+=p.vy;p.life--;ctx.globalAlpha=Math.max(0,p.life/25);
      rect(p.x-camera,p.y,4,4,p.color);ctx.globalAlpha=1;if(p.life<=0)particles.splice(i,1);
    }
    if(player.invuln===0||Math.floor(frame/6)%2===0)drawPlayer();
    for(let x=0;x<W;x+=28){
      ctx.strokeStyle="#405d49";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,455);ctx.lineTo(x-4,446);ctx.moveTo(x,455);ctx.lineTo(x+5,448);ctx.stroke();
    }
  }
  function loop(){update();draw();requestAnimationFrame(loop);}
  function jump(){
    if(state!=="playing")return;
    if(player.jumps<2){player.vy=player.jumps===0?-12.5:-11;player.jumps++;player.onGround=false;}
  }
  function slash(){if(state==="playing")player.slash=16;}
  function keyDown(e){
    const k=e.key;
    if(["ArrowLeft","ArrowRight","ArrowUp"," ","x","X"].includes(k))e.preventDefault();
    if(keys[k])return;keys[k]=true;
    if(k===" "||k==="ArrowUp"||k==="w"||k==="W")jump();
    if(k==="x"||k==="X")slash();
    if(k==="r"||k==="R"){reset();state="playing";hideOverlay();}
  }
  addEventListener("keydown",keyDown);
  addEventListener("keyup",e=>{keys[e.key]=false;});
  ui("start").addEventListener("click",startGame);
  reset();showOverlay("SAMURAI <em>RUN</em>","Run, jump and slash your way through the village. Collect every coin you can and reach the red torii gate.","START ADVENTURE");
  loop();
})();