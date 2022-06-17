import * as React from "react";

const LABEL_MEMBER_NAME = "member_name";
const LABEL_CATEGORY_NAME = "category_name";
const LABEL_RANK = "ranked";

const DEJAVU_SANS = "'DejaVu Sans', sans-serif";

const OR_PORTRAIT = "p";
const OR_LANDSCAPE = "l";

const A4 = "a4";
const A5 = "a5";
const A6 = "a6";

const dimensions = {
  [A4]: {
    [OR_LANDSCAPE]: {
      width: 1123,
      height: 794,
    },
    [OR_PORTRAIT]: {
      width: 794,
      height: 1123,
    },
  },
  [A5]: {
    [OR_LANDSCAPE]: {
      width: 794,
      height: 559,
    },
    [OR_PORTRAIT]: {
      width: 559,
      height: 794,
    },
  },
  [A6]: {
    [OR_LANDSCAPE]: {
      width: 559,
      height: 397,
    },
    [OR_PORTRAIT]: {
      width: 397,
      height: 559,
    },
  },
};

const defaultEditorData = {
  paperSize: A4, // || [1280, 908] || letter
  paperOrientation: OR_PORTRAIT,
  backgroundUrl: undefined,
  backgroundPreviewUrl: undefined,
  backgroundFileRaw: undefined,
  fields: [
    {
      name: LABEL_MEMBER_NAME,
      x: 640,
      y: 280,
      fontFamily: DEJAVU_SANS,
      fontSize: 60,
    },
    {
      name: LABEL_RANK,
      x: 640,
      y: 370,
      fontFamily: DEJAVU_SANS,
      fontSize: 36,
    },
    {
      name: LABEL_CATEGORY_NAME,
      x: 640,
      y: 430,
      fontFamily: DEJAVU_SANS,
      fontSize: 36,
    },
  ],
};

const EditorContext = React.createContext();

function editorReducer(state, action) {
  return { ...state, ...action };
}

function useEditorData() {
  // TODO: get editor data
  // ...skip sementara

  // set up state editor data
  const [data, dispatch] = React.useReducer(editorReducer, defaultEditorData);

  const isPortrait = data.paperOrientation === OR_PORTRAIT;
  const isLandscape = data.paperOrientation === OR_LANDSCAPE;

  const setOrientation = (value) => {
    dispatch({ paperOrientation: value });
  };

  const setPaperSize = (value) => {
    dispatch({ paperSize: value });
  };

  const getPaperDimensions = () => dimensions[data.paperSize][data.paperOrientation];

  return {
    data,
    isPortrait,
    isLandscape,
    setOrientation,
    setPaperSize,
    getPaperDimensions,
  };
}

function EditorProvider({ children }) {
  const editor = useEditorData();
  return <EditorContext.Provider value={editor}>{children}</EditorContext.Provider>;
}

/* ==================================== */

function useEditor() {
  const editor = React.useContext(EditorContext);
  return editor;
}

export { EditorProvider, useEditor, OR_PORTRAIT, OR_LANDSCAPE, A4, A5, A6 };
