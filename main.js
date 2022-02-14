const video = document.getElementById('video');
const diego = document.getElementById("diego");

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("./"),
    faceapi.nets.faceLandmark68Net.loadFromUri("./"),
    faceapi.nets.faceRecognitionNet.loadFromUri("./"),
    faceapi.nets.faceExpressionNet.loadFromUri("./"),
    faceapi.nets.ageGenderNet.loadFromUri('./')
]).then(startVideo)

function startVideo(){
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      })
      .then(
        (cameraStream) => {
          video.srcObject = cameraStream;
        }
      )
}

startVideo();

video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    const displaySize = { 
        width: video.width,
        height: video.height 
    }
    faceapi.matchDimensions(canvas, displaySize);
    console.log("Started Video Input");
    setInterval(async () => {
        const detect = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions().withAgeAndGender()
        // console.log(detect);
        // Resizes detections to the video size
        const resizeDetect = faceapi.resizeResults(detect, displaySize);
        // Clears the detection box
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        
        faceapi.draw.drawFaceLandmarks(canvas, resizeDetect);
        faceapi.draw.drawFaceExpressions(canvas, resizeDetect);
        
        resizeDetect.forEach( detection => {
            const box = detection.detection.box
            const drawBox = new faceapi.draw.DrawBox(box, { label: "Age: " + Math.round(detection.age) + " | Gender: " + detection.gender + " | Name: " + "UNFINISHED" })
            drawBox.draw(canvas)
          })
    }, 10)
})
