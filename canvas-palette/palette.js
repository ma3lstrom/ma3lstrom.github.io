"use strict"

function draw() {
let context = document.getElementById('canvasInAPerfectWorld').
               getContext("2d");
let canvas = document.getElementById('canvasInAPerfectWorld');
let clearButton = document.getElementById('clearButton');
let colorButton = document.getElementById('colorButton');
let saveButton = document.getElementById('saveButton');
let eraserButton = document.getElementById('eraserButton');
let undoButton = document.getElementById('undoButton');
let undoNestedArray = [];
let undoArray = [];
let paint;
let isEraser;


let onmousedown = function( e ){
  let mouseX = e.pageX - this.offsetLeft;
  let mouseY = e.pageY - this.offsetTop;

  undoArray.push(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
  paint = true;

  addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop,
            false, isEraser);

  redraw();
};

canvas.addEventListener("mousedown", onmousedown);
canvas.addEventListener("touchstart", onmousedown);

let onmousemove = function( e ){
  if(paint) {

    undoArray.push(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop,
              true, isEraser);
    redraw();
  }
};

canvas.addEventListener("mousemove", onmousemove);
canvas.addEventListener("touchmove", onmousemove);

let onmouseup = function( e ){
  undoNestedArray.push(undoArray);
  undoArray = [];
  paint = false;
};

canvas.addEventListener("mouseup", onmouseup);
canvas.addEventListener("touchend", onmouseup);

canvas.onmouseleave = function( e ){
  paint = false;
};

let ccArrayIndex = 0; // index for clickColorArray
let colorArray = [];

// Functions called on startup
colorArray = initColorArray(colorArray);
fillColorSquares(colorArray, ccArrayIndex);

colorButton.onclick = function ( e ){
  ccArrayIndex = incrementArrayIndex(ccArrayIndex, colorArray);
  isEraser = false;
  fillColorSquares(colorArray, ccArrayIndex);
};

eraserButton.onclick = function( e ){
  isEraser = true;
};

saveButton.onclick = function( e ){
  let link = document.getElementById('saveAs');
  link.href = canvas.toDataURL("image/png");
  link.download = 'palettePicture.png';
};

clearButton.onclick = function( e ){
  clearCanvas();
  clearArrays();
};

undoButton.onclick = function( e ){
  undo();
};

let clickX = new Array();
let clickY = new Array();
let clickDrag = new Array();
let clickColor = new Array();

function addClick(x, y, dragging, isEraser){
  let color = '';
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
  if (isEraser){
    clickColor.push('#ffffff');
  }
  else{
    clickColor.push(getRandomColor(colorArray[ccArrayIndex]));
  }
}


function initColorArray(colorArray){

  colorArray.push(['#ffffff', '#84dcc6', '#a5ffd6', '#ffa69e', '#ff686b']);

  colorArray.push(['#ed6a5a', '#f4f1bb', '#9bc1bc', '#5ca4a9', '#e6ebe0']);

  colorArray.push(['#f0b67f', '#fe5f55', '#d6d1b1', '#c7efcf', '#eef5db']);

  colorArray.push(['#50514f', '#f25f5c', '#ffe066', '#247ba0', '#70c1b3']);
  colorArray.push(['#247ba0', '#70c1b3', '#b2dbbf', '#f3ffbd', '#ff1654']);

  colorArray.push(['#E71D36', '#2EC4B6', '#EFFFE9', '#011627']);

  colorArray.push(["#96ceb4", "#ffeead", "ffcc5c", "#ff6f69",
      "#588c7e", "#f2e394", "#f2ae72", "#d96459"]);

  colorArray.push(['#D7FFF1', '#8CD790', '#77AF9C', '#285943'])

  colorArray.push(['#d4dfe6', '#8ec0e4', '#cadbe9', '#6aafe6']);
  return colorArray;
}


function fillColorSquares(colorArray, index){
  let MAX_SQUARES = 8;
  let WHITE = "#ffffff";
  let arrSize = colorArray[index].length;
  let curColor = WHITE;

  for (let i=0; i<MAX_SQUARES; i++){
    if (i<arrSize){
      curColor = colorArray[index][i];
      document.getElementById("colorSquare"+i).style.color = curColor;
      document.getElementById("colorSquare"+i).title = curColor;
    }
    else{
      document.getElementById("colorSquare"+i).style.color = WHITE;
      document.getElementById("colorSquare"+i).title = WHITE;
    }
  }
}

// implement circular array
function incrementArrayIndex(index, array){
  let resIndex = index+1;
  return resIndex%(array.length);
};

function clearCanvas(){
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);
}

function clearArrays(){
  clickX = [];
  clickY = [];
  clickDrag = [];
  clickColor = [];
}

function undo(){
  if (undoNestedArray.length > 0){
    let topUndoArr = undoNestedArray.pop();
    for (let i=0; i<topUndoArr.length; i=i+2){
      let x = topUndoArr[i];
      let y = topUndoArr[i+1];
      addClick(x, y, true, true);
      redraw();
    }
  }
}

function redraw(){
  clearCanvas();

  context.lineJoin = "round";
  context.lineWidth = 8;

  for( let i=0; i< clickX.length; i++){
    context.beginPath();

    if (clickDrag[i] && i){
      context.moveTo(clickX[i-1], clickY[i-1]);
    }
    else {
      context.moveTo(clickX[i] - 1, clickY[i]);
    }

    context.lineTo(clickX[i], clickY[i]);
    context.closePath();
    context.strokeStyle = clickColor[i];
    context.stroke();
  }
}

function getRandomColor(colorArray){
  let randIndex = Math.floor((Math.random() * colorArray.length));
  return colorArray[randIndex];
}

}


