"use strict";

let ac; // audio context

if (navigator.mediaDevices.getUserMedia) {
    console.log('get user media');
    navigator.mediaDevices.getUserMedia({
        video: false,
        audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false
        }
    }).then(() => {
        ac = new AudioContext({
            latencyHint: 'interactive'
        });
    }).catch(console.log);
}

class RandomKey {
    constructor(base) {
        return Math.floor(
            Math.random() *
            Math.floor(Math.random() *
                Date.now()
            )).toString(base || 32);
    }
}

class InputNode {
    constructor() {
        navigator.mediaDevices.getUserMedia({
            video: false,
            audio: {
                echoCancellation: false,
                noiseSuppression: false,
                autoGainControl: false
            }
        }).then((stream) => {
            this.src = ac.createMediaStreamSource(stream);
        }).catch(console.log);
    }
}

class InputNodeFromDeviceID {
    constructor(id) {
        navigator.mediaDevices.getUserMedia({
            video: false,
            audio: {
                echoCancellation: false,
                noiseSuppression: false,
                autoGainControl: false
            },
            deviceId: id
        }).then((stream) => {
            this.src = ac.createMediaStreamSource(stream);
        }).catch(console.log);
    }
}

class Convolver {
    constructor(echo, reverb) {
        this.convolver = ac.createConvolver();
        if (Number.isInteger(echo + reverb)) {
            this.convolver.buffer = impulse(echo, reverb);
        }
    }
}

class StereoPanner {
    constructor(pan) {
        this.panner = ac.createStereoPanner();
        this.panner.pan.value = pan;
    }
}

class Gain {
    constructor(gain) {
        this.gainnode = ac.createGain();
        this.gainnode.gain.value = gain;
    }
}

function impulse(seconds, decay) {
    let l = ac.sampleRate * seconds; // length of track
    let imp = ac.createBuffer(1, l, ac.sampleRate); // the impulse array buffer
    let arr = imp.getChannelData(0);
    for (let i = 0; i < l; i++) {
        arr[i] = ((2 * Math.random()) - 1) * (1 - (i / l)) ** decay;
    }
    return imp;
}

/*
dB = 20 * Math.log10(ratio)
ratio = 10 ** (dB/20)
*/