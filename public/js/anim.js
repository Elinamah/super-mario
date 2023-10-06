export function createAnim(frames, frameLen) {
    return function resolveFrame(distance) { //both time and length
        const frameIndex = Math.floor(distance / frameLen) % frames.length;
        const frameName = frames[frameIndex];
        return frameName;
    };
}