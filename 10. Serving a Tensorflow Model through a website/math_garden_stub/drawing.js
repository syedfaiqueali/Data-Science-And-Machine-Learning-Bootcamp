// CONSTANTS
const BACKGROUND_COLOR = '#000000';
const LINE_COLOR = '#FFFFFF'
const LINE_WIDTH = 15;

// VARIABLES
var currentX = 0;
var currentY = 0;
var previousX = 0;
var previousY = 0;

// FUNCTIONS

function prepareCanvas() {
  console.log('Preparing canvas');
  const canvas = document.getElementById('my-canvas')
  var context = canvas.getContext('2d') //2D canvas

  context.fillStyle = BACKGROUND_COLOR;
  context.fillRect(0, 0, canvas.width, canvas.height); //(x,y,width,height)

  //Set stroke size and color
  context.strokeStyle = LINE_COLOR;
  context.lineWidth = LINE_WIDTH;
  context.lineJoin = 'round'  //For Smoothness of line


  var isPainting = false;

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

      context.beginPath();  //Create list of coordinates
      context.moveTo(previousX, previousY);     //Set starting point of the path
      context.lineTo(currentX, currentY);    //Set ending points of the path to draw line
      context.closePath();
      context.stroke();
    }
  });

  //click anywhere on screen will trigger this event
  document.addEventListener('mouseup', function(event){
    console.log('Mouse Released');

    //finish painting when mouse is Released
    isPainting = false;

  });

}
