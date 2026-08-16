export const PAYMENT_AMOUNT = 150;

export const APPLICATION_STEPS = [
  "Registration & Personal Details",
  "Category & Reservation",
  "Qualification Details",
  "Upload Documents",
  "Admission Fee",
  "Lock Application",
];

export const APPLICATION_STEP_VOICEOVERS: Record<"EN" | "MR", string[]> = {
  EN: [
    "Please fill the mandatory registration and applicant details.",
    "Select your category and any special reservation you're eligible for.",
    "Enter your 10th standard passing status and subject-wise marks.",
    "Upload your required documents to continue.",
    "Pay the admission fee to move ahead with your application.",
    "Review your application carefully, then lock it to submit.",
  ],
  MR: [
    "कृपया अनिवार्य नोंदणी आणि अर्जदाराचे तपशील भरा.",
    "तुमचा प्रवर्ग आणि तुम्ही पात्र असलेले विशेष आरक्षण निवडा.",
    "तुमची इयत्ता १०वीची उत्तीर्ण स्थिती आणि विषयनिहाय गुण भरा.",
    "पुढे जाण्यासाठी आवश्यक कागदपत्रे अपलोड करा.",
    "तुमचा अर्ज पुढे नेण्यासाठी प्रवेश शुल्क भरा.",
    "तुमचा अर्ज काळजीपूर्वक तपासा आणि नंतर तो सादर करण्यासाठी लॉक करा.",
  ],
};

export const RECEIPT_READY_VOICEOVER = {
  EN: "Payment done successfully. You can download or print your receipt.",
  MR: "पेमेंट यशस्वी झाले. तुम्ही तुमची पावती डाउनलोड किंवा प्रिंट करू शकता.",
};

export const APPLICATION_LOCKED_VOICEOVER = {
  EN: "Application locked successfully.",
  MR: "अर्ज यशस्वीरित्या लॉक झाला.",
};

export const PAYMENT_RESULT_VOICEOVER = {
  success: {
    EN: "Your payment is successful.",
    MR: "तुमचे पेमेंट यशस्वी झाले.",
  },
  failed: {
    EN: "Payment failed. Please try again.",
    MR: "पेमेंट अयशस्वी झाले. कृपया पुन्हा प्रयत्न करा.",
  },
};
