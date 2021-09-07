const eventAgeCategories = [
  {
    id: "U-12",
    label: "U-12",
  },
  {
    id: "U-15",
    label: "U-15",
  },
  {
    id: "Umum",
    label: "Umum",
  },
];

const eventCompetitionCategories = [
  {
    id: "Recurved",
    label: "Recurved",
  },
  {
    id: "Bound",
    label: "Bound",
  },
  {
    id: "Traditional",
    label: "Traditional",
  },
  {
    id: "Barebow",
    label: "Barebow",
  },
];

const eventDistances = [
  {
    id: "5",
    label: "5m",
  },
  {
    id: "10",
    label: "10m",
  },
  {
    id: "15",
    label: "15m",
  },
  {
    id: "18",
    label: "18m",
  },
  {
    id: "20",
    label: "20m",
  },
  {
    id: "30",
    label: "30m",
  },
  {
    id: "40",
    label: "40m",
  },
  {
    id: "50",
    label: "50m",
  },
];

const eventCategories = [
  {
    no: "1",
    ageCategory: "U-12",
    maxDateOfBirth: "31/12/2009",
    distance: "10m",
    quota: "0/100",
    registrationFee: "Rp100.000",
    teamCategories: "Individu; Mix team",
  },
  {
    no: "2",
    ageCategory: "U-15",
    maxDateOfBirth: "31/12/2009",
    distance: "10m",
    quota: "0/100",
    registrationFee: "Rp100.000",
    teamCategories: "Individu; Mix team",
  },
  {
    no: "3",
    ageCategory: "Umum",
    maxDateOfBirth: "31/12/2009",
    distance: "10m",
    quota: "0/100",
    registrationFee: "Rp100.000",
    teamCategories: "Individu; Mix team",
  },
];

const members = [
  {"id": 1, "name": "Asep", "email": "asep@gmail.com", "telepon": "+62 812 3456 789", "club": "Klub Macan", "age": 10, "gender": "pria", "status": 1},
  {"id": 2, "name": "Jamal", "email": "jamal@gmail.com", "telepon": "+62 812 3456 789", "club": "Klub Macan", "age": 9, "gender": "pria", "status": 1},
  {"id": 3, "name": "Taufik", "email": "taufik@gmail.com", "telepon": "+62 812 3456 789", "club": "Klub Macan", "age": 10, "gender": "pria", "status": 0},
  {"id": 4, "name": "Arif", "email": "arif@gmail.com", "telepon": "+62 812 3456 789", "club": "Klub Macan", "age": 9, "gender": "pria", "status": 1},
  {"id": 5, "name": "Laisa", "email": "laisa@gmail.com", "telepon": "+62 812 3456 789", "club": "Klub Macan", "age": 10, "gender": "wanita", "status": 1},
  {"id": 6, "name": "Wade Warren", "email": "wa-de@gmail.com", "telepon": "+62 812 3456 789", "club": "Klub Macan", "age": 9, "gender": "pria", "status": 1},
  {"id": 7, "name": "Udien", "email": "udien@gmail.com", "telepon": "+62 812 3456 789", "club": "Klub Macan", "age": 10, "gender": "pria", "status": 0},
];

const category = [
  {"id": 1, "class": "U-12", "death_bird": "12/09/2009", "arange": "50m", "kuota": "15/100", "registrasi": "Rp150.000", "status": 0},
  {"id": 2, "class": "Umum", "death_bird": "-", "arange": "30m", "kuota": "10/100", "registrasi": "Rp150.000", "status": 0},
  {"id": 3, "class": "U-12", "death_bird": "12/09/2009", "arange": "20m", "kuota": "70/75", "registrasi": "Rp150.000", "status": 1},
]

const scoring = [
  {"id": 1, "class": "U-12", "arange": "50m", "session": 2, "rambahan": 5, "shoot": 6, "target_face": "122 cm"},
  {"id": 2, "class": "Umum", "arange": "30m", "session": 2, "rambahan": 5, "shoot": 3, "target_face": "122 cm"},
  {"id": 3, "class": "U-12", "arange": "20m", "session": 2, "rambahan": 5, "shoot": 6, "target_face": "122 cm"},
]

const categoryArchery = [
  {"id": 1, "arange": "50m", "category": "Traditional Bow", "type": "Individu", "quota": "20/75"},
  {"id": 2, "arange": "50m", "type": "Mix Team; Female Team, Male Team", "category": "Individu", "quota": "20/100"},
  {"id": 3, "arange": "20m", "category": "Barebow", "type": "Individu", "quota": "0/75"},
  {"id": 4, "arange": "30m", "category": "Recurve", "type": "Mix Team; Female Team, Male Team", "quota": "20/100"},
]

const qualificationSchedule = [
  {"id": 1, "date": "23 Agustus 2021", "session": "1", "time": "10.00-11.00", "quota": "20/75"},
  {"id": 2, "date": "23 Agustus 2021", "session": "2", "time": "11.00-12.00", "quota": "20/75"},
  {"id": 3, "date": "23 Agustus 2021", "session": "3", "time": "12.00-13.00", "quota": "0/75"},
  {"id": 4, "date": "23 Agustus 2021", "session": "4", "time": "13.00-14.00", "quota": "20/100"},
]


export default {
  eventAgeCategories,
  eventCompetitionCategories,
  eventDistances,
  eventCategories,
  members,
  category,
  scoring,
  categoryArchery,
  qualificationSchedule
};
