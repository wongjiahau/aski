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
        entry.character !== entry$.character && entry.recipe === entry$.recipe
    );
    if (!duplicated) {
      return [];
    }
    return [{ entry, duplicated }];
  });

  const matchingCharacters = Object.entries(list)
    .flatMap(([character, recipe]) =>
      recipe.startsWith(input) ? [{ character, recipe }] : []
    )
    .sort((a, b) => a.recipe.length - b.recipe.length)
    .slice(0, 10);

  console.log(input, matchingCharacters);

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
          gridTemplateColumns: "auto auto",
          gap: 32,
          color: "red",
        }}
      >
        {duplicates.map((entry, index) => (
          <React.Fragment key={index}>
            <div>{entry.entry.character}</div>
            <div>{entry.duplicated.recipe}</div>
          </React.Fragment>
        ))}
      </div>
      <div
        style={{ display: "grid", gridTemplateColumns: "auto auto", gap: 32 }}
      >
        {matchingCharacters.map(({ character, recipe }, index) => (
          <React.Fragment key={index}>
            <div> {character} </div>
            <div> {recipe} </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default App;
