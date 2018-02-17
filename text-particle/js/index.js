"use strict";

//#region Utils
var utils = {
  norm: function (value, min, max) {
    return (value - min) / (max - min);
  },

  lerp: function (norm, min, max) {
    return (max - min) * norm + min;
  },

  map: function (value, sourceMin, sourceMax, destMin, destMax) {
    return utils.lerp(utils.norm(value, sourceMin, sourceMax), destMin, destMax);
  },

  clamp: function (value, min, max) {
    return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max));
  },

  distance: function (p0, p1) {
    var dx = p1.x - p0.x,
      dy = p1.y - p0.y;
    return Math.sqrt(dx * dx + dy * dy);
  },

  distanceXY: function (x0, y0, x1, y1) {
    var dx = x1 - x0,
      dy = y1 - y0;
    return Math.sqrt(dx * dx + dy * dy);
  },

  circleCollision: function (c0, c1) {
    return utils.distance(c0, c1) <= c0.radius + c1.radius;
  },

  circlePointCollision: function (x, y, circle) {
    return utils.distanceXY(x, y, circle.x, circle.y) < circle.radius;
  },

  pointInRect: function (x, y, rect) {
    return utils.inRange(x, rect.x, rect.x + rect.radius) &&
      utils.inRange(y, rect.y, rect.y + rect.radius);
  },

  inRange: function (value, min, max) {
    return value >= Math.min(min, max) && value <= Math.max(min, max);
  },

  rangeIntersect: function (min0, max0, min1, max1) {
    return Math.max(min0, max0) >= Math.min(min1, max1) &&
      Math.min(min0, max0) <= Math.max(min1, max1);
  },

  rectIntersect: function (r0, r1) {
    return utils.rangeIntersect(r0.x, r0.x + r0.width, r1.x, r1.x + r1.width) &&
      utils.rangeIntersect(r0.y, r0.y + r0.height, r1.y, r1.y + r1.height);
  },

  degreesToRads: function (degrees) {
    return degrees / 180 * Math.PI;
  },

  radsToDegrees: function (radians) {
    return radians * 180 / Math.PI;
  },

  randomRange: function (min, max) {
    return min + Math.random() * (max - min);
  },

  randomInt: function (min, max) {
    return min + Math.random() * (max - min + 1);
  },

  getmiddle: function (p0, p1) {
    var x = p0.x,
      x2 = p1.x;
    middlex = (x + x2) / 2;
    var y = p0.y,
      y2 = p1.y;
    middley = (y + y2) / 2;
    pos = [middlex, middley];

    return pos;
  },

  getAngle: function (p0, p1) {
    var deltaX = p1.x - p0.x;
    var deltaY = p1.y - p0.y;
    var rad = Math.atan2(deltaY, deltaX);
    return rad;
  },
  inpercentW: function (size) {
    return (size * W) / 100;
  },

  inpercentH: function (size) {
    return (size * H) / 100;
  },

  getDirection: function (p0, p1) {
    var vect = {x: undefined, y: undefined};
    var distance = utils.distance(p0, p1);
    var angle = utils.getAngle(p0, p1);
    vect.x = distance * Math.cos(angle) / distance;
    vect.y = distance * Math.sin(angle) / distance;
    return vect;
},
}
//#endregion

//#region Variables
var canvas = document.getElementById("canvas");
var H = canvas.height = window.innerHeight;
var W = canvas.width = window.innerWidth;
var ctx = canvas.getContext('2d');
var fps = 80;
var resolution = 5;
var gridX = resolution;
var gridY = resolution;
var colors = [
  [20, 79, 84, 0],
  [75, 130, 135, 0],
  [0, 33, 36, 0],
];
var gravity = 0;
var duration = 0.1;
var speed = 5;
var radius = 5;
var fieldvalue;
var message = "SLT";
//#endregion

//#region Events
$("#slGravity")[0].onchange = function () {
  changeOpts();
};
$("#slDuration")[0].onchange = function () {
  changeOpts();
};
$("#slSpeed")[0].onchange = function () {
  changeOpts();
};
$("#slGravity")[0].onchange = function () {
  changeOpts();
};
$("#slResolution")[0].onchange = function () {
  changeOpts();
};
$("#slRadius")[0].onchange = function () {
  changeOpts();
};
//#endregion

//#region Main Functions
function shape(x, y, texte) {
  this.x = x;
  this.y = y;
  this.size = 100;
  this.height = 400;
  this.width = 800;
  this.text = texte;
  this.placement = [];
  this.vectors = [];

  this.getValue = function () {
    // Draw the shape :^)
    ctx.textAlign = "center";
    // ctx.font = "bold " + this.size + "px Roboto";
    // ctx.fillText(this.text, this.x + ($("#interface").outerWidth()) / 2, this.y + this.size / 4);
    var img = document.getElementById("scream");
    ctx.drawImage(img, W / 2 - this.width / 2 + ($("#interface").outerWidth()) / 2, H / 2 - this.height / 2, this.width, this.height);

    var idata = ctx.getImageData(0, 0, W, H);
    var buffer32 = new Uint32Array(idata.data.buffer);

    for (var y = 0; y < H; y += gridY) {
      for (var x = 0; x < W; x += gridX) {
        if (buffer32[y * W + x]) {
          this.placement.push(new particle(x, y));
        }
      }
    }
    ctx.clearRect(0, 0, W, H);
  }
}

function particle(x, y, type) {
  this.radius = 1.1;
  this.futurRadius = utils.randomInt(radius, radius + 3);
  this.rebond = utils.randomInt(1, 5);
  this.x = x;
  this.y = y;
  this.dying = false;
  this.base = [x, y];
  this.vx = 0;
  this.vy = 0;
  this.type = type;
  this.friction = .99;
  this.gravity = gravity;
  this.tColor = colors[Math.floor(Math.random() * colors.length)];
  this.color = 'rgba(' +
    this.tColor[0] + ', ' +
    this.tColor[1] + ', ' +
    this.tColor[2] + ', ' +
    this.tColor[3] + ')';


  this.getSpeed = function () {
    return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
  };

  this.setSpeed = function (speed) {
    var heading = this.getHeading();
    this.vx = Math.cos(heading) * speed;
    this.vy = Math.sin(heading) * speed;
  };

  this.getHeading = function () {
    return Math.atan2(this.vy, this.vx);
  };

  this.setHeading = function (heading) {
    var speed = this.getSpeed();
    this.vx = Math.cos(heading) * speed;
    this.vy = Math.sin(heading) * speed;
  };

  this.angleTo = function (p2) {
    return Math.atan2(p2.y - this.y, p2.x - this.x);

  };

  this.update = function (heading) {

    this.x += this.vx;
    this.y += this.vy;
    this.vy += gravity;
    this.vx *= this.friction;
    this.vy *= this.friction;
    if (this.tColor[3] <= 1) {
      this.tColor[3] += 0.003 / fps;
    } else if (speed >= 0) {
      speed -= 0.01 / fps;
    }
    this.color = 'rgba(' +
      this.tColor[0] + ', ' +
      this.tColor[1] + ', ' +
      this.tColor[2] + ', ' +
      this.tColor[3] + ')';

    if (this.radius < this.futurRadius && this.dying === false) {
      this.radius += duration;
    } else {
      this.dying = true;
    }

    if (this.dying === true) {
      this.radius -= duration;
    }

    ctx.beginPath();
    ctx.fillStyle = this.color;
    // ctx.arc(this.x, this.y, this.radius, Math.PI * 2, false);
    ctx.rect(this.x, this.y, this.radius, this.radius)
    ctx.fill();
    ctx.closePath();

    if (this.y < 0 || this.radius < 1) {
      this.x = this.base[0];
      this.dying = false;
      this.y = this.base[1];
      this.radius = 1.1;
      this.setSpeed(speed);
    }
  };

  this.setSpeed(speed);
  this.setHeading(utils.randomInt(utils.degreesToRads(0), utils.degreesToRads(360)));
}

function setOpts() {
  $("#slResolution")[0].value = resolution;
  $("#slResolution")[0].value = resolution;
  $("#slDuration")[0].value = duration;
  $("#slGravity")[0].value = gravity;
  $("#slRadius")[0].value = radius;
  $("#slSpeed")[0].value = speed;
}

function changeOpts() {
  // ctx.clearRect(0, 0, W, H);
  gridX = parseFloat($("#slResolution")[0].value);
  gridY = parseFloat($("#slResolution")[0].value);
  duration = parseFloat($("#slDuration")[0].value);
  gravity = parseFloat($("#slGravity")[0].value);
  radius = parseFloat($("#slRadius")[0].value);
  speed = parseFloat($("#slSpeed")[0].value);
  // init();
}

function update() {
  setTimeout(function () {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < message.placement.length; i++) {
      message.placement[i].update();
    }
    requestAnimationFrame(update);
  }, 1000 / fps);
}

function init() {
  message = $("#message")[0].value;
  message = new shape(W / 2, H / 2 + 50, message);
  message.getValue();
  setOpts();
  changeOpts();
  update();

}
//#endregion

//#region Ready?
WebFont.load({
  google: {
    families: [
      'Roboto:100'
    ]
  },
  active: function () {
    init();
  }
});
//#endregion