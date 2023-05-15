let audioContext;
let piano;
let pitch;
let midiNum;
let currentNote = '';
let oldNote = '';
let currentFreq = false;
var volHist = []
var freqHist = [];
let fft;

function setup() {
  createCanvas(400, 400);
  frameRate(60);
  // fft = new p5.FFT();
  // fft.setInput(piano);
  audioContext = getAudioContext();
  piano = new p5.AudioIn();
  piano.start(startPitch);
}

// Uso de ml5 para detectar pitch
function startPitch() {
  pitch = ml5.pitchDetection(
    './Model/',
    audioContext,
    piano.stream,
    modelLoaded
  );
}

function modelLoaded() {
  select('#status').html('Model Loaded');
  getPitch();
}

function getPitch() {
  pitch.getPitch(function (err, frequency) {
    if (frequency) {
      select('#result').html(frequency);
    } else {
      select('#result').html('Pitch: no pitch detected');
    }
    getPitch();
    midiNum = freqToMidi(frequency);
  });
  // Array de historial de frecuencias para llenar el alto del canvas
  if (midiNum < 48) {
    freqHist.push(71.5);
  }
  freqHist.push(midiNum);
  if (freqHist.length > width) {
    freqHist.splice(0, 2);
  }
  //console.log(freqHist);
}


//////////////////////////////////////////////////////////

function draw() {
  background(0);  
      
  // Array de historial de volumen para llenar el ancho del canvas
  let vol = piano.getLevel();
  volHist.push(vol);
  if (volHist.length > width) {
    volHist.splice(0, 1);
  }

  // Dibuja elipse que cambia de tamaño con el volumen actual
  // y sigue al mouse
  stroke(255);
  ellipse(mouseX, mouseY, vol * 500);

  // Dibuja onda según el historial de volúmenes
  stroke('#ff0000');
  noFill();
  beginShape();
  for (let i = 0; i < volHist.length; i++) {
    var y = map(volHist[i], 0, 1, height * 0.75, 0);
    vertex(i, y);
  }
  endShape();

  // Dibuja onda según el historial de frecuencias
  stroke('#0000ff');
  noFill();
  beginShape();
  for (let i = 0; i < freqHist.length; i++) {
    var y = map(freqHist[i], 48, 95, height, 0)
    vertex(i, y);
  }
  endShape();

  
  // ONLY VOLUME
  // let vol = piano.getLevel();
  // ellipse(200, 200, vol*200, vol*200);

  // FREQUENCY VIZ
  // let spectrum = fft.analyze();
  // stroke(255);
  // for (let i = 0; i < spectrum.length; i++) {
  //   let amp = spectrum[i];
  //   let y = map(amp, 0, 255, height, 0);
  //   line (i, height, i, y);
  // }

  //console.log(spectrum);
}