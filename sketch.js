var PLAY=1;
var END=0;
var gameState=PLAY;

var trex,trex_running,edges,ground_image,cloud,score;

function preload(){
  
  trex_running=loadAnimation("trex1.png","trex3.png","trex4.png");
  ground_image=loadImage("ground2.png");
  cloud_image=loadImage("cloud.png");
  
  obstacle1=loadImage("obstacle1.png");
  obstacle2=loadImage("obstacle2.png");
  obstacle3=loadImage("obstacle3.png");
  obstacle4=loadImage("obstacle4.png");
  obstacle5=loadImage("obstacle5.png");
  obstacle6=loadImage("obstacle6.png");
  
  trex_collided=loadAnimation("trex_collided.png");
  
  gameOverImg=loadImage("gameOver.png");
  restartImg=loadImage("restart.png");
  
  jumpsound=loadSound("jump.mp3");
  diesound=loadSound("die.mp3");
  checkpointsound=loadSound("checkPoint.mp3");
}

function setup(){
  
  createCanvas(windowWidth,windowHeight);
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running",trex_running);
  trex.addAnimation("collided",trex_collided);
  edges=createEdgeSprites();
  
  trex.scale=0.5;
  trex.x=50;
  
  trex.setCollider("circle",0,0,40);
  trex.debug='true';
  
  console.log(width);
  
  ground = createSprite(width/2,height-70,width,20);
  ground.addImage("ground1",ground_image);
  ground.x=ground.width/2;
  
  gameover=createSprite(width/2,height/2-50);
  gameover.addImage("gameoverImg",gameOverImg);
  
  restartimage=createSprite(width/2,height/2);
  restartimage.addImage("res",restartImg);
  
  gameover.scale=0.5;
  restartimage.scale=0.5;

  gameover.visible=false;
  restartimage.visible=false;

  invisible_ground=createSprite(width/2,height-60,width,10);
  invisible_ground.visible=false;
  
  score=0;
  
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
}

function draw(){
  
  background(180);
  
  //console.log(trex.y);
  
  text(mouseX+","+mouseY,mouseX,mouseY);
  
  text("Score: "+score,500,50);
	
  if (gameState===PLAY){
    ground.velocityX=-(4+3*score/100);
    score=score+Math.round(getFrameRate()/60);
    
    if(ground.x<0){
      ground.x=ground.width/2;
    }  
      
    if(touches.length>0||keyDown("space") && trex.y>=height-120){
      trex.velocityY=-12;
      jumpsound.play();
      touches=[];
    }
    
    if (score>0 && score%100===0){
      checkpointsound.play();
    }
    
    trex.velocityY=trex.velocityY+0.5;
  
    spawnCloud();
    spawnObstacles();
    
    if (obstaclesGroup.isTouching(trex)){
      //trex.velocityY=-12;
      //jumpsound.play();
      gameState=END;
      diesound.play();
    }
    
  }
  
  else if(gameState===END){
    
    gameover.visible=true;
    restartimage.visible=true;
    
    if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = []
    }
    
    ground.velocityX=0;
    trex.velocityY=0;
    
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    trex.changeAnimation("collided",trex_collided);
    
  
  }
    
  trex.collide(invisible_ground);
  
  drawSprites();
}

function reset(){
  gameState=PLAY;
  gameover.visible=false;
    restartimage.visible=false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  score=0;
}

function spawnCloud(){
  if(frameCount % 60 === 0){
  cloud=createSprite(width+20,height-300,40,10);
  cloud.addImage("clouds",cloud_image);
  cloud.velocityX=-3;
  cloud.scale=0.5;
  cloud.y=Math.round(random(80,100));
  cloud.lifetime=190;
  cloud.depth=trex.depth;
  trex.depth=trex.depth+1;
  cloudsGroup.add(cloud);
  }
 }


function spawnObstacles(){
   if(frameCount%60===0){
    var obstacles = createSprite(width+20,height-95,10,40);
    obstacles.velocityX=-(6+score/100);
    obstacles.debug='true';
    
    var rand = Math.round(random(1,6));
    
    switch(rand){
      case 1: obstacles.addImage(obstacle1);
              break;
      case 2: obstacles.addImage(obstacle2);
              break;
      case 3: obstacles.addImage(obstacle3);
              break;
      case 4: obstacles.addImage(obstacle4);
              break;
      case 5: obstacles.addImage(obstacle5);
              break;
      case 6: obstacles.addImage(obstacle6);
              break;
      default: break;
    }
    obstacles.scale=0.5;
    obstacles.lifetime=150;
    obstaclesGroup.add(obstacles);
  }
}
