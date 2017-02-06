function ScoreCounter(name = "Player"){
  this.nickname = name == ""? "Player" : name;
  this.score = 0;
  this.update = function(){
    this.score++;
  }
  this.isBiggerThan = function(otherCounter){
    return this.score > otherCounter.score;
  }
}

function ScoreTableManager(){
var counters = [];
var lastScoreCell = null;
var currentCounter;

var createRow = function(scoreCounter){
  var newRow = $("<tr><td>"+scoreCounter.nickname+"</td><td>"+scoreCounter.score+"</td></tr>");
  $("#scoreTable").append(newRow);
  // console.log("in createRow() -- "+$("#scoreTable td:nth-child(2)").html());
  return $("#scoreTable td:last");
};

this.startCounter = function(){
    while(counters.length>10){
      lastScoreCell = null;
      $("#scoreTable tr:last-child").remove();
      counters.length--;
    }

    currentCounter = new ScoreCounter($("#nicknameInput").val());
    counters.push(currentCounter);
    lastScoreCell = createRow(currentCounter);
}

this.update =function(){
  currentCounter.update();
  lastScoreCell.html(currentCounter.score);

  if(counters.indexOf(currentCounter) > 0)
    if(currentCounter.isBiggerThan(counters[counters.indexOf(currentCounter)-1]))
      this.generateRows();
}

this.generateRows = function(){
  // $("#scoreTable").empty();
  // $("#scoreTable").append($("<tr><th>Nickname</th><th>Score</th></tr>"))
  counters.sort(function(one, two){
    return two.isBiggerThan(one);
  });
  var row = $(lastScoreCell).parents("tr:first")
  row.insertBefore(row.prev());
}
  for(var i = 0; i < counters.length; i++){
    if(currentCounter == counters[i])
      lastScoreCell = createRow();
    createRow(counters[i]);
  }
// this.generateRows();
}
