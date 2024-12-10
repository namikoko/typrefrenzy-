// racer.js


// Renamed 'sentences' to 'racerSentences' to avoid conflicts
const racerSentences = [
    "The quick brown fox jumps over the lazy dog.",
    "Typing fast can help you win this race.",
    "JavaScript makes games interactive and fun.",
    "A rolling stone gathers no moss.",
    "Practice typing daily to improve speed.",
    "Never stop learning new things in life.",
    "Creativity is intelligence having fun.",
  ];
 
  let currentRacerSentence = "";
  let typedRacerSentence = "";
  let userProgress = 0;
  let aiProgress = 0;
  const totalDistance = 850;
  let racerGameStarted = false;
  let racerTimeLimit = 60;
  let racerStartTime;
  let completedSentences = 0;
  let racerGameEnded = false;
 
  // AI car speed
  let aiSpeed;
 
  const racerKeyboardRows = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
  const racerKeySize = 40;
  const racerKeySpacing = 10;
  const racerKeyboardTop = 520;
 
  // Initialize the racer game
  function initRacer() {
    textSize(24);
    textAlign(CENTER, CENTER);
    resetRacerGame();
  }
 
  // Called every frame when state = 'racer'
  function racerGame() {
    background(50, 150, 200);
 
    if (!racerGameStarted) {
      drawRacerStartScreen();
      return;
    }
 
    if (racerGameEnded) {
      drawRacerEndScreen();
      return;
    }
 
    let timeLeft = max(
      0,
      racerTimeLimit - floor((millis() - racerStartTime) / 1000)
    );
    if (
      timeLeft === 0 ||
      completedSentences >= 4 ||
      aiProgress >= totalDistance
    ) {
      endRacerGame();
      return;
    }
 
    aiProgress = min(totalDistance, aiProgress + aiSpeed);
 
    drawRacerTrack();
    drawRacerCars();
    drawRacerHUD(timeLeft);
    drawRacerTypingBox();
    drawRacerKeyboard();
  }
 
  function racerKeyPressed(k, kCode) {
    if (!racerGameStarted && kCode === ENTER) {
      resetRacerGame();
      return;
    }
 
    if (racerGameEnded && kCode === ENTER) {
      resetRacerGame();
      return;
    }
 
    if (!racerGameStarted || racerGameEnded) return;
 
    if (kCode === BACKSPACE && typedRacerSentence.length > 0) {
      typedRacerSentence = typedRacerSentence.slice(0, -1);
      updateRacerProgress();
      return;
    }
 
    if (k.length === 1) {
      typedRacerSentence += k;
      updateRacerProgress();
      if (typedRacerSentence === currentRacerSentence) {
        completedSentences++;
        typedRacerSentence = "";
        currentRacerSentence = random(racerSentences);
        updateRacerProgress();
      }
    }
  }
 
  function racerKeyReleased(k, kCode) {
    // Not specifically needed here, but you can add logic if needed
  }
 
  function drawRacerStartScreen() {
    fill(255);
    textSize(36);
    text("Type Racer", width / 2, height / 2 - 50);
    textSize(20);
    text("Type sentences to race against the AI!", width / 2, height / 2);
    text("Press ENTER to start", width / 2, height / 2 + 50);
  }
 
  function drawRacerEndScreen() {
    fill(255);
    textSize(36);
 
    if (completedSentences >= 4) {
      text("You Win!", width / 2, height / 2 - 50);
      userProgress = totalDistance + 50;
    } else if (aiProgress >= totalDistance) {
      text("AI Wins!", width / 2, height / 2 - 50);
      aiProgress = totalDistance + 50;
    }
 
    textSize(24);
    text(
      `Your Progress: ${completedSentences}/4 sentences`,
      width / 2,
      height / 2
    );
    text("Press ENTER to restart", width / 2, height / 2 + 50);
  }
 
  function endRacerGame() {
    racerGameEnded = true;
    if (completedSentences >= 4) {
      userProgress = totalDistance + 50;
    } else if (aiProgress >= totalDistance) {
      aiProgress = totalDistance + 50;
    }
  }
 
  function drawRacerTrack() {
    const laneHeight = 80;          
    const trackWidth = totalDistance + 60;
    const trackX = width / 2 - trackWidth / 2;
 
    // Position lanes higher up on the screen
    // For example, user lane at 15% of screen height and AI lane 100px below it
    const userLaneY = height * 0.15;    // 15% down from the top
    const aiLaneY = userLaneY + 100;    // 100px below user lane
 
    fill(100);
    rect(trackX, userLaneY, totalDistance, laneHeight); // user lane
    rect(trackX, aiLaneY, totalDistance, laneHeight);   // AI lane
 
    fill(255);
    // Finish line remains at the end of the track, covering both lanes
    rect(trackX + totalDistance + 50, userLaneY - 20, 10, laneHeight * 2 + 70);
  }
 
  function drawRacerCars() {
    const laneHeight = 80;
    const trackWidth = totalDistance + 60;
    const trackX = width / 2 - trackWidth / 2;
 
    // Use the same lane positions as drawRacerTrack()
    const userLaneY = height * 0.15;
    const aiLaneY = userLaneY + 100;
 
    // Center the cars vertically in their lanes
    const userCarY = userLaneY + laneHeight/2 - 20; // half of 40px car height is 20
    const aiCarY = aiLaneY + laneHeight/2 - 20;
 
    fill(0, 0, 255);
    rect(min(trackX + userProgress, trackX + totalDistance + 50), userCarY, 40, 40);
 
    fill(255, 0, 0);
    rect(min(trackX + aiProgress, trackX + totalDistance + 50), aiCarY, 40, 40);
  }
 
 
 
  function drawRacerHUD(timeLeft) {
    fill(255);
    textSize(20);
    text(`Completed: ${completedSentences}/4`, 150, 30);
    text(`Time Left: ${timeLeft}s`, width - 150, 30);
 
    textSize(18);
    fill(255);
    text("Press Escape to return to the menu", width / 2, height - 40);
  }
 
  function drawRacerTypingBox() {
    fill(255);
    textSize(20);
    textFont("Courier New");
    textAlign(CENTER, CENTER);
 
    text(currentRacerSentence, width / 2, 400);
 
    fill(200);
    rect(width / 2 - 300, 450, 600, 50, 5);
 
    let boxWidth = 580;
    let displayedText = typedRacerSentence;
 
    textFont("Courier New");
    while (textWidth(displayedText) > boxWidth) {
      displayedText = displayedText.slice(1);
    }
 
    let startX = width / 2 - textWidth(displayedText) / 2;
 
    for (let i = 0; i < displayedText.length; i++) {
      fill(
        displayedText[i] === currentRacerSentence[i] ? [50, 50, 50] : [255, 0, 0]
      );
      text(displayedText[i], startX + textWidth(displayedText.slice(0, i)), 475);
    }
 
    if (typedRacerSentence.length === 0) {
      fill(150);
      text("Start typing here...", width / 2, 475);
    }
  }
 
  function drawRacerKeyboard() {
    const keyboardWidth =
      racerKeyboardRows[0].length * (racerKeySize + racerKeySpacing) -
      racerKeySpacing;
 
    for (let row = 0; row < racerKeyboardRows.length; row++) {
      const keys = racerKeyboardRows[row];
      const rowWidth =
        keys.length * (racerKeySize + racerKeySpacing) - racerKeySpacing;
      const rowStartX = width / 2 - rowWidth / 2;
 
      for (let col = 0; col < keys.length; col++) {
        const x = rowStartX + col * (racerKeySize + racerKeySpacing);
        const y = racerKeyboardTop + row * (racerKeySize + racerKeySpacing);
 
        fill(typedRacerSentence.endsWith(keys[col]) ? [0, 255, 0] : 200);
        rect(x, y, racerKeySize, racerKeySize, 5);
        fill(50);
        textSize(20);
        text(keys[col], x + racerKeySize / 2, y + racerKeySize / 2);
      }
    }
 
    const backspaceX = width / 2 + keyboardWidth / 2 + racerKeySpacing;
    const backspaceY = racerKeyboardTop + 2 * (racerKeySize + racerKeySpacing);
 
    fill(200);
    rect(backspaceX, backspaceY, 100, racerKeySize, 5);
    fill(50);
    textSize(20);
    text("Backspace", backspaceX + 50, backspaceY + racerKeySize / 2);
  }
 
  function updateRacerProgress() {
    userProgress = min(
      totalDistance,
      (completedSentences +
        typedRacerSentence.length / currentRacerSentence.length) *
        (totalDistance / 4)
    );
  }
 
  function resetRacerGame() {
    userProgress = 0;
    aiProgress = 0;
    typedRacerSentence = "";
    completedSentences = 0;
    currentRacerSentence = random(racerSentences);
    racerStartTime = millis();
    racerGameStarted = true;
    racerGameEnded = false;
    aiSpeed = totalDistance / (racerTimeLimit * 60);
  }
