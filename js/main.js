const video = document.getElementById('video');

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("/library"),
    faceapi.nets.faceLandmark68Net.loadFromUri("/library"),
    faceapi.nets.faceRecognitionNet.loadFromUri("/library"),
    faceapi.nets.faceExpressionNet.loadFromUri("/library")
]).then(startVideo)

function startVideo(){
    navigator.getUserMedia(
        { video: {} },
        stream => video.srcObject = stream,
        error => console.error(error)
        )
}

startVideo();

video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    const displaySize = { width: video.width, height: video.height }
    console.log("Started Video");
    setInterval(async () => {
        const detect = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
        console.log(detect);
        const reziseDetect = faceapi.resizeResults(detect, displaySize);
        faceapi.draw.drawDetections(canvas, resizeDetect);
    }, 100)
})