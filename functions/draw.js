let bubbleColors = ["#000000", "#005eff", "#00d12e", "#e70909", "#f8fe00"];

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

drawBoardLine = function(x1,y1, x2, y2) { 
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2, y2);

    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000000';
    ctx.stroke();
    ctx.closePath();
}

drawBoardTile = function(x,y,color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 25, 25);
}

drawBoard = function() {
    ctx.rect(0,0, canvas.width, canvas.height);
    ctx.fillStyle = '#f9f9f9';
    ctx.fill();

    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] !== 0) {
                var x = i*25;
                var y = j*25;
                drawBoardTile(x,y,matrix[i][j]);
            }
        }
    }
    for (var i = 0; i < columns; i++) {
        var x = (canvas.width/columns) * i; 
        drawBoardLine(x,0,x,canvas.height);
    }
    for (var j = 0; j < rows; j++) {
        var y = (canvas.width/columns) * j; 
        drawBoardLine(0,y,canvas.width,y);
    }
}

getRandomColor = function() {
    return bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
}

drawBubble = function(x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
}

drawBubbleAtIndex = function(i,j) {
    let currentColor = getRandomColor();
    updateGrid(i, j, currentColor);
    return drawBubble((25 * i - 12.5), (25 * j - 12.5), 12, currentColor);
}

clearCanvas = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

var currentAngle = 0;
drawTurret = function(mouseX, mouseY)  {
    let start = 2 * Math.PI/2;
    let end = start * 1.5 + Math.PI/2;
    let centerX = canvas.width/2;
    let centerY = canvas.height;
    let radius = 50;

    let dx = mouseX - centerX;
    let dy = mouseY - centerY;
    let angle = Math.atan2(dy, dx);

    if (angle < -2.6 || angle > 3) { // Restrict left side, or leaving canvas on left side
        angle = -2.6;
    }
    if (angle >= -0.4 || angle > 0) { // Restrict right side, initial condition
        angle = -0.4
    }

    ctx.save();

    ctx.beginPath();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle + (currentAngle)*.2);
    ctx.translate(-centerX, -centerY);
    ctx.fillStyle="yellow";
    ctx.rect(centerX - radius / 5, centerY - radius / 5, 100, 20);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    currentAngle = angle *0.2;
    ctx.restore();

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, start, end);
    ctx.stroke();
    ctx.closePath();
    ctx.fillStyle="yellow";
    ctx.fill();
}

var currentBullet;

generateBullet = function() {
    currentBullet = getRandomColor();
    return drawBubble(canvas.width/2, canvas.height - 20, 12, currentBullet);
}

restoreBulletOnRefresh = function() {
    return drawBubble(bullet.getX(), bullet.getY(), 12, bullet.getColor());
}

clearBullet = function() {
    ctx.clearRect(bullet.getX()-12, bullet.getY(), 24, 13);
}

Bullet = function() {
    var color = getRandomColor();
    var x = canvas.width / 2;
    var y = canvas.height - 20;

    var angle = 0;
    var hasBounced = false;
    var goLeft = false;
    
    this.getX = function() {
        return x;
    }
    this.getY = function() {
        return y;
    }
    this.getColor = function() {
        return color;
    }
    this.move = function(lastX, lastY) {
        if (this.canMoveY()) {

            if (angle == 0) {
               angle = this.determineAngle(lastX, lastY);
            }

            y -= (-1) * (Math.sin((angle) * Math.PI / 180));

            if (hasBounced) {
                if (goLeft) {
                    if (this.canMoveLeft()) {
                        return x -= (Math.abs(Math.cos((angle) * Math.PI / 180)))*5;
                    }
                    return goLeft = false;
                }    
                else {
                   if (this.canMoveRight()) {
                    return x += (Math.abs(Math.cos((angle) * Math.PI / 180)))*5;
                   } 
                   return goLeft = true;
                }
            }
            if (Math.abs(angle) > 90) {
                if (this.canMoveLeft()) { 
                    goLeft = true;
                    return x -= (Math.abs(Math.cos((angle) * Math.PI / 180)))*5;
                }
                goLeft = false;
                return hasBounced = true;
            }
            else {
                if (this.canMoveRight()) {
                    return x += (Math.abs(Math.cos((angle) * Math.PI / 180)))*5;
                }
                hasBounced = true;
                return goLeft = true;
            }
        }
    }
    this.determineAngle = function(lastX, lastY) {
        var dx = lastX - canvas.width/2;
        var dy = lastY - canvas.height;
        var rad = Math.atan2(dy,dx);
        var deg = (rad * 180) / Math.PI;
        return deg;
    }
    this.canMoveY = function() {
        if (y > 0) {
            return true;
        }
        return false;
    }
    this.canMoveRight = function() {
        if (x <= 388) {
            return true;
        }
        return false;
    }
    this.canMoveLeft = function() {
        if (12 <= x) {
            return true;
        }
        return false;
    }
}