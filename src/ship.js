var Sides = {Right : 1, Up: 2, Left: 3, Down: 4};

function Ship(two){

  var initialX = 380;
  var initialY = 480;
  var x=initialX, y=initialY;
  var speed = 7;
  var vertices = [];
  var bigTriangle = new Two.Polygon(0, 0, 40, 3);
  var smallTriangle = new Two.Polygon(0, 10, 20, 3);
  bigTriangle.fill = 'rgb(199, 12, 18)';
  smallTriangle.fill = 'rgb(255, 254, 254)';
  var shipBody = two.makeGroup(bigTriangle, smallTriangle);
  shipBody.translation.set(initialX, initialY)
  shipBody.noStroke();
  shipBody.center();

  for(var i =0; i< 3; i++){
    var vertice = bigTriangle.vertices[i];
    var vector = new Two.Vector(vertice.x,vertice.y);
    vertices.push(vector);
  }

  this.getX = function (){
    return x;
  }

  this.getY = function(){
    return y;
  }

  this.getVector = function(){
    return shipBody.translation;
  }

  this.set = function(XPos, YPos){
    if(XPos >=35 && YPos >=300 && XPos <= 765 && YPos <= 500){
     x = XPos;
     y = YPos;
     shipBody.translation.set(x,y);
   }
   }

   var KeyboardStateManager = {
     keys :[39,38,37,40],
     pressState : [false, false, false, false]
   }

   this.keyDown = function (e) {
     for(var i =0; i<4; i++)
       if(KeyboardStateManager.keys[i]==e.keyCode){
         KeyboardStateManager.pressState[i] = true;
         break;
       }
       switch (e.keyCode) {
         case 39: // dreapta
           KeyboardStateManager.pressState[2] = false;
           break;
         case 38: // sus
           KeyboardStateManager.pressState[3] = false;
           break;
         case 37:
           KeyboardStateManager.pressState[0] = false;
         case 40:
           KeyboardStateManager.pressState[1] = false;
           break;
       }
   }

   this.keyUp = function (e) {
     for(var i =0; i<4; i++)
       if(KeyboardStateManager.keys[i]==e.keyCode){
         KeyboardStateManager.pressState[i] = false;
         break;
       }
   }



   this.downKey = function(){
     this.set(x,y+speed);
   }

   this.upKey = function(){
     this.set(x,y-speed);
   }

   this.leftKey = function(){
     this.set(x-speed, y);
     if(shipBody.rotation >= -Math.PI/7)
      shipBody.rotation = shipBody.rotation - Math.PI/36;
   }

   this.rightKey = function(){
     this.set(x+speed, y);
     if(shipBody.rotation <= Math.PI/7)
      shipBody.rotation = shipBody.rotation + Math.PI/36;
   }

   var isHorizontalKeyPressed = false;

   this.controlHandling = function(){
     isHorizontalKeyPressed = false;
     for(var i=0; i<4; i++){
     if(KeyboardStateManager.pressState[i])
       switch(KeyboardStateManager.keys[i]){
       case 39://dreapta
           this.rightKey();
           isHorizontalKeyPressed = true;
         break;
       case 38: // sus
         this.upKey();
       break;
       case 37: //stanga
         this.leftKey();
         isHorizontalKeyPressed = true;
       break;
       case 40: //jos
         this.downKey();
       break;
       }
     }
   }

   this.restoreRotationState = function(){
     if(!isHorizontalKeyPressed){
       if(shipBody.rotation < -0.05)
        shipBody.rotation = shipBody.rotation + Math.PI/36;
       else if(shipBody.rotation > 0.05)
        shipBody.rotation = shipBody.rotation - Math.PI/36;
     }
   }
   var change = 0;
   this.update = function(){
     if(!this.isDead){
       this.controlHandling();
       this.restoreRotationState();
     }
   }
   var actualVertices = [new Two.Vector(0,0), new Two.Vector(0,0), new Two.Vector(0,0)];
   this.getVertices = function(){
     for(var i=0; i<3; i++){
        vertices[i].set(Math.cos(Math.PI/2 + shipBody.rotation), -Math.sin(Math.PI/2+shipBody.rotation))
        actualVertices[i].add(vertices[i], shipBody.translation);

        // console.log("v"+i+ ": x="+ vertices[i].x + " y="+vertices[i].y);
      }
      return actualVertices;
   }

   this.playDeathAnimation = function(){
     shipBody.rotation += Math.PI/18;
     shipBody.scale -= 0.03;
     if(shipBody.scale < 0.02)
      return false;
     else
      return true;
   }

   this.isDead = false;
  return this;
}
