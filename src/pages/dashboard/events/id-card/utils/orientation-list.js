export const Potrait = "Potrait";
export const Landscape = "Landscape";

export const optionsOrientation = [
  { value: Potrait, label: "Potrait" },
  { value: Landscape, label: "Landscape" },
];

export const getSelectedOrientation = (optionsOrientation, fieldData) => {
  return {
    value: fieldData?.orientation,
    label: optionsOrientation.find((font) => {
      return font.value === fieldData?.orientation;
    })?.label,
  };
};
