// alert('You should write code into "static/js/game.js" to make it work');
var gameStageArch = [];
const player1 = 'O';
const player2 = 'X';
let pl = 2;

// get board size
function getBoardSize(){
    let board = document.getElementById('game-board');
    let rowsNum = board.getAttribute('data-row-num');
    let colsNum = board.getAttribute('data-col-num');

    return [+rowsNum, +colsNum]
}

// build game stage archive according to border size
function createGameStageArch(){
    let borderSize = getBoardSize();
    let rows = borderSize[0];
    let cols = borderSize[1];
    for(let row=0;row<rows;row++){
        gameStageArch[row] = [];
        for(let col=0;col<cols;col++){
            gameStageArch[row][col] = 0;
        }
    }
}

// main game loop
function gameLoop(){
createGameStageArch();
let my_cells = document.getElementsByClassName('game-cell');
    for(let cell of my_cells){
        cell.addEventListener('click', function () {
            if (!isCellOccupied(cell)) {
                let player = iterPlayers(cell);
                let cell_coord = getCellCoord(cell);
                addTurnToArch(player, cell_coord);
                if (win_condition()[0]){
                   alert(win_condition()[1]);
                   colorWinCells(win_condition()[2]);
                   setInterval(function(){
                   window.location.reload(true);
                   }, 2000);
                }
            }
            else{
                alert('This cell is occupied. Try another!');
            }
        } );
        cell.addEventListener('mouseover', function () {
            if (isCellOccupied(cell)) {
                cell.style.cursor = 'not-allowed';
            }
        } );
    }
}

// iterate players
function iterPlayers(cell){
    if (pl === 1) {
        cell.textContent = player1;
        cell.classList.add('selected');
        pl = 2;
    }
    else{
        cell.textContent = player2;
        cell.classList.add('selected');
        pl = 1;
    }
    return pl;
}

// get the clicked cell coordinates
function getCellCoord(cell){
    let dataCoordinateX = cell.getAttribute('data-coordinate-x');
    let dataCoordinateY = cell.getAttribute('data-coordinate-y');
    return [+dataCoordinateX, +dataCoordinateY];
}

// check is the cell occupied
function isCellOccupied(cell){
    return cell.classList.contains('selected');
}

// add player's turn to a  game stage array
function addTurnToArch(player, cell_coord){
    let cellCol = cell_coord[0];
    let cellRow  = cell_coord[1];
    gameStageArch[cellRow][cellCol] = player;
    console.clear();
    console.table(gameStageArch);
}

// win condition
function win_condition(){
    let horiz = winHoriz();
    let vert = winVert();
    let diag = winDiag();
    let anotherDiag = winAnotherDiag();
    if(horiz) {
        return [horiz[0], horiz[1], horiz[2]];
    }
    if(vert) {
        return [vert[0], vert[1], vert[2]];
    }
    if(diag) {
        return [diag[0], diag[1], diag[2]];
    }
    if(anotherDiag) {
        return [anotherDiag[0], anotherDiag[1], anotherDiag[2]];
    }
    if(draw) {
        return [draw(), "It's a draw"];
    }
}

// dead heat(draw)
function draw() {
    let occupiedCells = 0;
    let gameStageArchLength = gameStageArch.length * gameStageArch[0].length;
    let my_cells = document.getElementsByClassName('game-cell');
    for(let cell of my_cells){
        if(isCellOccupied(cell)){
            occupiedCells++;
        }
    }
    if(gameStageArchLength === occupiedCells){
        return true;
    }
}

// horizontal winning
function winHoriz() {
    for(let row=0;row<gameStageArch.length;row++){
        for(let col=0;col<gameStageArch[0].length;col++) {
            if (gameStageArch[row][col] === gameStageArch[row][col+1]
                && gameStageArch[row][col+1] === gameStageArch[row][col+2]) {
                let winComb = [[row,col],[row,col+1],[row,col+2]];
                if(gameStageArch[row][col] === 1) {
                    return [true, 'Player 1 won horizontally', winComb];
                }
                if(gameStageArch[row][col] === 2){
                    return[true, 'Player 2 won horizontally', winComb];
                }
            }
        }
    }
}

// vertical winning
function winVert() {
    for(let col=0;col<gameStageArch[0].length;col++){
        for(let row=0;row<gameStageArch.length-2;row++){
            if (gameStageArch[row][col] === gameStageArch[row+1][col]
                && gameStageArch[row+1][col] === gameStageArch[row+2][col]) {
                let winComb = [[row,col],[row+1,col],[row+2,col]];
                if(gameStageArch[row][col] === 1) {
                    return [true, 'Player 1 won vertically', winComb];
                }
                if(gameStageArch[row][col] === 2){
                    return[true, 'Player 2 won  vertically', winComb];
                }
            }
        }
    }
}
// diagonal \ winning
function winDiag() {
    for(let col=0;col<gameStageArch[0].length-2;col++){
        for(let row=0;row<gameStageArch.length-2;row++){
            if (gameStageArch[row][col] === gameStageArch[row+1][col+1]
                && gameStageArch[row+1][col+1] === gameStageArch[row+2][col+2]) {
                let winComb = [[row,col],[row+1,col+1],[row+2,col+2]];
                if(gameStageArch[row][col] === 1) {
                    return [true, "Player 1 won diagonally \\", winComb];
                }
                if(gameStageArch[row][col] === 2){
                    return[true, 'Player 2 won diagonally \\', winComb];
                }
            }
        }
    }
}

// another diagonal / winning
function winAnotherDiag() {
    for(let col=2;col<gameStageArch[0].length;col++){
        for(let row=0;row<gameStageArch.length-2;row++){
            if (gameStageArch[row][col] === gameStageArch[row+1][col-1]
                && gameStageArch[row+1][col-1] === gameStageArch[row+2][col-2]) {
                let winComb = [[row,col],[row+1,col-1],[row+2,col-2]];
                if(gameStageArch[row][col] === 1) {
                    return [true, "Player 1 won diagonally /", winComb];
                }
                if(gameStageArch[row][col] === 2){
                    return[true, 'Player 2 won diagonally /', winComb];
                }
            }
        }
    }
}

// color winning cells
function colorWinCells(cellsCoordinates) {
    let my_cells = document.getElementsByClassName('game-cell');
    for(let cell of my_cells){
        let cellRow = cell.getAttribute('data-coordinate-x');
        let cellCol = cell.getAttribute('data-coordinate-y');
        for(let arr of cellsCoordinates){
            if(arr[1] === +cellRow && arr[0] === +cellCol){
                cell.classList.add('winCell');
            }
        }
    }
}

// create game board
function addElem() {
    let lastDiv = document.getElementById('game-board');
    let my_btn = document.createElement('button');
    let button_text = document.createTextNode('Apple, CLICK!');
    my_btn.appendChild(button_text);
    lastDiv.appendChild(my_btn);
    my_btn.addEventListener('click', function () {
        alert('Click!');
    });
}

alert('JS is working!');
gameLoop();
addElem();
console.table(gameStageArch);