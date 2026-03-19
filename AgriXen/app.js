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
    { image: 'ad-images/manji-ad-slot.png', url: 'https://manji.co.ke', alt: 'Manji Biscuits', duration: '10s' }
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
    { name: 'Dr. Wanjiku Animal Clinic', county: 'Kiambu', specialty: 'cattle', phone: '0722123456' },
    { name: 'Nakuru Vet Centre', county: 'Nakuru', specialty: 'mixed', phone: '0733987654' },
    { name: 'Eldoret Poultry Specialists', county: 'Uasin Gishu', specialty: 'poultry', phone: '0755678901' }
    // Continue adding more...
];

// =====================================================
// COMMUNITY MESSAGES - EASY TO EDIT
// Add new messages here. Format:
// { name: "Sender Name", text: "Your message here", time: "Time stamp" }
// To add more: copy a line below and change the details
// To remove: delete the line
// =====================================================
var COMMUNITY_MESSAGES = [
    { 
        name: "AgriXen Team",
        text: "Jambo! Karibu AgriXen Community. We're here to support your farming journey with crop tips, livestock advice, and market updates. Stay connected by joining our community above—click 'Join Us' to receive exclusive farming insights and seasonal alerts!",
        time: "Today"
    }
    // ADD MORE MESSAGES BELOW - Copy format:
    // { name: "Sender Name", text: "Your message here", time: "Time stamp" },
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

// Extended Crop Data
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
    { name: 'Pumpkin', icon: 'fruit', seasons: ['Mar', 'Apr', 'Aug', 'Sep'], daysToHarvest: '90-120 days', spacing: '2m between rows, 2m between plants', water: '500-800mm', soil: 'Rich, well-drained, pH 6.0-7.0', tips: 'Needs space to spread. Mulch heavily. Leaves and seeds are also edible.' }
];

// Livestock Data
var LIVESTOCK_DATA = [
    { name: 'Cattle (Dairy)', icon: 'cattle', tips: [{ label: 'Feeding', text: 'Provide fresh water (50-100L/day) and quality fodder. Supplement with dairy meal during milking.' }, { label: 'Health', text: 'Watch for mastitis (swollen udder), tick-borne diseases. Vaccinate against FMD and lumpy skin.' }, { label: 'Housing', text: 'Clean, well-ventilated shed. Remove manure daily to prevent disease.' }] },
    { name: 'Cattle (Beef)', icon: 'cattle', tips: [{ label: 'Feeding', text: 'Grazing on pasture is ideal. Supplement with hay during dry season. Mineral licks are essential.' }, { label: 'Health', text: 'Regular deworming (every 3 months). Watch for tick infestations and respiratory issues.' }, { label: 'Breeding', text: 'Select breeding bulls carefully. Cross-breeding can improve meat quality.' }] },
    { name: 'Goats', icon: 'goat', tips: [{ label: 'Feeding', text: 'Browsers - prefer shrubs and leaves. Supplement with hay and concentrates. Provide clean water.' }, { label: 'Health', text: 'Prone to pneumonia and parasites. Regular deworming crucial. Vaccinate against PPR.' }, { label: 'Housing', text: 'Raise floor off ground. Keep dry and well-ventilated. Separate kids from adults.' }] },
    { name: 'Chickens', icon: 'poultry', tips: [{ label: 'Feeding', text: 'Layers: 120-150g feed/day. Chicks need starter feed for 8 weeks. Provide clean water always.' }, { label: 'Health', text: 'Vaccinate against Newcastle (every 3 months). Watch for coccidiosis and respiratory issues.' }, { label: 'Housing', text: '1 sq ft per bird minimum. Nesting boxes for layers. Proper ventilation critical.' }] },
    { name: 'Sheep', icon: 'sheep', tips: [{ label: 'Feeding', text: 'Grazers - prefer grass. Supplement with hay in dry season. Provide mineral blocks.' }, { label: 'Health', text: 'Regular deworming important. Watch for foot rot and external parasites.' }, { label: 'Shearing', text: 'Shear annually (usually before rains). Prevent fly strike in warm weather.' }] },
    { name: 'Pigs', icon: 'pig', tips: [{ label: 'Feeding', text: 'Omnivores - can eat kitchen waste, grains, and commercial feed. Provide adequate protein.' }, { label: 'Health', text: 'Watch for African Swine Fever (no cure - prevention key). Regular deworming needed.' }, { label: 'Housing', text: 'Need shade and mud wallows. Keep pens clean. Separate farrowing sows.' }] },
    { name: 'Rabbits', icon: 'rabbit', tips: [{ label: 'Feeding', text: 'Hay should be 80% of diet. Fresh vegetables daily. Commercial pellets as supplement.' }, { label: 'Health', text: 'Watch for ear mites and respiratory infections. Keep environment clean and dry.' }, { label: 'Housing', text: 'Wire cages with solid rest area. Protect from extreme temperatures.' }] }
];

// App State
var currentCounty = null;
var currentLocation = null;
var darkMode = false;
var currentTab = 'crops';
var chatHistory = [];

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
    checkNotificationPermission();
    
    setTimeout(hideLoadingScreen, 1500);
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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// =====================================================
// NOTIFICATION SYSTEM
// =====================================================

function checkNotificationPermission() {
    if (!('Notification' in window)) {
        console.log('This browser does not support notifications');
        return;
    }
    
    var asked = localStorage.getItem('agrixen_notification_asked');
    
    if (Notification.permission === 'default' && !asked) {
        setTimeout(function() {
            document.getElementById('notificationModal').classList.remove('hidden');
        }, 3000);
    }
}

function requestNotificationPermission() {
    if (!('Notification' in window)) {
        toast('Your browser does not support notifications');
        return;
    }
    
    Notification.requestPermission().then(function(permission) {
        localStorage.setItem('agrixen_notification_asked', 'true');
        document.getElementById('notificationModal').classList.add('hidden');
        
        if (permission === 'granted') {
            toast('Notifications enabled! You will receive farming updates.');
            setTimeout(function() {
                sendNotification('Welcome to AgriXen!', 'You will now receive weather alerts and farming tips.');
            }, 1000);
        } else {
            toast('Notifications disabled. You can enable them later in browser settings.');
        }
    }).catch(function(error) {
        console.error('Notification permission error:', error);
        toast('Could not request notification permission');
    });
}

function sendNotification(title, body) {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
        return;
    }
    
    try {
        var notification = new Notification(title, {
            body: body,
            icon: 'icons/favicon-32x32.png',
            badge: 'icons/favicon-16x16.png',
            tag: 'agrixen-notification',
            requireInteraction: false
        });
        
        notification.onclick = function() {
            window.focus();
            notification.close();
        };
        
        setTimeout(function() {
            notification.close();
        }, 10000);
        
    } catch (e) {
        console.log('Notification error:', e);
    }
}

// Weather change notification
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

function initAds() {
    initSlotAds();
}

function createShuffledOrder(length) {
    var order = [];
    for (var i = 0; i < length; i++) {
        order.push(i);
    }
    // Fisher-Yates shuffle
    for (var i = order.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = order[i];
        order[i] = order[j];
        order[j] = temp;
    }
    return order;
}

function initSlotAds() {
    // Crop ad slots
    var cropSlots = document.querySelectorAll('.crop-ad-slot');
    cropSlots.forEach(function(slot, i) {
        var slotId = 'crop_' + i;
        initIndividualSlot(slot, slotId);
    });
    
    // Livestock ad slots
    var livestockSlots = document.querySelectorAll('.livestock-ad-slot');
    livestockSlots.forEach(function(slot, i) {
        var slotId = 'livestock_' + i;
        initIndividualSlot(slot, slotId);
    });
    
    // Market ad slots
    var marketSlot1 = document.getElementById('marketAdSlot1');
    if (marketSlot1) initIndividualSlot(marketSlot1, 'market1');
    
    var marketSlot2 = document.getElementById('marketAdSlot2');
    if (marketSlot2) initIndividualSlot(marketSlot2, 'market2');
    
    // Vet ad slots
    var vetSlots = document.querySelectorAll('.vet-ad-slot');
    vetSlots.forEach(function(slot, i) {
        var slotId = 'vet_' + i;
        initIndividualSlot(slot, slotId);
    });
}

function initIndividualSlot(container, slotId) {
    if (!container || SLOT_ADS.length === 0) return;
    
    // Create unique shuffled order for this slot
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
    
    // Make container clickable
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
        // Reset rotation when all ads shown
        if (nextIndex >= rotationOrder.length) {
            adRotationOrder[slotId] = createShuffledOrder(SLOT_ADS.length);
            nextIndex = 0;
        }
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
    } else {
        setTimeout(function() {
            document.getElementById('locationModal').classList.remove('hidden');
        }, 2000);
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
    }
}

// =====================================================
// WEATHER (Open-Meteo API - REAL DATA)
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
                console.log('Weather loaded for:', currentCounty);
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
    
    // Temperature
    document.getElementById('weatherTemp').textContent = Math.round(current.temperature_2m) + 'C';
    
    // Weather description
    var weatherInfo = getWeatherInfo(current.weather_code);
    document.getElementById('weatherDesc').textContent = weatherInfo.description;
    
    // Check for weather change and notify
    checkWeatherChange(weatherInfo.description);
    
    // Rain chance
    if (daily && daily.precipitation_probability_max) {
        document.getElementById('rainChance').textContent = daily.precipitation_probability_max[0] + '% rain';
    }
    
    // Wind speed
    document.getElementById('windSpeed').textContent = Math.round(current.wind_speed_10m) + ' km/h';
    
    // Humidity
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
        56: { description: 'Light freezing drizzle' },
        57: { description: 'Dense freezing drizzle' },
        61: { description: 'Slight rain' },
        63: { description: 'Moderate rain' },
        65: { description: 'Heavy rain' },
        66: { description: 'Light freezing rain' },
        67: { description: 'Heavy freezing rain' },
        71: { description: 'Slight snow' },
        73: { description: 'Moderate snow' },
        75: { description: 'Heavy snow' },
        77: { description: 'Snow grains' },
        80: { description: 'Slight rain showers' },
        81: { description: 'Moderate rain showers' },
        82: { description: 'Violent rain showers' },
        85: { description: 'Slight snow showers' },
        86: { description: 'Heavy snow showers' },
        95: { description: 'Thunderstorm' },
        96: { description: 'Thunderstorm with slight hail' },
        99: { description: 'Thunderstorm with heavy hail' }
    };
    
    return codes[code] || { description: 'Unknown' };
}

// =====================================================
// CROPS SECTION
// =====================================================

function renderCrops() {
    var grid = document.getElementById('cropRecommendations');
    var guide = document.getElementById('plantingGuide');
    if (!grid) return;
    
    var currentMonth = new Date().toLocaleString('en', { month: 'short' });
    var html = '';
    
    for (var i = 0; i < CROP_DATA.length; i++) {
        var crop = CROP_DATA[i];
        var isSeason = crop.seasons.indexOf(currentMonth) !== -1;
        var cropIndex = i;
        
        // Insert ad slot after every 4 crops
        if (i > 0 && i % 4 === 0) {
            html += '<div class="crop-ad-slot" data-ad-slot="true">';
            html += '<div class="ad-slot-inner"></div>';
            html += '</div>';
        }
        
        html += '<div class="crop-card' + (isSeason ? ' recommended' : '') + '" onclick="showCropDetails(' + cropIndex + ')" data-crop-index="' + cropIndex + '">';
        html += '<div class="crop-icon">' + getCropIcon(crop.icon) + '</div>';
        html += '<div class="crop-name">' + crop.name + '</div>';
        if (isSeason) {
            html += '<span class="season-badge">In Season</span>';
        }
        html += '<div class="tap-hint">Tap to learn more</div>';
        html += '</div>';
    }
    
    grid.innerHTML = html;
    
    // Re-initialize ad slots
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
    
    guideHtml += '<div class="guide-item">';
    guideHtml += '<div class="guide-title">General Tips</div>';
    guideHtml += '<div class="guide-text">Plant at the onset of rains for best results. Prepare land early and use certified seeds. Apply fertilizer according to soil test recommendations.</div>';
    guideHtml += '</div>';
    
    if (currentCounty) {
        guideHtml += '<div class="guide-item">';
        guideHtml += '<div class="guide-title">' + currentCounty + ' County</div>';
        guideHtml += '<div class="guide-text">Check with your local agricultural extension officer for specific varieties suited to your area.</div>';
        guideHtml += '</div>';
    }
    
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
// LIVESTOCK SECTION - NO CLICK ON CARDS
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
        
        // Add ad slot after every 2 livestock cards
        if ((i + 1) % 2 === 0 && i < LIVESTOCK_DATA.length - 1) {
            html += '<div class="livestock-ad-slot" data-ad-slot="true">';
            html += '<div class="ad-slot-inner"></div>';
            html += '</div>';
        }
    }
    
    grid.innerHTML = html;
    
    // Re-initialize ad slots
    initSlotAds();
}

function getLivestockIcon(type) {
    var icons = {
        'cattle': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="12" cy="14" rx="8" ry="5"/><path d="M4 10c-1-3 1-5 3-5"/><path d="M20 10c1-3-1-5-3-5"/><circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><path d="M8 19v2M16 19v2"/></svg>',
        'goat': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="12" cy="14" rx="7" ry="5"/><path d="M5 8l-3-4 5 2"/><path d="M19 8l3-4-5 2"/><circle cx="9" cy="11" r="1"/><circle cx="15" cy="11" r="1"/><path d="M9 19v2M15 19v2"/></svg>',
        'poultry': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="12" cy="12" rx="6" ry="7"/><circle cx="12" cy="6" r="3"/><path d="M10 4l-2-2"/><path d="M14 4l2-2"/><path d="M9 19l-1 3"/><path d="M15 19l1 3"/></svg>',
        'sheep': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="12" cy="13" rx="8" ry="6"/><circle cx="12" cy="5" r="3"/><path d="M8 19v2M16 19v2"/></svg>',
        'pig': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="12" cy="13" rx="8" ry="6"/><ellipse cx="12" cy="7" rx="4" ry="3"/><circle cx="10" cy="7" r="1"/><circle cx="14" cy="7" r="1"/><path d="M8 19v2M16 19v2"/></svg>',
        'rabbit': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="12" cy="14" rx="7" ry="5"/><circle cx="12" cy="7" r="4"/><path d="M8 5c-1-3 0-4 1-4"/><path d="M16 5c1-3 0-4-1-4"/><circle cx="10" cy="6" r="1"/><circle cx="14" cy="6" r="1"/></svg>'
    };
    return icons[type] || icons['cattle'];
}

// =====================================================
// VETLINE SECTION - FROM BACK-CODE
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
        
        // Add ad slot after every vet card (up to 5 slots)
        if (i < 5) {
            html += '<div class="vet-ad-slot" data-ad-slot="true">';
            html += '<div class="ad-slot-inner"></div>';
            html += '</div>';
        }
    }
    
    grid.innerHTML = html;
    
    // Re-initialize ad slots
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

// Direct local response - no server needed (GitHub Pages compatible)
async function callAI(message, topic) {
    // Simulate typing delay for better UX
    await new Promise(function(resolve) { setTimeout(resolve, 500); });
    
    removeTypingIndicator();
    
    var response = generateLocalResponse(message, topic);
    addChatMessage('bot', response, true);
}

function buildSystemPrompt(topic) {
    var currentMonth = new Date().toLocaleString('en', { month: 'long' });
    var inSeasonCrops = CROP_DATA.filter(function(c) { 
        return c.seasons.indexOf(new Date().toLocaleString('en', { month: 'short' })) !== -1; 
    }).map(function(c) { return c.name; }).join(', ');
    
    var basePrompt = `You are Barn-E, an expert AI farming assistant specifically designed for Kenyan farmers.

CURRENT CONTEXT:
- Current month: ${currentMonth}
- Crops in season this month: ${inSeasonCrops}
- You help farmers across all 47 counties of Kenya

YOUR EXPERTISE:
1. CROPS: Maize, beans, tomatoes, kale, potatoes, onions, cabbage, bananas, avocados, spinach, carrots, capsicum, watermelon, sorghum, millets, cassava, sweet potatoes, groundnuts, sugarcane, coffee, tea, rice, cowpeas, pumpkin.

2. LIVESTOCK: Dairy cattle, beef cattle, goats, chickens, sheep, pigs, rabbits

3. LOCAL KNOWLEDGE: Kenya's two rainy seasons (March-May long rains, October-December short rains), common pests and diseases, local market prices trends.

RESPONSE STYLE:
- Be direct and practical
- Give specific, actionable advice
- Use local terminology (shamba, sukuma wiki)
- For serious conditions, advise consulting a vet
- Keep responses concise but thorough`;

    if (topic === 'crops') {
        basePrompt += `\n\nFocus on: planting calendars, crop varieties, soil preparation, fertilizers, pest control, irrigation, harvesting.`;
    } else if (topic === 'livestock') {
        basePrompt += `\n\nFocus on: feeding regimes, disease prevention, vaccination schedules, housing, breeding tips.`;
    }
    
    return basePrompt;
}

function formatAIResponse(text) {
    var formatted = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/• (.*?)(?=<br>|$)/g, '<li>$1</li>');
    
    if (formatted.indexOf('<li>') !== -1) {
        formatted = formatted.replace(/(<li>.*?<\/li>)+/g, '<ul>$&</ul>');
    }
    
    return '<p>' + formatted + '</p>';
}

// =====================================================
// BARN-E AI - LOCAL RESPONSE ENGINE
// =====================================================
// ★★★ EXPAND THIS SECTION WITH MORE FARMING KNOWLEDGE ★★★
// This function generates AI responses without needing a server.
// Add more patterns and responses below to make Barn-E smarter!
// =====================================================

function generateLocalResponse(message, topic) {
    var lowerMsg = message.toLowerCase();
    var currentMonth = new Date().toLocaleString('en', { month: 'short' });
    var html = '';
    
    // ----- GREETINGS -----
    if (lowerMsg.match(/^(hi|hello|hey|greetings|howdy|jambo|hujambo)/)) {
        html = '<p><strong>Jambo!</strong> Welcome to AgriXen!</p>';
        html += '<p>I am Barn-E, your farming assistant. I can help you with:</p>';
        html += '<ul><li>Crop recommendations and planting schedules</li><li>Livestock health and management</li><li>Pest and disease identification</li></ul>';
        html += '<p>What would you like to know?</p>';
        return html;
    }
    
    // ----- THANK YOU -----
    if (lowerMsg.match(/(thank|asante|thanks|appreciate)/)) {
        html = '<p><strong>Karibu sana!</strong> You are most welcome.</p>';
        html += '<p>I am always here to help. Feel free to ask any farming questions.</p>';
        return html;
    }
    
    // ----- GOODBYE -----
    if (lowerMsg.match(/^(bye|goodbye|see you|kwaheri)/)) {
        html = '<p><strong>Kwaheri!</strong> Take care of your shamba!</p>';
        html += '<p>Come back anytime you need advice.</p>';
        return html;
    }
    
    // ----- PLANTING SEASON -----
    if (lowerMsg.match(/(plant|grow|season|this month|now)/)) {
        var inSeasonCrops = CROP_DATA.filter(function(c) { return c.seasons.indexOf(currentMonth) !== -1; });
        html = '<p><strong>Crops to plant in ' + currentMonth + ':</strong></p>';
        html += '<ul>';
        for (var i = 0; i < Math.min(6, inSeasonCrops.length); i++) {
            html += '<li>' + inSeasonCrops[i].name + ' - ' + inSeasonCrops[i].daysToHarvest + '</li>';
        }
        html += '</ul>';
        html += '<p>Tap on any crop in the Crops tab for details!</p>';
        return html;
    }
    
    // ----- ADD MORE RESPONSE PATTERNS BELOW THIS LINE -----
    // Example format:
    // if (lowerMsg.match(/(your keywords here)/)) {
    //     html = '<p><strong>Your response title</strong></p>';
    //     html += '<p>Your response content...</p>';
    //     return html;
    // }
    
    // ----- DEFAULT FALLBACK RESPONSE -----
    html = '<p>I understand you are asking about: <strong>' + message + '</strong></p>';
    html += '<p>Could you share more details about your specific situation? This will help me give better advice.</p>';
    
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
    document.getElementById('enableNotifications').addEventListener('click', requestNotificationPermission);
    document.getElementById('skipNotifications').addEventListener('click', function() {
        localStorage.setItem('agrixen_notification_asked', 'true');
        document.getElementById('notificationModal').classList.add('hidden');
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
        }
    });
    
    // Close modals on background click
    var modals = ['locationModal', 'cropDetailModal', 'buyFormModal', 'sellFormModal', 'thankYouModal', 'notificationModal'];
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
