/**
 * AgriXen - Smart Farming Assistant
 * Open Source - Free Forever - No Account Needed
 * Powered By MortApps Studios
 * 
 * PWA INSTALL & NOTIFICATION LOGIC:
 * - Install popup shows EVERY TIME until user installs the app
 * - Notification popup shows EVERY TIME until user enables notifications
 * - PWA installation is detected by checking display-mode
 * - Community message notifications sent to users who enabled notifications
 */

// =====================================================
// CONFIGURATION
// =====================================================

// Advertisement Configuration - Slot Ads Only
// Duration options: '5s' (5 sec), '10s' (10 sec), '1m' (1 min), '2m' (2 min)
var SLOT_ADS = [
    { image: 'ad-images/lmh-ad-slot.png', url: 'https://www.linkagemediahub.co.ke', alt: 'Linkage Media Hub', duration: '5s' },
    { image: 'ad-images/manji-ad-slot.png', url: 'https://manji.co.ke', alt: 'Manji Biscuits', duration: '10s' }
];

// Ad rotation state - independent for each slot with no-repeat logic
var adTimers = {};
var currentAdIndices = {};
var adRotationOrder = {};

// =====================================================
// VET CONTACTS - EASY TO EDIT (ADD YOUR VETS HERE)
// Format: { name: "Vet Name", county: "County", specialty: "specialty", phone: "number" }
// Specialty options: 'cattle', 'poultry', 'goats', 'mixed', 'all'
// County: Use exact county name or 'All' for nationwide
// =====================================================
var VET_CONTACTS = [
    { name: 'Kenya Veterinary Board', county: 'Nairobi', specialty: 'mixed', phone: '0202718370' },
    { name: 'FAO Kenya Emergency', county: 'All', specialty: 'mixed', phone: '+254207625000' },
    { name: 'Directorate of Veterinary Services', county: 'Nairobi', specialty: 'mixed', phone: '0202718870' },
    { name: 'Dr. Wanjiku Animal Clinic', county: 'Kiambu', specialty: 'cattle', phone: '0722123456' },
    { name: 'Nakuru Vet Centre', county: 'Nakuru', specialty: 'mixed', phone: '0733987654' },
    { name: 'Eldoret Poultry Specialists', county: 'Uasin Gishu', specialty: 'poultry', phone: '0755678901' }
];

// =====================================================
// COMMUNITY MESSAGES - EASY TO EDIT
// Add new messages here. Format:
// { name: "Sender Name", text: "Your message here", time: "Time stamp" }
// =====================================================
var COMMUNITY_MESSAGES = [
    { 
        name: "AgriXen Team",
        text: "Jambo! Karibu AgriXen Community. We're here to support your farming journey with crop tips, livestock advice, and market updates. Stay connected by joining our community above—click 'Join Us' to receive exclusive farming insights and seasonal alerts!",
        time: "Today"
    }
];

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
    'Nyandarua': ['Potatoes', 'Cabbage', 'Carrots', 'Peas', 'Pyrethrum', 'Wheat', 'Barley', 'Dairy', 'Tea'],
    'Nyeri': ['Coffee', 'Tea', 'Potatoes', 'Maize', 'Beans', 'Dairy', 'Bananas', 'Tomatoes'],
    'Kirinyaga': ['Rice', 'Coffee', 'Tea', 'Maize', 'Beans', 'Tomatoes', 'Bananas', 'Sorghum'],
    'Muranga': ['Coffee', 'Tea', 'Bananas', 'Macadamia', 'Avocado', 'Maize', 'Beans', 'Dairy'],
    'Kiambu': ['Coffee', 'Tea', 'Dairy', 'Horticulture', 'Flowers', 'Bananas', 'Avocado', 'Maize', 'Tomatoes'],
    'Meru': ['Coffee', 'Tea', 'Miraa', 'Bananas', 'Maize', 'Beans', 'Potatoes', 'Dairy', 'Avocado'],
    'Tharaka-Nithi': ['Miraa', 'Coffee', 'Mangoes', 'Maize', 'Sorghum', 'Millet', 'Cowpeas'],
    'Embu': ['Coffee', 'Tea', 'Cotton', 'Macadamia', 'Bananas', 'Maize', 'Beans'],
    'Nakuru': ['Maize', 'Wheat', 'Barley', 'Potatoes', 'Dairy', 'Flowers', 'Vegetables', 'Pyrethrum', 'Tomatoes'],
    'Kericho': ['Tea', 'Maize', 'Dairy', 'Pyrethrum', 'Wheat', 'Barley', 'Potatoes'],
    'Bomet': ['Tea', 'Maize', 'Dairy', 'Wheat', 'Potatoes', 'Pyrethrum', 'Vegetables'],
    'Nandi': ['Tea', 'Maize', 'Dairy', 'Sugarcane', 'Wheat', 'Pyrethrum'],
    'Uasin Gishu': ['Maize', 'Wheat', 'Barley', 'Dairy', 'Potatoes', 'Vegetables', 'Pyrethrum'],
    'Trans Nzoia': ['Maize', 'Wheat', 'Barley', 'Dairy', 'Coffee', 'Potatoes', 'Sunflower'],
    'Elgeyo-Marakwet': ['Maize', 'Wheat', 'Potatoes', 'Dairy', 'Passion Fruit', 'Vegetables'],
    'West Pokot': ['Sorghum', 'Millet', 'Maize', 'Cassava', 'Goats', 'Cattle', 'Beekeeping'],
    'Baringo': ['Aloe', 'Beekeeping', 'Goats', 'Cattle', 'Sorghum', 'Millet', 'Cassava', 'Mangoes'],
    'Laikipia': ['Wheat', 'Barley', 'Dairy', 'Cattle', 'Goats', 'Sheep', 'Wildlife', 'Horticulture'],
    'Narok': ['Wheat', 'Barley', 'Maize', 'Dairy', 'Cattle', 'Goats', 'Sheep', 'Pyrethrum'],
    'Samburu': ['Cattle', 'Goats', 'Sheep', 'Camels', 'Sorghum', 'Millet'],
    'Turkana': ['Sorghum', 'Millet', 'Goats', 'Cattle', 'Camels', 'Fishing', 'Aloe'],
    'Kakamega': ['Sugarcane', 'Maize', 'Tea', 'Dairy', 'Beans', 'Vegetables', 'Bananas'],
    'Vihiga': ['Tea', 'Sugarcane', 'Maize', 'Dairy', 'Avocado', 'Bananas', 'Vegetables'],
    'Bungoma': ['Sugarcane', 'Maize', 'Beans', 'Dairy', 'Sunflower', 'Vegetables', 'Bananas'],
    'Busia': ['Rice', 'Maize', 'Cotton', 'Sorghum', 'Millet', 'Cassava', 'Sweet Potatoes', 'Fishing'],
    'Kisumu': ['Rice', 'Fishing', 'Sugarcane', 'Cotton', 'Maize', 'Sorghum', 'Vegetables'],
    'Siaya': ['Rice', 'Fishing', 'Cotton', 'Sorghum', 'Maize', 'Cassava', 'Sweet Potatoes'],
    'Homa Bay': ['Fishing', 'Cotton', 'Sugarcane', 'Sorghum', 'Maize', 'Cassava', 'Sunflower'],
    'Migori': ['Sugarcane', 'Gold Mining', 'Maize', 'Sorghum', 'Millet', 'Cassava', 'Fishing'],
    'Kisii': ['Tea', 'Bananas', 'Dairy', 'Pyrethrum', 'Vegetables', 'Avocado', 'Passion Fruit'],
    'Nyamira': ['Tea', 'Bananas', 'Dairy', 'Vegetables', 'Avocado', 'Pyrethrum'],
    'Machakos': ['Mangoes', 'Oranges', 'Sorghum', 'Millet', 'Cowpeas', 'Pigeon Peas', 'Dairy', 'Vegetables'],
    'Makueni': ['Mangoes', 'Oranges', 'Sorghum', 'Millet', 'Cowpeas', 'Pigeon Peas', 'Green Grams', 'Beekeeping'],
    'Kitui': ['Mangoes', 'Sorghum', 'Millet', 'Cowpeas', 'Pigeon Peas', 'Green Grams', 'Beekeeping', 'Aloe', 'Cotton'],
    'Isiolo': ['Cattle', 'Goats', 'Camels', 'Sheep', 'Beekeeping', 'Sorghum', 'Millet'],
    'Marsabit': ['Cattle', 'Goats', 'Camels', 'Sheep', 'Sorghum', 'Millet', 'Fishing'],
    'Garissa': ['Cattle', 'Goats', 'Camels', 'Sheep', 'Sorghum', 'Millet', 'Watermelon'],
    'Mandera': ['Goats', 'Camels', 'Cattle', 'Sheep', 'Sorghum', 'Millet'],
    'Wajir': ['Goats', 'Camels', 'Cattle', 'Sheep', 'Sorghum', 'Millet'],
    'Mombasa': ['Coconut', 'Cashew Nuts', 'Mangoes', 'Vegetables', 'Fishing', 'Tourism'],
    'Kilifi': ['Cashew Nuts', 'Coconut', 'Mangoes', 'Oranges', 'Cassava', 'Sisal', 'Fishing'],
    'Kwale': ['Cashew Nuts', 'Coconut', 'Mangoes', 'Oranges', 'Cassava', 'Sisal', 'Fishing', 'Beekeeping'],
    'Taita-Taveta': ['Sisal', 'Dairy', 'Vegetables', 'Maize', 'Beans', 'Tomatoes', 'Oranges'],
    'Lamu': ['Fishing', 'Coconut', 'Mangoes', 'Tourism', 'Beekeeping'],
    'Tana River': ['Mangoes', 'Bananas', 'Maize', 'Rice', 'Cotton', 'Fishing', 'Cattle', 'Goats'],
    'Nairobi': ['Vegetables', 'Dairy', 'Poultry', 'Flowers', 'Horticulture', 'Mushrooms'],
    'Kajiado': ['Cattle', 'Goats', 'Sheep', 'Dairy', 'Maize', 'Beans', 'Tomatoes', 'Onions', 'Flowers']
};

// Extended Crop Data (26 crops)
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

// Livestock Data (8 animals)
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
// PWA INSTALL DETECTION - CRITICAL
// =====================================================

/**
 * Detect if the app is running as an installed PWA
 * This is used to determine if install popup should be shown
 */
function isRunningAsPWA() {
    // Check for standalone display mode (Chrome, Edge, etc.)
    var isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    
    // Check for iOS standalone mode
    var isIOSStandalone = window.navigator.standalone === true;
    
    // Check for Android Trusted Web Activity
    var isAndroidTWA = document.referrer && document.referrer.includes('android-app://');
    
    return isStandalone || isIOSStandalone || isAndroidTWA;
}

/**
 * Initialize PWA install handling
 */
function initPWAInstall() {
    // First check if already running as PWA
    if (isRunningAsPWA()) {
        console.log('[PWA] App is running as installed PWA - marking as installed');
        localStorage.setItem('agrixen_installed', 'true');
        deferredInstallPrompt = null;
        return;
    }
    
    // Listen for the install prompt event (only fires if PWA is installable)
    window.addEventListener('beforeinstallprompt', function(e) {
        console.log('[PWA] Install prompt event captured - PWA is installable');
        e.preventDefault();
        deferredInstallPrompt = e;
        localStorage.setItem('agrixen_pwa_installable', 'true');
    });
    
    // Listen for successful installation
    window.addEventListener('appinstalled', function(e) {
        console.log('[PWA] AgriXen installed successfully!');
        deferredInstallPrompt = null;
        localStorage.setItem('agrixen_installed', 'true');
        localStorage.removeItem('agrixen_pwa_installable');
        toast('AgriXen installed successfully!');
    });
}

/**
 * Check if install popup should be shown
 * Returns true if should show, false if already installed
 */
function shouldShowInstallPopup() {
    // If running as PWA, never show
    if (isRunningAsPWA()) {
        console.log('[PWA] Running as PWA - not showing install popup');
        return false;
    }
    
    // If explicitly marked as installed, don't show
    var installed = localStorage.getItem('agrixen_installed');
    if (installed === 'true') {
        console.log('[PWA] Marked as installed - not showing install popup');
        return false;
    }
    
    // Otherwise, ALWAYS show the popup
    console.log('[PWA] Will show install popup');
    return true;
}

// =====================================================
// NOTIFICATION SYSTEM - CORRECTED
// =====================================================

/**
 * Check notification permission and show modal if needed
 * Shows EVERY TIME until user enables notifications
 */
function checkNotificationPermission() {
    // Check if browser supports notifications
    if (!('Notification' in window)) {
        console.log('[Notification] Browser does not support notifications');
        // Proceed to next step (install check)
        checkInstallPrompt();
        return;
    }
    
    var permission = Notification.permission;
    console.log('[Notification] Current permission:', permission);
    
    // If already granted, don't show modal
    if (permission === 'granted') {
        console.log('[Notification] Already enabled');
        // Check for new community messages
        checkForNewCommunityMessages();
        // Proceed to install check
        checkInstallPrompt();
        return;
    }
    
    // If denied, show modal with instructions to enable in settings
    if (permission === 'denied') {
        console.log('[Notification] Permission denied - showing instructions');
        updateNotificationModalForDenied();
        document.getElementById('notificationModal').classList.remove('hidden');
        return;
    }
    
    // Permission is 'default' - show normal enable modal
    console.log('[Notification] Permission default - showing enable modal');
    // Reset modal to normal state (in case it was modified for denied)
    resetNotificationModal();
    document.getElementById('notificationModal').classList.remove('hidden');
}

/**
 * Update notification modal for denied permission state
 */
function updateNotificationModalForDenied() {
    var modal = document.getElementById('notificationModal');
    var desc = modal.querySelector('.notification-desc');
    var enableBtn = document.getElementById('enableNotifications');
    
    if (desc) {
        desc.innerHTML = 'You previously blocked notifications. To enable them:<br><br>' +
            '<strong>Chrome/Edge:</strong> Click the lock icon in the address bar → Site settings → Notifications → Allow<br>' +
            '<strong>Firefox:</strong> Click the permissions icon → Notification → Allow<br>' +
            '<strong>Safari:</strong> Safari menu → Preferences → Websites → Notifications → Allow AgriXen';
    }
    
    if (enableBtn) {
        enableBtn.textContent = 'I Understand';
        enableBtn.onclick = function() {
            localStorage.setItem('agrixen_notification_modal_closed', 'true');
            modal.classList.add('hidden');
            checkInstallPrompt();
        };
    }
}

/**
 * Reset notification modal to normal state
 */
function resetNotificationModal() {
    var modal = document.getElementById('notificationModal');
    var desc = modal.querySelector('.notification-desc');
    var enableBtn = document.getElementById('enableNotifications');
    
    if (desc) {
        desc.textContent = 'Get alerts for weather changes, planting seasons, harvesting tips, and important farming updates.';
    }
    
    if (enableBtn) {
        enableBtn.textContent = 'Enable Notifications';
        enableBtn.onclick = requestNotificationPermission;
    }
}

/**
 * Request notification permission
 */
function requestNotificationPermission() {
    var modal = document.getElementById('notificationModal');
    modal.classList.add('hidden');
    
    if (!('Notification' in window)) {
        toast('Your browser does not support notifications');
        checkInstallPrompt();
        return;
    }
    
    Notification.requestPermission().then(function(permission) {
        handleNotificationResult(permission);
    }).catch(function(error) {
        console.error('[Notification] Permission request error:', error);
        toast('Could not request notification permission');
        checkInstallPrompt();
    });
}

/**
 * Handle notification permission result
 */
function handleNotificationResult(permission) {
    console.log('[Notification] Permission result:', permission);
    
    if (permission === 'granted') {
        toast('Notifications enabled! You will receive farming updates.');
        // Send welcome notification
        setTimeout(function() {
            sendNotification('Welcome to AgriXen!', 'You will now receive weather alerts and farming tips.');
        }, 1000);
        // Check for new community messages
        checkForNewCommunityMessages();
    } else if (permission === 'denied') {
        toast('Notifications blocked. Enable them in browser settings if needed.');
    } else {
        toast('Notifications skipped. You can enable them anytime.');
    }
    
    // Proceed to install check
    checkInstallPrompt();
}

/**
 * Skip notification setup
 */
function skipNotificationSetup() {
    var modal = document.getElementById('notificationModal');
    modal.classList.add('hidden');
    // Proceed to install check
    checkInstallPrompt();
}

/**
 * Check if install popup should be shown
 */
function checkInstallPrompt() {
    if (!shouldShowInstallPopup()) {
        console.log('[Install] Not showing install popup');
        // Check location prompt
        checkLocationPrompt();
        return;
    }
    
    console.log('[Install] Showing install popup');
    showInstallModal();
}

/**
 * Send a notification
 */
function sendNotification(title, body) {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
        return;
    }
    
    try {
        var options = {
            body: body,
            icon: 'icons/android-chrome-192x192.png',
            badge: 'icons/favicon-32x32.png',
            tag: 'agrixen-notification',
            requireInteraction: false,
            silent: false
        };
        
        var notification = new Notification(title, options);
        
        notification.onclick = function() {
            window.focus();
            notification.close();
        };
        
        setTimeout(function() {
            notification.close();
        }, 10000);
        
    } catch (e) {
        console.log('[Notification] Error:', e);
    }
}

// =====================================================
// COMMUNITY MESSAGE NOTIFICATIONS
// =====================================================

/**
 * Check for new community messages and send notification
 */
function checkForNewCommunityMessages() {
    // Only proceed if notifications are enabled
    if (!('Notification' in window) || Notification.permission !== 'granted') {
        return;
    }
    
    // No messages to check
    if (!COMMUNITY_MESSAGES || COMMUNITY_MESSAGES.length === 0) {
        return;
    }
    
    // Get the latest message
    var latestMessage = COMMUNITY_MESSAGES[0];
    
    // Create a unique identifier for this message
    var messageId = latestMessage.name + '_' + latestMessage.time + '_' + latestMessage.text.substring(0, 30);
    
    // Get the last seen message ID
    var lastSeenId = localStorage.getItem('agrixen_last_community_message_id');
    
    // If different, there's a new message
    if (lastSeenId !== messageId) {
        console.log('[Community] New message detected');
        
        // Only notify if there was a previous message (not first visit)
        if (lastSeenId !== null) {
            sendNotification(
                '📢 ' + latestMessage.name,
                latestMessage.text.substring(0, 100) + (latestMessage.text.length > 100 ? '...' : '')
            );
        }
        
        // Update last seen
        localStorage.setItem('agrixen_last_community_message_id', messageId);
    }
}

// =====================================================
// INSTALL MODAL FUNCTIONS
// =====================================================

/**
 * Show install modal
 */
function showInstallModal() {
    var installModal = document.getElementById('installModal');
    var manualInstructions = document.getElementById('manualInstallInstructions');
    
    // Check if PWA is installable (has deferred prompt)
    var isInstallable = deferredInstallPrompt !== null || localStorage.getItem('agrixen_pwa_installable') === 'true';
    
    if (manualInstructions) {
        if (isInstallable) {
            manualInstructions.classList.add('hidden');
        } else {
            manualInstructions.classList.remove('hidden');
        }
    }
    
    installModal.classList.remove('hidden');
}

/**
 * Show the native install prompt
 */
function showInstallPrompt() {
    var installModal = document.getElementById('installModal');
    var manualInstructions = document.getElementById('manualInstallInstructions');
    
    if (deferredInstallPrompt) {
        // PWA is installable - show native prompt
        deferredInstallPrompt.prompt();
        deferredInstallPrompt.userChoice.then(function(choiceResult) {
            if (choiceResult.outcome === 'accepted') {
                console.log('[PWA] User accepted install');
                localStorage.setItem('agrixen_installed', 'true');
                installModal.classList.add('hidden');
            } else {
                console.log('[PWA] User dismissed install');
                // Don't set anything - will show again next visit
            }
            deferredInstallPrompt = null;
        });
    } else {
        // PWA not detected - show manual instructions
        if (manualInstructions) {
            manualInstructions.classList.remove('hidden');
        }
        toast('Use your browser menu to "Add to Home Screen"');
    }
}

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
    initAds();
    initPWAInstall();
    
    setTimeout(function() {
        hideLoadingScreen();
        
        // After loading, start the flow:
        // 1. Check notification permission (shows modal if needed)
        // 2. Check install prompt (shows modal if needed)
        // This order ensures notification is checked first
        checkNotificationPermission();
    }, 1500);
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
}

/**
 * Check if location prompt should be shown
 */
function checkLocationPrompt() {
    var savedCounty = localStorage.getItem('agrixen_county');
    if (!savedCounty) {
        console.log('[Location] No county set - showing location modal');
        setTimeout(function() {
            document.getElementById('locationModal').classList.remove('hidden');
        }, 500);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
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
        
        var opt1 = document.createElement('option');
        opt1.value = county;
        opt1.textContent = county;
        countySelect.appendChild(opt1);
        
        var opt2 = document.createElement('option');
        opt2.value = county;
        opt2.textContent = county;
        vetFilter.appendChild(opt2);
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
        
        // Show Barn-E guide after first location selection
        var hasSeenGuide = localStorage.getItem('agrixen_seen_guide');
        if (!hasSeenGuide) {
            setTimeout(function() {
                document.getElementById('barneGuideModal').classList.remove('hidden');
                localStorage.setItem('agrixen_seen_guide', 'true');
            }, 500);
        }
    }
}

// =====================================================
// WEATHER (Open-Meteo API)
// =====================================================

function loadWeather(lat, lon) {
    if (!lat || !lon) return;
    
    document.getElementById('weatherDesc').textContent = 'Fetching weather...';
    
    var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + lat + 
              '&longitude=' + lon + 
              '&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m' +
              '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max' +
              '&timezone=auto';
    
    fetch(url)
        .then(function(response) { 
            if (!response.ok) throw new Error('Weather API error');
            return response.json(); 
        })
        .then(function(data) {
            if (data.current) {
                updateWeatherDisplay(data);
            }
        })
        .catch(function(error) {
            console.error('Weather error:', error);
            document.getElementById('weatherDesc').textContent = 'Unable to load weather';
        });
}

function updateWeatherDisplay(data) {
    var current = data.current;
    var daily = data.daily;
    
    document.getElementById('weatherTemp').textContent = Math.round(current.temperature_2m) + 'C';
    
    var weatherInfo = getWeatherInfo(current.weather_code);
    document.getElementById('weatherDesc').textContent = weatherInfo.description;
    
    if (daily && daily.precipitation_probability_max) {
        document.getElementById('rainChance').textContent = daily.precipitation_probability_max[0] + '% rain';
    }
    
    document.getElementById('windSpeed').textContent = Math.round(current.wind_speed_10m) + ' km/h';
    document.getElementById('humidity').textContent = current.relative_humidity_2m + '% humidity';
}

function getWeatherInfo(code) {
    var codes = {
        0: { description: 'Clear sky' },
        1: { description: 'Mainly clear' },
        2: { description: 'Partly cloudy' },
        3: { description: 'Overcast' },
        45: { description: 'Foggy' },
        48: { description: 'Depositing rime fog' },
        51: { description: 'Light drizzle' },
        53: { description: 'Moderate drizzle' },
        55: { description: 'Dense drizzle' },
        61: { description: 'Slight rain' },
        63: { description: 'Moderate rain' },
        65: { description: 'Heavy rain' },
        71: { description: 'Slight snow' },
        73: { description: 'Moderate snow' },
        75: { description: 'Heavy snow' },
        80: { description: 'Slight rain showers' },
        81: { description: 'Moderate rain showers' },
        82: { description: 'Violent rain showers' },
        95: { description: 'Thunderstorm' },
        96: { description: 'Thunderstorm with hail' },
        99: { description: 'Thunderstorm with heavy hail' }
    };
    
    return codes[code] || { description: 'Unknown' };
}

// =====================================================
// CROPS SECTION
// =====================================================

function isCropFitForCounty(cropName, county) {
    if (!county || !COUNTY_CROP_FIT[county]) return false;
    var fitCrops = COUNTY_CROP_FIT[county];
    return fitCrops.indexOf(cropName) !== -1;
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
        
        if (i > 0 && i % 4 === 0) {
            html += '<div class="crop-ad-slot" data-ad-slot="true">';
            html += '<div class="ad-slot-inner"></div>';
            html += '</div>';
        }
        
        html += '<div class="crop-card' + (isSeason ? ' recommended' : '') + '" onclick="showCropDetails(' + cropIndex + ')" data-crop-index="' + cropIndex + '">';
        html += '<div class="crop-icon">' + getCropIcon(crop.icon) + '</div>';
        html += '<div class="crop-name">' + crop.name + '</div>';
        
        if (isFit && currentCounty) {
            html += '<span class="fit-badge" title="Recommended for ' + currentCounty + '">Fit</span>';
        }
        
        if (isSeason) {
            html += '<span class="season-badge">In Season</span>';
        }
        html += '<div class="tap-hint">Tap to learn more</div>';
        html += '</div>';
    }
    
    grid.innerHTML = html;
    initSlotAds();
    
    // Planting guide
    var guideHtml = '';
    var inSeasonCrops = CROP_DATA.filter(function(c) { return c.seasons.indexOf(currentMonth) !== -1; });
    
    if (inSeasonCrops.length > 0) {
        guideHtml += '<div class="guide-item">';
        guideHtml += '<div class="guide-title">Current Season (' + currentMonth + ')</div>';
        guideHtml += '<div class="guide-text">Best crops to plant now: ' + inSeasonCrops.map(function(c) { return c.name; }).join(', ') + '</div>';
        guideHtml += '</div>';
    }
    
    if (currentCounty) {
        var fitCropsForCounty = COUNTY_CROP_FIT[currentCounty] || [];
        if (fitCropsForCounty.length > 0) {
            guideHtml += '<div class="guide-item">';
            guideHtml += '<div class="guide-title">Best Crops for ' + currentCounty + '</div>';
            guideHtml += '<div class="guide-text">' + fitCropsForCounty.slice(0, 8).join(', ') + '</div>';
            guideHtml += '</div>';
        }
    }
    
    guideHtml += '<div class="guide-item">';
    guideHtml += '<div class="guide-title">General Tips</div>';
    guideHtml += '<div class="guide-text">Plant at the onset of rains for best results. Prepare land early and use certified seeds.</div>';
    guideHtml += '</div>';
    
    guide.innerHTML = guideHtml;
}

function showCropDetails(index) {
    var crop = CROP_DATA[index];
    if (!crop) return;
    
    var modal = document.getElementById('cropDetailModal');
    var content = document.getElementById('cropDetailContent');
    
    var html = '<div class="crop-detail-header">';
    html += '<div class="crop-detail-icon">' + getCropIcon(crop.icon) + '</div>';
    html += '<h3>' + crop.name + '</h3>';
    html += '</div>';
    
    html += '<div class="crop-detail-grid">';
    html += '<div class="detail-item"><span class="detail-label">Days to Harvest</span><span class="detail-value">' + crop.daysToHarvest + '</span></div>';
    html += '<div class="detail-item"><span class="detail-label">Spacing</span><span class="detail-value">' + crop.spacing + '</span></div>';
    html += '<div class="detail-item"><span class="detail-label">Water Needs</span><span class="detail-value">' + crop.water + '</span></div>';
    html += '<div class="detail-item"><span class="detail-label">Soil Requirements</span><span class="detail-value">' + crop.soil + '</span></div>';
    html += '</div>';
    
    if (currentCounty) {
        var isFit = isCropFitForCounty(crop.name, currentCounty);
        if (isFit) {
            html += '<div class="crop-fit-notice">';
            html += '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
            html += '<span>Recommended for ' + currentCounty + ' County</span>';
            html += '</div>';
        }
    }
    
    html += '<div class="planting-months"><span class="detail-label">Best Planting Months</span><div class="month-tags">';
    for (var i = 0; i < crop.seasons.length; i++) {
        html += '<span class="month-tag">' + crop.seasons[i] + '</span>';
    }
    html += '</div></div>';
    
    html += '<div class="crop-tip"><span class="tip-label">Pro Tip</span><p>' + crop.tips + '</p></div>';
    
    content.innerHTML = html;
    modal.classList.remove('hidden');
}

function getCropIcon(type) {
    var icons = {
        'grain': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L12 22"/><path d="M5 12C5 12 8 9 12 9C16 9 19 12 19 12"/><path d="M5 16C5 16 8 13 12 13C16 13 19 16 19 16"/></svg>',
        'legume': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="12" cy="12" rx="3" ry="8"/><path d="M9 6c-1.5-1-4 0-4 3"/><path d="M15 6c1.5-1 4 0 4 3"/></svg>',
        'fruit': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="14" r="7"/><path d="M12 7V3"/><path d="M14 5c0-1.5 1-2 2-2"/></svg>',
        'leaf': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>',
        'tuber': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="12" cy="12" rx="8" ry="5"/><path d="M4 12c0 2 2 4 8 4s8-2 8-4"/><path d="M8 8c-1-2 0-4 2-4"/></svg>',
        'bulb': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v4"/><path d="M8 4v2"/><path d="M16 4v2"/><ellipse cx="12" cy="14" rx="6" ry="7"/><path d="M9 21h6"/><path d="M10 19h4"/></svg>',
        'root': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v6"/><path d="M8 6l4 2 4-2"/><ellipse cx="12" cy="14" rx="3" ry="6"/><path d="M9 14c-2 1-3 3-2 5"/><path d="M15 14c2 1 3 3 2 5"/></svg>'
    };
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
        
        html += '<div class="livestock-card">';
        html += '<div class="livestock-header">';
        html += '<div class="livestock-icon">' + getLivestockIcon(animal.icon) + '</div>';
        html += '<span class="livestock-name">' + animal.name + '</span>';
        html += '</div>';
        html += '<div class="livestock-body">';
        
        for (var j = 0; j < animal.tips.length; j++) {
            var tip = animal.tips[j];
            html += '<div class="tip-item">';
            html += '<span class="tip-label">' + tip.label + '</span>';
            html += '<span class="tip-text">' + tip.text + '</span>';
            html += '</div>';
        }
        
        html += '</div></div>';
        
        if ((i + 1) % 2 === 0) {
            html += '<div class="livestock-ad-slot" data-ad-slot="true">';
            html += '<div class="ad-slot-inner"></div>';
            html += '</div>';
        }
    }
    
    grid.innerHTML = html;
    initSlotAds();
}

function getLivestockIcon(type) {
    var icons = {
        'cattle': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="12" cy="14" rx="8" ry="5"/><path d="M4 10c-1-3 1-5 3-5"/><path d="M20 10c1-3-1-5-3-5"/><circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><path d="M8 19v2M16 19v2"/></svg>',
        'goat': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="12" cy="14" rx="7" ry="5"/><path d="M5 8l-3-4 5 2"/><path d="M19 8l3-4-5 2"/><circle cx="9" cy="11" r="1"/><circle cx="15" cy="11" r="1"/><path d="M9 19v2M15 19v2"/></svg>',
        'poultry': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="12" cy="12" rx="6" ry="7"/><circle cx="12" cy="6" r="3"/><path d="M10 4l-2-2"/><path d="M14 4l2-2"/><path d="M9 19l-1 3"/><path d="M15 19l1 3"/></svg>',
        'sheep': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="12" cy="13" rx="8" ry="6"/><circle cx="12" cy="5" r="3"/><path d="M8 19v2M16 19v2"/></svg>',
        'pig': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="12" cy="13" rx="8" ry="6"/><ellipse cx="12" cy="7" rx="4" ry="3"/><circle cx="10" cy="7" r="1"/><circle cx="14" cy="7" r="1"/><path d="M8 19v2M16 19v2"/></svg>',
        'rabbit': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="12" cy="14" rx="7" ry="5"/><circle cx="12" cy="7" r="4"/><path d="M8 5c-1-3 0-4 1-4"/><path d="M16 5c1-3 0-4-1-4"/><circle cx="10" cy="6" r="1"/><circle cx="14" cy="6" r="1"/></svg>',
        'fish': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6.5 12c0 0 3.5-5 10-5c0 0-2 2.5-2 5s2 5 2 5c-6.5 0-10-5-10-5z"/><path d="M2 12l4.5-3v6L2 12z"/><circle cx="14" cy="12" r="1"/></svg>'
    };
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
    
    if (units === 0 || price === 0) {
        toast('Please enter units and price');
        return;
    }
    
    var revenue = units * price;
    var profit = revenue - cost;
    var profitMargin = revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : 0;
    
    var produceNames = {
        'eggs': 'Eggs',
        'milk': 'Milk (Litres)',
        'rabbits': 'Rabbits',
        'honey': 'Honey (kg)',
        'chicken': 'Chicken (meat)',
        'beef': 'Beef (kg)',
        'pork': 'Pork (kg)',
        'goat_meat': 'Goat Meat (kg)',
        'sheep_meat': 'Mutton (kg)',
        'manure': 'Manure (bags)'
    };
    
    var resultContainer = document.getElementById('calculatorResult');
    var isProfit = profit >= 0;
    
    var html = '<div class="result-card ' + (isProfit ? 'profit' : 'loss') + '">';
    html += '<div class="result-header">';
    html += '<div class="result-icon">' + (isProfit ? 
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' : 
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>') + '</div>';
    html += '<span class="result-label">' + (isProfit ? 'Profit!' : 'Loss') + '</span>';
    html += '</div>';
    
    html += '<div class="result-amount ' + (isProfit ? 'profit-text' : 'loss-text') + '">';
    html += 'KES ' + Math.abs(profit).toLocaleString();
    html += '</div>';
    
    html += '<div class="result-details">';
    html += '<div class="result-row"><span>Produce:</span><span>' + produceNames[produceType] + '</span></div>';
    html += '<div class="result-row"><span>Units Sold:</span><span>' + units.toLocaleString() + '</span></div>';
    html += '<div class="result-row"><span>Price/Unit:</span><span>KES ' + price.toLocaleString() + '</span></div>';
    html += '<div class="result-row"><span>Total Revenue:</span><span>KES ' + revenue.toLocaleString() + '</span></div>';
    html += '<div class="result-row"><span>Production Cost:</span><span>KES ' + cost.toLocaleString() + '</span></div>';
    html += '<div class="result-row highlight"><span>Profit Margin:</span><span>' + profitMargin + '%</span></div>';
    html += '</div>';
    
    if (!isProfit) {
        html += '<div class="result-tip">Consider reviewing your production costs or finding better market prices.</div>';
    }
    
    html += '<button class="calc-done-btn" onclick="resetCalculator()">Done</button>';
    html += '</div>';
    
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
    
    if (filtered.length === 0) {
        grid.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 2rem;">No vet contacts found for this filter.</p>';
        return;
    }
    
    var html = '';
    for (var i = 0; i < filtered.length; i++) {
        var vet = filtered[i];
        
        html += '<div class="vet-card">';
        html += '<div class="vet-header">';
        html += '<div class="vet-avatar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div>';
        html += '<div class="vet-info"><h4>' + vet.name + '</h4>';
        html += '<p>' + vet.county + ' County</p></div>';
        html += '</div>';
        html += '<div class="vet-tags"><span class="vet-tag">' + vet.specialty + '</span></div>';
        html += '<div class="vet-actions">';
        
        if (vet.phone) {
            html += '<a href="tel:' + vet.phone + '" class="vet-action-btn primary">';
            html += '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';
            html += 'Call</a>';
        }
        
        html += '</div></div>';
        
        if (i < 5) {
            html += '<div class="vet-ad-slot" data-ad-slot="true">';
            html += '<div class="ad-slot-inner"></div>';
            html += '</div>';
        }
    }
    
    grid.innerHTML = html;
    initSlotAds();
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
    if (sender === 'user') {
        html += '<div class="message-avatar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>';
    } else {
        html += '<div class="message-avatar ai-avatar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4"/></svg></div>';
    }
    
    if (isHtml) {
        html += '<div class="message-content">' + text + '</div>';
    } else {
        html += '<div class="message-content"><p>' + text + '</p></div>';
    }
    
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

function removeTypingIndicator() {
    var typing = document.querySelector('.chat-message.typing');
    if (typing) typing.remove();
}

async function callAI(message, topic) {
    await new Promise(function(resolve) { setTimeout(resolve, 500); });
    
    removeTypingIndicator();
    
    var response = generateLocalResponse(message, topic);
    addChatMessage('bot', response, true);
}



// =====================================================
// BARN-E AI - LOCAL RESPONSE ENGINE
// =====================================================
// ★★★ EXPAND THIS SECTION WITH MORE FARMING KNOWLEDGE ★★★
function generateLocalResponse(message, topic) {
    var lowerMsg = message.toLowerCase();
    var currentMonth = new Date().toLocaleString('en', { month: 'short' });
    var currentMonthFull = new Date().toLocaleString('en', { month: 'long' });
    var html = '';
    
    // =====================================================
    // STEP 1: CHECK SPECIFIC INTENT QUERIES FIRST
    // These must be checked BEFORE any keyword matching!
    // =====================================================
    
    // "What can I plant" - MUST be before any "plant" keyword matching
    if (lowerMsg.match(/\b(what can i plant|what to plant|can i plant|should i plant|what should i plant)\b/)) {
        var inSeasonCrops = CROP_DATA.filter(function(c) { return c.seasons.indexOf(currentMonth) !== -1; });
        html = '<p><strong>🌱 What to Plant in ' + currentMonthFull + '</strong></p>';
        html += '<p><strong>Crops in season NOW:</strong></p>';
        html += '<ul>';
        for (var i = 0; i < Math.min(8, inSeasonCrops.length); i++) {
            html += '<li>' + inSeasonCrops[i].name + '</li>';
        }
        html += '</ul>';
        html += '<p><strong>Kenya Planting Calendar:</strong></p>';
        html += '<ul>';
        html += '<li><strong>Long Rains (Mar-May):</strong> Maize, beans, potatoes, vegetables, rice</li>';
        html += '<li><strong>Short Rains (Oct-Dec):</strong> Maize, beans, sorghum, millet, cowpeas</li>';
        html += '</ul>';
        html += '<p><em>Tap on crops in the Crops tab for detailed planting guides!</em></p>';
        return html;
    }
    
    // "plant now" or "plant this month"
    if (lowerMsg.match(/\b(plant now|plant this month|planting now|planting this month)\b/)) {
        var inSeasonCrops = CROP_DATA.filter(function(c) { return c.seasons.indexOf(currentMonth) !== -1; });
        html = '<p><strong>🌱 What to Plant in ' + currentMonthFull + '</strong></p>';
        html += '<p><strong>Crops in season NOW:</strong></p>';
        html += '<ul>';
        for (var i = 0; i < Math.min(8, inSeasonCrops.length); i++) {
            html += '<li>' + inSeasonCrops[i].name + '</li>';
        }
        html += '</ul>';
        html += '<p><em>Set your county for location-specific recommendations!</em></p>';
        return html;
    }
    
    // "What do you know" / capabilities
    if (lowerMsg.match(/\b(what do you know|what can you|your capabilities|your abilities|what you know|what are your features|what can i ask)\b/)) {
        html = '<p><strong>Here is what I know! 🧠</strong></p>';
        html += '<p><strong>🌱 CROPS (26 types):</strong></p>';
        html += '<p>Cereals: Maize, Rice, Sorghum, Millet</p>';
        html += '<p>Vegetables: Tomatoes, Kale, Cabbage, Spinach, Onions, Carrots, Capsicum</p>';
        html += '<p>Roots: Potatoes, Sweet Potatoes, Cassava</p>';
        html += '<p>Legumes: Beans, Cowpeas, Groundnuts</p>';
        html += '<p>Fruits: Bananas, Mangoes, Avocados, Watermelon, Passion Fruit, Pumpkin</p>';
        html += '<p>Cash Crops: Coffee, Tea, Sugarcane</p>';
        html += '<p><strong>🐄 LIVESTOCK (8 types):</strong></p>';
        html += '<p>Dairy Cattle, Beef Cattle, Goats, Poultry, Sheep, Pigs, Rabbits, Fish</p>';
        html += '<p><strong>🐛 PESTS & DISEASES:</strong></p>';
        html += '<p>Armyworms, Aphids, Blights, Wilts, Newcastle, Mastitis, ASF, Coccidiosis</p>';
        html += '<p><strong>🧪 OTHER:</strong> Soil, Fertilizers, Manure, Compost, Irrigation, Harvesting, Storage</p>';
        html += '<p><em>Just ask! Example: "Tell me about maize" or "How to treat aphids?"</em></p>';
        return html;
    }
    
    // =====================================================
    // STEP 2: GREETINGS & CASUAL CONVERSATION
    // =====================================================
    
    if (lowerMsg.match(/^(hi|hello|hey|greetings|howdy|jambo|hujambo|sasa|niaje|mambo|vipi|habari)\b/) || 
        lowerMsg.match(/\b(hi there|hello there|hey there)\b/)) {
        html = '<p><strong>Jambo sana!</strong> Habari yako? 👋</p>';
        html += '<p>I am <strong>Barn-E</strong>, your AI farming assistant for Kenya!</p>';
        html += '<p><strong>I can help you with:</strong></p>';
        html += '<ul>';
        html += '<li>🌱 <strong>Crops:</strong> 26 crops with planting guides</li>';
        html += '<li>🐄 <strong>Livestock:</strong> Care for cattle, goats, chickens, and more</li>';
        html += '<li>🐛 <strong>Pests & Diseases:</strong> Identification and treatment</li>';
        html += '<li>💰 <strong>Market:</strong> Buying, selling, profit calculation</li>';
        html += '</ul>';
        html += '<p><em>Try: "What can I plant now?" or "Tell me about tomatoes"</em></p>';
        return html;
    }
    
    if (lowerMsg.match(/\b(good morning|morning|habari za asubuhi)\b/)) {
        html = '<p><strong>Good morning, farmer! ☀️</strong></p>';
        html += '<p>Asante kwa kuamka mapema!</p>';
        html += '<p><strong>How can I help?</strong></p>';
        html += '<ul>';
        html += '<li>🌱 Check crops to plant this month</li>';
        html += '<li>🐄 Get livestock tips</li>';
        html += '<li>🐛 Identify pests/diseases</li>';
        html += '</ul>';
        return html;
    }
    
    if (lowerMsg.match(/\b(good afternoon|afternoon)\b/)) {
        html = '<p><strong>Good afternoon! 🌤️</strong></p>';
        html += '<p>How is your shamba? Ask me anything about farming!</p>';
        return html;
    }
    
    if (lowerMsg.match(/\b(good evening|evening)\b/)) {
        html = '<p><strong>Good evening! 🌅</strong></p>';
        html += '<p>Hope you had a productive day! How can I help?</p>';
        return html;
    }
    
    if (lowerMsg.match(/\b(how are you|how r u|vipi wewe|habari yako)\b/)) {
        html = '<p><strong>Poasana, asante sana! 😊</strong></p>';
        html += '<p>I am doing great and ready to help with farming!</p>';
        html += '<p>What would you like to know?</p>';
        return html;
    }
    
    if (lowerMsg.match(/\b(thank you|thanks|asante|asante sana|shukrani)\b/)) {
        html = '<p><strong>Karibu sana! 🙏</strong></p>';
        html += '<p>Feel free to ask anything else. Happy farming!</p>';
        return html;
    }
    
    if (lowerMsg.match(/^(bye|goodbye|see you|kwaheri|ta-ta|later)\b/)) {
        html = '<p><strong>Kwaheri! Take care of your shamba! 👋</strong></p>';
        html += '<p>Come back anytime!</p>';
        return html;
    }
    
    if (lowerMsg.match(/\b(who are you|what are you|your name|tell me about yourself)\b/)) {
        html = '<p><strong>I am Barn-E! 🤖</strong></p>';
        html += '<p>AI assistant for <strong>AgriXen</strong> - a free farming app for Kenyan farmers!</p>';
        html += '<p><strong>I help with:</strong> 26 crops, 8 livestock types, pests & diseases, market tips</p>';
        html += '<p><strong>100% FREE</strong> - no account needed!</p>';
        return html;
    }
    
    if (lowerMsg.match(/\b(who made|who created|developer|mortapps|built this|created this)\b/)) {
        html = '<p><strong>AgriXen was created by MortApps Studios!</strong></p>';
        html += '<p><strong>Contact:</strong></p>';
        html += '<ul>';
        html += '<li>📧 labs@mortappsstudios.com</li>';
        html += '<li>📧 agrixen.ke@gmail.com</li>';
        html += '<li>📱 +254 113 400 063</li>';
        html += '</ul>';
        return html;
    }
    
    if (lowerMsg.match(/\b(contact|support|phone number|email address|help desk)\b/)) {
        html = '<p><strong>Contact AgriXen:</strong></p>';
        html += '<ul>';
        html += '<li>📧 labs@mortappsstudios.com</li>';
        html += '<li>📧 agrixen.ke@gmail.com</li>';
        html += '<li>📱 +254 113 400 063</li>';
        html += '</ul>';
        return html;
    }
    
    // =====================================================
    // STEP 3: SPECIFIC TOPIC QUERIES (before keyword matching)
    // =====================================================
    
    // Planting calendar/seasons
    if (lowerMsg.match(/\b(planting season|farming calendar|when to plant|planting calendar|season calendar)\b/)) {
        html = '<p><strong>📅 Kenya Planting Calendar</strong></p>';
        html += '<p><strong>Long Rains (Mar-May):</strong> Maize, beans, potatoes, vegetables, rice</p>';
        html += '<p><strong>Short Rains (Oct-Dec):</strong> Maize, beans, sorghum, millet, cowpeas</p>';
        html += '<p><strong>Year-round (with water):</strong> Tomatoes, onions, vegetables, watermelon</p>';
        return html;
    }
    
    // Land preparation
    if (lowerMsg.match(/\b(land preparation|prepare land|prepare soil|prepare my farm)\b/)) {
        html = '<p><strong>🌱 Land Preparation</strong></p>';
        html += '<ol>';
        html += '<li><strong>Clear land</strong> - Remove trees, bushes, rocks</li>';
        html += '<li><strong>Plough</strong> - 2-4 weeks before planting, 15-30cm deep</li>';
        html += '<li><strong>Add organic matter</strong> - Manure/compost 5-10 tons/acre</li>';
        html += '<li><strong>Harrow</strong> - Break clods, level field</li>';
        html += '<li><strong>Make rows/beds</strong> - According to crop spacing</li>';
        html += '</ol>';
        return html;
    }
    
    // =====================================================
    // STEP 4: CROP-SPECIFIC QUERIES (check each crop by name)
    // =====================================================
    
    // Maize
    if (lowerMsg.match(/\b(maize|corn|mahindi)\b/)) {
        html = '<p><strong>🌽 Maize Farming</strong></p>';
        html += '<p><strong>Season:</strong> Mar-May (long rains), Oct-Dec (short rains)</p>';
        html += '<p><strong>Harvest:</strong> 90-120 days</p>';
        html += '<p><strong>Spacing:</strong> 75cm rows, 25cm plants</p>';
        html += '<p><strong>Varieties:</strong> H614D, H6213, Duma 43</p>';
        html += '<p><strong>Fertilizer:</strong> DAP at planting, CAN when knee-high</p>';
        html += '<p><strong>⚠️ Threats:</strong> Fall armyworm, stalk borer, MLN disease</p>';
        html += '<p><strong>Yield:</strong> 15-30 bags/acre</p>';
        html += '<p><strong>Best regions:</strong> Trans Nzoia, Uasin Gishu, Nakuru</p>';
        return html;
    }
    
    // Beans
    if (lowerMsg.match(/\b(beans?|bean|maharage)\b/)) {
        html = '<p><strong>🫘 Beans Farming</strong></p>';
        html += '<p><strong>Season:</strong> Mar-May, Oct-Dec</p>';
        html += '<p><strong>Harvest:</strong> 60-90 days</p>';
        html += '<p><strong>Spacing:</strong> 50cm rows, 10cm plants</p>';
        html += '<p><strong>Varieties:</strong> Wairimu, Rose Coco, Mwitemania</p>';
        html += '<p><strong>Benefits:</strong> Fixes nitrogen, good for intercropping with maize</p>';
        html += '<p><strong>Yield:</strong> 4-8 bags/acre</p>';
        return html;
    }
    
    // Tomatoes
    if (lowerMsg.match(/\b(tomato|tomatoes|nyanya)\b/)) {
        html = '<p><strong>🍅 Tomato Farming</strong></p>';
        html += '<p><strong>Season:</strong> Year-round with irrigation</p>';
        html += '<p><strong>Harvest:</strong> 75-90 days</p>';
        html += '<p><strong>Spacing:</strong> 90cm rows, 60cm plants</p>';
        html += '<p><strong>Varieties:</strong> Anna F1, Cal J, Rio Grande, Kilele F1</p>';
        html += '<p><strong>Tips:</strong> Stake plants, mulch, prune for air flow</p>';
        html += '<p><strong>⚠️ Problems:</strong> Tuta absoluta, late blight, bacterial wilt</p>';
        html += '<p><strong>Yield:</strong> 15,000-30,000 kg/acre</p>';
        return html;
    }
    
    // Kale/Sukuma
    if (lowerMsg.match(/\b(kale|sukuma|sukuma wiki)\b/)) {
        html = '<p><strong>🥬 Kale (Sukuma Wiki)</strong></p>';
        html += '<p><strong>Season:</strong> Year-round!</p>';
        html += '<p><strong>Harvest:</strong> 45-60 days, continuous for months</p>';
        html += '<p><strong>Spacing:</strong> 60cm rows, 45cm plants</p>';
        html += '<p><strong>Tips:</strong> Harvest outer leaves first, apply manure regularly</p>';
        html += '<p><strong>Yield:</strong> 8,000-15,000 kg/acre</p>';
        return html;
    }
    
    // Potatoes
    if (lowerMsg.match(/\b(potato|potatoes|waru|viazi)\b/)) {
        html = '<p><strong>🥔 Potato Farming</strong></p>';
        html += '<p><strong>Season:</strong> Mar-Apr, Aug-Sep</p>';
        html += '<p><strong>Harvest:</strong> 90-120 days</p>';
        html += '<p><strong>Spacing:</strong> 75cm rows, 30cm plants</p>';
        html += '<p><strong>Varieties:</strong> Shangi, Tigoni, Desiree, Asante</p>';
        html += '<p><strong>⚠️ Use CERTIFIED seed potatoes!</strong></p>';
        html += '<p><strong>Diseases:</strong> Late blight, bacterial wilt</p>';
        html += '<p><strong>Yield:</strong> 80-150 bags/acre</p>';
        html += '<p><strong>Best regions:</strong> Nyandarua, Nakuru, Meru</p>';
        return html;
    }
    
    // Onions
    if (lowerMsg.match(/\b(onion|onions|kitunguu)\b/)) {
        html = '<p><strong>🧅 Onion Farming</strong></p>';
        html += '<p><strong>Season:</strong> Jan-Feb, Jun-Jul</p>';
        html += '<p><strong>Harvest:</strong> 90-150 days</p>';
        html += '<p><strong>Varieties:</strong> Red Creole, Texas Grano, Bombay Red</p>';
        html += '<p><strong>Tips:</strong> Stop watering when tops fall over, cure before storage</p>';
        html += '<p><strong>Yield:</strong> 8,000-15,000 kg/acre</p>';
        return html;
    }
    
    // Cabbage
    if (lowerMsg.match(/\b(cabbage|kabichi)\b/)) {
        html = '<p><strong>🥬 Cabbage Farming</strong></p>';
        html += '<p><strong>Season:</strong> Feb-Mar, Aug-Sep</p>';
        html += '<p><strong>Harvest:</strong> 85-110 days</p>';
        html += '<p><strong>Varieties:</strong> Gloria F1, Queen of Heaven</p>';
        html += '<p><strong>Yield:</strong> 10,000-20,000 heads/acre</p>';
        return html;
    }
    
    // Spinach
    if (lowerMsg.match(/\b(spinach)\b/)) {
        html = '<p><strong>🥬 Spinach Farming</strong></p>';
        html += '<p><strong>Season:</strong> Year-round</p>';
        html += '<p><strong>Harvest:</strong> 40-50 days</p>';
        html += '<p><strong>Tips:</strong> Pick outer leaves, prefers cool weather</p>';
        return html;
    }
    
    // Carrots
    if (lowerMsg.match(/\b(carrot|carrots|mkaroti)\b/)) {
        html = '<p><strong>🥕 Carrot Farming</strong></p>';
        html += '<p><strong>Season:</strong> Feb-Mar, Aug-Sep</p>';
        html += '<p><strong>Harvest:</strong> 70-100 days</p>';
        html += '<p><strong>⚠️ Do NOT add fresh manure - causes forked roots!</strong></p>';
        return html;
    }
    
    // Bananas
    if (lowerMsg.match(/\b(banana|bananas|ndizi)\b/)) {
        html = '<p><strong>🍌 Banana Farming</strong></p>';
        html += '<p><strong>First Harvest:</strong> 12-18 months</p>';
        html += '<p><strong>Spacing:</strong> 3m x 3m</p>';
        html += '<p><strong>Varieties:</strong> Williams, Grand Nain, Apple banana</p>';
        html += '<p><strong>Tips:</strong> Plant healthy suckers, mulch heavily, remove dead leaves</p>';
        html += '<p><strong>Yield:</strong> 30-60 bunches/acre/year</p>';
        return html;
    }
    
    // Avocados
    if (lowerMsg.match(/\b(avocado|avocados|parachichi)\b/)) {
        html = '<p><strong>🥑 Avocado Farming</strong></p>';
        html += '<p><strong>First Fruit:</strong> 3-5 years (grafted)</p>';
        html += '<p><strong>Spacing:</strong> 6-10m between trees</p>';
        html += '<p><strong>Varieties:</strong> Hass (export), Fuerte</p>';
        html += '<p><strong>Yield:</strong> 300-500 fruits/tree annually</p>';
        html += '<p><strong>Tips:</strong> Graft for faster fruiting, mulch heavily</p>';
        return html;
    }
    
    // Mangoes
    if (lowerMsg.match(/\b(mango|mangoes|embe)\b/)) {
        html = '<p><strong>🥭 Mango Farming</strong></p>';
        html += '<p><strong>First Fruit:</strong> 3-5 years (grafted)</p>';
        html += '<p><strong>Varieties:</strong> Apple, Ngowe, Tommy Atkins</p>';
        html += '<p><strong>Tips:</strong> Graft for quality, prune after harvest</p>';
        html += '<p><strong>Best regions:</strong> Machakos, Makueni, Kitui, Kilifi</p>';
        return html;
    }
    
    // Coffee
    if (lowerMsg.match(/\b(coffee|kahawa)\b/)) {
        html = '<p><strong>☕ Coffee Farming</strong></p>';
        html += '<p><strong>First Harvest:</strong> 3-4 years</p>';
        html += '<p><strong>Spacing:</strong> 2.5m x 2.5m (~1600 trees/acre)</p>';
        html += '<p><strong>Varieties:</strong> SL28, SL34, Batian, Ruiru 11</p>';
        html += '<p><strong>Tips:</strong> Needs shade trees, prune regularly, pick ripe cherries only</p>';
        return html;
    }
    
    // Tea
    if (lowerMsg.match(/\b(tea|chai)\b/)) {
        html = '<p><strong>🍵 Tea Farming</strong></p>';
        html += '<p><strong>First Harvest:</strong> 3-5 years</p>';
        html += '<p><strong>Tips:</strong> Pick 2 leaves + bud, pluck every 7-14 days</p>';
        html += '<p><strong>Needs:</strong> Cool highlands, acidic soil (pH 4.5-5.5)</p>';
        html += '<p><strong>Best regions:</strong> Kericho, Bomet, Nandi, Kisii</p>';
        return html;
    }
    
    // Sorghum
    if (lowerMsg.match(/\b(sorghum|mtema|mtama)\b/)) {
        html = '<p><strong>🌾 Sorghum Farming</strong></p>';
        html += '<p><strong>Harvest:</strong> 100-120 days</p>';
        html += '<p><strong>Varieties:</strong> Serena, Serendo, Gadam (60-70 days)</p>';
        html += '<p><strong>Benefits:</strong> Drought tolerant, low input, brewery demand</p>';
        html += '<p><strong>Yield:</strong> 5-12 bags/acre</p>';
        return html;
    }
    
    // Millet
    if (lowerMsg.match(/\b(millet|wimbi|uwele)\b/)) {
        html = '<p><strong>🌾 Millet Farming</strong></p>';
        html += '<p><strong>Harvest:</strong> 90-100 days</p>';
        html += '<p><strong>Benefits:</strong> Very drought tolerant, nutritious</p>';
        html += '<p><strong>Yield:</strong> 3-6 bags/acre</p>';
        return html;
    }
    
    // Cassava
    if (lowerMsg.match(/\b(cassava|muhogo)\b/)) {
        html = '<p><strong>🥔 Cassava Farming</strong></p>';
        html += '<p><strong>Harvest:</strong> 8-12 months</p>';
        html += '<p><strong>Benefits:</strong> Drought tolerant, food security</p>';
        html += '<p><strong>⚠️ ALWAYS cook thoroughly before eating!</strong></p>';
        html += '<p><strong>Yield:</strong> 10-25 tons/acre</p>';
        return html;
    }
    
    // Sweet Potato
    if (lowerMsg.match(/\b(sweet potato|ngwaci)\b/)) {
        html = '<p><strong>🍠 Sweet Potato Farming</strong></p>';
        html += '<p><strong>Harvest:</strong> 90-150 days</p>';
        html += '<p><strong>Tips:</strong> Plant vine cuttings, leaves also edible</p>';
        html += '<p><strong>Yield:</strong> 8-15 tons/acre</p>';
        return html;
    }
    
    // Watermelon
    if (lowerMsg.match(/\b(watermelon|tikiti)\b/)) {
        html = '<p><strong>🍉 Watermelon Farming</strong></p>';
        html += '<p><strong>Harvest:</strong> 80-100 days</p>';
        html += '<p><strong>Varieties:</strong> Sugar Baby, Sukari F1</p>';
        html += '<p><strong>Tips:</strong> Stop watering 1 week before harvest for sweetness</p>';
        html += '<p><strong>Yield:</strong> 10,000-20,000 fruits/acre</p>';
        return html;
    }
    
    // Rice
    if (lowerMsg.match(/\b(rice|mpunga)\b/)) {
        html = '<p><strong>🍚 Rice Farming</strong></p>';
        html += '<p><strong>Harvest:</strong> 100-150 days</p>';
        html += '<p><strong>Needs:</strong> Flooded fields or reliable irrigation</p>';
        html += '<p><strong>Areas:</strong> Mwea, Ahero, Bunyala</p>';
        html += '<p><strong>Yield:</strong> 20-40 bags/acre</p>';
        return html;
    }
    
    // Capsicum
    if (lowerMsg.match(/\b(capsicum|pepper|hoho|pilipili hoho)\b/)) {
        html = '<p><strong>🫑 Capsicum Farming</strong></p>';
        html += '<p><strong>Harvest:</strong> 70-90 days</p>';
        html += '<p><strong>✅ High value crop!</strong></p>';
        html += '<p><strong>Varieties:</strong> California Wonder, Rambo</p>';
        html += '<p><strong>Yield:</strong> 8,000-15,000 kg/acre</p>';
        return html;
    }
    
    // Cowpeas
    if (lowerMsg.match(/\b(cowpeas?|kunde)\b/)) {
        html = '<p><strong>🫛 Cowpeas (Kunde)</strong></p>';
        html += '<p><strong>Harvest:</strong> 60-90 days</p>';
        html += '<p><strong>Benefits:</strong> Drought tolerant, fixes nitrogen, leaves + pods edible</p>';
        return html;
    }
    
    // Pumpkin
    if (lowerMsg.match(/\b(pumpkin|malebwe)\b/)) {
        html = '<p><strong>🎃 Pumpkin Farming</strong></p>';
        html += '<p><strong>Harvest:</strong> 90-120 days</p>';
        html += '<p><strong>Spacing:</strong> 2m x 2m (vines need space)</p>';
        html += '<p><strong>Tips:</strong> Harvest when skin hardens, stores for months</p>';
        return html;
    }
    
    // Passion Fruit
    if (lowerMsg.match(/\b(passion\s?fruit|maracuja)\b/)) {
        html = '<p><strong>🍇 Passion Fruit Farming</strong></p>';
        html += '<p><strong>First Harvest:</strong> 1-2 years</p>';
        html += '<p><strong>Varieties:</strong> Purple (highlands), Yellow (lowlands)</p>';
        html += '<p><strong>Tips:</strong> Needs trellis support</p>';
        return html;
    }
    
    // Sugarcane
    if (lowerMsg.match(/\b(sugarcane|muwa)\b/)) {
        html = '<p><strong>🎋 Sugarcane Farming</strong></p>';
        html += '<p><strong>Harvest:</strong> 12-18 months</p>';
        html += '<p><strong>Needs:</strong> Lots of water!</p>';
        html += '<p><strong>Yield:</strong> 80-120 tons/acre</p>';
        return html;
    }
    
    // Groundnuts
    if (lowerMsg.match(/\b(groundnut|groundnuts|peanut|peanuts|karanga)\b/)) {
        html = '<p><strong>🥜 Groundnut Farming</strong></p>';
        html += '<p><strong>Harvest:</strong> 90-120 days</p>';
        html += '<p><strong>Benefits:</strong> Fixes nitrogen, high protein</p>';
        html += '<p><strong>Yield:</strong> 6-12 bags/acre</p>';
        return html;
    }
    
    // =====================================================
    // STEP 5: LIVESTOCK QUERIES (check each animal by name)
    // =====================================================
    
    // Dairy Cattle
    if (lowerMsg.match(/\b(dairy\s?cattle|dairy\s?cow|dairy|friesian|ayrshire|jersey|milking\s?cow)\b/)) {
        html = '<p><strong>🐄 Dairy Cattle</strong></p>';
        html += '<p><strong>Breeds:</strong> Friesian (25-35L/day), Ayrshire (20-25L), Jersey (15-20L)</p>';
        html += '<p><strong>Feeding:</strong> 50-100L water/day, fodder + dairy meal</p>';
        html += '<p><strong>Diseases:</strong> Mastitis, tick-borne, FMD, lumpy skin</p>';
        html += '<p><strong>Vaccinate:</strong> FMD every 6 months, lumpy skin annually</p>';
        return html;
    }
    
    // Beef Cattle
    if (lowerMsg.match(/\b(beef\s?cattle|beef\s?cow|beef cattle|boran|sahiwal|zebu)\b/)) {
        html = '<p><strong>🐄 Beef Cattle</strong></p>';
        html += '<p><strong>Breeds:</strong> Boran, Sahiwal, Zebu (hardy local breeds)</p>';
        html += '<p><strong>Feeding:</strong> Grazing + mineral licks</p>';
        html += '<p><strong>Market:</strong> 2-4 years, 350-450kg live weight</p>';
        return html;
    }
    
    // General cattle
    if (lowerMsg.match(/\b(cattle|cow|cows|ng'ombe)\b/)) {
        html = '<p><strong>🐄 Cattle Farming</strong></p>';
        html += '<p>Ask about:</p>';
        html += '<ul>';
        html += '<li>🥛 <strong>"Dairy cattle"</strong> - Milk production</li>';
        html += '<li>🥩 <strong>"Beef cattle"</strong> - Meat production</li>';
        html += '</ul>';
        html += '<p><strong>General:</strong> Deworm every 3 months, vaccinate FMD/lumpy skin, dip weekly for ticks</p>';
        return html;
    }
    
    // Goats
    if (lowerMsg.match(/\b(goat|goats|mbuzi)\b/)) {
        html = '<p><strong>🐐 Goat Farming</strong></p>';
        html += '<p><strong>Breeds:</strong> Galla (hardy), Saanen (milk 3-5L/day), Boer (meat)</p>';
        html += '<p><strong>Feeding:</strong> Browse shrubs/leaves + hay supplement</p>';
        html += '<p><strong>Housing:</strong> Raised floor, keep dry</p>';
        html += '<p><strong>Health:</strong> Deworm every 2-3 months, vaccinate PPR</p>';
        html += '<p><strong>Gestation:</strong> 150 days, 1-3 kids per birth</p>';
        return html;
    }
    
    // Poultry
    if (lowerMsg.match(/\b(chicken|chickens|kuku|poultry|layers?|broilers?|kienyeji|kuroiler)\b/)) {
        html = '<p><strong>🐔 Poultry Farming</strong></p>';
        html += '<p><strong>Types:</strong> Layers, Broilers, Kienyeji, Kuroiler</p>';
        html += '<p><strong>Feeding:</strong> Layers 120-150g/bird/day, fresh water always</p>';
        html += '<p><strong>Housing:</strong> 1 sq ft/bird, ventilated, clean litter</p>';
        html += '<p><strong>⚠️ Newcastle Disease:</strong> Vaccinate EVERY 3 MONTHS! No cure!</p>';
        html += '<p><strong>Other diseases:</strong> Gumboro, Coccidiosis, Fowl Pox</p>';
        return html;
    }
    
    // Sheep
    if (lowerMsg.match(/\b(sheep|kondoo)\b/)) {
        html = '<p><strong>🐑 Sheep Farming</strong></p>';
        html += '<p><strong>Breeds:</strong> Red Maasai (hardy), Dorper (meat), Merino (wool)</p>';
        html += '<p><strong>Feeding:</strong> Grazing + mineral blocks</p>';
        html += '<p><strong>Health:</strong> Foot rot prevention, regular deworming</p>';
        html += '<p><strong>Market:</strong> 8-12 months, 30-45kg</p>';
        return html;
    }
    
    // Pigs
    if (lowerMsg.match(/\b(pig|pigs|swine|nguruwe)\b/)) {
        html = '<p><strong>🐷 Pig Farming</strong></p>';
        html += '<p><strong>Breeds:</strong> Large White, Landrace, Duroc</p>';
        html += '<p><strong>Feeding:</strong> Kitchen waste (cooked), grains, 2-3kg/day</p>';
        html += '<p><strong>Housing:</strong> Shade + mud wallows (cannot sweat!)</p>';
        html += '<p><strong>🚨 African Swine Fever:</strong> NO CURE! Strict biosecurity!</p>';
        html += '<p><strong>Market:</strong> 90-100kg at 6-7 months</p>';
        return html;
    }
    
    // Rabbits
    if (lowerMsg.match(/\b(rabbit|rabbits|sungura)\b/)) {
        html = '<p><strong>🐰 Rabbit Farming</strong></p>';
        html += '<p><strong>Breeds:</strong> New Zealand White, California, Flemish Giant</p>';
        html += '<p><strong>Feeding:</strong> 80% hay + vegetables + pellets</p>';
        html += '<p><strong>Housing:</strong> Wire cages off ground</p>';
        html += '<p><strong>Gestation:</strong> 28-35 days, 6-12 kits, wean 6-8 weeks</p>';
        html += '<p><strong>Market:</strong> 2-3kg at 4-5 months</p>';
        return html;
    }
    
    // Fish
    if (lowerMsg.match(/\b(fish|aquaculture|tilapia|catfish|samaki|pond)\b/)) {
        html = '<p><strong>🐟 Fish Farming</strong></p>';
        html += '<p><strong>Species:</strong> Nile Tilapia, African Catfish</p>';
        html += '<p><strong>Stocking:</strong> 2-5 fish/sq meter</p>';
        html += '<p><strong>Water:</strong> pH 6.5-9.0, replace 10-20% weekly</p>';
        html += '<p><strong>Feeding:</strong> 2-3 times daily, floating pellets, don\'t overfeed!</p>';
        html += '<p><strong>Harvest:</strong> 6-8 months</p>';
        return html;
    }
    
    // =====================================================
    // STEP 6: PESTS & DISEASES
    // =====================================================
    
    // Fall Armyworm
    if (lowerMsg.match(/\b(armyworm|fall armyworm|army worm)\b/)) {
        html = '<p><strong>🐛 Fall Armyworm</strong></p>';
        html += '<p><strong>Attacks:</strong> Maize, sorghum, millet, rice</p>';
        html += '<p><strong>Signs:</strong> Windowpane leaves, sawdust in whorl, ragged leaves</p>';
        html += '<p><strong>Control:</strong></p>';
        html += '<ul>';
        html += '<li>Scout DAILY</li>';
        html += '<li>Sand in whorl (traditional)</li>';
        html += '<li>Chemicals: Emamectin, Spinosad (when larvae young)</li>';
        html += '<li>Push-pull with Desmodium/Napier</li>';
        html += '</ul>';
        return html;
    }
    
    // Aphids
    if (lowerMsg.match(/\b(aphid|aphids)\b/)) {
        html = '<p><strong>🐛 Aphids</strong></p>';
        html += '<p><strong>Signs:</strong> Clusters on young leaves, curled leaves, sticky honeydew</p>';
        html += '<p><strong>Control:</strong></p>';
        html += '<ul>';
        html += '<li>Strong water spray</li>';
        html += '<li>Soap spray (1-2 tbsp/L water)</li>';
        html += '<li>Neem oil</li>';
        html += '<li>Encourage ladybugs</li>';
        html += '</ul>';
        return html;
    }
    
    // Blight
    if (lowerMsg.match(/\b(blight|late blight|early blight)\b/)) {
        html = '<p><strong>🍄 Blight Disease</strong></p>';
        html += '<p><strong>Late Blight:</strong> Water-soaked patches, white mold - very serious!</p>';
        html += '<p><strong>Early Blight:</strong> Target-like spots</p>';
        html += '<p><strong>Control:</strong> Resistant varieties, copper fungicides, remove infected plants, good spacing, crop rotation</p>';
        return html;
    }
    
    // Wilt
    if (lowerMsg.match(/\b(wilt|wilting|bacterial wilt)\b/)) {
        html = '<p><strong>🦠 Wilt Disease</strong></p>';
        html += '<p><strong>Signs:</strong> Rapid wilting, white ooze when cut stem in water</p>';
        html += '<p><strong>⚠️ NO CURE!</strong></p>';
        html += '<p><strong>Management:</strong> Remove infected plants, rotate 3-5 years, clean seed, good drainage</p>';
        return html;
    }
    
    // Newcastle
    if (lowerMsg.match(/\b(newcastle|newcastle disease)\b/)) {
        html = '<p><strong>🚨 Newcastle Disease</strong></p>';
        html += '<p><strong>⚠️ HIGHLY FATAL - Can wipe out flocks!</strong></p>';
        html += '<p><strong>Signs:</strong> Breathing difficulty, twisted neck, sudden death</p>';
        html += '<p><strong>⚠️ NO CURE! Vaccinate EVERY 3 MONTHS!</strong></p>';
        return html;
    }
    
    // Mastitis
    if (lowerMsg.match(/\b(mastitis)\b/)) {
        html = '<p><strong>🥛 Mastitis (Dairy Cows)</strong></p>';
        html += '<p><strong>Signs:</strong> Swollen udder, clots/blood in milk, fever</p>';
        html += '<p><strong>Treatment:</strong> Call vet, antibiotics, frequent milking</p>';
        html += '<p><strong>Prevention:</strong> Clean teats before/after milking, clean bedding</p>';
        return html;
    }
    
    // ASF
    if (lowerMsg.match(/\b(african swine fever|asf|swine fever)\b/)) {
        html = '<p><strong>🚨 African Swine Fever</strong></p>';
        html += '<p><strong>⚠️ NO CURE! NO VACCINE! 100% DEATH!</strong></p>';
        html += '<p><strong>Prevention:</strong> No raw pork, quarantine new pigs 21 days, disinfect everything, keep wild pigs away</p>';
        return html;
    }
    
    // Coccidiosis
    if (lowerMsg.match(/\b(coccidiosis|coccidia)\b/)) {
        html = '<p><strong>🐛 Coccidiosis (Poultry)</strong></p>';
        html += '<p><strong>Signs:</strong> Blood in droppings, hunched birds</p>';
        html += '<p><strong>Treatment:</strong> Coccidiostats in water/feed</p>';
        html += '<p><strong>Prevention:</strong> Keep litter DRY, avoid water spills</p>';
        return html;
    }
    
    // Tuta Absoluta
    if (lowerMsg.match(/\b(tuta|tuta absoluta|leaf miner|tomato leaf miner)\b/)) {
        html = '<p><strong>🐛 Tuta Absoluta</strong></p>';
        html += '<p><strong>⚠️ Can cause 100% tomato loss!</strong></p>';
        html += '<p><strong>Signs:</strong> Mines in leaves, holes in fruits</p>';
        html += '<p><strong>Control:</strong> Pheromone traps, remove infected material, Spinosad/Emamectin, crop rotation</p>';
        return html;
    }
    
    // Ticks
    if (lowerMsg.match(/\b(tick|ticks)\b/)) {
        html = '<p><strong>🐛 Tick Control</strong></p>';
        html += '<p><strong>Diseases:</strong> East Coast Fever, Heartwater, Anaplasmosis</p>';
        html += '<p><strong>Control:</strong> Weekly dipping/spraying with acaricides, rotate chemicals</p>';
        return html;
    }
    
    // =====================================================
    // STEP 7: FERTILIZER, MANURE, COMPOST (specific words)
    // =====================================================
    
    // Fertilizer - match specific fertilizer names OR the word fertilizer/fertilizers
    if (lowerMsg.match(/\b(fertilizer|fertilizers|fertiliser|fertilisers)\b/) ||
        lowerMsg.match(/\b(dap fertilizer|can fertilizer|npk fertilizer|urea fertilizer)\b/) ||
        lowerMsg.match(/\b(about dap|about npk|about urea)\b/)) {
        html = '<p><strong>🧪 Fertilizer Guide</strong></p>';
        html += '<p><strong>Types:</strong></p>';
        html += '<ul>';
        html += '<li><strong>DAP (18-46-0):</strong> Planting - for roots</li>';
        html += '<li><strong>CAN (26-0-0):</strong> Top dressing - for growth</li>';
        html += '<li><strong>NPK (17-17-17):</strong> General purpose</li>';
        html += '<li><strong>Urea (46-0-0):</strong> Rapid green growth</li>';
        html += '</ul>';
        html += '<p><strong>Application:</strong></p>';
        html += '<ul>';
        html += '<li>Maize: DAP at planting, CAN when knee-high</li>';
        html += '<li>Don\'t put fertilizer touching seeds!</li>';
        html += '<li>Apply when soil is moist</li>';
        html += '<li>Get soil test for exact needs</li>';
        html += '</ul>';
        html += '<p><em>Ask about "manure" or "compost" for organic options!</em></p>';
        return html;
    }
    
    // Manure
    if (lowerMsg.match(/\b(manure|manures|animal manure)\b/)) {
        html = '<p><strong>💩 Manure Guide</strong></p>';
        html += '<p><strong>Types:</strong></p>';
        html += '<ul>';
        html += '<li><strong>Cattle:</strong> Balanced, good for all crops</li>';
        html += '<li><strong>Poultry:</strong> High nitrogen - compost first!</li>';
        html += '<li><strong>Goat/Sheep:</strong> Rich, drier</li>';
        html += '<li><strong>Rabbit:</strong> Very rich, can apply fresh</li>';
        html += '</ul>';
        html += '<p><strong>Application:</strong> 5-10 tons/acre, incorporate into soil, apply 2-4 weeks before planting</p>';
        return html;
    }
    
    // Compost
    if (lowerMsg.match(/\b(compost|composting)\b/)) {
        html = '<p><strong>🍂 Composting</strong></p>';
        html += '<p><strong>Ingredients:</strong></p>';
        html += '<ul>';
        html += '<li><strong>Green:</strong> Kitchen scraps, fresh leaves, grass</li>';
        html += '<li><strong>Brown:</strong> Dry leaves, straw, paper</li>';
        html += '</ul>';
        html += '<p><strong>Method:</strong> Layer 3 brown : 1 green, keep moist, turn every 2-3 weeks</p>';
        html += '<p><strong>Ready:</strong> 3-6 months - dark, crumbly, earthy smell</p>';
        html += '<p><strong>Don\'t compost:</strong> Meat, dairy, pet waste, diseased plants</p>';
        return html;
    }
    
    // =====================================================
    // STEP 8: SOIL (after fertilizer/manure/compost)
    // =====================================================
    
    if (lowerMsg.match(/\b(soil|soils|soil type|types of soil|soil ph|acidity|alkalinity)\b/)) {
        html = '<p><strong>🌍 Soil Guide</strong></p>';
        html += '<p><strong>Types:</strong></p>';
        html += '<ul>';
        html += '<li><strong>Sandy:</strong> Drains fast, add organic matter</li>';
        html += '<li><strong>Clay:</strong> Holds water, add compost</li>';
        html += '<li><strong>Loam:</strong> Ideal for most crops</li>';
        html += '</ul>';
        html += '<p><strong>pH:</strong> Most crops prefer 5.5-7.0</p>';
        html += '<p><strong>Tips:</strong> Test every 2-3 years, add organic matter, rotate crops</p>';
        return html;
    }
    
    // =====================================================
    // STEP 9: WATER & IRRIGATION
    // =====================================================
    
    if (lowerMsg.match(/\b(water|watering|irrigation|irrigate|drip|sprinkler|maji)\b/)) {
        html = '<p><strong>💧 Irrigation Guide</strong></p>';
        html += '<p><strong>Best time:</strong> Early morning</p>';
        html += '<p><strong>Methods:</strong></p>';
        html += '<ul>';
        html += '<li><strong>Drip:</strong> Most efficient (90-95%)</li>';
        html += '<li><strong>Sprinkler:</strong> Good for large areas</li>';
        html += '</ul>';
        html += '<p><strong>Tips:</strong> Water deeply but less often, mulch to reduce evaporation</p>';
        return html;
    }
    
    // =====================================================
    // STEP 10: HARVEST & STORAGE
    // =====================================================
    
    if (lowerMsg.match(/\b(harvest|harvesting|harvest time|when to harvest|storage|storing)\b/)) {
        html = '<p><strong>🌾 Harvest Guide</strong></p>';
        html += '<p><strong>Signs:</strong></p>';
        html += '<ul>';
        html += '<li>Maize: Husks dry, kernels hard</li>';
        html += '<li>Beans: Pods dry, seeds rattle</li>';
        html += '<li>Tomatoes: Color changes</li>';
        html += '<li>Potatoes: Leaves yellow</li>';
        html += '</ul>';
        html += '<p><strong>Best time:</strong> Early morning, dry weather</p>';
        html += '<p><strong>Storage:</strong> Dry thoroughly, cool/dry place, hermetic bags for grain</p>';
        return html;
    }
    
    // =====================================================
    // STEP 11: WEATHER & SEASONS
    // =====================================================
    
    if (lowerMsg.match(/\b(weather|rain|rainfall|climate|season|temperature|mvua)\b/)) {
        html = '<p><strong>🌤️ Weather & Seasons</strong></p>';
        html += '<p><strong>Kenya Rainfall:</strong></p>';
        html += '<ul>';
        html += '<li><strong>Long Rains:</strong> March - May</li>';
        html += '<li><strong>Short Rains:</strong> October - December</li>';
        html += '<li><strong>Dry:</strong> Jun-Sep, Jan-Feb</li>';
        html += '</ul>';
        html += '<p>Set your county for localized weather!</p>';
        return html;
    }
    
    // =====================================================
    // STEP 12: MARKET
    // =====================================================
    
    if (lowerMsg.match(/\b(market|sell|buy|price|prices|profit|trade|soko)\b/)) {
        html = '<p><strong>💰 Market</strong></p>';
        html += '<p>Go to <strong>Market tab</strong> to:</p>';
        html += '<ul>';
        html += '<li>🛒 Buy farm products</li>';
        html += '<li>💰 Sell your produce</li>';
        html += '<li>👥 Join 7,800+ farmer community</li>';
        html += '</ul>';
        html += '<p><strong>Reference prices:</strong> Eggs KES 380-520/tray, Milk KES 45-70/L, Chicken KES 450-700/kg</p>';
        return html;
    }
    
    // =====================================================
    // STEP 13: APP NAVIGATION
    // =====================================================
    
    if (lowerMsg.match(/\b(how to use|how do i|guide|help me use|app features)\b/)) {
        html = '<p><strong>📱 Using AgriXen</strong></p>';
        html += '<p><strong>Tabs:</strong></p>';
        html += '<ul>';
        html += '<li>🌱 Crops: 26 crops with details</li>';
        html += '<li>🐄 Livestock: 8 animals + calculator</li>';
        html += '<li>🤖 Barn-E: Chat with me!</li>';
        html += '<li>🏥 VetLine: Find vets</li>';
        html += '<li>🛒 Market: Buy/sell + community</li>';
        html += '</ul>';
        html += '<p>📍 Set county with pin icon for personalized advice!</p>';
        return html;
    }
    
    if (lowerMsg.match(/\b(location|county|set location|my area)\b/)) {
        html = '<p><strong>📍 Set County</strong></p>';
        html += '<p>Tap pin icon (top right) → Select county → Confirm</p>';
        html += '<p>Benefits: Crop recommendations, local weather, market connections</p>';
        return html;
    }
    
    if (lowerMsg.match(/\b(vet|veterinary|vetline|animal doctor)\b/)) {
        html = '<p><strong>🏥 VetLine</strong></p>';
        html += '<p>Find vets in <strong>VetLine tab</strong> - filter by county and specialty</p>';
        html += '<p><strong>Emergency:</strong> Kenya Veterinary Board: 020 2718370</p>';
        return html;
    }
    
    if (lowerMsg.match(/\b(calculator|profit calculator)\b/)) {
        html = '<p><strong>🧮 Profit Calculator</strong></p>';
        html += '<p>Find in <strong>Livestock tab</strong> - enter units, price, costs to see profit/loss</p>';
        return html;
    }
    
    if (lowerMsg.match(/\b(community|join)\b/)) {
        html = '<p><strong>👥 Community</strong></p>';
        html += '<p>Join 7,800+ farmers! Market tab → Community → Join Us</p>';
        return html;
    }
    
    if (lowerMsg.match(/\b(is it free|cost|price of app|subscription)\b/)) {
        html = '<p><strong>🎉 AgriXen is FREE!</strong></p>';
        html += '<p>✅ No subscription, no account needed, no hidden costs!</p>';
        return html;
    }
    
    // =====================================================
    // STEP 14: YES/NO RESPONSES
    // =====================================================
    
    if (lowerMsg.match(/^(yes|yeah|yep|ndiyo|sawa|ok|okay|sure)\b/)) {
        html = '<p><strong>Poa! What would you like to know?</strong></p>';
        html += '<ul>';
        html += '<li>🌱 "What can I plant now?"</li>';
        html += '<li>🐄 "Tell me about chickens"</li>';
        html += '<li>🐛 "How to treat aphids?"</li>';
        html += '</ul>';
        return html;
    }
    
    if (lowerMsg.match(/^(no|nope|hapana)\b/)) {
        html = '<p><strong>Hakuna shida! 👍</strong></p>';
        html += '<p>I\'m here whenever you need help!</p>';
        return html;
    }
    
    // =====================================================
    // STEP 15: GENERAL KEYWORD MATCHING (last resort)
    // =====================================================
    
    // General crops keyword
    if (lowerMsg.match(/\b(crop|crops|vegetable|vegetables|shamba|farm|farming)\b/)) {
        html = '<p><strong>🌱 Crops in AgriXen</strong></p>';
        html += '<p><strong>Cereals:</strong> Maize, Rice, Sorghum, Millet</p>';
        html += '<p><strong>Vegetables:</strong> Tomatoes, Kale, Cabbage, Spinach, Onions, Carrots</p>';
        html += '<p><strong>Roots:</strong> Potatoes, Sweet Potatoes, Cassava</p>';
        html += '<p><strong>Fruits:</strong> Bananas, Mangoes, Avocados, Watermelon</p>';
        html += '<p><strong>Cash:</strong> Coffee, Tea, Sugarcane</p>';
        html += '<p><em>Ask about a specific crop! "Tell me about tomatoes"</em></p>';
        return html;
    }
    
    // General livestock keyword
    if (lowerMsg.match(/\b(livestock|animal|animals)\b/)) {
        html = '<p><strong>🐄 Livestock in AgriXen</strong></p>';
        html += '<p>Dairy Cattle, Beef Cattle, Goats, Poultry, Sheep, Pigs, Rabbits, Fish</p>';
        html += '<p><em>Ask about a specific animal! "Tell me about goats"</em></p>';
        return html;
    }
    
    // General pest/disease keyword
    if (lowerMsg.match(/\b(pest|pests|disease|diseases|sick|infection)\b/)) {
        html = '<p><strong>🐛 Pests & Diseases</strong></p>';
        html += '<p><strong>Crop:</strong> Armyworms, Aphids, Blight, Wilt, Tuta Absoluta</p>';
        html += '<p><strong>Livestock:</strong> Newcastle, Mastitis, ASF, Coccidiosis, Ticks</p>';
        html += '<p><em>Ask about a specific problem! "How to treat aphids?"</em></p>';
        return html;
    }
    
    // =====================================================
    // FALLBACK
    // =====================================================
    
    html = '<p><strong>I heard your question! 🤔</strong></p>';
    html += '<p>You asked: <em>"' + message + '"</em></p>';
    html += '<p>I\'m still learning! For help:</p>';
    html += '<ul>';
    html += '<li>📧 labs@mortappsstudios.com</li>';
    html += '<li>📧 agrixen.ke@gmail.com</li>';
    html += '<li>📱 +254 113 400 063</li>';
    html += '</ul>';
    html += '<p>Or ask about: crops, livestock, pests, diseases, weather, market</p>';
    
    return html;
}
// ★★★ END OF LOCAL RESPONSE ENGINE - EXPAND ABOVE ★★★





// =====================================================
// MARKETPLACE - BUY/SELL FORMS
// =====================================================

function showBuyForm() {
    document.getElementById('buyFormModal').classList.remove('hidden');
}

function closeBuyForm() {
    document.getElementById('buyFormModal').classList.add('hidden');
}

function showSellForm() {
    document.getElementById('sellFormModal').classList.remove('hidden');
}

function closeSellForm() {
    document.getElementById('sellFormModal').classList.add('hidden');
}

function closeThankYouModal() {
    document.getElementById('thankYouModal').classList.add('hidden');
}

function handleFormSubmit(form, modalId) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        var formData = new FormData(form);
        
        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        }).then(function(response) {
            if (response.ok) {
                document.getElementById(modalId).classList.add('hidden');
                form.reset();
                document.getElementById('thankYouModal').classList.remove('hidden');
            } else {
                toast('Something went wrong. Please try again.');
            }
        }).catch(function(error) {
            toast('Network error. Please check your connection.');
        });
    });
}

// =====================================================
// COMMUNITY MESSAGES
// =====================================================

function renderCommunityMessages() {
    var container = document.getElementById('communityMessages');
    if (!container) return;
    
    var html = '';
    
    for (var i = 0; i < COMMUNITY_MESSAGES.length; i++) {
        var msg = COMMUNITY_MESSAGES[i];
        
        html += '<div class="community-message">';
        html += '<div class="community-message-avatar">';
        html += '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="20 2 15 22 11 13 2 9 20 2"/></svg>';
        html += '</div>';
        html += '<div class="community-message-content">';
        if (msg.name) {
            html += '<span class="community-message-name">' + msg.name + '</span>';
        }
        html += '<p>' + msg.text + '</p>';
        html += '<span class="community-message-time">' + msg.time + '</span>';
        html += '</div>';
        html += '</div>';
    }
    
    container.innerHTML = html;
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
    if (sun && moon) {
        sun.classList.toggle('hidden', darkMode);
        moon.classList.toggle('hidden', !darkMode);
    }
}

function loadSettings() {
    try {
        var s = localStorage.getItem('agrixen_settings');
        if (s) {
            var p = JSON.parse(s);
            darkMode = p.darkMode || false;
        }
        document.body.classList.toggle('dark-mode', darkMode);
        var sun = document.querySelector('.sun-icon');
        var moon = document.querySelector('.moon-icon');
        if (sun && moon) {
            sun.classList.toggle('hidden', darkMode);
            moon.classList.toggle('hidden', !darkMode);
        }
    } catch(e) {}
}

function saveSettings() {
    try {
        localStorage.setItem('agrixen_settings', JSON.stringify({ darkMode: darkMode }));
    } catch(e) {}
}

// =====================================================
// TAB NAVIGATION
// =====================================================

function switchTab(tabName) {
    currentTab = tabName;
    
    var tabs = document.querySelectorAll('.tab-btn');
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].classList.toggle('active', tabs[i].dataset.tab === tabName);
    }
    
    var contents = document.querySelectorAll('.tab-content');
    for (var i = 0; i < contents.length; i++) {
        contents[i].classList.add('hidden');
    }
    
    var activeContent = document.getElementById(tabName + 'Tab');
    if (activeContent) {
        activeContent.classList.remove('hidden');
    }
}

// =====================================================
// AD SYSTEM
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

function initAds() {
    initSlotAds();
}

function createShuffledOrder(length) {
    var order = [];
    for (var i = 0; i < length; i++) {
        order.push(i);
    }
    for (var i = order.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = order[i];
        order[i] = order[j];
        order[j] = temp;
    }
    return order;
}

function initSlotAds() {
    var cropSlots = document.querySelectorAll('.crop-ad-slot');
    cropSlots.forEach(function(slot, i) {
        var slotId = 'crop_' + i;
        initIndividualSlot(slot, slotId);
    });
    
    var livestockSlots = document.querySelectorAll('.livestock-ad-slot');
    livestockSlots.forEach(function(slot, i) {
        var slotId = 'livestock_' + i;
        initIndividualSlot(slot, slotId);
    });
    
    var marketSlot1 = document.getElementById('marketAdSlot1');
    if (marketSlot1) initIndividualSlot(marketSlot1, 'market1');
    
    var marketSlot2 = document.getElementById('marketAdSlot2');
    if (marketSlot2) initIndividualSlot(marketSlot2, 'market2');
    
    var vetSlots = document.querySelectorAll('.vet-ad-slot');
    vetSlots.forEach(function(slot, i) {
        var slotId = 'vet_' + i;
        initIndividualSlot(slot, slotId);
    });
}

function initIndividualSlot(container, slotId) {
    if (!container || SLOT_ADS.length === 0) return;
    
    adRotationOrder[slotId] = createShuffledOrder(SLOT_ADS.length);
    currentAdIndices[slotId] = 0;
    
    showSlotAd(container, slotId, 0);
    
    if (SLOT_ADS.length > 1) {
        scheduleNextSlot(container, slotId);
    }
}

function showSlotAd(container, slotId, positionIndex) {
    if (!container || SLOT_ADS.length === 0) return;
    
    var rotationOrder = adRotationOrder[slotId];
    var adIndex = rotationOrder[positionIndex % rotationOrder.length];
    var ad = SLOT_ADS[adIndex];
    
    var inner = container.querySelector('.ad-slot-inner') || container;
    inner.innerHTML = '<img src="' + ad.image + '" alt="' + ad.alt + '" onerror="this.style.display=\'none\'">';
    
    container.onclick = function(e) {
        e.stopPropagation();
        window.open(ad.url, '_blank');
    };
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
        if (nextIndex >= rotationOrder.length) {
            adRotationOrder[slotId] = createShuffledOrder(SLOT_ADS.length);
            nextIndex = 0;
        }
        showSlotAd(container, slotId, nextIndex);
        scheduleNextSlot(container, slotId);
    }, duration);
}

// =====================================================
// EVENT LISTENERS
// =====================================================

function setupEventListeners() {
    // Theme
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Location
    document.getElementById('locationBtn').addEventListener('click', function() {
        document.getElementById('locationModal').classList.remove('hidden');
    });
    
    document.getElementById('locationDisplay').addEventListener('click', function() {
        document.getElementById('locationModal').classList.remove('hidden');
    });
    
    document.getElementById('closeLocationModal').addEventListener('click', function() {
        document.getElementById('locationModal').classList.add('hidden');
    });
    
    document.getElementById('confirmLocation').addEventListener('click', function() {
        var county = document.getElementById('countySelect').value;
        if (county) selectCounty(county);
    });
    
    // Tabs
    var tabs = document.querySelectorAll('.tab-btn');
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].addEventListener('click', function(e) {
            switchTab(e.currentTarget.dataset.tab);
        });
    }
    
    // Chat
    document.getElementById('sendBtn').addEventListener('click', sendChatMessage);
    document.getElementById('chatInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendChatMessage();
    });
    
    // Vet filters
    document.getElementById('vetCountyFilter').addEventListener('change', renderVets);
    document.getElementById('vetSpecialtyFilter').addEventListener('change', renderVets);
    
    // Crop detail modal
    var closeCropModal = document.getElementById('closeCropDetailModal');
    if (closeCropModal) {
        closeCropModal.addEventListener('click', function() {
            document.getElementById('cropDetailModal').classList.add('hidden');
        });
    }
    
    // Notifications
    document.getElementById('enableNotifications').addEventListener('click', function() {
        requestNotificationPermission();
    });
    document.getElementById('skipNotifications').addEventListener('click', skipNotificationSetup);
    
    // Barn-E Guide Modal
    document.getElementById('closeBarneGuide').addEventListener('click', function() {
        document.getElementById('barneGuideModal').classList.add('hidden');
    });
    
    // Install Modal
    var closeInstallModal = document.getElementById('closeInstallModal');
    if (closeInstallModal) {
        closeInstallModal.addEventListener('click', function() {
            document.getElementById('installModal').classList.add('hidden');
        });
    }
    
    document.getElementById('installApp').addEventListener('click', function() {
        showInstallPrompt();
    });
    
    document.getElementById('installLater').addEventListener('click', function() {
        document.getElementById('installModal').classList.add('hidden');
    });
    
    // Calculator
    document.getElementById('calculateBtn').addEventListener('click', calculateProfit);
    
    // Footer buttons
    document.getElementById('footerContact').addEventListener('click', function() {
        window.location.href = 'mailto:labs@mortappsstudios.com';
    });
    
    document.getElementById('footerHelp').addEventListener('click', function() {
        document.getElementById('barneGuideModal').classList.remove('hidden');
    });
    
    // Buy/Sell Forms
    handleFormSubmit(document.getElementById('buyForm'), 'buyFormModal');
    handleFormSubmit(document.getElementById('sellForm'), 'sellFormModal');
    
    // Close modals on escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.getElementById('locationModal').classList.add('hidden');
            document.getElementById('cropDetailModal').classList.add('hidden');
            document.getElementById('buyFormModal').classList.add('hidden');
            document.getElementById('sellFormModal').classList.add('hidden');
            document.getElementById('thankYouModal').classList.add('hidden');
            document.getElementById('notificationModal').classList.add('hidden');
            document.getElementById('barneGuideModal').classList.add('hidden');
            document.getElementById('installModal').classList.add('hidden');
        }
    });
    
    // Close modals on background click
    var modals = ['locationModal', 'cropDetailModal', 'buyFormModal', 'sellFormModal', 'thankYouModal', 'notificationModal', 'barneGuideModal', 'installModal'];
    modals.forEach(function(modalId) {
        var modal = document.getElementById(modalId);
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target.id === modalId) {
                    e.target.classList.add('hidden');
                }
            });
        }
    });
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
    
    setTimeout(function() {
        t.classList.add('fade-out');
        setTimeout(function() { t.remove(); }, 300);
    }, 2500);
}
