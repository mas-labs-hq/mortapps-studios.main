/**
 * AgriXen - Smart Farming Assistant
 * Open Source - Free Forever - No Account Needed
 * Powered By MortApps Studios
 */

// =====================================================
// CONFIGURATION
// =====================================================

// Advertisement Configuration - Slot Ads Only
// Duration options: '5s' (5 sec), '10s' (10 sec), '1m' (1 min), '2m' (2 min)
var SLOT_ADS = [
    { image: 'ad-images/lmh-ad-slot.png', url: 'https://www.linkagemediahub.co.ke', alt: 'Linkage Media Hub', duration: '5s' },
    { image: 'ad-images/manji-ad-slot.png', url: 'https://manji.co.ke', alt: 'Manji Biscuits', duration: '10s' },
    { image: 'ad-images/arm-ad-slot.png', url: 'https://www.arimis-milkingjelly.com', alt: 'arimis', duration: '5s' },
    { image: 'ad-images/mas-ad-slot.png', url: 'https://www.mortappsstudios.com', alt: 'MortApps Studios', duration: '10s' },
    { image: 'ad-images/pep-ad-slot.png', url: 'https://www.pepsodent.com/gh/home.html', alt: 'Pepsodent', duration: '5s' }
];

// Ad rotation state - independent for each slot with no-repeat logic
var adTimers = {};
var currentAdIndices = {};
var adRotationOrder = {}; // Track which ads have been shown for each slot

// =====================================================
// VET CONTACTS - EASY TO EDIT (ADD YOUR VETS HERE)
// Format: { name: "Vet Name", county: "County", specialty: "specialty", phone: "number" }
// Specialty options: 'cattle', 'poultry', 'goats', 'mixed', 'all'
// County: Use exact county name or 'All' for nationwide
// =====================================================
var VET_CONTACTS = [
    // Example vets - Replace with real contacts
    { name: 'Kenya Veterinary Board', county: 'Nairobi', specialty: 'mixed', phone: '0202718370' },
    { name: 'FAO Kenya Emergency', county: 'All', specialty: 'mixed', phone: '+254207625000' },
    { name: 'Directorate of Veterinary Services', county: 'Nairobi', specialty: 'mixed', phone: '0202718870' },
    // ADD MORE VETS BELOW - Copy the format above

   // { name: 'Dr. Wanjiku Animal Clinic', county: 'Kiambu', specialty: 'cattle', phone: '0722123456' },
   // { name: 'Nakuru Vet Centre', county: 'Nakuru', specialty: 'mixed', phone: '0733987654' },
   // { name: 'Eldoret Poultry Specialists', county: 'Uasin Gishu', specialty: 'poultry', phone: '0755678901' }
    // Continue adding more...
];

// =====================================================
// COMMUNITY MESSAGES - EASY TO EDIT
// Format: { name: "Sender Name", text: "Your message", image: "com-images/filename.jpg", time: "Time" }
// - image field is OPTIONAL - leave empty or omit for text-only messages
// - Put images in the 'com-images/' folder
// - Images will display below the message text
// =====================================================
var COMMUNITY_MESSAGES = [
    { 
        name: "AgriXen Team",
        text: "Jambo! Karibu AgriXen Community. We're here to support your farming journey with crop tips, livestock advice, and market updates. Stay connected by joining our community above\u2014click 'Join Us' to receive exclusive farming insights and seasonal alerts!",
        time: "Today"
    },
    // ADD MORE MESSAGES BELOW - Examples:
    // { name: "AgriXen Team", text: "\u26a0\ufe0f Watch out for Fall Armyworm this season!", image: "com-images/armyworm.jpg", time: "Yesterday" },
    // { name: "AgriXen Team", text: "This is what maize lethal necrosis looks like on your crops.", image: "com-images/mln.jpg", time: "2 days ago" },
];

// =====================================================
// ACTIVITY STATEMENTS - Auto-generated "live" activity
// These appear alongside community messages from "Sales"
// Format: { text: "Activity message", type: "buy" or "sell", maxAge: minutes }
// - type: 'buy' = looking to buy, 'sell' = just sold
// - maxAge: how long this statement stays visible (15-30 minutes)
// =====================================================
var ACTIVITY_STATEMENTS = [
    // BUY ACTIVITIES (farmers looking to buy)
    { text: "A farmer in Nakuru is looking for 100kg of maize. Check out Explore Markets!", type: "buy", maxAge: 20 },
    { text: "Someone in Kiambu needs 50kg of kales urgently. Head over to Explore Markets!", type: "buy", maxAge: 25 },
    { text: "Buyer in Meru seeking 200kg of potatoes. Browse Explore Markets now!", type: "buy", maxAge: 30 },
    { text: "A farmer in Nyeri wants 30kg of tomatoes. Check Explore Markets for fresh deals!", type: "buy", maxAge: 15 },
    { text: "Looking for 500kg of beans in Bungoma. Visit Explore Markets!", type: "buy", maxAge: 20 },
    { text: "Urgent: Buyer in Kisumu needs 80kg of onions. Find them on Explore Markets!", type: "buy", maxAge: 25 },
    
    // SELL ACTIVITIES (farmers who just sold)
    { text: "Mwangi just sold 150kg of tomatoes via AgriXen. Try listing on Explore Markets!", type: "sell", maxAge: 20 },
    { text: "Wanjiku sold 80kg of kales yesterday. List your produce on Explore Markets!", type: "sell", maxAge: 25 },
    { text: "A farmer in Murang'a just sold 200kg of maize. Use Explore Markets to sell yours!", type: "sell", maxAge: 30 },
    { text: "Ochieng sold 50kg of beans via AgriXen. Give Explore Markets a try!", type: "sell", maxAge: 15 },
    { text: "Another farmer just sold 300kg of potatoes. List yours on Explore Markets!", type: "sell", maxAge: 20 },
    { text: "Akinyi sold 40kg of spinach today. Start selling on Explore Markets!", type: "sell", maxAge: 25 },
    { text: "A farmer in Kakamega just sold 100kg of sugarcane. Try Explore Markets!", type: "sell", maxAge: 20 },
    { text: "Kipchoge sold 250kg of wheat yesterday. List on Explore Markets today!", type: "sell", maxAge: 30 },

    // ADDITIONAL ACTIVITY MESSAGES
    { text: "A buyer in Mombasa is sourcing 400kg of rice. Explore Markets has what you need!", type: "buy", maxAge: 20 },
    { text: "Fresh deal! A farmer in Embu just sold 120kg of avocados on Explore Markets.", type: "sell", maxAge: 25 },
    { text: "Urgent demand: 60kg of carrots needed in Thika. Check Explore Markets now!", type: "buy", maxAge: 15 },
    { text: "Chebet from Eldoret sold 180kg of sweet potatoes through Explore Markets!", type: "sell", maxAge: 20 },
    { text: "A hotel in Nairobi is looking for 300kg of green beans. Browse Explore Markets!", type: "buy", maxAge: 30 },
    { text: "Kamau just closed a deal for 90kg of capsicum on Explore Markets. Your turn!", type: "sell", maxAge: 20 },
    { text: "Looking for 70kg of dhania in Machakos. Head over to Explore Markets!", type: "buy", maxAge: 25 },
];

// Activity state - tracks which activities are currently shown
var currentActivityStatements = [];
var activityLastRefresh = null;
var activityCycleIndex = 0; // Track which activity to show next
var activityCycleTimer = null; // Timer for cycling activities
var visibleActivityCount = 0; // How many activities currently visible

// =====================================================
// FARMERS OF THE WEEK - EASY TO EDIT
// =====================================================
var FARMERS_OF_THE_WEEK = [
    { 
        name: "Jane Wangari", 
        profilePic: "farmers-pic/jane.wangari.jpg", 
        story: "Growing sukuma wiki and beans in Kajiado for 4 years. This week she harvested 160kg of fresh produce!",
        harvest1: "harvest-pic/jane-spinach.jpg",
        harvest1Name: "spinach",
        harvest2: "harvest-pic/jane-beans.jpg",
        harvest2Name: "Beans"
    },
    { 
        name: "Mary Wanjiku", 
        profilePic: "https://images.pexels.com/photos/27205295/pexels-photo-27205295.jpeg", 
        story: "Third-generation tea farmer from Nyeri with 15 acres under cultivation. Her farm produces some of the finest purple leaf tea in the region!",
        harvest1: "https://images.pexels.com/photos/6136356/pexels-photo-6136356.jpeg",
        harvest1Name: "Tea",
        harvest2: "https://images.pexels.com/photos/6870859/pexels-photo-6870859.jpeg",
        harvest2Name: "Tea"
    },
    { 
        name: "Peter Ochieng", 
        profilePic: "https://images.pexels.com/photos/11053957/pexels-photo-11053957.jpeg", 
        story: "Specializes in drought-resistant sorghum in Homa Bay. Recently expanded to 10 acres with help from his three brothers!",
        harvest1: "https://images.pexels.com/photos/17164919/pexels-photo-17164919.jpeg",
        harvest1Name: "Sorghum",
        harvest2: "https://images.pexels.com/photos/4430323/pexels-photo-4430323.jpeg",
        harvest2Name: "Goat Herding"
    }
];

// WhatsApp number for farmer submissions
var FARMERS_WHATSAPP_NUMBER = "254113400063";

// Kenya Counties with Coordinates
var COUNTIES = {
    'Baringo': { lat: 0.4919, lon: 35.9653 },
    'Bomet': { lat: -0.7823, lon: 35.3442 },
    'Bungoma': { lat: 0.5667, lon: 34.5667 },
    'Busia': { lat: 0.4608, lon: 34.1108 },
    'Elgeyo-Marakwet': { lat: 0.8833, lon: 35.5000 },
    'Embu': { lat: -0.5333, lon: 37.4500 },
    'Garissa': { lat: -0.4536, lon: 39.6401 },
    'Homa Bay': { lat: -0.5273, lon: 34.4571 },
    'Isiolo': { lat: 0.3540, lon: 37.5822 },
    'Kajiado': { lat: -2.0981, lon: 36.7820 },
    'Kakamega': { lat: 0.2827, lon: 34.7519 },
    'Kericho': { lat: -0.3692, lon: 35.2839 },
    'Kiambu': { lat: -1.1714, lon: 36.8356 },
    'Kilifi': { lat: -3.5107, lon: 39.9093 },
    'Kirinyaga': { lat: -0.5000, lon: 37.2833 },
    'Kisii': { lat: -0.6817, lon: 34.7667 },
    'Kisumu': { lat: -0.1022, lon: 34.7617 },
    'Kitui': { lat: -1.3667, lon: 38.0167 },
    'Kwale': { lat: -4.1756, lon: 39.4522 },
    'Laikipia': { lat: 0.4000, lon: 36.9000 },
    'Lamu': { lat: -2.2686, lon: 40.9020 },
    'Machakos': { lat: -1.5177, lon: 37.2634 },
    'Makueni': { lat: -1.8000, lon: 37.6167 },
    'Mandera': { lat: 3.9373, lon: 41.8671 },
    'Marsabit': { lat: 2.3360, lon: 37.9908 },
    'Meru': { lat: 0.0500, lon: 37.6500 },
    'Migori': { lat: -1.0634, lon: 34.4731 },
    'Mombasa': { lat: -4.0435, lon: 39.6682 },
    'Muranga': { lat: -0.7833, lon: 37.0333 },
    'Nairobi': { lat: -1.2921, lon: 36.8219 },
    'Nakuru': { lat: -0.3031, lon: 36.0800 },
    'Nandi': { lat: 0.1833, lon: 35.1500 },
    'Narok': { lat: -1.0833, lon: 35.8667 },
    'Nyamira': { lat: -0.5633, lon: 34.9358 },
    'Nyandarua': { lat: -0.3833, lon: 36.5167 },
    'Nyeri': { lat: -0.4167, lon: 36.9500 },
    'Samburu': { lat: 1.2000, lon: 36.9500 },
    'Siaya': { lat: -0.0614, lon: 34.2422 },
    'Taita-Taveta': { lat: -3.3167, lon: 38.3667 },
    'Tana River': { lat: -1.5000, lon: 40.0500 },
    'Tharaka-Nithi': { lat: -0.3000, lon: 37.8500 },
    'Trans Nzoia': { lat: 1.0550, lon: 34.9500 },
    'Turkana': { lat: 3.1122, lon: 35.5978 },
    'Uasin Gishu': { lat: 0.5143, lon: 35.2697 },
    'Vihiga': { lat: 0.0833, lon: 34.7167 },
    'Wajir': { lat: 1.7471, lon: 40.0573 },
    'West Pokot': { lat: 1.6200, lon: 35.1200 }
};

// =====================================================
// REGION-BASED CROP RECOMMENDATIONS FOR KENYA
// =====================================================
var COUNTY_CROP_FIT = {
    'Nyandarua': ['Potatoes', 'Cabbage', 'Carrots', 'Tea', 'Maize', 'Beans', 'Peas', 'Kale (Sukuma Wiki)', 'Spinach', 'Tomatoes', 'Onions', 'Capsicum', 'Cowpeas', 'Sweet Potatoes', 'Passion Fruit', 'Pumpkin', 'Groundnuts'],
    'Nyeri': ['Coffee', 'Tea', 'Potatoes', 'Maize', 'Beans', 'Bananas', 'Tomatoes', 'Kale (Sukuma Wiki)', 'Cabbage', 'Carrots', 'Spinach', 'Onions', 'Capsicum', 'Avocado', 'Passion Fruit', 'Sweet Potatoes', 'Pumpkin', 'Cowpeas'],
    'Kirinyaga': ['Rice', 'Coffee', 'Tea', 'Maize', 'Beans', 'Tomatoes', 'Bananas', 'Sorghum', 'Kale (Sukuma Wiki)', 'Cabbage', 'Spinach', 'Onions', 'Capsicum', 'Avocado', 'Passion Fruit', 'Cowpeas', 'Pumpkin', 'Sweet Potatoes'],
    'Muranga': ['Coffee', 'Tea', 'Bananas', 'Avocado', 'Maize', 'Beans', 'Kale (Sukuma Wiki)', 'Tomatoes', 'Cabbage', 'Spinach', 'Onions', 'Capsicum', 'Passion Fruit', 'Macadamia', 'Sweet Potatoes', 'Cowpeas', 'Pumpkin', 'Groundnuts'],
    'Kiambu': ['Coffee', 'Tea', 'Bananas', 'Avocado', 'Maize', 'Tomatoes', 'Kale (Sukuma Wiki)', 'Cabbage', 'Spinach', 'Carrots', 'Onions', 'Capsicum', 'Passion Fruit', 'Beans', 'Sweet Potatoes', 'Pumpkin', 'Cowpeas', 'Groundnuts'],
    'Meru': ['Coffee', 'Tea', 'Bananas', 'Maize', 'Beans', 'Potatoes', 'Avocado', 'Kale (Sukuma Wiki)', 'Tomatoes', 'Cabbage', 'Spinach', 'Carrots', 'Onions', 'Capsicum', 'Passion Fruit', 'Mangoes', 'Sweet Potatoes', 'Cowpeas', 'Pumpkin', 'Groundnuts'],
    'Tharaka-Nithi': ['Mangoes', 'Maize', 'Sorghum', 'Millets', 'Cowpeas', 'Beans', 'Kale (Sukuma Wiki)', 'Tomatoes', 'Cabbage', 'Onions', 'Capsicum', 'Passion Fruit', 'Coffee', 'Bananas', 'Sweet Potatoes', 'Pumpkin', 'Groundnuts', 'Cassava'],
    'Embu': ['Coffee', 'Tea', 'Bananas', 'Maize', 'Beans', 'Kale (Sukuma Wiki)', 'Tomatoes', 'Cabbage', 'Spinach', 'Onions', 'Capsicum', 'Avocado', 'Passion Fruit', 'Mangoes', 'Macadamia', 'Sweet Potatoes', 'Cowpeas', 'Pumpkin', 'Groundnuts'],
    'Nakuru': ['Maize', 'Potatoes', 'Tomatoes', 'Kale (Sukuma Wiki)', 'Cabbage', 'Carrots', 'Onions', 'Capsicum', 'Beans', 'Spinach', 'Wheat', 'Barley', 'Avocado', 'Passion Fruit', 'Sweet Potatoes', 'Cowpeas', 'Pumpkin', 'Groundnuts'],
    'Kericho': ['Tea', 'Maize', 'Potatoes', 'Beans', 'Kale (Sukuma Wiki)', 'Cabbage', 'Spinach', 'Carrots', 'Onions', 'Capsicum', 'Avocado', 'Passion Fruit', 'Sweet Potatoes', 'Cowpeas', 'Pumpkin', 'Groundnuts', 'Sugarcane'],
    'Bomet': ['Tea', 'Maize', 'Potatoes', 'Beans', 'Kale (Sukuma Wiki)', 'Cabbage', 'Spinach', 'Carrots', 'Onions', 'Capsicum', 'Avocado', 'Passion Fruit', 'Sweet Potatoes', 'Cowpeas', 'Pumpkin', 'Groundnuts', 'Sugarcane'],
    'Nandi': ['Tea', 'Maize', 'Sugarcane', 'Beans', 'Kale (Sukuma Wiki)', 'Cabbage', 'Spinach', 'Carrots', 'Onions', 'Capsicum', 'Avocado', 'Passion Fruit', 'Sweet Potatoes', 'Cowpeas', 'Pumpkin', 'Groundnuts', 'Bananas', 'Tomatoes'],
    'Uasin Gishu': ['Maize', 'Potatoes', 'Beans', 'Kale (Sukuma Wiki)', 'Cabbage', 'Spinach', 'Carrots', 'Onions', 'Capsicum', 'Tomatoes', 'Avocado', 'Passion Fruit', 'Sweet Potatoes', 'Cowpeas', 'Pumpkin', 'Groundnuts', 'Wheat', 'Barley'],
    'Trans Nzoia': ['Maize', 'Potatoes', 'Beans', 'Coffee', 'Kale (Sukuma Wiki)', 'Cabbage', 'Spinach', 'Carrots', 'Onions', 'Capsicum', 'Tomatoes', 'Avocado', 'Passion Fruit', 'Sweet Potatoes', 'Cowpeas', 'Pumpkin', 'Groundnuts', 'Wheat', 'Barley', 'Sunflower'],
    'Elgeyo-Marakwet': ['Maize', 'Potatoes', 'Beans', 'Kale (Sukuma Wiki)', 'Cabbage', 'Spinach', 'Carrots', 'Onions', 'Capsicum', 'Tomatoes', 'Passion Fruit', 'Avocado', 'Sweet Potatoes', 'Cowpeas', 'Pumpkin', 'Groundnuts', 'Sorghum', 'Millets'],
    'West Pokot': ['Sorghum', 'Millets', 'Maize', 'Cassava', 'Beans', 'Cowpeas', 'Kale (Sukuma Wiki)', 'Tomatoes', 'Onions', 'Sweet Potatoes', 'Pumpkin', 'Groundnuts', 'Passion Fruit', 'Mangoes', 'Capsicum'],
    'Baringo': ['Sorghum', 'Millets', 'Cassava', 'Mangoes', 'Maize', 'Beans', 'Cowpeas', 'Kale (Sukuma Wiki)', 'Tomatoes', 'Onions', 'Sweet Potatoes', 'Pumpkin', 'Groundnuts', 'Passion Fruit', 'Bananas', 'Capsicum', 'Watermelon'],
    'Laikipia': ['Maize', 'Beans', 'Potatoes', 'Kale (Sukuma Wiki)', 'Cabbage', 'Spinach', 'Carrots', 'Onions', 'Capsicum', 'Tomatoes', 'Passion Fruit', 'Avocado', 'Sweet Potatoes', 'Cowpeas', 'Pumpkin', 'Groundnuts', 'Wheat', 'Barley'],
    'Narok': ['Maize', 'Potatoes', 'Beans', 'Kale (Sukuma Wiki)', 'Cabbage', 'Spinach', 'Carrots', 'Onions', 'Capsicum', 'Tomatoes', 'Passion Fruit', 'Avocado', 'Sweet Potatoes', 'Cowpeas', 'Pumpkin', 'Groundnuts', 'Wheat', 'Barley'],
    'Samburu': ['Sorghum', 'Millets', 'Maize', 'Beans', 'Cowpeas', 'Kale (Sukuma Wiki)', 'Tomatoes', 'Onions', 'Sweet Potatoes', 'Pumpkin', 'Groundnuts', 'Cassava', 'Capsicum', 'Watermelon'],
    'Turkana': ['Sorghum', 'Millets', 'Cassava', 'Cowpeas', 'Sweet Potatoes', 'Pumpkin', 'Groundnuts', 'Tomatoes', 'Onions', 'Kale (Sukuma Wiki)', 'Watermelon', 'Capsicum', 'Beans', 'Mangoes'],
    'Kakamega': ['Sugarcane', 'Maize', 'Tea', 'Beans', 'Bananas', 'Kale (Sukuma Wiki)', 'Tomatoes', 'Cabbage', 'Spinach', 'Onions', 'Capsicum', 'Avocado', 'Passion Fruit', 'Sweet Potatoes', 'Cowpeas', 'Pumpkin', 'Groundnuts', 'Carrots'],
    'Vihiga': ['Tea', 'Sugarcane', 'Maize', 'Avocado', 'Bananas', 'Beans', 'Kale (Sukuma Wiki)', 'Tomatoes', 'Cabbage', 'Spinach', 'Onions', 'Capsicum', 'Passion Fruit', 'Sweet Potatoes', 'Cowpeas', 'Pumpkin', 'Groundnuts', 'Carrots'],
    'Bungoma': ['Sugarcane', 'Maize', 'Beans', 'Bananas', 'Kale (Sukuma Wiki)', 'Tomatoes', 'Cabbage', 'Spinach', 'Onions', 'Capsicum', 'Avocado', 'Passion Fruit', 'Sweet Potatoes', 'Cowpeas', 'Pumpkin', 'Groundnuts', 'Carrots', 'Sunflower'],
    'Busia': ['Rice', 'Maize', 'Sorghum', 'Millets', 'Cassava', 'Sweet Potatoes', 'Beans', 'Cowpeas', 'Kale (Sukuma Wiki)', 'Tomatoes', 'Cabbage', 'Onions', 'Capsicum', 'Pumpkin', 'Groundnuts', 'Bananas', 'Passion Fruit'],
    'Kisumu': ['Rice', 'Sugarcane', 'Maize', 'Sorghum', 'Beans', 'Kale (Sukuma Wiki)', 'Tomatoes', 'Cabbage', 'Onions', 'Capsicum', 'Sweet Potatoes', 'Cowpeas', 'Pumpkin', 'Groundnuts', 'Bananas', 'Passion Fruit', 'Cassava'],
    'Siaya': ['Rice', 'Sorghum', 'Maize', 'Cassava', 'Sweet Potatoes', 'Beans', 'Cowpeas', 'Kale (Sukuma Wiki)', 'Tomatoes', 'Cabbage', 'Onions', 'Capsicum', 'Pumpkin', 'Groundnuts', 'Bananas', 'Passion Fruit', 'Millets'],
    'Homa Bay': ['Sugarcane', 'Sorghum', 'Maize', 'Cassava', 'Beans', 'Kale (Sukuma Wiki)', 'Tomatoes', 'Cabbage', 'Onions', 'Capsicum', 'Sweet Potatoes', 'Cowpeas', 'Pumpkin', 'Groundnuts', 'Bananas', 'Passion Fruit', 'Rice', 'Mangoes'],
    'Migori': ['Sugarcane', 'Maize', 'Sorghum', 'Millets', 'Cassava', 'Beans', 'Kale (Sukuma Wiki)', 'Tomatoes', 'Cabbage', 'Onions', 'Capsicum', 'Sweet Potatoes', 'Cowpeas', 'Pumpkin', 'Groundnuts', 'Bananas', 'Passion Fruit', 'Avocado'],
    'Kisii': ['Tea', 'Bananas', 'Avocado', 'Passion Fruit', 'Maize', 'Beans', 'Kale (Sukuma Wiki)', 'Tomatoes', 'Cabbage', 'Spinach', 'Onions', 'Capsicum', 'Sweet Potatoes', 'Cowpeas', 'Pumpkin', 'Groundnuts', 'Carrots', 'Potatoes'],
    'Nyamira': ['Tea', 'Bananas', 'Avocado', 'Maize', 'Beans', 'Kale (Sukuma Wiki)', 'Tomatoes', 'Cabbage', 'Spinach', 'Onions', 'Capsicum', 'Passion Fruit', 'Sweet Potatoes', 'Cowpeas', 'Pumpkin', 'Groundnuts', 'Carrots', 'Potatoes'],
    'Machakos': ['Mangoes', 'Sorghum', 'Millets', 'Cowpeas', 'Maize', 'Beans', 'Kale (Sukuma Wiki)', 'Tomatoes', 'Onions', 'Capsicum', 'Sweet Potatoes', 'Pumpkin', 'Groundnuts', 'Passion Fruit', 'Avocado', 'Cassava', 'Watermelon', 'Bananas'],
    'Makueni': ['Mangoes', 'Sorghum', 'Millets', 'Cowpeas', 'Maize', 'Beans', 'Kale (Sukuma Wiki)', 'Tomatoes', 'Onions', 'Capsicum', 'Sweet Potatoes', 'Pumpkin', 'Groundnuts', 'Passion Fruit', 'Avocado', 'Cassava', 'Watermelon', 'Green Grams'],
    'Kitui': ['Mangoes', 'Sorghum', 'Millets', 'Cowpeas', 'Maize', 'Beans', 'Kale (Sukuma Wiki)', 'Tomatoes', 'Onions', 'Capsicum', 'Sweet Potatoes', 'Pumpkin', 'Groundnuts', 'Cassava', 'Watermelon', 'Passion Fruit', 'Bananas', 'Green Grams'],
    'Isiolo': ['Sorghum', 'Millets', 'Cowpeas', 'Maize', 'Beans', 'Kale (Sukuma Wiki)', 'Tomatoes', 'Onions', 'Sweet Potatoes', 'Pumpkin', 'Groundnuts', 'Cassava', 'Watermelon', 'Mangoes', 'Passion Fruit', 'Capsicum'],
    'Marsabit': ['Sorghum', 'Millets', 'Cowpeas', 'Maize', 'Beans', 'Kale (Sukuma Wiki)', 'Tomatoes', 'Onions', 'Sweet Potatoes', 'Pumpkin', 'Groundnuts', 'Cassava', 'Capsicum'],
    'Garissa': ['Sorghum', 'Millets', 'Watermelon', 'Cowpeas', 'Tomatoes', 'Onions', 'Kale (Sukuma Wiki)', 'Sweet Potatoes', 'Pumpkin', 'Capsicum', 'Mangoes', 'Bananas', 'Passion Fruit', 'Cassava'],
    'Mandera': ['Sorghum', 'Millets', 'Cowpeas', 'Tomatoes', 'Onions', 'Kale (Sukuma Wiki)', 'Sweet Potatoes', 'Pumpkin', 'Capsicum', 'Watermelon', 'Mangoes', 'Passion Fruit', 'Beans'],
    'Wajir': ['Sorghum', 'Millets', 'Cowpeas', 'Tomatoes', 'Onions', 'Kale (Sukuma Wiki)', 'Sweet Potatoes', 'Pumpkin', 'Capsicum', 'Watermelon', 'Mangoes', 'Passion Fruit', 'Beans', 'Cassava'],
    'Mombasa': ['Mangoes', 'Bananas', 'Cassava', 'Tomatoes', 'Kale (Sukuma Wiki)', 'Onions', 'Capsicum', 'Sweet Potatoes', 'Pumpkin', 'Coconuts', 'Cashew Nuts', 'Oranges', 'Passion Fruit', 'Cowpeas', 'Watermelon', 'Groundnuts'],
    'Kilifi': ['Mangoes', 'Cassava', 'Coconuts', 'Cashew Nuts', 'Oranges', 'Tomatoes', 'Kale (Sukuma Wiki)', 'Onions', 'Capsicum', 'Sweet Potatoes', 'Pumpkin', 'Cowpeas', 'Watermelon', 'Groundnuts', 'Passion Fruit', 'Bananas', 'Sorghum', 'Millets'],
    'Kwale': ['Mangoes', 'Cassava', 'Coconuts', 'Cashew Nuts', 'Oranges', 'Tomatoes', 'Kale (Sukuma Wiki)', 'Onions', 'Capsicum', 'Sweet Potatoes', 'Pumpkin', 'Cowpeas', 'Watermelon', 'Groundnuts', 'Passion Fruit', 'Bananas', 'Sorghum', 'Millets'],
    'Taita-Taveta': ['Maize', 'Beans', 'Tomatoes', 'Kale (Sukuma Wiki)', 'Cabbage', 'Onions', 'Capsicum', 'Sweet Potatoes', 'Pumpkin', 'Groundnuts', 'Mangoes', 'Avocado', 'Passion Fruit', 'Bananas', 'Cowpeas', 'Cassava', 'Sorghum'],
    'Lamu': ['Mangoes', 'Coconuts', 'Bananas', 'Tomatoes', 'Kale (Sukuma Wiki)', 'Onions', 'Capsicum', 'Sweet Potatoes', 'Pumpkin', 'Cowpeas', 'Cassava', 'Passion Fruit', 'Watermelon'],
    'Tana River': ['Mangoes', 'Bananas', 'Maize', 'Rice', 'Tomatoes', 'Kale (Sukuma Wiki)', 'Onions', 'Capsicum', 'Sweet Potatoes', 'Pumpkin', 'Groundnuts', 'Cowpeas', 'Cassava', 'Watermelon', 'Passion Fruit', 'Sorghum', 'Millets'],
    'Nairobi': ['Kale (Sukuma Wiki)', 'Spinach', 'Tomatoes', 'Onions', 'Cabbage', 'Capsicum', 'Carrots', 'Sweet Potatoes', 'Beans', 'Cowpeas', 'Pumpkin', 'Passion Fruit', 'Avocado', 'Bananas', 'Mangoes', 'Groundnuts'],
    'Kajiado': ['Maize', 'Beans', 'Tomatoes', 'Kale (Sukuma Wiki)', 'Onions', 'Capsicum', 'Sweet Potatoes', 'Pumpkin', 'Groundnuts', 'Cowpeas', 'Passion Fruit', 'Avocado', 'Sorghum', 'Millets', 'Watermelon', 'Mangoes', 'Cassava']
};

// Extended Crop Data (26 crops now)
var CROP_DATA = [
    { name: 'Maize', icon: 'grain', seasons: ['Mar', 'Apr', 'Oct', 'Nov'], daysToHarvest: '90-120 days', spacing: '75cm between rows, 25cm between plants', water: '500-800mm rainfall required', soil: 'Well-drained, fertile loam soil, pH 5.5-7.0', tips: 'Plant at onset of rains. Apply DAP fertilizer at planting. Top dress with CAN when knee-high.' },
    { name: 'Beans', icon: 'legume', seasons: ['Mar', 'Apr', 'Oct', 'Nov'], daysToHarvest: '60-90 days', spacing: '50cm between rows, 10cm between plants', water: '300-500mm rainfall required', soil: 'Well-drained soil, pH 6.0-7.0', tips: 'Fixes nitrogen naturally. Good for intercropping with maize. Avoid waterlogging.' },
    { name: 'Tomatoes', icon: 'fruit', seasons: ['Jan', 'Feb', 'Mar', 'Aug', 'Sep', 'Oct'], daysToHarvest: '75-90 days', spacing: '90cm between rows, 60cm between plants', water: '600-800mm, regular irrigation needed', soil: 'Deep, well-drained soil, pH 6.0-6.8', tips: 'Stake plants for support. Mulch to retain moisture. Watch for blight and pests.' },
    { name: 'Kale (Sukuma Wiki)', icon: 'leaf', seasons: ['Jan', 'Feb', 'Mar', 'Apr', 'Aug', 'Sep', 'Oct', 'Nov'], daysToHarvest: '45-60 days', spacing: '60cm between rows, 45cm between plants', water: '400-600mm, consistent moisture', soil: 'Fertile, well-drained soil, pH 6.0-7.5', tips: 'Harvest outer leaves first. Apply manure regularly. Very profitable for urban markets.' },
    { name: 'Potatoes', icon: 'tuber', seasons: ['Mar', 'Apr', 'Aug', 'Sep'], daysToHarvest: '90-120 days', spacing: '75cm between rows, 30cm between plants', water: '500-700mm rainfall', soil: 'Loose, well-drained soil, pH 5.0-6.5', tips: 'Plant certified seed tubers. Hill up soil around stems. Good for highland areas.' },
    { name: 'Onions', icon: 'bulb', seasons: ['Jan', 'Feb', 'Jun', 'Jul'], daysToHarvest: '90-150 days', spacing: '30cm between rows, 10cm between plants', water: '350-500mm, reduce at bulbing', soil: 'Well-drained, sandy loam, pH 6.0-7.0', tips: 'Needs full sun. Stop watering when tops fall. Cure before storage.' },
    { name: 'Cabbage', icon: 'leaf', seasons: ['Feb', 'Mar', 'Aug', 'Sep'], daysToHarvest: '85-110 days', spacing: '60cm between rows, 45cm between plants', water: '500-800mm, consistent moisture', soil: 'Heavy, fertile soil, pH 6.0-7.5', tips: 'Transplant seedlings at 4-5 weeks. Heads form in cool weather.' },
    { name: 'Bananas', icon: 'fruit', seasons: ['Mar', 'Apr', 'Sep', 'Oct'], daysToHarvest: '12-18 months', spacing: '3m between plants', water: '2000-2500mm annually', soil: 'Deep, well-drained, fertile soil, pH 5.5-7.0', tips: 'Plant suckers at start of rains. Mulch heavily. Remove dead leaves.' },
    { name: 'Avocado', icon: 'fruit', seasons: ['Mar', 'Apr', 'Oct', 'Nov'], daysToHarvest: '3-5 years to fruit', spacing: '6-10m between trees', water: '1000-2000mm annually', soil: 'Deep, well-drained, pH 5.5-6.5', tips: 'Graft for better varieties. High export potential. Protect from frost.' },
    { name: 'Spinach', icon: 'leaf', seasons: ['Jan', 'Feb', 'Mar', 'Apr', 'Aug', 'Sep', 'Oct', 'Nov'], daysToHarvest: '35-45 days', spacing: '30cm between rows, 15cm between plants', water: '400-600mm', soil: 'Rich, well-drained soil, pH 6.0-7.0', tips: 'Prefers cool weather. Harvest leaves regularly. Bolts in heat.' },
    { name: 'Carrots', icon: 'root', seasons: ['Jan', 'Feb', 'Jun', 'Jul', 'Aug'], daysToHarvest: '70-80 days', spacing: '30cm between rows, 5cm between plants', water: '300-500mm', soil: 'Loose, sandy soil, pH 6.0-6.8', tips: 'Thin seedlings early. Keep soil loose for straight roots.' },
    { name: 'Capsicum', icon: 'fruit', seasons: ['Jan', 'Feb', 'Jul', 'Aug'], daysToHarvest: '70-90 days', spacing: '60cm between rows, 45cm between plants', water: '500-700mm', soil: 'Well-drained, fertile soil, pH 6.0-6.8', tips: 'High market demand. Stake tall varieties. Watch for aphids.' },
    { name: 'Watermelon', icon: 'fruit', seasons: ['Jan', 'Feb', 'Mar', 'Aug', 'Sep'], daysToHarvest: '80-100 days', spacing: '2m between rows, 1m between plants', water: '500-700mm', soil: 'Sandy loam, well-drained, pH 6.0-7.0', tips: 'Needs warm climate. Mulch to retain moisture. Water deeply but infrequently.' },
    { name: 'Sorghum', icon: 'grain', seasons: ['Mar', 'Apr', 'Oct', 'Nov'], daysToHarvest: '100-120 days', spacing: '60cm between rows, 15cm between plants', water: '400-600mm, drought tolerant', soil: 'Wide range, pH 5.5-7.5', tips: 'Drought resistant. Good for arid areas. Birds love it - consider scaring methods.' },
    { name: 'Millets', icon: 'grain', seasons: ['Mar', 'Apr', 'Oct', 'Nov'], daysToHarvest: '90-100 days', spacing: '25cm between rows, 10cm between plants', water: '300-500mm, very drought tolerant', soil: 'Light soils, pH 5.5-7.0', tips: 'Extremely drought tolerant. Nutritious grain. Minimal fertilizer needed.' },
    { name: 'Cassava', icon: 'tuber', seasons: ['Mar', 'Apr', 'Sep', 'Oct', 'Nov'], daysToHarvest: '8-12 months', spacing: '1m between rows, 1m between plants', water: '500-800mm, drought tolerant once established', soil: 'Wide range, tolerates poor soils', tips: 'Plant stem cuttings. Very low maintenance. Harvest as needed. Good food security crop.' },
    { name: 'Sweet Potatoes', icon: 'tuber', seasons: ['Mar', 'Apr', 'Aug', 'Sep', 'Oct'], daysToHarvest: '90-150 days', spacing: '1m between rows, 30cm between plants', water: '500-800mm', soil: 'Sandy loam, loose soil, pH 5.5-6.5', tips: 'Plant vine cuttings. Mulch heavily. Harvest when leaves yellow. Very nutritious.' },
    { name: 'Groundnuts', icon: 'legume', seasons: ['Mar', 'Apr', 'Aug', 'Sep'], daysToHarvest: '90-120 days', spacing: '50cm between rows, 10cm between plants', water: '400-600mm', soil: 'Sandy loam, well-drained, pH 5.5-7.0', tips: 'Fixes nitrogen. Needs calcium for pod filling. Harvest when leaves turn yellow.' },
    { name: 'Sugarcane', icon: 'grain', seasons: ['Mar', 'Apr', 'Sep', 'Oct'], daysToHarvest: '12-18 months', spacing: '1.5m between rows, 0.5m between plants', water: '1500-2500mm', soil: 'Deep, fertile, well-drained, pH 6.0-7.5', tips: 'Plant cane setts. Heavy feeder - needs lots of nutrients. Good cash crop.' },
    { name: 'Coffee', icon: 'fruit', seasons: ['Mar', 'Apr', 'Oct', 'Nov'], daysToHarvest: '3-4 years to first harvest', spacing: '2.5m between rows, 2.5m between plants', water: '1500-2000mm', soil: 'Volcanic, deep, well-drained, pH 5.5-6.5', tips: 'Needs shade initially. Prune regularly. Major cash crop for highlands.' },
    { name: 'Tea', icon: 'leaf', seasons: ['Mar', 'Apr', 'Oct', 'Nov'], daysToHarvest: '3-5 years to maturity', spacing: '1.2m between rows, 0.75m between plants', water: '1500-2500mm', soil: 'Acidic, well-drained, pH 4.5-5.5', tips: 'Needs cool highland climate. Prune every 3-5 years. Major export crop.' },
    { name: 'Rice', icon: 'grain', seasons: ['Mar', 'Apr', 'Aug', 'Sep'], daysToHarvest: '100-150 days', spacing: '25cm between rows, 25cm between plants', water: '1000-2000mm or irrigation', soil: 'Heavy clay, water-retaining, pH 5.5-7.0', tips: 'Needs standing water during growth. Good for wetlands. MV schemes in Kenya.' },
    { name: 'Cowpeas', icon: 'legume', seasons: ['Mar', 'Apr', 'Oct', 'Nov'], daysToHarvest: '60-90 days', spacing: '50cm between rows, 20cm between plants', water: '300-500mm, drought tolerant', soil: 'Wide range, pH 5.5-7.0', tips: 'Very drought tolerant. Leaves are edible too. Good for intercropping.' },
    { name: 'Pumpkin', icon: 'fruit', seasons: ['Mar', 'Apr', 'Aug', 'Sep'], daysToHarvest: '90-120 days', spacing: '2m between rows, 2m between plants', water: '500-800mm', soil: 'Rich, well-drained, pH 6.0-7.0', tips: 'Needs space to spread. Mulch heavily. Leaves and seeds are also edible.' },
    { name: 'Mangoes', icon: 'fruit', seasons: ['Jan', 'Feb', 'Nov', 'Dec'], daysToHarvest: '3-5 years to fruit', spacing: '8-10m between trees', water: '800-1200mm annually', soil: 'Well-drained, deep soil, pH 5.5-7.5', tips: 'Graft for better varieties. Popular in Eastern and Coastal regions. High market demand.' },
    { name: 'Passion Fruit', icon: 'fruit', seasons: ['Mar', 'Apr', 'Sep', 'Oct'], daysToHarvest: '6-9 months to first harvest', spacing: '3m between rows, 3m between plants', water: '1000-1500mm', soil: 'Well-drained, pH 5.5-6.5', tips: 'Needs trellis support. Purple variety popular in highlands. Yellow variety for lowlands.' }
];

// Livestock Data (8 animals now)
var LIVESTOCK_DATA = [
    { name: 'Cattle (Dairy)', icon: 'cattle', tips: [{ label: 'Feeding', text: 'Provide fresh water (50-100L/day) and quality fodder. Supplement with dairy meal during milking.' }, { label: 'Health', text: 'Watch for mastitis (swollen udder), tick-borne diseases. Vaccinate against FMD and lumpy skin.' }, { label: 'Housing', text: 'Clean, well-ventilated shed. Remove manure daily to prevent disease.' }] },
    { name: 'Cattle (Beef)', icon: 'cattle', tips: [{ label: 'Feeding', text: 'Grazing on pasture is ideal. Supplement with hay during dry season. Mineral licks are essential.' }, { label: 'Health', text: 'Regular deworming (every 3 months). Watch for tick infestations and respiratory issues.' }, { label: 'Breeding', text: 'Select breeding bulls carefully. Cross-breeding can improve meat quality.' }] },
    { name: 'Goats', icon: 'goat', tips: [{ label: 'Feeding', text: 'Browsers - prefer shrubs and leaves. Supplement with hay and concentrates. Provide clean water.' }, { label: 'Health', text: 'Prone to pneumonia and parasites. Regular deworming crucial. Vaccinate against PPR.' }, { label: 'Housing', text: 'Raise floor off ground. Keep dry and well-ventilated. Separate kids from adults.' }] },
    { name: 'Chickens', icon: 'poultry', tips: [{ label: 'Feeding', text: 'Layers: 120-150g feed/day. Chicks need starter feed for 8 weeks. Provide clean water always.' }, { label: 'Health', text: 'Vaccinate against Newcastle (every 3 months). Watch for coccidiosis and respiratory issues.' }, { label: 'Housing', text: '1 sq ft per bird minimum. Nesting boxes for layers. Proper ventilation critical.' }] },
    { name: 'Sheep', icon: 'sheep', tips: [{ label: 'Feeding', text: 'Grazers - prefer grass. Supplement with hay in dry season. Provide mineral blocks.' }, { label: 'Health', text: 'Regular deworming important. Watch for foot rot and external parasites.' }, { label: 'Shearing', text: 'Shear annually (usually before rains). Prevent fly strike in warm weather.' }] },
    { name: 'Pigs', icon: 'pig', tips: [{ label: 'Feeding', text: 'Omnivores - can eat kitchen waste, grains, and commercial feed. Provide adequate protein.' }, { label: 'Health', text: 'Watch for African Swine Fever (no cure - prevention key). Regular deworming needed.' }, { label: 'Housing', text: 'Need shade and mud wallows. Keep pens clean. Separate farrowing sows.' }] },
    { name: 'Rabbits', icon: 'rabbit', tips: [{ label: 'Feeding', text: 'Hay should be 80% of diet. Fresh vegetables daily. Commercial pellets as supplement.' }, { label: 'Health', text: 'Watch for ear mites and respiratory infections. Keep environment clean and dry.' }, { label: 'Housing', text: 'Wire cages with solid rest area. Protect from extreme temperatures.' }] },
    { name: 'Fish (Aquaculture)', icon: 'fish', tips: [{ label: 'Feeding', text: 'Tilapia and Catfish are popular. Feed 2-3 times daily with commercial pellets or farm-made feeds.' }, { label: 'Health', text: 'Monitor water quality (pH 6.5-9.0). Watch for fungal infections and parasites. Avoid overcrowding.' }, { label: 'Pond Management', text: 'Ensure proper water flow. Stock at 2-5 fish per square meter. Harvest after 6-8 months.' }] }
];

// App State
var currentCounty = null;
var currentLocation = null;
var darkMode = false;
var currentTab = 'crops';
var chatHistory = [];
var deferredInstallPrompt = null;

// =====================================================
// INITIALIZATION
// =====================================================

function init() {
    console.log('AgriXen initializing...');
    
    loadSettings();
    initLocation();
    setupEventListeners();
    renderCrops();
    renderLivestock();
    renderVets();
    renderCommunityMessages();
    renderFarmersOfWeek();
    initAds();
    initImageOptimization();
    checkNotificationPermission();
    initPWAInstall();
    initVetRegisterForm();
    initAutoRefresh();
    initFarmersOnlinePopup();
    initActivityCycle();
    
    setTimeout(hideLoadingScreen, 1500);
}

// =====================================================
// AUTO-REFRESH - WEATHER & PWA UPDATES EVERY 1 HOUR
// =====================================================

var weatherRefreshInterval = null;
var swUpdateCheckInterval = null;
var lastWeatherRefresh = null;
var appLastVisible = Date.now();

function initAutoRefresh() {
    lastWeatherRefresh = Date.now();
    appLastVisible = Date.now();
    
    weatherRefreshInterval = setInterval(function() {
        if (currentLocation) {
            console.log('[AgriXen] Auto-refreshing weather...');
            loadWeather(currentLocation.lat, currentLocation.lon);
            lastWeatherRefresh = Date.now();
        }
    }, 3600000);
    
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            appLastVisible = Date.now();
        } else {
            var timeAway = Date.now() - appLastVisible;
            var fiveMinutes = 5 * 60 * 1000;
            
            if (currentLocation && timeAway >= (30 * 60 * 1000)) {
                console.log('[AgriXen] App focused after 30+ min, refreshing weather...');
                loadWeather(currentLocation.lat, currentLocation.lon);
                lastWeatherRefresh = Date.now();
            }
            
            if (timeAway >= fiveMinutes) {
                showWelcomeBackNotification(timeAway);
            }
        }
    });
    
    if ('serviceWorker' in navigator) {
        swUpdateCheckInterval = setInterval(function() {
            checkForSWUpdate();
        }, 3600000);
        
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden) {
                checkForSWUpdate();
            }
        });
        
        navigator.serviceWorker.addEventListener('controllerchange', function() {
            console.log('[AgriXen] New Service Worker activated, reloading...');
            window.location.reload();
        });
    }
    
    console.log('[AgriXen] Auto-refresh initialized - Weather & PWA updates every 1 hour');
}

function checkForSWUpdate() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then(function(registration) {
            if (registration) {
                console.log('[AgriXen] Checking for Service Worker updates...');
                registration.update().then(function() {
                    console.log('[AgriXen] SW update check complete');
                }).catch(function(err) {
                    console.log('[AgriXen] SW update check failed:', err);
                });
            }
        });
    }
}

function hideLoadingScreen() {
    var loading = document.getElementById('loadingScreen');
    var app = document.getElementById('app');
    
    if (loading) {
        loading.classList.add('fade-out');
        setTimeout(function() { 
            loading.style.display = 'none';
            loading.classList.remove('fade-out');
        }, 400);
    }
    
    if (app) {
        app.classList.remove('hidden');
    }
    
    if (currentLocation) {
        loadWeather(currentLocation.lat, currentLocation.lon);
    }
    
    console.log('AgriXen loaded successfully!');
    
    var hasSeenGuide = localStorage.getItem('agrixen_seen_guide');
    if (!hasSeenGuide) {
        // Guide is shown AFTER the PWA install popup (see install modal close handlers below).
        // Fallback: if no install modal appears within 10s, show guide directly.
        setTimeout(function() {
            if (localStorage.getItem('agrixen_seen_guide')) return;
            var anyModalOpen = document.querySelector('.modal:not(.hidden)');
            if (!anyModalOpen) {
                document.getElementById('barneGuideModal').classList.remove('hidden');
            }
        }, 10000);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// =====================================================
// PWA INSTALL HANDLING - AGGRESSIVE PROMPT
// =====================================================

var installPromptTimer = null;
var randomPromptInterval = null;

function initPWAInstall() {
    window.addEventListener('beforeinstallprompt', function(e) {
        console.log('Install prompt captured - PWA is installable');
        e.preventDefault();
        deferredInstallPrompt = e;
        localStorage.setItem('agrixen_pwa_installable', 'true');
    });
    
    window.addEventListener('appinstalled', function(e) {
        console.log('AgriXen installed successfully');
        deferredInstallPrompt = null;
        localStorage.setItem('agrixen_installed', 'true');
        localStorage.removeItem('agrixen_pwa_installable');
        clearInstallTimers();
        toast('AgriXen installed successfully!');
    });
    
    initAggressiveInstallPrompts();
}

function clearInstallTimers() {
    if (installPromptTimer) {
        clearTimeout(installPromptTimer);
        installPromptTimer = null;
    }
    if (randomPromptInterval) {
        clearInterval(randomPromptInterval);
        randomPromptInterval = null;
    }
}

function initAggressiveInstallPrompts() {
    var installed = localStorage.getItem('agrixen_installed');
    if (installed) return;
    
    installPromptTimer = setTimeout(function() {
        if (!localStorage.getItem('agrixen_installed') && deferredInstallPrompt) {
            showInstallModal();
        }
    }, 5000);
    
    randomPromptInterval = setInterval(function() {
        var randomDelay = Math.floor(Math.random() * 120000) + 120000;
        setTimeout(function() {
            var installModal = document.getElementById('installModal');
            if (!localStorage.getItem('agrixen_installed') && deferredInstallPrompt && installModal && installModal.classList.contains('hidden')) {
                showInstallModal();
            }
        }, randomDelay);
    }, 180000);
}

function showInstallPrompt() {
    var installModal = document.getElementById('installModal');
    var manualInstructions = document.getElementById('manualInstallInstructions');
    
    if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        deferredInstallPrompt.userChoice.then(function(choiceResult) {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
                localStorage.setItem('agrixen_installed', 'true');
                installModal.classList.add('hidden');
                showGuideAfterInstall();
            } else {
                console.log('User dismissed the install prompt');
                setInstallReminder();
                installModal.classList.add('hidden');
                showGuideAfterInstall();
            }
            deferredInstallPrompt = null;
        });
    } else {
        if (manualInstructions) manualInstructions.classList.remove('hidden');
        toast('Use your browser menu to "Add to Home Screen"');
    }
}

function showInstallModal() {
    var installModal = document.getElementById('installModal');
    var manualInstructions = document.getElementById('manualInstallInstructions');
    var isInstallable = deferredInstallPrompt !== null || localStorage.getItem('agrixen_pwa_installable') === 'true';
    
    if (manualInstructions) {
        if (isInstallable) manualInstructions.classList.add('hidden');
        else manualInstructions.classList.remove('hidden');
    }
    installModal.classList.remove('hidden');
}

function setInstallReminder() {
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    localStorage.setItem('agrixen_install_reminder', tomorrow.getTime());
}

function shouldShowInstallPrompt() {
    var installed = localStorage.getItem('agrixen_installed');
    if (installed) return false;
    var reminder = localStorage.getItem('agrixen_install_reminder');
    if (reminder) {
        var reminderTime = parseInt(reminder);
        if (Date.now() < reminderTime) return false;
    }
    return true;
}

// Shows the guide modal after the install modal is closed (for first-time users only)
function showGuideAfterInstall() {
    if (!localStorage.getItem('agrixen_seen_guide')) {
        setTimeout(function() {
            document.getElementById('barneGuideModal').classList.remove('hidden');
        }, 500);
    }
}

function isAppInstalled() {
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) return true;
    if (window.navigator && window.navigator.standalone === true) return true;
    if (document.referrer && document.referrer.startsWith('android-app://')) return true;
    if (localStorage.getItem('agrixen_installed')) {
        localStorage.removeItem('agrixen_installed');
        console.log('[AgriXen] Cleared stale installed flag');
    }
    return false;
}

function checkAndUpdateInstallButton() {
    var footerInstall = document.getElementById('footerInstall');
    if (!footerInstall) return;
    
    if (isAppInstalled()) {
        footerInstall.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>Installed';
        footerInstall.classList.add('installed');
    } else {
        footerInstall.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Install';
        footerInstall.classList.remove('installed');
    }
}

// =====================================================
// NOTIFICATION SYSTEM
// =====================================================

var notificationPromptTimer = null;
var randomNotificationInterval = null;
var notificationEnabled = false;

function checkNotificationPermission() {
    if (!('Notification' in window)) {
        console.log('This browser does not support notifications');
        checkLocationPrompt();
        return;
    }
    if (Notification.permission === 'granted') {
        notificationEnabled = true;
        checkLocationPrompt();
        return;
    }
    if (Notification.permission === 'denied') {
        checkLocationPrompt();
        return;
    }
    initAggressiveNotificationPrompts();
}

function clearNotificationTimers() {
    if (notificationPromptTimer) { clearTimeout(notificationPromptTimer); notificationPromptTimer = null; }
    if (randomNotificationInterval) { clearInterval(randomNotificationInterval); randomNotificationInterval = null; }
}

function initAggressiveNotificationPrompts() {
    if (notificationEnabled) return;
    if (Notification.permission === 'granted' || Notification.permission === 'denied') {
        checkLocationPrompt();
        return;
    }
    notificationPromptTimer = setTimeout(function() {
        if (!notificationEnabled && Notification.permission === 'default') {
            document.getElementById('notificationModal').classList.remove('hidden');
        }
    }, 3000);
    randomNotificationInterval = setInterval(function() {
        if (notificationEnabled) { clearNotificationTimers(); return; }
        var notificationModal = document.getElementById('notificationModal');
        if (Notification.permission === 'default' && notificationModal && notificationModal.classList.contains('hidden')) {
            var randomDelay = Math.floor(Math.random() * 90000) + 30000;
            setTimeout(function() {
                if (!notificationEnabled && Notification.permission === 'default') {
                    document.getElementById('notificationModal').classList.remove('hidden');
                }
            }, randomDelay);
        }
    }, 180000);
}

function checkLocationPrompt() {
    var savedCounty = localStorage.getItem('agrixen_county');
    if (!savedCounty) {
        setTimeout(function() {
            document.getElementById('locationModal').classList.remove('hidden');
        }, 1000);
    }
}

function requestNotificationPermission() {
    var modal = document.getElementById('notificationModal');
    modal.classList.add('hidden');
    if (!('Notification' in window)) { toast('Your browser does not support notifications'); checkLocationPrompt(); return; }
    var promise;
    try { promise = Notification.requestPermission(); } catch (e) { toast('Please enable notifications in your browser settings'); checkLocationPrompt(); return; }
    if (promise && typeof promise.then === 'function') {
        promise.then(function(permission) { handleNotificationResult(permission); }).catch(function(error) { console.error('Notification permission error:', error); toast('Could not request notification permission'); checkLocationPrompt(); });
    } else { checkLocationPrompt(); }
}

function handleNotificationResult(permission) {
    if (permission === 'granted') {
        notificationEnabled = true;
        toast('Notifications enabled! You will receive farming updates.');
        clearNotificationTimers();
        setTimeout(function() { sendNotification('Welcome to AgriXen!', 'You will now receive weather alerts and farming tips.'); }, 1000);
        scheduleRecurringNotifications();
    } else if (permission === 'denied') {
        notificationEnabled = true;
        toast('Notifications blocked. Enable them in browser settings if needed.');
        clearNotificationTimers();
    } else { toast('Notifications skipped. You can enable them anytime.'); }
    checkLocationPrompt();
}

function skipNotificationSetup() {
    document.getElementById('notificationModal').classList.add('hidden');
    checkLocationPrompt();
}

// =====================================================
// SCHEDULED NOTIFICATIONS
// =====================================================

var scheduledNotificationInterval = null;

function scheduleRecurringNotifications() {
    scheduledNotificationInterval = setInterval(checkScheduledNotifications, 60000);
    checkScheduledNotifications();
}

function checkScheduledNotifications() {
    if (Notification.permission !== 'granted') return;
    var now = new Date();
    var day = now.getDay();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var lastNotification = localStorage.getItem('agrixen_last_scheduled_notification');
    var today = now.toDateString();
    
    if (day === 5 && hours === 12 && minutes >= 0 && minutes < 5) {
        if (lastNotification !== today + '_friday') {
            sendNotification('\ud83c\udfc6 Farmers of the Week Updated!', 'Check out this week\'s top 3 farmers and their amazing harvests!');
            localStorage.setItem('agrixen_last_scheduled_notification', today + '_friday');
        }
    }
    if (day === 4 && hours === 8 && minutes >= 0 && minutes < 5) {
        if (lastNotification !== today + '_thursday') {
            sendNotification('\ud83c\udf3e Farmers of the Week - Submit Today!', 'Today is Thursday! Send your best harvest photos via WhatsApp to be featured!');
            localStorage.setItem('agrixen_last_scheduled_notification', today + '_thursday');
        }
    }
    if (day === 4 && hours === 16 && minutes >= 0 && minutes < 5) {
        if (lastNotification !== today + '_thursday_final') {
            sendNotification('\u23f0 Last Chance to Submit!', 'Tomorrow is Friday! Submit your harvest photos now to be featured this week!');
            localStorage.setItem('agrixen_last_scheduled_notification', today + '_thursday_final');
        }
    }
}

function sendNotification(title, body) {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    try {
        var options = { body: body, icon: 'icons/android-chrome-192x192.png', badge: 'icons/favicon-32x32.png', tag: 'agrixen-notification', requireInteraction: false, silent: false };
        var notification = new Notification(title, options);
        notification.onclick = function() { window.focus(); notification.close(); };
        setTimeout(function() { notification.close(); }, 10000);
    } catch (e) { console.log('Notification error:', e); }
}

function checkWeatherChange(newWeather) {
    var lastWeather = localStorage.getItem('agrixen_last_weather');
    if (lastWeather && lastWeather !== newWeather && Notification.permission === 'granted') {
        sendNotification('Weather Update', 'Weather has changed to ' + newWeather + '. Check the app for details.');
    }
    localStorage.setItem('agrixen_last_weather', newWeather);
}

// =====================================================
// AD SYSTEM - INDEPENDENT ROTATION WITH NO REPEAT
// =====================================================

function parseDuration(duration) {
    if (!duration) return 5000;
    var match = duration.match(/^(\d+)(s|m)$/);
    if (!match) return 5000;
    var value = parseInt(match[1]);
    var unit = match[2];
    if (unit === 's') return value * 1000;
    if (unit === 'm') return value * 60 * 1000;
    return 5000;
}

function initAds() { initSlotAds(); }

function createShuffledOrder(length) {
    var order = [];
    for (var i = 0; i < length; i++) order.push(i);
    for (var i = order.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = order[i]; order[i] = order[j]; order[j] = temp;
    }
    return order;
}

function initSlotAds() {
    var cropSlots = document.querySelectorAll('.crop-ad-slot');
    cropSlots.forEach(function(slot, i) { initIndividualSlot(slot, 'crop_' + i); });
    var livestockSlots = document.querySelectorAll('.livestock-ad-slot');
    livestockSlots.forEach(function(slot, i) { initIndividualSlot(slot, 'livestock_' + i); });
    var marketSlot1 = document.getElementById('marketAdSlot1');
    if (marketSlot1) initIndividualSlot(marketSlot1, 'market1');
    var marketSlot2 = document.getElementById('marketAdSlot2');
    if (marketSlot2) initIndividualSlot(marketSlot2, 'market2');
    var vetSlots = document.querySelectorAll('.vet-ad-slot');
    vetSlots.forEach(function(slot, i) { initIndividualSlot(slot, 'vet_' + i); });
}

function initIndividualSlot(container, slotId) {
    if (!container || SLOT_ADS.length === 0) return;
    adRotationOrder[slotId] = createShuffledOrder(SLOT_ADS.length);
    currentAdIndices[slotId] = 0;
    showSlotAd(container, slotId, 0);
    if (SLOT_ADS.length > 1) scheduleNextSlot(container, slotId);
}

function showSlotAd(container, slotId, positionIndex) {
    if (!container || SLOT_ADS.length === 0) return;
    var rotationOrder = adRotationOrder[slotId];
    var adIndex = rotationOrder[positionIndex % rotationOrder.length];
    var ad = SLOT_ADS[adIndex];
    var inner = container.querySelector('.ad-slot-inner') || container;
    inner.innerHTML = '<img src="' + ad.image + '" alt="' + ad.alt + '" onerror="this.style.display=\'none\'">';
    container.onclick = function(e) { e.stopPropagation(); window.open(ad.url, '_blank'); };
    container.style.cursor = 'pointer';
    currentAdIndices[slotId] = positionIndex;
}

function scheduleNextSlot(container, slotId) {
    if (adTimers[slotId]) clearTimeout(adTimers[slotId]);
    var currentIndex = currentAdIndices[slotId];
    var rotationOrder = adRotationOrder[slotId];
    var adIndex = rotationOrder[currentIndex % rotationOrder.length];
    var currentAd = SLOT_ADS[adIndex];
    var duration = parseDuration(currentAd.duration);
    adTimers[slotId] = setTimeout(function() {
        var nextIndex = currentIndex + 1;
        if (nextIndex >= rotationOrder.length) { adRotationOrder[slotId] = createShuffledOrder(SLOT_ADS.length); nextIndex = 0; }
        showSlotAd(container, slotId, nextIndex);
        scheduleNextSlot(container, slotId);
    }, duration);
}

// =====================================================
// LOCATION MANAGEMENT
// =====================================================

function initLocation() {
    var countySelect = document.getElementById('countySelect');
    var vetFilter = document.getElementById('vetCountyFilter');
    var counties = Object.keys(COUNTIES).sort();
    for (var i = 0; i < counties.length; i++) {
        var county = counties[i];
        var opt1 = document.createElement('option'); opt1.value = county; opt1.textContent = county; countySelect.appendChild(opt1);
        var opt2 = document.createElement('option'); opt2.value = county; opt2.textContent = county; vetFilter.appendChild(opt2);
    }
    var savedCounty = localStorage.getItem('agrixen_county');
    if (savedCounty && COUNTIES[savedCounty]) {
        currentCounty = savedCounty;
        currentLocation = COUNTIES[savedCounty];
        document.getElementById('currentLocation').textContent = savedCounty + ' County';
        countySelect.value = savedCounty;
    }
}

function selectCounty(county) {
    if (COUNTIES[county]) {
        currentCounty = county;
        currentLocation = COUNTIES[county];
        localStorage.setItem('agrixen_county', county);
        document.getElementById('currentLocation').textContent = county + ' County';
        document.getElementById('countySelect').value = county;
        loadWeather(currentLocation.lat, currentLocation.lon);
        renderCrops();
        document.getElementById('locationModal').classList.add('hidden');
        toast('Location updated to ' + county);
        var hasSeenGuide = localStorage.getItem('agrixen_seen_guide');
        if (!hasSeenGuide) {
            // First-time user: show install modal first, guide shows after install closes
            if (shouldShowInstallPrompt()) {
                setTimeout(function() { document.getElementById('installModal').classList.remove('hidden'); }, 1000);
            } else {
                setTimeout(function() { document.getElementById('barneGuideModal').classList.remove('hidden'); }, 500);
            }
        } else if (shouldShowInstallPrompt()) {
            setTimeout(function() { document.getElementById('installModal').classList.remove('hidden'); }, 1000);
        }
    }
}

// =====================================================
// WEATHER (Open-Meteo API)
// =====================================================

function loadWeather(lat, lon) {
    if (!lat || !lon) return;
    document.getElementById('weatherDesc').textContent = 'Fetching weather...';
    var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon + '&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto';
    fetch(url).then(function(response) { if (!response.ok) throw new Error('Weather API error'); return response.json(); }).then(function(data) { if (data.current) { updateWeatherDisplay(data); console.log('Weather loaded for:', currentCounty); } }).catch(function(error) { console.error('Weather error:', error); document.getElementById('weatherDesc').textContent = 'Unable to load weather'; });
}

function updateWeatherDisplay(data) {
    var current = data.current;
    var daily = data.daily;
    document.getElementById('weatherTemp').textContent = Math.round(current.temperature_2m) + 'C';
    var weatherInfo = getWeatherInfo(current.weather_code);
    document.getElementById('weatherDesc').textContent = weatherInfo.description;
    checkWeatherChange(weatherInfo.description);
    if (daily && daily.precipitation_probability_max) { document.getElementById('rainChance').textContent = daily.precipitation_probability_max[0] + '% rain'; }
    document.getElementById('windSpeed').textContent = Math.round(current.wind_speed_10m) + ' km/h';
    document.getElementById('humidity').textContent = current.relative_humidity_2m + '% humidity';
}

function getWeatherInfo(code) {
    var codes = { 0: { description: 'Clear sky' }, 1: { description: 'Mainly clear' }, 2: { description: 'Partly cloudy' }, 3: { description: 'Overcast' }, 45: { description: 'Foggy' }, 48: { description: 'Depositing rime fog' }, 51: { description: 'Light drizzle' }, 53: { description: 'Moderate drizzle' }, 55: { description: 'Dense drizzle' }, 56: { description: 'Light freezing drizzle' }, 57: { description: 'Dense freezing drizzle' }, 61: { description: 'Slight rain' }, 63: { description: 'Moderate rain' }, 65: { description: 'Heavy rain' }, 66: { description: 'Light freezing rain' }, 67: { description: 'Heavy freezing rain' }, 71: { description: 'Slight snow' }, 73: { description: 'Moderate snow' }, 75: { description: 'Heavy snow' }, 77: { description: 'Snow grains' }, 80: { description: 'Slight rain showers' }, 81: { description: 'Moderate rain showers' }, 82: { description: 'Violent rain showers' }, 85: { description: 'Slight snow showers' }, 86: { description: 'Heavy snow showers' }, 95: { description: 'Thunderstorm' }, 96: { description: 'Thunderstorm with slight hail' }, 99: { description: 'Thunderstorm with heavy hail' } };
    return codes[code] || { description: 'Unknown' };
}

// =====================================================
// CROPS SECTION
// =====================================================

function isCropFitForCounty(cropName, county) {
    if (!county || !COUNTY_CROP_FIT[county]) return false;
    return COUNTY_CROP_FIT[county].indexOf(cropName) !== -1;
}

function renderCrops() {
    var grid = document.getElementById('cropRecommendations');
    var guide = document.getElementById('plantingGuide');
    if (!grid) return;
    var currentMonth = new Date().toLocaleString('en', { month: 'short' });
    var html = '';
    for (var i = 0; i < CROP_DATA.length; i++) {
        var crop = CROP_DATA[i];
        var isSeason = crop.seasons.indexOf(currentMonth) !== -1;
        var isFit = isCropFitForCounty(crop.name, currentCounty);
        var cropIndex = i;
        if (i > 0 && i % 4 === 0) { html += '<div class="crop-ad-slot" data-ad-slot="true"><div class="ad-slot-inner"></div></div>'; }
        html += '<div class="crop-card' + (isSeason ? ' recommended' : '') + '" onclick="showCropDetails(' + cropIndex + ')" data-crop-index="' + cropIndex + '">';
        html += '<div class="crop-icon">' + getCropIcon(crop.icon) + '</div>';
        html += '<div class="crop-name">' + crop.name + '</div>';
        if (isFit && currentCounty) { html += '<span class="fit-badge" title="Recommended for ' + currentCounty + '">Fit</span>'; }
        if (isSeason) { html += '<span class="season-badge">In Season</span>'; }
        html += '<div class="tap-hint">Tap to learn more</div>';
        html += '</div>';
    }
    grid.innerHTML = html;
    initSlotAds();
    var guideHtml = '';
    var inSeasonCrops = CROP_DATA.filter(function(c) { return c.seasons.indexOf(currentMonth) !== -1; });
    if (inSeasonCrops.length > 0) { guideHtml += '<div class="guide-item"><div class="guide-title">Current Season (' + currentMonth + ')</div><div class="guide-text">Best crops to plant now: ' + inSeasonCrops.map(function(c) { return c.name; }).join(', ') + '</div></div>'; }
    if (currentCounty) { var fitCropsForCounty = COUNTY_CROP_FIT[currentCounty] || []; if (fitCropsForCounty.length > 0) { guideHtml += '<div class="guide-item"><div class="guide-title">Best Crops for ' + currentCounty + '</div><div class="guide-text">' + fitCropsForCounty.slice(0, 8).join(', ') + '</div></div>'; } }
    guideHtml += '<div class="guide-item"><div class="guide-title">General Tips</div><div class="guide-text">Plant at the onset of rains for best results. Prepare land early and use certified seeds. Apply fertilizer according to soil test recommendations.</div></div>';
    if (currentCounty) { guideHtml += '<div class="guide-item"><div class="guide-title">' + currentCounty + ' County</div><div class="guide-text">Check with your local agricultural extension officer for specific varieties suited to your area.</div></div>'; }
    guide.innerHTML = guideHtml;
}

function showCropDetails(index) {
    var crop = CROP_DATA[index];
    if (!crop) return;
    var modal = document.getElementById('cropDetailModal');
    var content = document.getElementById('cropDetailContent');
    var html = '<div class="crop-detail-header"><div class="crop-detail-icon">' + getCropIcon(crop.icon) + '</div><h3>' + crop.name + '</h3></div>';
    html += '<div class="crop-detail-grid">';
    html += '<div class="detail-item"><span class="detail-label">Days to Harvest</span><span class="detail-value">' + crop.daysToHarvest + '</span></div>';
    html += '<div class="detail-item"><span class="detail-label">Spacing</span><span class="detail-value">' + crop.spacing + '</span></div>';
    html += '<div class="detail-item"><span class="detail-label">Water Needs</span><span class="detail-value">' + crop.water + '</span></div>';
    html += '<div class="detail-item"><span class="detail-label">Soil Requirements</span><span class="detail-value">' + crop.soil + '</span></div>';
    html += '</div>';
    if (currentCounty) { var isFit = isCropFitForCounty(crop.name, currentCounty); if (isFit) { html += '<div class="crop-fit-notice"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg><span>Recommended for ' + currentCounty + ' County</span></div>'; } }
    html += '<div class="planting-months"><span class="detail-label">Best Planting Months</span><div class="month-tags">';
    for (var i = 0; i < crop.seasons.length; i++) { html += '<span class="month-tag">' + crop.seasons[i] + '</span>'; }
    html += '</div></div>';
    html += '<div class="crop-tip"><span class="tip-label">Pro Tip</span><p>' + crop.tips + '</p></div>';
    content.innerHTML = html;
    modal.classList.remove('hidden');
}

function getCropIcon(type) {
    var icons = { 'grain': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L12 22"/><path d="M5 12C5 12 8 9 12 9C16 9 19 12 19 12"/><path d="M5 16C5 16 8 13 12 13C16 13 19 16 19 16"/></svg>', 'legume': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="12" cy="12" rx="3" ry="8"/><path d="M9 6c-1.5-1-4 0-4 3"/><path d="M15 6c1.5-1 4 0 4 3"/></svg>', 'fruit': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="14" r="7"/><path d="M12 7V3"/><path d="M14 5c0-1.5 1-2 2-2"/></svg>', 'leaf': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>', 'tuber': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="12" cy="12" rx="8" ry="5"/><path d="M4 12c0 2 2 4 8 4s8-2 8-4"/><path d="M8 8c-1-2 0-4 2-4"/></svg>', 'bulb': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v4"/><path d="M8 4v2"/><path d="M16 4v2"/><ellipse cx="12" cy="14" rx="6" ry="7"/><path d="M9 21h6"/><path d="M10 19h4"/></svg>', 'root': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v6"/><path d="M8 6l4 2 4-2"/><ellipse cx="12" cy="14" rx="3" ry="6"/><path d="M9 14c-2 1-3 3-2 5"/><path d="M15 14c2 1 3 3 2 5"/></svg>' };
    return icons[type] || icons['grain'];
}

// =====================================================
// LIVESTOCK SECTION
// =====================================================

function renderLivestock() {
    var grid = document.getElementById('livestockGrid');
    if (!grid) return;
    var html = '';
    for (var i = 0; i < LIVESTOCK_DATA.length; i++) {
        var animal = LIVESTOCK_DATA[i];
        html += '<div class="livestock-card"><div class="livestock-header"><div class="livestock-icon">' + getLivestockIcon(animal.icon) + '</div><span class="livestock-name">' + animal.name + '</span></div><div class="livestock-body">';
        for (var j = 0; j < animal.tips.length; j++) { var tip = animal.tips[j]; html += '<div class="tip-item"><span class="tip-label">' + tip.label + '</span><span class="tip-text">' + tip.text + '</span></div>'; }
        html += '</div></div>';
        if ((i + 1) % 2 === 0) { html += '<div class="livestock-ad-slot" data-ad-slot="true"><div class="ad-slot-inner"></div></div>'; }
    }
    grid.innerHTML = html;
    initSlotAds();
}

function getLivestockIcon(type) {
    var icons = { 'cattle': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="12" cy="14" rx="8" ry="5"/><path d="M4 10c-1-3 1-5 3-5"/><path d="M20 10c1-3-1-5-3-5"/><circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><path d="M8 19v2M16 19v2"/></svg>', 'goat': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="12" cy="14" rx="7" ry="5"/><path d="M5 8l-3-4 5 2"/><path d="M19 8l3-4-5 2"/><circle cx="9" cy="11" r="1"/><circle cx="15" cy="11" r="1"/><path d="M9 19v2M15 19v2"/></svg>', 'poultry': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="12" cy="12" rx="6" ry="7"/><circle cx="12" cy="6" r="3"/><path d="M10 4l-2-2"/><path d="M14 4l2-2"/><path d="M9 19l-1 3"/><path d="M15 19l1 3"/></svg>', 'sheep': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="12" cy="13" rx="8" ry="6"/><circle cx="12" cy="5" r="3"/><path d="M8 19v2M16 19v2"/></svg>', 'pig': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="12" cy="13" rx="8" ry="6"/><ellipse cx="12" cy="7" rx="4" ry="3"/><circle cx="10" cy="7" r="1"/><circle cx="14" cy="7" r="1"/><path d="M8 19v2M16 19v2"/></svg>', 'rabbit': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="12" cy="14" rx="7" ry="5"/><circle cx="12" cy="7" r="4"/><path d="M8 5c-1-3 0-4 1-4"/><path d="M16 5c1-3 0-4-1-4"/><circle cx="10" cy="6" r="1"/><circle cx="14" cy="6" r="1"/></svg>', 'fish': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6.5 12c0 0 3.5-5 10-5c0 0-2 2.5-2 5s2 5 2 5c-6.5 0-10-5-10-5z"/><path d="M2 12l4.5-3v6L2 12z"/><circle cx="14" cy="12" r="1"/></svg>' };
    return icons[type] || icons['cattle'];
}

// =====================================================
// PRODUCE CALCULATOR
// =====================================================

function calculateProfit() {
    var produceType = document.getElementById('calcProduceType').value;
    var units = parseFloat(document.getElementById('calcUnits').value) || 0;
    var price = parseFloat(document.getElementById('calcPrice').value) || 0;
    var cost = parseFloat(document.getElementById('calcCost').value) || 0;
    if (units === 0 || price === 0) { toast('Please enter units and price'); return; }
    var revenue = units * price;
    var profit = revenue - cost;
    var profitMargin = revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : 0;
    var produceNames = { 'eggs': 'Eggs', 'milk': 'Milk (Litres)', 'rabbits': 'Rabbits', 'honey': 'Honey (kg)', 'chicken': 'Chicken (meat)', 'beef': 'Beef (kg)', 'pork': 'Pork (kg)', 'goat_meat': 'Goat Meat (kg)', 'sheep_meat': 'Mutton (kg)', 'manure': 'Manure (bags)' };
    var resultContainer = document.getElementById('calculatorResult');
    var isProfit = profit >= 0;
    var html = '<div class="result-card ' + (isProfit ? 'profit' : 'loss') + '"><div class="result-header"><div class="result-icon">' + (isProfit ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>') + '</div><span class="result-label">' + (isProfit ? 'Profit!' : 'Loss') + '</span></div>';
    html += '<div class="result-amount ' + (isProfit ? 'profit-text' : 'loss-text') + '">KES ' + Math.abs(profit).toLocaleString() + '</div>';
    html += '<div class="result-details"><div class="result-row"><span>Produce:</span><span>' + produceNames[produceType] + '</span></div><div class="result-row"><span>Units Sold:</span><span>' + units.toLocaleString() + '</span></div><div class="result-row"><span>Price/Unit:</span><span>KES ' + price.toLocaleString() + '</span></div><div class="result-row"><span>Total Revenue:</span><span>KES ' + revenue.toLocaleString() + '</span></div><div class="result-row"><span>Production Cost:</span><span>KES ' + cost.toLocaleString() + '</span></div><div class="result-row highlight"><span>Profit Margin:</span><span>' + profitMargin + '%</span></div></div>';
    if (!isProfit) { html += '<div class="result-tip">Consider reviewing your production costs or finding better market prices.</div>'; }
    html += '<button class="calc-done-btn" onclick="resetCalculator()">Done</button></div>';
    resultContainer.innerHTML = html;
    resultContainer.classList.remove('hidden');
}

function resetCalculator() {
    document.getElementById('calcProduceType').value = 'eggs';
    document.getElementById('calcUnits').value = '';
    document.getElementById('calcPrice').value = '';
    document.getElementById('calcCost').value = '';
    document.getElementById('calculatorResult').classList.add('hidden');
    document.getElementById('calculatorResult').innerHTML = '';
}

// =====================================================
// VETLINE SECTION
// =====================================================

function renderVets() {
    var grid = document.getElementById('vetListings');
    if (!grid) return;
    var countyFilter = document.getElementById('vetCountyFilter').value;
    var specialtyFilter = document.getElementById('vetSpecialtyFilter').value;
    var filtered = VET_CONTACTS.filter(function(v) {
        if (countyFilter && v.county !== 'All' && v.county !== countyFilter) return false;
        if (specialtyFilter && v.specialty !== 'mixed' && v.specialty !== specialtyFilter) return false;
        return true;
    });
    if (filtered.length === 0) { grid.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 2rem;">No vet contacts found for this filter.</p>'; return; }
    var html = '';
    for (var i = 0; i < filtered.length; i++) {
        var vet = filtered[i];
        html += '<div class="vet-card"><div class="vet-header"><div class="vet-avatar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div><div class="vet-info"><h4>' + vet.name + '</h4><p>' + vet.county + ' County</p></div></div><div class="vet-tags"><span class="vet-tag">' + vet.specialty + '</span></div><div class="vet-actions">';
        if (vet.phone) { html += '<a href="tel:' + vet.phone + '" class="vet-action-btn primary"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>Call</a>'; }
        html += '</div></div>';
        if (i < 5) { html += '<div class="vet-ad-slot" data-ad-slot="true"><div class="ad-slot-inner"></div></div>'; }
    }
    grid.innerHTML = html;
    initSlotAds();
}

// =====================================================
// VET REGISTRATION
// =====================================================

function initVetRegisterForm() {
    var vetRegisterCounty = document.getElementById('vetRegisterCounty');
    if (vetRegisterCounty) {
        var counties = Object.keys(COUNTIES).sort();
        for (var i = 0; i < counties.length; i++) { var opt = document.createElement('option'); opt.value = counties[i]; opt.textContent = counties[i]; vetRegisterCounty.appendChild(opt); }
    }
    var vetRegisterForm = document.getElementById('vetRegisterForm');
    if (vetRegisterForm) { vetRegisterForm.addEventListener('submit', handleVetRegisterSubmit); }
}

function showVetRegister() { document.getElementById('vetRegisterModal').classList.remove('hidden'); }
function closeVetRegister() { document.getElementById('vetRegisterModal').classList.add('hidden'); }
function closeVetRegisterSuccess() { document.getElementById('vetRegisterSuccessModal').classList.add('hidden'); }

function handleVetRegisterSubmit(e) {
    e.preventDefault();
    var form = e.target;
    var formData = new FormData(form);
    var submitBtn = form.querySelector('button[type="submit"]');
    var originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    fetch(form.action, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } }).then(function(response) { submitBtn.textContent = originalText; submitBtn.disabled = false; if (response.ok) { form.reset(); document.getElementById('vetRegisterModal').classList.add('hidden'); document.getElementById('vetRegisterSuccessModal').classList.remove('hidden'); } else { toast('Something went wrong. Please try again.'); } }).catch(function(error) { submitBtn.textContent = originalText; submitBtn.disabled = false; toast('Network error. Please check your connection.'); });
}

// =====================================================
// BARN-E AI
// =====================================================

function sendChatMessage() {
    var input = document.getElementById('chatInput');
    var topic = document.getElementById('topicType');
    var message = input.value.trim();
    if (!message) return;
    addChatMessage('user', message);
    input.value = '';
    chatHistory.push({ role: 'user', content: message });
    showTypingIndicator();
    callAI(message, topic.value);
}

function addChatMessage(sender, text, isHtml) {
    var messages = document.getElementById('chatMessages');
    var html = '<div class="chat-message ' + sender + '">';
    if (sender === 'user') { html += '<div class="message-avatar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>'; } else { html += '<div class="message-avatar ai-avatar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4"/></svg></div>'; }
    if (isHtml) { html += '<div class="message-content">' + text + '</div>'; } else { html += '<div class="message-content"><p>' + text + '</p></div>'; }
    html += '</div>';
    messages.insertAdjacentHTML('beforeend', html);
    messages.scrollTop = messages.scrollHeight;
}

function showTypingIndicator() {
    var messages = document.getElementById('chatMessages');
    var html = '<div class="chat-message bot typing"><div class="message-avatar ai-avatar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4"/></svg></div>';
    html += '<div class="message-content"><div class="typing-indicator"><span></span><span></span><span></span></div></div></div>';
    messages.insertAdjacentHTML('beforeend', html);
    messages.scrollTop = messages.scrollHeight;
}

function removeTypingIndicator() { var typing = document.querySelector('.chat-message.typing'); if (typing) typing.remove(); }

async function callAI(message, topic) {
    await new Promise(function(resolve) { setTimeout(resolve, 500); });
    removeTypingIndicator();
    if (typeof generateLocalResponse !== 'function') { console.error('[Barn-E] Error: generateLocalResponse function not found!'); addChatMessage('bot', '<p><strong>Error:</strong> Barn-E is not loaded properly. Please refresh the page.</p>', true); return; }
    var response = generateLocalResponse(message, topic);
    if (!response || response.trim() === '') { console.error('[Barn-E] Error: Empty response generated'); response = '<p><strong>Sorry, I had trouble processing that.</strong></p><p>Please try asking in a different way, or contact support:</p><ul><li>\ud83d\udce7 labs@mortappsstudios.com</li></ul>'; }
    addChatMessage('bot', response, true);
}

function buildSystemPrompt(topic) {
    var currentMonth = new Date().toLocaleString('en', { month: 'long' });
    var inSeasonCrops = CROP_DATA.filter(function(c) { return c.seasons.indexOf(new Date().toLocaleString('en', { month: 'short' })) !== -1; }).map(function(c) { return c.name; }).join(', ');
    var basePrompt = 'You are Barn-E, an expert AI farming assistant specifically designed for Kenyan farmers.\n\nCURRENT CONTEXT:\n- Current month: ' + currentMonth + '\n- Crops in season this month: ' + inSeasonCrops + '\n- You help farmers across all 47 counties of Kenya\n\nYOUR EXPERTISE:\n1. CROPS: Maize, beans, tomatoes, kale, potatoes, onions, cabbage, bananas, avocados, spinach, carrots, capsicum, watermelon, sorghum, millets, cassava, sweet potatoes, groundnuts, sugarcane, coffee, tea, rice, cowpeas, pumpkin, mangoes, passion fruit.\n\n2. LIVESTOCK: Dairy cattle, beef cattle, goats, chickens, sheep, pigs, rabbits, fish (aquaculture)\n\n3. LOCAL KNOWLEDGE: Kenya\'s two rainy seasons (March-May long rains, October-December short rains), common pests and diseases, local market prices trends.\n\nRESPONSE STYLE:\n- Be direct and practical\n- Give specific, actionable advice\n- Use local terminology (shamba, sukuma wiki)\n- For serious conditions, advise consulting a vet\n- Keep responses concise but thorough';
    if (topic === 'crops') { basePrompt += '\n\nFocus on: planting calendars, crop varieties, soil preparation, fertilizers, pest control, irrigation, harvesting.'; } else if (topic === 'livestock') { basePrompt += '\n\nFocus on: feeding regimes, disease prevention, vaccination schedules, housing, breeding tips.'; }
    return basePrompt;
}

function formatAIResponse(text) {
    var formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>').replace(/\u2022 (.*?)(?=<br>|$)/g, '<li>$1</li>');
    if (formatted.indexOf('<li>') !== -1) { formatted = formatted.replace(/(<li>.*?<\/li>)+/g, '<ul>$&</ul>'); }
    return '<p>' + formatted + '</p>';
}

// =====================================================
// MARKETPLACE - BUY/SELL FORMS
// =====================================================

function showBuyForm() { document.getElementById('buyFormModal').classList.remove('hidden'); }
function closeBuyForm() { document.getElementById('buyFormModal').classList.add('hidden'); }
function showSellForm() { document.getElementById('sellFormModal').classList.remove('hidden'); }
function closeSellForm() { document.getElementById('sellFormModal').classList.add('hidden'); }
function closeThankYouModal() { document.getElementById('thankYouModal').classList.add('hidden'); }

function handleFormSubmit(form, modalId) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        var formData = new FormData(form);
        fetch(form.action, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } }).then(function(response) { if (response.ok) { document.getElementById(modalId).classList.add('hidden'); form.reset(); document.getElementById('thankYouModal').classList.remove('hidden'); } else { toast('Something went wrong. Please try again.'); } }).catch(function(error) { toast('Network error. Please check your connection.'); });
    });
}

// =====================================================
// COMMUNITY MESSAGES
// =====================================================

function getCurrentActivityStatements() {
    var now = Date.now();
    var refreshInterval = 15 * 60 * 1000;
    if (!activityLastRefresh || (now - activityLastRefresh) > refreshInterval) {
        currentActivityStatements = ACTIVITY_STATEMENTS.slice().sort(function() { return 0.5 - Math.random(); });
        activityLastRefresh = now;
        activityCycleIndex = 0;
        visibleActivityCount = 0;
    }
    var minutes = new Date().getMinutes();
    var maxVisible = (minutes % 3 === 0) ? 2 : 1;
    var result = [];
    for (var i = 0; i < maxVisible && activityCycleIndex < currentActivityStatements.length; i++) { result.push(currentActivityStatements[activityCycleIndex]); activityCycleIndex++; }
    if (activityCycleIndex >= currentActivityStatements.length) { currentActivityStatements = ACTIVITY_STATEMENTS.slice().sort(function() { return 0.5 - Math.random(); }); activityCycleIndex = 0; }
    return result;
}

function getNextActivityStatement() {
    var now = Date.now();
    var refreshInterval = 15 * 60 * 1000;
    if (!activityLastRefresh || (now - activityLastRefresh) > refreshInterval) { currentActivityStatements = ACTIVITY_STATEMENTS.slice().sort(function() { return 0.5 - Math.random(); }); activityLastRefresh = now; activityCycleIndex = 0; }
    if (activityCycleIndex >= currentActivityStatements.length) { currentActivityStatements = ACTIVITY_STATEMENTS.slice().sort(function() { return 0.5 - Math.random(); }); activityCycleIndex = 0; }
    var activity = currentActivityStatements[activityCycleIndex];
    activityCycleIndex++;
    return activity;
}

function initActivityCycle() {
    if (activityCycleTimer) { clearInterval(activityCycleTimer); }
    setTimeout(function() {
        addActivityToDisplay();
        activityCycleTimer = setInterval(function() { if (visibleActivityCount < 3) { addActivityToDisplay(); } }, 180000);
    }, 30000);
}

function addActivityToDisplay() {
    var activity = getNextActivityStatement();
    if (!activity) return;
    var container = document.getElementById('communityMessages');
    if (!container) return;
    var activityId = 'activity_' + Date.now() + '_' + simpleHash(activity.text);
    var readMessages = getReadMessages();
    var isRead = readMessages.indexOf(activityId) !== -1;
    var tickClass = isRead ? 'read' : 'unread';
    var timeClass = isRead ? 'community-message-time activity-time read' : 'community-message-time activity-time';
    var activityEl = document.createElement('div');
    activityEl.className = 'community-message activity-message activity-' + activity.type;
    activityEl.setAttribute('data-activity', 'true');
    activityEl.setAttribute('data-message-id', activityId);
    var icon = activity.type === 'buy' ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>' : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>';
    activityEl.innerHTML = '<div class="community-message-avatar activity-avatar">' + icon + '</div><div class="community-message-content"><span class="community-message-name">Sales</span><p>' + activity.text + '</p><span class="' + timeClass + '">Just now <span class="message-ticks ' + tickClass + '">\u2713\u2713</span></span></div>';
    var manualMessages = container.querySelectorAll('.community-message:not([data-activity])');
    var lastManual = manualMessages.length > 0 ? manualMessages[manualMessages.length - 1] : null;
    if (lastManual) { if (lastManual.nextSibling) { container.insertBefore(activityEl, lastManual.nextSibling); } else { container.appendChild(activityEl); } } else { container.appendChild(activityEl); }
    visibleActivityCount++;
    notifyNewActivity(activity);
    var lifespan = (activity.maxAge || 20) * 60 * 1000;
    setTimeout(function() { if (activityEl && activityEl.parentNode) { activityEl.style.opacity = '0'; activityEl.style.transform = 'translateX(-20px)'; setTimeout(function() { activityEl.remove(); visibleActivityCount = Math.max(0, visibleActivityCount - 1); }, 300); } }, lifespan);
}

// =====================================================
// WHATSAPP-STYLE READ RECEIPTS
// =====================================================

function simpleHash(str) { var hash = 0; if (str.length === 0) return hash; for (var i = 0; i < str.length; i++) { var char = str.charCodeAt(i); hash = ((hash << 5) - hash) + char; hash = hash & hash; } return Math.abs(hash).toString(36); }

function getReadMessages() { try { var stored = localStorage.getItem('agrixen_read_messages'); return stored ? JSON.parse(stored) : []; } catch (e) { return []; } }
function saveReadMessages(readMessages) { try { localStorage.setItem('agrixen_read_messages', JSON.stringify(readMessages)); } catch (e) {} }

function markMessagesAsRead() {
    var readMessages = getReadMessages();
    var hasNew = false;
    var container = document.getElementById('communityMessages');
    if (!container) return;
    var messages = container.querySelectorAll('.community-message');
    messages.forEach(function(msgEl) {
        var msgId = msgEl.getAttribute('data-message-id');
        if (msgId && readMessages.indexOf(msgId) === -1) { readMessages.push(msgId); hasNew = true; var ticks = msgEl.querySelector('.message-ticks'); var time = msgEl.querySelector('.community-message-time'); if (ticks) { ticks.classList.remove('unread'); ticks.classList.add('read'); } if (time) { time.classList.add('read'); } }
    });
    if (hasNew) saveReadMessages(readMessages);
}

function notifyNewActivity(activity) {
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;
    if (activity.type !== 'sell') return;
    if (document.visibilityState === 'visible') return;
    try { var notification = new Notification('AgriXen Community', { body: activity.text, icon: 'icons/icon-192x192.png', badge: 'icons/icon-72x72.png', tag: 'agrixen-activity', renotify: false, silent: false }); setTimeout(function() { notification.close(); }, 5000); notification.onclick = function() { window.focus(); notification.close(); }; } catch (e) {}
}

// NOTE: checkNotificationPermission() and requestNotificationPermission() are defined
// earlier in this file (in the Notification Permission section) with full modal/aggressive logic.
// DO NOT re-declare them here — duplicate function declarations silently override the
// aggressive versions, breaking the notification prompt flow entirely.

function showWelcomeBackNotification(timeAway) {
    var minutes = Math.floor(timeAway / 60000);
    var hours = Math.floor(minutes / 60);
    var timeText = hours >= 1 ? hours + ' hour' + (hours > 1 ? 's' : '') : minutes + ' minute' + (minutes > 1 ? 's' : '');
    var activities = ACTIVITY_STATEMENTS.filter(function(a) { return a.type === 'sell'; });
    var randomActivity = activities[Math.floor(Math.random() * activities.length)];
    var toast = document.createElement('div');
    toast.className = 'welcome-back-toast';
    toast.innerHTML = '<div class="welcome-back-header">\ud83d\udc4b Welcome back!</div><div class="welcome-back-text">You were away for ' + timeText + '</div><div class="welcome-back-activity">\ud83d\udce6 ' + (randomActivity ? randomActivity.text.substring(0, 60) + '...' : 'New farming activity while you were gone!') + '</div>';
    document.body.appendChild(toast);
    setTimeout(function() { toast.classList.add('show'); }, 100);
    setTimeout(function() { toast.classList.remove('show'); setTimeout(function() { toast.remove(); }, 400); }, 6000);
}

function getFarmersOnlineCount() {
    var now = new Date();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    var baseCount;
    if (hour >= 5 && hour < 9) baseCount = 28;
    else if (hour >= 9 && hour < 12) baseCount = 35;
    else if (hour >= 12 && hour < 14) baseCount = 25;
    else if (hour >= 14 && hour < 18) baseCount = 38;
    else if (hour >= 18 && hour < 21) baseCount = 30;
    else baseCount = 18;
    var minuteVariation = Math.floor((minute / 60) * 5);
    var secondVariation = Math.floor((second / 60) * 3);
    var timeSeed = (hour * 3600 + minute * 60 + second);
    var pseudoRandom = Math.floor((Math.sin(timeSeed) + 1) * 3);
    return baseCount + minuteVariation + secondVariation + pseudoRandom;
}

var farmersOnlineTimer = null;
var farmersOnlineShown = false;

function initFarmersOnlinePopup() {
    if (farmersOnlineShown) return;
    farmersOnlineTimer = setTimeout(function() { showFarmersOnlineToast(); farmersOnlineShown = true; scheduleNextFarmersOnlinePopup(); }, 60000);
}

function scheduleNextFarmersOnlinePopup() {
    setTimeout(function() { showFarmersOnlineToast(); scheduleNextFarmersOnlinePopup(); }, 90000);
}

function showFarmersOnlineToast() {
    var count = getFarmersOnlineCount();
    var toast = document.createElement('div');
    toast.className = 'farmers-online-toast';
    toast.innerHTML = '<span class="online-dot"></span> <strong>' + count + '</strong> farmers are online right now';
    document.body.appendChild(toast);
    setTimeout(function() { toast.classList.add('show'); }, 100);
    setTimeout(function() { toast.classList.remove('show'); setTimeout(function() { toast.remove(); }, 300); }, 5000);
}

function renderCommunityMessages() {
    var container = document.getElementById('communityMessages');
    if (!container) return;
    var html = '';
    var readMessages = getReadMessages();
    for (var i = 0; i < COMMUNITY_MESSAGES.length; i++) {
        var msg = COMMUNITY_MESSAGES[i];
        var msgId = 'msg_' + i + '_' + simpleHash(msg.text);
        var isRead = readMessages.indexOf(msgId) !== -1;
        var tickClass = isRead ? 'read' : 'unread';
        var timeClass = isRead ? 'community-message-time read' : 'community-message-time';
        html += '<div class="community-message" data-message-id="' + msgId + '"><div class="community-message-avatar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="20 2 15 22 11 13 2 9 20 2"/></svg></div><div class="community-message-content">';
        if (msg.name) { html += '<span class="community-message-name">' + msg.name + '</span>'; }
        html += '<p>' + msg.text + '</p>';
        if (msg.image) { html += '<div class="community-message-image"><img src="' + msg.image + '" alt="Community image" loading="lazy" onerror="this.style.display=\'none\'"></div>'; }
        html += '<span class="' + timeClass + '">' + msg.time + '<span class="message-ticks ' + tickClass + '">\u2713\u2713</span></span></div></div>';
    }
    container.innerHTML = html;
    markMessagesAsRead();
}

// =====================================================
// FARMERS OF THE WEEK
// =====================================================

function shouldShowFarmers() {
    var now = new Date();
    var day = now.getDay();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var currentTime = hours * 60 + minutes;
    if (day === 5) return currentTime >= 720;
    else if (day === 6 || day === 0) return true;
    else if (day === 1) return currentTime < 720;
    return false;
}

function isThursday() { return new Date().getDay() === 4; }

function getFarmersWhatsAppLink() {
    var message = encodeURIComponent("Hello! I'd like to submit my harvest/produce for the Farmers of the Week feature. I'm already a member of the AgriXen community. Here are my details:\n\nMy Name:\nMy County:\nWhat I farm:\nAttached: Photos of my harvest");
    return 'https://wa.me/' + FARMERS_WHATSAPP_NUMBER + '?text=' + message;
}

function renderFarmersOfWeek() {
    var container = document.getElementById('farmersOfWeekContainer');
    if (!container) return;
    var showFarmers = shouldShowFarmers();
    var showSendButton = isThursday();
    var html = '';
    if (showFarmers && FARMERS_OF_THE_WEEK.length > 0) {
        html += '<div class="farmers-week-active"><div class="farmers-week-header"><h3>\ud83c\udfc6 Farmers of the Week</h3><span class="farmers-week-badge">This Week\'s Best</span></div><div class="farmers-week-grid">';
        for (var i = 0; i < FARMERS_OF_THE_WEEK.length && i < 3; i++) {
            var farmer = FARMERS_OF_THE_WEEK[i];
            var rank = i + 1;
            var rankClass = rank === 1 ? 'gold' : (rank === 2 ? 'silver' : 'bronze');
            var rankLabel = rank === 1 ? '\ud83e\udd47 1st' : (rank === 2 ? '\ud83e\udd48 2nd' : '\ud83e\udd49 3rd');
            var harvest1Name = farmer.harvest1Name || 'Harvest';
            var harvest2Name = farmer.harvest2Name || 'Harvest';
            html += '<div class="farmer-card"><div class="farmer-rank ' + rankClass + '">' + rankLabel + '</div><div class="farmer-profile"><img src="' + farmer.profilePic + '" alt="' + farmer.name + '" class="farmer-avatar protected-image" loading="lazy" onerror="this.src=\'icons/favicon-32x32.png\'"><span class="farmer-name">' + farmer.name + '</span></div>';
            if (farmer.story) { html += '<p class="farmer-story">' + farmer.story + '</p>'; }
            html += '<div class="farmer-harvests"><div class="harvest-img-container"><img src="' + farmer.harvest1 + '" alt="' + harvest1Name + '" class="farmer-harvest-img protected-image" loading="lazy" onerror="this.style.display=\'none\'"><span class="harvest-name-tag">' + harvest1Name + '</span></div><div class="harvest-img-container"><img src="' + farmer.harvest2 + '" alt="' + harvest2Name + '" class="farmer-harvest-img protected-image" loading="lazy" onerror="this.style.display=\'none\'"><span class="harvest-name-tag">' + harvest2Name + '</span></div></div></div>';
        }
        html += '</div><p class="farmers-week-note">\ud83c\udf89 Congratulations! Submit your best produce on Thursday to be featured next week.</p></div>';
    } else {
        html += '<div class="farmers-week-placeholder"><div class="farmers-week-header faded"><h3>\ud83c\udfc6 Farmers of the Week</h3></div>';
        if (showSendButton) { html += '<div class="farmers-week-tag thursday-active"><span>\ud83c\udf1f TODAY IS THURSDAY! Send your best harvest now to win one of 3 spots! \ud83c\udf1f</span></div>'; } else { html += '<div class="farmers-week-tag"><span>\ud83c\udf1f Send your best harvest on Thursday to win one of 3 spots & showcase your hard work to thousands! \ud83c\udf1f</span></div>'; }
        html += '<div class="farmers-week-grid faded">';
        for (var j = 0; j < 3; j++) {
            var pRank = j + 1; var pClass = pRank === 1 ? 'gold' : (pRank === 2 ? 'silver' : 'bronze'); var pLabel = pRank === 1 ? '\ud83e\udd47 1st' : (pRank === 2 ? '\ud83e\udd48 2nd' : '\ud83e\udd49 3rd');
            html += '<div class="farmer-card placeholder"><div class="farmer-rank ' + pClass + '">' + pLabel + '</div><div class="farmer-profile"><div class="farmer-avatar placeholder-avatar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div><span class="farmer-name">Your Name</span></div><div class="farmer-harvests"><div class="farmer-harvest-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg></div><div class="farmer-harvest-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg></div></div></div>';
        }
        html += '</div>';
        if (showSendButton) { html += '<a href="' + getFarmersWhatsAppLink() + '" target="_blank" class="farmers-send-btn thursday-btn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>Send Your Harvest via WhatsApp</a>'; }
        html += '</div>';
    }
    container.innerHTML = html;
    applyImageProtection();
}

// =====================================================
// THEME & SETTINGS
// =====================================================

function toggleTheme() {
    darkMode = !darkMode;
    document.body.classList.toggle('dark-mode', darkMode);
    saveSettings();
    var sun = document.querySelector('.sun-icon');
    var moon = document.querySelector('.moon-icon');
    if (sun && moon) { sun.classList.toggle('hidden', darkMode); moon.classList.toggle('hidden', !darkMode); }
}

function loadSettings() {
    try { var s = localStorage.getItem('agrixen_settings'); if (s) { var p = JSON.parse(s); darkMode = p.darkMode || false; } document.body.classList.toggle('dark-mode', darkMode); var sun = document.querySelector('.sun-icon'); var moon = document.querySelector('.moon-icon'); if (sun && moon) { sun.classList.toggle('hidden', darkMode); moon.classList.toggle('hidden', !darkMode); } } catch(e) {}
}

function saveSettings() { try { localStorage.setItem('agrixen_settings', JSON.stringify({ darkMode: darkMode })); } catch(e) {} }

// =====================================================
// TAB NAVIGATION
// =====================================================

function switchTab(tabName) {
    currentTab = tabName;
    var tabs = document.querySelectorAll('.tab-btn');
    for (var i = 0; i < tabs.length; i++) { tabs[i].classList.toggle('active', tabs[i].dataset.tab === tabName); }
    var contents = document.querySelectorAll('.tab-content');
    for (var i = 0; i < contents.length; i++) { contents[i].classList.add('hidden'); }
    var activeContent = document.getElementById(tabName + 'Tab');
    if (activeContent) { activeContent.classList.remove('hidden'); }
    if (tabName === 'market') { setTimeout(markMessagesAsRead, 100); }
}

// =====================================================
// EVENT LISTENERS
// =====================================================

function setupEventListeners() {
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.getElementById('locationBtn').addEventListener('click', function() { document.getElementById('locationModal').classList.remove('hidden'); });
    document.getElementById('locationDisplay').addEventListener('click', function() { document.getElementById('locationModal').classList.remove('hidden'); });
    document.getElementById('closeLocationModal').addEventListener('click', function() { document.getElementById('locationModal').classList.add('hidden'); });
    document.getElementById('confirmLocation').addEventListener('click', function() { var county = document.getElementById('countySelect').value; if (county) selectCounty(county); });
    var tabs = document.querySelectorAll('.tab-btn');
    for (var i = 0; i < tabs.length; i++) { tabs[i].addEventListener('click', function(e) { switchTab(e.currentTarget.dataset.tab); }); }
    document.getElementById('sendBtn').addEventListener('click', sendChatMessage);
    document.getElementById('chatInput').addEventListener('keypress', function(e) { if (e.key === 'Enter') sendChatMessage(); });
    document.getElementById('vetCountyFilter').addEventListener('change', renderVets);
    document.getElementById('vetSpecialtyFilter').addEventListener('change', renderVets);
    var vetRegisterBtn = document.getElementById('vetRegisterBtn');
    if (vetRegisterBtn) { vetRegisterBtn.addEventListener('click', function() { showVetRegister(); }); }
    var closeCropModal = document.getElementById('closeCropDetailModal');
    if (closeCropModal) { closeCropModal.addEventListener('click', function() { document.getElementById('cropDetailModal').classList.add('hidden'); }); }
    document.getElementById('enableNotifications').addEventListener('click', requestNotificationPermission);
    document.getElementById('skipNotifications').addEventListener('click', skipNotificationSetup);
    document.getElementById('closeBarneGuide').addEventListener('click', function() { localStorage.setItem('agrixen_seen_guide', 'true'); document.getElementById('barneGuideModal').classList.add('hidden'); });
    var closeInstallModal = document.getElementById('closeInstallModal');
    if (closeInstallModal) { closeInstallModal.addEventListener('click', function() { document.getElementById('installModal').classList.add('hidden'); showGuideAfterInstall(); }); }
    document.getElementById('installApp').addEventListener('click', function() { showInstallPrompt(); });
    document.getElementById('installLater').addEventListener('click', function() { setInstallReminder(); document.getElementById('installModal').classList.add('hidden'); showGuideAfterInstall(); });
    document.getElementById('calculateBtn').addEventListener('click', calculateProfit);
    document.getElementById('footerContact').addEventListener('click', function() { window.location.href = 'mailto:labs@mortappsstudios.com'; });
    document.getElementById('footerHelp').addEventListener('click', function() { document.getElementById('barneGuideModal').classList.remove('hidden'); });
    var footerInstall = document.getElementById('footerInstall');
    if (footerInstall) {
        checkAndUpdateInstallButton();
        footerInstall.addEventListener('click', function() { if (isAppInstalled()) { toast('\u2713 AgriXen is already installed!'); return; } if (deferredInstallPrompt) { showInstallPrompt(); } else { showInstallModal(); } });
    }
    handleFormSubmit(document.getElementById('buyForm'), 'buyFormModal');
    handleFormSubmit(document.getElementById('sellForm'), 'sellFormModal');
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape') { document.getElementById('locationModal').classList.add('hidden'); document.getElementById('cropDetailModal').classList.add('hidden'); document.getElementById('buyFormModal').classList.add('hidden'); document.getElementById('sellFormModal').classList.add('hidden'); document.getElementById('thankYouModal').classList.add('hidden'); document.getElementById('notificationModal').classList.add('hidden'); document.getElementById('barneGuideModal').classList.add('hidden'); document.getElementById('installModal').classList.add('hidden'); document.getElementById('vetRegisterModal').classList.add('hidden'); document.getElementById('vetRegisterSuccessModal').classList.add('hidden'); } });
    var modals = ['locationModal', 'cropDetailModal', 'buyFormModal', 'sellFormModal', 'thankYouModal', 'notificationModal', 'barneGuideModal', 'installModal', 'vetRegisterModal', 'vetRegisterSuccessModal'];
    modals.forEach(function(modalId) { var modal = document.getElementById(modalId); if (modal) { modal.addEventListener('click', function(e) { if (e.target.id === modalId) { e.target.classList.add('hidden'); } }); } });
}

// =====================================================
// UTILITIES
// =====================================================

function toast(msg) {
    var t = document.querySelector('.toast');
    if (t) t.remove();
    t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function() { t.classList.add('fade-out'); setTimeout(function() { t.remove(); }, 300); }, 2500);
}

// =====================================================
// IMAGE PROTECTION
// =====================================================

var imageProtectionToastShown = false;

function applyImageProtection() {
    var protectedImages = document.querySelectorAll('.protected-image');
    protectedImages.forEach(function(img) {
        img.addEventListener('contextmenu', function(e) { e.preventDefault(); e.stopPropagation(); if (!imageProtectionToastShown) { toast('Images are protected'); imageProtectionToastShown = true; } return false; });
        img.addEventListener('touchstart', function(e) { var self = this; this.longPressTimer = setTimeout(function() { e.preventDefault(); if (!imageProtectionToastShown) { toast('Images are protected'); imageProtectionToastShown = true; } }, 500); }, { passive: false });
        img.addEventListener('touchend', function(e) { if (this.longPressTimer) { clearTimeout(this.longPressTimer); } }, { passive: false });
        img.addEventListener('touchmove', function(e) { if (this.longPressTimer) { clearTimeout(this.longPressTimer); } }, { passive: false });
        img.addEventListener('dragstart', function(e) { e.preventDefault(); return false; });
        img.setAttribute('draggable', 'false');
        img.style.userSelect = 'none'; img.style.webkitUserSelect = 'none'; img.style.MozUserSelect = 'none'; img.style.msUserSelect = 'none'; img.style.webkitTouchCallout = 'none';
    });
    var harvestContainers = document.querySelectorAll('.harvest-img-container');
    harvestContainers.forEach(function(container) { container.addEventListener('contextmenu', function(e) { e.preventDefault(); if (!imageProtectionToastShown) { toast('Images are protected'); imageProtectionToastShown = true; } return false; }); });
}

// =====================================================
// IMAGE OPTIMIZATION
// =====================================================

function initImageOptimization() {
    var criticalImages = ['icons/android-chrome-192x192.png', 'icons/favicon-32x32.png'];
    criticalImages.forEach(function(src) { var img = new Image(); img.src = src; });
    var allImages = document.querySelectorAll('img:not([loading])');
    allImages.forEach(function(img) { img.setAttribute('loading', 'lazy'); });
    applyImageProtection();
}

// NOTE: generateLocalResponse() is loaded from barn-e.js
// Make sure barn-e.js is placed in the same folder as index.html and is loaded BEFORE app.js.

// Barn-E load check (runs immediately when app.js loads)
if (typeof generateLocalResponse !== 'function') {
    console.warn('[Barn-E] WARNING: barn-e.js not found or failed to load! Make sure the file exists in the same folder as index.html and is loaded BEFORE app.js. Barn-E AI chat will show an error until this is fixed.');
} else {
    console.log('[Barn-E] barn-e.js loaded successfully.');
}