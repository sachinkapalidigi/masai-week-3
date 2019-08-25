var container = document.getElementById('container');
var innerBox = container.querySelectorAll('div');
assignIdAll(innerBox);
var initWhitePawns = ['WE1','WH1','WCW','WQ','WK','WCB','WH2','WE2','WS1','WS2','WS3','WS4','WS5','WS6','WS7','WS8'];
var initBlackPawns = ['BS1','BS2','BS3','BS4','BS5','BS6','BS7','BS8','BE1','BH1','BCB','BQ','BK','BCW','BH2','BE2'];
var emptyArray1 = ['ev1','ev2','ev3','ev4','ev5','ev6','ev7','ev8'];
var emptyArray2 = ['ev9','ev10','ev11','ev12','ev13','ev14','ev15','ev16'];
var emptyArray3 = ['ev17','ev18','ev19','ev20','ev21','ev22','ev23','ev24'];
var emptyArray4 = ['ev25','ev26','ev27','ev28','ev29','ev30','ev31','ev32'];
var initBoard = [...initWhitePawns,...emptyArray1,...emptyArray2,...emptyArray3,...emptyArray4,...initBlackPawns];
createSpan();
var palyer1 = '';
var player2 = '';
var isPlayerSet = false;
//one movement
var source = '';
var sourcePos = 65;
var dest = '';
var destPos = 65;
var secClick = false;
var totalMoves = 0;
var isPlayerTurn = true;


function clicked(pos) {
    if(!isPlayerSet){
        document.getElementById('errorDiv').textContent = 'Cannot Move! Set Player names first!'
        return false;
    }    
    //check for 1st or second click
    if(!secClick){
        //check if player is allowed to move white or black
        if(!shouldPlayerMove(pos)){
            document.getElementById('errorDiv').innerHTML = "Not your Turn!";          
            return false;
        }
        setSource(pos);
    }else{
        setDest(pos);
        moveEl();
    }

}

function setPlayers(){
    player1 = document.getElementById('p1Name').value;
    player2 = document.getElementById('p2Name').value;
    isPlayerSet = true;
    document.getElementById('form-container').style.display = 'none';
    document.getElementById('player1Display').textContent = player1;
    document.getElementById('player2Display').textContent = player2;
    setErrorNull();
}

function shouldPlayerMove(pos){
    var pawnType = initBoard[pos][0];
    if(isPlayerTurn){
        if(pawnType == 'W'){            
            return true;
        }else{            
            return false;
        }
    }else{
        if(pawnType == 'B'){            
            return true;
        }else{            
            return false;
        }
    }    
}

function setSource(pos) {
    sourcePos = pos;
    source = initBoard[pos];    
    toggleSecClick();

}

function setDest(pos) {
    destPos = pos;
    dest = initBoard[pos];    
    toggleSecClick();
}

function moveEl() {   
    //check for replace or exchange
    if(!validateMove()){
        setPositionsNull();
        document.getElementById('errorDiv').innerHTML = 'Cannot Make That move!'
        return false;
    }
    totalMoves++;
    if (dest[0] == 'e') {
        initBoard[sourcePos] = dest;   
    } else {
        initBoard[sourcePos] = 'nm'+totalMoves;
    }    
    initBoard[destPos] = source;

    setPositionsNull();
    resetAllIds();
    togglePlayer();
    setErrorNull();
    console.log(initBoard);   
}

function createSpan() {
    for (var key in initBoard) {
        var divEl = document.createElement('div');
        assignId(initBoard[key],divEl);
        divEl.setAttribute('onclick','clicked('+key+')');
        innerBox[key].appendChild(divEl);
    }
}

function assignIdAll(innerBox) {    
    for(var i = 0; i<64; i++){
        assignId('pos'+i.toString(),innerBox[i]);
    }
}


function assignClass(className,el) {    
    el.setAttribute('class',className);
}

function assignId(idName,el) {    
    el.setAttribute('id',idName);
}

function getPosition(value,arryName){
    
    for(var i=0; i<arryName.length; i++){
        if(arryName[i] === value){
            return i;
        }
    }
    return false;
}

function setPositionsNull(){
    source = '';
    sourcePos = 65;
    dest = '';
    destPos = 65;
}

function toggleSecClick(){
    secClick = !secClick;
}

function togglePlayer(){
    isPlayerTurn = !isPlayerTurn;
    var playerDisplay = document.getElementById('turn');
    if(isPlayerTurn){
        playerDisplay.innerHTML = player1+"'s turn";
    }else{
        playerDisplay.innerHTML = player2+"'s turn";
    }
}

function resetAllIds() {    
    for (var key in initBoard) {
        var innerDiv = innerBox[key].querySelector('div');
        assignId(initBoard[key],innerDiv);
        
    }    
}


function setErrorNull(){
    document.getElementById('errorDiv').innerHTML = '';
}

function validateMove(){
    console.log(source,dest);
    console.log(getPosition(source, initBoard));
    console.log(getPosition(dest, initBoard));
    //general rules for all pawns
    if (dest[0] == source[0]) {
        //killing own pawn not allowed
        return false;
    } 
    if (destPos == sourcePos) {
        //keeping in the same position
        return false;
    }
    //black or white pawn
    if (source[0] == 'B') {
        switch (source[1]) {
            case 'S':                
                return soldierCheck('B');                
                break;
            case 'K':
                return true;
                break;
            case 'C':
                return true;                
                break;
            case 'H':
                return horseCheck();
                break;
            case 'E':
                return true;
                break;
            case 'Q':
                return true;
                break;
            default:
                return true;
                break;
        }

    } else if (source[0] == 'W') {
        switch (source[1]) {
            case 'S':
                return soldierCheck('W');                
                break;
            case 'K':
                return true;
                break;
            case 'C':
                return true;                
                break;
            case 'H':
                return horseCheck();
                break;
            case 'E':
                return true;
                break;
            case 'Q':
                return true;
                break;
            default:
                return true;                
                break;
        }

    } else if (source[0] == 'e' || source[0]== 'n') {
        //not needed - checked in player turn
        return false;
    }

    return true;
}

function soldierCheck(params) {
    var currentPosition = sourcePos;    
    if (params == 'B') {        
        var initialPosition = getPosition(source,initBlackPawns)+48;
        //IF pawn is in initial position
        if (currentPosition == initialPosition) {
            if (destPos == initialPosition-8) {
                if (dest[0] == 'W') {
                    return false;
                } else {
                    return true;
                }
            } else if (destPos == initialPosition - 16) {
                if (dest[0] == 'W') {
                    return false;
                } else {
                    return true;
                }
            } else if ((destPos == currentPosition-7) || (destPos == currentPosition-9)) {
                if (dest[0] == 'W') {
                    if ((currentPosition == 48) && (destPos == 39)) {
                        //extreme position conditions
                        return false;
                    }
                    if ((currentPosition == 55) && (destPos == 49)) {
                        return false;
                    }
                        
                    return true;
                                        
                } else {
                    return false;
                }
            }
        } else {            
            //current position is in any other position 
            if (dest[0] == 'n' || dest[0]=='e') {
                if (destPos == currentPosition-8) {
                    return true;
                } else {
                    return false;
                }
            } else if (dest[0] == 'W') {
                if (destPos == currentPosition-8) {
                    return false;
                } else if(destPos == currentPosition-9){
                    if ((currentPosition == 16) || (currentPosition == 24) || (currentPosition == 32) || (currentPosition == 40) || (currentPosition == 48) || (currentPosition == 8)) {
                        return false;
                    }
                    return true;
                }else if(destPos==currentPosition-7){
                    if ((currentPosition == 23) || (currentPosition == 31) || (currentPosition == 39) || (currentPosition == 47) || (currentPosition == 15) ) {
                        return false;
                    }
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
            
        }
    } else if (params == 'W') {        
        var initialPosition = getPosition(source,initWhitePawns);        
        //IF pawn is in initial position
        if (currentPosition == initialPosition) {            
            if (destPos == initialPosition+8) {
                if (dest[0] == 'B') {
                    return false;
                } else {
                    return true;
                }
            } else if (destPos == initialPosition + 16) {
                if (dest[0] == 'B') {
                    return false;
                } else {
                    return true;
                }
            } else if ((destPos == currentPosition+7) || (destPos == currentPosition+9)) {
                if (dest[0] == 'B') {
                    if ((currentPosition == 8) && (destPos == 15)) {
                        //extreme position conditions
                        return false;
                    }
                    if ((currentPosition == 15) && (destPos == 24)) {
                        return false;
                    } else {
                        return true;
                    }                    
                } else {
                    return false;
                }
            }
        } else {
            
            //current position is in any other position 
            if (dest[0] == 'n' || dest[0]=='e') {
                if (destPos == currentPosition+8) {
                    return true;
                } else {
                    return false;
                }
            } else if (dest[0] == 'B') {
                if (destPos == currentPosition+8) {                    
                    return false;
                } else if(destPos == currentPosition+9){
                    if ((currentPosition == 23) || (currentPosition == 31) || (currentPosition == 39) || (currentPosition == 47) || (currentPosition == 55) ) {
                        return false;
                    }
                    return true;
                } else if (destPos==currentPosition+7) {
                    if ((currentPosition == 16) || (currentPosition == 24) || (currentPosition == 32) || (currentPosition == 40) || (currentPosition == 48) || (currentPosition == 56)) {
                        return false;
                    }
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
            
        }
    }
}

function horseCheck(){
    var cP = sourcePos;
    var availableMoves = [cP+17, cP+15, cP+10, cP+6, cP-17, cP-15, cP-6, cP-10];
    var leftExtremes = [0,8,16,24,32,40,48,56];
    var rightExtremes = [7,15,23,31,39,47,55,63];
    var leftExtremesMoves = [cP+17,cP+10,cP-15,cP-6];
    var rightExtremesMoves = [cP+15,cP+6,cP-17,cP-10];
    
    if (getPosition(cP,leftExtremes)) {
        if (!getPosition(destPos,leftExtremesMoves)) {
            return false;
        } else {
            return true;
        }
    } else if (getPosition(cP,rightExtremes)) {
        if (!getPosition(destPos,rightExtremesMoves)) {
            return false;
        } else {
            return true;
        }
    } else {
        if (!getPosition(destPos,availableMoves)) {
            return false;
        } else {
            return true;
        }
    }
}