let rows = canvas.height / 25;
let columns = canvas.width / 25;
let matrix = [];

makeGrid = function() {
    for (let i = 0; i < columns; i++) {
        matrix.push(new Array(rows).fill(0));
    }
    return matrix;
}

updateGrid = function(i, j, color) {
    matrix[i-1][j-1] = color;
}

restoreGridOnRefresh = function() {
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            if (matrix[i][j] !== 0) {
                drawBubble((25 * (i + 1) - 12.5), (25 * (j + 1) - 12.5), 12, matrix[i][j]);
            }
        }
    }
}