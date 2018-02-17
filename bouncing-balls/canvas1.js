$(function () {
    "use strict";
    //#region Variables 
    var myCanvas = canvasInit("myCanvas");
    var c = myCanvas.getContext('2d');
    var nLetters = 0;
    var maxSpeed = 5;
    var howClose = 5;
    var fontMaxSize = 200;
    var lettersArray = [];
    var loadingDots = [];
    var friction = 0.99;
    var gravity = 0;
    var stage = 0;
    var posibleLetters = [
        "S",
        "L",
        "T"
    ];
    var posibleColors = [
        "#144F54",
        "#4B8287",
        "#B18D43",
        "#B18D43",
    ];
    //#endregion

    //#region Falling Letters Array
    for (var i = 0; i < nLetters; i++) {
        var letter = Math.floor(Math.random() * 3);
        var color = Math.floor(Math.random() * 4);
        var fill = Math.floor(Math.random() * 4);
        var dx = (Math.random() - 0.5) * maxSpeed;
        var dy = (Math.random() - 0.5) * maxSpeed;
        var posX = Math.random() * (innerWidth - 2 * fontMaxSize) + fontMaxSize;
        var posY = Math.random() * (innerHeight - 2 * fontMaxSize) + fontMaxSize;
        lettersArray.push(new Letter(letter, color, fill, posX, posY, dx, dy, fontMaxSize));
    }
    //#endregion

    //#region Texts
    var title = new CenteredText(
        300, "Roboto", [177, 141, 67, 0], "S L T", 0, -50
    );
    var subTitle = new CenteredText(
        100, "Roboto", [177, 141, 67, 0], "Smart Law Tech", 0, -250
    );
    for (let i = 0; i < 3; i++) {
        loadingDots.push(new Circle(
            centerX(-200 + 200 * i), centerY(-350), 0, 0, 10, [177, 141, 67, 0], [177, 141, 67, 0], i
        ));
    }
    var background = new Background("rgba(0, 33, 36, 1)");
    //#endregion

    //#region eventListeners
    var mouse = {
        x: undefined,
        y: undefined
    }
    window.addEventListener('resize', function () {
        myCanvas = canvasInit("myCanvas");
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
        }
    );
    //#endregion

    //#region Objcts
    function Background(fill) {
        this.fill = fill;
        this.draw = function () {
            c.beginPath();
            c.fillStyle = this.fill;
            c.fillRect(0, 0, innerWidth, innerHeight);
            c.stroke();
        }
    }

    function Letter(letter, color, fill, posX, posY, dx, dy, fontSize) {
        this.letter = posibleLetters[letter];
        this.color = posibleColors[color];
        this.fill = posibleColors[fill];
        this.dx = dx;
        this.dy = dy;
        this.posX = posX;
        this.posY = posY;
        this.fontSize = fontSize;

        this.draw = function () {
            c.font = this.fontSize + "px " + "Roboto";
            c.fillStyle = this.color;
            c.textAlign = "center";
            c.fillText(this.letter, this.posX, this.posY);
        }

        this.update = function () {

            this.posX += this.dx;
            var rigtBorder = this.posX;
            var leftBorder = this.posX;
            var botBorder = this.posY;
            var topBorder = this.posY;

            // Correct position if ball goes of limmits
            if (botBorder > innerHeight) {
                this.posY = innerHeight - 0.0001;
            }
            if (topBorder < 0) {
                this.posY = this.fontSize + 0.0001;
                this.dy = -this.dy;
            } else {
                this.posY += this.dy;
            }

            // Invert speed if the ball reach a border
            rigtBorder = this.posX;
            leftBorder = this.posX;
            botBorder = this.posY;
            topBorder = this.posY;
            if (rigtBorder > innerWidth || leftBorder < 0) {
                this.dx = -this.dx * (1 - (1 - friction) / 3);
            }
            if (botBorder > innerHeight || topBorder < 0) {
                this.dy = -this.dy * friction;
            } else {
                this.dy += gravity;
            }
            this.draw();
        }
    }

    function CenteredText(fontSize, fontFamily, fill, text, x, y) {
        this.fontSize = fontSize;
        this.fontFamily = fontFamily;
        this.fill = fill;
        this.rgba = 'rgba(' + fill[0] + ',' + fill[1] + ',' + fill[2] + ',' + fill[3] + ')';
        this.text = text;
        this.x = x;
        this.y = y;

        this.draw = function () {
            if (fill[0] < 255 && fill[1] < 255 && fill[2] < 255 && fill[3] < 1) {
                this.rgba = 'rgba(' + fill[0] + ',' + fill[1] + ',' + fill[2] + ',' + fill[3] + ')';
            }
            c.font = this.fontSize + "px " + this.fontFamily;
            c.fillStyle = this.rgba;
            c.textAlign = "center";
            c.fillText(this.text, centerX(x), centerY(y));
        }
        this.update = function () {
            this.draw();
        }
    }

    function Circle(x, y, dx, dy, r, color, fill, id) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = r;
        this.oRadius = r;
        this.color = color;
        this.fill = fill;
        if (fill[0] < 255 && fill[1] < 255 && fill[2] < 255 && fill[3] < 1) {
            this.rgba = 'rgba(' + fill[0] + ',' + fill[1] + ',' + fill[2] + ',' + fill[3] + ')';
        }

        this.draw = function () {
            c.beginPath();
            c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            c.strokeStyle = this.rgba;
            c.stroke();
            c.fillStyle = this.rgba;
            c.fill();
        }

        this.update = function () {
            if (fill[0] < 255 && fill[1] < 255 && fill[2] < 255 && fill[3] < 1) {
                this.rgba = 'rgba(' + fill[0] + ',' + fill[1] + ',' + fill[2] + ',' + fill[3] + ')';
            }
            this.x += this.dx;
            // Border Calculation
            var rigtBorder = this.x + this.radius;
            var leftBorder = this.x - this.radius;
            var botBorder = this.y + this.radius;
            var topBorder = this.y - this.radius;

            // Correct position if ball goes of limmits
            if (botBorder > innerHeight) {
                this.y = innerHeight - this.radius - 0.0001;
            }
            if (topBorder < 0) {
                this.y = this.radius + 0.0001;
                this.dy = -this.dy;
            } else {
                this.y += this.dy;
            }

            // Invert speed if the ball reach a border
            rigtBorder = this.x + this.radius;
            leftBorder = this.x - this.radius;
            botBorder = this.y + this.radius;
            topBorder = this.y - this.radius;
            if (rigtBorder > innerWidth || leftBorder < 0) {
                this.dx = -this.dx * (1 - (1 - friction) / 3);
            }
            if (botBorder > innerHeight || topBorder < 0) {
                this.dy = -this.dy * friction;
            } else {
                this.dy += gravity;
            }

            // Interactivity
            // var hci = howCloseIs(this.x, this.y) / this.radius;
            // if (isClose(this.x, this.y, howClose, this.radius) &&
            //     this.radius < this.oRadius * howBig) {
            //     this.radius += 1;
            // } else if (!isClose(this.x, this.y, howClose, this.radius) &&
            //     this.radius > this.oRadius) {
            //     this.radius -= 1;
            // }
        }
    }

    function isClose(x, y, cl, r) {
        var dist = howCloseIs(x, y);
        return dist < (r + cl);
    }
    //#endregion

    //#region Utility
    function howCloseIs(x, y) {
        var xd = Math.abs(mouse.x - x);
        var yd = Math.abs(mouse.y - y);
        var dist = Math.sqrt(Math.pow(xd, 2) + Math.pow(yd, 2))
        return dist;
    }

    function canvasInit(canvasId) {
        var myCanvas = document.createElement('canvas');
        myCanvas.id = canvasId;
        $('body').append(myCanvas);
        $('body')[0].height = innerHeight;
        $('body')[0].width = innerWidth;
        myCanvas.height = innerHeight;
        myCanvas.width = innerWidth;

        return myCanvas;
    }

    function centerX(size) {
        return window.innerWidth / 2 - size / 2;
    }

    function centerY(size) {
        return window.innerHeight / 2 - size / 2;
    }
    //#endregion

    function animateLetters() {
        for (let index = 0; index < lettersArray.length; index++) {
            lettersArray[index].update();
        }
    }

    function animateDots1() {
        for (let a = 0; a < loadingDots.length; a++) {
            if (loadingDots[a].fill[3] <= 1) {
                // c.scale(1, 1);
                loadingDots[a].fill[3] += 0.01;
            }
            if(stage == 0) {
                loadingDots[2].radius += 0.15;
            }
            if (loadingDots[2].radius >= 20) {
                stage = 1;
            }
            if(stage == 1) {
                loadingDots[2].radius -= 0.15;
                loadingDots[1].radius += 0.15;
            }
            if (loadingDots[1].radius >= 20) {
                stage = 2;
            }
            if(stage == 2) {
                loadingDots[1].radius -= 0.15;
                loadingDots[0].radius += 0.15;
            }
            if (loadingDots[0].radius >= 20) {
                stage = 3;
            }
            if(stage == 3) {
                loadingDots[0].radius -= 0.15;
                loadingDots[2].radius += 0.15;
            }
            loadingDots[a].draw();
            loadingDots[a].update();
            // console.log(stage);
            // console.log(loadingDots[2].radius);
        }
    }

    function animateDots() {
    }

    animate();

    function animate() {
        requestAnimationFrame(animate);
        c.clearRect(0, 0, innerWidth, innerHeight);

        background.draw();
        subTitle.fill[3] += 0.01;
        subTitle.update();
        title.fill[3] += 0.01;
        title.update();
        
        animateLetters();
        animateDots1();

    }
});

