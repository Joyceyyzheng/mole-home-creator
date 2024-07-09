import './style.css';

let currentColor = '#000000';

//
//
//
//canvas
let canvas = document.getElementById("bigCanvas");
let ctx = canvas.getContext("2d");

let pixelRatio = window.devicePixelRatio;

canvas.width = window.innerWidth * pixelRatio;
canvas.height = window.innerHeight * pixelRatio;
let canvasRatio = canvas.width / canvas.height;


ctx.fillStyle = "#572A15";
ctx.fillRect(0, 0, canvas.width, canvas.height);

let bgImg = new Image();
bgImg.src = "dirt-image.png";

// let moleImg = new Image();
// moleImg.src = "themole.png";

bgImg.onload = function() {
  let canvasRatio = canvas.width / canvas.height;
  let imageRatio = bgImg.width / bgImg.height;

  if (canvasRatio < imageRatio) {
    ctx.drawImage(
      bgImg,
      0,
      (canvas.height - canvas.width / imageRatio) / 2,
      canvas.width,
      canvas.width / imageRatio
    );
  } else {
    ctx.drawImage(
      bgImg,
      (canvas.width - canvas.height * imageRatio) / 2,
      0,
      canvas.height * imageRatio,
      canvas.height
    );
  }
};
// moleImg.onload = function() {
//   let canvasRatio = canvas.width / canvas.height;
//   let imageRatio = moleImg.width / moleImg.height;

//   if (canvasRatio < imageRatio) {
//     ctx.drawImage(
//       moleImg,
//       0,
//       (canvas.height - canvas.width / imageRatio) / 2,
//       canvas.width,
//       canvas.width / imageRatio
//     );
//   } else {
//     ctx.drawImage(
//       moleImg,
//       (canvas.width - canvas.height * imageRatio) / 2,
//       0,
//       canvas.height * imageRatio,
//       canvas.height
//     );
//   }
// };

//
//
//buttons
let resetButton = document.getElementById("reset");
resetButton.addEventListener("click", () => console.log("reset"));

let hoeBtn = document.getElementById("hoe");
hoeBtn.addEventListener("click", () => {
  removeAllBrushEventListeners();
  canvas.addEventListener("pointermove", drawHoe);
  canvas.addEventListener("touchmove", drawHoe);
  console.log("hoe");
});

let pencilBtn = document.getElementById("pencil");
pencilBtn.addEventListener("click", () => {
  removeAllBrushEventListeners();
  canvas.addEventListener("pointermove", drawPencil);
  canvas.addEventListener("touchmove", drawPencil);
});

let penBtn = document.getElementById("pen");
penBtn.addEventListener("click", () => {
  removeAllBrushEventListeners();
  canvas.addEventListener("pointermove", drawPen);
  canvas.addEventListener("touchmove", drawPen);
});
//

//
//slider

let slider = document.getElementById('myRange'); // Access the slider
let sliderValue = slider.value; // Initial slider value

slider.addEventListener('input', function() {
  sliderValue = this.value;
  updateSizeBasedOnSlider(sliderValue); // Call a function to update sizes whenever the slider value changes
});
//

//brushes - pc system
canvas.addEventListener("pointerdown", drawStart);
canvas.addEventListener("pointerup", drawEnd);
canvas.addEventListener("pointerout", drawEnd);
canvas.addEventListener("pointermove", mouseMove);

let isDrawing = false;
let lastX = null;
let lastY = null;

function drawStart(event) {
  event.preventDefault();
  isDrawing = true;
  // lastX = event.clientX;
  // lastY = event.clientY;
  lastX = event.clientX * pixelRatio;
  lastY = event.clientY * pixelRatio;
}

function drawEnd(event) {
  event.preventDefault();
  if (isDrawing) {
    pushState()
  }
  isDrawing = false;

}
function mouseMove(event) {
  event.preventDefault();
  if (isDrawing === false) {
    return;
  }
}


//touch system
canvas.addEventListener("touchstart", handleStart, false);
canvas.addEventListener("touchend", handleEnd, false);
canvas.addEventListener("touchmove", handleMove, false);

function handleStart(event) {
  event.preventDefault();
  const { offsetX, offsetY } = getCanvasOffset();
  isDrawing = true;
  // Example for getting touch coordinates (using the first touch point)
  const touch = event.touches[0];
  lastX = (touch.clientX - offsetX) * pixelRatio;
  lastY = (touch.clientY - offsetY) * pixelRatio;
}

function handleMove(event) {
  event.preventDefault();
  if (!isDrawing) return;
  //const touch = event.touches[0];
  // Your drawing logic goes here
}

function handleEnd(event) {
  event.preventDefault();
  if (isDrawing) {
    // Push state or end drawing logic
    pushState()
  }
  isDrawing = false;
}


function drawHoe(event) {
  if (!isDrawing) return;

  const getRandom = (min, max) => Math.random() * (max - min) + min;
  const mouseX = event.clientX * pixelRatio;
  const mouseY = event.clientY * pixelRatio;
  let baseSize = sliderValue / 70;

  ctx.fillStyle = `rgba(255, 255, 255, 0.5)`;

  ctx.beginPath();
  ctx.arc(mouseX, mouseY, getRandom(1, 30), 0, 2 * Math.PI);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(mouseX - getRandom(5, 25), mouseY - getRandom(5, 25), getRandom(8, 18) * baseSize, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(mouseX + getRandom(5, 25), mouseY - getRandom(5, 25), getRandom(8, 18) * baseSize, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(mouseX - getRandom(5, 25), mouseY + getRandom(5, 25), getRandom(8, 18) * baseSize, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(mouseX + getRandom(5, 25), mouseY + getRandom(5, 25), getRandom(8, 18) * baseSize, 0, 2 * Math.PI);
  ctx.fill();

  lastX = mouseX;
  lastY = mouseY;

}

function drawPen(event) {
  if (!isDrawing) return;

  //recognizing mouse or touch
  let x, y;
  if (event.type === 'pointermove' || event.type === 'mousemove') {
    x = event.clientX;
    y = event.clientY;
  } else if (event.type === 'touchmove') {
    x = event.touches[0].clientX;
    y = event.touches[0].clientY;
  } else {

    return;
  }
  const mouseX = x * pixelRatio;
  const mouseY = y * pixelRatio;

  ctx.strokeStyle = currentColor;
  ctx.lineWidth = sliderValue * 0.09;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(lastX ? lastX : mouseX, lastY ? lastY : mouseY);
  // Draw line to the new position
  ctx.lineTo(mouseX, mouseY);
  ctx.stroke();

  lastX = mouseX;
  lastY = mouseY;
}

function distance(aX, aY, bX, bY) {
  return Math.sqrt(Math.pow(aX - bX, 2) + Math.pow(aY - bY, 2));
}

function pointsAlongLine(startx, starty, endx, endy, spacing) {
  let dist = distance(startx, starty, endx, endy);
  let steps = dist / spacing;

  let points = [];
  for (var d = 0; d <= 1; d += 1 / steps) {
    let point = {
      x: startx * d + endx * (1 - d),
      y: starty * d + endy * (1 - d)
    };
    points.push(point);
  }
  return points;
}

function rand() {
  return Math.random() - 0.5;
}

function getCanvasOffset() {
  const rect = canvas.getBoundingClientRect();
  return { offsetX: rect.left, offsetY: rect.top };
}

function drawPencil(event) {
  if (!isDrawing) return;

  let { offsetX, offsetY } = { offsetX: 0, offsetY: 0 };
  let x, y;

  if (event.type === 'pointermove' || event.type === 'mousedown' || event.type === 'mousemove') {
    x = event.clientX;
    y = event.clientY;
  } else if (event.type === 'touchmove' || event.type === 'touchstart') {
    ({ offsetX, offsetY } = getCanvasOffset());
    const touch = event.touches[0];
    x = touch.clientX - offsetX;
    y = touch.clientY - offsetY;
  }

  x *= pixelRatio;
  y *= pixelRatio;
  console.log("penciling");

  let speed = distance(x, y, lastX, lastY);
  let spread = 0.5 * speed;
  spread = Math.min(spread, 10);
  let points = pointsAlongLine(x, y, lastX, lastY, Math.max(spread * 0.5, 2));

  points.forEach((point) => {
    // draw cloud
    for (let i = 0; i < 4 * speed; i++) {
      ctx.fillStyle = currentColor;
      ctx.fillRect(point.x + rand() * spread + sliderValue, point.y + rand() * spread + sliderValue, sliderValue * .008, sliderValue * .01);
    }
  });

  lastX = x;
  lastY = y;
}
//
//
//draw stamps
document.querySelectorAll('.stamps').forEach(button => {
  button.addEventListener('click', () => {
    const emoji = button.textContent; //1.global variable 
    removeAllBrushEventListeners();
    //isDrawing = true;
    currentDrawFunction = function(event) { drawStamp(event, emoji); };
    //drawStamp({ clientX: 500, clientY: 500 }, emoji);
    canvas.addEventListener("pointerdown", currentDrawFunction);
    canvas.addEventListener("touchend", currentDrawFunction);
  });
});
let currentDrawFunction = null;
function drawStamp(event, emoji) {
  if (!isDrawing) return;
  ctx.font = `${sliderValue}px serif`;
  ctx.fillStyle = 'black';
  ctx.fillText(emoji, event.clientX * pixelRatio - sliderValue / 2, event.clientY * pixelRatio + sliderValue / 2);
}


//remove all 
function removeAllBrushEventListeners() {
  canvas.removeEventListener("pointermove", drawHoe);
  canvas.removeEventListener("pointermove", drawPen);
  canvas.removeEventListener("pointerdown", currentDrawFunction);
  canvas.removeEventListener("pointermove", drawPencil);

  canvas.removeEventListener("touchmove", drawHoe);
  canvas.removeEventListener("touchmove", drawPen);
  canvas.removeEventListener("touchmove", drawPencil);
  // canvas.removeEventListener("pointerdown", drawDragon);
}


//color picker
document.querySelectorAll('.color-picker-label').forEach(label => {
  const inputId = label.getAttribute('for');
  const input = document.getElementById(inputId);

  label.style.backgroundImage = 'URL("/rainbow.png")';

  label.addEventListener('click', (event) => {
    currentColor = input.value;
    label.style.backgroundColor = input.value;
    console.log("Color changed to:", currentColor);
  });

  // Update label background color based on picker selection
  input.addEventListener('input', () => {
    label.style.backgroundColor = input.value;
  });
});

//color buttons
document.querySelectorAll('.colors').forEach(button => {
  // Set the current color to the background color of the button
  button.addEventListener('click', () => {
    currentColor = window.getComputedStyle(button).backgroundColor;
    console.log("currentColor changed to:", currentColor);
  });
});


//reset canvas
let resetBtn = document.getElementById("reset");
resetBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#572A15";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  bgImg.onload(); //
});

//save picture
let saveBtn = document.getElementById("save");
saveBtn.addEventListener("click", () => {
  const dataURL = canvas.toDataURL("image/png");
  console.log("saving");
  const downloadLink = document.createElement('a');
  downloadLink.href = dataURL;

  downloadLink.download = 'newHomeForMole.png';
  // Append to the document, trigger the click, and then remove it
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
});

//
//undo button
let undoBtn = document.getElementById("undo");
let undoStack = [];
function pushState() {
  undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  if (undoStack.length > 50) {
    undoStack.shift();
  }
  console.log(undoStack.length);
}
pushState()
undoBtn.addEventListener("click", () => {
  undoStack.pop();
  let lastItem = undoStack[undoStack.length - 1];
  if (lastItem) {
    ctx.putImageData(lastItem, 0, 0);

    // let imageRatio = bgImg.width / bgImg.height;

    // if (canvasRatio < imageRatio) {
    //   ctx.drawImage(
    //     bgImg,
    //     0,
    //     (canvas.height - canvas.width / imageRatio) / 2,
    //     canvas.width,
    //     canvas.width / imageRatio
    //   );
    // } else {
    //   ctx.drawImage(
    //     bgImg,
    //     (canvas.width - canvas.height * imageRatio) / 2,
    //     0,
    //     canvas.height * imageRatio,
    //     canvas.height
    //   );
    // }
  }
});

