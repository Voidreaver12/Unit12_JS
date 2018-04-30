shuffle();
var movesLeft = 15;
var gameOver = false;
var audio = new Audio('../sounds/snake_food.mp3');
document.getElementById("moves").innerHTML = "Moves Left: " + movesLeft;

function reset() {
	var container = document.getElementById("PiecesContainer");
	container.innerHTML = '';
	var pieceSpots = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
	for (i = 0; i < 9; i++) {
		var pieceSpot = document.getElementById(pieceSpots[i]);
		pieceSpot.innerHTML = '';
	}
	shuffle()
	movesLeft = 15;
	gameOver = false;
	document.getElementById("moves").innerHTML = "Moves Left: " + movesLeft;
}



function shuffle() {
	var container = document.getElementById("PiecesContainer");
	var pieces = [];
	for (i = 0; i < 9; i++) {
		var piece = document.createElement("img");
		piece.setAttribute("id", ("piece" + (i+1)));
		piece.setAttribute("src", ("../images/image_part_00" + (i+1) + ".jpg"));
		piece.setAttribute("alt", ("piece" + (i + 1)));
		piece.setAttribute("draggable", "true");
		piece.setAttribute("ondragstart", "start(event)");
		piece.setAttribute("ondragend", "end(event)");
		pieces.push(piece);
	}
	while (pieces.length > 0) {
		var i = Math.floor(Math.random() * pieces.length);
		var piece = pieces[i];
		pieces.splice(i, 1);
		container.appendChild(piece);
	}
}

function start(e) {
	if (gameOver) {
		return;
	}
	e.dataTransfer.effecAllowed = 'move';
	e.dataTransfer.setData("Text", e.target.id);
	e.target.style.opacity = '0.4';
}

function end(e){
	e.target.style.opacity = '';
	e.dataTransfer.clearData("Data");
}

function enter(e) {
	return true;
}

//Checks if the held piece can be dropped
function over(e) {
	//If the target location is a
	if ((e.target.className == "PieceSpot") || (e.target.id == "PiecesContainer"))
		return false;
	else
	return true;
}

//Drops piece onto piece container
function drop(e){
	e.preventDefault(); //Prevents default action of drop function
	var draggedElement = e.dataTransfer.getData("Text");
  // Place element
	e.target.appendChild(document.getElementById(draggedElement));
	audio.play();
	movesLeft--;
	document.getElementById("moves").innerHTML = "Moves Left: " + movesLeft;
	comparePuzzle();
}

function comparePuzzle(){
	if((document.getElementById('piece1').parentNode.id=='one') &&
		(document.getElementById('piece2').parentNode.id=='two') &&
		(document.getElementById('piece3').parentNode.id=='three') &&
		(document.getElementById('piece4').parentNode.id=='four') &&
    	(document.getElementById('piece5').parentNode.id=='five') &&
		(document.getElementById('piece6').parentNode.id=='six') &&
    	(document.getElementById('piece7').parentNode.id=='seven') &&
		(document.getElementById('piece8').parentNode.id=='eight') &&
    	(document.getElementById('piece9').parentNode.id=='nine')) {
		localStorage.setItem("won3", "true");
		localStorage.setItem("progress3", 100);
		gameOver = true;
		if (confirm('You won!\nWould you like to play again?')) {
			reset()
		}
	} else if (movesLeft <= 0) {
		if (confirm('You lost! You ran out of moves.\nWould you like to play again?')) {
			reset()
		}
		gameOver = true;
	}
}
