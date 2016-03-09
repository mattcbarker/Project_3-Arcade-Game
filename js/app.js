
var startLoc = [200,400]; //playerstart location
var rightLaneX = 400; //right wall X value
var leftLaneX = 0; //left wall X value
var bottomLaneY = 400;  //bottom wall Y value
var topLaneY=60; //top wall Y value
var borderArray=[]; //array that holds all the border bools
var newEnemyY= 55; //new enemy Y location for a function to generate start locs
var speed= 100; //enemy speed
var initX=0; //inital X for enemy spawns
var randomSpeed = function(min,max){
      return Math.random()*(max-min) +min;
    };
    
/*This is the defining of the initial prototype for the base Enemy. Included inputs for our starting location, as well as the speed that will be generated upon enemy creation. Also defines the image as the provided PNG*/
var Enemy = function(initialX, initialY,randoSpeed) {
    this.x = initialX;
    this.y = initialY;
    this.speed = randoSpeed;
    this.sprite = 'images/enemy-bug.png';
};

/*This is the enemies 'tick' function based on the change in delta (dt) time. We continually reset our X value by starting with our current X value and then add our speed which we get from the base class and multiply it by it's speed. TLDR speed is our current location added to the rate of speed*time. After this we have an if statement that'll reset our bug if he gets too far to the left. We then access our global variable where we define our x value reset and add 75px to guarentee that the bug is no longer visible based on the size of the tiles. After that we define our bounding box based on the size of the bug, and make sure that it is not overlapping with the player we're going to make, if it does, he resets. Otherwise, we do nothing. */
Enemy.prototype.update = function(dt) {
    this.x = this.x + this.speed * dt;
   
    if (this.x > rightLaneX+75){
      this.reset();
      this.x=-75;
      console.log(this.speed);
    }
    var leftboundries= this.x -50;
    var rightboundries=this.x+50;
    var upperboundries=this.y-50;
    var lowerboundries=this.y+50;
    
    if (FroggerPlayer.x > leftboundries && FroggerPlayer.x < rightboundries && FroggerPlayer.y > upperboundries && FroggerPlayer.y <lowerboundries){
      FroggerPlayer.resetPOS();
    }
      // where I am + the rate i'm going. math!
};
/*Simple reusable reset function called by two different parts of the tick function above. It resets the speed by calling a global function while passing in two values predefined(these would be more fun as variables) and then resets the x value of the bug back to its global init value*/
Enemy.prototype.reset = function() {
      this.speed=randomSpeed(60,500);
      this.x=initX;
};

/*Code that makes the bug appear. Called in from the resources.js file */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//////////////////////////////////////////////////////
////end badguy////////////////////////////////////////
/////////////////////////////////////////////////////


/*Same thing here, we initialize our PC using the startLoc array, and the sets the boy.png as our player image*/
var MyPC = function(){
    this.x = startLoc[0]; //sets the X coord@the input value
    this.y = startLoc[1]; //sets the Y coord@the input value
    this.sprite = 'images/char-boy.png';
};

/*the PC doesn't have any logic that needs to update since all of his functionality is controlled by keypress events*/
MyPC.prototype.update =function() {
    //empty
 };
 
/*Same thing as above, renders the boy.png at this location using functionality called in from resources.js*/
MyPC.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
/*Collision checks. This function perfroms some checks  on the X value and modifies bools to make sure we can move around the map. First variables are just the bools that let us move left and right. It just checks the current player location against globally set borders. If we're against one of these borders, it modifies the bools. Afterwards, it pushes the bools into an X array and then returns that value to be accessed by the actual keypress events */
MyPC.prototype.borderCheckX = function(){
    var leftBorder=false;
    var rightBorder=false;
    var localLocation= this.getPOS();
    var localXBorderArray=[];
    
    if (localLocation[0] === leftLaneX ){
      leftBorder=true;
      //console.log("On the Left Border");
    }
    else if (localLocation[0] === rightLaneX ){
      rightBorder=true;
      //console.log("On the Right Border");
    }
  
    localXBorderArray.push(leftBorder); //left is 0
    localXBorderArray.push(rightBorder); //right is 1
    
    return localXBorderArray;
};
/*This function does the exact same thing but with Y values. Returns an array of bools to be accessed by keypress events.*/
MyPC.prototype.borderCheckY = function(){
    var bottomBorder=false;
    var topBorder=false;
    var localLocation= this.getPOS();
    var localYBorderArray=[];
    
    if (localLocation[1] === bottomLaneY ){ //if current loc is equal to the bottom lane value
      bottomBorder=true;
      //console.log("on the bottom border");
    }
    else if (localLocation[1] === topLaneY ){
      topBorder=true;
      //console.log("On the top Border");
    }
    else{
      //console.log("NOTHING");
      //console.log(this.x +" "+this.y);
    }
    
    localYBorderArray.push(bottomBorder); //bot is 0
    localYBorderArray.push(topBorder); //top is 1
    
    return localYBorderArray;
};

/*Multi purpose function that just get's our X and Y. Returns it as an array. */
MyPC.prototype.getPOS= function(){
  var CurrentLoc =[];
  CurrentLoc.push(this.x);
  CurrentLoc.push(this.y);
  return CurrentLoc;
};

/*Multi purpose function that resets our our location to our globally defined starting location. Does a borderCheckY to make sure we haven't fallen off the map and more importantly makes sure we don't have to wait until we move before we do another border check, because when we reset it won't modify the border bools unless we manually call the function ourselves.*/
MyPC.prototype.resetPOS = function(){
  this.x = startLoc[0];
  this.y = startLoc[1];
  this.borderCheckY();
};

/*This is the actual Keypress event handler. We pass in which key is pressed and perform all of our border checks. Our variables are how far we're going to move provided we can. Then we call our border check functions and save those bools. Then we do a series of if statments to check which key is pressed. After determining which key is pressed, we're presented with two options, we either cant move because we're against a wall(based on our border checks) or we move in the X or Y based on the modifier variables and accessing our parent location. */
MyPC.prototype.handleInput = function(keyPressed){
    var Xmod =100;
    var Ymod= 85;
      XborderArray= this.borderCheckX();
      YborderArray= this.borderCheckY();
    //console.log(this.y);
    
    //xchecker/////////////////
    
    //left push
    if (keyPressed === 'left'){
       if(XborderArray[0] ===true){
         //error
       }
       else if(XborderArray[0] ===false){
         this.x = this.x - Xmod;
       }
    }
    
    //right push
    else if (keyPressed === 'right'){
       if(XborderArray[1] === true){
         //error
       }
       else if(XborderArray[1] === false){
         this.x = this.x + Xmod;
       }
    }
    ////////////////////////////
    //ycheckeer//////////
    ////////////////
    
    //up push
    else if (keyPressed === 'down'){
       if(YborderArray[0] === true){
         //error
       }
       else if(YborderArray[0] === false){
         this.y = this.y + Ymod;
       }
    }
    
    //up push
    else if (keyPressed === 'up'){
       if(YborderArray[1] === true){
         this.resetPOS();
       }
       else if(YborderArray[1] === false){
         this.y = this.y - Ymod;
       }
    }
};

/////////////////////////////////////////////
//////////end player/////////////////////////
/////////////////////////////////////////////

/*Now that we've defined our functionality, we're going to build everything. We create a player, call his border checks before he gets to move, for the same reasons as the reset function above. We create an empty array for our enemies, and define how many of them there are in the for statement. The for statement creates three bugs, offsets them using the i function and multiplying it by our lane height to make sure they all end up in the correct lane position before calling the randomSpeed function again to produce our speed for the bug.*/
var FroggerPlayer= new MyPC(); //creates the player
    FroggerPlayer.borderCheckX();
    FroggerPlayer.borderCheckY();

var allEnemies = [];

// Instantiate all enemies
for (var i = 0; i < 3; i++){
  allEnemies.push(new Enemy(0,newEnemyY +(i*90),randomSpeed(60,250))); //newEnemyY is the top position
}


/*I think this was provided, it just sets up a bunch of event listeners based on all the keys we wanted, I googled the asdw keys because I was thinking about adding a second player at some point in the future. This is then all paseed into the handleInput event we made above. */
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
        //97: 'a',
        //115: 's',
        //100: 'd',
        //119: 'w',
        //32: 'spacebar'
    };
    var keyPressed = allowedKeys[e.keyCode];
    FroggerPlayer.handleInput(keyPressed); //calls the keypress function
});
