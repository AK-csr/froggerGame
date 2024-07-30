class Sprite
{
    constructor(width, height, ix, iy, x)
    {
        this.width = width;
        this.height = height;
        this.ix = ix;
        this.iy = iy;
        this.x = x;
    }
}

function Lane(direction, speed,sprites, y, isInRiver)
{
    this.direction = direction;
    this.speed = speed;
    this.sprites = sprites;
    this.y = y;
    this.isInRiver = isInRiver;
}


let interfaceCanvas = document.getElementById("interfaceCanvas");
let backgroundCanvas = document.getElementById("backgroundCanvas");
let spriteCanvas = document.getElementById("spriteCanvas");

let interfaceCtx = interfaceCanvas.getContext("2d");
let spriteCtx = spriteCanvas.getContext("2d");
let backgroundCtx = backgroundCanvas.getContext("2d");

let sprite = new Image();
sprite.src = "../assets/sprites.png";

let dead = new Image();
dead.src = "../assets/dead.png";

let lanes = new Array(12);
let direction = 1;

for (let i = 0; i < lanes.length; i++)
{
    let speed = Math.floor(Math.random()* 3 + 1)*4;
    let rndX = Math.floor(Math.random()* 37 + 1)*10;

    let cars = new Array(5);
    cars[0] = new Sprite(30, 30, 10, 300, rndX);
    cars[1] = new Sprite(30, 30, 10, 260, rndX);
    cars[2] = new Sprite(30, 30, 40, 260, rndX);
    cars[3] = new Sprite(30, 30, 80, 260, rndX);
    cars[4] = new Sprite(60, 30, 100, 300, rndX);


    let logs = new Array(3);
    logs[0] = new Sprite(90, 30, 5, 230, rndX);
    logs[1] = new Sprite(120, 30, 5, 190, rndX);
    logs[2] = new Sprite(180, 30, 5, 160, rndX);

    if (i <= 5)
    {
        lanes[i] = new Lane(direction, speed, cars, 460 - (i*30), false);
    }
    else
    {
        lanes[i] = new Lane(direction, speed, logs, 460 - ( (i + 1)*30), true);
    }
    direction = direction * -1;
}

interfaceCanvas.addEventListener("click", startGame);
document.addEventListener("keydown", moveFrog);
setInterval(moveSprites, 100);
setInterval(updateBG, 1000);

let frog = {
    x : 185,
    y : 490,
    direction : "up",
    speed : 30,
    width : 30,
    height : 30
};

let home = new Array(4);

let player = {
    time : 60,
    lives : 5,
    state : "start",
    score : 0,
    safeHomes : home
};

function showStartScreen()
{
    interfaceCtx.fillRect(0,0,400,565);
    interfaceCtx.drawImage(sprite, 0, 0, 400, 50, 25, 125, 400, 50);
    interfaceCtx.fillStyle = "green";
    interfaceCtx.fillRect(150, 275, 100, 40);
    interfaceCtx.fillStyle = "black";
    interfaceCtx.font = "20px Georgia";
    interfaceCtx.fillText("Start", 175, 300);
}

function startGame(event)
{
    if (player.state == "start")
    {
        if (isPointCollision(event.offsetX, event.offsetY, 150, 275, 100, 40) == true)
        {
            interfaceCtx.clearRect(0,0,400,565);
            player.state = "playing";
            renderBackground();
            renderFrog();
            renderLives();
            renderScore();
            renderTime();
            renderSprites();
        }
    
        else
        {
            return;
        }
    }
}

function renderBackground()
{
    backgroundCtx.fillStyle = "black";
    backgroundCtx.fillRect(0,0,400,565);
    backgroundCtx.fillStyle = "blue";
    backgroundCtx.fillRect(0,50,400, 250)
    backgroundCtx.drawImage(sprite, 0, 0, 400, 50, 25, 0, 400, 50);
    backgroundCtx.drawImage(sprite, 0, 50, 400, 60, 0, 42, 400, 60);
    backgroundCtx.drawImage(sprite, 0, 110, 400, 50, 0, 270, 400, 50);
    backgroundCtx.drawImage(sprite, 0, 110, 400, 50, 0, 480, 400, 50);
}

function renderFrog()
{
    interfaceCtx.drawImage(sprite, 10, 360, frog.height, frog.width, frog.x, frog.y, frog.width, frog.height)
}

function renderLives()
{
    for (let i = 0; i < player.lives; i++)
    {
        backgroundCtx.drawImage(sprite, 10, 330, frog.height, frog.width, 0 + (i * 15), 520, frog.width - 10 , frog.height - 10)
    }
}

function renderScore()
{
    backgroundCtx.fillStyle = "yellow";
    backgroundCtx.font = "15px Georgia";
    backgroundCtx.fillText("Score:", 0, 550);
    backgroundCtx.fillText(player.score, 45, 550);
}

function renderTime()
{
    backgroundCtx.fillText("Time:", 280, 550);
    backgroundCtx.fillText( player.time, 330, 550);
}

function renderSprites()
{
    index = 0;
    index2 = 0;

    for (let i = 0; i < lanes.length; i++)
    {

        if (i <= 5)
        {
            spriteCtx.drawImage(sprite, 
                lanes[i].sprites[index].ix, 
                lanes[i].sprites[index].iy, 
                lanes[i].sprites[index].width, 
                lanes[i].sprites[index].height, 
                lanes[i].sprites[index].x, 
                lanes[i].y, 
                lanes[i].sprites[index].width, 
                lanes[i].sprites[index].height)
            
        }
        else
        {
            spriteCtx.drawImage(sprite, 
                lanes[i].sprites[index2].ix, 
                lanes[i].sprites[index2].iy, 
                lanes[i].sprites[index2].width, 
                lanes[i].sprites[index2].height, 
                lanes[i].sprites[index2].x, 
                lanes[i].y, 
                lanes[i].sprites[index2].width, 
                lanes[i].sprites[index2].height)
        }
    }

}

function updateBG()
{
    player.time = player.time - 1;
    backgroundCtx.clearRect(0,0,400,565);
    renderBackground();
    renderLives();
    renderScore();
    renderTime();
}

function moveSprites()
{
    spriteCtx.clearRect(0,0,400,565);

    let index = 0;

    for (let i = 0; i < lanes.length; i++)
    {
            if (lanes[i].direction == 1)
            {
                    if (lanes[i].sprites[index].x < 370)
                    {
                        lanes[i].sprites[index].x = lanes[i].sprites[index].x + lanes[i].speed;
                    }
                    else
                    {
                        lanes[i].sprites[index].x = 10;
                    }
            }
            else
            {
                    if (lanes[i].sprites[index].x > 10)
                    {
                        lanes[i].sprites[index].x = lanes[i].sprites[index].x - lanes[index].speed;
                    }
                    else
                    {
                        lanes[i].sprites[index].x = 370;
                    }
            }
    }
    renderSprites();
}

function moveFrog(event)
{
    if (event.code == "ArrowUp")
    {
        if (frog.y > 90)
        {
            interfaceCtx.clearRect( 0, 0, 400, 520);
            frog.y = frog.y - frog.speed;
        }
    }
    else if (event.code == "ArrowDown")
    {
        if (frog.y < 490)
        {
            interfaceCtx.clearRect( 0, 0, 400, 520);
            frog.y = frog.y + frog.speed;
        }
    }
    else if (event.code == "ArrowLeft")
    {
        if (frog.x >= 30)
        {
            interfaceCtx.clearRect( 0, 0, 400, 520);
            frog.x = frog.x - frog.speed;
        }

    }
    else if (event.code == "ArrowRight")
    {
        if (frog.x <= 360)
        {
            interfaceCtx.clearRect( 0, 0, 400, 520);
            frog.x = frog.x + frog.speed;
        }
    }

    renderFrog();
}

function isPointCollision(px, py, bx, by, bw, bh)
{
    if ( (px >= bx && px <= (bx + bw)) && (py >= by && py <= (by + bh)) )
    {
        return true;
    }
    else
    {
        return false;
    }
}

function isBoxCollision(b1x, b1y, b1w, b1h, b2x, b2y, b2w, b2h)
{
    let dx = Math.abs( (b1x+ (b1w/2)) - (b2x + (b2w/2)) );
    let dy = Math.abs( (b1y+ (b1h/2)) - (b2y + (b2h/2)) );

    let combW = b1w/2 + b2w/2;
    let combH = b1h/2 + b2h/2;

    if (dx <= combW || dy <= combH )
    {
        return true;
    }
    else
    {
        return false;
    }
}
