"use strict";

//#region Utils
var utils = {
    norm: function (value, min, max) {
        return (value - min) / (max - min);
    },

    lerp: function (norm, min, max) {
        return (max - min) * norm + min;
    },

    getDirection: function (p0, p1) {
        var vect = { x: undefined, y: undefined };
        var distance = utils.distance(p0, p1);
        var angle = utils.getAngle(p0, p1);
        vect.x = distance * Math.cos(angle) / distance;
        vect.y = distance * Math.sin(angle) / distance;
        return vect;
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

    distanceXy: function (x0, y0, x1, y1) {
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

    getHeading: function (speed) {
        return Math.atan2(spped.y, speed.x);
    },
}
//#endregion

// Options
var opts = {
    resolution: 300,
    font: 'Arial',
    size: 40,
    color: 'white',
    letterWidth: 50,
    fps: 60,
    mouseStep: 5,
    speedVariation: -3
};
var mouse = {
    x: undefined,
    y: undefined,
    r: undefined
}

// Main function
$(function () {
    // Get canvas context
    var ctx = canvasInit("myCanvas");


    // ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Get text from file
    var text = readTextFile('docs/text.txt');
    var processedText = [];
    var sentencesArray = text.split('\r\n\r\n');
    let sentenceID = 0;
    sentencesArray.forEach(sentence => {
        var charID = 0;
        // Get characters by sentence
        var chars = sentence.split('');
        var charArray = [];
        var dxSentence = (Math.random() * opts.speedVariation);
        var dySentence = 0;
        var textWidth = 0;
        var lastposX = 0;
        // Create char object
        chars.forEach(char => {
            charArray.push(new Char(
                char,
                sentenceID,
                charID,
                lastposX + textWidth,
                sentenceID * opts.resolution + opts.size / 2,
                dxSentence,
                dySentence
            ));
            lastposX = charArray[charArray.length - 1].pos.x;
            ctx.font = opts.size + 'px ' + opts.font;
            textWidth = ctx.measureText(char).width;
            charID++;
        });
        processedText.push(new Sentence(charArray, sentenceID));
        sentenceID++;
    });

    animate();

    //#region functions
    function rotateCharacter(text, centerX, centerY, radianAngle) {
        // translate to the centerpoint you desire to rotate around
        ctx.translate(centerX, centerY);
        // rotate by the desired angle
        ctx.rotate(radianAngle);
        // draw the text on the canvas
        ctx.fillText('text', 0, 0);
        // always clean up -- reset transformations to default
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    function addEvents(mouse) {

        window.addEventListener('resize', function () {
            myCanvas.height = innerHeight;
            myCanvas.width = innerWidth;
        });
        window.addEventListener('mousemove',
            function (event) {
                mouse.x = event.x;
                mouse.y = event.y;
            }
        );
        window.addEventListener('mouseout',
            function (event) {
                mouse.x = undefined;
                mouse.y = undefined;
                mouse.r = undefined
            }
        );
        window.addEventListener('click',
            function () {

            }
        );
        window.addEventListener('contextmenu',
            function () {
                event.preventDefault();
            }
        );
        window.addEventListener('mousewheel', function (e) {
            if (e.wheelDelta > 0) {
                mouse.r = mouse.r == undefined ? 0 : mouse.r;
                if (mouse.r - opts.mouseStep >= 0) {
                    mouse.r -= opts.mouseStep;
                }
            } else if (e.wheelDelta < 0) {
                mouse.x = mouse.x;
                mouse.y = mouse.y;
                mouse.r = mouse.r == undefined ? 0 : mouse.r;
                mouse.r += opts.mouseStep;
            }
        });
        return mouse;
    }

    // Line Object
    function Sentence(charArray, sentenceID) {
        this.sentenceID = sentenceID;
        this.charArray = charArray;
    }

    // Char object
    function Char(txt, sID, cID, posX, posY, dx, dy) {
        this.txt = txt;
        this.sID = sID;
        this.cID = cID;
        this.pos = { x: posX, y: posY, yBase: posY };
        this.speed = { x: dx, y: dy };
        this.speedi = { x: dx, y: dy };
        this.distance;
        this.angle;
        this.norm = { x: undefined, y: undefined };
        this.angle = 0;

        this.draw1 = function () {
            ctx.fillText(
                this.txt,
                this.pos.x,
                this.pos.y
            );
        }

        this.draw = function (radianAngle) {
            // translate to the centerpoint you desire to rotate around
            ctx.translate(this.pos.x, this.pos.y);
            // rotate by the desired angle
            ctx.rotate(radianAngle);
            // draw the text on the canvas
            ctx.fillText(this.txt, 0, 0);
            ctx.rotate(-radianAngle);
            // always clean up -- reset transformations to default
            ctx.translate(-this.pos.x, -this.pos.y);
        }

        this.update = function () {
            this.pos.x += Math.floor(this.speed.x);
            // this.pos.x += (this.speed.x);
            // Prevent y speed actualization when mouse is not in the window
            if (mouse.x != undefined && mouse.y != undefined && mouse.r != undefined) {
                this.pos.y += this.speed.y;
                this.speedi = utils.getDirection(this.pos, mouse);
                this.distance = utils.distance(this.pos, mouse);
                var recuperationY = -this.speedi.y * mouse.r / 10;
                var repulsionY = (this.pos.y - this.pos.yBase) / 10;
                //this.speed.y = Math.floor(recuperationY - repulsionY);
                this.speed.y = (recuperationY - repulsionY);
            }
            // Locate leaving letter last in the line
            if (this.pos.x < 0 - opts.letterWidth) {
                this.pos.x = processedText[sID].charArray[processedText[sID].charArray.length - 1].pos.x + opts.letterWidth;
                processedText[sID].charArray.push(processedText[sID].charArray.shift());
            }
            // var angle = (this.pos.x - mouse.x) * this.speedi.y / 500;
            if ((Math.PI / 2 - utils.getAngle(mouse, this.pos)) * this.speedi.y != this.angle) {
                this.angle = this.speedi.y;
            }
            this.draw(this.angle);
        }
    }

    // Returns raw text from file.
    function readTextFile(file) {
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", file, false);
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                if (rawFile.status === 200 || rawFile.status == 0) {
                    var allText = rawFile.responseText;
                    // alert(allText);
                    return allText;
                }
            }
        }
        rawFile.send(null);
        return rawFile.responseText;
    }

    // Canvas init. returns 2d context
    function canvasInit(canvasId) {
        var myCanvas = document.createElement('canvas');
        myCanvas.id = canvasId;
        $('body').append(myCanvas);
        $('body').height(innerHeight);
        $('body').width(innerWidth);
        myCanvas.height = innerHeight;
        myCanvas.width = innerWidth;

        var c = myCanvas.getContext('2d', { alpha: false });
        mouse = addEvents(mouse);

        return c;
    }

    // Optinal field of repulsion
    function drawCircle(x, y, r) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, false);
        ctx.strokeStyle = 'white';
        ctx.stroke();
    }

    // Canvas update function
    function animate() {
        setTimeout(function () {
            ctx.clearRect(0, 0, innerWidth, innerHeight);
            var numLines = window.innerHeight / opts.resolution;
            for (let line = 0; line < numLines; line++) {
                ctx.font = opts.size + 'px ' + opts.font;
                ctx.fillStyle = opts.color;
                for (let letter = 0; letter < processedText[line].charArray.length; letter++) {
                    processedText[line].charArray[letter].update();
                }
            }
            drawCircle(mouse.x, mouse.y, mouse.r);
            requestAnimationFrame(animate);
        }, 1000 / opts.fps);
    }
    //#endregion
})

