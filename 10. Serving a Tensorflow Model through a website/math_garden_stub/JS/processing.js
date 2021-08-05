// Variables
var model;

// Functions
async function loadModel() {
  //loading model.json
  model = await tf.loadGraphModel('TFJS/model.json');
}

function predictImage() {
  // 1- Load the image
  let image = cv.imread(canvas);
  // 2- Convert image from RGB to GRAYSCALE (src, dst, cv.COLOR_RGBA2GRAY, 0)
  cv.cvtColor(image, image, cv.COLOR_RGBA2GRAY, 0);
  // convert image from GrayScale to Black & white ;175=gray to 255=white
  cv.threshold(image, image, 175, 255, cv.THRESH_BINARY);

  //3- Finding the image contours
  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();
  // findContours(src, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE)
  cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

  // 4- Calculate bounding rectangle
  let cnt = contours.get(0);
  let rect = cv.boundingRect(cnt);
  // 5- Cropping the Image
  image = image.roi(rect);  //roi = region of interest

  // 6- Cal new size (getting canvas image height and width)
  var height = image.rows;
  var width = image.cols;

  //tall and narrow image
  if (height > width) {
    height = 20;
    const scaleFactor = image.rows / height; //old_height / new height
    width = Math.round(image.cols / scaleFactor); //rounding to nearest int
  }
  //short and narrow image
  else {
    width = 20;
    const scaleFactor = image.cols / width; //old_width / new width
    height = Math.round(image.rows / scaleFactor); //rounding to nearest int
  }

  // 7- Image resizing to 20px or 20px
  let newSize = new cv.Size(width, height);  //dsize
  cv.resize(image, image, newSize, 0, 0, cv.INTER_AREA); // (src, dest, dsize, 0, 0, cv.INTER_AREA)

  const LEFT = Math.ceil(4 + (20 - width) / 2);    //ceil = rounding_up
  const RIGHT = Math.floor(4 + (20 - width) / 2);  //floor = rounding_down
  const TOP = Math.ceil(4 + (20 - height) / 2);
  const BOTTOM = Math.floor(4 + (20 - height) / 2);
  //console.log(`Top: ${TOP}, Bottom: ${BOTTOM}, Left: ${LEFT}, Right: ${RIGHT}`);

  // 8- Add Padding to image 28x28px
  const BLACK = new cv.Scalar(0,0,0,0); //(r,g,b,alpha)
  cv.copyMakeBorder(image, image, TOP, BOTTOM, LEFT, RIGHT, cv.BORDER_CONSTANT, BLACK);

  // 9- Finding Center of Mass of image
  cv.findContours(image, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
  cnt = contours.get(0);
  const Moments = cv.moments(cnt, false);  //binary_image = false

  // Getting coordinates for img center
  const cx = Moments.m10 / Moments.m00; //m10=mass_in_horizontal_dir, m00=mass_for_img_as_whole(area)
  const cy = Moments.m01 / Moments.m00; //m01=mass_in_vertical_dir
  //console.log(`M00(Area): ${Moments.m00}, cx: ${cx}, cy: ${cy}`);

  // 10- Shifting the image(center the image in horizontal)
  const X_SHIFT = Math.round(image.cols/2.0 - cx); // (14.0 - cx)
  const Y_SHIFT = Math.round(image.rows/2.0 - cy);

  newSize = new cv.Size(image.cols, image.rows); //current size if img
  const M = cv.matFromArray(2, 3, cv.CV_64FC1, [1, 0, X_SHIFT, 0, 1, Y_SHIFT]); //cv.matFromArray(row, col, cv.CV_64FC1, [1, 0, x_shift, 0, 1, y_shift])
  cv.warpAffine(image, image, M, newSize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, BLACK); //warpAffine(src, dst, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar())

  //11- Normalize the Pixel Values (0-255 => 0-1)
  let pixelValues = image.data; //Every pixel value in array form
  pixelValues = Float32Array.from(pixelValues); //from arr of int to arr of float
  pixelValues = pixelValues.map(function(item){
    return item / 255.0;
  });
  //console.log('Scaled Array :'+ pixelValues);

  //12- Create a tensor and making predictions
  const X = tf.tensor([pixelValues]);
  //console.log(`Shape of Tensor: ${X.shape} || dtype of Tensor: ${X.dtype}`);
  const result = model.predict(X);
  result.print();  //to show result in console
  //console.log(tf.memory());

  //For Testing
  //showCanvasImageToDocument(image);

  //OpenCV Cleanup
  image.delete();
  contours.delete();
  cnt.delete();
  hierarchy.delete();
  M.delete();
  X.dispose();
  result.dispose();

}

function showCanvasImageToDocument(image) {
  const outputCanvas = document.createElement('CANVAS');
  cv.imshow(outputCanvas, image);
  document.body.appendChild(outputCanvas);
}
