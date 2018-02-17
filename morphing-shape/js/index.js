var colors = ["#EDEEC0", "#ED7B84", "#7397C3", "#7EB77F"];

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var pathPointsFrom, pathPointsTo, pathPointsNow;
var steps = 200;
var offset = 0;
var pathCount = 0;
var interpolationPoint = { percentage: 0 };
var fps = 100;
ctx.lineWidth = 4;
ctx.lineCap = "round";

function drawPathToCanvas() {
  var thisColor, lastColor = getColorSegment(0);
  ctx.strokeStyle = lastColor;
  ctx.beginPath();
  for (var i = 0, l = pathPointsNow.length; i < l; i++) {
    if (pathPointsNow[i + 1]) {
      ctx.moveTo(pathPointsNow[i].x, pathPointsNow[i].y);
      ctx.lineTo(pathPointsNow[i + 1].x, pathPointsNow[i + 1].y);
    } else {
      ctx.lineTo(pathPointsNow[i].x, pathPointsNow[i].y);
    }
    thisColor = getColorSegment(i);
    if (thisColor) {
      if (thisColor != lastColor) {
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = thisColor;
        lastColor = thisColor;
      }
    }
  }
  ctx.closePath();
  ctx.stroke();
}

function samplePath(pathSelector) {
  var path = document.getElementById(pathSelector);
  var length = path.getTotalLength();
  var points = [];
  for (var i = 0; i <= steps; i++) {
    points.push(path.getPointAtLength(length * i / steps));
  }
  return points;
}

function interpolatePaths() {
  var points = [];
  for (var i = 0; i <= steps; i++) {
    points.push({ x: pathPointsFrom[i].x + (pathPointsTo[i].x - pathPointsFrom[i].x) * interpolationPoint.percentage, 
      y: pathPointsFrom[i].y + (pathPointsTo[i].y - pathPointsFrom[i].y) * interpolationPoint.percentage });
  }
  return points;
}

function getColorSegment(i) {
  var p = i / steps + offset;
  if (p > 1) p = p - 1;
  var point = Math.floor(p * 4);
  return colors[point];
}

function loop() {
  setTimeout(function () {
  ctx.clearRect(0, 0, 600, 200);
  offset = offset + 0.007;
  pathPointsNow = interpolatePaths();
  if (offset >= 1) offset = 0;
  drawPathToCanvas();
  requestAnimationFrame(loop);
}, 1000 / fps);
}

function tweenPaths() {
  pathPointsFrom = paths[pathCount];
  if (pathCount + 1 <= 2) pathPointsTo = paths[pathCount + 1];
  else pathPointsTo = paths[0];
  
  TweenLite.to(interpolationPoint, 0.7, {
    percentage: 1,
    ease: Power4.easeInOut,
    delay: 0.4,
    repeat:1,
    onComplete: function () {
      interpolationPoint.percentage = 0;
      pathCount++;
      if (pathCount > 2) {
        pathCount = 0;
      }
      tweenPaths();
    }
  });
}

var paths = [samplePath("circle-path"), samplePath("rect-path"), samplePath("triangle-path")];

tweenPaths();
loop();