/**
 * =====================================================
 * AgriXen Markets - Kenya's Digital Produce Marketplace
 * Web App - Buy & Sell Fresh Farm Produce
 * Powered By MortApps Studios
 * =====================================================
 */

// =====================================================
// WHATSAPP CONFIGURATION
// =====================================================
// The WhatsApp number that receives all Buy/Sell requests.
// Include country code WITHOUT the + sign.
// Change this to update the receiving number.
// =====================================================
var WHATSAPP_NUMBER = "254113400063";

// =====================================================
// SLOT ADVERTS - EASY TO EDIT (ADD/REMOVE ADS HERE)
// =====================================================
//
// HOW TO ADD A NEW AD:
// 1. Place your ad image in the "ad-images" folder
// 2. Add a new entry below following this format:
//    { image: "ad-images/filename.jpg", alt: "Ad Description", link: "https://example.com" }
// 3. That's it! The ad slots auto-update.
//
// FIELD DESCRIPTIONS:
// - image:  Path to ad image.
//           Place all ad images in the "ad-images" folder.
//           Example: "ad-images/my-ad.jpg"
//           IMPORTANT: Always provide a valid image path.
// - link:   The URL to open when a user clicks on the ad.
//           The link opens in a new tab (target="_blank").
//           Example: "https://example.com"
//
// AD PLACEMENT RULES:
// - Ad slots appear after every 3 produce cards in the grid.
// - Each ad slot is the same size as a produce card.
// - Ads rotate independently per slot (no two slots show the same ad at the same time within a cycle).
// - Fisher-Yates shuffle ensures no repeats within a full rotation cycle.
//
// =====================================================

var SLOT_ADS = [

    { image: 'ad-images/lmh-ad-slot.png', link: 'https://www.linkagemediahub.co.ke', alt: 'Linkage Media Hub', duration: '5s' },
    { image: 'ad-images/manji-ad-slot.png', link: 'https://manji.co.ke', alt: 'Manji Biscuits', duration: '5s' },
    { image: 'ad-images/arm-ad-slot.png', link: 'https://www.arimis-milkingjelly.com', alt: 'arimis', duration: '5s' },
    { image: 'ad-images/mas-ad-slot.png', link: 'https://www.mortappsstudios.com', alt: 'MortApps Studios', duration: '10s' },
    { image: 'ad-images/pep-ad-slot.png', link: 'https://www.pepsodent.com/gh/home.html', alt: 'Pepsodent', duration: '5s' }

    



    // ============================================================
    // ADD YOUR ADS BELOW THIS LINE
    // Example:
    // { image: "ad-images/ad-1.jpg", alt: "Ad Description", link: "https://example.com" },
    // { image: "ad-images/ad-2.jpg", alt: "Another Ad", link: "https://another-site.com" },
    // ============================================================

    // ============================================================
    // ADD YOUR ADS ABOVE THIS LINE
    // ============================================================
];

// How long each ad stays before rotating to the next one.
// Formats: '5s', '10s', '30s', '1m', '2m'
var AD_ROTATION_DURATION = '10s';

// =====================================================
// AD SLOT STATE - DO NOT EDIT (managed automatically)
// =====================================================
var adSlotStates = {};

// =====================================================
// PRODUCE CATALOG - EASY TO EDIT (ADD/REMOVE PRODUCE HERE)
// =====================================================
//
// HOW TO ADD A NEW PRODUCE:
// 1. Find the correct category array below (or create a new one)
// 2. Add a new entry following this format:
//    { name: "Produce Name", price: 0, unit: "unit", image: "path" }
// 3. That's it! The grid auto-updates.
//
// FIELD DESCRIPTIONS:
// - name:   Display name of the produce (e.g., "Sukuma Wiki")
// - price:  BASE MARKET PRICE in KES.
//           When Smart Pricing is ON, prices auto-adjust from this base.
//           When Smart Pricing is OFF, this exact price is shown.
//           Update this when you want to change the baseline.
// - unit:   Unit of measurement (e.g., "kg", "bunch", "piece")
// - image:  Path to product image.
//           Local: "prod-images/filename.jpg" (put images in prod-images/ folder)
//           Online: "https://example.com/image.jpg" (full URL)
//           IMPORTANT: Always provide an image. If image fails to load,
//           a placeholder with the product name will be shown.
//
// HOW TO ADD A NEW CATEGORY:
// 1. Add a new { category: "Category Name", items: [...] } object to the array.
// 2. Add your produce items inside the items array.
// 3. The category button appears automatically in the filter bar.
//
// PRICING NOTE:
// Prices below are calibrated to April 2026 Kenya (Nairobi) retail averages.
// Sources: KAMIS, KNBS, live marketplace listings.
// Smart Pricing engine adjusts these daily based on season & market conditions.
// =====================================================

var PRODUCE_CATALOG = [

    // =====================================================
    // VEGETABLES
    // =====================================================
    {
        category: "Vegetables",
        items: [
            { name: "Sukuma Wiki (Kale)", price: 40, unit: "bunch", image: "https://www.farmworx.co.ke/wp-content/uploads/2021/06/IMG_20220915_120605-scaled.jpg" },
            { name: "Spinach", price: 50, unit: "bunch", image: "https://biznakenya.com/wp-content/uploads/2016/03/Sukuma_Wiki_Kale.jpg" },
            { name: "Tomatoes", price: 220, unit: "kg", image: "https://cdn.mafrservices.com/sys-master-root/h24/h09/26402224635934/14769_main.jpg?im=Resize=376" },
            { name: "Onions", price: 90, unit: "kg", image: "https://alphaveggies.com/wp-content/uploads/2026/02/Kikuyu-Onions.jpg" },
            { name: "Cabbage", price: 100, unit: "piece", image: "https://www.greenlife.co.ke/wp-content/uploads/2022/04/Cabbage.jpg" },
            { name: "Capsicum (Hoho)", price: 180, unit: "kg", image: "https://pbs.twimg.com/media/FzmvqGRXsAAM2ex.jpg" },
            { name: "Carrots", price: 100, unit: "kg", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw02kJVxC4XNDMXj6liLR7rum0CyzpByeHnA&s" },
            { name: "Garlic", price: 300, unit: "kg", image: "https://safiorganics.co.ke/wp-content/uploads/2025/08/360_F_364056397_c1wiuR4RRXuu8WFNN3igdbwon6yz2NqU.webp" },
            { name: "Dhania (Coriander)", price: 20, unit: "bundle", image: "https://graduatefarmer.co.ke/wp-content/uploads/2018/08/coriander-dania-farm-kenya.png" },
            { name: "Green Beans", price: 140, unit: "kg", image: "https://gulffruits.com/cdn/shop/files/287e63f0101cf141141ba6c685ee427c.jpg?v=1740777255" }
        ]
    },

    // =====================================================
    // FRUITS
    // =====================================================
    {
        category: "Fruits",
        items: [
            { name: "Avocado", price: 30, unit: "piece", image: "https://i0.wp.com/www.freshelaexporters.com/wp-content/uploads/2022/09/avocado-61.jpg?resize=1200%2C900&ssl=1" },
            { name: "Bananas", price: 150, unit: "hand", image: "https://www.infonet-biovision.org/sites/default/files/styles/full_image_popup/public/2024-03/Banana%20Kampala%20unripe%20in%20Nairobi%20market%2C%20Kenya%20%E2%92%B8%20Maryam%20imbumi%2C%202005..JPG?itok=7IcNFXH-" },
            { name: "Mangoes", price: 100, unit: "kg", image: "https://graduatefarmer.co.ke/wp-content/uploads/2025/04/2151542234-780x470.jpg" },
            { name: "Oranges", price: 120, unit: "kg", image: "https://sowexotic.com/cdn/shop/products/ValenciaOrangeSowExotic_540x.png?v=1654117301" },
            { name: "Watermelon", price: 300, unit: "piece", image: "https://biznakenya.com/wp-content/uploads/2017/01/Growing-watermelons-in-Kenya.jpg" },
            { name: "Passion Fruit", price: 180, unit: "kg", image: "https://afrisunorchards.com/wp-content/uploads/2024/08/scaled_image_picker6805289293477584506.jpg" },
            { name: "Pineapple", price: 150, unit: "piece", image: "https://safiorganics.co.ke/wp-content/uploads/2025/08/pine.webp" },
            { name: "Pawpaw (Papaya)", price: 100, unit: "piece", image: "https://www.greenlife.co.ke/wp-content/uploads/2022/04/papaya_farming.jpg" }
        ]
    },

    // =====================================================
    // GRAINS & CEREALS
    // =====================================================
    {
        category: "Grains & Cereals",
        items: [
            { name: "Maize", price: 65, unit: "kg", image: "https://www.bettagrains.com/wp-content/uploads/2017/05/Muthokoi.jpg" },
            { name: "Beans", price: 180, unit: "kg", image: "https://safiorganics.co.ke/wp-content/uploads/2021/09/www_eatthis_com-variety-of-beans.webp" },
            { name: "Rice", price: 220, unit: "kg", image: "https://saccoreview.co.ke/wp-content/uploads/2025/08/brlp7gk_uncooked-rice-or-rice-grains_625x300_18_August_23.webp" },
            { name: "Sorghum", price: 90, unit: "kg", image: "https://safiorganics.co.ke/wp-content/uploads/2022/07/22658224f4ab20c9b21de83a26049177-nobel-prize-a-novel.webp" },
            { name: "Millets", price: 150, unit: "kg", image: "https://africanfarming.net/images_mob/2025/september/fingermillet.webp" },
            { name: "Wheat", price: 80, unit: "kg", image: "https://safiorganics.co.ke/wp-content/uploads/2022/10/2436498-wheat-li-jingwang-istockphoto-binary-4905392.webp" }
        ]
    },

    // =====================================================
    // TUBERS & ROOT CROPS
    // =====================================================
    {
        category: "Tubers & Roots",
        items: [
            { name: "Potatoes", price: 110, unit: "kg", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA-Ckznqaxh23RLU26PvdabBRZUtlIH4HH_A&s" },
            { name: "Sweet Potatoes", price: 90, unit: "kg", image: "https://cdn.guardian.ng/wp-content/uploads/2018/08/Sweet-potatoe.jpg" },
            { name: "Cassava", price: 70, unit: "kg", image: "https://safiorganics.co.ke/wp-content/uploads/2025/01/hQdJjVdFaDAgnTxfxXAW9Cu0iUehHRRI2oZacFUM-1.webp" },
            { name: "Arrowroot (Nduma)", price: 200, unit: "kg", image: "https://safiorganics.co.ke/wp-content/uploads/2025/05/WhatsApp-Image-2021-02-22-at-14.19.27-1-1024x1024-1.webp" }
        ]
    },

    // =====================================================
    // LEGUMES & OTHERS
    // =====================================================
    {
        category: "Legumes & Others",
        items: [
            { name: "Green Peas", price: 220, unit: "kg", image: "https://safiorganics.co.ke/wp-content/uploads/2023/07/1200px-Peas_in_pods_-_Studio.webp" },
            { name: "Groundnuts", price: 300, unit: "kg", image: "https://img2.tradewheel.com/uploads/images/products/6/9/0668603001751944188-high-quality-kenyan.jpg.webp" },
            { name: "Cowpeas (Kunde)", price: 150, unit: "kg", image: "https://www.simlaw.co.ke/uploads/product/cuFRwCowPeas%20Ken%20Kunde.jpg" },
            { name: "Pumpkin", price: 80, unit: "piece", image: "https://www.kenyanews.go.ke/wp-content/uploads/2024/07/IMG-20230929-WA0023-1200x630.jpg" },
            { name: "Sugarcane", price: 50, unit: "piece", image: "https://royalseedlings.com/wp-content/uploads/2025/06/sugar-001.jpg" }
        ]
    },

    // =====================================================
    // ANIMAL PRODUCE
    // =====================================================
    // Kienyeji = Indigenous/free-range (higher demand, premium price)
    // Layers = Commercial farm eggs (standard pricing)
    // Rabbit = Per piece, varies by breed and size
    // Kienyeji Chicken = Indigenous chicken, per piece (live or dressed)
    // Broiler = Commercial chicken, ready for market
    // =====================================================
    {
        category: "Animal Produce",
        items: [
            { name: "Kienyeji Eggs", price: 650, unit: "tray", image: "https://boreshafarm.co.ke/wp-content/uploads/2023/05/Eggs-Farmers-Market-Kenya.jpeg" },
            { name: "Layers Eggs", price: 420, unit: "tray", image: "https://biznakenya.com/wp-content/uploads/2025/05/egg-supplie.jpg" },
            { name: "Rabbit", price: 1000, unit: "piece", image: "https://cdn.standardmedia.co.ke/images/friday/exg3xurud7zqra5b6de96606679.jpg" },
            { name: "Kienyeji Chicken", price: 1000, unit: "piece", image: "https://cdn.standardmedia.co.ke/images/monday/tafk6oxgnknefoxm45ccff9878a237.jpg" },
            { name: "Broiler Chicken", price: 450, unit: "piece", image: "https://www.blueflamebiodigesters.com/wp-content/uploads/2025/05/Broilers-Chickens.webp" }
        ]
    }

    // ============================================================
    // TO ADD MORE CATEGORIES:
    // Copy this template and fill in your items:
    // {
    //     category: "Your Category Name",
    //     items: [
    //         { name: "Product Name", price: 0, unit: "per kg", image: "prod-images/filename.jpg" },
    //         { name: "Another Product", price: 0, unit: "per piece", image: "prod-images/filename.jpg" }
    //     ]
    // }
    // ============================================================

];

// =====================================================
// =====================================================
// SMART PRICING ENGINE — RANGE SYSTEM
// =====================================================
// =====================================================
//
// HOW IT WORKS:
// This engine auto-adjusts produce prices daily based on
// real Kenyan market patterns. When ON, prices display as
// a RANGE (e.g. "KES 110 – 150") reflecting the typical
// market spread across sellers, quality grades & bargaining.
// Prices change once per day (not on every page refresh).
//
// FORMULA:
//   midpoint = base_price × seasonal_factor × daily_variation
//   spread  = volatility_dailyRange × 0.6 (min 4%)
//   low     = midpoint × (1 - spread)
//   high    = midpoint × (1 + spread)
//
// SEASONAL CYCLE (Kenya's agricultural calendar):
//   Jan-Feb   → HIGH PRICES (lean season, low supply)
//   Mar-May   → DROPPING (long rains begin, planting)
//   Jun-Aug   → LOWEST PRICES (harvest peak, oversupply)
//   Sep-Oct   → SPIKING (dry season, scarcity builds)
//   Nov-Dec   → STABILIZING (short rains, second crop)
//
// RANGE WIDTH BY VOLATILITY:
//   Vegetables (tomatoes, capsicum) → WIDE range (±9-12%)
//   Fruits (mangoes, watermelon)    → MEDIUM-WIDE (±6-9%)
//   Grains & cereals                → NARROW (±4%)
//   Tubers & roots                  → MEDIUM (±4-6%)
//   Animal produce                  → TIGHTEST (±4%)
//
// WHEN SMART PRICING IS OFF:
//   Shows a single fixed price from PRODUCE_CATALOG (no range).
//
// =====================================================
// ★★★  SMART PRICING - ON/OFF SWITCH  ★★★
// =====================================================
//
// TO TURN THE PRICING ENGINE ON OR OFF:
//   Just change the value below to either  "ON"  or  "OFF"
//
//   "ON"  → Prices auto-adjust daily based on season & market
//   "OFF" → Shows your manual base prices from PRODUCE_CATALOG
//
//   THIS AFFECTS ALL USERS INSTANTLY.
//   No page refresh needed - just change the value, save, redeploy.
//
// WHEN TO TURN OFF:
//   If something unpredictable happens (flood, drought, policy change)
//   and prices don't match reality, turn OFF and adjust base prices
//   manually in PRODUCE_CATALOG above.
//
// WHEN TO TURN BACK ON:
//   When things stabilize, update base prices to current reality
//   and change this back to "ON".
//
// TO CHANGE BASE PRICES:
//   Edit the 'price' field in PRODUCE_CATALOG above.
//   That's the baseline the engine calculates from.
//
// =====================================================

var SMART_PRICING = "ON";   // ★★★ CHANGE TO "OFF" TO DISABLE ★★★

// =====================================================
// SEASONAL MULTIPLIER MAP (DO NOT EDIT unless updating research data)
// Based on Kenya's real agricultural cycle.
// Key: month number (1=Jan) → multiplier
// > 1.0 = prices above baseline (scarcity)
// < 1.0 = prices below baseline (abundance)
// =====================================================
var SEASONAL_MULTIPLIERS = {
    1:  1.25,   // January   - Lean season, high prices
    2:  1.20,   // February  - End of lean season
    3:  1.00,   // March     - Long rains begin, prices start dropping
    4:  0.95,   // April     - Planting season, supply increasing
    5:  0.90,   // May       - Rains peak, supply growing
    6:  0.85,   // June      - Harvest begins, prices dropping
    7:  0.80,   // July      - LOWEST - harvest peak, oversupply
    8:  0.85,   // August    - Late harvest, prices slowly rising
    9:  1.20,   // September - Dry season, scarcity builds, SPIKE
    10: 1.25,   // October   - Shortage period, high prices
    11: 1.00,   // November  - Short rains begin, prices stabilize
    12: 1.05    // December  - Stabilizing, mild holiday demand
};

// ---- CATEGORY VOLATILITY PROFILES (DO NOT EDIT unless updating research data) ----
// Controls how much each category reacts to seasonal changes.
// seasonWeight: How strongly the seasonal multiplier affects price.
//   > 1.0 = amplifies the swing (more volatile)
//   < 1.0 = dampens the swing (more stable)
// dailyRange: Max daily variation (±percent).
//   e.g., 0.15 means price can vary ±15% per day
// =====================================================
var CATEGORY_VOLATILITY = {
    "Vegetables":       { seasonWeight: 1.15, dailyRange: 0.10 },
    "Fruits":           { seasonWeight: 1.00, dailyRange: 0.08 },
    "Grains & Cereals": { seasonWeight: 0.50, dailyRange: 0.04 },
    "Tubers & Roots":   { seasonWeight: 0.70, dailyRange: 0.06 },
    "Legumes & Others": { seasonWeight: 0.70, dailyRange: 0.06 },
    "Animal Produce":   { seasonWeight: 0.30, dailyRange: 0.03 }
};

// ---- PRODUCT-SPECIFIC OVERRIDES (DO NOT EDIT unless updating research data) ----
// Some products are exceptionally volatile.
// These override the category defaults above.
// =====================================================
var PRODUCT_VOLATILITY_OVERRIDES = {
    "Tomatoes":         { seasonWeight: 1.40, dailyRange: 0.15 },  // Most volatile - can swing KES 100-380/kg
    "Capsicum (Hoho)":  { seasonWeight: 1.25, dailyRange: 0.12 },  // Follows tomato patterns
    "Mangoes":          { seasonWeight: 1.30, dailyRange: 0.12 },  // Seasonal fruit, big swings
    "Watermelon":       { seasonWeight: 1.20, dailyRange: 0.10 },  // Demand spikes in hot months
    "Passion Fruit":    { seasonWeight: 1.15, dailyRange: 0.10 },  // Supply varies greatly
    "Green Beans":      { seasonWeight: 1.10, dailyRange: 0.08 },  // Export crop, volatile
    "Sukuma Wiki (Kale)": { seasonWeight: 1.10, dailyRange: 0.06 }, // Staple, moderate swings
    "Spinach":          { seasonWeight: 1.10, dailyRange: 0.06 },  // Similar to sukuma
    "Onions":           { seasonWeight: 1.10, dailyRange: 0.10 }   // Big price swings
};

// ---- PRICING ENGINE STATE (DO NOT EDIT) ----
var _cachedPrices = {};       // { "Tomatoes": { price, priceLow, priceHigh, basePrice, trend, status } }
var _lastCalcDate = null;    // "Mon Jun 15 2026" - recalculates when date changes
var _smartPricingOn = false;  // Runtime state (set from SMART_PRICING variable above)

// =====================================================
// PRICING ENGINE - CORE FUNCTIONS
// =====================================================

// Deterministic hash for product names (same name always = same hash)
function _productHash(str) {
    var hash = 5381;
    for (var i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash) + str.charCodeAt(i);
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
}

// Seeded random number generator (deterministic - same seed = same output)
// This means prices don't change on every page refresh, only once per day.
function _seededRandom(seed) {
    var x = Math.sin(seed * 9301 + 49297) * 233280;
    return x - Math.floor(x);
}

// Get today's date as a numeric seed (changes once per day)
function _getDailySeed() {
    var d = new Date();
    return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

// Get daily variation for a specific product (deterministic per day)
// Returns a value between (1 - dailyRange) and (1 + dailyRange)
function _getDailyVariation(productName, dailyRange) {
    var seed = _getDailySeed();
    var hash = _productHash(productName);
    var combinedSeed = seed * 31 + hash;
    var rand = _seededRandom(combinedSeed);
    // Map random value to the daily range
    return (1 - dailyRange) + (rand * dailyRange * 2);
}

// Get the volatility profile for a product (category default + specific override)
function _getVolatilityProfile(productName, category) {
    if (PRODUCT_VOLATILITY_OVERRIDES[productName]) {
        return PRODUCT_VOLATILITY_OVERRIDES[productName];
    }
    if (CATEGORY_VOLATILITY[category]) {
        return CATEGORY_VOLATILITY[category];
    }
    return { seasonWeight: 1.0, dailyRange: 0.05 }; // Fallback
}

// Calculate the price RANGE for a single product (low – mid – high)
// The range represents the typical market spread across different
// sellers, quality grades, and bargaining outcomes.
// Returns: { low, mid, high }
function _calculatePriceRange(item, category) {
    var basePrice = item.price;
    var month = new Date().getMonth() + 1; // 1-12

    // 1. Get seasonal multiplier for this month
    var seasonalMultiplier = SEASONAL_MULTIPLIERS[month] || 1.0;

    // 2. Get volatility profile for this product
    var profile = _getVolatilityProfile(item.name, category);

    // 3. Apply seasonal swing with product-specific weight
    // Formula: adjustedSeasonal = 1 + (seasonalMultiplier - 1) × seasonWeight
    var adjustedSeasonal = 1.0 + (seasonalMultiplier - 1.0) * profile.seasonWeight;

    // 4. Get daily micro-variation (deterministic per product per day)
    var dailyVariation = _getDailyVariation(item.name, profile.dailyRange);

    // 5. Calculate midpoint price
    var midPrice = Math.round(basePrice * adjustedSeasonal * dailyVariation);

    // 6. Calculate range spread based on volatility
    // More volatile products = wider range between low and high
    // Minimum 4% spread ensures even stable products show a visible range
    var rangeSpread = Math.max(profile.dailyRange * 0.6, 0.04);

    // Add deterministic jitter to the spread itself (so it's not always exactly ±X%)
    var spreadSeed = _getDailySeed() * 7 + _productHash(item.name + '_spread');
    var spreadJitter = 0.85 + _seededRandom(spreadSeed) * 0.30; // 0.85 to 1.15
    rangeSpread = rangeSpread * spreadJitter;

    // 7. Calculate low and high from the midpoint
    var lowPrice = Math.round(midPrice * (1 - rangeSpread));
    var highPrice = Math.round(midPrice * (1 + rangeSpread));

    // 8. Clamp to the same bounds (70%–160% of base)
    var minBound = Math.round(basePrice * 0.70);
    var maxBound = Math.round(basePrice * 1.60);
    lowPrice = Math.max(minBound, lowPrice);
    highPrice = Math.min(maxBound, highPrice);

    // 9. Round for clean display: prices > 100 round to nearest 5
    if (lowPrice > 100) lowPrice = Math.round(lowPrice / 5) * 5;
    if (highPrice > 100) highPrice = Math.round(highPrice / 5) * 5;
    if (midPrice > 100) midPrice = Math.round(midPrice / 5) * 5;

    // 10. Ensure low <= high (rounding can flip them for tiny spreads)
    if (lowPrice > highPrice) {
        var swap = lowPrice;
        lowPrice = highPrice;
        highPrice = swap;
    }

    // 11. If low == high (rare for cheap items), widen slightly
    if (lowPrice === highPrice && basePrice > 20) {
        lowPrice = Math.max(Math.round(basePrice * 0.92), lowPrice - 5);
        highPrice = Math.min(Math.round(basePrice * 1.08), highPrice + 5);
    }

    return { low: lowPrice, mid: midPrice, high: highPrice };
}

// Determine the price trend compared to base price
function _getPriceTrend(basePrice, dynamicPrice) {
    var diff = dynamicPrice - basePrice;
    var pct = Math.abs(Math.round((diff / basePrice) * 100));
    if (pct < 2) pct = 0; // Below 2% = stable

    if (diff > 2) {
        return { arrow: "▲", pct: pct, cssClass: "trend-up", label: "above base" };
    } else if (diff < -2) {
        return { arrow: "▼", pct: pct, cssClass: "trend-down", label: "below base" };
    }
    return { arrow: "►", pct: 0, cssClass: "trend-stable", label: "stable" };
}

// Determine market status based on price vs base
function _getMarketStatus(basePrice, dynamicPrice) {
    var ratio = dynamicPrice / basePrice;
    if (ratio >= 1.15) return { label: "High Price", type: "high", icon: "🔴" };
    if (ratio <= 0.90) return { label: "Good Price", type: "good", icon: "🟢" };
    return { label: "Normal", type: "normal", icon: "🟡" };
}

// Calculate ALL dynamic price RANGES at once (called once per day)
function _calculateAllDynamicPrices() {
    _cachedPrices = {};
    var today = new Date().toDateString();
    _lastCalcDate = today;

    for (var i = 0; i < PRODUCE_CATALOG.length; i++) {
        var cat = PRODUCE_CATALOG[i];
        for (var j = 0; j < cat.items.length; j++) {
            var item = cat.items[j];
            var range = _calculatePriceRange(item, cat.category);
            var trend = _getPriceTrend(item.price, range.mid);
            var status = _getMarketStatus(item.price, range.mid);

            _cachedPrices[item.name] = {
                price: range.mid,
                priceLow: range.low,
                priceHigh: range.high,
                basePrice: item.price,
                trend: trend,
                status: status
            };
        }
    }

    console.log('[Smart Pricing] Calculated ' + Object.keys(_cachedPrices).length + ' price ranges for ' + today);
}

// Get the display price (or range) for a product
// When Smart Pricing ON: returns { price, priceLow, priceHigh, trend, status }
// When OFF: returns { price, trend: null, status: null }
function getDisplayPrice(item) {
    if (!_smartPricingOn) return { price: item.price, trend: null, status: null };
    if (_cachedPrices[item.name]) return _cachedPrices[item.name];
    return { price: item.price, trend: null, status: null };
}

// Check if smart pricing is currently enabled
function isSmartPricingOn() {
    return _smartPricingOn;
}

// =====================================================
// SMART PRICING - INITIALIZATION
// =====================================================
// Reads the SMART_PRICING variable at the top of this section.
// Change it to "ON" or "OFF" in the back-code to control all users.
// =====================================================

function initSmartPricing() {
    // Read the back-code toggle (case-insensitive)
    _smartPricingOn = (SMART_PRICING === "ON" || SMART_PRICING === "on" || SMART_PRICING === "On");

    // Calculate prices if engine is on
    if (_smartPricingOn) {
        _calculateAllDynamicPrices();
    }

    console.log('[Smart Pricing] Engine initialized - ' + (_smartPricingOn ? 'ON' : 'OFF') + ' (set in back-code)');
}

// =====================================================
// TOGGLE FUNCTION - FOR BACK-CODE USE ONLY
// =====================================================
// You can also call toggleSmartPricing(true/false) from the
// browser console if needed for quick testing.
// Normal control: change SMART_PRICING variable above.
// =====================================================

function toggleSmartPricing(enable) {
    _smartPricingOn = enable;

    if (enable) {
        _calculateAllDynamicPrices();
    }

    // Re-render produce grid to update displayed prices
    renderProduce();

    console.log('[Smart Pricing] Toggled to ' + (enable ? 'ON' : 'OFF'));
}

// Inject pricing engine CSS styles (done once, no style.css changes needed)
// Only includes styles for price trend indicators on product cards.
// No visible toggle bar - the switch is in the back-code above.
function injectPricingStyles() {
    if (document.getElementById('smartPricingStyles')) return; // Already injected

    var style = document.createElement('style');
    style.id = 'smartPricingStyles';
    style.textContent =
        /* Price Trend Indicator (shown on product cards when Smart Pricing is ON) */
        '.price-trend{font-size:0.6rem;font-weight:800;margin-left:auto;padding:0.05rem 0.3rem;border-radius:4px;line-height:1;flex-shrink:0;}' +
        '.trend-up{color:#EF4444;background:rgba(239,68,68,0.12);}' +
        '.trend-down{color:#10B981;background:rgba(16,185,129,0.12);}' +
        '.trend-stable{color:#94A3B8;background:rgba(148,163,184,0.12);}' +
        /* Market Status Dot (small colored dot on price tag) */
        '.market-status-dot{display:inline-block;width:6px;height:6px;border-radius:50%;flex-shrink:0;}' +
        '.dot-high{background:#EF4444;box-shadow:0 0 4px rgba(239,68,68,0.4);}' +
        '.dot-normal{background:#F59E0B;box-shadow:0 0 4px rgba(245,158,11,0.4);}' +
        '.dot-good{background:#10B981;box-shadow:0 0 4px rgba(16,185,129,0.4);}' +
        /* Modified price tag when pricing is active */
        '.product-price-tag.sp-pricing-active{gap:0.15rem;align-items:flex-end;}' +
        /* Price range dash separator styling */
        '.product-price-amount{white-space:nowrap;}';

    document.head.appendChild(style);
}

// =====================================================
// APP STATE
// =====================================================
var currentCategory = "all";
var currentSearch = "";
var currentAction = "buy"; // "buy" or "sell"
var currentProduct = null;
var deferredInstallPrompt = null;

// =====================================================
// INITIALIZATION
// =====================================================

function init() {
    console.log('[AgriXen Markets] Initializing...');

    setupProtections();
    initSmartPricing();       // NEW: Initialize pricing engine
    injectPricingStyles();    // NEW: Inject pricing CSS
    renderCategories();
    renderProduce();
    setupEventListeners();
    setupScrollEffects();
    initPWA();
    initSlotAds();

    // Hide loading screen
    setTimeout(function() {
        var loader = document.getElementById('loadingScreen');
        var app = document.getElementById('app');

        if (loader) {
            loader.classList.add('fade-out');
            setTimeout(function() {
                loader.style.display = 'none';
            }, 600);
        }
        if (app) {
            app.classList.remove('hidden');
        }

        console.log('[AgriXen Markets] Ready!');
    }, 2500);
}

// =====================================================
// CODE PROTECTION - Right Click & Dev Tools Block
// =====================================================

function setupProtections() {
    // Block right-click
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    // Block dev tools shortcuts
    document.addEventListener('keydown', function(e) {
        // F12
        if (e.key === 'F12') {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C
        if (e.ctrlKey && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].indexOf(e.key) !== -1) {
            e.preventDefault();
            return false;
        }
        // Ctrl+U (View Source)
        if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
            e.preventDefault();
            return false;
        }
        // Cmd+Option+I (Mac)
        if (e.metaKey && e.altKey && (e.key === 'I' || e.key === 'i')) {
            e.preventDefault();
            return false;
        }
    });
}

// =====================================================
// CATEGORY RENDERING
// =====================================================

function renderCategories() {
    var container = document.getElementById('categoryScroll');
    if (!container) return;

    var totalCount = getTotalItemCount();

    var html = '<button class="cat-btn active" data-cat="all">All <span class="cat-count">' + totalCount + '</span></button>';

    for (var i = 0; i < PRODUCE_CATALOG.length; i++) {
        var cat = PRODUCE_CATALOG[i];
        var count = cat.items.length;
        var catSlug = cat.category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        html += '<button class="cat-btn" data-cat="' + catSlug + '">' + cat.category + ' <span class="cat-count">' + count + '</span></button>';
    }

    container.innerHTML = html;
}

function getTotalItemCount() {
    var count = 0;
    for (var i = 0; i < PRODUCE_CATALOG.length; i++) {
        count += PRODUCE_CATALOG[i].items.length;
    }
    return count;
}

function getCategorySlug(categoryName) {
    return categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

// =====================================================
// SLOT ADS - ROTATION SYSTEM
// =====================================================
// Each ad slot rotates independently with Fisher-Yates shuffle.
// No ad repeats within a full cycle.
// =====================================================

function initSlotAds() {
    if (SLOT_ADS.length === 0) {
        console.log('[AgriXen Markets] No slot ads configured.');
        return;
    }

    var slots = document.querySelectorAll('.ad-slot');
    console.log('[AgriXen Markets] Initializing ' + slots.length + ' ad slot(s)...');

    for (var i = 0; i < slots.length; i++) {
        initIndividualSlot(slots[i], i);
    }
}

function fisherYatesShuffle(arr) {
    var shuffled = arr.slice();
    for (var i = shuffled.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = temp;
    }
    return shuffled;
}

function initIndividualSlot(slotEl, slotIndex) {
    var shuffled = fisherYatesShuffle(SLOT_ADS);

    adSlotStates[slotIndex] = {
        queue: shuffled,
        currentIndex: 0
    };

    // Show first ad immediately
    showSlotAd(slotEl, slotIndex);

    // Schedule rotation
    scheduleNextSlot(slotEl, slotIndex);
}

function showSlotAd(slotEl, slotIndex) {
    var state = adSlotStates[slotIndex];
    if (!state || SLOT_ADS.length === 0) return;

    var ad = state.queue[state.currentIndex];
    var imgEl = slotEl.querySelector('.ad-slot-image');

    if (imgEl && ad) {
        imgEl.src = ad.image;
        imgEl.alt = ad.alt || 'Ad';
        imgEl.style.opacity = '0';
        // Update ad link
        var linkEl = slotEl.querySelector('.ad-slot-link');
        if (linkEl && ad.link) {
            linkEl.href = ad.link;
            linkEl.style.pointerEvents = 'auto';
        } else if (linkEl) {
            linkEl.href = '#';
            linkEl.style.pointerEvents = 'none';
        }
        // Fade in effect
        setTimeout(function() {
            imgEl.style.opacity = '1';
        }, 50);
    }
}

function scheduleNextSlot(slotEl, slotIndex) {
    var ms = 10000; // default 10 seconds
    var dur = AD_ROTATION_DURATION;

    if (dur && dur.endsWith('m')) {
        ms = parseInt(dur) * 60000;
    } else if (dur && dur.endsWith('s')) {
        ms = parseInt(dur) * 1000;
    }

    setTimeout(function() {
        var state = adSlotStates[slotIndex];
        if (!state) return;

        state.currentIndex++;

        // If we've shown all ads in this cycle, reshuffle for next cycle
        if (state.currentIndex >= state.queue.length) {
            state.queue = fisherYatesShuffle(SLOT_ADS);
            state.currentIndex = 0;
        }

        showSlotAd(slotEl, slotIndex);
        scheduleNextSlot(slotEl, slotIndex);
    }, ms);
}

// =====================================================
// PRODUCE RENDERING
// =====================================================

function getFilteredItems() {
    var items = [];

    for (var i = 0; i < PRODUCE_CATALOG.length; i++) {
        var cat = PRODUCE_CATALOG[i];

        // Category filter
        if (currentCategory !== 'all') {
            var catSlug = getCategorySlug(cat.category);
            if (catSlug !== currentCategory) continue;
        }

        for (var j = 0; j < cat.items.length; j++) {
            var item = cat.items[j];
            item._category = cat.category;

            // Search filter
            if (currentSearch) {
                var searchLower = currentSearch.toLowerCase();
                if (item.name.toLowerCase().indexOf(searchLower) === -1 &&
                    cat.category.toLowerCase().indexOf(searchLower) === -1) {
                    continue;
                }
            }

            items.push(item);
        }
    }

    return items;
}

function renderProduce() {
    var grid = document.getElementById('produceGrid');
    var noResults = document.getElementById('noResults');
    if (!grid) return;

    var items = getFilteredItems();

    if (items.length === 0) {
        grid.innerHTML = '';
        if (noResults) noResults.style.display = 'block';
        return;
    }

    if (noResults) noResults.style.display = 'none';

    var html = '';
    var adSlotCounter = 0;

    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var index = i;

        // SMART PRICING: Get display price (dynamic or base)
        var pricing = getDisplayPrice(item);
        var displayPrice = pricing.price;

        html += '<div class="product-card reveal">';

        // Image
        html += '<div class="product-img-wrap">';
        if (item.image) {
            html += '<img src="' + item.image + '" alt="' + item.name + '" loading="lazy" onerror="this.parentElement.innerHTML=\'<div class=product-image-placeholder>' + item.name + '</div>\'">';
        } else {
            html += '<div class="product-image-placeholder">' + item.name + '</div>';
        }
        // Price overlay on image (with trend indicator when pricing is active)
        html += '<div class="product-price-tag' + (isSmartPricingOn() ? ' sp-pricing-active' : '') + '">';
        // PRICE RANGE: Show "KES 110 – 150" when smart pricing is ON
        if (isSmartPricingOn() && pricing.priceLow !== undefined && pricing.priceLow !== pricing.priceHigh) {
            html += '<span class="product-price-amount">KES ' + pricing.priceLow.toLocaleString() + ' – ' + pricing.priceHigh.toLocaleString() + '</span>';
        } else {
            html += '<span class="product-price-amount">KES ' + displayPrice.toLocaleString() + '</span>';
        }
        html += '<span class="product-price-unit">' + item.unit + '</span>';
        // SMART PRICING: Show trend arrow when engine is on
        if (isSmartPricingOn() && pricing.trend) {
            html += '<span class="price-trend ' + pricing.trend.cssClass + '">' + pricing.trend.arrow + (pricing.trend.pct > 0 ? ' ' + pricing.trend.pct + '%' : '') + '</span>';
            html += '<span class="market-status-dot dot-' + pricing.status.type + '"></span>';
        }
        html += '</div>';
        html += '</div>';

        // Info
        html += '<div class="product-info">';
        html += '<div class="product-name">' + item.name + '</div>';
        html += '<div class="product-actions">';
        html += '<button class="btn-buy" onclick="openModal(' + index + ', \'buy\')">Buy</button>';
        html += '<button class="btn-sell" onclick="openModal(' + index + ', \'sell\')">Sell</button>';
        html += '</div>';
        html += '</div>';

        html += '</div>';

        // Insert ad slot after every 3 produce cards (only if ads are configured)
        if ((i + 1) % 3 === 0 && SLOT_ADS.length > 0) {
            html += '<div class="product-card ad-slot reveal" data-slot-index="' + adSlotCounter + '">';
            html += '<a class="ad-slot-link" href="#" target="_blank" rel="noopener noreferrer">';
            html += '<div class="product-img-wrap ad-slot-wrap">';
            html += '<img src="" alt="Ad" class="ad-slot-image" loading="lazy">';
            html += '</div>';
            html += '</a>';
            html += '<div class="product-info">';
            html += '<div class="ad-slot-label">Sponsored</div>';
            html += '</div>';
            html += '</div>';
            adSlotCounter++;
        }
    }

    grid.innerHTML = html;

    // Trigger reveal animations
    setTimeout(initRevealAnimations, 50);

    // Initialize ad slots after DOM update
    initSlotAds();
}

// Store filtered items for modal access
var _renderedItems = [];
var _originalRender = renderProduce;
renderProduce = function() {
    _renderedItems = getFilteredItems();
    _originalRender();
};

// =====================================================
// MODAL (Buy / Sell)
// =====================================================

function openModal(index, action) {
    if (index < 0 || index >= _renderedItems.length) return;

    var item = _renderedItems[index];
    currentProduct = item;
    currentAction = action;

    // Update modal content
    var title = document.getElementById('modalTitle');
    var price = document.getElementById('modalPrice');
    var askingGroup = document.getElementById('askingPriceGroup');
    var quantityLabel = document.getElementById('quantityLabel');
    var submitBtn = document.getElementById('actionForm').querySelector('.btn-submit');

    // Title
    title.textContent = (action === 'buy' ? 'Buy ' : 'Sell ') + item.name;

    // SMART PRICING: Show price range in modal
    var pricing = getDisplayPrice(item);
    var displayPrice = pricing.price;
    var priceStr = 'Market: ';
    if (isSmartPricingOn() && pricing.priceLow !== undefined && pricing.priceLow !== pricing.priceHigh) {
        priceStr += 'KES ' + pricing.priceLow.toLocaleString() + ' – ' + pricing.priceHigh.toLocaleString();
    } else {
        priceStr += 'KES ' + displayPrice.toLocaleString();
    }
    priceStr += ' / ' + item.unit;
    if (isSmartPricingOn() && pricing.trend) {
        priceStr += '  ' + pricing.trend.arrow + ' ' + pricing.status.label;
    }
    price.textContent = priceStr;

    // Thumbnail - handle image vs placeholder
    var thumbParent = document.querySelector('.modal-header-left');
    var oldThumb = thumbParent.querySelector('.modal-thumb, .modal-placeholder-thumb');
    if (oldThumb) oldThumb.remove();

    if (item.image) {
        var img = document.createElement('img');
        img.src = item.image;
        img.alt = item.name;
        img.className = 'modal-thumb';
        img.onerror = function() {
            this.outerHTML = '<div class="modal-placeholder-thumb">' + item.name + '</div>';
        };
        thumbParent.insertBefore(img, thumbParent.firstChild);
    } else {
        var placeholderDiv = document.createElement('div');
        placeholderDiv.className = 'modal-placeholder-thumb';
        placeholderDiv.textContent = item.name;
        thumbParent.insertBefore(placeholderDiv, thumbParent.firstChild);
    }

    // Show/hide asking price field (only for sellers)
    if (action === 'sell') {
        askingGroup.style.display = 'flex';
        quantityLabel.textContent = 'Quantity to Sell *';
    } else {
        askingGroup.style.display = 'none';
        quantityLabel.textContent = 'Quantity Needed *';
    }

    // Submit button style
    submitBtn.className = 'btn-submit mode-' + action;

    // Reset form
    document.getElementById('actionForm').reset();

    // Show modal
    document.getElementById('actionModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('actionModal').classList.add('hidden');
    currentProduct = null;
}

// =====================================================
// WHATSAPP INTEGRATION
// =====================================================

function sendToWhatsApp(event) {
    event.preventDefault();

    if (!currentProduct) return;

    var name = document.getElementById('formName').value.trim();
    var location = document.getElementById('formLocation').value.trim();
    var quantity = document.getElementById('formQuantity').value.trim();
    var askingPrice = document.getElementById('formAskingPrice').value.trim();

    // Validation
    if (!name || !location || !quantity) {
        toast('Please fill in all required fields');
        return;
    }

    // SMART PRICING: Use the display price (what user sees) in WhatsApp message
    var pricing = getDisplayPrice(currentProduct);
    var marketPrice = pricing.price;

    // Build formatted message
    var message = '';

    if (currentAction === 'buy') {
        message = '🛒 *AGRIXEN MARKETS - BUY REQUEST*\n\n';
        message += '📦 *Product:* ' + currentProduct.name + '\n';
        // Show price range in WhatsApp message
        if (isSmartPricingOn() && pricing.priceLow !== undefined && pricing.priceLow !== pricing.priceHigh) {
            message += '📊 *Market Range:* KES ' + pricing.priceLow.toLocaleString() + ' – ' + pricing.priceHigh.toLocaleString() + ' / ' + currentProduct.unit + '\n';
        } else {
            message += '📊 *Market Price:* KES ' + marketPrice.toLocaleString() + ' / ' + currentProduct.unit + '\n';
        }
        message += '🔢 *Quantity Needed:* ' + quantity + '\n';
        message += '👤 *Name:* ' + name + '\n';
        message += '📍 *Location:* ' + location + '\n\n';
        message += '_Sent via AgriXen Markets_';
    } else {
        message = '🌾 *AGRIXEN MARKETS - SELL OFFER*\n\n';
        message += '📦 *Product:* ' + currentProduct.name + '\n';
        message += '🔢 *Quantity Available:* ' + quantity + '\n';
        if (askingPrice) {
            message += '💰 *Asking Price:* ' + askingPrice + '\n';
        } else {
            message += '💰 *Asking Price:* Open to negotiation\n';
        }
        message += '👤 *Name:* ' + name + '\n';
        message += '📍 *Location:* ' + location + '\n\n';
        message += '_Sent via AgriXen Markets_';
    }

    // Encode and open WhatsApp
    var encodedMessage = encodeURIComponent(message);
    var whatsappUrl = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodedMessage;

    // Close modal and redirect
    closeModal();
    window.open(whatsappUrl, '_blank');

    // Confirm to user
    setTimeout(function() {
        toast(currentAction === 'buy' ? 'Opening WhatsApp with your order...' : 'Opening WhatsApp with your offer...');
    }, 300);
}

// =====================================================
// SEARCH
// =====================================================

function handleSearch(query) {
    currentSearch = query.trim();
    var clearBtn = document.getElementById('clearSearch');
    clearBtn.style.display = currentSearch ? 'flex' : 'none';
    renderProduce();
}

function clearSearchField() {
    document.getElementById('searchInput').value = '';
    handleSearch('');
    document.getElementById('searchInput').focus();
}

// =====================================================
// SCROLL EFFECTS
// =====================================================

function setupScrollEffects() {
    var header = document.getElementById('header');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });
}

// =====================================================
// REVEAL ANIMATIONS
// =====================================================

function initRevealAnimations() {
    var reveals = document.querySelectorAll('.reveal:not(.visible)');
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

    reveals.forEach(function(el) {
        observer.observe(el);
    });
}

// =====================================================
// PWA - INSTALL
// =====================================================

function initPWA() {
    // Register service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js').then(function(reg) {
            console.log('[AgriXen Markets] Service Worker registered');

            // Check for updates every hour
            setInterval(function() {
                reg.update();
            }, 3600000);

            // Reload on new version
            navigator.serviceWorker.addEventListener('controllerchange', function() {
                window.location.reload();
            });
        }).catch(function(err) {
            console.log('[AgriXen Markets] SW registration failed:', err);
        });
    }

    // Install prompt
    window.addEventListener('beforeinstallprompt', function(e) {
        e.preventDefault();
        deferredInstallPrompt = e;

        var installBtn = document.getElementById('installBtn');
        if (installBtn) installBtn.style.display = 'flex';

        // Show install modal after delay (only once per session)
        if (!sessionStorage.getItem('agrixen_markets_install_prompted')) {
            setTimeout(function() {
                if (deferredInstallPrompt) {
                    document.getElementById('installModal').classList.remove('hidden');
                    sessionStorage.setItem('agrixen_markets_install_prompted', 'true');
                }
            }, 8000);
        }
    });

    // App installed
    window.addEventListener('appinstalled', function() {
        console.log('[AgriXen Markets] App installed');
        deferredInstallPrompt = null;
        var installBtn = document.getElementById('installBtn');
        if (installBtn) {
            installBtn.innerHTML = 'Installed';
            installBtn.classList.add('installed');
            installBtn.style.display = 'flex';
        }
        toast('AgriXen Markets installed successfully!');
    });

    // Check if already installed
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
        var installBtn = document.getElementById('installBtn');
        if (installBtn) installBtn.style.display = 'none';
    }
}

function triggerInstall() {
    document.getElementById('installModal').classList.add('hidden');

    if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        deferredInstallPrompt.userChoice.then(function(choice) {
            if (choice.outcome === 'accepted') {
                console.log('[AgriXen Markets] Install accepted');
            }
            deferredInstallPrompt = null;
        });
    } else {
        toast('Use your browser menu to "Add to Home Screen"');
    }
}

// =====================================================
// EVENT LISTENERS
// =====================================================

function setupEventListeners() {
    // Category buttons (delegated)
    document.getElementById('categoryScroll').addEventListener('click', function(e) {
        var btn = e.target.closest('.cat-btn');
        if (!btn) return;

        // Update active state
        var allBtns = this.querySelectorAll('.cat-btn');
        for (var i = 0; i < allBtns.length; i++) {
            allBtns[i].classList.remove('active');
        }
        btn.classList.add('active');

        currentCategory = btn.getAttribute('data-cat');
        renderProduce();
    });

    // Search
    var searchInput = document.getElementById('searchInput');
    var searchTimeout = null;
    searchInput.addEventListener('input', function() {
        var val = this.value;
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(function() {
            handleSearch(val);
        }, 200);
    });
    document.getElementById('clearSearch').addEventListener('click', clearSearchField);

    // Modal close
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('actionModal').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });

    // Form submit
    document.getElementById('actionForm').addEventListener('submit', sendToWhatsApp);

    // Install buttons
    document.getElementById('installAppBtn').addEventListener('click', triggerInstall);
    document.getElementById('installLaterBtn').addEventListener('click', function() {
        document.getElementById('installModal').classList.add('hidden');
    });
    document.getElementById('installBtn').addEventListener('click', triggerInstall);

    // Escape key closes modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.getElementById('installModal').classList.add('hidden');
        }
    });
}

// =====================================================
// TOAST UTILITY
// =====================================================

function toast(msg) {
    var t = document.getElementById('toast');
    if (!t) return;

    t.textContent = msg;
    t.className = 'toast show';

    setTimeout(function() {
        t.classList.remove('show');
        t.classList.add('fade-out');
        setTimeout(function() {
            t.className = 'toast';
        }, 300);
    }, 2500);
}

// =====================================================
// BOOT
// =====================================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
