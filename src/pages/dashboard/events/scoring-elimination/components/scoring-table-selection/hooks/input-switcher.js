import * as React from "react";

function useInputSwitcher(scoringDetails) {
  const [switcher, dispatch] = React.useReducer(switcherReducer, {
    size: { y: 0, x: 0 },
    pos: { y: -1, x: -1 },
    scoringDetails: {},
  });

  React.useEffect(() => {
    if (!scoringDetails || switcher.size.y > 0 || switcher.size.x > 0) {
      return;
    }
    dispatch({ type: "INIT", payload: scoringDetails });
  }, [scoringDetails, switcher.size.y, switcher.size.x]);

  const setPosition = (pos) => dispatch({ type: "SET_POSITION", payload: pos });

  const move = (pos) => {
    dispatch({ type: "MOVE_NEXT", payload: pos });
  };

  const shouldFocusSelector = (pos) => {
    const isFocus =
      Boolean(scoringDetails) &&
      pos.y === switcher.pos.y &&
      pos.x === switcher.pos.x;
    return isFocus;
  };

  return { shouldFocusSelector, move, setPosition };
}

function switcherReducer(state, action) {
  if (action.type === "INIT") {
    if (!action.payload) {
      return state;
    }

    // init size
    const rambahanNumbers = Object.keys(action.payload);
    const sizeY = rambahanNumbers.length;
    console.log("action:", action);
    let sizeX = 0;
    if (action.payload.length > 0) {
      sizeX = action.payload[1].length;
    }

    // init position
    let distance = 0;
    let emptyIsFound = false;

    // Nge-track rambahan
    for (let rambahanNumber of rambahanNumbers) {
      const rambahan = action.payload[rambahanNumber];

      // Nge-track "shot"/skor
      for (let shotIndex = 0; shotIndex < sizeX; shotIndex++) {
        distance++;
        const score = rambahan[shotIndex];
        if (score) {
          continue;
        }
        emptyIsFound = true;
        break;
      }

      if (!emptyIsFound) {
        continue;
      }
      break;
    }

    const mod = distance % sizeX;
    const indexX = mod ? mod - 1 : sizeX - 1;
    const indexY = Math.floor(distance / sizeX) + (mod ? 0 : -1);

    return {
      size: { y: sizeY, x: sizeX },
      pos: { y: indexY, x: indexX },
    };
  }

  if (action.type === "SET_POSITION") {
    return {
      ...state,
      pos: { ...action.payload },
    };
  }

  if (action.type === "MOVE_NEXT") {
    const { y, x, scoresFromProp } = action.payload;
    let targetY;
    let targetX;
    const lengthScoresFromProp = Object.keys(scoresFromProp);
    const lengthRowScore = scoresFromProp[lengthScoresFromProp[0]];

    if (
      y >= lengthScoresFromProp.length - 1 &&
      x >= lengthRowScore.length - 1
    ) {
      targetY = 0;
      targetX = 0;
    } else if (x >= lengthRowScore.length - 1) {
      targetY = y + 1;
      targetX = 0;
    } else {
      targetY = y;
      targetX = x + 1;
    }

    return {
      ...state,
      pos: { y: targetY, x: targetX },
    };
  }

  return state;
}

export { useInputSwitcher };
