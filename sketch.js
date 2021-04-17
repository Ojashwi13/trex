//gameStates 
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var soundjump, checkpoint, sounddie

var trex, trex_running, trex_stop;

var edges;

var ground, groundImage, invisibleGround;

var cloud, cloudImage, cloudsGroup;

var obstacle, obstacleImage1, obstacleImage2, obstacleImage3, obstacleImage4, obstacleImage5, obstacleImage6, obstaclesGroup;

var score = 0;

var gameOver, gameOverImage;

var restart, restartImage;

//load up all assets 
function preload() {
  //loading up trex running animation 
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  
  trex_stop = loadImage ("trex_collided.png")

  //load up ground image 
  groundImage = loadImage("ground2.png");


  cloudImage = loadImage("cloud.png");


  obstacleImage1 = loadImage("obstacle1.png")


  obstacleImage2 = loadImage("obstacle2.png")


  obstacleImage3 = loadImage("obstacle3.png")


  obstacleImage4 = loadImage("obstacle4.png")


  obstacleImage5 = loadImage("obstacle5.png")


  obstacleImage6 = loadImage("obstacle6.png");
  
  restartImage = loadImage("restart.png");

  gameOverImage = loadImage("gameOver.png");
  
  soundjump = loadSound("jump.mp3");

  sounddie = loadSound("die.mp3");
  
  checkpoint = loadSound("checkPoint.mp3");
  
}

//repeats itself only once 
function setup() {

  var message = "this is the message";
  
  
  //creates a canvas 
  createCanvas(600, 200);

  //trex sprite and properties 
  trex = createSprite(50, 160, 10, 40);
  trex.debug = true;
  trex.setCollider("circle",0,0,40);
  trex.addAnimation("run", trex_running);
  trex.addImage ("dead", trex_stop);
  trex.scale = 0.5;

  //create edges
  edges = createEdgeSprites();

  //ground and its properties
  ground = createSprite(300, 180, 600, 20);
  ground.addImage("ground", groundImage);

  restart = createSprite(275,100,10,10)
  restart.addImage("restart",restartImage);
  restart.scale = 0.5
  
  gameOver = createSprite(275,75,10,10);
  gameOver.addImage("gameOver",gameOverImage);
  gameOver.scale = 0.5
  
  //invisible ground and its properties 
  invisibleGround = createSprite(300, 190, 600, 10);
  invisibleGround.visible = false;

  obstaclesGroup = new Group();
  cloudsGroup = new Group();

}


//repeats itself every frame 
function draw() {
  //to clear the screen 
  background("white");
  //console.log ("This is"+ gameState);
  text("score: " + score, 500, 20)

  if (gameState === PLAY) {
   gameOver.visible = false;
   restart.visible = false;
    // score = score + Math.round(frameCount / 60);
    if (frameCount%5===0){
        score=score+1;  
        }
    if (score>0&&score%100===0){
      checkpoint.play ();
    }
    
    ground.velocityX = -(4+3*score/100);
   
    //infinite ground
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    } //make the trex jump
 
    if (keyDown("space") && trex.y >= 161.5) {
      trex.velocityY = -10;
      soundjump.play ();
    }

    //adding gravity 
    trex.velocityY = trex.velocityY + 0.5;
    
    spawnClouds();

    spawnObstacles();
    
    if (obstaclesGroup.isTouching (trex)){
       gameState = END;
      sounddie.play ();
        } 
    
  } else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    ground.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    trex.changeAnimation("dead", trex_stop);
    trex.velocityY = 0;
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
  }

if (mousePressedOver (restart))
  {
    reset();
  }
  //stop trex from fallig off the ground 
  trex.collide(invisibleGround);

  
  //display all sprites on screen
  drawSprites();

  //console.log(trex.y)
  //console.log ("sand"+9)
}
function reset(){
  gameState = PLAY;
  trex.changeAnimation("run");
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0;
}


function spawnClouds() {
  if (frameCount % 60 === 0) {
    cloud = createSprite(600, 34, 25, 69);
    cloud.addImage("clouds", cloudImage);
    cloud.velocityX = -3
    cloud.lifetime = 220
    cloud.y = Math.round(random(5, 60))
    // console.log(trex.depth);
    //console.log(cloud.depth);
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1

    cloudsGroup.add(cloud);
  }

}

function spawnObstacles() {
  if (frameCount % 100 === 0) {
    obstacle = createSprite(600, 161.5, 25, 69);
    obstacle.velocityX = -(4+3*score/100);
    var rand = Math.round(random(1, 6))
    switch (rand) {
      case 1:
        obstacle.addImage(obstacleImage1);
        break;
      case 2:
        obstacle.addImage(obstacleImage2);
        break;
      case 3:
        obstacle.addImage(obstacleImage3);
        break;
      case 4:
        obstacle.addImage(obstacleImage4);
        break;
      case 5:
        obstacle.addImage(obstacleImage5);
        break;
      case 6:
        obstacle.addImage(obstacleImage6);
        break;
      default:
        break;
    }
    obstacle.scale = 0.6;
    obstacle.lifetime = 170;

    obstaclesGroup.add(obstacle)
  }
}