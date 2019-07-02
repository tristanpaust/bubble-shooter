var bullet;
var lastPosition = {x:0,y:0};
var bulletIsMoving = false;

startNewGame = function() {
    makeGrid();
    drawTurret(0,0);

    for (let i = 1; i <= columns; i++) {
    	for (let j = 1; j <= 6; j++) {
    		drawBubbleAtIndex(i,j);
    	}
    }

    bullet = new Bullet();
}

startNewGame();


canvas.addEventListener("mousemove", function(evt){
    handleMouseMove(evt);
}, false);

handleMouseMove = function(e) {
    canvas.width = canvas.width;
    restoreGridOnRefresh();

        lastPosition.x = e.clientX;
        lastPosition.y = e.clientY;

    drawTurret(e.clientX, e.clientY);
    restoreBulletOnRefresh();
}

canvas.addEventListener("mouseup", function(e) {
    bulletIsMoving = true;
	function animate() {
    	if (bullet.getY() < 100) {
            bulletIsMoving = false;
        	clearInterval(intervalID);
    	}
    	canvas.width = canvas.width;
    	restoreGridOnRefresh();
    	drawTurret(lastPosition.x, lastPosition.y);
    	bullet.move(lastPosition.x, lastPosition.y);
    	restoreBulletOnRefresh(); 
    }
	var intervalID = setInterval(animate, 10);
})