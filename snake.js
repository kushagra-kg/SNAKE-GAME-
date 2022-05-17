function init() {
    var canvas = document.getElementById('mycanvas');
    // canvas.align.center;
    W = H = canvas.width = canvas.height = 1000;
    pen = canvas.getContext('2d');
    cs = (1000 / 15);
    game_over = false;
    score = 0;

    //image object
    food_img = new Image();
    food_img.src = "Assets/apple4.png";
    trophy = new Image();
    trophy.src = "Assets/trophy1.png";

    food = getRandomFood();

    snake = {
        init_len: 2,
        colour: "black",
        cells: [],
        direction: "right",

        createSnake: function() {
            for (var i = this.init_len; i > 0; i--) {
                this.cells.push({ x: i, y: 0 });
            }
        },
        drawSnake: function() {
            for (var i = 0; i < this.cells.length; i++) {
                pen.fillStyle = this.colour;
                pen.fillRect(this.cells[i].x * cs, this.cells[i].y * cs, cs, cs);
                pen.lineJoin = "round";
                pen.lineWidth = "500px";
                pen.strokeStyle = "yellow";
                pen.strokeRect(this.cells[i].x * cs, this.cells[i].y * cs, cs - 20, cs - 20);
                pen.strokeRect(this.cells[i].x * cs, this.cells[i].y * cs, cs, cs);
            }
        },
        updateSnake: function() {
            // if the snake has eaten food, we have to increaser the length of the snake
            //and generate a new food object.

            var headX = this.cells[0].x;
            var headY = this.cells[0].y;

            if (headX == food.x && headY == food.y) {
                food = getRandomFood();
                while (true) {
                    var counters = 0;
                    for (var k = 1; k < this.cells.length; k++) {
                        if (this.cells[k].x == food.x && this.cells[k].y == food.y) {
                            counters++;
                        }
                    }
                    if (counters == 0) break;
                    else {
                        food = getRandomFood();
                    }
                }
                score++;
            } else {
                this.cells.pop();
            }

            console.log("Updating snake");

            var nextX, nextY;
            if (this.direction == ("right" || "d")) {
                nextX = headX + 1;
                nextY = headY;
            } else if (this.direction == ("left" || "a")) {
                nextX = headX - 1;
                nextY = headY;
            } else if (this.direction == ("down" || "s")) {
                nextX = headX;
                nextY = headY + 1;
            } else if (this.direction == ("up" || "w")) {
                nextX = headX;
                nextY = headY - 1;
            }


            this.cells.unshift({ x: nextX, y: nextY });
            //checks

            var last_X = Math.round(W / cs);
            var last_Y = Math.round(H / cs);
            if (headX < 0 || headY < 0 || headX >= last_X || headY >= last_Y) {
                game_over = true;
                console.log("out");
            }

            //check for snake collision
            for (var j = 1; j < this.cells.length; j++) {
                if (this.cells[0].x == this.cells[j].x && this.cells[0].y == this.cells[j].y) {
                    game_over = true;
                    break;
                }
            }
        },

    };
    snake.createSnake();

    function keyPressed(e) {
        if (e.key == "ArrowRight") {
            if (snake.direction != "left") snake.direction = "right";
        } else if (e.key == "ArrowLeft") {
            if (snake.direction != "right") snake.direction = "left";
        } else if (e.key == "ArrowDown") {
            if (snake.direction != "up") snake.direction = "down";
        } else if (e.key == "ArrowUp") {
            if (snake.direction != "down") snake.direction = "up";
        }
    }

    document.addEventListener('keydown', keyPressed);
}

function draw() {
    pen.clearRect(0, 0, W, H);
    snake.drawSnake();

    pen.fillStyle = food.color;
    pen.drawImage(food_img, food.x * cs, food.y * cs, cs, cs);

    pen.drawImage(trophy, 18, 20);
    if (score < 10) {
        pen.fillStyle = "yellow";
        pen.font = "32px Verdana";
        pen.fillText(score, 53, 70, cs - 1, cs);
    } else if (score >= 10 && score <= 99) {
        pen.fillStyle = "yellow";
        pen.font = "28px Verdana";
        pen.fillText(score, 46, 70, cs - 1, cs);
    }
}

function update() {
    snake.updateSnake();
}

function getRandomFood() {
    var foodX = Math.round(Math.random() * (W - cs) / cs);
    var foodY = Math.round(Math.random() * (H - cs) / cs);

    var food = {
        x: foodX,
        y: foodY,
        color: "yellow",
    }
    return food;
}

function gameloop() {

    if (game_over == true) {
        console.log("game over");
        pen.clearRect(0, 0, W, H);
        clearInterval(f);
        var txt = document.getElementById('finalscore');
        txt.innerHTML = `Score: ${score}`;
        document.getElementById('EndScreen').style.display = "flex";
        //console.log("yha tak to chal rha");
        //replay();
        //return;
    } else {
        update();
        draw();
    }
}

function replay() {
    //console.log("why man?");
    location.reload();
}

function startGame() {
    document.getElementById("introScreen").style.display = "none";
    //alert("Game is starting");
    init();
    draw();

    f = setInterval(gameloop, 95);
}