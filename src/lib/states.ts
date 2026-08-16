// भारत के राज्य/केंद्र शासित प्रदेश — /rajya page + newsroom state dropdown.
// `major` states render first (population-ranked, मध्य प्रदेश pinned to the
// top — paper's home state). Landmark images are hotlinked from Wikimedia
// Commons via the stable Special:FilePath redirect (no hash-guessing);
// each filename was verified live before being added here.
export type StateInfo = {
  slug: string;
  name: string;
  landmark: string;
  image: string;
  cities: string[];
  major: boolean;
};

export const states: StateInfo[] = [
  // -- प्रमुख राज्य (major, population-ranked, मध्य प्रदेश first) --
  {
    slug: "madhya-pradesh",
    name: "मध्य प्रदेश",
    landmark: "साँची स्तूप",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/File:Sanchi3.jpg",
    cities: ["इंदौर", "भोपाल", "ग्वालियर", "जबलपुर", "उज्जैन"],
    major: true,
  },
  {
    slug: "uttar-pradesh",
    name: "उत्तर प्रदेश",
    landmark: "ताज महल",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/File:Taj_Mahal_in_March_2004.jpg",
    cities: ["लखनऊ", "कानपुर", "वाराणसी", "आगरा"],
    major: true,
  },
  {
    slug: "maharashtra",
    name: "महाराष्ट्र",
    landmark: "गेटवे ऑफ इंडिया",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/File:Gateway%20of%20India,%20Mumbai.jpg",
    cities: ["मुंबई", "पुणे", "नागपुर", "नाशिक"],
    major: true,
  },
  {
    slug: "bihar",
    name: "बिहार",
    landmark: "महाबोधि मंदिर",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/File:Mahabodhi_Temple.jpg",
    cities: ["पटना", "गया", "भागलपुर", "मुजफ्फरपुर"],
    major: true,
  },
  {
    slug: "west-bengal",
    name: "पश्चिम बंगाल",
    landmark: "विक्टोरिया मेमोरियल",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/File:Victoria_Memorial_Kolkata.jpg",
    cities: ["कोलकाता", "हावड़ा", "सिलीगुड़ी", "दुर्गापुर"],
    major: true,
  },
  {
    slug: "rajasthan",
    name: "राजस्थान",
    landmark: "हवा महल",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/File:Hawa_Mahal_2011.jpg",
    cities: ["जयपुर", "जोधपुर", "उदयपुर", "कोटा"],
    major: true,
  },
  {
    slug: "tamil-nadu",
    name: "तमिलनाडु",
    landmark: "मीनाक्षी मंदिर",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/File:Meenakshi%20Amman%20Temple,%20Madurai.jpg",
    cities: ["चेन्नई", "कोयंबटूर", "मदुरै", "तिरुचिरापल्ली"],
    major: true,
  },
  {
    slug: "karnataka",
    name: "कर्नाटक",
    landmark: "मैसूर पैलेस",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/File:Mysore_Palace.jpg",
    cities: ["बेंगलुरु", "मैसूर", "हुबली", "मंगलुरु"],
    major: true,
  },
  {
    slug: "gujarat",
    name: "गुजरात",
    landmark: "स्टैच्यू ऑफ यूनिटी",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/File:Statue%20of%20Unity.jpg",
    cities: ["अहमदाबाद", "सूरत", "वडोदरा", "राजकोट"],
    major: true,
  },
  {
    slug: "andhra-pradesh",
    name: "आंध्र प्रदेश",
    landmark: "तिरुपति बालाजी मंदिर",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/File:Tirupati%20Balaji%20Temple.jpg",
    cities: ["विशाखापत्तनम", "विजयवाड़ा", "गुंटूर", "तिरुपति"],
    major: true,
  },
  {
    slug: "telangana",
    name: "तेलंगाना",
    landmark: "चारमीनार",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/File:Charminar-Pride%20of%20Hyderabad.jpg",
    cities: ["हैदराबाद", "वारंगल", "निजामाबाद", "करीमनगर"],
    major: true,
  },
  {
    slug: "kerala",
    name: "केरल",
    landmark: "केरल बैकवाटर्स",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/File:Kerala%20backwaters.jpg",
    cities: ["तिरुवनंतपुरम", "कोच्चि", "कोझिकोड", "अलाप्पुझा"],
    major: true,
  },
  {
    slug: "odisha",
    name: "ओडिशा",
    landmark: "कोणार्क सूर्य मंदिर",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/File:Konark%20Sun%20Temple.jpg",
    cities: ["भुवनेश्वर", "कटक", "पुरी", "राउरकेला"],
    major: true,
  },
  {
    slug: "delhi",
    name: "दिल्ली",
    landmark: "लाल किला",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/File:Red_Fort_Delhi.jpg",
    cities: ["नई दिल्ली", "द्वारका", "रोहिणी"],
    major: true,
  },

  // -- अन्य राज्य व केंद्र शासित प्रदेश (smaller states + UTs) --
  {
    slug: "jharkhand",
    name: "झारखंड",
    landmark: "जगन्नाथ मंदिर, राँची",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/File:Jagannath%20Temple,%20Ranchi.jpg",
    cities: ["राँची", "जमशेदपुर", "धनबाद", "देवघर"],
    major: false,
  },
  {
    slug: "assam",
    name: "असम",
    landmark: "कामाख्या मंदिर",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/File:Kamakhya%20Temple.jpg",
    cities: ["गुवाहाटी", "डिब्रूगढ़", "सिलचर", "जोरहाट"],
    major: false,
  },
  {
    slug: "punjab",
    name: "पंजाब",
    landmark: "स्वर्ण मंदिर",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/File:Golden%20Temple,%20Amritsar.jpg",
    cities: ["अमृतसर", "लुधियाना", "जालंधर", "पटियाला"],
    major: false,
  },
  {
    slug: "chhattisgarh",
    name: "छत्तीसगढ़",
    landmark: "चित्रकोट जलप्रपात",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/File:Chitrakote%20Falls,%20Chhattisgarh.jpg",
    cities: ["रायपुर", "बिलासपुर", "दुर्ग", "जगदलपुर"],
    major: false,
  },
  {
    slug: "haryana",
    name: "हरियाणा",
    landmark: "ब्रह्म सरोवर, कुरुक्षेत्र",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/File:Brahma%20Sarovar,%20Kurukshetra.jpg",
    cities: ["गुरुग्राम", "फरीदाबाद", "कुरुक्षेत्र", "पानीपत"],
    major: false,
  },
  {
    slug: "uttarakhand",
    name: "उत्तराखंड",
    landmark: "केदारनाथ मंदिर",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/File:Kedarnath%20Temple.jpg",
    cities: ["देहरादून", "हरिद्वार", "नैनीताल", "ऋषिकेश"],
    major: false,
  },
  {
    slug: "himachal-pradesh",
    name: "हिमाचल प्रदेश",
    landmark: "हिडिम्बा देवी मंदिर",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/File:Hidimba%20Devi%20Temple.jpg",
    cities: ["शिमला", "मनाली", "धर्मशाला", "कुल्लू"],
    major: false,
  },
  {
    slug: "tripura",
    name: "त्रिपुरा",
    landmark: "उज्जयंता पैलेस",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/File:Ujjayanta_Palace.jpg",
    cities: ["अगरतला", "उदयपुर", "धर्मनगर"],
    major: false,
  },
  {
    slug: "meghalaya",
    name: "मेघालय",
    landmark: "उमियम झील",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/File:Umiam_Lake.jpg",
    cities: ["शिलांग", "चेरापूंजी", "तुरा"],
    major: false,
  },
  {
    slug: "manipur",
    name: "मणिपुर",
    landmark: "लोकतक झील",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/File:Loktak_lake.jpg",
    cities: ["इंफाल", "थौबल", "चुराचांदपुर"],
    major: false,
  },
  {
    slug: "nagaland",
    name: "नागालैंड",
    landmark: "कोहिमा युद्ध कब्रिस्तान",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/File:Kohima_War_Cemetery,_Nagaland.jpg",
    cities: ["कोहिमा", "दीमापुर", "मोकोकचुंग"],
    major: false,
  },
  {
    slug: "goa",
    name: "गोवा",
    landmark: "बॉम जीसस बेसिलिका",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/File:Bom_Jesus_Basilica.jpg",
    cities: ["पणजी", "मडगांव", "वास्को द गामा"],
    major: false,
  },
  {
    slug: "arunachal-pradesh",
    name: "अरुणाचल प्रदेश",
    landmark: "तवांग मठ",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/File:Tawang_Monastery,_Arunachal_Pradesh.jpg",
    cities: ["ईटानगर", "तवांग", "पासीघाट"],
    major: false,
  },
  {
    slug: "mizoram",
    name: "मिजोरम",
    landmark: "आइज़ोल शहर",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/File:Aizawl.jpg",
    cities: ["आइज़ोल", "लुंगलेई", "चम्फाई"],
    major: false,
  },
  {
    slug: "sikkim",
    name: "सिक्किम",
    landmark: "रुमटेक मठ",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/File:Rumtek_Monastery.jpg",
    cities: ["गंगटोक", "नामची", "गेज़िंग"],
    major: false,
  },
  {
    slug: "jammu-and-kashmir",
    name: "जम्मू और कश्मीर",
    landmark: "डल झील",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/File:Dal_Lake_Srinagar.jpg",
    cities: ["श्रीनगर", "जम्मू", "अनंतनाग"],
    major: false,
  },
  {
    slug: "ladakh",
    name: "लद्दाख",
    landmark: "पैंगोंग झील",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/File:Pangong_Lake.jpg",
    cities: ["लेह", "करगिल", "नुब्रा"],
    major: false,
  },
  {
    slug: "puducherry",
    name: "पुदुचेरी",
    landmark: "पुदुचेरी समुद्र तट",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/File:Puducherry.jpg",
    cities: ["पुदुचेरी", "कराईकल", "यनम"],
    major: false,
  },
  {
    slug: "chandigarh",
    name: "चंडीगढ़",
    landmark: "रॉक गार्डन",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/File:Rock_Garden_Chandigarh.jpg",
    cities: ["चंडीगढ़"],
    major: false,
  },
  {
    slug: "andaman-and-nicobar-islands",
    name: "अंडमान और निकोबार द्वीप समूह",
    landmark: "सेल्युलर जेल",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/File:Cellular_Jail.jpg",
    cities: ["पोर्ट ब्लेयर", "हैवलॉक द्वीप", "कार निकोबार"],
    major: false,
  },
  {
    slug: "dadra-and-nagar-haveli-and-daman-and-diu",
    name: "दादरा और नगर हवेली तथा दमन और दीव",
    landmark: "दीव किला",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/File:Diu_fort.jpg",
    cities: ["दमन", "दीव", "सिलवासा"],
    major: false,
  },
  {
    slug: "lakshadweep",
    name: "लक्षद्वीप",
    landmark: "लक्षद्वीप लैगून",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/File:Lakshadweep.jpg",
    cities: ["कवरत्ती", "अगत्ती", "मिनिकॉय"],
    major: false,
  },
];

const bySlug = new Map(states.map((s) => [s.slug, s]));

export function getState(slug: string): StateInfo | undefined {
  return bySlug.get(slug);
}
