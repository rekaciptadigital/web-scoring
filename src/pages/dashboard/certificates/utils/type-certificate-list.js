const optionsTypeCertificate = [
  { label: "Peserta", value: 1 },
  { label: "Juara", value: 2 },
  { label: "Eliminasi", value: 3 },
];

const label = {
  1: "Peserta",
  2: "Juara",
  3: "Eliminasi",
};

function getCurrentTypeCertificate(typeCertificate) {
  return {
    value: typeCertificate,
    label: label[typeCertificate],
  };
}

export { optionsTypeCertificate, getCurrentTypeCertificate };
