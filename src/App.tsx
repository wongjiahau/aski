import * as React from "react";
import { useState } from "react";
import { list } from "./list";

function App() {
  const [input, setInput] = useState("");

  const [words, setWords] = useState([] as string[]);

  const entries = Object.entries(list).map(([character, recipe]) => ({
    character,
    recipe,
  }));

  const duplicates = entries.flatMap((entry) => {
    const duplicated = entries.find(
      (entry$) =>
        entry.character !== entry$.character &&
        entry.recipe[0] === entry$.recipe[0] &&
        entry.recipe[1] === entry$.recipe[1]
    );
    if (!duplicated) {
      return [];
    }
    return [{ entry, duplicated }];
  });

  const primaryMatchingCharacters = Object.entries(list)
    .flatMap(([character, recipe]) =>
      recipe[0]?.startsWith(input) ||
      (recipe[0] + "/" + recipe[1]).startsWith(input)
        ? [{ character, recipe }]
        : []
    )
    .sort((a, b) => {
      const rank = a.recipe[0].localeCompare(b.recipe[0]);
      if (rank !== 0) {
        return rank;
      }
      return (a.recipe[1] ?? "").localeCompare(b.recipe[1] ?? "") ?? 0;
    });

  const secondaryMatchingCharacters = Object.entries(list)
    .flatMap(([character, recipe]) =>
      recipe[1]?.startsWith(input) ? [{ character, recipe }] : []
    )
    .sort((a, b) => {
      const rank = a.recipe[0].localeCompare(b.recipe[0]);
      if (rank !== 0) {
        return rank;
      }
      return (a.recipe[1] ?? "").localeCompare(b.recipe[1] ?? "") ?? 0;
    });

  const matchingCharacters = [
    ...primaryMatchingCharacters,
    ...secondaryMatchingCharacters,
  ].slice(0, 10);
  return (
    <div
      style={{
        display: "grid",
        justifyContent: "center",
        width: "100vw",
        height: "100vh",
        alignContent: "start",
        padding: 32,
        gap: 32,
        fontSize: 36,
      }}
    >
      <input
        type="text"
        value={input}
        style={{ fontSize: 36 }}
        onChange={(event) => setInput(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            setWords([...words, matchingCharacters[0].character]);
            setInput("");
          }
        }}
      />
      {words.join("")}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto auto auto",
          gap: 32,
          color: "red",
        }}
      >
        {duplicates.map((entry, index) => (
          <React.Fragment key={index}>
            <div>{entry.entry.character}</div>
            <div>{entry.duplicated.recipe[0]}</div>
            <div>{entry.duplicated.recipe[1]}</div>
          </React.Fragment>
        ))}
      </div>
      <div
        style={{ display: "grid", gridTemplateColumns: "auto auto", gap: 32 }}
      >
        {matchingCharacters.map(({ character, recipe }, index) => (
          <React.Fragment key={index}>
            <div> {character} </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto auto",
                justifyContent: "start",
              }}
            >
              <div> {recipe[0]} </div>
              {recipe[1] && <div> /{recipe[1]} </div>}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default App;
