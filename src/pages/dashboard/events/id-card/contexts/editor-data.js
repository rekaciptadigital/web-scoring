import * as React from "react";
import { useParams } from "react-router-dom";
import { IdCardService } from "services";
import { useFetcher } from "utils/hooks/alt-fetcher";
import { toast } from "../components/processing-toast";

import { idCardFields } from "constants/index";

import { stringUtil } from "utils";
import { renderTemplateString, convertBase64 } from "../utils/index";

const {
  LABEL_PLAYER_NAME,
  LABEL_GENDER,
  LABEL_LOCATION_AND_DATE,
  LABEL_CATEGORY,
  LABEL_CLUB_MEMBER,
  LABEL_STATUS_EVENT,
  LABEL_BUDREST,
  LABEL_QR_CODE,
  LABEL_AVATAR,
} = idCardFields;

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

function _getCenterXText(size, orientation) {
  const paperWidth = dimensions[size][orientation].width;
  const center = paperWidth / 2;
  const textWidth = paperWidth * (size === A6 ? 0.6 : 0.7);
  return Math.floor(center - textWidth / 2);
}

function _getCenterXAvatar(size, orientation) {
  const paperWidth = dimensions[size][orientation].width;
  const center = paperWidth / 2;
  const boxWidth = 174;
  return Math.floor(center - boxWidth / 2);
}

const defaultEditorData = {
  paperSize: A5,
  paperOrientation: OR_PORTRAIT,
  backgroundUrl: undefined,
  backgroundPreviewUrl: undefined,
  backgroundFileRaw: undefined,
  fields: {
    [LABEL_PLAYER_NAME]: {
      type: FIELD_TYPE_TEXT,
      name: LABEL_PLAYER_NAME,
      label: "Nama Peserta",
      isVisible: true,
      x: _getCenterXText(A5, OR_PORTRAIT),
      y: 269,
      fontFamily: "'DejaVu Sans', sans-serif",
      fontSize: 24,
    },
    [LABEL_GENDER]: {
      type: FIELD_TYPE_TEXT,
      name: LABEL_GENDER,
      label: "Jenis Kelamin",
      isVisible: true,
      x: _getCenterXText(A5, OR_PORTRAIT),
      y: 464,
      fontFamily: "'DejaVu Sans', sans-serif",
      fontSize: 24,
    },
    [LABEL_LOCATION_AND_DATE]: {
      type: FIELD_TYPE_TEXT,
      name: LABEL_LOCATION_AND_DATE,
      label: "Tempat/Tanggal Pertandingan",
      isVisible: true,
      x: _getCenterXText(A5, OR_PORTRAIT),
      y: 638,
      fontFamily: "'DejaVu Sans', sans-serif",
      fontSize: 24,
    },
    [LABEL_CATEGORY]: {
      type: FIELD_TYPE_TEXT,
      name: LABEL_CATEGORY,
      label: "Kategori Pertandingan",
      isVisible: true,
      x: _getCenterXText(A5, OR_PORTRAIT),
      y: 510,
      fontFamily: "'DejaVu Sans', sans-serif",
      fontSize: 24,
    },
    [LABEL_CLUB_MEMBER]: {
      type: FIELD_TYPE_TEXT,
      name: LABEL_CLUB_MEMBER,
      label: "Asal Klub",
      isVisible: true,
      x: _getCenterXText(A5, OR_PORTRAIT),
      y: 338,
      fontFamily: "'DejaVu Sans', sans-serif",
      fontSize: 24,
    },
    [LABEL_BUDREST]: {
      type: FIELD_TYPE_TEXT,
      name: LABEL_BUDREST,
      label: "Nomor Bantalan",
      isVisible: true,
      x: _getCenterXText(A5, OR_PORTRAIT),
      y: 595,
      fontFamily: "'DejaVu Sans', sans-serif",
      fontSize: 24,
    },
    [LABEL_STATUS_EVENT]: {
      type: FIELD_TYPE_TEXT,
      name: LABEL_STATUS_EVENT,
      label: "Peserta/Official",
      isVisible: true,
      x: _getCenterXText(A5, OR_PORTRAIT),
      y: 417,
      fontFamily: "'DejaVu Sans', sans-serif",
      fontSize: 24,
    },
    [LABEL_AVATAR]: {
      type: FIELD_TYPE_BOX_AVATAR,
      name: LABEL_AVATAR,
      label: "Foto Profil",
      isVisible: true,
      x: _getCenterXAvatar(A5, OR_PORTRAIT),
      y: 50,
    },
    [LABEL_QR_CODE]: {
      type: FIELD_TYPE_BOX_QR,
      name: LABEL_QR_CODE,
      label: "QR Code",
      isVisible: true,
      x: 50,
      y: 720,
    },
  },
};

function useEditorData(event_id) {
  const {
    data: idCard,
    isLoading: isLoadingIdCard,
    isError: isErrorFetching,
    errors: errorsFetching,
    fetchIdCard,
  } = useIdCard(event_id);
  const [data, dispatch] = React.useReducer(editorReducer, defaultEditorData);
  const [activeObject, setActiveObject] = React.useState(null);
  const {
    submitIdCard,
    isLoading: isSubmiting,
    isError: isErrorSubmiting,
    errors: errorsSubmiting,
  } = useSubmitIdCard();

  React.useEffect(() => {
    dispatch({ type: "INIT", payload: _buildEditorData(idCard, parseInt(event_id)) });
  }, [idCard]);

  const isLoading = !idCard && isLoadingIdCard;
  const isFetching = idCard && isLoadingIdCard;
  const isSaving = isSubmiting || isFetching;
  const isDirty = Boolean(data?.isDirty);
  const isPortrait = data.paperOrientation === OR_PORTRAIT;
  const isLandscape = data.paperOrientation === OR_LANDSCAPE;

  const saveEditor = async () => {
    toast.loading("Menyimpan ID card...");
    const config = { maxTextWidth: getConfigMaxTextWidth() };
    const payload = await _prepareSaveData(data, config);
    submitIdCard(payload, {
      onSuccess() {
        toast.dismiss();
        toast.success("ID card berhasil disimpan");
        fetchIdCard();
        setActiveObject(null);
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

  const getConfigMaxTextWidth = () => {
    const { width: paperWidth } = getPaperDimensions();
    const fraction = data.paperSize === A6 ? 0.6 : 0.7;
    const maxWidth = paperWidth * fraction;
    return Math.ceil(maxWidth);
  };

  return {
    isLoading,
    isErrorFetching,
    errorsFetching,
    data,
    saveEditor,
    isErrorSubmiting,
    errorsSubmiting,
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
    getConfigMaxTextWidth,
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

function _buildEditorData(idCard, eventId) {
  if (!idCard?.editorData) {
    return {
      key: stringUtil.createRandom(),
      event_id: eventId,
      ...defaultEditorData,
    };
  }
  return {
    key: stringUtil.createRandom(),
    event_id: eventId,
    ...idCard.editorData,
    // Tarik data background ke editor data
    backgroundUrl: idCard.background,
  };
}

async function _prepareSaveData(editorFormData, config = {}) {
  const editorData = {
    event_id: editorFormData.event_id,
    paperSize: editorFormData.paperSize,
    paperOrientation: editorFormData.paperOrientation,
    backgroundUrl: editorFormData.backgroundUrl,
    backgroundFileRaw: editorFormData.backgroundFileRaw,
    backgroundPreviewUrl: editorFormData.backgroundPreviewUrl,
    fields: _buildFields(editorFormData.fields),
  };

  const imageBase64ForUpload = editorFormData.backgroundFileRaw
    ? await convertBase64(editorFormData.backgroundFileRaw)
    : undefined;

  const idCardHtmlTemplate = renderTemplateString(editorData, config);
  const templateInBase64 = btoa(idCardHtmlTemplate);

  const payload = {
    event_id: parseInt(editorFormData.event_id),
    html_template: templateInBase64,
    background_url: imageBase64ForUpload,
    editor_data: JSON.stringify({
      ...editorData,
      backgroundUrl: undefined,
      backgroundFileRaw: undefined,
      backgroundPreviewUrl: undefined,
    }),
  };

  return payload;
}

function _buildFields(fields) {
  let updatedFields = {};
  const fieldNamesFromDefault = Object.keys(defaultEditorData.fields);

  // Ngisi data buat field yang baru ditambahkan
  for (const targetName of fieldNamesFromDefault) {
    const existingData = fields[targetName];
    updatedFields[targetName] = existingData || _getNewFieldData(fields, targetName);

    // Memastikan properti `name` selalu sama value dengan key-nya
    updatedFields[targetName].name = targetName;
  }

  return updatedFields;
}

/**
 * Untuk auto "update" data editor kalau ada permintaan
 * tambah field data baru:
 * 1. tambah baru
 * 2. "rename"
 */
function _getNewFieldData(editorDataFields, targetName) {
  // Field yang baru ditambahkan disembunyikan dulu by default
  // supaya gak mengganggu "desain" yang udah ada
  const dataFromDefault = {
    ...defaultEditorData.fields[targetName],
    isVisible: false,
  };

  // mapping nama baru dari nama lama (rename key)
  const obsoleteNames = {
    [LABEL_QR_CODE]: "qrCode",
    [LABEL_AVATAR]: "photoProfile",
  };
  const obsoleteName = obsoleteNames[targetName];
  // tambah baru (1)
  if (!obsoleteName) {
    return dataFromDefault;
  }

  // cari data yang masih pakai nama lama
  const existingData = editorDataFields[obsoleteName];
  if (!existingData) {
    delete editorDataFields[obsoleteName]; // in case namanya ada tapi gak ada datanya
    return dataFromDefault;
  }

  // "rename" (2)
  // pindahkan data lama ke nama key yang baru
  delete editorDataFields[obsoleteName];
  return existingData;
}

export { EditorProvider, useEditor, OR_PORTRAIT, OR_LANDSCAPE, A4, A5, A6 };
