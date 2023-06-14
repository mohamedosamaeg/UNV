const recordBtn = document.getElementById('recordBtn');
const stopBtn = document.getElementById('stopBtn');
const audioPlayer = document.getElementById('audioPlayer');
const waveformCanvas = document.getElementById('waveformCanvas');
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let mediaRecorder;
let chunks = [];
let isRecording = false;

if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function(stream) {
      visualize(stream);

      recordBtn.addEventListener('click', toggleRecording);
      stopBtn.addEventListener('click', stopRecording);
    })
    .catch(function(err) {
      console.log('Error accessing microphone:', err);
    });
}

function visualize(stream) {
  const source = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  const canvasCtx = waveformCanvas.getContext('2d');
  source.connect(analyser);

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  canvasCtx.clearRect(0, 0, waveformCanvas.width, waveformCanvas.height);

  function draw() {
    const WIDTH = waveformCanvas.width;
    const HEIGHT = waveformCanvas.height;

    requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = 'rgb(200, 200, 200)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

    canvasCtx.beginPath();

    const sliceWidth = WIDTH * 1.0 / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = v * HEIGHT / 2;

      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasCtx.lineTo(waveformCanvas.width, waveformCanvas.height / 2);
    canvasCtx.stroke();
  }

  draw();
}

function toggleRecording() {
  if (!isRecording) {
    startRecording();
    isRecording = true;
  } else {
    stopRecording();
    isRecording = false;
  }
}

function startRecording() {
  chunks = [];
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function(stream) {
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();
      console.log('Recording started');
      visualize(stream);
      mediaRecorder.addEventListener('dataavailable', saveRecording);
    })
    .catch(function(err) {
      console.log('Error accessing microphone:', err);
    });
}

function stopRecording() {
  mediaRecorder.stop();
  console.log('Recording stopped');
}

function saveRecording(e) {
    chunks.push(e.data);
    const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
    const audioURL = URL.createObjectURL(blob);
    audioPlayer.src = audioURL;
    audioPlayer.load(); // Load the audio to enable playback
    console.log('Recording saved:', audioURL);
  }
  
const resetBtn = document.getElementById('resetBtn');
resetBtn.addEventListener('click', resetRecording);

function resetRecording() {
  chunks = [];
  audioPlayer.src = '';
  const canvasCtx = waveformCanvas.getContext('2d');
  canvasCtx.clearRect(0, 0, waveformCanvas.width, waveformCanvas.height);
  console.log('Recording reset');
}
recordBtn.addEventListener('click', toggleRecording);

function toggleRecording() {
  if (!isRecording) {
    startRecording();
    recordBtn.classList.add('recording'); // Add 'recording' class to change button color
    isRecording = true;
  } else {
    stopRecording();
    recordBtn.classList.remove('recording'); // Remove 'recording' class to revert button color
    isRecording = false;
  }
}

stopBtn.addEventListener('click', stopRecording);

function stopRecording() {
  // Your stop recording logic here
  recordBtn.classList.remove('recording'); // Remove 'recording' class to revert button color
  isRecording = false;
}
function saveRecording(e) {
    chunks.push(e.data);
    const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
    const audioURL = URL.createObjectURL(blob);
    audioPlayer.src = audioURL;
    audioPlayer.load(); // Load the audio to enable playback
    console.log('Recording saved:', audioURL);
  } 

resetBtn.addEventListener('click', resetRecording);

function resetRecording() {
  // Your reset logic here
  recordBtn.classList.remove('recording'); // Remove 'recording' class to revert button color
  isRecording = false;
}
audioPlayer.src = 'path/to/audio-file.mp3';

// Play the audio
audioPlayer.play();

// Pause the audio
audioPlayer.pause();

// Stop the audio and reset to the beginning
audioPlayer.pause();
audioPlayer.currentTime = 0;
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');

uploadBtn.addEventListener('click', function() {
  fileInput.click();
});

fileInput.addEventListener('change', function() {
  const file = fileInput.files[0];
  if (file) {
    // Handle the uploaded file here
    console.log('File selected:', file.name);
  }
});

