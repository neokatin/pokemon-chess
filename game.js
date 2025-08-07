const canvas = document.getElementById('chessboard');
const ctx = canvas.getContext('2d');
const boardSize = 8;
const cellSize = canvas.width / boardSize;

let board = [];
let selectedPiece = null;
let pieceMoves = [];
let gameOver = false;

// Initialize the board with pieces
function initBoard() {
  for (let row = 0; row < boardSize; row++) {
    board[row] = [];
    for (let col = 0; col < boardSize; col++) {
      if (row === 1) {
        board[row][col] = 'white_pawn';
      } else if (row === 6) {
        board[row][col] = 'black_pawn';
      } else if (row === 0) {
        board[row][col] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'][col];
      } else if (row === 7) {
        board[row][col] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'][col];
      } else {
        board[row][col] = null;
      }
    }
  }
}

// Draw the chessboard
function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      ctx.fillStyle = (row + col) % 2 === 0 ? '#f0d9b5' : '#b58863';
      ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      if (board[row][col]) {
        const [color, type] = board[row][col].split('_');
        const img = loadPieceImage(color, type);
        img.onload = () => {
          ctx.drawImage(img, col * cellSize, row * cellSize, cellSize, cellSize);
        };
      }
    }
  }
}

// Highlight possible moves for selected piece
function highlightMoves(row, col) {
  pieceMoves = [];
  const piece = board[row][col];
  if (piece) {
    if (piece === 'white_pawn' && row > 0) {
      pieceMoves.push([row - 1, col]);
    } else if (piece === 'black_pawn' && row < 7) {
      pieceMoves.push([row + 1, col]);
    }
    // Other piece movement logic (rooks, knights, etc.) can be added here
    drawBoard();
    pieceMoves.forEach(([r, c]) => {
      ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
      ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
    });
  }
}

// Handle click to select and move pieces
canvas.addEventListener('click', (e) => {
  if (gameOver) return;

  const x = Math.floor(e.offsetX / cellSize);
  const y = Math.floor(e.offsetY / cellSize);

  if (selectedPiece) {
    if (pieceMoves.some(move => move[0] === y && move[1] === x)) {
      // Move the selected piece to the new position
      const [color, type] = selectedPiece.piece.split('_');
      board[y][x] = selectedPiece.piece;
      board[selectedPiece.row][selectedPiece.col] = null;
      selectedPiece = null;
      drawBoard();
    } else {
      selectedPiece = null;
      drawBoard();
    }
  } else if (board[y][x]) {
    selectedPiece = { piece: board[y][x], row: y, col: x };
    highlightMoves(y, x);
  }
});

// Game Reset
document.getElementById('reset-button').addEventListener('click', () => {
  initBoard();
  gameOver = false;
  drawBoard();
});

// Initialize and draw the board
initBoard();
drawBoard();
