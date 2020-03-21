var h_LogicalBoardMatrix;
const VISUAL_BOARD = document.getElementsByClassName("board")[0];
const VISUAL_CELL_ARRAY = document.querySelectorAll(".cell");
const H2_Now_PLAYING = document.getElementsByTagName("h2")[0];

const SPAN_NUM_OF_BLACK_PIECES =  document.getElementById("BlackPieces").getElementsByTagName("span")[0];
const SPAN_NUM_OF_WHITE_PIECES =  document.getElementById("WhitePieces").getElementsByTagName("span")[0];
const BUTTON_END_GAME = document.getElementById("endGameButton");
const BUTTON_NEW_GAME = document.getElementById("newGameButton");
const CHECKBOX_TRAINEE_MODE = document.getElementById("traineeRadioCheckBox");


const BOX_END_GAME =  document.getElementsByClassName("endGame")[0];
const MESSAGE_END_GAME =  document.getElementById("winnerMessage").getElementsByTagName("span")[0];
const SPAN_TURN = document.getElementById("turnsCounter").getElementsByTagName("span")[0];

const LABEL_MINUTES = document.getElementById("minutes");
const LABEL_SECONDS = document.getElementById("seconds");
var h_SecondsGameTime ;
var h_Interval;
//========== Average ===========================================================
const LABEL_AVG_MINUTES = document.getElementById("avgMinutes");
const LABEL_AVG_SECONDS = document.getElementById("avgSeconds");
//=========== Total Average ====================================================
const LABAL_TOTAL_AVG_MINUTES = document.getElementById("totalAvgMinutes");
const LABEL_TOTAL_AVG_SECONDS = document.getElementById("totalAvgSeconds");
var h_TotalSecondsGameTime = 0;
var h_TotalTurnCount = 0;
var h_IntervalTotal;



const SPAN_JUST_TWO_BLACK_LEFT_COUNTER = document.getElementById("justTwoBlack").getElementsByTagName("span")[0];
const SPAN_JUST_TWO_WHITE_LEFT_COUNTER = document.getElementById("justTwoWhite").getElementsByTagName("span")[0];

const BOARD_DIMENSION = 10;
const PLAYER1_SYMBOL = 1;
const PLAYER2_SYMBOL = 2;
const TIE_SYMBOL = 0;
const MARKED_CELL_SYMBOL = "v";
const EMPTY_CELL_SYMBOL = 0;
const PLAYER1_COLOR = "black";
const PLAYER2_COLOR = "white";
const CLICKABLE_COLOR = "green";
const UNCLICKABLE_COLOR = "lightseagreen";

var h_CurrentPlayer;
var h_AvailableMovesArray = [];
var h_Winner;
var h_TurnCount;
var h_AverageTurnTime;
var h_NumberOfPiece = [2,2];
var h_JustTwoBlack;
var h_JustTwoWhite;

const UP_MAIN_DIAGONAL = getAdjacentCellIDDirectionByDirectionIndecies(-1, -1);
const UP_COLUMN = getAdjacentCellIDDirectionByDirectionIndecies(-1, 0);
const UP_SECONDARY_DIAGONAL = getAdjacentCellIDDirectionByDirectionIndecies(-1, 1);
const LEFT_ROW = getAdjacentCellIDDirectionByDirectionIndecies(0, -1);
const RIGHT_ROW = getAdjacentCellIDDirectionByDirectionIndecies(0, 1);
const DOWN_SECONDARY_DIAGONAL = getAdjacentCellIDDirectionByDirectionIndecies(1, -1);
const DOWN_COLUMN = getAdjacentCellIDDirectionByDirectionIndecies(1, 0);
const DOWN_MAIN_DIAGONAL =  getAdjacentCellIDDirectionByDirectionIndecies(1, 1);

startGame();
//=====================================
function startGame(){
    h_AvailableMovesArray = [];
    h_NumberOfPiece = [2,2];
    setBoard();
    initializeGameInfo();
}
//=====================================
function setBoard(){
    setBoardMatrix();
    setVisualBoard();
}
//=====================================
function setBoardMatrix(){
    h_LogicalBoardMatrix = Array.from(Array(BOARD_DIMENSION * BOARD_DIMENSION).fill(EMPTY_CELL_SYMBOL));

    h_LogicalBoardMatrix[44] = PLAYER1_SYMBOL;
    updateAvailableMoves(44);
    h_LogicalBoardMatrix[45] = PLAYER2_SYMBOL;
    updateAvailableMoves(45);
    h_LogicalBoardMatrix[54] = PLAYER2_SYMBOL;
    updateAvailableMoves(54);
    h_LogicalBoardMatrix[55] = PLAYER1_SYMBOL;
    updateAvailableMoves(55);
}
//=====================================
function setVisualBoard(){ 

    VISUAL_BOARD.style["pointer-events"] = "auto";

    for(var i=0; i< BOARD_DIMENSION * BOARD_DIMENSION; i++){
        if(h_LogicalBoardMatrix[i]===PLAYER1_SYMBOL)
        {
            setVisualPieceInCell(i, PLAYER1_COLOR, "visible");
        }
        else if(h_LogicalBoardMatrix[i]===PLAYER2_SYMBOL)
        {
            setVisualPieceInCell(i, PLAYER2_COLOR, "visible");
        }
        else
        {
            setVisualPieceInCell(i, PLAYER2_COLOR, "hidden");
        }   
    }

    makeAvailableCellsClickable();
}
//=====================================
function initializeGameInfo(){
    initializeGameStatistics();
    BOX_END_GAME.style.visibility = 'hidden';
    MESSAGE_END_GAME.style.visibility = 'hidden';
    BUTTON_END_GAME.addEventListener('click', endGameClick, false);
    BUTTON_NEW_GAME.addEventListener('click',newGameClick, false);
    CHECKBOX_TRAINEE_MODE.addEventListener('change', onEnabledTraineeModeCheckBox);
    CHECKBOX_TRAINEE_MODE.checked = false;
    h_CurrentPlayer = PLAYER1_SYMBOL;
   
    H2_Now_PLAYING.innerText =  `Player ${h_CurrentPlayer} - ${getCurrentColor()}`;
    SPAN_NUM_OF_BLACK_PIECES.innerText = h_NumberOfPiece[0];
    SPAN_NUM_OF_WHITE_PIECES.innerText = h_NumberOfPiece[1];
    BUTTON_END_GAME.disabled = false;
}
//=====================================
function onEnabledTraineeModeCheckBox(){
    if (CHECKBOX_TRAINEE_MODE.checked == true){
        for(var i=0; i< h_AvailableMovesArray.length; i++){
            var numberOfAffectedCells = getAffectedCellsArray(h_AvailableMovesArray[i]).length;
            document.getElementById(h_AvailableMovesArray[i]).getElementsByClassName("AffectedCellsNum")[0].innerText = numberOfAffectedCells;
        } 
      } else {
        for(var i=0; i<VISUAL_CELL_ARRAY.length; i++){
            VISUAL_CELL_ARRAY[i].getElementsByClassName("AffectedCellsNum")[0].innerText ="";
            
        }
      }
}
//=====================================
function initializeGameStatistics(){  
    h_TurnCount = 0;
    SPAN_TURN.innerText = h_TurnCount; 

    h_SecondsGameTime = 0;
    h_Interval = setInterval(setTime, 1000);
    h_IntervalTotal = setInterval(updateAverageTotal, 1000);
    LABEL_AVG_SECONDS.innerText = "00";
    LABEL_AVG_MINUTES.innerText = "00";

    h_JustTwoBlack = 1;
    SPAN_JUST_TWO_BLACK_LEFT_COUNTER.innerText = h_JustTwoBlack;

    h_JustTwoWhite = 1;
    SPAN_JUST_TWO_WHITE_LEFT_COUNTER.innerText = h_JustTwoWhite; 
}
//=====================================
function setTime() {
    ++h_SecondsGameTime;
    LABEL_SECONDS.innerHTML = pad(h_SecondsGameTime % 60);
    LABEL_MINUTES.innerHTML = pad(parseInt(h_SecondsGameTime / 60));
}
//=====================================  
function pad(val) {
    var i_valString = val + "";
    if (i_valString.length < 2) {
      return "0" + i_valString;
    } else {
      return i_valString;
    }
}
//=====================================
function updateAverageTotal()
{
    ++h_TotalSecondsGameTime;
}
//=====================================
function endGameClick(){
    h_Winner = getOpponentSymbol();
    endGame();

}
//=====================================
function newGameClick(){
    clearInterval(h_Interval);
    startGame();
}
//=====================================
function makeAvailableCellsClickable(){

    for( var i = 0; i < h_AvailableMovesArray.length; i++){
        VISUAL_CELL_ARRAY[h_AvailableMovesArray[i]].style.backgroundColor = CLICKABLE_COLOR;
        VISUAL_CELL_ARRAY[h_AvailableMovesArray[i]].addEventListener("click", turnClick, false);
    }
}
//=====================================
function updateAvailableMoves(i_LastMove){

    if(!checkIfSideLeftColumn(i_LastMove)){    //i_LastMove % 10 != 0
        pushCellIDIntoAvailableMovesArray(Number(i_LastMove)+UP_MAIN_DIAGONAL);   //main diag up
        pushCellIDIntoAvailableMovesArray(Number(i_LastMove)+LEFT_ROW);    //row left
        pushCellIDIntoAvailableMovesArray(Number(i_LastMove)+DOWN_SECONDARY_DIAGONAL);    //sec diag down
    }

    if(!checkIfSideRightColumn(i_LastMove)){   //i_LastMove % 10 != 9
        pushCellIDIntoAvailableMovesArray(Number(i_LastMove)+UP_SECONDARY_DIAGONAL);    //sec diag up
        pushCellIDIntoAvailableMovesArray(Number(i_LastMove)+RIGHT_ROW);    //row right
        pushCellIDIntoAvailableMovesArray(Number(i_LastMove)+DOWN_MAIN_DIAGONAL);   //main diag down
    }
     
    pushCellIDIntoAvailableMovesArray(Number(i_LastMove)+UP_COLUMN);   //col up
    pushCellIDIntoAvailableMovesArray(Number(i_LastMove)+DOWN_COLUMN);   //col down
    
    removeMoveFromAvailableMovesArray(i_LastMove);
}
//=====================================
function checkIfSideLeftColumn(i_Cell){
    return i_Cell % BOARD_DIMENSION == 0 ? true : false;
}
//=====================================
function checkIfSideRightColumn(i_Cell){
    return i_Cell % BOARD_DIMENSION == BOARD_DIMENSION - 1 ? true : false;
}
//=====================================
function pushCellIDIntoAvailableMovesArray(i_CellID){
    if(i_CellID >= 0 &&  i_CellID < BOARD_DIMENSION * BOARD_DIMENSION)
    {
        if(h_LogicalBoardMatrix[i_CellID] === 0)
        {
            h_AvailableMovesArray.push(i_CellID);
            h_LogicalBoardMatrix[i_CellID] = MARKED_CELL_SYMBOL;
        }
    }
}
//=====================================
function removeMoveFromAvailableMovesArray(i_Move){

    for( var i = 0; i < h_AvailableMovesArray.length; i++)//findIndex
    { 
        if ( h_AvailableMovesArray[i] == i_Move) 
        {
            h_AvailableMovesArray.splice(i, 1); 
        }
    }
}
//=====================================
function setVisualPieceInCell(i_CellID, i_Color, i_Visibility){

    makeCellUnclickable(i_CellID)
    var piece = document.getElementById(i_CellID).firstChild;
    piece.style.backgroundColor = i_Color;
    piece.style.visibility = i_Visibility;
    VISUAL_CELL_ARRAY[i_CellID].getElementsByClassName("AffectedCellsNum")[0].innerText ="";     
}
//=====================================
function makeCellUnclickable(i_CellID)
{
    VISUAL_CELL_ARRAY[i_CellID].removeEventListener("click", turnClick, false);
    VISUAL_CELL_ARRAY[i_CellID].style.backgroundColor = UNCLICKABLE_COLOR; 
}
//=====================================
function turnClick(i_Cell){
    handleTurn(i_Cell.target.id, h_CurrentPlayer)
}
//=====================================
function handleTurn(i_CellID, i_Player){

    h_LogicalBoardMatrix[i_CellID] = i_Player;
    setVisualPieceInCell(i_CellID, getCurrentColor(), "visible");
    updateAvailableMoves(i_CellID);
    makeAvailableCellsClickable();
   
    
    var affectedCells = getAffectedCellsArray(i_CellID);

    if(affectedCells && affectedCells.length){
        switchPiecesInAffectedCells(affectedCells);
    }

    updateNumOfPieceEachPlayer(affectedCells);
    updateStatistics();
    checkWinState();

    if(!checkWinState()){
       switchTurn();
    }
    else{
        endGame();
    }

   onEnabledTraineeModeCheckBox();
}
//=====================================
function updateStatistics()
{
    h_TurnCount++;
    h_TotalTurnCount ++;
    SPAN_TURN.innerText = h_TurnCount; 
    calcAndUpdateAverage();
    calcAndUpdateTotalAverage();
   
    if(h_NumberOfPiece[0] === 2){
        h_JustTwoBlack++;
        SPAN_JUST_TWO_BLACK_LEFT_COUNTER.innerText =  h_JustTwoBlack++;;
    }
  
    if(h_NumberOfPiece[1] === 2){ 
        h_JustTwoWhite++;
        SPAN_JUST_TWO_WHITE_LEFT_COUNTER.innerText =  h_JustTwoWhite; 
    }
}
//=====================================
function  calcAndUpdateAverage(){
    var timeInSec = (h_SecondsGameTime/ h_TurnCount);
    setAverageTime(timeInSec, LABEL_AVG_SECONDS,LABEL_AVG_MINUTES)
}
//=====================================
function  calcAndUpdateTotalAverage(){
    var timeInSec = (h_TotalSecondsGameTime/ h_TotalTurnCount);
    setAverageTime(timeInSec, LABEL_TOTAL_AVG_SECONDS, LABAL_TOTAL_AVG_MINUTES)
}
//=====================================
function setAverageTime(i_timeInSec,i_AverageSeconds,i_AverageMinutes) {
    i_AverageSeconds.innerText = pad(Math.floor(i_timeInSec % 60));
    i_AverageMinutes.innerText = pad(parseInt(i_timeInSec / 60));
}
//=====================================
function updateNumOfPieceEachPlayer(i_affectedCells){
    h_NumberOfPiece[h_CurrentPlayer-1] += i_affectedCells.length ;
    h_NumberOfPiece[h_CurrentPlayer-1] ++;
    h_NumberOfPiece[(getOpponentSymbol())-1] -=  i_affectedCells.length;
    SPAN_NUM_OF_BLACK_PIECES.innerHTML = h_NumberOfPiece[0];
    SPAN_NUM_OF_WHITE_PIECES.innerHTML = h_NumberOfPiece[1];
}
//=====================================
function checkWinState()
{   
    var isGameOver = true;
    if(h_AvailableMovesArray.length === 0){
       if(h_NumberOfPiece[0] > h_NumberOfPiece[1]){
         h_Winner = PLAYER1_SYMBOL
       }
       else if(h_NumberOfPiece[0] < h_NumberOfPiece[1]){
         h_Winner = PLAYER2_SYMBOL;
        }
        else{
            h_Winner = TIE_SYMBOL;
        }
    }

    else{
        isGameOver = false;
    }
    return isGameOver;
}
//=====================================
function endGame(){
    
    BOX_END_GAME.style.visibility = 'visible';
    MESSAGE_END_GAME.style.visibility = 'visible';
    VISUAL_BOARD.style['pointer-events'] = 'none';
   
    if(h_Winner === TIE_SYMBOL){
        MESSAGE_END_GAME.innerText = "Game Over! It's a tie";
    }
    else{
        MESSAGE_END_GAME.innerText = `Game over! \nPlayer${h_Winner} won!!! :D`
    }
    
    clearInterval(h_Interval);
    clearInterval(h_IntervalTotal);
    BUTTON_END_GAME.disabled = true;
}
//=====================================
function getCurrentColor(){
    return h_CurrentPlayer === PLAYER1_SYMBOL ? PLAYER1_COLOR : PLAYER2_COLOR;
}
//=====================================
function getOpositeColor(){
    return h_CurrentPlayer === PLAYER1_SYMBOL ? PLAYER2_COLOR : PLAYER1_COLOR;
}
//=====================================
function getOpponentSymbol(){
    return h_CurrentPlayer === PLAYER1_SYMBOL ? PLAYER2_SYMBOL : PLAYER1_SYMBOL;
}
//=====================================
function switchTurn(){
    h_CurrentPlayer = h_CurrentPlayer === PLAYER1_SYMBOL ?  PLAYER2_SYMBOL : PLAYER1_SYMBOL;
    H2_Now_PLAYING.innerText = `Player ${h_CurrentPlayer} - ${getCurrentColor()}`;
}
//=====================================
function switchPiecesInAffectedCells(i_AffectedCells){
    for(var i=0; i<i_AffectedCells.length; i++){
        cellID = i_AffectedCells[i];
        h_LogicalBoardMatrix[cellID] = h_CurrentPlayer;
        setVisualPieceInCell(cellID, getCurrentColor(), 'visible');
    }
}
//=====================================
function getAffectedCellsArray(i_LastMove){

    var checkEdgeFunctionForRow = function(i){
        return Math.floor(Number(i_LastMove)/BOARD_DIMENSION) == Math.floor(Number(i)/BOARD_DIMENSION);
    };

    var affectedCellsArray = getAffectedCellsInMatrixElement(i_LastMove,  LEFT_ROW, RIGHT_ROW, checkEdgeFunctionForRow);   //handle row

    var checkEdgeFunction = function(i){
        return i>0 && i<BOARD_DIMENSION*BOARD_DIMENSION;
    };

    affectedCellsArray = affectedCellsArray.concat(getAffectedCellsInMatrixElement(i_LastMove, UP_COLUMN, DOWN_COLUMN, checkEdgeFunction));    //handle col
    affectedCellsArray = affectedCellsArray.concat(getAffectedCellsInMatrixElement(i_LastMove, UP_MAIN_DIAGONAL, DOWN_MAIN_DIAGONAL, checkEdgeFunction));    //handle main diagonal
    affectedCellsArray = affectedCellsArray.concat(getAffectedCellsInMatrixElement(i_LastMove, UP_SECONDARY_DIAGONAL, DOWN_SECONDARY_DIAGONAL, checkEdgeFunction));      //handle secondary diagonal

    return affectedCellsArray;
}
//=====================================
function getAffectedCellsInMatrixElement(i_LastMove, i_Direction1, i_Direction2, checkEdgeFunction){

    var affectedCellsArray = getAffectedCellsInDirection(i_LastMove, i_Direction1, checkEdgeFunction);
    affectedCellsArray = affectedCellsArray.concat(getAffectedCellsInDirection(i_LastMove, i_Direction2, checkEdgeFunction));

    return affectedCellsArray;
}
//=====================================
function getAffectedCellsInDirection(i_LastMove, i_Direction, i_CheckEdgeFunction){

    var affectedCellsArray = [];
    var opponentSymbol = getOpponentSymbol();

    var i = Number(i_LastMove) + i_Direction;

    while(h_LogicalBoardMatrix[i] == opponentSymbol && i_CheckEdgeFunction(i)) {
        affectedCellsArray.push(i);
        i+=i_Direction;   
    }

    if(h_LogicalBoardMatrix[i] != h_CurrentPlayer){
        affectedCellsArray = [];
    }

    return affectedCellsArray;
}
//=====================================
function getAdjacentCellIDDirectionByDirectionIndecies(i_X, i_Y)
{
    var direction = 0;
    
    if(i_X == 0){    //traverce in row
        direction = i_Y;
    }
    else if(i_Y == 0){  //traverce in col   
        direction = i_X * BOARD_DIMENSION;
    }
    else if(i_X == -1)   //accend main or secondary diagonals
    {
        direction = -1 * BOARD_DIMENSION + i_Y;
    }
    else if(i_X == 1){  //decend main or secondary diagonals
        
        direction = BOARD_DIMENSION + i_Y;
    }

    return direction;  
}
//=====================================

