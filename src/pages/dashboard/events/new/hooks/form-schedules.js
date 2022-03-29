import * as React from "react";

function useFormSchedules() {
  const [state, dispatch] = React.useReducer(formReducer, {
    data: null,
    status: "",
    errors: {},
  });

  React.useEffect(() => {
    dispatch({ type: "INIT_FORM" });
  }, []);

  return { ...state };
}

function formReducer(state, action) {
  switch (action.type) {
    case "INIT_FORM": {
      return { ...state, data: {}, isEmpty: true };
    }
  }
}

export { useFormSchedules };
