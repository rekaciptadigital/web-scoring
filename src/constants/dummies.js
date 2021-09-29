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

const competitionCategories = [
  {
    id: "1",
    ageCategoryId: "U-12",
    ageCategoryLabel: "U-12",
    competitionCategoryId: "Standard Bow",    
    competitionCategoryLabel: "Standard Bow",
    teamCategoryId: "team",
    teamCategoryLabel: "team",
    distanceId: "20",
    distanceLabel: "20m",
    label: "Standard Bow - U12 - 20m"
  },
  {
    id: "2",
    ageCategoryId: "U-12",
    ageCategoryLabel: "U-12",
    competitionCategoryId: "Barebow",
    competitionCategoryLabel: "Barebow",
    teamCategoryId: "team",
    teamCategoryLabel: "team",
    distanceId: "50",
    distanceLabel: "50m",
    label: "Barebow - U12 - 50m"
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

const result = [
  {"id": 1, "name": "Asep", "code": "INDIV", "club": "INDIVIDU", "sum": 5, "total": 5, "x": 6, "x_10": "122cm"},
  {"id": 2, "name": "Laisa", "code": "PERTAC", "club": "Pertamina", "sum": 5, "total": 5, "x": 3, "x_10": "122cm"},
  {"id": 3, "name": "Jamal", "code": "FAST", "club": "Focus Archery", "sum": 5, "total": 5, "x": 6, "x_10": "122cm"},
]

const editResult = [
  {"id": 1, "shoot": [0, 0, 0, 0, 0, 0], "sum": 5, "x": 6, "x_10": 5},
  {"id": 2, "shoot": [8, 8, 0, 0, 0, 10], "sum": 5, "x": 3, "x_10": 5},
  {"id": 3, "shoot": [0, 0, 0, 0, 0, 0], "sum": 5, "x": 6, "x_10": 5},
  {"id": 4, "shoot": [0, 0, 0, 0, 0, 0], "sum": 5, "x": 6, "x_10": 5},
  {"id": 5, "shoot": [0, 0, 0, 0, 0, 0], "sum": 5, "x": 6, "x_10": 5},
  {"id": 6, "shoot": [0, 0, 0, 0, 0, 0], "sum": 5, "x": 6, "x_10": 5},
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

const displayScore = [
  {"id": 1, "pos": 1, "athlete": "Kholidin", "country-code": "FAST", "state-code": "Focus Archery Sport Team", "50m-1": "320 1", "50m-2":"327 1",
"total": 647, "10+x": 30, "x":11},
  {"id": 2, "pos": 2, "athlete": "Hari Fitriyanto", "country-code": "NFBSLP1", "state-code": "Nfbs Lembang Pro 1", "50m-1": "309 3", "50m-2":"314 2",
"total": 623, "10+x": 13, "x":4},
  {"id": 3, "pos": 3, "athlete": "Shindu Purwanto", "country-code": "NFBSLP2", "state-code": "Nfbs Lembang Pro 2", "50m-1": "304 5", "50m-2":"309 3",
"total": 613, "10+x": 14, "x":5},
  {"id": 4, "pos": 4, "athlete": "Edi Purwanto", "country-code": "NFBSLP1", "state-code": "Nfbs Lembang Pro 1", "50m-1": "310 2", "50m-2":"303 6",
"total": 613, "10+x": 13, "x":5},
  {"id": 5, "pos": 5, "athlete": "Aditya Priyantoro", "country-code": "FOCUS", "state-code": "Focus Archery Club", "50m-1": "301 7", "50m-2":"307 5",
"total": 608, "10+x": 16, "x":4},
  {"id": 6, "pos": 6, "athlete": "Upuwansyah Herman", "country-code": "NFBSLP2", "state-code": "Nfbs Lembang Pro 2", "50m-1": "301 8", "50m-2":"307 5",
"total": 608, "10+x": 10, "x":6},
]

export default {
  eventCompetitionCategories,
  eventAgeCategories,
  competitionCategories,
  eventDistances,
  eventCategories,
  members,
  category,
  scoring,
  result,
  editResult,
  categoryArchery,
  qualificationSchedule,
  displayScore,
};
