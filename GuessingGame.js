function generateWinningNumber(){
    return Math.floor(Math.random() * 100 + 1);
}

function shuffle(array){
    let m = array.length;
    let t = 0;
    let i = 0;

  while (m > 0) {

    i = Math.floor(Math.random() * m--);

    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

function Game(){
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function(){

    return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function(){

    if(this.playersGuess < this.winningNumber){
        return true;
    }else{
        return false;
    }
}

Game.prototype.playersGuessSubmission = function(num){

    if(num < 1 || num > 100 || typeof(num) !== 'number'){
        alert('That is an invalid guess.');
    }else{
        this.playersGuess = num;
        return this.checkGuess();
    }
}

Game.prototype.checkGuess = function(){

    if(this.playersGuess === this.winningNumber){
        $('#hint, #submit').prop('disabled', true);
        $('#subtitle').text('Press the Reset button to play again!');
        return 'You Win!';
    }else if(this.pastGuesses.indexOf(this.playersGuess) !== -1){
        return 'You have already guessed that number.';
    }else{
        this.pastGuesses.push(this.playersGuess);
        $('#guess-list li:nth-child(' + this.pastGuesses.length + ')').text(this.playersGuess);

        if(this.pastGuesses.length === 5){
            $('#hint, #submit').prop('disabled', true);
            $('#subtitle').text('Press the Reset button to play again!');
            return 'You Lose.';
        }
    }
    
    if(this.isLower()){
        $('#subtitle').text('Guess Higher!')
    }else{
        $('#subtitle').text('Guess Lower!')
    }
    
    if(this.difference() < 10){
        return 'You\'re burning up!';
    }else if(this.difference() < 25){
        return 'You\'re lukewarm.';
    }else if(this.difference() < 50){
        return 'You\'re a bit chilly.';
    }else{
        return 'You\'re ice cold!';
    }
}

function newGame(){
    return new Game();
}

Game.prototype.provideHint = function(){
    let hintArray = [this.winningNumber, generateWinningNumber(), generateWinningNumber()];
    
    shuffle(hintArray);

    return hintArray;
}

function makeGuess(game){
    let guess = $('#player-input').val();
    $('#player-input').val('');
    let output = game.playersGuessSubmission(parseInt(guess, 10));
    $('#title').text(output);
}

$(document).ready(function() { 

    let game = new Game;
    
    $('#submit').click(function() {
        makeGuess(game);
    });

    $('#player-input').keypress(function(event){
        if(event.which === 13){
            makeGuess(game);
        }
    })

    $('#reset').click(function() {

        game = new Game;

        $('#hint, #submit').prop('disabled', false);
        $('#subtitle').text('Guess a number between 1 and 100!');
        $('#title').text('Guessing Game!');
        $('.guess').text('-');
    });

    $('#hint').click(function() {
        let hints = game.provideHint(game);
        $('#title').text('Your number is one of ' + hints[0] + ', ' + hints[1] + ', or ' + hints[2] + '.');
    });
});