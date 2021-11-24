const video = document.getElementByld('video')

function startVideo(){
    navigator.getUserMedia(
        { video: {} },
        stream => video.srcObject = stream,
        error => console.error(error)
        )
}

startVideo();