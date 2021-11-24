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
    faceapi.matchDimensions(canvas, displaySize);
    console.log("Started Video Input");
    setInterval(async () => {
        const detect = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
        console.log(detect);
        const resizeDetect = faceapi.resizeResults(detect, displaySize);
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizeDetect);
        faceapi.draw.drawFaceLandmarks(canvas, resizeDetect)
        faceapi.draw.drawFaceExpressions(canvas, resizeDetect);
    }, 100)
})