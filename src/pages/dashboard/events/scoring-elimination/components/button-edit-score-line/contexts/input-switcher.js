import * as React from "react";

const InputSwitcher = React.createContext();

function useInputSwitcher() {
  const switcher = React.useContext(InputSwitcher);
  return switcher;
}

function InputSwitcherProvider({ grid, children }) {
  const switcher = useSwitcher(grid);
  return <InputSwitcher.Provider value={switcher}>{children}</InputSwitcher.Provider>;
}

function useSwitcher(grid) {
  const [switcher, dispatch] = React.useReducer(reducer, {
    size: { y: 0, x: 0 },
    side: 0,
    pos: { y: 0, x: 0 },
  });

  React.useEffect(() => {
    if (!grid || switcher.size.y > 0 || switcher.size.x > 0) {
      return;
    }
    dispatch({ type: "INIT", payload: grid });
  }, [grid, switcher.size.y, switcher.size.x]);

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
    const y = action.payload.length;
    const x = action.payload[0].length;
    return { ...state, size: { y, x } };
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
