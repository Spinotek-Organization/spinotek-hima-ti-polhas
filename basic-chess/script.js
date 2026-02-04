const boardElement = document.getElementById('chessboard');
const statusElement = document.getElementById('status');
const modal = document.getElementById('game-over-modal');

// Game Constants
const ROWS = 8;
const COLS = 8;
const WHITE = 'white';
const BLACK = 'black';

// Pieces - using images now. 
// const PIECES = ... (Unused for 3D/Skeuomorphic variant, using images)

function getPieceImage(pieceChar) {
    const colorChar = pieceChar === pieceChar.toUpperCase() ? 'w' : 'b';
    const typeChar = pieceChar.toLowerCase();
    // Using Chess.com 'glass' theme for 3D effect
    return `https://images.chesscomfiles.com/chess-themes/pieces/glass/150/${colorChar}${typeChar}.png`;
}

// Initial Board Setup (FEN-like logic but simple 2D array)
const INITIAL_BOARD = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

let board = [];
let turn = WHITE;
let selectedSquare = null;
let legalMoves = [];
let gameActive = true;
let moveHistory = []; // To track last move for En Passant and styling inside board state if needed (simplified here)
let castlingRights = {
    white: { kingSide: true, queenSide: true },
    black: { kingSide: true, queenSide: true }
};
// En Passant target: {r, c} or null. Square BEHIND the pawn that just moved 2 squares.
let enPassantTarget = null;
let isAnimating = false;

// Piece Values for Minimax
const PIECE_VALUES = {
    p: 10, n: 30, b: 30, r: 50, q: 90, k: 900,
    P: -10, N: -30, B: -30, R: -50, Q: -90, K: -900 // Negative for White
};

// Piece-Square Tables (Simplified for Black AI perspective - we will flip for White if needed, but currently AI is always Black)
// These values are additive to the piece value.
// Central squares are usually better.
const PST_W = {
    p: [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [5, 5, 5, 5, 5, 5, 5, 5],
        [1, 1, 2, 3, 3, 2, 1, 1],
        [0.5, 0.5, 1, 2.5, 2.5, 1, 0.5, 0.5],
        [0, 0, 0, 2, 2, 0, 0, 0],
        [0.5, -0.5, -1, 0, 0, -1, -0.5, 0.5],
        [0.5, 1, 1, -2, -2, 1, 1, 0.5],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    n: [
        [-5, -4, -3, -3, -3, -3, -4, -5],
        [-4, -2, 0, 0, 0, 0, -2, -4],
        [-3, 0, 1, 1.5, 1.5, 1, 0, -3],
        [-3, 0.5, 1.5, 2, 2, 1.5, 0.5, -3],
        [-3, 0, 1.5, 2, 2, 1.5, 0, -3],
        [-3, 0.5, 1, 1.5, 1.5, 1, 0.5, -3],
        [-4, -2, 0, 0.5, 0.5, 0, -2, -4],
        [-5, -4, -3, -3, -3, -3, -4, -5]
    ],
    b: [
        [-2, -1, -1, -1, -1, -1, -1, -2],
        [-1, 0, 0, 0, 0, 0, 0, -1],
        [-1, 0, 0.5, 1, 1, 0.5, 0, -1],
        [-1, 0.5, 0.5, 1, 1, 0.5, 0.5, -1],
        [-1, 0, 1, 1, 1, 1, 0, -1],
        [-1, 1, 1, 1, 1, 1, 1, -1],
        [-1, 0.5, 0, 0, 0, 0, 0.5, -1],
        [-2, -1, -1, -1, -1, -1, -1, -2]
    ],
    r: [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0.5, 1, 1, 1, 1, 1, 1, 0.5],
        [-0.5, 0, 0, 0, 0, 0, 0, -0.5],
        [-0.5, 0, 0, 0, 0, 0, 0, -0.5],
        [-0.5, 0, 0, 0, 0, 0, 0, -0.5],
        [-0.5, 0, 0, 0, 0, 0, 0, -0.5],
        [-0.5, 0, 0, 0, 0, 0, 0, -0.5],
        [0, 0, 0, 0.5, 0.5, 0, 0, 0]
    ],
    q: [
        [-2, -1, -1, -0.5, -0.5, -1, -1, -2],
        [-1, 0, 0, 0, 0, 0, 0, -1],
        [-1, 0, 0.5, 0.5, 0.5, 0.5, 0, -1],
        [-0.5, 0, 0.5, 0.5, 0.5, 0.5, 0, -0.5],
        [0, 0, 0.5, 0.5, 0.5, 0.5, 0, -0.5],
        [-1, 0.5, 0.5, 0.5, 0.5, 0.5, 0, -1],
        [-1, 0, 0.5, 0, 0, 0, 0, -1],
        [-2, -1, -1, -0.5, -0.5, -1, -1, -2]
    ],
    k: [
        [-3, -4, -4, -5, -5, -4, -4, -3],
        [-3, -4, -4, -5, -5, -4, -4, -3],
        [-3, -4, -4, -5, -5, -4, -4, -3],
        [-3, -4, -4, -5, -5, -4, -4, -3],
        [-2, -3, -3, -4, -4, -3, -3, -2],
        [-1, -2, -2, -2, -2, -2, -2, -1],
        [2, 2, 0, 0, 0, 0, 2, 2],
        [2, 3, 1, 0, 0, 1, 3, 2]
    ]
};

// Mirror for Black
const PST_B = {};
['p', 'n', 'b', 'r', 'q', 'k'].forEach(key => {
    PST_B[key] = PST_W[key].slice().reverse();
});

let gameMode = 'ai-easy'; // 'human', 'ai-easy', 'ai-medium', 'ai-hard'

function initGame() {
    // Deep copy initial board
    board = JSON.parse(JSON.stringify(INITIAL_BOARD));
    turn = WHITE;
    gameActive = true;
    selectedSquare = null;
    legalMoves = [];
    castlingRights = { white: { kingSide: true, queenSide: true }, black: { kingSide: true, queenSide: true } };
    enPassantTarget = null;
    moveHistory = [];

    // Get Game Mode
    const modeSelect = document.getElementById('game-mode');
    if (modeSelect) {
        gameMode = modeSelect.value;
    }

    renderBoard();
    updateStatus();
    modal.classList.add('hidden');
}

function renderBoard() {
    boardElement.innerHTML = '';

    // Check if King is in check to highlight
    const whiteKingPos = findKing(WHITE, board);
    const blackKingPos = findKing(BLACK, board);
    const whiteInCheck = isSquareAttacked(whiteKingPos.r, whiteKingPos.c, BLACK, board);
    const blackInCheck = isSquareAttacked(blackKingPos.r, blackKingPos.c, WHITE, board);

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const square = document.createElement('div');
            square.className = `square ${(r + c) % 2 === 0 ? 'light' : 'dark'}`;
            square.dataset.r = r;
            square.dataset.c = c;

            const pieceChar = board[r][c];
            if (pieceChar) {
                // Image Based Rendering
                const pieceImg = document.createElement('img');
                pieceImg.src = getPieceImage(pieceChar);
                pieceImg.alt = pieceChar;
                pieceImg.className = 'piece';

                // Fallback to text if image fails
                pieceImg.onerror = function () {
                    this.style.display = 'none';
                    const color = getPieceColor(pieceChar);
                    square.textContent = getUnicodePiece(pieceChar);
                    square.style.color = color === WHITE ? '#fff' : '#000';
                    square.style.textShadow = color === WHITE ? '0 0 2px #000' : 'none';
                    square.style.fontSize = "40px";
                    square.classList.add('piece'); // Ensure click logic works
                };

                square.appendChild(pieceImg);
            }

            // Highlights
            if (selectedSquare && selectedSquare.r === r && selectedSquare.c === c) {
                square.classList.add('selected');
            }

            // Highlight Last Move
            if (moveHistory.length > 0) {
                const lastMove = moveHistory[moveHistory.length - 1];
                if ((lastMove.from.r === r && lastMove.from.c === c) ||
                    (lastMove.to.r === r && lastMove.to.c === c)) {
                    square.classList.add('last-move');
                }
            }

            // Highlight Check
            if (whiteInCheck && r === whiteKingPos.r && c === whiteKingPos.c) square.classList.add('check');
            if (blackInCheck && r === blackKingPos.r && c === blackKingPos.c) square.classList.add('check');

            // Hint moves
            const isLegal = legalMoves.some(m => m.to.r === r && m.to.c === c);
            if (isLegal) {
                if (pieceChar) square.classList.add('capture-hint');
                else square.classList.add('hint');
            }

            square.addEventListener('click', () => handleSquareClick(r, c));
            boardElement.appendChild(square);
        }
    }
}

// Fallback Helper
function getUnicodePiece(char) {
    const PIECES_UNICODE = {
        w: { k: '♔', q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' },
        b: { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' }
    };
    const color = char === char.toUpperCase() ? 'w' : 'b';
    const type = char.toLowerCase();
    return PIECES_UNICODE[color][type];
}

function handleSquareClick(r, c) {
    if (!gameActive || isAnimating) return;

    // Prevent Human from clicking if it's AI turn (and we are in an AI mode)
    if (gameMode.startsWith('ai-') && turn !== WHITE) return;

    const clickedPiece = board[r][c];
    const clickedColor = clickedPiece ? getPieceColor(clickedPiece) : null;

    // Select Piece (Must match current turn color)
    if (clickedColor === turn) {
        selectedSquare = { r, c };
        legalMoves = getValidMoves({ r, c }, board);
        renderBoard();
        return;
    }

    // Move Piece
    if (selectedSquare) {
        const move = legalMoves.find(m => m.to.r === r && m.to.c === c);
        if (move) {
            // Animate then move
            isAnimating = true;
            animateMove(move).then(() => {
                makeMove(move, board, true); // true = real move
                selectedSquare = null;
                legalMoves = [];
                renderBoard();
                isAnimating = false;

                // Trigger AI if applicable
                if (gameActive && gameMode.startsWith('ai-') && turn === BLACK) {
                    setTimeout(() => {
                        makeAIMove();
                    }, 500); // Delay for realism
                }
            });
        } else {
            // Clicked empty or enemy but not valid move
            // If clicking empty/enemy and it's not a legal move, verify if it was a re-selection attempt (already handled by clickedColor===turn above)
            // Just deselect
            selectedSquare = null;
            legalMoves = [];
            renderBoard();
        }
    }
}

function getPieceColor(piece) {
    if (!piece) return null;
    return piece === piece.toUpperCase() ? WHITE : BLACK;
}

// --- Logic Generators ---

function getValidMoves(pos, currentBoard, checkSafety = true) {
    const moves = [];
    const piece = currentBoard[pos.r][pos.c];
    if (!piece) return [];

    const color = getPieceColor(piece);
    const type = piece.toLowerCase();

    // Direction vectors
    const directions = {
        p: [], // Special logic
        n: [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]],
        b: [[-1, -1], [-1, 1], [1, -1], [1, 1]],
        r: [[-1, 0], [1, 0], [0, -1], [0, 1]],
        q: [[-1, -1], [-1, 1], [1, -1], [1, 1], [-1, 0], [1, 0], [0, -1], [0, 1]],
        k: [[-1, -1], [-1, 1], [1, -1], [1, 1], [-1, 0], [1, 0], [0, -1], [0, 1]]
    };

    // Pawn Logic
    if (type === 'p') {
        const direction = color === WHITE ? -1 : 1;
        const startRow = color === WHITE ? 6 : 1;

        // Move Forward 1
        if (isValidPos(pos.r + direction, pos.c) && !currentBoard[pos.r + direction][pos.c]) {
            moves.push({ from: pos, to: { r: pos.r + direction, c: pos.c } });
            // Move Forward 2
            if (pos.r === startRow && !currentBoard[pos.r + direction * 2][pos.c]) {
                moves.push({ from: pos, to: { r: pos.r + direction * 2, c: pos.c }, isDoublePawn: true });
            }
        }

        // Capture
        [[direction, -1], [direction, 1]].forEach(offset => {
            const target = { r: pos.r + offset[0], c: pos.c + offset[1] };
            if (isValidPos(target.r, target.c)) {
                const targetPiece = currentBoard[target.r][target.c];
                // Normal Capture
                if (targetPiece && getPieceColor(targetPiece) !== color) {
                    moves.push({ from: pos, to: target });
                }
                // En Passant Capture
                if (!targetPiece && enPassantTarget && target.r === enPassantTarget.r && target.c === enPassantTarget.c) {
                    // Check if this pawn is on the correct rank relative to EP target?
                    // Actually logic is: if moves to enPassantTarget, it's valid.
                    // EnPassantTarget is set to the square skipped by double pawn move.
                    moves.push({ from: pos, to: target, enPassant: true });
                }
            }
        });
    } else {
        // Sliding & Stepping pieces
        const dirs = directions[type];
        const isSliding = ['b', 'r', 'q'].includes(type);

        for (let d of dirs) {
            let r = pos.r + d[0];
            let c = pos.c + d[1];

            while (isValidPos(r, c)) {
                const targetPiece = currentBoard[r][c];
                if (!targetPiece) {
                    moves.push({ from: pos, to: { r, c } });
                } else {
                    if (getPieceColor(targetPiece) !== color) {
                        moves.push({ from: pos, to: { r, c } });
                    }
                    break; // Stop at first piece
                }

                if (!isSliding) break; // Knight & King only move once
                r += d[0];
                c += d[1];
            }
        }
    }

    // Castling Logic (Only if checkSafety is true, to prevent recursive checks)
    if (type === 'k' && checkSafety) {
        // We need real castling rights state tracking.
        // For simplified checking, we check global castlingRights object logic in 'makeMove' or here.
        // Assuming castlingRights is valid for current board state.
        const rights = color === WHITE ? castlingRights.white : castlingRights.black;
        const row = color === WHITE ? 7 : 0;

        if (pos.r === row && pos.c === 4) { // King must be on starting square
            // King Side
            if (rights.kingSide &&
                !currentBoard[row][5] && !currentBoard[row][6] &&
                !isSquareAttacked(row, 4, getOpponent(color), currentBoard) &&
                !isSquareAttacked(row, 5, getOpponent(color), currentBoard) &&
                !isSquareAttacked(row, 6, getOpponent(color), currentBoard)) {
                moves.push({ from: pos, to: { r: row, c: 6 }, castle: 'king' });
            }
            // Queen Side
            if (rights.queenSide &&
                !currentBoard[row][3] && !currentBoard[row][2] && !currentBoard[row][1] &&
                !isSquareAttacked(row, 4, getOpponent(color), currentBoard) &&
                !isSquareAttacked(row, 3, getOpponent(color), currentBoard) &&
                !isSquareAttacked(row, 2, getOpponent(color), currentBoard)) {
                moves.push({ from: pos, to: { r: row, c: 2 }, castle: 'queen' });
            }
        }
    }

    // Filter illegal moves (that leave king in check)
    if (checkSafety) {
        return moves.filter(move => {
            // Simulate move
            const nextBoard = simulateMove(move, currentBoard);
            // Check if own king is attacked
            const kingPos = findKing(color, nextBoard);
            return !isSquareAttacked(kingPos.r, kingPos.c, getOpponent(color), nextBoard);
        });
    }

    return moves;
}

function isValidPos(r, c) {
    return r >= 0 && r < ROWS && c >= 0 && c < COLS;
}

function getOpponent(color) {
    return color === WHITE ? BLACK : WHITE;
}

function findKing(color, currentBoard) {
    const kingChar = color === WHITE ? 'K' : 'k';
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (currentBoard[r][c] === kingChar) return { r, c };
        }
    }
    return { r: 0, c: 0 }; // Fallback
}

function isSquareAttacked(r, c, attackerColor, currentBoard) {
    // Check if any piece of attackerColor can move to {r, c} (Pseudo-legal is enough for attack)
    // Optimization: Check lines from {r,c} outwards for sliding pieces, and specific spots for steps

    // Pawn attacks
    const pawnDir = attackerColor === WHITE ? -1 : 1; // White attacks UP (-1)
    // Wait, if checking if {r,c} is attacked by White Pawn at {r+1, c+/-1}
    const attackFromPawnRow = r - (attackerColor === WHITE ? -1 : 1);
    if (isValidPos(attackFromPawnRow, c - 1) && currentBoard[attackFromPawnRow][c - 1] === (attackerColor === WHITE ? 'P' : 'p')) return true;
    if (isValidPos(attackFromPawnRow, c + 1) && currentBoard[attackFromPawnRow][c + 1] === (attackerColor === WHITE ? 'P' : 'p')) return true;

    // Knight attacks
    const knightMoves = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
    const knightChar = attackerColor === WHITE ? 'N' : 'n';
    for (let m of knightMoves) {
        if (isValidPos(r + m[0], c + m[1]) && currentBoard[r + m[0]][c + m[1]] === knightChar) return true;
    }

    // King attacks (neighboring squares)
    const kingChar = attackerColor === WHITE ? 'K' : 'k';
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            if (isValidPos(r + i, c + j) && currentBoard[r + i][c + j] === kingChar) return true;
        }
    }

    // Sliding pieces (Rook/Queen)
    const cardDirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (let d of cardDirs) {
        let nr = r + d[0], nc = c + d[1];
        while (isValidPos(nr, nc)) {
            const p = currentBoard[nr][nc];
            if (p) {
                if ((p.toLowerCase() === 'r' || p.toLowerCase() === 'q') && getPieceColor(p) === attackerColor) return true;
                break;
            }
            nr += d[0]; nc += d[1];
        }
    }

    // Sliding pieces (Bishop/Queen)
    const diagDirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    for (let d of diagDirs) {
        let nr = r + d[0], nc = c + d[1];
        while (isValidPos(nr, nc)) {
            const p = currentBoard[nr][nc];
            if (p) {
                if ((p.toLowerCase() === 'b' || p.toLowerCase() === 'q') && getPieceColor(p) === attackerColor) return true;
                break;
            }
            nr += d[0]; nc += d[1];
        }
    }

    return false;
}

function simulateMove(move, currentBoard) {
    const newBoard = currentBoard.map(row => [...row]);
    const piece = newBoard[move.from.r][move.from.c];
    newBoard[move.to.r][move.to.c] = piece;
    newBoard[move.from.r][move.from.c] = null;

    // Simulating En Passant capture removal
    if (move.enPassant) {
        const captureRow = move.from.r; // The pawn being captured is on the same rank as start
        const captureCol = move.to.c;
        newBoard[captureRow][captureCol] = null;
    }

    // Simulating Castling Rook move
    if (move.castle === 'king') {
        newBoard[move.from.r][5] = newBoard[move.from.r][7]; // Move Rook
        newBoard[move.from.r][7] = null;
    } else if (move.castle === 'queen') {
        newBoard[move.from.r][3] = newBoard[move.from.r][0]; // Move Rook
        newBoard[move.from.r][0] = null;
    }

    return newBoard;
}

function makeMove(move, realBoard, updateRoundInfo = false) {
    const piece = realBoard[move.from.r][move.from.c];
    const color = getPieceColor(piece);

    // En Passant
    if (move.enPassant) {
        realBoard[move.from.r][move.to.c] = null; // Remove captured pawn
    }

    // Castling
    if (move.castle === 'king') {
        const row = move.from.r;
        realBoard[row][5] = realBoard[row][7];
        realBoard[row][7] = null;
    } else if (move.castle === 'queen') {
        const row = move.from.r;
        realBoard[row][3] = realBoard[row][0];
        realBoard[row][0] = null;
    }

    // Execute Move
    realBoard[move.to.r][move.to.c] = piece;
    realBoard[move.from.r][move.from.c] = null;

    // Promotion (Simple: Always Queen for this basic version)
    if (piece.toLowerCase() === 'p') {
        if ((color === WHITE && move.to.r === 0) || (color === BLACK && move.to.r === 7)) {
            realBoard[move.to.r][move.to.c] = color === WHITE ? 'Q' : 'q';
        }
    }

    if (updateRoundInfo) {
        // Update Castling Rights
        if (piece === 'K') { castlingRights.white.kingSide = false; castlingRights.white.queenSide = false; }
        if (piece === 'k') { castlingRights.black.kingSide = false; castlingRights.black.queenSide = false; }
        if (piece === 'R') {
            if (move.from.r === 7 && move.from.c === 0) castlingRights.white.queenSide = false;
            if (move.from.r === 7 && move.from.c === 7) castlingRights.white.kingSide = false;
        }
        if (piece === 'r') {
            if (move.from.r === 0 && move.from.c === 0) castlingRights.black.queenSide = false;
            if (move.from.r === 0 && move.from.c === 7) castlingRights.black.kingSide = false;
        }

        // Update En Passant Target
        if (move.isDoublePawn) {
            enPassantTarget = { r: (move.from.r + move.to.r) / 2, c: move.from.c };
        } else {
            enPassantTarget = null;
        }

        moveHistory.push(move);

        // Check Game Over
        const opponent = getOpponent(color);
        if (isCheckmate(opponent, realBoard)) {
            gameActive = false;
            showGameOver(color === WHITE ? 'Putih Menang!' : 'Hitam Menang!');
        } else if (isStalemate(opponent, realBoard)) {
            gameActive = false;
            showGameOver('Remis (Stalemate)');
        } else {
            turn = opponent;
            updateStatus();
        }
    }
}

function isCheckmate(color, currentBoard) {
    if (!isSquareAttacked(findKing(color, currentBoard).r, findKing(color, currentBoard).c, getOpponent(color), currentBoard)) return false;
    return getAllMoves(color, currentBoard).length === 0;
}

function isStalemate(color, currentBoard) {
    if (isSquareAttacked(findKing(color, currentBoard).r, findKing(color, currentBoard).c, getOpponent(color), currentBoard)) return false;
    return getAllMoves(color, currentBoard).length === 0;
}

function getAllMoves(color, currentBoard) {
    let allMoves = [];
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (getPieceColor(currentBoard[r][c]) === color) {
                allMoves.push(...getValidMoves({ r, c }, currentBoard));
            }
        }
    }
    return allMoves;
}

// --- AI (Minimax) ---

function makeAIMove() {
    // Simple copy of board for simulation
    // Note: Castling and En Passant state in simulation is tricky with just board array.
    // For "Basic" minimax, we often ignore updating EP/Castling rights deeply or make global assumptions.
    // We will do a best effort with current global 'castlingRights' frozen for the search root.

    // Difficulty Logic
    if (gameMode === 'ai-easy') {
        makeRandomMove();
        return;
    }

    let depth = 2; // Default Medium
    if (gameMode === 'ai-hard') depth = 3;

    setTimeout(() => {
        const bestMove = minimaxRoot(depth, board, true);
        if (bestMove) {
            isAnimating = true;
            animateMove(bestMove).then(() => {
                makeMove(bestMove, board, true);
                renderBoard();
                isAnimating = false;
            });
        } else {
            // If No move found by minimax (shouldn't happen unless Checkmate/Stalemate which are handled elsewhere),
            // fallback to random
            makeRandomMove();
        }
    }, 100);
}

function makeRandomMove() {
    const moves = getAllMoves(BLACK, board);
    if (moves.length > 0) {
        const randomMove = moves[Math.floor(Math.random() * moves.length)];
        isAnimating = true;
        animateMove(randomMove).then(() => {
            makeMove(randomMove, board, true);
            renderBoard();
            isAnimating = false;
        });
    }
}

function evaluateBoard(currentBoard) {
    let totalEvaluation = 0;
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const piece = currentBoard[r][c];
            if (piece) {
                totalEvaluation += PIECE_VALUES[piece] || 0;

                // PST Logic
                const type = piece.toLowerCase();
                if (type !== 'k') { // King PST is complex with endgame, simplified here
                    if (getPieceColor(piece) === WHITE) {
                        // PST_W is for White
                        if (PST_W[type] && PST_W[type][r] && PST_W[type][r][c] !== undefined) {
                            totalEvaluation += PST_W[type][7 - r][c]; // Note: PST defined 0..7, board 0..7. 
                            // Actually standard PSTs are usually Rank 1 (index 7) to Rank 8 (index 0).
                            // My PST_W above: Row 0 is Rank 8? No, let's assume Row 0 is Rank 8 (Top) as per visual board array.
                            // Wait, Row 0 in array is Rank 8 (Black side).
                            // Row 7 in array is Rank 1 (White side).
                            // My PST_W definition:
                            // p row 1: [5,5...] -> This is usually Rank 7 (pawns about to promote).
                            // p row 6: [0.5, 1...]. This is Rank 2 (start).
                            // So my PST_W is defined such that Index 0 is Rank 8.
                            // But White pawns start at Row 6 (Rank 2).
                            // Let's check my PST_W for 'p':
                            // Row 6 (Rank 2): [0.5, 1, 1, -2, -2, 1, 1, 0.5] -> Reasonable starting penalty/bonus?
                            // Actually, standard PST:
                            // Pawn: Rank 7 (Index 1) is 50 (high). Rank 2 (Index 6) is 5.
                            // My PST_W: Row 1 is 5. Correct.
                            // So PST_W matches board coordinates (Row 0 = Rank 8).
                            totalEvaluation += PST_W[type][r][c];
                        }
                    } else {
                        // Black
                        // PST_B is reversed PST_W.
                        if (PST_B[type] && PST_B[type][r] && PST_B[type][r][c] !== undefined) {
                            totalEvaluation -= PST_B[type][r][c]; // Subtract because Black wants to Minimize, and these are bonuses for Black.
                            // Wait, PIECE_VALUES for Black are Negative (e.g., -10).
                            // If Black has a good position, we want the score to be MORE Negative?
                            // Yes. So if PST says +5 (good spot), we SUBTRACT 5.
                        }
                    }
                }
            }
        }
    }
    return totalEvaluation;
}

function minimaxRoot(depth, currentBoard, isMaximizingPlayer) {
    // AI is Black, so it wants to Minimize the score (make it more negative).
    // isMaximizingPlayer param here refers to Minimax algorithm term, 
    // but we are playing as Black in this root call.
    // Standard Minimax:
    // Root (Black Turn) -> Find move that gives LOWEST score (if Black minimizes)

    // Let's stick to standard:
    // White = Max, Black = Min.
    // AI is Black. So at Root, we want valid move that results in MIN value.

    const newBoardMoves = getAllMoves(BLACK, currentBoard);
    let bestMove = -9999;
    let bestMoveFound = null;

    // Shuffle moves for randomness if equal
    newBoardMoves.sort(() => Math.random() - 0.5);

    // AI (Black) wants to minimize score.
    // Initialize bestVal to +Infinity
    let bestVal = Infinity;

    for (let i = 0; i < newBoardMoves.length; i++) {
        const move = newBoardMoves[i];
        const nextBoard = simulateMove(move, currentBoard);
        const value = minimax(depth - 1, nextBoard, -Infinity, Infinity, true); // Next is White (Max)

        if (value <= bestVal) {
            bestVal = value;
            bestMoveFound = move;
        }
    }
    return bestMoveFound;
}

function minimax(depth, currentBoard, alpha, beta, isMaximizingPlayer) {
    if (depth === 0) {
        return evaluateBoard(currentBoard);
    }

    if (isMaximizingPlayer) { // White
        let maxEval = -Infinity;
        const moves = getAllMoves(WHITE, currentBoard);
        if (moves.length === 0) return -Infinity; // Checkmate or stalemate logic simplified

        for (let i = 0; i < moves.length; i++) {
            const nextBoard = simulateMove(moves[i], currentBoard);
            const score = minimax(depth - 1, nextBoard, alpha, beta, false);
            maxEval = Math.max(maxEval, score);
            alpha = Math.max(alpha, score);
            if (beta <= alpha) break;
        }
        return maxEval;
    } else { // Black
        let minEval = Infinity;
        const moves = getAllMoves(BLACK, currentBoard);
        if (moves.length === 0) return Infinity;

        for (let i = 0; i < moves.length; i++) {
            const nextBoard = simulateMove(moves[i], currentBoard);
            const score = minimax(depth - 1, nextBoard, alpha, beta, true);
            minEval = Math.min(minEval, score);
            beta = Math.min(beta, score);
            if (beta <= alpha) break;
        }
        return minEval;
    }
}

function animateMove(move) {
    return new Promise(resolve => {
        const fromSquare = document.querySelector(`.square[data-r="${move.from.r}"][data-c="${move.from.c}"]`);
        const toSquare = document.querySelector(`.square[data-r="${move.to.r}"][data-c="${move.to.c}"]`);

        if (!fromSquare || !toSquare) {
            resolve();
            return;
        }

        // Target the PIECE IMAGE specifically
        const pieceImg = fromSquare.querySelector('img.piece');

        if (!pieceImg) {
            // If no image found (maybe invisible or lag), just resolve
            resolve();
            return;
        }

        // Clone ONLY the image
        const clone = pieceImg.cloneNode(true);

        // Get Rects
        const fromRect = pieceImg.getBoundingClientRect(); // Use image rect, not square
        const toRect = toSquare.getBoundingClientRect(); // Target square center 
        // Note: toSquare might be empty, so use its rect. 
        // Ideally we want to center the piece in the toSquare.

        // Calculate centered position in toSquare
        // The piece size is roughly 90% of square (from CSS).
        // Let's just animate to toSquare's top-left + padding?
        // Or simpler: clone current rect, animate to target rect.

        const startLeft = fromRect.left + window.scrollX;
        const startTop = fromRect.top + window.scrollY;

        // We want the destination to be where the piece WOULD be.
        // Since pieces are centered/sized by flexbox in square, 
        // let's assume destination rect matches the target square's content box roughly.
        // Actually, easiest is to trust the delta between squares.
        const destLeft = toRect.left + window.scrollX + (toRect.width - fromRect.width) / 2;
        const destTop = toRect.top + window.scrollY + (toRect.height - fromRect.height) / 2;

        // Setup Clone
        clone.style.position = 'absolute';
        clone.style.left = `${startLeft}px`;
        clone.style.top = `${startTop}px`;
        clone.style.width = `${fromRect.width}px`;
        clone.style.height = `${fromRect.height}px`;
        clone.style.zIndex = '9999';
        clone.style.pointerEvents = 'none';
        clone.style.transform = 'translate(0, 0)';
        clone.style.willChange = 'transform';

        document.body.appendChild(clone);

        // Hide original
        pieceImg.style.visibility = 'hidden';
        // visibility:hidden keeps layout but hides pixels. opacity:0 works too.

        // Animate
        const deltaX = destLeft - startLeft;
        const deltaY = destTop - startTop;

        // Using Web Anim API for better performance/control than CSS class
        const animation = clone.animate([
            { transform: 'translate(0px, 0px)' },
            { transform: `translate(${deltaX}px, ${deltaY}px)` }
        ], {
            duration: 300,
            easing: 'cubic-bezier(0.25, 1, 0.5, 1)' // smooth ease out
        });

        animation.onfinish = () => {
            clone.remove();
            pieceImg.style.visibility = 'visible'; // Restore (logic will move it shortly after resolve)
            resolve();
        };

        // Fallback safety
        setTimeout(() => {
            if (document.body.contains(clone)) {
                clone.remove();
                resolve();
            }
        }, 350);
    });
}

// --- UI Helpers ---

function updateStatus() {
    if (gameMode.startsWith('ai-')) {
        let diff = 'Mudah';
        if (gameMode === 'ai-medium') diff = 'Sedang';
        if (gameMode === 'ai-hard') diff = 'Sulit';
        statusElement.textContent = `Giliran: ${turn === WHITE ? 'Putih (Anda)' : `Hitam (AI ${diff} Thinking...)`}`;
    } else {
        statusElement.textContent = `Giliran: ${turn === WHITE ? 'Putih (Player 1)' : 'Hitam (Player 2)'}`;
    }
}

function showGameOver(msg) {
    const title = document.getElementById('game-over-title');
    const message = document.getElementById('game-over-message');
    title.innerText = "Permainan Selesai";
    message.innerText = msg;
    modal.classList.remove('hidden');
}

function closeModal() {
    modal.classList.add('hidden');
}

function resetGame() {
    initGame();
}

// Start
initGame();
