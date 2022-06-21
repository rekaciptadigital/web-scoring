import * as React from "react";
import { useParams } from "react-router-dom";
import { IdCardService } from "services";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { toast } from "../components/processing-toast";

import { stringUtil } from "utils";
import { renderTemplateString, convertBase64 } from "../utils/index";

const EditorContext = React.createContext();

function EditorProvider({ children }) {
  const { event_id } = useParams();
  const editor = useEditorData(event_id);

  return <EditorContext.Provider value={editor}>{children}</EditorContext.Provider>;
}

function useEditor() {
  const editor = React.useContext(EditorContext);
  return editor;
}

/* ====================================== */
// hooks

const FIELD_TYPE_TEXT = "text";
// TODO: pakai nanti
// const FIELD_TYPE_BOX = "box";
const FIELD_TYPE_BOX_AVATAR = "box-avatar";
const FIELD_TYPE_BOX_QR = "box-qr";

const OR_PORTRAIT = "p";
const OR_LANDSCAPE = "l";

const A4 = "a4";
const A5 = "a5";
const A6 = "a6";

// Dalam pixel, 110 PPI
// Referensi:
// https://a-size.com/a4-paper-size/
const dimensions = {
  [A4]: {
    [OR_LANDSCAPE]: {
      width: 1287,
      height: 910,
    },
    [OR_PORTRAIT]: {
      width: 910,
      height: 1287,
    },
  },
  [A5]: {
    [OR_LANDSCAPE]: {
      width: 911,
      height: 641,
    },
    [OR_PORTRAIT]: {
      width: 641,
      height: 911,
    },
  },
  [A6]: {
    [OR_LANDSCAPE]: {
      width: 642,
      height: 454,
    },
    [OR_PORTRAIT]: {
      width: 454,
      height: 642,
    },
  },
};

const defaultEditorData = {
  paperSize: A6,
  paperOrientation: OR_PORTRAIT,
  backgroundUrl: undefined,
  backgroundPreviewUrl: undefined,
  backgroundFileRaw: undefined,
  fields: {
    player_name: {
      type: FIELD_TYPE_TEXT,
      name: "player_name",
      label: "Nama Peserta",
      isVisible: true,
      x: 88,
      y: 64,
      fontFamily: "'DejaVu Sans', sans-serif",
      fontSize: 24,
    },
    location_and_date: {
      type: FIELD_TYPE_TEXT,
      name: "location_and_date",
      label: "Tempat/Tanggal Pertandingan",
      isVisible: true,
      x: 88,
      y: 134,
      fontFamily: "'DejaVu Sans', sans-serif",
      fontSize: 24,
    },
    category: {
      type: FIELD_TYPE_TEXT,
      name: "category",
      label: "Kategori Pertandingan",
      isVisible: true,
      x: 88,
      y: 232,
      fontFamily: "'DejaVu Sans', sans-serif",
      fontSize: 24,
    },
    club_member: {
      type: FIELD_TYPE_TEXT,
      name: "club_member",
      label: "Asal Klub",
      isVisible: true,
      x: 88,
      y: 354,
      fontFamily: "'DejaVu Sans', sans-serif",
      fontSize: 24,
    },
    status_event: {
      type: FIELD_TYPE_TEXT,
      name: "status_event",
      label: "Peserta/Official",
      isVisible: true,
      x: 88,
      y: 400,
      fontFamily: "'DejaVu Sans', sans-serif",
      fontSize: 24,
    },
    photoProfile: {
      type: FIELD_TYPE_BOX_AVATAR,
      name: "photoProfile",
      label: "Foto Profil",
      isVisible: true,
      x: 88,
      y: 480,
    },
    qrCode: {
      type: FIELD_TYPE_BOX_QR,
      name: "qrCode",
      label: "QR Code",
      isVisible: true,
      x: 246,
      y: 480,
    },
  },
};

function useEditorData(event_id) {
  const { data: idCard, isLoading: isLoadingIdCard, fetchIdCard } = useIdCard(event_id);
  const [data, dispatch] = React.useReducer(editorReducer, defaultEditorData);
  const [activeObject, setActiveObject] = React.useState(null);
  const { submitIdCard, isLoading: isSubmiting } = useSubmitIdCard();

  React.useEffect(() => {
    if (!idCard?.editorData) {
      return;
    }
    dispatch({ type: "INIT", payload: _buildEditorData(idCard) });
  }, [idCard]);

  const isLoading = !idCard && isLoadingIdCard;
  const isFetching = idCard && isLoadingIdCard;
  const isSaving = isSubmiting || isFetching;
  const isDirty = Boolean(data?.isDirty);
  const isPortrait = data.paperOrientation === OR_PORTRAIT;
  const isLandscape = data.paperOrientation === OR_LANDSCAPE;

  const saveEditor = async () => {
    toast.loading("Menyimpan ID card...");
    const payload = await _prepareSaveData(data);
    submitIdCard(payload, {
      onSuccess() {
        toast.dismiss();
        toast.success("ID card berhasil disimpan");
        fetchIdCard();
      },
      onError() {
        toast.dismiss();
        toast.error("Gagal menyimpan ID card");
      },
    });
  };

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
    saveEditor,
    isSaving,
    isFetching,
    isDirty,
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

function editorReducer(state, action) {
  if (action.type === "INIT") {
    return action.payload;
  }

  if (action.type === "CHANGE_BG_IMAGE") {
    if (!action.payload) {
      return state;
    }
    const imagePreviewUrl = URL.createObjectURL(action.payload);
    return {
      ...state,
      isDirty: true,
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

    return { ...state, isDirty: true, fields: fields };
  }

  if (action.type === "CHANGE_FIELD_COORDS") {
    return {
      ...state,
      isDirty: true,
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
      isDirty: true,
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
      isDirty: true,
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
      isDirty: true,
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
      isDirty: true,
      fields: {
        ...state.fields,
        [action.name]: {
          ...state.fields[action.name],
          fontSize: action.payload,
        },
      },
    };
  }

  return { ...state, isDirty: true, ...action };
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

  const fetchIdCard = () => {
    const getFunction = () => {
      return IdCardService.getForEditor({ event_id: eventId }, abortControllerRef.current.signal);
    };
    fetcher.runAsync(getFunction, {
      transform(data) {
        if (!data) {
          return data;
        }
        return { ...data, editorData: JSON.parse(data.editorData) };
      },
    });
  };

  React.useEffect(() => {
    if (!eventId) {
      return;
    }
    fetchIdCard();
  }, [eventId]);

  return { ...fetcher, fetchIdCard };
}

function useSubmitIdCard() {
  const fetcher = useFetcher();

  const submitIdCard = (data, options) => {
    const postFunction = () => IdCardService.save(data);
    fetcher.runAsync(postFunction, options);
  };

  return { ...fetcher, submitIdCard };
}

/* ======================== */
// utils

function _buildEditorData(idCard) {
  if (!idCard?.editorData) {
    return defaultEditorData;
  }
  return {
    ...idCard.editorData,
    key: stringUtil.createRandom(),
    backgroundUrl: idCard.background,
  };
}

async function _prepareSaveData(editorFormData) {
  const editorData = {
    event_id: editorFormData.event_id,
    paperSize: editorFormData.paperSize,
    paperOrientation: editorFormData.paperOrientation,
    backgroundFileRaw: undefined,
    backgroundPreviewUrl: undefined,
    fields: editorFormData.fields,
  };

  const imageBase64ForUpload = editorFormData.backgroundFileRaw
    ? await convertBase64(editorFormData.backgroundFileRaw)
    : undefined;

  const certificateHtmlTemplate = renderTemplateString(editorData);
  const templateInBase64 = btoa(certificateHtmlTemplate);

  const payload = {
    event_id: parseInt(editorFormData.event_id),
    html_template: templateInBase64,
    background_url: imageBase64ForUpload,
    editor_data: JSON.stringify(editorData),
  };

  return payload;
}

export { EditorProvider, useEditor, OR_PORTRAIT, OR_LANDSCAPE, A4, A5, A6 };
