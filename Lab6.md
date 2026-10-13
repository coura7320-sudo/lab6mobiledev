# Lab 6 — Tic-Tac-Toe in React Native

Follow the official React tutorial, **[Tutorial: Tic-Tac-Toe](https://react.dev/learn/tutorial-tic-tac-toe)**, from **Overview** to **Wrapping up**, and build the game as a **React Native** application.

The tutorial explains every React idea; this page only lists what changes on a phone.

**One rule:** keep the tutorial's names — `Square`, `Board`, `Game`, `onSquareClick`, `handleClick`, `calculateWinner`, `history`, `currentMove`, `jumpTo`, `onPlay`, `xIsNext`. Change only the building blocks.

## Setup

Skip the tutorial's **Setup** section (CodeSandbox). Instead:

```bash
npx create-expo-app@latest tic-tac-toe
cd tic-tac-toe
npm run reset-project
npx expo start
```

All the code goes in `src/app/index.tsx`. Open the project in Expo Go.

## Translation Table

|Tutorial (web)|React Native|
|---|---|
|`<div>`|`<View>`|
|`<button onClick={…}>`|`<Pressable onPress={…}>`|
|Text written directly inside an element|Text **must** be inside `<Text>`|
|`className="square"` + `styles.css`|`style={styles.square}` + `StyleSheet.create`|
|`<div className="board-row">`|`<View>` with `flexDirection: "row"` — the default is `column`|
|`<ol>` / `<li>`|`<ScrollView>` with one `<Pressable>` per move|
|Plain JavaScript|TypeScript: `type SquareValue = "X" | "O" | null;` and typed props|

## Section-by-Section Notes

|Tutorial section|What changes|
|---|---|
|Inspecting the starter code|There is no starter: write `Square` yourself, as one `Pressable` with an X inside a `Text`. Ignore `index.js`.|
|Building the board|Same Fragment error, same fix. Rows are `View`s with `flexDirection: "row"`.|
|Making an interactive component|`console.log` output appears in the Expo terminal, not in a browser console.|
|React Developer Tools|Press `j` in the Expo terminal to open React Native DevTools; the **Components** tab is the same.|
|Declaring a winner|The status is a `<Text>`.|
|Lifting state up, again|Expo Router displays the file's `export default`: moving it to `Game` is enough.|
|Showing the past moves|Place the move list **below** the board — a phone is too narrow for side by side.|

## Checkpoints

Commit when each one works:

|\#|The app…|Commit message|
|---|---|---|
|1|shows a 3 × 3 board of `Square` components|`Board of nine squares`|
|2|plays a full game: turns, no overwriting, a winner|`Playable game with a winner`|
|3|lists the moves and jumps back in time; `xIsNext` is computed|`Time travel`|
|4|includes the improvements below|one commit per improvement|

## Deliverables

A GitHub repository `tic-tac-toe` with the commits above, and a `README.md`