
function hideStartGame(){
  $("#startGame").hide();
  $("#nicknameInput").hide();
  $("#nickLabel").hide();
  $("#continueGame").show();
  $("#abandonGame").show();
}

function showStartGame(){
  $("#gameMenu").show();
  $("#startGame").show();
  $("#nicknameInput").show();
  $("#nickLabel").show();
  $("#continueGame").hide();
  $("#abandonGame").hide();
}
var gameStarted = false;
function endGame(gameLoop){
  showStartGame();
  gameLoop.pause();
  $("#gameSquare svg:first").remove();
  gameStarted = false;
}

$(document).ready(function (){
var scoreManager = new ScoreTableManager();
var gameLoop;
var gameLoopPaused = false;
var two;
$("#startGame").show();
function InitGame(){
  gameStarted = true;
  var elem = document.getElementById('gameSquare');
  two = new Two({ width: 800, height: 530 }).appendTo(elem);
  var v = new Two.Vector(0, 1);
  var v2 = new Two.Vector(1, 0);

  var ship = new Ship(two);
  var rectManager  = new rectangleManager(two, ship,function(){endGame(two); gameLoopPaused = false;});
  // Bind a function to scale and rotate the group
  // to the animation loop.
  gameLoop = two.bind('update', function(frameCount) {
    ship.update();
    rectManager.update(frameCount);
    scoreManager.update();
  }).play();  // Finally, start the animation loop

  $(document).keydown(ship.keyDown);
  $(document).keyup(ship.keyUp);
  }

  $(document).keypress(function(key){
    if(gameStarted)
      if(key.keyCode == 27 || key.keyCode == 80){
        if(!gameLoopPaused){
        two.pause();
        gameLoopPaused = true;
        $("#gameMenu").show();
      }
      else{
        $("#gameMenu").hide();
        two.play();
        gameLoopPaused =false;
        }
      }
    }
  );

  $("#startGame").click(function(){
    gameLoopPaused = false;
    scoreManager.startCounter();
    InitGame();
    $("#gameMenu").hide();
    hideStartGame();
  });

  $("#continueGame").click(function(){
    $("#gameMenu").hide();
    two.play();
    gameLoopPaused =false;
  });

  $("#abandonGame").click(function(){
    endGame(two);
    gameLoopPaused = true;
  });

});
