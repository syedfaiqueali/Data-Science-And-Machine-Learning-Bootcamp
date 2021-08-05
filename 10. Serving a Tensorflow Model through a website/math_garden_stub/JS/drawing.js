// CONSTANTS
const BACKGROUND_COLOR = '#000000';
const LINE_COLOR = '#FFFFFF';
const LINE_WIDTH = 15;

// VARIABLES
var currentX = 0;
var currentY = 0;
var previousX = 0;
var previousY = 0;

var canvas;
var context;

var isPainting = false;

// FUNCTIONS
function prepareCanvas() {
  //console.log('Preparing canvas');
  canvas = document.getElementById('my-canvas')
  context = canvas.getContext('2d') //2D canvas

  context.fillStyle = BACKGROUND_COLOR;
  context.fillRect(0, 0, canvas.width, canvas.height); //(x,y,width,height)

  //Set stroke size and color
  context.strokeStyle = LINE_COLOR;
  context.lineWidth = LINE_WIDTH;
  context.lineJoin = 'round'  //For Smoothness of line

  //by default isPainting false
  isPainting = false;

  //click anywhere on screen will trigger this event
  document.addEventListener('mousedown', function(event){
    console.log('Mouse Pressed');

    //start painting when mouse is down
    isPainting = true;

    //It will set currentX and currentY where we clicked
    currentX = event.clientX - canvas.offsetLeft;
    currentY = event.clientY - canvas.offsetTop;

  });


  //for cursor movement
  document.addEventListener('mousemove', function(event){
    if (isPainting) {
      //Setting last X value
      previousX = currentX;
      //Setting canvas start(Top-Left) to x=0
      currentX = event.clientX - canvas.offsetLeft;  // where mouse's x is currently

      //Setting last y value
      previousY = currentY;
      //Setting canvas start(Top-Left) to y=0
      currentY = event.clientY - canvas.offsetTop;  // where mouse's y is currently

      draw();
    }
  });

  //click anywhere on screen will trigger this event
  document.addEventListener('mouseup', function(event){
    console.log('Mouse Released');

    //finish painting when mouse is Released
    isPainting = false;

  });

  canvas.addEventListener('mouseleave', function(event){
    //finish painting when mouse reaches out of canvas
    isPainting = false;
  });

  //Touch Events
  canvas.addEventListener('touchstart', function(event){
    console.log('Touchdown!');

    //start painting when mouse is down
    isPainting = true;

    //It will set currentX and currentY where we clicked
    //e.touches returns an array of every fingers
    //e.touches[0] ;for first finger's touch
    currentX = event.touches[0].clientX - canvas.offsetLeft;
    currentY = event.touches[0].clientY - canvas.offsetTop;

  });

  canvas.addEventListener('touchend', function(event){
    //finish painting when mouse reaches out of canvas
    isPainting = false;
  });

  canvas.addEventListener('touchcancel', function(event){
    //finish painting when mouse touch out of canvas
    isPainting = false;
  });

  //for touch movement
  canvas.addEventListener('touchmove', function(event){
    if (isPainting) {
      //Setting last X value
      previousX = currentX;
      //Setting canvas start(Top-Left) to x=0
      currentX = event.touches[0].clientX - canvas.offsetLeft;  // where mouse's x is currently

      //Setting last y value
      previousY = currentY;
      //Setting canvas start(Top-Left) to y=0
      currentY = event.touches[0].clientY - canvas.offsetTop;  // where mouse's y is currently

      draw();
    }
  });

}

function draw() {
  context.beginPath();  //Create list of coordinates
  context.moveTo(previousX, previousY);     //Set starting point of the path
  context.lineTo(currentX, currentY);    //Set ending points of the path to draw line
  context.closePath();
  context.stroke();
}

function clearCanvas() {
  //reseting all varibales values
  currentX = 0;
  currentY = 0;
  previousX = 0;
  previousY = 0;

  //making canvas all black again
  context.fillRect(0, 0, canvas.width, canvas.height);
}
