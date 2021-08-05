
// Varibales
var answer;
var score = 0;
var backgroundImages = [];

// Logic to server a new ques
function nextQuestion() {
  const n1 = Math.floor(Math.random() * 5);  //n1 = 0-4
  document.getElementById('n1').innerHTML = n1;

  const n2 = Math.floor(Math.random() * 6);  //n1 = 0-5
  document.getElementById('n2').innerHTML = n2;

  //summing numbers
  answer = n1 + n2;
}

// To check the ans
function checkAnswer() {
  // predictImage() is returning ans
  const prediction = predictImage();
  console.log(`Actual Ans: ${answer} || Preicted Ans: ${prediction}`);

  if (prediction == answer) {
    score ++;
    console.log(`Correct !! || Score: ${score}`);

    if (score <= 6) {
      // Append images to background on every correct ans
      backgroundImages.push(`url('images/background${score}.svg')`);
      document.body.style.backgroundImage = backgroundImages;
    } else {
      alert('Well done! Your math garden is in full bloom! Want to start again?');

      //reset
      score = 0;
      backgroundImages = [];
      document.body.style.backgroundImage = backgroundImages;
    }

  } else {
    if (score != 0) {
      score --;
    }
    console.log(`Wrong !! || Score: ${score}`);
    alert('Oops! Check your calculations and try writing the number neater the next time.');
    setTimeout(function(){
      //remove an item from backgroundImages
      backgroundImages.pop();
      document.body.style.backgroundImage = backgroundImages;
    }, 1000);
  }
}
