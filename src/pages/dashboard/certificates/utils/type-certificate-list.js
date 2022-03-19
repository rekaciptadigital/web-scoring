const optionsTypeCertificate = [
  { label: "Peserta", value: 1 },
  // { label: "Peserta Eliminasi", value: 3 },
  { label: "Kualifikasi", value: 4 },
  { label: "Juara Eliminasi", value: 2 },
  { label: "Juara Beregu", value: 5 },
  { label: "Juara Beregu Campuran", value: 6 },
];

const label = {
  1: "Peserta",
  2: "Juara Eliminasi",
  // 3: "Peserta Eliminasi",
  4: "Kualifikasi",
  5: "Juara Beregu",
  6: "Juara Beregu Campuran",
};

function getCurrentTypeCertificate(typeCertificate) {
  return {
    value: typeCertificate,
    label: label[typeCertificate],
  };
}

export { optionsTypeCertificate, getCurrentTypeCertificate };
