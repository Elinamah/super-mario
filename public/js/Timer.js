export default class Timer {
    constructor(deltaTime = 1/60) {
        let accumulatedTime = 0; 
        let lastTime = 0;

        /**
         * Updates game state and rendering based on the elapsed time since the last frame.
         * 
         * @param {number} time - The timestamp provided by requestAnimationFrame.
         */
        this.updateProxy = (time) => {
            accumulatedTime += (time - lastTime) / 1000;

            while (accumulatedTime > deltaTime) {
                this.update(deltaTime);
                accumulatedTime -=deltaTime;
            }

            lastTime = time;

            this.enqueue();
        }
    }


    enqueue() {
        requestAnimationFrame(this.updateProxy);
        //setTimeout(this.updateProxy, 1000/2, performance.now()); //If you want to try different frame rates
    }

    start() {
        this.enqueue();
    }
    
}
