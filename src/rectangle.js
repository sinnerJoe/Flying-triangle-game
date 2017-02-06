var deathSound = new Audio('audio/fail.mp3');
// deathSound.currentTime=0.1;
deathSound.ontimeupdate = function(){
    if(deathSound.currentTime > 1.6){
      deathSound.pause();
      deathSound.currentTime=0.1;
    }
  };

var latura = 20;
var screenHeight = 700;
function rectangleManager(two, ship, endGameEvent){
  var speed = 6;
  var screens = [];
  screens.push(new ScreenOfRectangles(two, -3*screenHeight, "green"));
  screens.push(new ScreenOfRectangles(two, -2*screenHeight, "gold"));
  screens.push(new ScreenOfRectangles(two, -screenHeight));
  screens.push(new ScreenOfRectangles(two, 0, "none", 0));
  this.update = function(ticks){
      if(ship.isDead){
        deathSound.play();
        if(!ship.playDeathAnimation()){
          endGameEvent();
        }
      }
      var computedVector = new Two.Vector(0,0);
      screens.forEach(function(screen){
      screen.update(speed, ticks);
      // console.log(screen.getRectangles().length);
      screen.getRectangles().forEach(function(item){
        // console.log("Distance: "+item.rect.translation.distanceTo(ship.getVector()));
        computedVector.x = item.rect.translation.x;
        computedVector.y = item.rect.translation.y + screen.getPosition().y;
        if(computedVector.distanceTo(new Two.Vector(ship.getX(), ship.getY())) < latura + 20)
          if(collidesWithShip(item.rect, screen.getPosition().y))
            ship.isDead = true;

      });//screens.forEach
    });//getRectangles.forEach
  }

  var rectPointVertices = [new Two.Vector(0,0), new Two.Vector(0,0), new Two.Vector(0,0), new Two.Vector(0,0)]
  function collidesWithShip(rect, screenPosY){
    var shipVertices = ship.getVertices();
    for(var i =0; i<4; i++){
      rectPointVertices[i].set(rect.vertices[i].x , rect.vertices.y + screenPosY);
    }
    for(var i = 0; i < 4; i++){
      for(var j = 0; j < 3; j++){
        var shipNext = j != 2 ? j+1 : 0;
        var rectNext = i != 3 ? i+1 : 0;
        if(doLinesIntersect(shipVertices[j], shipVertices[shipNext],
           rectPointVertices[i], rectPointVertices[rectNext]))
           return true;
      }
    }
    return false;
  }

  function doLinesIntersect(a1,a2,b1,b2){
    //  Vector2 intersection = Vector2.Zero();

     var b = new Two.Vector().sub(a2,a1);
     var d = new Two.Vector().sub(b2,b1);
     var bDotDPerp = b.x * d.y - b.y * d.x;

     // if b dot d == 0, it means the lines are parallel so have infinite intersection points
     if (bDotDPerp == 0)
         return false;

     var c = b1.subSelf(a1);
     var t = (c.x * d.y - c.y * d.x) / bDotDPerp;
     if (t < 0 || t > 1)
         return false;

     var u = (c.x * b.y - c.y * b.x) / bDotDPerp;
     if (u < 0 || u > 1)
         return false;

    //  intersection = Vector2.Sum(a1,Vector2.Multiply(b,t));

     return true;
  }


}

function Obstacle(two, color = "rgb(88, 34, 219)", linewidth){
  this.rect = two.makeRectangle(0, -200, latura, latura);
  this.rect.fill = color;
  this.rect.stroke = "rgb(78, 78, 78)";
  this.rect.linewidth = linewidth;
  this.reset = function(XPos,YPos){
    this.rect.translation.set(XPos,YPos);
  }
  return this;
}

function ScreenOfRectangles(two, initPositionY, color = null, linewidth = 2){
  var count = 20;
  if(linewidth == 0)
    count = 0;
  var startPosY = -2*screenHeight;
  var positions = generatePositions();
  var rectangles = createRectangles(positions);

  var rectangleGroup = two.makeGroup();
  rectangleGroup.translation.set(0, initPositionY);

  for(var i=0; i< count; i++){
    rectangleGroup.add(rectangles[i].rect);
  }

  function createRectangles(positionBuffer){
    var rectangles = [];
    for(var i=0; i<count; i++){
      var rect = createRectangle();

      rect.reset(positionBuffer[i].x, positionBuffer[i].y);
      rectangles.push(rect);
    }
    return rectangles;
  }

  function createRectangle(){
    if(color)
      return new Obstacle(two, color, linewidth);
    else
      return new Obstacle(two, "blue", linewidth);
  }

  function addRectangle(){
    count++;
    var rect = createRectangle();
    rect.set(-200, 0);
    rectangleGroup.add(rect.rect);
  }

  function randomPosition(){
    return {
      x: 760 * Math.random() + 20,
      y: screenHeight * Math.random()
    };
  }

  function generatePositions(){
    positions = [];
    for(var i=0; i< count; i++){
      positions.push(randomPosition());
    }
    return positions;
  }

  this.update = function(speed, ticks){
    rectangleGroup.translation.y +=speed;

    if(rectangleGroup.translation.y > screenHeight){
      this.reset();
    }

    if(ticks % 400 == 0)
      addRectangle();
  }



  this.reset = function(){
    rectangleGroup.translation.y = startPosY;
    // console.log("reset " + initPositionY);
    positions = generatePositions();
    for(var i =0; i< count; i++){
        rectangles[i].rect.translation.set(positions[i].x, positions[i].y);
    }
  }

  this.getRectangles = function(){
    return rectangles;
  }

  this.getPosition = function(){
    return rectangleGroup.translation;
  }

}
