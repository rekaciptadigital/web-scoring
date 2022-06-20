import * as React from "react";
import { useParams } from "react-router-dom";
import { IdCardService } from "services";
import { useFetcher } from "utils/hooks/alt-fetcher";

const FIELD_TYPE_TEXT = "text";
const FIELD_TYPE_BOX = "box";

const LABEL_MEMBER_NAME = "member_name";
const LABEL_CATEGORY_NAME = "category_name";
const LABEL_RANK = "ranked";

const DEJAVU_SANS = "'DejaVu Sans', sans-serif";

const OR_PORTRAIT = "p";
const OR_LANDSCAPE = "l";

const A4 = "a4";
const A5 = "a5";
const A6 = "a6";

// Dalam pixel, 150 PPI
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
  paperSize: A4,
  paperOrientation: OR_PORTRAIT,
  backgroundUrl: undefined,
  backgroundPreviewUrl: undefined,
  backgroundFileRaw: undefined,
  fields: {
    [LABEL_MEMBER_NAME]: {
      type: FIELD_TYPE_TEXT,
      name: LABEL_MEMBER_NAME,
      isVisible: true,
      x: 640,
      y: 280,
      fontFamily: DEJAVU_SANS,
      fontSize: 60,
    },
    [LABEL_RANK]: {
      type: FIELD_TYPE_TEXT,
      name: LABEL_RANK,
      isVisible: true,
      x: 640,
      y: 370,
      fontFamily: DEJAVU_SANS,
      fontSize: 36,
    },
    [LABEL_CATEGORY_NAME]: {
      type: FIELD_TYPE_TEXT,
      name: LABEL_CATEGORY_NAME,
      isVisible: true,
      x: 640,
      y: 430,
      fontFamily: DEJAVU_SANS,
      fontSize: 36,
    },
  },
};

const EditorContext = React.createContext();

function editorReducer(state, action) {
  if (action.type === "CHANGE_BG_IMAGE") {
    if (!action.payload) {
      return state;
    }
    const imagePreviewUrl = URL.createObjectURL(action.payload);
    return {
      ...state,
      backgroundPreviewUrl: imagePreviewUrl,
      backgroundFileRaw: action.payload,
    };
  }

  if (action.type === "CHANGE_VISIBLE_FIELDS") {
    // Data dari select
    const visibleNames = action.payload?.length ? action.payload : [];
    const visiblesByName = visibleNames.reduce(
      (visibles, name) => ({ ...visibles, [name]: true }),
      {}
    );

    // Data dari state yang existing
    const names = Object.keys(state.fields);
    const fields = names.reduce((fields, name) => {
      return {
        ...fields,
        [name]: { ...state.fields[name], isVisible: Boolean(visiblesByName[name]) },
      };
    }, {});

    return { ...state, fields: fields };
  }

  if (action.type === "CHANGE_FIELD_COORDS") {
    return {
      ...state,
      fields: {
        ...state.fields,
        [action.name]: {
          ...state.fields[action.name],
          x: Math.ceil(action.payload.x),
          y: Math.ceil(action.payload.y),
        },
      },
    };
  }

  if (action.type === "TOGGLE_FIELD_TEXT_BOLD") {
    return {
      ...state,
      fields: {
        ...state.fields,
        [action.name]: {
          ...state.fields[action.name],
          isBold: !state.fields[action.name].isBold,
        },
      },
    };
  }

  if (action.type === "CHANGE_FIELD_TEXT_FONT_FAMILY") {
    return {
      ...state,
      fields: {
        ...state.fields,
        [action.name]: {
          ...state.fields[action.name],
          fontFamily: action.payload,
        },
      },
    };
  }

  if (action.type === "CHANGE_FIELD_TEXT_COLOR") {
    return {
      ...state,
      fields: {
        ...state.fields,
        [action.name]: {
          ...state.fields[action.name],
          color: action.payload,
        },
      },
    };
  }

  if (action.type === "CHANGE_FIELD_TEXT_FONT_SIZE") {
    return {
      ...state,
      fields: {
        ...state.fields,
        [action.name]: {
          ...state.fields[action.name],
          fontSize: action.payload,
        },
      },
    };
  }

  return { ...state, ...action };
}

function useEditorData(event_id) {
  const { data: idCard, isLoading } = useIdCard(event_id);
  const [data, dispatch] = React.useReducer(editorReducer, defaultEditorData);
  const [activeObject, setActiveObject] = React.useState(null);

  React.useEffect(() => {
    if (!idCard?.editorData) {
      return;
    }
    dispatch({
      ...defaultEditorData,
      // Merge data dari server
      // TODO: hapus mock, pakai data asli server
      ...(mockServerEditorData || idCard.editorData),
    });
  }, [idCard]);

  const isPortrait = data.paperOrientation === OR_PORTRAIT;
  const isLandscape = data.paperOrientation === OR_LANDSCAPE;

  const setOrientation = (value) => dispatch({ paperOrientation: value });

  const setPaperSize = (value) => dispatch({ paperSize: value });

  const getPaperDimensions = () => dimensions[data.paperSize][data.paperOrientation];

  const getBgImage = () => data?.backgroundPreviewUrl || data?.backgroundUrl;

  const setBgImage = (rawData) => dispatch({ type: "CHANGE_BG_IMAGE", payload: rawData });

  const visibleFieldNames = React.useMemo(() => {
    if (!data?.fields) {
      return [];
    }
    const values = Object.values(data.fields)
      .filter((field) => field.isVisible)
      .map((field) => field.name);
    return values;
  }, [data?.fields]);

  const visibleFields = React.useMemo(() => {
    if (!data?.fields) {
      return [];
    }
    const values = Object.values(data.fields).filter((field) => field.isVisible);
    return values;
  }, [data?.fields]);

  const setVisibleFields = (names) => dispatch({ type: "CHANGE_VISIBLE_FIELDS", payload: names });

  const setFieldPosition = (name, coords) => {
    dispatch({ type: "CHANGE_FIELD_COORDS", name: name, payload: coords });
  };

  const setFieldTextFontFamily = (name, value) => {
    dispatch({ type: "CHANGE_FIELD_TEXT_FONT_FAMILY", name: name, payload: value });
  };

  const setFieldTextFontSize = (name, value) => {
    dispatch({ type: "CHANGE_FIELD_TEXT_FONT_SIZE", name: name, payload: value });
  };

  const setFieldTextColor = (name, value) => {
    dispatch({ type: "CHANGE_FIELD_TEXT_COLOR", name: name, payload: value });
  };

  const toggleFieldTextBold = (name) => {
    dispatch({ type: "TOGGLE_FIELD_TEXT_BOLD", name: name });
  };

  return {
    isLoading,
    data,
    isPortrait,
    isLandscape,
    setOrientation,
    setPaperSize,
    getPaperDimensions,
    getBgImage,
    setBgImage,
    visibleFields,
    visibleFieldNames,
    setVisibleFields,
    activeObject,
    setActiveObject,
    setFieldPosition,
    setFieldTextFontFamily,
    setFieldTextFontSize,
    setFieldTextColor,
    toggleFieldTextBold,
  };
}

function EditorProvider({ children }) {
  const { event_id } = useParams();
  const editor = useEditorData(event_id);

  return <EditorContext.Provider value={editor}>{children}</EditorContext.Provider>;
}

/* ==================================== */

function useEditor() {
  const editor = React.useContext(EditorContext);
  return editor;
}

function useIdCard(eventId) {
  const fetcher = useFetcher();

  const abortControllerRef = React.useRef(null);

  React.useEffect(() => {
    abortControllerRef.current = new AbortController();
    return () => {
      abortControllerRef.current.abort();
    };
  }, []);

  React.useEffect(() => {
    const getFunction = () => {
      return IdCardService.getForEditor({ event_id: eventId }, abortControllerRef.current.signal);
    };
    fetcher.runAsync(getFunction, {
      transform(data) {
        return { ...data, editorData: JSON.parse(data.editorData) };
      },
    });
  }, [eventId]);

  return { ...fetcher };
}

export { EditorProvider, useEditor, OR_PORTRAIT, OR_LANDSCAPE, A4, A5, A6 };

// TODO: hapus mock
const mockServerEditorData = {
  backgroundUrl:
    "https://api-staging.myarchery.id/asset/background_id_card/background_id_card_22.png#1655287468",
  fields: {
    player_name: {
      type: FIELD_TYPE_TEXT,
      name: "player_name",
      label: "Nama Peserta",
      isVisible: true,
      x: 174,
      y: 64,
      fontFamily: "'DejaVu Sans', sans-serif",
      fontSize: 45,
    },
    location_and_date: {
      type: FIELD_TYPE_TEXT,
      name: "location_and_date",
      label: "Tempat/Tanggal Tanding",
      isVisible: true,
      x: 214,
      y: 154,
      fontFamily: "'DejaVu Sans', sans-serif",
      fontSize: 36,
    },
    category: {
      type: FIELD_TYPE_TEXT,
      name: "category",
      label: "Ketegori Tanding",
      isVisible: true,
      x: 252,
      y: 248,
      fontFamily: "'DejaVu Sans', sans-serif",
      fontSize: 36,
    },
    club_member: {
      type: FIELD_TYPE_TEXT,
      name: "club_member",
      label: "Asal Klub",
      isVisible: true,
      x: 324,
      y: 328,
      fontFamily: "'DejaVu Sans', sans-serif",
      fontSize: 36,
    },
    status_event: {
      type: FIELD_TYPE_TEXT,
      name: "status_event",
      label: "Peserta/Official",
      isVisible: true,
      x: 272,
      y: 436,
      fontFamily: "'DejaVu Sans', sans-serif",
      fontSize: 36,
    },
    photoProfile: {
      type: FIELD_TYPE_BOX,
      name: "photoProfile",
      label: "Foto Profil",
      isVisible: true,
      x: 30,
      y: 250,
    },
    qrCode: {
      type: FIELD_TYPE_BOX,
      name: "qrCode",
      label: "QR Code",
      isVisible: true,
      x: 0,
      y: 650,
    },
  },
  event_id: 22,
};
