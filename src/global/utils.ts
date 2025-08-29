export function random(max: number, min = 0) {
    return Math.random() * (max - min) + min;
}

export function createXY(array: number[], min: number, max: number, width: number) {
    let value = random(max, min);

    if (array.length === 2) {
        const [first, second] = array;
        if (first > second) {
            value = first + width;
        } else {
            value = second + width;
        }
    }

    array.push(value);
    return value;
}

export function setGameSpeedToSessionStorage(speed: number) {
    sessionStorage.setItem('gameSpeed', speed.toString());
}

export function getGameSpeedFromSessionStorage() {
    const gameSpeed = sessionStorage.getItem('gameSpeed');
    return gameSpeed === null ? 0 : parseInt(gameSpeed);
}

export function removeGameSpeedFromSessionStorage() {
    sessionStorage.removeItem('gameSpeed');
}

export function setGameHighScoreToLocalStorage(score: number) {
    localStorage.setItem('gameHighScore', score.toString());
}

export function getGameHighScoreToLocalStorage() {
    const highScore = localStorage.getItem('gameHighScore');
    return highScore === null ? 0 : parseInt(highScore);
}

export function removeGameHighScoreToLocalStorage() {
    sessionStorage.removeItem('gameHighScore');
}