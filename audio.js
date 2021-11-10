const {io, config, emit} = require("./server");


function queueAudio(src){
    emit("queueAudio", src);
}

module.exports = {
    queueAudio
}