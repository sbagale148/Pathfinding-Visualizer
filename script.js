const gridElement = document.querySelector('.grid');
const startButton = document.getElementById('start-button');
const clearButton = document.getElementById('clear-button');

// Create a 2D array for the grid
const rows = 20;
const cols = 20;
const grid = [];
let startCell = null;
let endCell = null;

// Initialize the grid
for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
        const cell = document.createElement('div');
        cell.dataset.row = i;
        cell.dataset.col = j;
        cell.addEventListener('click', () => handleCellClick(cell));
        gridElement.appendChild(cell);
        row.push(cell);
    }
    grid.push(row);
}

// Function to handle cell clicks
function handleCellClick(cell) {
    if (!startCell) {
        startCell = cell;
        cell.classList.add('start');
    } else if (!endCell && cell !== startCell) {
        endCell = cell;
        cell.classList.add('end');
    } else if (cell !== startCell && cell !== endCell) {
        cell.classList.toggle('obstacle');
    }
}

// Function to visualize Dijkstra's algorithm
function dijkstra() {
    if (!startCell || !endCell) {
        alert("Please set both start and end points.");
        return;
    }

    const startRow = parseInt(startCell.dataset.row);
    const startCol = parseInt(startCell.dataset.col);
    const endRow = parseInt(endCell.dataset.row);
    const endCol = parseInt(endCell.dataset.col);

    const visited = new Set();
    const distances = {};
    const previous = {};
    const queue = [];

    // Initialize distances
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            distances[`${i},${j}`] = Infinity;
            previous[`${i},${j}`] = null;
        }
    }
    
    distances[`${startRow},${startCol}`] = 0;
    queue.push([startRow, startCol]);

    while (queue.length > 0) {
        // Sort queue based on distances
        queue.sort((a, b) => distances[`${a[0]},${a[1]}`] - distances[`${b[0]},${b[1]}`]);

        const [currentRow, currentCol] = queue.shift();

        // Check if we've reached the end cell
        if (currentRow === endRow && currentCol === endCol) {
            reconstructPath(previous);
            return;
        }

        visited.add(`${currentRow},${currentCol}`);

        const neighbors = getNeighbors(currentRow, currentCol);
        for (const [neighborRow, neighborCol] of neighbors) {
            const neighborKey = `${neighborRow},${neighborCol}`;
            if (!visited.has(neighborKey) && !grid[neighborRow][neighborCol].classList.contains('obstacle')) {
                const newDistance = distances[`${currentRow},${currentCol}`] + 1;

                if (newDistance < distances[neighborKey]) {
                    distances[neighborKey] = newDistance;
                    previous[neighborKey] = [currentRow, currentCol];
                    queue.push([neighborRow, neighborCol]);
                }
            }
        }
    }
}

// Function to reconstruct the path
function reconstructPath(previous) {
    let current = `${endCell.dataset.row},${endCell.dataset.col}`;
    while (current) {
        const [row, col] = current.split(',').map(Number);
        if (grid[row][col] !== startCell && grid[row][col] !== endCell) {
            grid[row][col].classList.add('path');
        }
        current = previous[current] ? `${previous[current][0]},${previous[current][1]}` : null;
    }
}

// Get neighboring cells
function getNeighbors(row, col) {
    const neighbors = [];
    const directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1], // Up, Down, Left, Right
    ];

    for (const [dRow, dCol] of directions) {
        const newRow = row + dRow;
        const newCol = col + dCol;
        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
            neighbors.push([newRow, newCol]);
        }
    }
    return neighbors;
}

// Clear button event listener
clearButton.addEventListener('click', () => {
    startCell = null;
    endCell = null;
    grid.forEach(row => {
        row.forEach(cell => {
            cell.classList.remove('start', 'end', 'obstacle', 'path');
        });
    });
});

// Start button event listener
startButton.addEventListener('click', dijkstra);