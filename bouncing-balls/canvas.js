$(function () {
    "use strict";
    var myCanvas = canvasInit("myCanvas");
    var c = myCanvas.getContext('2d');
    var howBig = 5;
    var howClose = 50;
    var circleArray = [];
    var nCircles = 60;
    var maxSixe = 20;
    var minSize = 10;
    var gravity = 0.10;
    var friction = 0.99;
    var speed = 10;
    var colorsArray = [
        "#144F54",
        "#4B8287",
        "#002124",
        "#B18D43",
        "#B18D43",
        "#610B07"
    ];

    for (var i = 0; i < nCircles; i++) {
        var dx = (Math.random() - 0.5) * speed;
        var dy = (Math.random() - 0.5) * speed;
        var color = Math.floor(Math.random() * 4);
        var radius = Math.round(minSize + Math.random() * maxSixe);
        var x = Math.random() * (innerWidth - 2 * radius) + radius;
        var y = Math.random() * (innerHeight - 2 * radius) + radius;

        circleArray.push(new Circle(x, y, dx, dy, radius, color, true, i));
    }

    var mouse = {
        x: undefined,
        y: undefined
    }

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

    window.addEventListener('resize', function () {
        myCanvas.height = innerHeight;
        myCanvas.width = innerWidth;
    });

    window.addEventListener('click', function () {
        circleArray.forEach(element => {
            element.dy = -3;
            //element.y -= 4;
        });
    });

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

        this.draw = function () {
            c.beginPath();
            c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            c.strokeStyle = 'black';
            c.stroke();
            if (fill) {
                c.fillStyle = colorsArray[this.color];
                c.fill();
            }
        }

        this.update = function () {

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
            var hci = howCloseIs(this.x, this.y) / this.radius;
            if (isClose(this.x, this.y, howClose, this.radius) &&
                this.radius < this.oRadius * howBig) {
                this.radius += 1;
            } else if (!isClose(this.x, this.y, howClose, this.radius) &&
                this.radius > this.oRadius) {
                this.radius -= 1;
            }

            // circleArray.forEach(element => {
            //     var dist = howCloseIs(this.x, this.y, element.x, element.y);
            //     if (dist < this.radius + element.radius && this.id != element.id) {
            //         var i = (this.x - element.x) / dist;
            //         var j = (this.y - element.y) / dist;
            //         var dt = Math.sqrt(Math.pow(this.dx, 2) + Math.pow(this.dy, 2));
            //         var de = Math.sqrt(Math.pow(element.dx, 2) + Math.pow(element.dy, 2));
            //         this.dx = dt * i;
            //         element.dx = -de * i;
            //         this.dy = dt * j;
            //         element.dy = -de * j;
            //     }
            // });

        }
    }

    animate();

    function animate() {
        requestAnimationFrame(animate);
        c.clearRect(0, 0, innerWidth, innerHeight);
        for (let index = 0; index < circleArray.length; index++) {
            circleArray[index].draw();
            circleArray[index].update();
            // var cRange = new Circle(mouse.x, mouse.y, 0, 0, howClose, 'black', false);
            // cRange.draw();
            // cRange.update();
        }
    }

    function isClose(x, y, cl, r) {
        var dist = howCloseIs(x, y);
        return dist < (r + cl);
        // return (x - r < mouse.x + cl && x + r > mouse.x - cl &&
        //     y - r < mouse.y + cl && y + r > mouse.y - cl);
    } 

    function howCloseIs(x, y) {
        var xd = Math.abs(mouse.x - x);
        var yd = Math.abs(mouse.y - y);
        var dist = Math.sqrt(Math.pow(xd, 2) + Math.pow(yd, 2))
        return dist;
    }    
});

function centerX(size) {
    return window.innerWidth / 2 - size / 2;
}

function centerY(size) {
    return window.innerHeight / 2 - size / 2;
}

function canvasInit(canvasId) {
    var myCanvas = document.createElement('canvas');
    myCanvas.id = canvasId;
    $('body').append(myCanvas);
    $('body')[0].height = innerHeight;
    $('body')[0].width = innerWidth;
    myCanvas.height = innerHeight;
    myCanvas.width = innerWidth;

    var c = myCanvas.getContext('2d');

    return myCanvas;
}