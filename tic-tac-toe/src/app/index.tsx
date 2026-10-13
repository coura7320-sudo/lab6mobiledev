import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";

// Type definition for a square value: "X", "O", or null (empty)
type SquareValue = "X" | "O" | null;

// Props for each Square component
interface SquareProps {
  value: SquareValue;
  onSquareClick?: () => void;
}

// Beginner-friendly Square component:
// Replaces web <button className="square"> with React Native <Pressable>
// Text inside must be wrapped in <Text>
function Square({ value, onSquareClick }: SquareProps) {
  return (
    <Pressable style={styles.square} onPress={onSquareClick}>
      <Text style={styles.squareText}>{value}</Text>
    </Pressable>
  );
}

// Checkpoint 1: Shows a 3 x 3 board of Square components
export default function Board() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tic-Tac-Toe</Text>

      {/* Row 1 */}
      <View style={styles.boardRow}>
        <Square value={null} />
        <Square value={null} />
        <Square value={null} />
      </View>

      {/* Row 2 */}
      <View style={styles.boardRow}>
        <Square value={null} />
        <Square value={null} />
        <Square value={null} />
      </View>

      {/* Row 3 */}
      <View style={styles.boardRow}>
        <Square value={null} />
        <Square value={null} />
        <Square value={null} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#0f172a",
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
});
