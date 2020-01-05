var gameStageArch = [];
const player1 = 'O';
const player2 = 'X';
var pl;
var winComb = [];
if(isGameAgainstComp()){
    pl = 4;
    // singleGameLoop();
    gameLoop();
}
else{
    pl = 2;
    gameLoop();
}
let lastClickedCell;

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
        cell.addEventListener('click', function () {
            if (!isCellOccupied(cell)) {
                iterPlayers(cell);
                if(pl === 3){
                    let cell_coord = getCellCoord(cell);
                    addTurnToArch(pl, cell_coord);
                    // getWinComb();
                    compTurn();
                }
                else if(pl ===1 || pl ===2){
                    let cell_coord = getCellCoord(cell);
                    addTurnToArch(pl, cell_coord);
                    // getWinComb();
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
// lastClickedCell = cell;
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
else if(pl === 3){
    cell.textContent = player2;
    cell.classList.add('selected');
    // pl = 4;
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
    // console.clear();
    // console.log(winComb); // !!!!!!!!!!!!!!!!!!!!!!!1 show win combinations
    // console.clear();
    // console.table(gameStageArch);
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
// win condition for AI
function winConditionAI(){
    let horiz = winHoriz();
    let vert = winVert();
    let diag = winDiag();
    let anotherDiag = winAnotherDiag();
    if(horiz) {
        return true;
    }
    if(vert) {
        return true;
    }
    if(diag) {
        return true;
    }
    if(anotherDiag) {
        return true;
    }
    return false;
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
                    return [true, 'Player 1 won horizontally --', winComb];
                }
                if(gameStageArch[row][col] === 2){
                    return[true, 'Player 2 won horizontally --', winComb];
                }
                if(gameStageArch[row][col] === 3){
                    return[true, 'You won horizontally --', winComb];
                }
                if(gameStageArch[row][col] === 4){
                    return[true, 'Computer won horizontally --', winComb];
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
                    return [true, 'Player 1 won vertically |', winComb];
                }
                if(gameStageArch[row][col] === 2){
                    return[true, 'Player 2 won  vertically |', winComb];
                }
                if(gameStageArch[row][col] === 3){
                    return[true, 'You won vertically |', winComb];
                }
                if(gameStageArch[row][col] === 4){
                    return[true, 'Computer won vertically |', winComb];
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
                if(gameStageArch[row][col] === 3){
                    return[true, 'You won diagonally \\', winComb];
                }
                if(gameStageArch[row][col] === 4){
                    return[true, 'Computer won diagonally \\', winComb];
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
                if(gameStageArch[row][col] === 3){
                    return[true, 'You won diagonally /', winComb];
                }
                if(gameStageArch[row][col] === 4){
                    return[true, 'Computer won diagonally /', winComb];
                }
            }
        }
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
    let my_cells = document.getElementsByClassName('game-cell');
    for(let cell of my_cells){
        let cellRow = cell.getAttribute('data-coordinate-x');
        let cellCol = cell.getAttribute('data-coordinate-y');
        if(cellCoordinates[1] === +cellRow && cellCoordinates[0] === +cellCol){
            return cell;
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
    if(!winCombs[0]){
        let notOccupiedCells = getNotOccupiedCells();
        turnCoord = getRandomCell(notOccupiedCells); // write function to random turn if not win combinations
    }
    else{
        turnCoord = [winCombs[0][1],winCombs[0][0]];
    }
    // if (win_condition()[0]){
    //            alert(win_condition()[1]);
    //            colorWinCells(win_condition()[2]);
    //            setInterval(function(){
    //            window.location.reload(true);
    //            }, 2000);
    //         }
    let cell = findCellByCoord(turnCoord);
    addTurnToArch(4, [turnCoord[1],turnCoord[0]]);
    cell.textContent = player1;
    cell.classList.add('selected');
}

// random cell from not occupied cells array
function getRandomCell(winCombs) {
   return winCombs[Math.floor(Math.random() * winCombs.length)];
}

// get winning combination
function getWinComb() {
    let winCombs = [];
    for(let x=0;x<gameStageArch.length;x++){
        for(let y=0;y<gameStageArch[0].length;y++){
            let cellValue = gameStageArch[x][y];
            if(!cellValue){
                gameStageArch[x][y] = 3;
                if(winConditionAI()){
                    gameStageArch[x][y] = false;
                    winCombs.push([y,x]);
                    // console.clear();
                    // console.log(winCombs);
                }
                else{
                    gameStageArch[x][y] = false;
                }
            }
        }
    }
    if (winCombs){
        winComb = winCombs;
        return winCombs
    }
    else{
        return false
    }
}

// gameLoop();
// console.table(gameStageArch);