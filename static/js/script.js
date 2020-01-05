// function create_list(){
//     const nums = [1,7,16,9,5,7,3,33,67,9,2,8,67];
//     const list_ul = document.createElement('ul')
//
//     for(let num of nums){
//         const list_li = document.createElement('li');
//         list_li.addEventListener('click', function() {
//             this.classList.toggle('selected');
//          });
//         li_text = document.createTextNode(num.toString());
//         list_li.appendChild(li_text);
//         list_ul.appendChild(list_li);
//     }
//     return list_ul;
// }
//
// function create_button() {
//     const my_btn = document.createElement('button');
//     my_btn.addEventListener('click', show_hide);
//     button_text = document.createTextNode('Hide/Show');
//     my_btn.appendChild(button_text);
//     return my_btn;
// }
//
// function show_hide(){
//     first_p = document.getElementById('my')
//     first_p.classList.toggle('hide');
//     // this.classList.toggle('hide');
// }
//
// function inputKeyUp(e) {
//     if (e.key === 'Enter') {
//         console.log('Enter has been pressed')
//     }
// }
//
// aimP = document.getElementsByTagName('p')[0];
// aimP.appendChild(create_list());
//
// last_p = document.getElementsByTagName('p')[1];
// last_p.appendChild(create_button());
let player1Scores = 0;
let player2Scores = 0;
let player1Button = document.querySelector('#player1_button');
let player2Button = document.querySelector('#player2_button');
let player1ScoresDisp = document.querySelector('#player1_scores');
let player2ScoresDisp = document.querySelector('#player2_scores');
let resetButton = document.querySelector('#reset_button');
let maxScores = 5;
let maxScore = document.getElementById('max_score');
let maxScoreDisplay = document.querySelector("p span");
let gameOver = false;
let winMessage = document.createElement('h3');
document.getElementsByTagName('h3')[0].appendChild(winMessage);

player1Button.addEventListener('click', function () {
    if(!gameOver) {
        player1Scores++;
        if(player1Scores >= maxScores){
            player1ScoresDisp.textContent = maxScores;
            let textContent = 'Game over! Player one win '+player1Scores+' to '+player2Scores;
            winMessage.style.display = 'block';
            winMessage.textContent = textContent;
            resetButton.style.backgroundColor = 'red';
            gameOver = true;
        }
        else {
            player1ScoresDisp.style.color = 'red';
            player1ScoresDisp.textContent = player1Scores;
        }
    }
});

player2Button.addEventListener('click', function () {
    if(!gameOver) {
        player2Scores++;
        if(player2Scores >= maxScores){
            player2ScoresDisp.textContent = maxScores;
            let textContent = 'Game over! Player one win '+player1Scores+' to '+player2Scores;
            winMessage.style.display = 'block';
            winMessage.textContent = textContent;
            resetButton.style.backgroundColor = 'red';
            gameOver = true;
        }
        else {
            player2ScoresDisp.style.color = 'blue';
            player2ScoresDisp.textContent = player2Scores;
        }
    }
});

resetButton.addEventListener('click', function () {
    console.log('reset');
    gameOver = false;
    player2Scores = 0;
    player1Scores = 0;
    player2ScoresDisp.textContent = player2Scores;
    player1ScoresDisp.textContent = player1Scores;
    document.getElementsByTagName('h3')[1].style.display = 'none';
});

maxScore.addEventListener('change', function () {
    if(player1Scores === 0 && player2Scores === 0){
        maxScores = maxScore.value;
        maxScoreDisplay.textContent = maxScore.value;
    }
    else{
        alert('Max scores can be changed before game started');
        maxScore.style.display = 'none';
    }

});