import { useState } from "react";
import { StyleSheet, View, Text, Pressable, ScrollView } from "react-native";

// Type definition for a square value: "X", "O", or null (empty)
type SquareValue = "X" | "O" | null;

// Return type for winner calculation
interface WinnerResult {
  winner: SquareValue;
  line: number[] | null;
}

// Props for Square
interface SquareProps {
  value: SquareValue;
  onSquareClick: () => void;
  // Improvement 4: Highlight winning square
  isWinningSquare?: boolean;
}

// Beginner-friendly Square component
function Square({ value, onSquareClick, isWinningSquare }: SquareProps) {
  return (
    <Pressable
      style={[styles.square, isWinningSquare && styles.winningSquare]}
      onPress={onSquareClick}
    >
      <Text
        style={[
          styles.squareText,
          isWinningSquare && styles.winningSquareText,
        ]}
      >
        {value}
      </Text>
    </Pressable>
  );
}

// Helper function to calculate the winner and return the 3 winning squares
function calculateWinner(squares: SquareValue[]): WinnerResult | null {
  const lines = [
    [0, 1, 2], // rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // columns
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // diagonals
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }

  return null;
}

// Props for Board
interface BoardProps {
  xIsNext: boolean;
  squares: SquareValue[];
  onPlay: (nextSquares: SquareValue[]) => void;
}

// Board component: displays status and 3x3 grid
function Board({ xIsNext, squares, onPlay }: BoardProps) {
  function handleClick(i: number) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    onPlay(nextSquares);
  }

  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo ? winnerInfo.winner : null;
  const winningLine = winnerInfo ? winnerInfo.line : null;
  // Improvement 4: Draw detection
  const isDraw = !winner && squares.every((square) => square !== null);

  let status: string;
  if (winner) {
    status = "Winner: " + winner;
  } else if (isDraw) {
    status = "Result: It's a draw!";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  // Improvement 2: Two loops dynamically render the 3x3 board
  const boardRows = [];
  for (let row = 0; row < 3; row++) {
    const rowSquares = [];
    for (let col = 0; col < 3; col++) {
      const squareIndex = row * 3 + col;
      const isWinning = winningLine ? winningLine.includes(squareIndex) : false;
      rowSquares.push(
        <Square
          key={squareIndex}
          value={squares[squareIndex]}
          onSquareClick={() => handleClick(squareIndex)}
          isWinningSquare={isWinning}
        />
      );
    }
    boardRows.push(
      <View key={row} style={styles.boardRow}>
        {rowSquares}
      </View>
    );
  }

  return (
    <View style={styles.boardContainer}>
      <Text style={styles.status}>{status}</Text>
      {boardRows}
    </View>
  );
}

// Game component
export default function Game() {
  const [history, setHistory] = useState<SquareValue[][]>([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState<number>(0);
  // Improvement 3: Toggle sort order
  const [isAscending, setIsAscending] = useState<boolean>(true);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares: SquareValue[]) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
  }

  // Improvement 5: Calculate (row, col) location for each move
  function getMoveLocation(moveIndex: number): { row: number; col: number } | null {
    if (moveIndex === 0) return null;
    const current = history[moveIndex];
    const previous = history[moveIndex - 1];
    for (let i = 0; i < 9; i++) {
      if (current[i] !== previous[i]) {
        return {
          row: Math.floor(i / 3) + 1,
          col: (i % 3) + 1,
        };
      }
    }
    return null;
  }

  // Improvement 1: Show text for current move instead of button
  const moves = history.map((squares, move) => {
    const location = getMoveLocation(move);
    const locationText = location ? ` (${location.row}, ${location.col})` : "";

    if (move === currentMove) {
      const currentText =
        move > 0
          ? `You are at move #${move}${locationText}`
          : "You are at game start";
      return (
        <View key={move} style={styles.currentMoveContainer}>
          <Text style={styles.currentMoveText}>{currentText}</Text>
        </View>
      );
    }

    const description =
      move > 0
        ? `Go to move #${move}${locationText}`
        : "Go to game start";

    return (
      <Pressable
        key={move}
        style={styles.moveButton}
        onPress={() => jumpTo(move)}
      >
        <Text style={styles.moveButtonText}>{description}</Text>
      </Pressable>
    );
  });

  // Improvement 3: Conditionally display moves ascending or descending
  const displayedMoves = isAscending ? moves : moves.slice().reverse();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tic-Tac-Toe</Text>

      <View style={styles.gameBoard}>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </View>

      <View style={styles.gameInfo}>
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>History</Text>
          <Pressable
            style={styles.sortButton}
            onPress={() => setIsAscending(!isAscending)}
          >
            <Text style={styles.sortButtonText}>
              {isAscending ? "Sort: Ascending" : "Sort: Descending"}
            </Text>
          </Pressable>
        </View>
        <ScrollView style={styles.historyList}>{displayedMoves}</ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#0f172a",
  },
  boardContainer: {
    alignItems: "center",
  },
  status: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    color: "#334155",
  },
  boardRow: {
    flexDirection: "row",
  },
  square: {
    width: 80,
    height: 80,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#94a3b8",
    alignItems: "center",
    justifyContent: "center",
  },
  squareText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#1e293b",
  },
  winningSquare: {
    backgroundColor: "#bbf7d0",
    borderColor: "#16a34a",
  },
  winningSquareText: {
    color: "#15803d",
  },
  gameBoard: {
    marginBottom: 20,
  },
  gameInfo: {
    flex: 1,
    width: "100%",
    maxWidth: 320,
    marginTop: 10,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
  },
  sortButton: {
    backgroundColor: "#0284c7",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  sortButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  historyList: {
    flex: 1,
  },
  moveButton: {
    backgroundColor: "#e2e8f0",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 4,
    alignItems: "center",
  },
  moveButtonText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1e293b",
  },
  currentMoveContainer: {
    backgroundColor: "#3b82f6",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 4,
    alignItems: "center",
  },
  currentMoveText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#ffffff",
  },
});
