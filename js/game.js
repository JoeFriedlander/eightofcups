/*
Eight Of Cups by Joe Friedlander
Inspired by Alchemy from PopCap Games
*/

'use strict';

let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
document.getElementById("gameCanvas").style.cursor = "none";
//if mobile, cursor is invisible and current shape appears on side of screen
let isMobile = false;
if((navigator.userAgent.indexOf('IEMobile') !== -1) || typeof window.orientation !== "undefined"){
    isMobile = true;
};
//disables right click causing menu to popup.
canvas.oncontextmenu = function() {
    return false;
};
const gameHeight = canvas.height-6;
const gameWidth = canvas.width-6;


//LEVEL =======================================================================
//Holds level information and manages changing levels.
let level = {
    level: 1,
    maxLevel: 5,
    pause: false,
    x:70,
    y:460,
    width:120,
    height:80,
    highlightSize: 5,
    boardFinished() {
        //timer.stopCountdown();
        lineCompleteSound.currentTime = 0;
        lineCompleteSound.play();
        level.setLevelOver(true);
        board.clearAndFlashBoard("nextLevel", "white");
        cauldron.resetLevel();
        board.resetShapePlaced();
        shape.setOmniShape();
    },
    startNextLevel(){
            background.setDrawImageForeground(false);
            level.incLevel();
            score.score = 0;
            level.setLevelOver(false);
            board.resetBoard();
            /*if(level.level>1){
                timer.startCountdown();
            }*/
    },
    drawNextLevelButton(){
        if(level.pause && !tutorial.tutorialActive && !menu.menuActive){
            ctx.fillStyle = "white";
            ctx.font = "20pt Garamond3Medium";
            if(level.level==0){
                ctx.fillText("Begin",level.x+24, level.y+45);
            }
            else if(level.level<5){
                ctx.fillText("Next Level",level.x-2, level.y+40);
            }
            else{
                ctx.fillText("You win! x" + parseInt(level.level-4, 10),level.x-2, level.y+15);
                ctx.fillText("Play this",level.x-2, level.y+40);
                ctx.fillText("level again",level.x-2, level.y+65);
            }
        }
    },
    levelHighlight(){
        if(level.pause && !tutorial.tutorialActive && !menu.menuActive&& !board.isResetCleaning && !board.isNextLevelCleaning){
            if((mouse.lastInfo.x > level.x-level.highlightSize) && (mouse.lastInfo.x < level.x + level.width+level.highlightSize) && (mouse.lastInfo.y > level.y-level.highlightSize) && (mouse.lastInfo.y < level.y + level.height+level.highlightSize)) {
                ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
                ctx.fillRect(level.x-level.highlightSize, level.y-level.highlightSize, level.width + level.highlightSize, level.height + level.highlightSize);
                return 1;
            }
        }
    },
    isMouseOver(){
        if(level.levelHighlight()===1){
            return true;
        }
    },
    resetLevel() {
        boardResetSound.currentTime = 0;
        boardResetSound.play();
        deleteAllDustParticles();
        deleteAllGoldParticles();
        board.clearAndFlashBoard("cauldron", "rgb(52,53,44)");
        cauldron.resetLevel();
        board.resetShapePlaced();
        shape.setOmniShape();
        score.resetScore();
        /*if(level.level>1){
            timer.resetCountdown();
        }*/
    },
    incLevel(){
        level.level++;
    },
    setLevelOver(s){
        level.pause = s;
    }
};

//SCORE =======================================================================
//Holds score information and manages score changes.
let score = {
    flashSize: "small",
    starCost: 1000,
    score: 0,
    x: 60,
    y: 130,
    buttonX: 50,
    buttonY: 150,
    width: 130,
    height: 50,
    highlightSize: 1,
    scoreFlash: false,
    scoreFlashTime: 300,
    draw() {
        if(!tutorial.tutorialActive && !menu.menuActive){
            ctx.fillStyle = "white";
            ctx.font = "25pt Garamond3Medium";
            ctx.fillText("Gold: ", score.x, score.y);
            ctx.fillStyle = "gold";

            if(!score.scoreFlash){
                if(score.score===0){
                    ctx.fillStyle = "white";
                }
                ctx.font = "23pt Garamond3Medium";
                ctx.fillText(score.score, score.x+78, score.y);
            }
            else if(score.flashSize==="small"){
                ctx.font = "26pt Garamond3Medium";
                ctx.fillText(score.score, score.x+75, score.y+3);
            }
            else if(score.flashSize==="medium"){
                ctx.font = "40pt Garamond3Medium";
                ctx.fillText(score.score, score.x+68, score.y+6);
            }
            else if(score.flashSize==="large"){
                ctx.font = "60pt Garamond3Medium";
                ctx.fillText(score.score, score.x+53, score.y+12);
            }
            shape.drawSquareShape("omni", "white", score.buttonX, score.buttonY);
            ctx.fillStyle = "white";
            ctx.font = "20pt Garamond3Medium";
            if(score.score >= score.starCost){
                ctx.fillStyle = "gold";
            }
            ctx.fillText(score.starCost + "g", score.buttonX+45, score.buttonY+36);
        }
    },
    addScore(size) {
        scoreSound.currentTime = 0;
        scoreSound.play();
        if(size===5){
            score.score+=20;
            score.flashSize = "small";
        }
        else if(size===12){
            score.score+=200;
            score.flashSize = "medium";
        }
        else if(size===25){
            score.score+=1000;
            score.flashSize = "large";
        }
        score.scoreFlash = true;
        setTimeout(function(){score.scoreFlash = false;}, score.scoreFlashTime);
    },
    resetScore() {
        score.score = 0;
    },
    scoreHighlight() {
        if(level.pause===false && score.score>=score.starCost && !tutorial.tutorialActive && !menu.menuActive){
            if((mouse.lastInfo.x > score.buttonX-score.highlightSize) && (mouse.lastInfo.x < score.buttonX + score.width+score.highlightSize) && (mouse.lastInfo.y > score.buttonY-score.highlightSize) && (mouse.lastInfo.y < score.buttonY + score.height+score.highlightSize)) {
                ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
                ctx.fillRect(score.buttonX-score.highlightSize, score.buttonY-score.highlightSize, score.width + (2*score.highlightSize), score.height + (2*score.highlightSize));
                return 1;
            }
        }
    },
    isMouseOver() {
        if(score.scoreHighlight()===1){
            return true;
        }
    },
    buy() {
        if(score.score>= score.starCost){
            scoreSound.currentTime = 0;
            scoreSound.play();
            score.score = score.score-score.starCost;
            shape.setOmniShape();
        }
    }
};

//GOLD PARTICLES ==============================================================
//Gold Score Particles. Effect is to launch in random direction then head towards
//score bar. When hits score bar, adds to score.
let gold = {
    goldParticles: {},
    goldParticleIndex:0,
    GoldParticle: function(x, y, size){
        this.x = x;
        this.y = y;
        this.size = size;
        this.randomX = Math.random() * 60 - 30;
        this.randomY = Math.random() * 60 - 30;
        this.speed = 0;
        this.radius = this.size;
        gold.goldParticles[gold.goldParticleIndex] = this;
        this.id = gold.goldParticleIndex;
        gold.goldParticleIndex++;
    }
};
gold.GoldParticle.prototype.draw = function(){
    //distance from score bar
    let distanceX = score.x+70 - this.x;
    let distanceY = score.y-20 - this.y;
    let distanceToScoreBar = Math.sqrt(((distanceX*distanceX) + (distanceY*distanceY)));
    //angle to score bar
    let angleToScoreBar = Math.atan2(distanceY, distanceX)*180/Math.PI;
    // Vector
    this.speed = (distanceToScoreBar*.04) + 6;
    this.x += (this.speed * Math.cos(((angleToScoreBar+this.randomX)*Math.PI)/180));
    this.y += (this.speed * Math.sin(((angleToScoreBar+this.randomY)*Math.PI)/180));
    //If near score bar, disappear and add score
    if(Math.abs(distanceX)< 25 && Math.abs(distanceY) < 40){
        delete gold.goldParticles[this.id];
        score.addScore(this.size);
    }
    //Reduce randomness so particle heads in right direction
    if(this.randomY > 0){
        this.randomY--;
    }
    if(this.randomY < 0){
        this.randomY++;
    }
    if(this.randomX > 0){
        this.randomX--;
    }
    if(this.randomX < 0){
        this.randomX++;
    }
    //draw
    ctx.beginPath();
    ctx.fillStyle = "hsla(51, 100%, 50%, 1)";
    ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
    ctx.fill();
};
function makeGoldParticles(x, y, size){
    new gold.GoldParticle(x + Math.random() * 40 - 20, y-(board.squareSize/2) + Math.random() * 15 - 20, size);
};
function deleteAllGoldParticles(){
    for(let i in gold.goldParticles){
        delete gold.goldParticles[i];
    }
};
function drawGoldParticles(){
    for(let i in gold.goldParticles){
        gold.goldParticles[i].draw();
    }
};

//TIMER =======================================================================
/*let timer = {
    x: 60,
    y: 70,
    levelTimes: {1:"5", 2:"401", 3:"351", 4:"301", 5:"301"},
    currentTime: 300,
    stop: false,
    id: 0,
    draw() {
        ctx.beginPath();
        ctx.font = "25pt Garamond3Medium";
        ctx.fillStyle = "white";
        if(level.level > 1){
            //checks time
            if(timer.currentTime <= 0 && !level.pause){
                level.resetLevel();
            }
            if(timer.currentTime < 31){
                ctx.font = "30pt Garamond3Medium";
                ctx.fillStyle = "red";
            }
            ctx.fillText("Time: " + timer.currentTime, timer.x, timer.y);
        }
        else if (level.level===1){
            ctx.fillText("Time: " + "∞", timer.x, timer.y);
        }
    },
    startCountdown(){
        timer.stop = false;
        if(level.level <= level.maxLevel){
            timer.currentTime = parseInt(timer.levelTimes[level.level], 10);
            timer.countdown();
        }
        else{
            timer.currentTime = parseInt(timer.levelTimes[5], 10);
            timer.countdown();
        }

    },
    countdown(){
        timer.id = setInterval(function(){timer.currentTime--;}, 1000);
    },
    stopCountdown(){
        clearInterval(timer.id);
    },
    resetCountdown(){
        clearInterval(timer.id);
        timer.startCountdown();
    }

};
*/
//CAULDRON ====================================================================
//Manages cauldron information. When cauldron level is 3 and is incremented,
//level resets.
let cauldron = {
    level: 0,
    x: 90,
    y: 250,
    width: 60,
    height: 140,
    wallWidth: 4,
    baseHeight: 6,
    highlightSize: 10,
    incLevel() {
        if(board.shapePlaced){
            if(level.pause===false && board.isResetCleaning===false && board.isNextLevelCleaning===false && !tutorial.tutorialActive && !menu.menuActive){
                if(cauldron.level===3) {
                    level.resetLevel();
                }
                else {
                    putInCauldronSound.play();
                    cauldron.level++;
                    shape.generateShape();
                }
            }
        }
    },
    resetLevel() {
        cauldron.level = 0;
    },
    drawCauldron() {
        if(!menu.menuActive || tutorial.tutorialActive){
            //walls
            ctx.fillStyle = "black";
            ctx.fillRect(cauldron.x, cauldron.y, cauldron.wallWidth, cauldron.height);
            ctx.fillRect(cauldron.x+cauldron.width-cauldron.wallWidth, cauldron.y, cauldron.wallWidth, cauldron.height);
            ctx.fillRect(cauldron.x, cauldron.y+cauldron.height-cauldron.baseHeight, cauldron.width, cauldron.baseHeight);
            //levels
            ctx.globalAlpha = .7;
            ctx.fillStyle = "green";
            if(cauldron.level==1){
                ctx.fillRect(cauldron.x+cauldron.wallWidth, cauldron.y+(.75*(cauldron.height-cauldron.baseHeight)), cauldron.width-(2*cauldron.wallWidth), .25*(cauldron.height-cauldron.baseHeight));
            }
            else if(cauldron.level==2){
                ctx.fillStyle = "yellow";
                ctx.fillRect(cauldron.x+cauldron.wallWidth, cauldron.y+(.45*(cauldron.height-cauldron.baseHeight)), cauldron.width-(2*cauldron.wallWidth), .55*(cauldron.height-cauldron.baseHeight));
            }
            else if(cauldron.level==3){
                ctx.fillStyle = "red";
                ctx.fillRect(cauldron.x+cauldron.wallWidth, cauldron.y, cauldron.width-(2*cauldron.wallWidth), cauldron.height-cauldron.baseHeight);
            }
            ctx.globalAlpha = 1;
        }
    },
    cauldronHighlight() {
        if(level.pause===false && !tutorial.tutorialActive && !menu.menuActive){
            if((board.shapePlaced) && (mouse.lastInfo.x > cauldron.x-cauldron.highlightSize) && (mouse.lastInfo.x < cauldron.x + cauldron.width+cauldron.highlightSize) && (mouse.lastInfo.y > cauldron.y-cauldron.highlightSize) && (mouse.lastInfo.y < cauldron.y + cauldron.height+cauldron.highlightSize)) {
                ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
                ctx.fillRect(cauldron.x-cauldron.highlightSize, cauldron.y-cauldron.highlightSize, cauldron.width + (2*cauldron.highlightSize), cauldron.height + (2*cauldron.highlightSize));
                return 1;
            }
        }
    },
    isMouseOver() {
        if(cauldron.cauldronHighlight()===1){
            return true;
        }
    }
};

//DECK ========================================================================
//Manages deck information. Each level causes one extra card to be filled in.
let deck = {
    x:285,
    y:25,
    width:20,
    height:28,
    padding:81,
    card1Active: false,
    card2Active: false,
    card3Active: false,
    card4Active: false,
    card5Active: false,

    drawDeck() {
        //assigns over and over, fix this
        if(!tutorial.tutorialActive && !menu.menuActive){
            if(level.level>0 && level.pause){
                deck.card1Active = true;
            }
            if(level.level>1 && level.pause){
                deck.card5Active = true;
            }
            if(level.level>2 && level.pause){
                deck.card2Active = true;
            }
            if(level.level>3 && level.pause){
                deck.card4Active = true;
            }
            if(level.level>4 && level.pause){
                deck.card3Active = true;
            }
            ctx.strokeStyle = "rgb(0,0,0)";
            ctx.fillStyle = "purple";
            ctx.lineWidth = 2;
            deck.drawCardOne();
            deck.drawCardTwo();
            deck.drawCardThree();
            deck.drawCardFour();
            deck.drawCardFive();
        }
    },
    drawCardOne(){
        ctx.beginPath();
        ctx.rect(deck.x, deck.y, deck.width, deck.height);
        ctx.stroke();
        if(deck.card1Active){
            ctx.fill();
        }
    },
    drawCardTwo(){
        ctx.beginPath();
        ctx.rect(deck.x+1*(deck.width+deck.padding), deck.y, deck.width, deck.height);
        ctx.stroke();
        if(deck.card2Active){
            ctx.fill();
        }
    },
    drawCardThree(){
        ctx.beginPath();
        ctx.rect(deck.x+2*(deck.width+deck.padding), deck.y, deck.width, deck.height);
        ctx.stroke();
        if(deck.card3Active){
            ctx.fill();
        }
    },
    drawCardFour(){
        ctx.beginPath();
        ctx.rect(deck.x+3*(deck.width+deck.padding), deck.y, deck.width, deck.height);
        ctx.stroke();
        if(deck.card4Active){
            ctx.fill();
        }
    },
    drawCardFive(){
        ctx.beginPath();
        ctx.rect(deck.x+4*(deck.width+deck.padding), deck.y, deck.width, deck.height);
        ctx.stroke();
        if(deck.card5Active){
            ctx.fill();
        }
    }
};

//SHAPE =======================================================================
//Manages shape information. Each level adds more shapes and colors available.
//Draws shapes for display on the board and on mouse. Must adjust x and y coords
//so they display correctly on mouse.
let shape = {
    currentShape: {shape: "omni", color: "white"},
    shapes: ["circle","triangle","square","semiCircle","fool","tower","tomb","wand","cup"],
    colors: ["red","blue","green","darkmagenta", "white", "#FFFB00", "black", "cyan"],

    setOmniShape(){
        shape.currentShape.shape = "omni";
        shape.currentShape.color = "white";
    },
    generateShape() {
        //could also use value of level.level to set number of playable shapes
        if(level.level===1){
            shape.currentShape.shape = shape.shapes[(Math.floor(Math.random()*5))];
            shape.currentShape.color = shape.colors[(Math.floor(Math.random()*4))];
        }
        else if(level.level===2){
            shape.currentShape.shape = shape.shapes[(Math.floor(Math.random()*6))];
            shape.currentShape.color = shape.colors[(Math.floor(Math.random()*5))];
        }
        else if(level.level===3){
            shape.currentShape.shape = shape.shapes[(Math.floor(Math.random()*7))];
            shape.currentShape.color = shape.colors[(Math.floor(Math.random()*6))];
        }
        else if(level.level===4){
            shape.currentShape.shape = shape.shapes[(Math.floor(Math.random()*8))];
            shape.currentShape.color = shape.colors[(Math.floor(Math.random()*7))];
        }
        else{
            shape.currentShape.shape = shape.shapes[(Math.floor(Math.random()*9))];
            shape.currentShape.color = shape.colors[(Math.floor(Math.random()*8))];
        }

        if(Math.floor(Math.random()*100) < 1){
            shape.setOmniShape();
        }
    },
    drawSquareShape(shape, color, x, y){
    //must adjust x and y value so shape in middle of square
        ctx.lineWidth = 2;
        if (shape==="circle"){
            ctx.beginPath();
            ctx.arc(x+28,y+28,25,0,2*Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }
        else if (shape==="triangle"){
            ctx.beginPath();
            ctx.moveTo(x, y+52);
            ctx.lineTo(x+55, y+52);
            ctx.lineTo(x+28, y+2);
            ctx.lineTo(x, y+52);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }
        else if (shape==="square"){
            ctx.beginPath();
            ctx.rect(x+3, y+3, 50, 50);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }
        else if (shape==="semiCircle"){
            ctx.beginPath();
            ctx.arc(x+28,y+17,25,0,Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
            //draws line above
            ctx.beginPath();
            ctx.moveTo(x+3, y+17);
            ctx.lineTo(x+53, y+17);
            ctx.stroke();
            ctx.closePath();
        }
        else if (shape==="fool"){
            ctx.beginPath();
            ctx.arc(x+15,y+15,10,0,2*Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            ctx.moveTo(x+15, y+15);
            ctx.lineTo(x+40, y+40);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            ctx.arc(x+40,y+40,10,0,2*Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }
        else if (shape==="tower"){
            ctx.beginPath();
            ctx.rect(x+25, y+5, 10, 45);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            ctx.moveTo(x+40, y+10);
            ctx.lineTo(x+7, y+45);
            ctx.lineTo(x+13, y+50);
            ctx.lineTo(x+45, y+16);
            ctx.lineTo(x+40, y+10);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }
        else if (shape==="tomb"){
            ctx.beginPath();
            ctx.rect(x+5, y+30, 45, 15);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            ctx.rect(x+12.5, y+10, 30, 15);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }
        else if (shape==="wand"){
            ctx.beginPath();
            ctx.rect(x+10, y+5, 10, 45);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            ctx.rect(x+36, y+5, 10, 45);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            ctx.arc(x+28,y+18,7,0,2*Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }
        else if (shape==="cup"){
            ctx.beginPath();
            ctx.arc(x+28,y+12,15,0,Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
            //draws line above
            ctx.beginPath();
            ctx.moveTo(x+13, y+12);
            ctx.lineTo(x+43, y+12);
            ctx.stroke();
            ctx.closePath();
            //triangle
            ctx.beginPath();
            ctx.moveTo(x+13, y+42);
            ctx.lineTo(x+43, y+42);
            ctx.lineTo(x+28, y+27);
            ctx.lineTo(x+13, y+42);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }
        else if (shape==="omni"){
            //circle
            ctx.beginPath();
            ctx.arc(x+28,y+28,14,0,2*Math.PI);
            ctx.fillStyle = "white";
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
            //front star
            ctx.beginPath();
            ctx.fillStyle="black";
            ctx.lineWidth = 5;
            ctx.moveTo(x+28, y+28);
            ctx.lineTo(x+16, y+21);
            ctx.lineTo(x+28, y+28);
            ctx.lineTo(x+28, y+14);
            ctx.lineTo(x+28, y+28);
            ctx.lineTo(x+40, y+21);
            ctx.lineTo(x+28, y+28);
            ctx.lineTo(x+37, y+40);
            ctx.lineTo(x+28, y+28);
            ctx.lineTo(x+19, y+40);
            ctx.stroke();
            ctx.lineWidth = 2;
            ctx.closePath();
        }
    },
    drawCursor(){
    //must adjust x and y value so shape in middle of cursor
    //Cursor shapes are a bit smaller than square shapes for
    //artistic effect. Unfortunately this means copying a lot
    //of the code a second time, so not DRY. Could solve by
    //using images instead of canvas drawings or using
    //canvas translate and scale
        ctx.lineWidth = 2;
        if (!isMobile){
            if (shape.currentShape.shape==="circle"){
                ctx.beginPath();
                ctx.arc(mouse.lastInfo.x,mouse.lastInfo.y,14,0,2*Math.PI);
                ctx.fillStyle = shape.currentShape.color;
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
            }
            else if (shape.currentShape.shape==="triangle"){
                ctx.beginPath();
                ctx.moveTo(mouse.lastInfo.x-15, mouse.lastInfo.y);
                ctx.lineTo(mouse.lastInfo.x+15, mouse.lastInfo.y);
                ctx.lineTo(mouse.lastInfo.x, mouse.lastInfo.y-28);
                ctx.lineTo(mouse.lastInfo.x-15, mouse.lastInfo.y);
                ctx.fillStyle = shape.currentShape.color;
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
            }
            else if (shape.currentShape.shape==="square"){
                ctx.beginPath();
                ctx.rect(mouse.lastInfo.x - 15, mouse.lastInfo.y - 15, 30, 30);
                ctx.fillStyle = shape.currentShape.color;
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
            }
            else if (shape.currentShape.shape==="semiCircle"){
                ctx.beginPath();
                ctx.arc(mouse.lastInfo.x,mouse.lastInfo.y,14,0,Math.PI);
                ctx.fillStyle = shape.currentShape.color;
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
                //draws line above
                ctx.beginPath();
                ctx.moveTo(mouse.lastInfo.x-14, mouse.lastInfo.y);
                ctx.lineTo(mouse.lastInfo.x+14, mouse.lastInfo.y);
                ctx.stroke();
                ctx.closePath();
            }
            else if (shape.currentShape.shape==="fool"){
                ctx.beginPath();
                ctx.arc(mouse.lastInfo.x,mouse.lastInfo.y,10,0,2*Math.PI);
                ctx.fillStyle = shape.currentShape.color;
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
                ctx.beginPath();
                ctx.moveTo(mouse.lastInfo.x, mouse.lastInfo.y);
                ctx.lineTo(mouse.lastInfo.x+25, mouse.lastInfo.y+10);
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
                ctx.beginPath();
                ctx.arc(mouse.lastInfo.x+25,mouse.lastInfo.y+10,10,0,2*Math.PI);
                ctx.fillStyle = shape.currentShape.color;
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
            }
            else if(shape.currentShape.shape==="tower"){
                ctx.beginPath();
                ctx.rect(mouse.lastInfo.x - 5, mouse.lastInfo.y - 10, 6, 28);
                ctx.fillStyle = shape.currentShape.color;
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
                ctx.beginPath();
                ctx.moveTo(mouse.lastInfo.x+10, mouse.lastInfo.y-10);
                ctx.lineTo(mouse.lastInfo.x-15, mouse.lastInfo.y+12);
                ctx.lineTo(mouse.lastInfo.x-10, mouse.lastInfo.y+16);
                ctx.lineTo(mouse.lastInfo.x+11, mouse.lastInfo.y-5);
                ctx.lineTo(mouse.lastInfo.x+10, mouse.lastInfo.y-10);
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
            }
            else if (shape.currentShape.shape==="tomb"){
                ctx.beginPath();
                ctx.rect(mouse.lastInfo.x-14, mouse.lastInfo.y, 24, 8);
                ctx.fillStyle = shape.currentShape.color;
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
                ctx.beginPath();
                ctx.rect(mouse.lastInfo.x-10, mouse.lastInfo.y-15, 15, 8);
                ctx.fillStyle = shape.currentShape.color;
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
            }
            else if (shape.currentShape.shape==="wand"){
                ctx.beginPath();
                ctx.rect(mouse.lastInfo.x+3, mouse.lastInfo.y-15, 6, 25);
                ctx.fillStyle = shape.currentShape.color;
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
                ctx.beginPath();
                ctx.rect(mouse.lastInfo.x-13, mouse.lastInfo.y-15, 6, 25);
                ctx.fillStyle = shape.currentShape.color;
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
                ctx.beginPath();
                ctx.arc(mouse.lastInfo.x-2,mouse.lastInfo.y-8,4,0,2*Math.PI);
                ctx.fillStyle = shape.currentShape.color;
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
            }
            else if (shape.currentShape.shape==="cup"){
                ctx.beginPath();
                ctx.arc(mouse.lastInfo.x+5,mouse.lastInfo.y-8,9,0,Math.PI);
                ctx.fillStyle = ctx.fillStyle = shape.currentShape.color;
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
                //draws line above
                ctx.beginPath();
                ctx.moveTo(mouse.lastInfo.x-4.5, mouse.lastInfo.y-8);
                ctx.lineTo(mouse.lastInfo.x+15, mouse.lastInfo.y-8);
                ctx.stroke();
                ctx.closePath();
                //triangle
                ctx.beginPath();
                ctx.moveTo(mouse.lastInfo.x-3, mouse.lastInfo.y+10);
                ctx.lineTo(mouse.lastInfo.x+12, mouse.lastInfo.y+10);
                ctx.lineTo(mouse.lastInfo.x+5, mouse.lastInfo.y+3);
                ctx.lineTo(mouse.lastInfo.x-3, mouse.lastInfo.y+10);
                ctx.fillStyle = ctx.fillStyle = shape.currentShape.color;
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
             }
            else if (shape.currentShape.shape==="omni"){
                //circle
                ctx.beginPath();
                ctx.arc(mouse.lastInfo.x,mouse.lastInfo.y,9,0,2*Math.PI);
                ctx.fillStyle = "white";
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
                //front star
                ctx.beginPath();
                ctx.fillStyle="black";
                ctx.lineWidth = 3;
                ctx.moveTo(mouse.lastInfo.x, mouse.lastInfo.y);
                ctx.lineTo(mouse.lastInfo.x-8, mouse.lastInfo.y-3);
                ctx.lineTo(mouse.lastInfo.x, mouse.lastInfo.y);
                ctx.lineTo(mouse.lastInfo.x, mouse.lastInfo.y-10);
                ctx.lineTo(mouse.lastInfo.x, mouse.lastInfo.y);
                ctx.lineTo(mouse.lastInfo.x+8, mouse.lastInfo.y-3);
                ctx.lineTo(mouse.lastInfo.x, mouse.lastInfo.y);
                ctx.lineTo(mouse.lastInfo.x+5, mouse.lastInfo.y+8);
                ctx.lineTo(mouse.lastInfo.x, mouse.lastInfo.y);
                ctx.lineTo(mouse.lastInfo.x-5, mouse.lastInfo.y+8);
                ctx.stroke();
                ctx.lineWidth = 2;
                ctx.closePath();
                }
        }
        else {
            ctx.font = "16px Arial";
            ctx.fillStyle = "black";
            shape.drawSquareShape(shape.currentShape.shape, shape.currentShape.color, 95, 440);
        }
    }
};

//BOARD =======================================================================
//Manages board information and main game logic: If shape is available to be placed,
//clearing board, adding to board, etc.
let board = {
    squareColor: "rgba(78,79,66,.96)",
    squareColorDusted: "rgba(237, 211, 113,.8)",
    paddingColor: "rgb(0,0,0)",
    columnCount: 8,
    rowCount: 9,
    squareSize:55,
    squarePadding: 2.1,
    squareOffsetTop: 65,
    squareOffsetLeft: 255,
    squares: [],
    squareFlashArray: [],
    lineFlashArray: [],
    lineFlashLifespan: 180,
    squareFlashLifespan: 50,
    shapePlaced: false,
    //Makes sure player doesn't change the board in middle of cleaning and cause problems.
    isResetCleaning: false,
    isNextLevelCleaning: false,
    //checks if total squares are the same as dusted squares, if so then board is completed
    //and moves onto the next level with a bonus
    checkCompletedBoard(){
        let totalSquares = board.columnCount * board.rowCount;
        let dustedSquaresCount = 0;
        for(let checkColumn=0; checkColumn<board.columnCount; checkColumn++) {
            for(let checkRow=0; checkRow<board.rowCount; checkRow++) {
                let s = board.squares[checkColumn][checkRow];
                if (board.squares[checkColumn][checkRow].dusted===1) {
                    dustedSquaresCount++;
                }
            }
        }
        if (dustedSquaresCount===totalSquares){
            level.boardFinished();
        }
    },
    checkCompletedLine(column, row){
        //checks down column
        let currentColumnFilledCount = 0;
        let columnComplete = false;
        let rowComplete = false;
        for(let checkRow=0; checkRow<board.rowCount; checkRow++) {
            if(board.squares[column][checkRow].taken===1) {
                currentColumnFilledCount++;
            }
        }
        //if complete
        if(currentColumnFilledCount===board.rowCount) {
            columnComplete = true;
        }

        //checks accross row
        let currentRowFilledCount = 0;
        for(let checkColumn=0; checkColumn<board.columnCount; checkColumn++) {
            if(board.squares[checkColumn][row].taken===1) {
                currentRowFilledCount++;
            }
        }
        //if complete
        if(currentRowFilledCount===board.columnCount) {
            rowComplete = true;
        }

        //if both complete
        if(columnComplete && rowComplete){
            lineCompleteSound.currentTime = 0;
            lineCompleteSound.play();
            cauldron.resetLevel();
            board.clearLine("column", column, true);
            board.addLineFlash("column", column, "white");
            board.clearLine("row", row, true);
            board.addLineFlash("row", row, "white");
            makeGoldParticles(mouse.lastInfo.x, mouse.lastInfo.y, 25);
            if(Math.floor(Math.random()*100) < 10){
                shape.setOmniShape();
            }
        }
        else if(columnComplete){
            board.clearLine("column", column, true);
            board.addLineFlash("column", column, "white");
            if(Math.floor(Math.random()*100) < 10){
                shape.setOmniShape();
            }
            lineCompleteSound.currentTime = 0;
            lineCompleteSound.play();
            cauldron.resetLevel();
            makeGoldParticles(mouse.lastInfo.x, mouse.lastInfo.y, 12);
        }
        else if(rowComplete){
            board.clearLine("row", row, true);
            board.addLineFlash("row", row, "white");
            if(Math.floor(Math.random()*100) < 10){
                shape.setOmniShape();
            }
            lineCompleteSound.currentTime = 0;
            lineCompleteSound.play();
            cauldron.resetLevel();
            makeGoldParticles(mouse.lastInfo.x, mouse.lastInfo.y, 12);
        }
        return (columnComplete || rowComplete);

    },
    isValidSquare(c,r){
        let connected = 0;
        let blocked = 0;
        //checks square above
        //If Top Row, don't check above
        if (r==0){
            //pass
        }
        //If above is a valid shape
        else if ((shape.currentShape.shape===board.squares[c][r-1].shape) || (shape.currentShape.color===board.squares[c][r-1].color) || (board.squares[c][r-1].shape==="omni")){
            connected = 1;
        }
        //If above is empty
        else if (board.squares[c][r-1].shape==="") {
            //pass
        }
        //If above is not valid shape
        else {
            blocked = 1;
        }

        //checks square below
        if (r==board.rowCount-1){
            //pass
        }
        else if ((shape.currentShape.shape===board.squares[c][r+1].shape) || (shape.currentShape.color===board.squares[c][r+1].color) || (board.squares[c][r+1].shape==="omni")){
            connected = 1;
        }
        else if (board.squares[c][r+1].shape==="") {
            //pass
        }
        else {
            blocked = 1;
        }

        //checks square to left
        if (c==0){
            //pass
        }
        else if ((shape.currentShape.shape===board.squares[c-1][r].shape) || (shape.currentShape.color===board.squares[c-1][r].color) || (board.squares[c-1][r].shape==="omni")){
            connected = 1;
        }
        else if (board.squares[c-1][r].shape==="") {
            //pass
        }
        else {
            blocked = 1;
        }
        //checks square to right
        if (c==board.columnCount-1){
            //pass
        }
        else if ((shape.currentShape.shape===board.squares[c+1][r].shape) || (shape.currentShape.color===board.squares[c+1][r].color) || (board.squares[c+1][r].shape==="omni")){
            connected = 1;
        }
        else if (board.squares[c+1][r].shape==="") {
            //pass
        }
        else {
            blocked = 1;
        }

        if ((connected===1 && blocked===0) || shape.currentShape.shape==="omni") {
            return true;
        }

    },
    placeShape(c, r){
        let whichSound = Math.floor(Math.random()*2);
        if(whichSound===0){
            shapePlaced1Sound.currentTime = 0;
            shapePlaced1Sound.play();
        }
        else{
            shapePlaced2Sound.currentTime = 0;
            shapePlaced2Sound.play();
        }
        if(!board.squares[c][r].dusted){
            makeDustParticles((board.squares[c][r].x + (board.squareSize/2)), (board.squares[c][r].y + (board.squareSize/2)));
        }
        board.squares[c][r].dusted = 1;
        board.squares[c][r].taken = 1;
        board.squares[c][r].shape = shape.currentShape.shape;
        board.squares[c][r].color = shape.currentShape.color;
        shape.generateShape();
        let lineCompleted = board.checkCompletedLine(c, r);
        if(!lineCompleted){
            makeGoldParticles((board.squares[c][r].x + (board.squareSize/2)), (board.squares[c][r].y + (board.squareSize/2)), 5);
        }
        board.checkCompletedBoard();
        board.shapePlaced = true;
    },
    attemptToPlaceShape(){
        //Checks if space is empty, connected, and same color or shape, omni can go anywhere.
        //Careful not to check outside of array.
        if(level.pause===false && board.isResetCleaning===false && board.isNextLevelCleaning===false && !tutorial.tutorialActive && !menu.menuActive){
            for(let c=0; c<board.columnCount; c++) {
                for(let r=0; r<board.rowCount; r++) {
                    if(mouse.lastInfo.x > board.squares[c][r].x && mouse.lastInfo.x < board.squares[c][r].x+board.squareSize && mouse.lastInfo.y > board.squares[c][r].y && mouse.lastInfo.y < board.squares[c][r].y+board.squareSize && board.squares[c][r].taken===0) {
                        if(board.isValidSquare(c,r)){
                            board.placeShape(c,r);
                        }
                    }
                }
            }
        }
    },
    generateSquareArray() {
        for(let c=0; c<board.columnCount; c++) {
            board.squares[c] = [];
            for(let r=0; r<board.rowCount; r++) {
                board.squares[c][r] = { x: 0, y: 0, taken: 0, dusted: 0, shape: "", color: "", invisible: 1};
            }
        }
    },
    drawSquares() {
        for(let c=0; c<board.columnCount; c++) {
            for(let r=0; r<board.rowCount; r++) {
                let squareX = (c*(board.squareSize+board.squarePadding))+board.squareOffsetLeft;
                let squareY = (r*(board.squareSize+board.squarePadding))+board.squareOffsetTop;
                board.squares[c][r].x = squareX;
                board.squares[c][r].y = squareY;
                ctx.beginPath();
                ctx.rect(squareX, squareY, board.squareSize, board.squareSize);
                if(board.squares[c][r].invisible===1) {
                    //pass
                }
                else if(board.squares[c][r].taken===0 && board.squares[c][r].dusted===0) {
                    ctx.fillStyle = board.squareColor;
                    ctx.fill();
                }
                else if(board.squares[c][r].taken===1 && board.squares[c][r].dusted===0){
                    ctx.fillStyle = board.squareColor;
                    ctx.fill();
                    shape.drawSquareShape(board.squares[c][r].shape, board.squares[c][r].color, squareX, squareY);
                }
                else if(board.squares[c][r].taken===1 && board.squares[c][r].dusted===1){
                    ctx.fillStyle = board.squareColorDusted;
                    ctx.fill();
                    shape.drawSquareShape(board.squares[c][r].shape, board.squares[c][r].color, squareX, squareY);
                }
                else if(board.squares[c][r].dusted===1){
                    ctx.fillStyle = board.squareColorDusted;
                    ctx.fill();
                }
            }
        }
    },
    drawPadding(){
        //if end of level, doesn't draw extra lines extending out from board
        if(!level.pause && !tutorial.tutorialActive && !menu.menuActive){
            //draws padded lines down column, adds extra for art
            for(let c=0; c<board.columnCount+1; c++) {
                ctx.beginPath();
                ctx.fillStyle = board.paddingColor;
                ctx.fillRect(board.squareOffsetLeft + c*(board.squareSize+board.squarePadding)-board.squarePadding, board.squareOffsetTop, board.squarePadding, (board.rowCount*(board.squareSize + board.squarePadding)) + .25*board.squareSize);
            }
            //draws padded lines accross rows. adds extra for art
            for(let r=0; r<board.rowCount+1; r++) {
                ctx.beginPath();
                ctx.fillStyle = board.paddingColor;
                ctx.fillRect(board.squareOffsetLeft-2, board.squareOffsetTop + r*(board.squareSize+board.squarePadding)-board.squarePadding, (board.columnCount*(board.squareSize + board.squarePadding))+ .5*board.squareSize, board.squarePadding);
            }
        }
        else if (level.pause && !tutorial.tutorialActive && !menu.menuActive){
            //draws padded lines down column
            for(let c=0; c<board.columnCount+1; c++) {
                ctx.beginPath();
                ctx.fillStyle = board.paddingColor;
                ctx.fillRect(board.squareOffsetLeft + c*(board.squareSize+board.squarePadding)-board.squarePadding, board.squareOffsetTop, board.squarePadding, (board.rowCount*(board.squareSize + board.squarePadding)));
            }
            //draws padded lines accross rows
            for(let r=0; r<board.rowCount+1; r++) {
                ctx.beginPath();
                ctx.fillStyle = board.paddingColor;
                ctx.fillRect(board.squareOffsetLeft-2, board.squareOffsetTop + r*(board.squareSize+board.squarePadding)-board.squarePadding, (board.columnCount*(board.squareSize + board.squarePadding)), board.squarePadding);
            }
        }

    },
    squareHighlight() {
        if(level.pause===false && !tutorial.tutorialActive && !menu.menuActive){
            for(let c=0; c<board.columnCount; c++) {
                for(let r=0; r<board.rowCount; r++) {
                    let s = board.squares[c][r];
                    if(mouse.lastInfo.x > s.x && mouse.lastInfo.x < s.x+board.squareSize && mouse.lastInfo.y > s.y && mouse.lastInfo.y < s.y+board.squareSize && board.squares[c][r].taken===0) {
                        ctx.beginPath();
                        ctx.fillStyle = "white";
                        ctx.fillRect(s.x, s.y, board.squareSize, board.squareSize);
                        ctx.fill();
                        return 1;
                    }
                }
            }
        }
    },
    isMouseOver() {
        if(board.squareHighlight()===1){
            return true;
        }
    },
    clearLine(rowOrColumn, num, dust){
        if(rowOrColumn==="column"){
            for(let rowToReset=0; rowToReset<board.rowCount; rowToReset++) {
                if(dust===true){
                    board.squares[num][rowToReset].dusted = 1;
                }
                else{
                    board.squares[num][rowToReset].dusted = 0;
                }
                board.squares[num][rowToReset].taken = 0;
                board.squares[num][rowToReset].shape = "";
                board.squares[num][rowToReset].color = "";
            }
        }
        else if (rowOrColumn==="row"){
            for(let columnToReset=0; columnToReset<board.columnCount; columnToReset++) {
                if(dust===true){
                    board.squares[columnToReset][num].dusted = 1;
                }
                else{
                    board.squares[columnToReset][num].dusted = 0;
                }
                board.squares[columnToReset][num].taken = 0;
                board.squares[columnToReset][num].shape = "";
                board.squares[columnToReset][num].color = "";
            }
        }
    },
    clearSquare(column, row, invisible){
            board.squares[column][row].invisible = 1;
            board.squares[column][row].taken = 0;
            board.squares[column][row].shape = "";
            board.squares[column][row].color = "";
    },
    clearAndFlashBoard(style, flashColor){
        if(style==="cauldron"){
            board.isResetCleaning = true;
            for(let c=0; c<board.columnCount; c++) {
                setTimeout(function(){board.addLineFlash("column", c, flashColor);}, c*60);
                setTimeout(function(){board.clearLine("column", c, false);}, c*60);
            }
            setTimeout(function(){board.isResetCleaning = false}, 600);
        }
        else if(style==="nextLevel"){
            board.isNextLevelCleaning = true;
            for(let c=0; c<board.columnCount; c++) {
                for(let r=0; r<board.rowCount; r++) {
                    setTimeout(function(){board.addSquareFlash(c, r, flashColor);}, c*500 + r*50);
                    setTimeout(function(){board.clearSquare(c, r, true);}, c*500 + r*50);
                }
            }
            setTimeout(function(){board.isNextLevelCleaning = false}, 4000);
            setTimeout(function(){background.setDrawImageForeground(true)}, 4000);
        }
    },
    resetBoard(){
        for(let c=0; c<board.columnCount; c++) {
            for(let r=0; r<board.rowCount; r++) {
                board.squares[c][r].taken = 0;
                board.squares[c][r].dusted = 0;
                board.squares[c][r].shape = "";
                board.squares[c][r].color = "";
                board.squares[c][r].invisible = 0;
            }
        }
    },
    //add square flash to array and removs after lifespan over
     addSquareFlash (column, row, color){
            board.squareFlashArray.push({column:column, row:row, color:color})
            setTimeout(function() {board.squareFlashArray.shift()}, board.squareFlashLifespan);
    },
    //add line flash to array and removes after lifespan over
    addLineFlash (rowOrColumn, num, color){
            board.lineFlashArray.push({rowOrColumn:rowOrColumn, num:num, color:color})
            setTimeout(function() {board.lineFlashArray.shift()}, board.lineFlashLifespan);
    },
    drawFlashes(){
        //draws square flashes
        for(let i=0; i<board.squareFlashArray.length; i++){
            ctx.fillStyle = board.squareFlashArray[i].color;
            ctx.fillRect(board.squareFlashArray[i].column*(board.squareSize+board.squarePadding)+board.squareOffsetLeft-board.squarePadding, board.squareFlashArray[i].row*(board.squareSize+board.squarePadding)+board.squareOffsetTop-board.squarePadding, board.squareSize+(2*board.squarePadding), board.squareSize+(2*board.squarePadding));
        }
        //draws line flashes
        for(let i=0; i<board.lineFlashArray.length; i++){
            ctx.fillStyle = board.lineFlashArray[i].color;
            if(board.lineFlashArray[i].rowOrColumn==="column"){
                ctx.fillRect((board.lineFlashArray[i].num*(board.squareSize+board.squarePadding))+board.squareOffsetLeft-board.squarePadding, board.squareOffsetTop, board.squareSize+(2*board.squarePadding), board.rowCount*(board.squareSize+board.squarePadding)-board.squarePadding);
            }
            else if(board.lineFlashArray[i].rowOrColumn==="row"){
                ctx.fillRect(board.squareOffsetLeft, (board.lineFlashArray[i].num*(board.squareSize+board.squarePadding))+board.squareOffsetTop-board.squarePadding, board.columnCount*(board.squareSize+board.squarePadding)-board.squarePadding, board.squareSize+(2*board.squarePadding));
            }
        }
    },
    resetShapePlaced(){
        board.shapePlaced = false;
    }
};

//BACKGROUND ==================================================================
//Draws background graphics. Includes background of game, tarot card images,
//flower image, shading, and game border.
let background = {
    drawImageForeground: false,
    levelHolder: {1: "data/img/level1.jpg", 2: "data/img/level2.jpg", 3: "data/img/level3.jpg", 4: "data/img/level4.jpg", 5: "data/img/level5.jpg"},
    frameWidth: 8,
    framePadding: 2,
    woodImg : new Image(),
    flowerImg : new Image(),
    levelImg : new Image(),

    drawBackground(){
        //shadow behind game and extending outside.
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //behind game
        ctx.fillStyle = "#403412";
        ctx.fillRect(0, 0, gameWidth, gameHeight);

        //draws wood image, makes transparent so blends in
        background.woodImg.src = "data/img/wood.jpg";
        ctx.globalAlpha = 0.3;
        ctx.drawImage(background.woodImg, 18, 18, gameWidth-30, gameHeight-30);
        ctx.globalAlpha = 1;

        //draws flower in bottom left
        //src put before and after for internet explorer compatibility
        background.flowerImg.src = "data/img/flower.png";
        ctx.drawImage(background.flowerImg, 50, 400, 150, 150);

        //logo in top left
        if(!menu.menuActive){
            ctx.font = "25pt Garamond3Medium";
            ctx.fillStyle = "rgba(0,0,0,.6)";
            ctx.fillText("Eight of Cups", 46, 62);
            let gradient=ctx.createLinearGradient(0,0,0,350);
            gradient.addColorStop("0","gold");
            gradient.addColorStop("0.6","red");
            ctx.fillStyle = gradient;
            //ctx.fillStyle = "rgba(255,255,255,.8)";
            ctx.fillText("Eight of Cups", 44, 60);
        }

        //frame around entire game
        ctx.fillStyle = "#1A1301";
        //top
        ctx.fillRect(0, background.frameWidth+background.framePadding, gameWidth, background.frameWidth);
        ctx.fillRect(0, 0, gameWidth, background.frameWidth);
        //bottom
        ctx.fillRect(0, gameHeight-18, gameWidth, background.frameWidth);
        ctx.fillRect(0, gameHeight-8, gameWidth, background.frameWidth);
        //left
        ctx.fillRect(0, 0, background.frameWidth, gameHeight);
        ctx.fillRect(10, 0, background.frameWidth, gameHeight);
        //right
        ctx.fillRect(gameWidth-background.frameWidth, 0, background.frameWidth, gameHeight);
        ctx.fillRect(gameWidth-background.frameWidth-10, 0, background.frameWidth, gameHeight);
        //divider
        ctx.fillRect(board.squareOffsetLeft-12, 10+background.frameWidth, background.frameWidth+2, gameHeight-30);
        //top of board
        ctx.fillRect(board.squareOffsetLeft-9, board.squareOffsetTop-9, board.columnCount*(board.squareSize+board.squarePadding)+43, background.frameWidth);
        //bottom of board if menu active
        if(menu.menuActive && !tutorial.tutorialActive){
                ctx.fillRect(board.squareOffsetLeft-9, gameHeight-160, board.columnCount*(board.squareSize+board.squarePadding)+43, background.frameWidth);
        }
    },
    drawShadow(){
        //top
        ctx.fillStyle = "black";
        ctx.fillRect(18, 8, gameWidth-36, background.frameWidth/3);
        ctx.fillRect(board.squareOffsetLeft-2, board.squareOffsetTop-2, board.columnCount*(board.squareSize+board.squarePadding)+33, background.frameWidth/2);
        ctx.fillRect(board.squareOffsetLeft-2, 18, board.columnCount*(board.squareSize+board.squarePadding)+33, background.frameWidth/2);
        ctx.fillRect(18, 18, 227, background.frameWidth/2);
        //bottom
        ctx.fillRect(18, gameHeight-10, gameWidth-36, background.frameWidth/3);
        //left
        ctx.fillRect(18, 18, background.frameWidth/2, gameHeight-35);
        ctx.fillRect(8, 18, background.frameWidth/3, gameHeight-35);
        //right
        ctx.fillRect(gameWidth-10, 18, background.frameWidth/3, gameHeight-35);
        //divider
        ctx.fillRect(board.squareOffsetLeft-2, 18, background.frameWidth/2, 38);
        ctx.fillRect(board.squareOffsetLeft-2, 55+background.frameWidth, background.frameWidth/2, gameHeight-222);
        if(!menu.menuActive || tutorial.tutorialActive){
            ctx.fillRect(board.squareOffsetLeft-2, gameHeight-190, background.frameWidth/2, 173);
        }
        else if (menu.menuActive && !tutorial.tutorialActive){
            //left menu divider
            ctx.fillRect(board.squareOffsetLeft-2, gameHeight-152, background.frameWidth/2, 135);
            //bottom menu divider
            ctx.fillStyle = "black";
            ctx.fillRect(board.squareOffsetLeft-2, 460, board.columnCount*(board.squareSize+board.squarePadding)+33, background.frameWidth/2);
        }
    },
    drawImage(){
        //src put before and after for internet explorer compatibility
        if(!tutorial.tutorialActive && !menu.menuActive){
            if(level.level<level.maxLevel && level.level!==0){
                background.levelImg.src = background.levelHolder[level.level];
                ctx.drawImage(background.levelImg,
                            board.squareOffsetLeft,
                            board.squareOffsetTop,
                            board.columnCount*(board.squareSize+board.squarePadding)-board.squarePadding,
                            board.rowCount*(board.squareSize+board.squarePadding)-board.squarePadding);
            }
            else if(level.level>=level.maxLevel){
                background.levelImg.src = background.levelHolder[level.maxLevel];
                ctx.drawImage(background.levelImg,
                            board.squareOffsetLeft,
                            board.squareOffsetTop,
                            board.columnCount*(board.squareSize+board.squarePadding)-board.squarePadding,
                            board.rowCount*(board.squareSize+board.squarePadding)-board.squarePadding);
            }
        }
    },
    setDrawImageForeground(s){
        background.drawImageForeground = s;
    },
    drawImageInFront(){
        if(background.drawImageForeground){
            background.drawImage();
        }
    },
};

//MAIN MENU ===================================================================
//Manages main menu.
let menu = {
    returnX: 435,
    returnY: 265,
    returnWidth: 100,
    returnHeight: 50,
    openX: 115,
    openY: gameHeight-42,
    openWidth: 80,
    openHeight: 27,
    highlightSize: 1,
    menuActive: true,
    newGameStarted: false,
    menuHighlight(){
        if(!board.isResetCleaning && !board.isNextLevelCleaning && !tutorial.tutorialActive && menu.menuActive){
            if((mouse.lastInfo.x > menu.returnX-menu.highlightSize) && (mouse.lastInfo.x < menu.returnX + menu.returnWidth+menu.highlightSize) && (mouse.lastInfo.y > menu.returnY-menu.highlightSize) && (mouse.lastInfo.y < menu.returnY + menu.returnHeight+menu.highlightSize)) {
                ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
                ctx.fillRect(menu.returnX-menu.highlightSize, menu.returnY-menu.highlightSize, menu.returnWidth + menu.highlightSize, menu.returnHeight + menu.highlightSize);
                return 1;
            }
        }
        else if(!board.isResetCleaning && !board.isNextLevelCleaning && !tutorial.tutorialActive && !menu.menuActive){
            if((mouse.lastInfo.x > menu.openX-menu.highlightSize) && (mouse.lastInfo.x < menu.openX + menu.openWidth+menu.highlightSize) && (mouse.lastInfo.y > menu.openY-menu.highlightSize) && (mouse.lastInfo.y < menu.openY + menu.openHeight+menu.highlightSize)) {
                ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
                ctx.fillRect(menu.openX-menu.highlightSize, menu.openY-menu.highlightSize, menu.openWidth + menu.highlightSize, menu.openHeight + menu.highlightSize);
                return 1;
            }
        }
    },
    isMouseOver(){
        if(menu.menuHighlight()===1){
            return true;
        }
    },
    buttonPress(){
        if(menu.menuActive){
            if(musicAndSound.isMusicOn){
                gameSong.play();
            }
            menu.newGameStarted = true;
            tutorialSong.pause();
            menu.menuActive = false;
            for(let c=0; c<board.columnCount;c++){
                for(let r=0; r<board.rowCount;r++){
                    board.squares[c][r].invisible = 0;
                }
            }
        }
        else{
            if(musicAndSound.isMusicOn){
                tutorialSong.play();
            }
            gameSong.pause();
            menu.menuActive = true;
            for(let c=0; c<board.columnCount;c++){
                for(let r=0; r<board.rowCount;r++){
                    board.squares[c][r].invisible = 1;
                }
            }
        }
    },
    drawMenu(){
        if(menu.menuActive && !tutorial.tutorialActive){
            ctx.font = "50pt Garamond3Medium";
            ctx.fillStyle = "rgba(0,0,0,.6)";
            ctx.fillText("Eight of Cups", 322, 154);
            let gradient=ctx.createLinearGradient(0,0,0,900);
            gradient.addColorStop("0","gold");
            gradient.addColorStop("0.6","red");
            ctx.fillStyle = gradient;
            //ctx.fillStyle = "rgba(255,255,255,.8)";
            ctx.fillText("Eight of Cups", 318, 150);
            ctx.fillStyle = "white";
            ctx.font = "20pt Garamond3Medium";
            if(!menu.newGameStarted){
                //space added so highlight works evenly
                ctx.fillText(" Begin",menu.returnX+13, menu.returnY+32);
            }
            else{
                menu.returnX = 70,
                menu.returnY = 440,
                menu.returnWidth = 130,
                menu.returnHeight = 50,
                ctx.fillText("Return",menu.returnX+24, menu.returnY+35);
            }
            //credits
            ctx.fillStyle = "white"
            ctx.font = "9pt Garamond3Medium";
            ctx.fillText("'Eight of Cups' version 1.0 by Joe Friedlander. https://github.com/joefriedlander", 265, 475);
            ctx.fillText("Inspired by 'Alchemy' from PopCap Games. Tarot card images edited from Rider-Waite tarot deck.", 265, 490);
            ctx.fillText("Tutorial theme: 'Curious Critters' by Matthew Pablo from opengameart.org/content/curious-critters", 265,505);
            ctx.fillText("under license https://creativecommons.org/licenses/by/3.0/ Song edited by compression.", 265, 515);
            ctx.fillText("Main theme: 'It Is' by HorrorPen from opengameart.org/content/it-is", 265,530);
            ctx.fillText("under license https://creativecommons.org/licenses/by/3.0/ Sound edited and file type converted.", 265,540);
            ctx.fillText("Line Complete Sound: 'Epic Amulet Item' by HorrorPen from opengameart.org/", 265,555);
            ctx.fillText("content/epic-amulet-item under license https://creativecommons.org/licenses/by/3.0/", 265,565);
            ctx.fillText("Sound edited and file type converted.", 265,575);
            ctx.fillText("Special thanks to Fernando Barrientos for human factors advice.", 265,590);
        }
        else if(!menu.menuActive){
            ctx.font = "10pt Garamond3Medium";
            ctx.fillStyle = "white";
            ctx.fillText("menu/tutorial",menu.openX+4, menu.openY+17);
        }
    }
}
//TUTORIAL ====================================================================
//Shows tutorial screen to explain game.
//Saves current squares in play, creates squares on board to display tutorial,
//then returns board to previous state when tutorial is exited.
let tutorial = {
    returnX: 70,
    returnY: 440,
    returnWidth: 130,
    returnHeight: 50,
    openX: 436,
    openY: 361,
    openWidth: 100,
    openHeight: 50,
    highlightSize: 1,
    tutorialActive: false,
    holdSquares: [],
    generateHoldSquareArray() {
        for(let c=0; c<board.columnCount; c++) {
            tutorial.holdSquares[c] = [];
            for(let r=0; r<board.rowCount; r++) {
                tutorial.holdSquares[c][r] = { x: 0, y: 0, taken: 0, dusted: 0, shape: "", color: "", invisible: 0};
            }
        }
    },
    tutorialHighlight(){
        if(!board.isResetCleaning && !board.isNextLevelCleaning && tutorial.tutorialActive){
            if((mouse.lastInfo.x > tutorial.returnX-tutorial.highlightSize) && (mouse.lastInfo.x < tutorial.returnX + tutorial.returnWidth+tutorial.highlightSize) && (mouse.lastInfo.y > tutorial.returnY-tutorial.highlightSize) && (mouse.lastInfo.y < tutorial.returnY + tutorial.returnHeight+tutorial.highlightSize)) {
                ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
                ctx.fillRect(tutorial.returnX-tutorial.highlightSize, tutorial.returnY-tutorial.highlightSize, tutorial.returnWidth + tutorial.highlightSize, tutorial.returnHeight + tutorial.highlightSize);
                return 1;
            }
        }
        else if(!board.isResetCleaning && !board.isNextLevelCleaning && menu.menuActive && !tutorial.tutorialActive){
            if((mouse.lastInfo.x > tutorial.openX-tutorial.highlightSize) && (mouse.lastInfo.x < tutorial.openX + tutorial.openWidth+tutorial.highlightSize) && (mouse.lastInfo.y > tutorial.openY-tutorial.highlightSize) && (mouse.lastInfo.y < tutorial.openY + tutorial.openHeight+tutorial.highlightSize)) {
                ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
                ctx.fillRect(tutorial.openX-tutorial.highlightSize, tutorial.openY-tutorial.highlightSize, tutorial.openWidth + tutorial.highlightSize, tutorial.openHeight + tutorial.highlightSize);
                return 1;
            }
        }
    },
    isMouseOver(){
        if(tutorial.tutorialHighlight()===1){
            return true;
        }
    },
    buttonPress(){
        if(tutorial.tutorialActive){
            tutorial.tutorialActive = false;
            //resets the squares for play
            for(let c=0; c<board.columnCount;c++){
                for(let r=0; r<board.rowCount;r++){
                    board.squares[c][r].dusted = tutorial.holdSquares[c][r].dusted;
                    board.squares[c][r].taken = tutorial.holdSquares[c][r].taken;
                    board.squares[c][r].shape = tutorial.holdSquares[c][r].shape;
                    board.squares[c][r].color = tutorial.holdSquares[c][r].color;
                    board.squares[c][r].invisible = tutorial.holdSquares[c][r].invisible;
                }
            }
        }
        else{
            tutorial.tutorialActive = true;
            //holds current squares in play
            for(let c=0; c<board.columnCount;c++){
                for(let r=0; r<board.rowCount;r++){
                    tutorial.holdSquares[c][r].dusted = board.squares[c][r].dusted;
                    tutorial.holdSquares[c][r].taken = board.squares[c][r].taken;
                    tutorial.holdSquares[c][r].shape = board.squares[c][r].shape;
                    tutorial.holdSquares[c][r].color = board.squares[c][r].color;
                    tutorial.holdSquares[c][r].invisible = board.squares[c][r].invisible;
                }
            }
            //Prepares squares for tutorial
            for(let c=0; c<board.columnCount;c++){
                for(let r=0; r<board.rowCount;r++){
                    board.squares[c][r].dusted = 0;
                    board.squares[c][r].taken = 0;
                    board.squares[c][r].shape = "";
                    board.squares[c][r].color = "";
                    board.squares[c][r].invisible = 1;
                }
            }
        }
    },
    drawTutorial(){
        if(tutorial.tutorialActive){
            //button
            ctx.fillStyle = "white";
            ctx.font = "20pt Garamond3Medium";
            ctx.fillText("Return",tutorial.returnX+24, tutorial.returnY+35);
            //draws tutorial on screen
            ctx.font = "18pt Garamond3Medium";
            ctx.fillStyle = "white";
            ctx.fillText("Tutorial", 450,46);
            ctx.fillText("Goal:", 290,127);
            ctx.fillText("Clear all grey", 290,152);
            ctx.fillText("squares", 290,177);
            ctx.fillText("How:", 560,127);
            ctx.fillText("Click to put", 560,152);
            ctx.fillText("a shape down", 560,177);
            ctx.fillText("Connect shapes or colors", 380,235);
            board.squares[2][1].dusted = 0;
            board.squares[2][1].taken = 0;
            board.squares[2][1].shape = "";
            board.squares[2][1].color = "";
            board.squares[2][1].invisible = 0;
            board.squares[3][1].dusted = 1;
            board.squares[3][1].taken = 1;
            board.squares[3][1].shape = "circle";
            board.squares[3][1].color = "green";
            board.squares[3][1].invisible = 0;
            board.squares[4][1].dusted = 1;
            board.squares[4][1].taken = 0;
            board.squares[4][1].shape = "";
            board.squares[4][1].color = "";
            board.squares[4][1].invisible = 0;
            //first
            board.squares[1][4].dusted = 1;
            board.squares[1][4].taken = 1;
            board.squares[1][4].shape = "circle";
            board.squares[1][4].color = "green";
            board.squares[1][4].invisible = 0;
            board.squares[2][4].dusted = 1;
            board.squares[2][4].taken = 1;
            board.squares[2][4].shape = "circle";
            board.squares[2][4].color = "blue";
            board.squares[2][4].invisible = 0;
            ctx.fillText("Yes, same shape", 300,375);
            //second
            board.squares[5][4].dusted = 1;
            board.squares[5][4].taken = 1;
            board.squares[5][4].shape = "circle";
            board.squares[5][4].color = "green";
            board.squares[5][4].invisible = 0;
            board.squares[6][4].dusted = 1;
            board.squares[6][4].taken = 1;
            board.squares[6][4].shape = "triangle";
            board.squares[6][4].color = "green";
            board.squares[6][4].invisible = 0;
            ctx.fillText("Yes, same color", 528,375);
            //third
            board.squares[1][7].dusted = 1;
            board.squares[1][7].taken = 1;
            board.squares[1][7].shape = "circle";
            board.squares[1][7].color = "green";
            board.squares[1][7].invisible = 0;
            board.squares[2][7].dusted = 1;
            board.squares[2][7].taken = 1;
            board.squares[2][7].shape = "triangle";
            board.squares[2][7].color = "blue";
            board.squares[2][7].invisible = 0;
            ctx.fillText("No, different", 310,545);
            ctx.fillText("shape and color", 310,565);
            //fourth
            board.squares[5][7].dusted = 1;
            board.squares[5][7].taken = 1;
            board.squares[5][7].shape = "circle";
            board.squares[5][7].color = "green";
            board.squares[5][7].invisible = 0;
            board.squares[7][7].dusted = 1;
            board.squares[7][7].taken = 1;
            board.squares[7][7].shape = "triangle";
            board.squares[7][7].color = "blue";
            board.squares[7][7].invisible = 0;
            board.squares[6][7].dusted = 1;
            board.squares[6][7].taken = 1;
            board.squares[6][7].shape = "omni";
            board.squares[6][7].color = "";
            board.squares[6][7].invisible = 0;
            ctx.fillText("Yes, star goes", 550,545);
            ctx.fillText("anywhere", 550,565);
            //cauldron
            ctx.font = "15pt Garamond3Medium";
            ctx.fillStyle = "white";
            ctx.fillText("Click on cauldron", 50,130);
            ctx.fillText("or right click to get ", 50,150);
            ctx.fillText("different shape.", 50,170);
            ctx.fillText("If cauldron is red,", 50,190);
            ctx.fillText("next click resets", 50,210);
            ctx.fillText("the level.", 50,230);
            //score
            ctx.font = "15pt Garamond3Medium";
            ctx.fillStyle = "white";
            ctx.fillText("Spend gold to", 50,60);
            ctx.fillText("buy items.", 50,80);
        }
        else if(!tutorial.tutorialActive && menu.menuActive){
            ctx.fillStyle = "white";
            ctx.font = "20pt Garamond3Medium";
            ctx.fillText("Tutorial",tutorial.openX+9, tutorial.openY+30);
        }
    }
};

//DUST PARTICLES ==============================================================
//Board Dust Particles. Effect is to make dust appear above, to the left, and to
//the right of the square when shape is placed.
let dust = {
    dustParticles: {},
    dustParticleIndex:0,
    dustParticleNum: 15,
    DustParticle: function(x, y){
        this.x = x;
        this.y = y;
        this.vx = Math.random() * .5 - .25;
        this.vy = Math.random() * 1 - .5;
        this.transparency = Math.random()*.5 + .5;
        this.color = Math.random()*20 + 50;
        this.radius = Math.random()*3;
        dust.dustParticles[dust.dustParticleIndex] = this;
        this.id = dust.dustParticleIndex;
        dust.dustParticleIndex++;
    }
};
dust.DustParticle.prototype.draw = function(){
    //movement
    this.x += this.vx;
    this.y += this.vy;
    this.vx += Math.random() * .06 - .03;
    this.vy += Math.random() * .06 - .03;
    //transparency
    if(this.transparency <= 0){
        delete dust.dustParticles[this.id];
    }
    this.transparency  -= Math.random() * .02;
    //draw
    ctx.beginPath();
    ctx.fillStyle = "hsla(0, 0%," + this.color + "%," + this.transparency+ ")";
    ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
    ctx.fill();
};
function makeDustParticles(x, y){
    //top of square
    for(let i=0; i<dust.dustParticleNum; i++){
        new dust.DustParticle(x + Math.random() * 40 - 20, y-(board.squareSize/2) + Math.random() * 15 - 20);
    }
    //left of square
        for(let i=0; i<dust.dustParticleNum; i++){
            new dust.DustParticle(x-(board.squareSize/2) + Math.random() * 15 - 20, y + Math.random() * 40 - 20);
    }
    //right of square
        for(let i=0; i<dust.dustParticleNum; i++){
            new dust.DustParticle(x+(board.squareSize/2) + Math.random() * 15 + 5, y + Math.random() * 40 - 20);
    }
};
function deleteAllDustParticles(){
    for(let i in dust.dustParticles){
        delete dust.dustParticles[i];
    }
}

function drawDustParticles(){
    for(let i in dust.dustParticles){
        dust.dustParticles[i].draw();
    }
};

//COORDINATES AND CURSOR=======================================================
//Manages the cursor information, using event listener.
let mouse = {
        alphaValue: .002,
        alphaMax: .2,
        alphaMin: .001,
        minHit: true,
        maxHit: false,
    setMousePosition(e) {
        mouse.lastInfo.x = e.pageX - canvas.offsetLeft;
        mouse.lastInfo.y = e.pageY - canvas.offsetTop;
    },
    lastInfo: {
        x: 0,
        y: 0,
    },
    /*drawCursorAura(){
        ctx.beginPath();
        ctx.arc(mouse.lastInfo.x,mouse.lastInfo.y,30,0,2*Math.PI);
        ctx.fillStyle = shape.currentShape.color;

        if(mouse.minHit){
            mouse.alphaValue+=.001;
        }
        else if(mouse.maxHit){
            mouse.alphaValue-=.001;
        }

        if(mouse.alphaValue < mouse.alphaMin){
                        console.log("hit min");
            mouse.minHit = true;
            mouse.maxHit = false;
        }
        if(mouse.alphaValue > mouse.alphaMax){
                        console.log("hit max");
            mouse.maxHit = true;
            mouse.minHit = false;
        }

        ctx.globalAlpha = mouse.alphaValue;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.closePath();
    }*/
};

//Sounds and Music =======================================================================
//Manages sounds and music in game.
//For sound effects, put theSound.currentTime = 0 before theSound.play to work when
//sound is played before previous sound stops.
//uses event listener
let musicAndSound = {
    isMusicOn: true,
    isSoundOn: true,
    x: 30,
    y: gameHeight-40,
    width: 30,
    height: 20,
    highlightSize: 5,
    drawMusicAndSound(){
        ctx.font = "10pt Garamond3Medium";
        ctx.fillStyle = "white";
        ctx.fillText("music",musicAndSound.x, musicAndSound.y+15);
        ctx.fillText("sound",musicAndSound.x+45, musicAndSound.y+15);
        if(!musicAndSound.isMusicOn){
            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.fillRect(musicAndSound.x, musicAndSound.y+11, 30, 1.5);
        }
        if(!musicAndSound.isSoundOn){
            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.fillRect(musicAndSound.x+45, musicAndSound.y+11, 30, 1.5);
        }
    },
    //music
    musicHighlight(){
        if((mouse.lastInfo.x > musicAndSound.x-musicAndSound.highlightSize) && (mouse.lastInfo.x < musicAndSound.x + musicAndSound.width+musicAndSound.highlightSize) && (mouse.lastInfo.y > musicAndSound.y-musicAndSound.highlightSize) && (mouse.lastInfo.y < musicAndSound.y + musicAndSound.height+musicAndSound.highlightSize)) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
            ctx.fillRect(musicAndSound.x-musicAndSound.highlightSize, musicAndSound.y-musicAndSound.highlightSize, musicAndSound.width + (2*musicAndSound.highlightSize), musicAndSound.height + (2*musicAndSound.highlightSize));
            return 1;
        }
    },
    isMouseOverMusic(){
        if(musicAndSound.musicHighlight()===1){
            return true;
        }
    },
    musicOnOff(){
        if(musicAndSound.isMusicOn===true){
            if(tutorial.tutorialActive || menu.menuActive){
                tutorialSong.pause();
                musicAndSound.isMusicOn = false;
            }
            else{
                gameSong.pause();
                musicAndSound.isMusicOn = false;
            }
        }
        else{
            if(tutorial.tutorialActive || menu.menuActive){
                tutorialSong.play();
                musicAndSound.isMusicOn = true;
            }
            else{
                gameSong.play();
                musicAndSound.isMusicOn = true;
            }
        }
    },
    //sound
    soundHighlight(){
        if((mouse.lastInfo.x > musicAndSound.x-musicAndSound.highlightSize+45) && (mouse.lastInfo.x < musicAndSound.x + musicAndSound.width+musicAndSound.highlightSize+45) && (mouse.lastInfo.y > musicAndSound.y-musicAndSound.highlightSize) && (mouse.lastInfo.y < musicAndSound.y + musicAndSound.height+musicAndSound.highlightSize)) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
            ctx.fillRect(musicAndSound.x-musicAndSound.highlightSize+45, musicAndSound.y-musicAndSound.highlightSize, musicAndSound.width + (2*musicAndSound.highlightSize), musicAndSound.height + (2*musicAndSound.highlightSize));
            return 1;
        }
    },
    isMouseOverSound(){
        if(musicAndSound.soundHighlight()===1){
            return true;
        }
    },
    soundOnOff(){
        if(musicAndSound.isSoundOn===true){
            musicAndSound.isSoundOn = false;
            boardResetSound.volume = 0;
            putInCauldronSound.volume = 0;
            shapePlaced1Sound.volume = 0;
            shapePlaced2Sound.volume = 0;
            scoreSound.volume = 0;
            lineCompleteSound.volume = 0;
        }
        else{
            musicAndSound.isSoundOn = true;
            boardResetSound.volume = 1;
            putInCauldronSound.volume = .7;
            shapePlaced1Sound.volume = 1;
            shapePlaced2Sound.volume = 1;
            scoreSound.volume = .4;
            lineCompleteSound.volume = 1;
        }
    },
    resetTutorialSong(){
        tutorialSong.currentTime=0;
        tutorialSong.play();
    },
    resetGameSong(){
        gameSong.currentTime=0;
        gameSong.play();
    }
};

let tutorialSong = new Audio('data/sound/tutorialSong.mp3');
tutorialSong.volume = .5;
let gameSong = new Audio('data/sound/gameSong.mp3');
gameSong.volume = .5;
let boardResetSound = new Audio('data/sound/boardReset.wav');
let putInCauldronSound = new Audio('data/sound/putInCauldron.wav');
putInCauldronSound.volume = .7;
let shapePlaced1Sound = new Audio('data/sound/shapePlaced1.wav');
let shapePlaced2Sound = new Audio('data/sound/shapePlaced2.wav');
let lineCompleteSound = new Audio('data/sound/lineComplete.wav');
let scoreSound = new Audio('data/sound/score.wav');
scoreSound.volume = .7;

//GAME UPDATES WHEN MOUSE CLICKED =============================================
//Turn based game, is updated whenever mouse is clicked on a valid location.
let update = {
    mainScreenUpdate(e){
        if (e.button===0) {

            if (level.isMouseOver()===true && level.pause===true){
                level.startNextLevel();
            }
            else if (musicAndSound.isMouseOverMusic()===true){
                musicAndSound.musicOnOff();
            }
            else if(musicAndSound.isMouseOverSound()===true){
                musicAndSound.soundOnOff();
            }
            else if(menu.isMouseOver() == true){
                menu.buttonPress();
            }
            else if(tutorial.isMouseOver()===true){
                tutorial.buttonPress();
            }
            else if (board.isMouseOver()===true){
                board.attemptToPlaceShape();
            }
            else if(cauldron.isMouseOver()) {
                cauldron.incLevel();
            }
            else if(score.isMouseOver()){
                score.buy();
            }
        }
        //right mouse clicked
        else if (e.button===2) {
            cauldron.incLevel();
        }
    }
};

//DRAWS GAME  =================================================================
function drawGame() {
    background.drawBackground();
    background.drawImage();
    board.drawSquares();
    board.drawPadding();
    board.squareHighlight();
    board.drawFlashes();
    cauldron.drawCauldron();
    cauldron.cauldronHighlight();
    deck.drawDeck();
    //timer.draw();
    menu.drawMenu();
    menu.menuHighlight();
    tutorial.drawTutorial();
    tutorial.tutorialHighlight();
    level.drawNextLevelButton();
    level.levelHighlight();
    score.draw();
    score.scoreHighlight();
    drawDustParticles();
    drawGoldParticles();
    background.drawImageInFront();
    background.drawShadow();
    //mouse.drawCursorAura();
    shape.drawCursor();
    musicAndSound.drawMusicAndSound();
    musicAndSound.musicHighlight();
    musicAndSound.soundHighlight();
    requestAnimationFrame(drawGame);
};

//STARTS GAME =================================================================
//April 2018 Chrome disabled autoplay, so set sound and music off by default.
//https://developers.google.com/web/updates/2017/09/autoplay-policy-changes
musicAndSound.musicOnOff();
musicAndSound.soundOnOff();
board.generateSquareArray();
tutorial.generateHoldSquareArray();
requestAnimationFrame(drawGame);

//EVENT LISTENERS =============================================================
canvas.addEventListener("mousemove", mouse.setMousePosition, false);
canvas.addEventListener("mousedown", update.mainScreenUpdate, false);
tutorialSong.addEventListener("ended", musicAndSound.resetTutorialSong, false);
gameSong.addEventListener("ended", musicAndSound.resetGameSong, false);
