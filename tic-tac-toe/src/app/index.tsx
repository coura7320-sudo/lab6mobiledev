import React, { useState } from "react";
import { StyleSheet, View, Text, Pressable, ScrollView } from "react-native";

// Type definition for a square value: "X", "O", or null (empty)
type SquareValue = "X" | "O" | null;

// Props for Square
interface SquareProps {
  value: SquareValue;
  onSquareClick: () => void;
}

// Beginner-friendly Square component
function Square({ value, onSquareClick }: SquareProps) {
  return (
    <Pressable style={styles.square} onPress={onSquareClick}>
      <Text style={styles.squareText}>{value}</Text>
    </Pressable>
  );
}

// Helper function to calculate the winner
function calculateWinner(squares: SquareValue[]): SquareValue {
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
      return squares[a];
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

  const winner = calculateWinner(squares);
  let status: string;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <View style={styles.boardContainer}>
      <Text style={styles.status}>{status}</Text>

      {/* Row 1 */}
      <View style={styles.boardRow}>
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </View>

      {/* Row 2 */}
      <View style={styles.boardRow}>
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </View>

      {/* Row 3 */}
      <View style={styles.boardRow}>
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </View>
    </View>
  );
}

// Checkpoint 3: Time travel - Game component manages history and jumps back in time
export default function Game() {
  const [history, setHistory] = useState<SquareValue[][]>([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState<number>(0);
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

  const moves = history.map((squares, move) => {
    let description: string;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tic-Tac-Toe</Text>

      <View style={styles.gameBoard}>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </View>

      <View style={styles.gameInfo}>
        <Text style={styles.historyTitle}>History</Text>
        <ScrollView style={styles.historyList}>
          {moves}
        </ScrollView>
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
  gameBoard: {
    marginBottom: 20,
  },
  gameInfo: {
    flex: 1,
    width: "100%",
    maxWidth: 320,
    marginTop: 10,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#0f172a",
    textAlign: "center",
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
});
