// Define a function called "loadImage" that takes a URL as a parameter.
export function loadImage(url) {
    // Create and return a new Promise.
    return new Promise(resolve => {
        // Create a new image element.
        const image = new Image();
        
        // Add an event listener to the image's 'load' event.
        image.addEventListener('load', () => {
            // When the image has loaded, resolve the Promise with the loaded image.
            resolve(image);
        });
        
        // Set the 'src' attribute of the image to the provided URL, triggering the loading process.
        image.src = url;
    });
}

export function loadLevel(name) {
    return fetch(`/levels/${name}.json`) // OBS the ´ instead of ' to allow placeholder value
    .then(response => response.json());
}