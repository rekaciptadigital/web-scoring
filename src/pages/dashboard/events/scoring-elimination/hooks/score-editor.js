import * as React from "react";

const defaultEditorState = {
  selectedMemberId: null,
  editorValue: null,
};

function useScoreEditor(scoringMembers, searchQuery) {
  const [state, dispatch] = React.useReducer(editorReducer, defaultEditorState);
  const { selectedMemberId } = state;

  // di-memo jaga-jaga kalau row-nya banyak & rerendernya juga banyak
  const activeRow = React.useMemo(() => {
    if (!scoringMembers || !selectedMemberId) {
      return null;
    }
    return scoringMembers.find((row) => row.member.id === selectedMemberId);
  }, [scoringMembers, selectedMemberId]);

  const isEditorOpen = activeRow !== null;

  React.useEffect(() => {
    if (!isEditorOpen) {
      return;
    }
    closeEditor();
  }, [searchQuery]);

  const checkIsRowActive = (memberId) => activeRow?.member?.id === memberId;

  const selectRow = (rowMemberId) => {
    dispatch({ type: "SELECT_ROW", payload: rowMemberId });
  };

  const closeEditor = () => dispatch({ type: "CLOSED" });

  const updateEditorValue = (value) => {
    dispatch({ type: "UPDATE_EDITOR_VALUE", payload: value });
  };

  return {
    ...state,
    isEditorOpen,
    activeRow,
    checkIsRowActive,
    selectRow,
    closeEditor,
    updateEditorValue,
  };
}

function editorReducer(state, action) {
  switch (action.type) {
    case "CLOSED": {
      return defaultEditorState;
    }

    case "SELECT_ROW": {
      return { ...defaultEditorState, selectedMemberId: action.payload };
    }

    case "UPDATE_SELECTED_ROW": {
      return { ...state, selectedMemberId: action.payload };
    }

    case "UPDATE_EDITOR_VALUE": {
      return { ...state, editorValue: action.payload };
    }

    default: {
      return state;
    }
  }
}

export { useScoreEditor };
