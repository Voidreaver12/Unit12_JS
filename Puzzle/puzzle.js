
function start(e) {
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
    (document.getElementById('piece9').parentNode.id=='nine'))
	{
		alert('You won!');
	}
}
