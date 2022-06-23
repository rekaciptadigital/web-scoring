import * as React from "react";

const InputSwitcher = React.createContext();

function useInputSwitcher() {
  const switcher = React.useContext(InputSwitcher);
  return switcher;
}

function InputSwitcherProvider({ scoringDetails, grid, children }) {
  const switcher = useSwitcher(scoringDetails, grid);
  return <InputSwitcher.Provider value={switcher}>{children}</InputSwitcher.Provider>;
}

function useSwitcher(scoringDetails, grid) {
  const [gridLeft, gridRight] = grid;
  const [switcher, dispatch] = React.useReducer(reducer, {
    size: { y: 0, x: 0 },
    side: 0,
    pos: { y: 0, x: 0 },
  });

  React.useEffect(() => {
    if (!scoringDetails) {
      return;
    }
    dispatch({ type: "INIT", payload: [gridLeft, gridRight] });
  }, [scoringDetails]);

  const move = (side, pos) => {
    dispatch({ type: "MOVE_NEXT", payload: { side, pos } });
  };

  const setPosition = (side, pos) => {
    dispatch({ type: "SET_POSITION", payload: { side, pos } });
  };

  const shouldFocusInput = (side, pos) => {
    return side === switcher.side && pos.x === switcher.pos.x && pos.y === switcher.pos.y;
  };

  return { side: switcher.side, pos: switcher.pos, move, setPosition, shouldFocusInput };
}

function reducer(state, action) {
  if (action.type === "INIT") {
    // Init size
    const [gridLeft, gridRight] = action.payload;
    const sizeY = gridLeft.length || gridRight.length;
    const sizeX = gridLeft[0].length || gridRight[0].length;

    /**
     * * Init side & position
     *
     * Posisi default yang aktif itu input pertama yang belum diisi,
     * dihitung dari depan. Kiri atas grid sebelah kiri, ke kanan bawah
     * grid sebelah kanan.
     */
    let side = 0;
    let distance = 0;
    let emptyIsFound = false;

    // Nge-track grid, yang sebelah mana
    for (let sideIndex = 0; sideIndex < 2; sideIndex++) {
      const grid = action.payload[sideIndex];

      // Nge-track rambahan
      for (let rambahanIndex = 0; rambahanIndex < sizeY; rambahanIndex++) {
        const rambahan = grid[rambahanIndex];

        // Nge-track "shot"/skor
        for (let shotIndex = 0; shotIndex < sizeX; shotIndex++) {
          distance++;
          const score = rambahan[shotIndex];
          if (score) {
            continue;
          }
          emptyIsFound = true;
          side = sideIndex;
          break;
        }

        if (!emptyIsFound) {
          continue;
        }
        break;
      }

      if (!emptyIsFound) {
        continue;
      }
      break;
    }

    const gridSize = sizeX * sizeY;
    distance = side > 0 ? distance - gridSize : distance;
    const mod = distance % sizeX;
    const indexX = mod ? mod - 1 : sizeX - 1;
    const indexY = Math.floor(distance / sizeX) + (mod ? 0 : -1);

    return {
      size: { y: sizeY, x: sizeX },
      side: side,
      pos: { y: indexY, x: indexX },
    };
  }

  if (action.type === "SET_POSITION") {
    return {
      ...state,
      side: action.payload.side,
      pos: { ...action.payload.pos },
    };
  }

  if (action.type === "MOVE_NEXT") {
    const nextX = action.payload.pos.x + 1;
    const nextY = action.payload.pos.y + 1;

    // Default geser ke kanan, rambahan tetap, sisi tetap
    let targetSide = action.payload.side;
    let targetY = action.payload.pos.y;
    let targetX = nextX;

    if (nextX >= state.size.x && nextY >= state.size.y) {
      // Di pojok kanan bawah, masing-masing sisi
      targetSide = targetSide === 0 ? 1 : 0; // switch side
      targetX = 0;
      targetY = 0;
    } else if (nextX >= state.size.x && nextY < state.size.y) {
      // Udah di pojok kanan, tapi masih ada rambahan di bawahnya
      targetX = 0;
      targetY = nextY;
    }

    return {
      ...state,
      side: targetSide,
      pos: { y: targetY, x: targetX },
    };
  }

  return state;
}

export { InputSwitcherProvider, useInputSwitcher };
