import { createContext, useContext, useState, useEffect } from "react";
import i18n from "../i18n";

const LanguageContext = createContext();

const translations = {
  en: {
    // Navigation & Common
    home: "Home",
    categories: "Categories",
    cart: "Cart",
    account: "My Account",
    search: "Search",
    searchPlaceholder: "Search products...",
    loading: "Loading...",
    noResults: "No results found",
    viewAll: "View All",
    addToCart: "Add to Cart",
    buyNow: "Buy Now",
    remove: "Remove",
    cancel: "Cancel",
    save: "Save",
    edit: "Edit",
    delete: "Delete",
    back: "Back",
    next: "Next",
    submit: "Submit",
    yes: "Yes",
    no: "No",
    ok: "OK",
    close: "Close",
    language: "Language",
    english: "English",
    hindi: "हिन्दी",

    // Home
    allCategories: "All Categories",
    featuredProducts: "Featured Products",
    popularProducts: "Popular Products",
    newArrivals: "New Arrivals",
    shopByCategory: "Shop by Category",

    // Product
    product: "Product",
    products: "Products",
    productDetails: "Product Details",
    price: "Price",
    mrp: "MRP",
    stock: "Stock",
    inStock: "In Stock",
    outOfStock: "Out of Stock",
    quantity: "Quantity",
    description: "Description",
    category: "Category",
    unit: "Unit",

    // Cart & Checkout
    myCart: "My Cart",
    cartEmpty: "Your cart is empty",
    subtotal: "Subtotal",
    deliveryCharge: "Delivery Charge",
    total: "Total",
    checkout: "Checkout",
    placeOrder: "Place Order",
    orderPlaced: "Order Placed Successfully!",
    continueShopping: "Continue Shopping",

    // Orders
    myOrders: "My Orders",
    orderDetails: "Order Details",
    orderId: "Order ID",
    orderDate: "Order Date",
    orderStatus: "Order Status",
    trackOrder: "Track Order",
    noOrders: "No orders yet",

    // Account
    profile: "Profile",
    editProfile: "Edit Profile",
    savedAddresses: "Saved Addresses",
    wishlist: "Wishlist",
    notifications: "Notifications",
    helpSupport: "Help & Support",
    privacyPolicy: "Privacy Policy",
    returnRefundPolicy: "Return & Refund Policy",
    contactUs: "Contact Us",
    logout: "Logout",

    // Auth
    login: "Login",
    register: "Register",
    phone: "Phone",
    password: "Password",
    name: "Name",
    email: "Email",

    // Address
    addAddress: "Add Address",
    address: "Address",
    city: "City",
    state: "State",
    pincode: "Pincode",
    landmark: "Landmark",

    // Menu
    menu: "Menu",

    // Auth - extended
    welcomeBack: "Welcome Back",
    loginContinue: "Login to continue shopping",
    enterPhone: "Enter 10 digit mobile number",
    enterEmail: "Enter email address",
    sendOtp: "Send OTP",
    newUser: "New user?",
    registerHere: "Register Here",
    enterOtp: "Enter OTP sent to",
    invalidPhone: "Enter valid 10 digit mobile number",
    invalidEmail: "Enter valid email address",
    invalidName: "Enter valid name (min 2 characters)",
    otpSent: "OTP Sent Successfully",
    otpFailed: "Failed to send OTP",
    otpResent: "OTP Resent Successfully",
    otpResendFailed: "Failed to resend OTP",
    enterFullOtp: "Please enter complete 6-digit OTP",
    loginSuccess: "Login Successful!",
    invalidOtp: "Invalid OTP",
    logoutSuccess: "Logged out successfully",
    logoutConfirm: "Are you sure you want to logout?",
    createAccount: "Create Account",
    fullName: "Full Name",
    mobileNumber: "Mobile Number",
    emailAddress: "Email Address",
    registerSuccess: "Registration Successful!",
    registerFailed: "Registration failed",
    alreadyAccount: "Already have an account?",
    loginHere: "Login Here",

    // Contact
    getInTouch: "Get in Touch",
    contactSubtitle: "We'd love to hear from you! Reach out anytime.",
    messageSent: "Message sent successfully!",
    yourName: "Your Name",
    yourEmail: "Your Email",
    yourMessage: "Your Message",
    sendMessage: "Send Message",

    // Privacy Policy
    privacyPolicyPage: "Privacy Policy",
    ppIntro: "We value your privacy. This policy explains how we collect, use, and protect your information when you use our e-commerce application.",
    pp1Title: "1. Information We Collect",
    pp1Desc: "We collect your name, phone number, email, delivery address, and order history to provide our services.",
    pp2Title: "2. How We Use Your Information",
    pp2Desc: "Your information is used to process orders, deliver products, send notifications, and improve our services.",
    pp3Title: "3. Data Security",
    pp3Desc: "We implement industry-standard security measures to protect your personal information from unauthorized access.",
    pp4Title: "4. Third-Party Sharing",
    pp4Desc: "We do not sell or share your personal data with third parties except for delivery partners to fulfill your orders.",
    pp5Title: "5. Cookies & Local Storage",
    pp5Desc: "We use local storage to save your preferences and session data for a better shopping experience.",
    pp6Title: "6. Your Rights",
    pp6Desc: "You can request to view, modify, or delete your personal data by contacting our support team.",
    pp7Title: "7. Contact Us",
    pp7Desc: "For privacy-related queries, please contact us through the Contact Us page or email us directly.",
    lastUpdated: "Last Updated: January 2025",

    // Return & Refund Policy
    rrIntro: "We want you to be completely satisfied with your purchase. Please read our return and refund policy carefully.",
    rr1Title: "1. Return Eligibility",
    rr1Desc: "Items can be returned within 24 hours of delivery if:",
    rr1Item1: "The product is damaged or defective",
    rr1Item2: "Wrong product was delivered",
    rr1Item3: "Product quality does not match description",
    rr2Title: "2. Non-Returnable Items",
    rr2Desc: "The following items cannot be returned:",
    rr2Item1: "Perishable goods (vegetables, fruits, dairy)",
    rr2Item2: "Opened or used products",
    rr2Item3: "Items purchased during clearance sales",
    rr3Title: "3. Refund Process",
    rr3Desc: "Once we receive and inspect the returned item, refunds will be processed within 3-5 business days to your original payment method.",
    rr4Title: "4. Cancellation Policy",
    rr4Desc: "Orders can be cancelled before they are packed. Once packed or out for delivery, cancellation is not possible.",
    rr5Title: "5. Exchange Policy",
    rr5Desc: "We offer direct replacement for damaged or wrong items. Contact our support team within 24 hours of delivery.",
    rr6Title: "6. Contact for Returns",
    rr6Desc: "For return or refund requests, please contact us through the Contact Us page or call our support number.",
  },
  hi: {
    // Navigation & Common
    home: "होम",
    categories: "श्रेणियाँ",
    cart: "कार्ट",
    account: "मेरा खाता",
    search: "खोजें",
    searchPlaceholder: "उत्पाद खोजें...",
    loading: "लोड हो रहा है...",
    noResults: "कोई परिणाम नहीं मिला",
    viewAll: "सभी देखें",
    addToCart: "कार्ट में डालें",
    buyNow: "अभी खरीदें",
    remove: "हटाएं",
    cancel: "रद्द करें",
    save: "सहेजें",
    edit: "संपादित करें",
    delete: "हटाएं",
    back: "वापस",
    next: "आगे",
    submit: "जमा करें",
    yes: "हाँ",
    no: "नहीं",
    ok: "ठीक है",
    close: "बंद करें",
    language: "भाषा",
    english: "English",
    hindi: "हिन्दी",

    // Home
    allCategories: "सभी श्रेणियाँ",
    featuredProducts: "विशेष उत्पाद",
    popularProducts: "लोकप्रिय उत्पाद",
    newArrivals: "नए उत्पाद",
    shopByCategory: "श्रेणी के अनुसार खरीदें",

    // Product
    product: "उत्पाद",
    products: "उत्पाद",
    productDetails: "उत्पाद विवरण",
    price: "मूल्य",
    mrp: "एमआरपी",
    stock: "स्टॉक",
    inStock: "उपलब्ध है",
    outOfStock: "स्टॉक में नहीं",
    quantity: "मात्रा",
    description: "विवरण",
    category: "श्रेणी",
    unit: "इकाई",

    // Cart & Checkout
    myCart: "मेरा कार्ट",
    cartEmpty: "आपका कार्ट खाली है",
    subtotal: "उप-कुल",
    deliveryCharge: "डिलीवरी शुल्क",
    total: "कुल",
    checkout: "चेकआउट",
    placeOrder: "ऑर्डर दें",
    orderPlaced: "ऑर्डर सफलतापूर्वक दिया गया!",
    continueShopping: "खरीदारी जारी रखें",

    // Orders
    myOrders: "मेरे ऑर्डर",
    orderDetails: "ऑर्डर विवरण",
    orderId: "ऑर्डर आईडी",
    orderDate: "ऑर्डर की तारीख",
    orderStatus: "ऑर्डर की स्थिति",
    trackOrder: "ऑर्डर ट्रैक करें",
    noOrders: "अभी तक कोई ऑर्डर नहीं",

    // Account
    profile: "प्रोफ़ाइल",
    editProfile: "प्रोफ़ाइल संपादित करें",
    savedAddresses: "सहेजे गए पते",
    wishlist: "विशलिस्ट",
    notifications: "सूचनाएँ",
    helpSupport: "सहायता और समर्थन",
    privacyPolicy: "गोपनीयता नीति",
    returnRefundPolicy: "वापसी और रिफंड नीति",
    contactUs: "संपर्क करें",
    logout: "लॉग आउट",

    // Auth
    login: "लॉग इन",
    register: "रजिस्टर",
    phone: "फ़ोन",
    password: "पासवर्ड",
    name: "नाम",
    email: "ईमेल",

    // Address
    addAddress: "पता जोड़ें",
    address: "पता",
    city: "शहर",
    state: "राज्य",
    pincode: "पिनकोड",
    landmark: "लैंडमार्क",

    // Menu
    menu: "मेनू",

    // Auth - extended
    welcomeBack: "वापसी पर स्वागत है",
    loginContinue: "खरीदारी जारी रखने के लिए लॉग इन करें",
    enterPhone: "10 अंकों का मोबाइल नंबर दर्ज करें",
    enterEmail: "ईमेल पता दर्ज करें",
    sendOtp: "OTP भेजें",
    newUser: "नए उपयोगकर्ता?",
    registerHere: "यहाँ रजिस्टर करें",
    enterOtp: "OTP दर्ज करें जो भेजा गया",
    invalidPhone: "कृपया वैध 10 अंकों का मोबाइल नंबर दर्ज करें",
    invalidEmail: "कृपया वैध ईमेल पता दर्ज करें",
    invalidName: "कृपया वैध नाम दर्ज करें (न्यूनतम 2 अक्षर)",
    otpSent: "OTP सफलतापूर्वक भेजा गया",
    otpFailed: "OTP भेजने में विफल",
    otpResent: "OTP पुनः भेजा गया",
    otpResendFailed: "OTP पुनः भेजने में विफल",
    enterFullOtp: "कृपया पूरा 6 अंकों का OTP दर्ज करें",
    loginSuccess: "लॉग इन सफल!",
    invalidOtp: "अमान्य OTP",
    logoutSuccess: "सफलतापूर्वक लॉग आउट हो गए",
    logoutConfirm: "क्या आप लॉग आउट करना चाहते हैं?",
    createAccount: "खाता बनाएं",
    fullName: "पूरा नाम",
    mobileNumber: "मोबाइल नंबर",
    emailAddress: "ईमेल पता",
    registerSuccess: "रजिस्ट्रेशन सफल!",
    registerFailed: "रजिस्ट्रेशन विफल",
    alreadyAccount: "पहले से खाता है?",
    loginHere: "यहाँ लॉग इन करें",

    // Contact
    getInTouch: "संपर्क करें",
    contactSubtitle: "हम आपसे सुनना चाहेंगे! कभी भी संपर्क करें।",
    messageSent: "संदेश सफलतापूर्वक भेजा गया!",
    yourName: "आपका नाम",
    yourEmail: "आपका ईमेल",
    yourMessage: "आपका संदेश",
    sendMessage: "संदेश भेजें",

    // Privacy Policy
    privacyPolicyPage: "गोपनीयता नीति",
    ppIntro: "हम आपकी गोपनीयता को महत्व देते हैं। यह नीति बताती है कि जब आप हमारे ई-कॉमर्स एप्लिकेशन का उपयोग करते हैं तो हम आपकी जानकारी कैसे एकत्र, उपयोग और सुरक्षित करते हैं।",
    pp1Title: "1. हम कौन सी जानकारी एकत्र करते हैं",
    pp1Desc: "हम अपनी सेवाएं प्रदान करने के लिए आपका नाम, फ़ोन नंबर, ईमेल, डिलीवरी पता और ऑर्डर इतिहास एकत्र करते हैं।",
    pp2Title: "2. हम आपकी जानकारी का उपयोग कैसे करते हैं",
    pp2Desc: "आपकी जानकारी का उपयोग ऑर्डर प्रोसेस करने, उत्पाद डिलीवर करने, सूचनाएं भेजने और हमारी सेवाओं को बेहतर बनाने के लिए किया जाता है।",
    pp3Title: "3. डेटा सुरक्षा",
    pp3Desc: "हम आपकी व्यक्तिगत जानकारी को अनधिकृत पहुंच से बचाने के लिए उद्योग-मानक सुरक्षा उपाय लागू करते हैं।",
    pp4Title: "4. तृतीय-पक्ष साझाकरण",
    pp4Desc: "हम आपके ऑर्डर पूरे करने के लिए डिलीवरी पार्टनर्स को छोड़कर आपका व्यक्तिगत डेटा तीसरे पक्ष को नहीं बेचते या साझा नहीं करते।",
    pp5Title: "5. कुकीज़ और लोकल स्टोरेज",
    pp5Desc: "बेहतर खरीदारी अनुभव के लिए हम आपकी प्राथमिकताओं और सत्र डेटा को सहेजने के लिए लोकल स्टोरेज का उपयोग करते हैं।",
    pp6Title: "6. आपके अधिकार",
    pp6Desc: "आप हमारी सहायता टीम से संपर्क करके अपना व्यक्तिगत डेटा देखने, संशोधित करने या हटाने का अनुरोध कर सकते हैं।",
    pp7Title: "7. संपर्क करें",
    pp7Desc: "गोपनीयता संबंधी प्रश्नों के लिए, कृपया हमसे संपर्क करें पेज के माध्यम से या सीधे ईमेल करें।",
    lastUpdated: "अंतिम अपडेट: जनवरी 2025",

    // Return & Refund Policy
    rrIntro: "हम चाहते हैं कि आप अपनी खरीदारी से पूरी तरह संतुष्ट हों। कृपया हमारी वापसी और रिफंड नीति ध्यान से पढ़ें।",
    rr1Title: "1. वापसी पात्रता",
    rr1Desc: "डिलीवरी के 24 घंटे के भीतर वस्तुएं वापस की जा सकती हैं यदि:",
    rr1Item1: "उत्पाद क्षतिग्रस्त या दोषपूर्ण है",
    rr1Item2: "गलत उत्पाद डिलीवर किया गया",
    rr1Item3: "उत्पाद की गुणवत्ता विवरण से मेल नहीं खाती",
    rr2Title: "2. वापसी योग्य नहीं",
    rr2Desc: "निम्नलिखित वस्तुएं वापस नहीं की जा सकतीं:",
    rr2Item1: "नाशपाती सामान (सब्जियां, फल, डेयरी)",
    rr2Item2: "खोले या उपयोग किए गए उत्पाद",
    rr2Item3: "क्लीयरेंस सेल में खरीदी गई वस्तुएं",
    rr3Title: "3. रिफंड प्रक्रिया",
    rr3Desc: "वापस की गई वस्तु प्राप्त और जांच करने के बाद, रिफंड 3-5 कार्य दिवसों के भीतर आपके मूल भुगतान विधि में प्रोसेस किया जाएगा।",
    rr4Title: "4. रद्दीकरण नीति",
    rr4Desc: "ऑर्डर पैक होने से पहले रद्द किए जा सकते हैं। पैक या डिलीवरी के लिए निकलने के बाद रद्दीकरण संभव नहीं है।",
    rr5Title: "5. एक्सचेंज नीति",
    rr5Desc: "क्षतिग्रस्त या गलत वस्तुओं के लिए हम सीधा प्रतिस्थापन प्रदान करते हैं। डिलीवरी के 24 घंटे के भीतर हमारी सहायता टीम से संपर्क करें।",
    rr6Title: "6. वापसी के लिए संपर्क",
    rr6Desc: "वापसी या रिफंड अनुरोध के लिए, कृपया हमसे संपर्क करें पेज के माध्यम से या हमारे सहायता नंबर पर कॉल करें।",
  },
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("app_language") || "en";
  });

  useEffect(() => {
    localStorage.setItem("app_language", language);
    // Keep react-i18next in sync
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language]);

  const t = (key) => {
    // Use current language source directly (synchronous) to avoid first-click mismatch.
    const selected = translations[language] || translations.en;
    if (selected[key]) {
      return selected[key];
    }

    // fallback to i18next in case resource is available
    const i18nextValue = i18n.t(key, { lng: language });
    if (i18nextValue && i18nextValue !== key) {
      return i18nextValue;
    }

    return translations.en[key] || key;
  };

  // Get localized name: returns Hindi name if language is Hindi and name_hi exists, else English name
  const getLocalizedName = (item) => {
    if (language === "hi" && item?.name_hi) {
      return item.name_hi;
    }
    return item?.name || "";
  };

  // Get localized description: returns Hindi description if language is Hindi and description_hi exists
  const getLocalizedDescription = (item) => {
    if (language === "hi" && item?.description_hi) {
      return item.description_hi;
    }
    return item?.description || "";
  };

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const next = prev === "en" ? "hi" : "en";
      i18n.changeLanguage(next);
      return next;
    });
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getLocalizedName, getLocalizedDescription, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export default LanguageContext;
