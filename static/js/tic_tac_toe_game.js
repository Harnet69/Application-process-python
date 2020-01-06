// for Ios devices we check if you support touch, otherwise it's click:
let touchEvent = 'ontouchstart' in window ? 'touchstart' : 'click';

var gameStageArch = [];
const player1 = 'O';
const player2 = 'X';
var pl;
var winComb = [];
let lastClickedCell; // for future IA
if(isGameAgainstComp()){
    pl = 4;
    gameLoop();
}
else{
    pl = 2;
    gameLoop();
}

// get board size
function getBoardSize(){
    let board = document.getElementById('game-board');
    let rowsNum = board.getAttribute('data-row-num');
    let colsNum = board.getAttribute('data-col-num');

    return [+rowsNum, +colsNum]
}

// build game stage array according to border size
function createGameStageArray(){
    let borderSize = getBoardSize();
    let rows = borderSize[0];
    let cols = borderSize[1];
    for(let row=0;row<rows;row++){
        gameStageArch[row] = [];
        for(let col=0;col<cols;col++){
            gameStageArch[row][col] = false;
        }
    }
}

// main game loop
function gameLoop(){
    createGameStageArray();
    let my_cells = document.getElementsByClassName('game-cell');
    for(let cell of my_cells){
        let cell_coord = getCellCoord(cell);
        cell.addEventListener(touchEvent, function () {
            if (!isCellOccupied(cell)) {
                iterPlayers(cell);
                if(pl === 3){
                    addTurnToArch(pl, cell_coord);
                    compTurn();
                }
                else if(pl ===1 || pl ===2){
                    addTurnToArch(pl, cell_coord);
                }
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
    // lastClickedCell = cell;  // for future AI
    // alert(lastClickedCell);
    if (pl === 1) {
        cell.textContent = player1;
        cell.classList.add('selected');
        pl = 2;
    }
    else if(pl === 2){
        cell.textContent = player2;
        cell.classList.add('selected');
        pl = 1;
    }
    else if(pl === 3){ // Player turn in single game
        cell.textContent = player2;
        cell.classList.add('selected');
    }
    else if(pl === 4){ //Comp turn
        cell.textContent = player2;
        cell.classList.add('selected');
        pl = 3;
    }
    displayPlayer(pl);
    return pl;
}

// display a player who should to turn on
function displayPlayer(playerNum) {
    let playerField = document.getElementById('player');
    if(playerNum === 1) {
        playerField.textContent = "Player 2";
    }
    else if(playerNum === 2) {
        playerField.textContent = "Player 1";
    }
    else if(playerNum === 3) {
        playerField.textContent = "Computer";
    }
    else if(playerNum === 4){
        playerField.textContent = "Player 1";
    }
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

// add player's turn to a game stage array
function addTurnToArch(player, cell_coord){
    let cellCol = cell_coord[0];
    let cellRow  = cell_coord[1];
    gameStageArch[cellRow][cellCol] = player;
    // console.clear(); // for debugging
    // console.log(winComb); // show win combinations
    // console.table(gameStageArch); // show game arr
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

// win condition turns for AI
function winConditionAI(){
    // let horiz = winHoriz();
    // let vert = winVert();
    // let diag = winDiag();
    // let anotherDiag = winAnotherDiag();
    if(winHoriz() || winVert() || winDiag() || winAnotherDiag()) { // is it correct? to perform functions in 'if'?
        return true;
    }
    // return false;
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
        drawColorAllCells();
      return true;
    }
}

//color all cells
function drawColorAllCells(){
    let gameCells = document.getElementsByClassName('game-cell');
    for(let cell of gameCells){
        cell.style.backgroundColor = 'red';
    }
}
// horizontal winning
function winHoriz() {
    for(let row=0;row<gameStageArch.length;row++){
        for(let col=0;col<gameStageArch[0].length;col++) {
            if (gameStageArch[row][col] === gameStageArch[row][col+1]
                && gameStageArch[row][col+1] === gameStageArch[row][col+2]) {
                let winComb = [[row,col],[row,col+1],[row,col+2]];

                if(gameStageArch[row][col]) {
                    return winMessage(gameStageArch[row][col], 'won horizontally --', winComb);
                }
                // switch (gameStageArch[row][col]) {
                //     case 1: return [true, 'Player 1 won horizontally --', winComb];
                //     case 2: return[true, 'Player 2 won horizontally --', winComb];
                //     case 3: return[true, 'You won horizontally --', winComb];
                //     case 4: return[true, 'Computer won horizontally --', winComb];
                // }
                // if(gameStageArch[row][col] === 1) {
                //     return [true, 'Player 1 won horizontally --', winComb];
                // }
                // if(gameStageArch[row][col] === 2){
                //     return[true, 'Player 2 won horizontally --', winComb];
                // }
                // if(gameStageArch[row][col] === 3){
                //     return[true, 'You won horizontally --', winComb];
                // }
                // if(gameStageArch[row][col] === 4){
                //     return[true, 'Computer won horizontally --', winComb];
                // }
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

                if(gameStageArch[row][col]) {
                    return winMessage(gameStageArch[row][col], 'vertically |', winComb);
                }
                // if(gameStageArch[row][col] === 1) {
                //     return [true, 'Player 1 won vertically |', winComb];
                // }
                // if(gameStageArch[row][col] === 2){
                //     return[true, 'Player 2 won  vertically |', winComb];
                // }
                // if(gameStageArch[row][col] === 3){
                //     return[true, 'You won vertically |', winComb];
                // }
                // if(gameStageArch[row][col] === 4){
                //     return[true, 'Computer won vertically |', winComb];
                // }
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

                if(gameStageArch[row][col]) {
                    return winMessage(gameStageArch[row][col], 'diagonally \\', winComb);
                }
                // if(gameStageArch[row][col] === 1) {
                //     return [true, "Player 1 won diagonally \\", winComb];
                // }
                // if(gameStageArch[row][col] === 2){
                //     return[true, 'Player 2 won diagonally \\', winComb];
                // }
                // if(gameStageArch[row][col] === 3){
                //     return[true, 'You won diagonally \\', winComb];
                // }
                // if(gameStageArch[row][col] === 4){
                //     return[true, 'Computer won diagonally \\', winComb];
                // }
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

                if(gameStageArch[row][col]) {
                    return winMessage(gameStageArch[row][col], 'diagonally /', winComb);
                }
                // if(gameStageArch[row][col] === 1) {
                //     return [true, "Player 1 won diagonally /", winComb];
                // }
                // if(gameStageArch[row][col] === 2){
                //     return[true, 'Player 2 won diagonally /', winComb];
                // }
                // if(gameStageArch[row][col] === 3){
                //     return[true, 'You won diagonally /', winComb];
                // }
                // if(gameStageArch[row][col] === 4){
                //     return[true, 'Computer won diagonally /', winComb];
                // }
            }
        }
    }
}

// give a winning message
function winMessage(player, winCond, winComb) {
    switch (player) {
        case 1: return [true, 'Player 1 won '+winCond, winComb];
        case 2: return [true, 'Player 2 won '+winCond, winComb];
        case 3: return [true, 'You won '+winCond, winComb];
        case 4: return [true, 'Computer won '+winCond, winComb];
    }
}

// color winning cells
function colorWinCells(cellsCoordinates) {
    if(cellsCoordinates) {
        let my_cells = document.getElementsByClassName('game-cell');
        for (let cell of my_cells) {
            let cellRow = cell.getAttribute('data-coordinate-x');
            let cellCol = cell.getAttribute('data-coordinate-y');
            for (let arr of cellsCoordinates) {
                if (arr[1] === +cellRow && arr[0] === +cellCol) {
                    cell.classList.add('winCell');
                }
            }
        }
    }
}

// find cells by its coordinates
function findCellByCoord(cellCoordinates) {
    if(cellCoordinates) {
        let my_cells = document.getElementsByClassName('game-cell');
        for (let cell of my_cells) {
            let cellRow = cell.getAttribute('data-coordinate-x');
            let cellCol = cell.getAttribute('data-coordinate-y');
            if (cellCoordinates[1] === +cellRow && cellCoordinates[0] === +cellCol) {
                return cell;
            }
        }
    }
}

// find not occupied cells for random turn
function getNotOccupiedCells() {
    let my_cells = document.getElementsByClassName('game-cell');
    let notOccupiedCells = [];
        for(let cell of my_cells){
                if (!isCellOccupied(cell)) {
                    let cellCoords = getCellCoord(cell);
                notOccupiedCells.push([cellCoords[1], cellCoords[0]]);
                }
        }
    return notOccupiedCells;
}

// if it's game against computer
function isGameAgainstComp() {
    return !!document.getElementById('computer');
}

// AI
function compTurn() {
    let turnCoord = [];
    let winCombs = getWinComb();
    let winCombsForComp = getWinComb(4);

    if(winCombsForComp[0]){ // turn to win!
        turnCoord = [winCombsForComp[0][1],winCombsForComp[0][0]];
    }
    else if(winCombs[0]){// to interfere a player
        let interfereComb = getRandomCell(winCombs); // random win combination.
        turnCoord = [interfereComb[1],interfereComb[0]];
    }
    else{ // random turn strategy
        let notOccupiedCells = getNotOccupiedCells();
        turnCoord = getRandomCell(notOccupiedCells); // random turn if not win combinations
    }
    if(turnCoord) {
        let cell = findCellByCoord(turnCoord);
        addTurnToArch(4, [turnCoord[1], turnCoord[0]]);
        cell.textContent = player1;
        cell.classList.add('selected');
    }
}

// random cell from not occupied cells or cells from WinComb
function getRandomCell(winCombs) {
   return winCombs[Math.floor(Math.random() * winCombs.length)];
}

// get winning combinations for AI
function getWinComb(player=3) {
    let winCombs = [];
    for(let x=0;x<gameStageArch.length;x++){
        for(let y=0;y<gameStageArch[0].length;y++){
            let cellValue = gameStageArch[x][y];
            if(!cellValue){
                gameStageArch[x][y] = player; // add players num to all free cell and check if this a win comb
                if(winConditionAI()){
                    gameStageArch[x][y] = false;
                    winCombs.push([y,x]); // collect win combs
                }
                else{
                    gameStageArch[x][y] = false;
                }
            }
        }
    }
    if (winCombs){
        winComb = winCombs; // write it to a global variable for using
        return winCombs
    }
    // else{
    //     return false
    // }
}

// console.table(gameStageArch); // show initiate game bord for debugging