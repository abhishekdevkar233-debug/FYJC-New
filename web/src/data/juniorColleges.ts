export interface JuniorCollege {
  id: string;
  choiceCode: string;
  name: string;
  address: string;
  district: string;
  taluka: string;
  stream: "Arts" | "Commerce" | "Science";
  medium: string;
  status: "Self Financed" | "Aided" | "Government";
  fees: number;
}

export const STREAM_OPTIONS = ["Arts", "Commerce", "Science"] as const;

export const MEDIUM_OPTIONS = [
  "Gujarati",
  "Marathi",
  "Kannada",
  "Urdu",
  "English",
  "Hindi",
];

export const DISTRICT_OPTIONS = [
  "Pune",
  "Sindhudurg",
  "Buldhana",
  "Nanded",
  "Thane",
  "Nashik",
  "Yavatmal",
  "Amravati",
  "Bhandara",
  "Parbhani",
  "Mumbai City/Suburban",
];

const CURATED_COLLEGES: JuniorCollege[] = [
  {
    id: "PN8430SFE",
    choiceCode: "PN8430SFE",
    name: "ASM Commerce Science And Information Technology Junior College Chinchwad",
    address: "ABC / STP Building, Purnanagar Complex Chikhali Road Chinchwad Pune",
    district: "Pune",
    taluka: "Akurdi (272520)",
    stream: "Science",
    medium: "English",
    status: "Self Financed",
    fees: 12500,
  },
  {
    id: "KO12579SFE",
    choiceCode: "KO12579SFE",
    name: "Bal Shivaji English Medium School & Junior College, Kankavli",
    address: "At Post Janavli, Apratim Nagar, Sapale Baug, Janavli",
    district: "Sindhudurg",
    taluka: "Kankavli (273303)",
    stream: "Science",
    medium: "English",
    status: "Self Financed",
    fees: 8200,
  },
  {
    id: "AM00951SFE",
    choiceCode: "AM00951SFE",
    name: "Bapumiya Sirajoddin Patel Vidyalaya, Nandura",
    address: "Siddhivinayak Nagar, Behind Police Quarters, Nandura, Dist. Buldhana",
    district: "Buldhana",
    taluka: "Nandura (270410)",
    stream: "Science",
    medium: "English",
    status: "Self Financed",
    fees: 4100,
  },
  {
    id: "LA4095SPM",
    choiceCode: "LA4095SPM",
    name: "Sant Fulaji Baba Art and Sci Jr College Umri (BA)",
    address: "Sarkhani Road Umari (BA) TQ Kinwat Dist. Nanded",
    district: "Nanded",
    taluka: "Kinwat (271515)",
    stream: "Science",
    medium: "Marathi",
    status: "Self Financed",
    fees: 0,
  },
  {
    id: "PN12560SFE",
    choiceCode: "PN12560SFE",
    name: "Sri Balaji High School & Junior College",
    address: "Gat No 147/148, Tamhanewasti, Near Tuljabhavani Temple, Towerline, Talawade",
    district: "Pune",
    taluka: "Akurdi (272520)",
    stream: "Science",
    medium: "English",
    status: "Self Financed",
    fees: 15600,
  },
  {
    id: "MU6618SFE",
    choiceCode: "MU6618SFE",
    name: "(SES) S.H.M Junior College of Arts Commerce and Science",
    address: "Netaji Chowk, Opp. Bank of Baroda, Ulhasnagar 4",
    district: "Thane",
    taluka: "Ulhasnagar-URC1 (272116)",
    stream: "Science",
    medium: "English",
    status: "Self Financed",
    fees: 9800,
  },
  {
    id: "NK6039SFE",
    choiceCode: "NK6039SFE",
    name: "M.V.P. Samaj's Horizon Academy",
    address: "Udoji Maratha Boarding, Campus, Pumping Station, Near Chintamani Karaylay",
    district: "Nashik",
    taluka: "Nashik (272009)",
    stream: "Science",
    medium: "English",
    status: "Self Financed",
    fees: 22000,
  },
  {
    id: "AM3765SFE",
    choiceCode: "AM3765SFE",
    name: "A B Thakur High School",
    address: "Lohara, A.B Thakur Junior College Yavatmal",
    district: "Yavatmal",
    taluka: "Yavatmal (271415)",
    stream: "Science",
    medium: "English",
    status: "Self Financed",
    fees: 5300,
  },
  {
    id: "AM00680SFE",
    choiceCode: "AM00680SFE",
    name: "A P J Abdul Kalam School of Scholar Dhad",
    address: "Borkhed Road at Post Dhad TQ Dist. Buldhana",
    district: "Buldhana",
    taluka: "Buldana (270401)",
    stream: "Science",
    medium: "English",
    status: "Self Financed",
    fees: 9090,
  },
  {
    id: "AM1524SFU",
    choiceCode: "AM1524SFU",
    name: "A P J Abdul Kalam Urdu Jr College Achalpur",
    address: "Begumpura, Achalpur",
    district: "Amravati",
    taluka: "Achalpur (270701)",
    stream: "Science",
    medium: "Urdu",
    status: "Self Financed",
    fees: 0,
  },
  {
    id: "MU6609SFE",
    choiceCode: "MU6609SFE",
    name: "St. Paul Convent School and Junior College, Ulhasnagar",
    address: "Near Ganpati Mandir, Ashelepada Behind VTC Ground",
    district: "Thane",
    taluka: "Ambernath (272115)",
    stream: "Science",
    medium: "English",
    status: "Self Financed",
    fees: 5200,
  },
  {
    id: "PN12536SFE",
    choiceCode: "PN12536SFE",
    name: "Champions Junior College",
    address: "Survey Number 14/2, Plot Number 11/12 Shinde Complex Bavdhan Khurd",
    district: "Pune",
    taluka: "Aundh (272514)",
    stream: "Science",
    medium: "English",
    status: "Self Financed",
    fees: 30000,
  },
  {
    id: "PN12648SFE",
    choiceCode: "PN12648SFE",
    name: "Wonderland English Medium Junior College",
    address: "Sr. No 65, Indiranagar, Handewadi Road, Hadapsar, Dist. Pune",
    district: "Pune",
    taluka: "Hadapsar (272517)",
    stream: "Science",
    medium: "English",
    status: "Self Financed",
    fees: 40000,
  },
  {
    id: "NG2697SFE",
    choiceCode: "NG2697SFE",
    name: "Oxford English School Lakhandur",
    address: "At Post Ta Lakhandur",
    district: "Bhandara",
    taluka: "Lakhandur (271006)",
    stream: "Science",
    medium: "English",
    status: "Self Financed",
    fees: 0,
  },
  {
    id: "AU4486SFU",
    choiceCode: "AU4486SFU",
    name: "(Bharat Ratna) Khan Abdul Gaffar Khan Urdu High School and Jr College",
    address: "Durrani Educational Campus Pohe Takli Road Pathri",
    district: "Parbhani",
    taluka: "Pathri (271706)",
    stream: "Science",
    medium: "Urdu",
    status: "Self Financed",
    fees: 0,
  },
  {
    id: "NK12550SFE",
    choiceCode: "NK12550SFE",
    name: "Dnyandeep English Medium School and Junior College Mhalsakore",
    address: "Dnyandeep English Medium School and Junior College Mhalsakore Tal Niphad Dist Nashik",
    district: "Nashik",
    taluka: "Niphad (272010)",
    stream: "Science",
    medium: "English",
    status: "Self Financed",
    fees: 10000,
  },
  {
    id: "MU6873SGE",
    choiceCode: "MU6873SGE",
    name: "National Sarvodaya Jr College of Commerce and Science",
    address: "Plot No 112/113 Ganga Vidya Mandir, Dr C.G Road, Near Golf Club, Chembur Colony",
    district: "Mumbai City/Suburban",
    taluka: "Mumbai_DYD_URC3 (Ghatkopar) (272303)",
    stream: "Science",
    medium: "English",
    status: "Aided",
    fees: 370,
  },
  {
    id: "AM1533SFE",
    choiceCode: "AM1533SFE",
    name: "A D Convent Walgaon",
    address: "Main Road Chandur Bazar Road Bazarpura Near Water Tank",
    district: "Amravati",
    taluka: "Amravati (270702)",
    stream: "Science",
    medium: "English",
    status: "Self Financed",
    fees: 9090,
  },
  {
    id: "AM1572SFU",
    choiceCode: "AM1572SFU",
    name: "A H Urdu High School, Kholapur",
    address: "Mominpura Kholapur TQ Bhatkuli Dist Amravati",
    district: "Amravati",
    taluka: "Bhatkuli (270704)",
    stream: "Science",
    medium: "Urdu",
    status: "Self Financed",
    fees: 7024,
  },
  {
    id: "MU6343SFE",
    choiceCode: "MU6343SFE",
    name: "A P College of Commerce and Science",
    address: "Patel Complex, Miragon, Mira Road",
    district: "Thane",
    taluka: "Mira Bhayandar (272107)",
    stream: "Science",
    medium: "English",
    status: "Self Financed",
    fees: 14900,
  },
  {
    id: "PN9021ASE",
    choiceCode: "PN9021ASE",
    name: "Modern Arts & Commerce Junior College",
    address: "Near Deccan Gymkhana, Shivajinagar",
    district: "Pune",
    taluka: "Shivajinagar (271402)",
    stream: "Arts",
    medium: "English",
    status: "Self Financed",
    fees: 6800,
  },
  {
    id: "PN9032CME",
    choiceCode: "PN9032CME",
    name: "Deccan Commerce Junior College",
    address: "FC Road, Deccan Gymkhana",
    district: "Pune",
    taluka: "Shivajinagar (271402)",
    stream: "Commerce",
    medium: "English",
    status: "Aided",
    fees: 3200,
  },
  {
    id: "TH7788CME",
    choiceCode: "TH7788CME",
    name: "Thane Commerce & Science Junior College",
    address: "Near Talao Pali, Naupada",
    district: "Thane",
    taluka: "Thane (272101)",
    stream: "Commerce",
    medium: "Marathi",
    status: "Government",
    fees: 1500,
  },
  {
    id: "NS4471ASE",
    choiceCode: "NS4471ASE",
    name: "Nashik Arts & Science Junior College",
    address: "College Road, Nashik",
    district: "Nashik",
    taluka: "Nashik (272009)",
    stream: "Arts",
    medium: "Marathi",
    status: "Aided",
    fees: 2100,
  },
];

// Ensures every Stream + Medium combination the student can pick on Step 1
// has enough Junior Colleges to search & choose from.
const MIN_PER_COMBINATION = 14;
const STATUS_CYCLE: JuniorCollege["status"][] = ["Self Financed", "Aided", "Government"];
const NAME_TEMPLATES = [
  "{district} {stream} Junior College",
  "New Horizon {stream} Junior College, {district}",
  "{district} Vidyalaya Junior College ({stream})",
  "Shree Ganesh Junior College of {stream}, {district}",
  "Sunrise {medium} Medium Junior College, {district}",
  "{district} Model Junior College ({stream})",
  "{medium} Medium Junior College of {stream}, {district}",
];

function buildGeneratedColleges(): JuniorCollege[] {
  const generated: JuniorCollege[] = [];
  for (const stream of STREAM_OPTIONS) {
    for (const medium of MEDIUM_OPTIONS) {
      const existingCount = CURATED_COLLEGES.filter(
        (c) => c.stream === stream && c.medium === medium,
      ).length;
      const needed = Math.max(0, MIN_PER_COMBINATION - existingCount);
      for (let i = 0; i < needed; i++) {
        const district = DISTRICT_OPTIONS[i % DISTRICT_OPTIONS.length];
        const template = NAME_TEMPLATES[i % NAME_TEMPLATES.length];
        const name = template
          .replaceAll("{district}", district)
          .replaceAll("{stream}", stream)
          .replaceAll("{medium}", medium);
        const code = `${stream.slice(0, 1)}${medium.slice(0, 2)}${String(i + 1).padStart(2, "0")}G`.toUpperCase();
        generated.push({
          id: code,
          choiceCode: code,
          name,
          address: `${district} Education Campus, Near Main Road, ${district}`,
          district,
          taluka: `${district} Taluka`,
          stream,
          medium,
          status: STATUS_CYCLE[i % STATUS_CYCLE.length],
          fees: (i % 6) * 2500 + (medium === "English" ? 5000 : 1500),
        });
      }
    }
  }
  return generated;
}

export const JUNIOR_COLLEGES: JuniorCollege[] = [
  ...CURATED_COLLEGES,
  ...buildGeneratedColleges(),
];
