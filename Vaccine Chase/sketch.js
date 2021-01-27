//declaring global variables
var scientist, scientistImage;
var backGround, bgImage, bgImage2;
var invisibleGround;
var edges;

var virus, virusGroup, virusIMG1, virusIMG2, virusIMG3, virusIMG4;
var vaccine, vaccineGroup, vaccineIMG;
var elixir, elixirGroup, elixirIMG1, elixirIMG2;

var score=0;
var gameState = "start1";

var nextButton, nextButtonIMG;
var playButton, playButtonIMG;
var restartButton, restartButtonIMG;
var gameOver, gameOverIMG;

var endSound, scoringPointsSound, bonusPointsSound;


function preload(){
  //loading the start gameState background image
  bgImage = loadImage("Images/bg-start-zoomed.png");

  //loading the lab Image for backgorund
  bgImage2 = loadImage("Images/Lab.png");

  //loading the scientist's running animation
  scientistImage = loadImage("Images/Robot.png");

  //loading virus images
  virusIMG1 = loadImage("Images/Virus-1.png");
  virusIMG2 = loadImage("Images/Virus-2.png");
  virusIMG3 = loadImage("Images/Virus-3.png");
  virusIMG4 = loadImage("Images/Virus-4.png");

  //loading the vaccine image
  vaccineIMG = loadImage("Images/Vaccine-1.png");

  //loading elixir images
  elixirIMG1 = loadImage("Images/Mask-1.png");
  elixirIMG2 = loadImage("Images/Sanitizer-1.png");

  //loading the image for the next button
  nextButtonIMG = loadImage("Images/nextButton-1.png")

  //loading the image for the play button
  playButtonIMG = loadImage("Images/PlayButton-1.png");

  //loading the image for the replay button
  restartButtonIMG = loadImage("Images/restart-2.png");

  //laoding the image for the game over label
  gameOverIMG = loadImage("Images/gameOver-2.png");

  //loading the sound effects
  endSound = loadSound("Sound-Effects/game-over.wav");
  scoringPointsSound = loadSound("Sound-Effects/scoring-points.wav");
  bonusPointsSound = loadSound("Sound-Effects/scoring-bonus-points.wav");
}

function setup(){
  createCanvas(850, 500);

  //creating the background sprite
  backGround = createSprite(425, 220, 1000, 400);
  backGround.addAnimation("startImage", bgImage);
  backGround.addAnimation("playImage", bgImage2);
  backGround.scale = 1.1;
  backGround.x = backGround.width/2;

  //creating the PC - scientist
  scientist = createSprite(70, 470, 10, 10);
  scientist.addImage(scientistImage);
  scientist.scale = 0.17;

  //creating an invisible ground
  invisibleGround = createSprite(500,480,1000,20);
  invisibleGround.visible = false;

  //creating groups
  virusGroup = createGroup();
  vaccineGroup = createGroup();
  elixirGroup = createGroup();

  //creating a sprite for the next button
  nextButton = createSprite(670, 430, 10, 10);
  nextButton.addImage(nextButtonIMG);
  nextButton.scale = 0.2;
  nextButton.visible = false;

  //creating a sprite for the play button
  playButton = createSprite(780, 430, 10, 10);
  playButton.addImage(playButtonIMG);
  playButton.scale = 0.4;
  playButton.visible = false;
  
  //creating a sprite for the replay button
  restartButton = createSprite(425, 200, 10, 10);
  restartButton.addImage(restartButtonIMG);
  restartButton.scale = 0.5;
  restartButton.visible = false;

  //creating a sprite for the game over label
  gameOver = createSprite(425, 100, 10, 10);
  gameOver.addImage(gameOverIMG);
  gameOver.scale = 0.5;
  gameOver.visible = false;

}

function draw(){
  background(220);
  edges = createEdgeSprites();

  //colliding the scientist the bottom edge
  scientist.collide(invisibleGround);

  drawSprites();

  if(gameState === "start1"){
    //setting the velocity of the background
    backGround.velocityX = 0;

    //for the visibility of buttons(play and next)
    nextButton.visible = true;
    playButton.visible = false;  

    //for moving to the next game state
    if(mousePressedOver(nextButton)){
      moveToStart2();
    }

    //for displaying game instructions
    noStroke();
    fill("white");
    textSize(35);
    textFont("Jokerman");
    text("COVID  VACCINE  CHASE", 230, 220);
    textSize(20);
    text("-coded by Ishika Garg", 470, 270);
    //text("GAME INSTRUCTIONS:\n" + "1.  ", 100, 150);

  }
  else if(gameState === "start2"){
    //setting the velocity of the background
    backGround.velocityX = 0;

    //for the visibility of buttons(play and next)
    nextButton.visible = false;
    playButton.visible = true;

    //to continue playing the game
    if(mousePressedOver(playButton)){
      moveToPlay();
    }

    //displaying game instructions
    noStroke();
    fill("white");
    textSize(29);
    textFont("Times New Roman");
    text("GAME  INSTRUCTIONS:", 170, 130);
    textSize(23);
    textFont("Calibri");
    text("1. Use the up arrow key to jump and dodge viruses.\n" 
         + "2. Collect the vaccines to increase points.\n"
         + "3. Collect elixirs(masks and sanitizers) to get bonus points. ", 170, 180);


     //for moving to the next game state
     if(keyDown("space")){
      moveToPlay();
    }

  }

  else if(gameState === "play"){
    //setting the velocity of the background
    backGround.velocityX = -3;

    //for the visibility of buttons(play and next)
    nextButton.visible = false;
    playButton.visible = false;

    //changing the backgrund to the lab
    backGround.changeAnimation("playImage", bgImage2);

    //reseting
    if (backGround.x < 260){
      backGround.x = backGround.width/2;
    }

    //to enable the scientist to jump
    if (keyDown("up")){
      scientist.velocityY = -10;
    }

    //adding gravity
    scientist.velocityY+= 0.4;

    //calling the functions
    spawnVirus();
    spawnVaccine();
    spawnElixir();

    //scoring
    if(vaccineGroup.isTouching(scientist)){
      scoringPointsSound.play();
      score+=10;
      vaccineGroup.destroyEach();
    }

    if(elixirGroup.isTouching(scientist)){
      bonusPointsSound.play();
      score+=50;
      elixirGroup.destroyEach();
    }

    //for displaying score
    stroke("black");
    fill("black");
    textSize(25);
    textFont("Georgia");
    text("Score:" + score, 50, 50);

    //ending the game
    if(virusGroup.isTouching(scientist)){
      endSound.play();
      gameState = "end";
    }


  }
  else if(gameState === "end"){
    //setting the velocity of each game object to 0
    backGround.velocityX = 0;
    scientist.velocityY = 0;
    vaccineGroup.setVelocityXEach(0);
    virusGroup.setVelocityXEach(0);
    elixirGroup.setVelocityXEach(0);

    //setting the lifetime of the game objects so that they are never destroyed
    vaccineGroup.setLifetimeEach(-1);
    virusGroup.setLifetimeEach(-1);
    elixirGroup.setLifetimeEach(-1);

    //for the visibility of buttons(play, next and restart) and game over label
    nextButton.visible = false;
    playButton.visible = false;
    restartButton.visible = true; 
    gameOver.visible = true;

    //replaying
    if(mousePressedOver(restartButton)){
      reset();
    }
    
    //for displaying score
    stroke("black");
    fill("black");
    textSize(25);
    textFont("Georgia");
    text("Score:" + score, 50, 50);

  }
}

function moveToStart2(){
  gameState = "start2";
}

function moveToPlay(){
  gameState = "play";
}

function reset(){
  gameState = "play";

  restartButton.visible = false;
  gameOver.visible = false;

  virusGroup.destroyEach();
  vaccineGroup.destroyEach();
  elixirGroup.destroyEach();

  score = 0;
}

function spawnVirus(){
  if (frameCount % 180 === 0){
    virus = createSprite(850, random(340, 450), 10, 10);
    
    //setting velocity and scale
    virus.velocityX = -3;
    virus.scale = 0.2;
    
    //setting lifetime
    virus.lifetime = 285;

    //adding images to the sprite
    var rand = Math.round(random(1, 4));

    switch(rand){
      case 1: virus.addImage(virusIMG1);
              break;
      case 2: virus.addImage(virusIMG2);
              break;     
      case 3: virus.addImage(virusIMG3);
              break;
      case 4: virus.addImage(virusIMG4);
              break;
    }

    //defining depths
    virus.depth = scientist.depth;
    scientist.depth+=1;

    //adding virus to group
    virusGroup.add(virus);
    
  }
}

function spawnVaccine(){
  if (frameCount % 250 === 0){
    vaccine = createSprite(860, random(240, 350), 10, 10);
    vaccine.addImage(vaccineIMG);

    //setting velocity and scale
    vaccine.velocityX = -3;
    vaccine.scale = 0.3; 

    //setting lifetime
    vaccine.lifetime = 285;

    //setting depths
    vaccine.depth = scientist.depth;
    scientist.depth+=1;

    //adding the vaccine to group
    vaccineGroup.add(vaccine);
  }
}

function spawnElixir(){
  if (frameCount % 800 === 0){
    elixir = createSprite(860, random(240, 350), 10, 10);

    //setting velocity and scale
    elixir.velocityX = -3;
    elixir.scale = 0.5 

    //setting lifetime
    elixir.lifetime = 285;

    //adding images to the sprite
    var rand = Math.round(random(1, 2));

    switch(rand){
      case 1: elixir.addImage(elixirIMG1);
              break;
      case 2: elixir.addImage(elixirIMG2);
              break;  
    }          

    //setting depths
    elixir.depth = scientist.depth;
    scientist.depth+=1;

    //adding the vaccine to group
    elixirGroup.add(elixir);
  }
}


/*var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloud, cloudImage, cloudsGroup;
var obstacle, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6, obstaclesGroup;
var score = 0;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png")
  obstacle6 = loadImage("obstacle6.png");
  
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -2;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
}

function draw() {
  background(0);
  
  //calculating score
  score = score + Math.round(getFrameRate()/60);
  text ("Score: " + score, 520, 25);
  
  console.log("frameRate "+getFrameRate());
  
  //to enable to t-rex to jump
  if(keyDown("space")) {
    trex.velocityY = -10;
  }
  
  //adding gravity
  trex.velocityY = trex.velocityY + 0.8
  
  //reseting the ground
  if (ground.x < 0){
    ground.x = ground.width/2;
  }
  
  trex.collide(invisibleGround);
  
  //to spawn clouds and obstacles
  spawnClouds();
  spawnObstacles();
  
  drawSprites();
}

function spawnClouds() {
 if (frameCount % 60 === 0) {
  cloud = createSprite(600, random(80,120), 10, 10 );
  cloud.addImage(cloudImage);
  
  //to set velocity and scale it
  cloud.velocityX = -3;
  cloud.scale = 0.5;
   
  //to set a lifetime 
  cloud.lifetime = 200;
  
  //to adjust the depth
  cloud.depth = trex.depth;
  trex.depth = trex.depth + 1; 
   
  //to add it to the group
  cloudsGroup.add(cloud); 
 }
}

function spawnObstacles() {
 if (frameCount % 80 === 0) {
   obstacle = createSprite(600, 165, 10, 40);
   
   //to set a velocity and scale it
   obstacle.velocityX = -4;
   obstacle.scale = 0.5;
   
   //generating a random number
   var rand = Math.round(random(1,6));
   
   switch(rand) {
    case 1: obstacle.addImage(obstacle1);
            break;
    case 2: obstacle.addImage(obstacle2);
            break;
    case 3: obstacle.addImage(obstacle3);
            break;
    case 4: obstacle.addImage(obstacle4);
            break;
    case 5: obstacle.addImage(obstacle5);
            break;
    case 6: obstacle.addImage(obstacle6);
            break;
    default: break;
   }   
   
   //to set a lifetime
   obstacle.lifetime = 150;
   
   //adding it to the group
   obstaclesGroup.add(obstacle);
 }
}*/