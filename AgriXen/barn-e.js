/**
 * =====================================================
 * BARN-E AI - LOCAL RESPONSE ENGINE v2.0
 * =====================================================
 * EXPANDED KNOWLEDGE BASE - Smart, Helpful, Funny, Kind
 * Government resources, detailed farming guides, personality
 * =====================================================
 */

function generateLocalResponse(message, topic) {
    console.log('[Barn-E] Processing:', message);
    
    if (!message || typeof message !== 'string') {
        return '<p><strong>Error:</strong> Please send a valid message.</p>';
    }
    
    var lowerMsg = message.toLowerCase();
    var currentMonth = new Date().toLocaleString('en', { month: 'short' });
    var currentMonthFull = new Date().toLocaleString('en', { month: 'long' });
    var html = '';
    
    var cropDataAvailable = typeof CROP_DATA !== 'undefined' && Array.isArray(CROP_DATA);

    // =====================================================
    // PERSONALITY & CONVERSATION - Compliments, Emotions
    // =====================================================
    
    // Compliments
    if (lowerMsg.match(/\b(you('re| are) (smart|clever|amazing|awesome|great|helpful|brilliant|intelligent|wonderful|fantastic|best))\b/) ||
        lowerMsg.match(/\b(good bot|nice bot|love you|i like you|you('re| are) the best)\b/)) {
        var responses = [
            '<p><strong>Aww, asante sana! 🥰</strong></p><p>You just made my circuits warm! Happy to help a fellow farmer!</p>',
            '<p><strong>Aw, that\'s so kind! 😊</strong></p><p>Helping Kenyan farmers is what I live for! What else can I help with?</p>',
            '<p><strong> blushes in AI 🙈</strong></p><p>Asante! I try my best to be helpful! Got any farming questions?</p>',
            '<p><strong>You\'re pretty great yourself! 🌟</strong></p><p>Farmers like you make Kenya\'s agriculture shine! How can I help today?</p>'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    if (lowerMsg.match(/\b(thank you|thanks|asante|asante sana|shukrani|appreciate)\b/)) {
        var thanksResponses = [
            '<p><strong>Karibu sana! 🙏</strong></p><p>Always here to help! Happy farming!</p>',
            '<p><strong>Karibu! 😊</strong></p><p>That\'s what I\'m here for! Ask me anything anytime!</p>',
            '<p><strong>My pleasure! 🌱</strong></p><p>Helping farmers succeed is my purpose!</p>'
        ];
        return thanksResponses[Math.floor(Math.random() * thanksResponses.length)];
    }
    
    // Interesting, wow, cool
    if (lowerMsg.match(/\b(interesting|wow|cool|awesome|amazing|really|oh|ah|ok|okay|hmm|nice)\b/) && lowerMsg.length < 20) {
        var interestResponses = [
            '<p><strong>I know, right? 😄</strong></p><p>Farming is fascinating! Want to know more?</p>',
            '<p><strong>Farming is full of surprises! 🌾</strong></p><p>What else would you like to explore?</p>',
            '<p><strong>There\'s always more to learn! 📚</strong></p><p>Ask me anything about crops or livestock!</p>'
        ];
        return interestResponses[Math.floor(Math.random() * interestResponses.length)];
    }
    
    // How are you
    if (lowerMsg.match(/\b(how are you|how r u|how you doing|how's it going|vipi wewe|habari yako|umeamkaje)\b/)) {
        var howResponses = [
            '<p><strong>Poasana, asante sana! 😊</strong></p><p>Ready to help you grow! What\'s on your farm today?</p>',
            '<p><strong>Doing great! 🌱</strong></p><p>Every day is a good day to help farmers! How can I assist?</p>',
            '<p><strong>Fantastic! The weather is looking good! ☀️</strong></p><p>How about you? Any farming questions?</p>'
        ];
        return howResponses[Math.floor(Math.random() * howResponses.length)];
    }
    
    // What is your name / who are you
    if (lowerMsg.match(/\b(your name|who are you|what are you|tell me about yourself|introduce yourself)\b/)) {
        html = '<p><strong>I\'m Barn-E! 🤖</strong></p>';
        html += '<p>Your friendly AI farming buddy from <strong>AgriXen</strong>!</p>';
        html += '<p><strong>My personality:</strong> Helpful, smart, a bit funny, and passionate about farming! 😄</p>';
        html += '<p><strong>What I know:</strong> 26 crops, 8 livestock types, pests, diseases, soil, weather, markets, government resources, and more!</p>';
        html += '<p><strong>100% FREE</strong> - No account, no fees, just farming knowledge!</p>';
        return html;
    }
    
    // Jokes
    if (lowerMsg.match(/\b(tell me a joke|joke|funny|make me laugh|humor)\b/)) {
        var jokes = [
            '<p><strong>😂 Here\'s one:</strong></p><p>Why did the tomato turn red? Because it saw the salad dressing! 🥗</p>',
            '<p><strong>😄 Farming joke:</strong></p><p>Why do cows wear bells? Because their horns don\'t work! 🔔🐄</p>',
            '<p><strong>🤣 Gotcha!</strong></p><p>What do you call a sleeping dinosaur? A dino-snore! Just kidding - what do you call a fake noodle? An impasta! 🍝</p>',
            '<p><strong>😂 Agricultural humor:</strong></p><p>Why did the scarecrow win an award? He was outstanding in his field! 🌾</p>'
        ];
        return jokes[Math.floor(Math.random() * jokes.length)];
    }
    
    // Good morning/afternoon/evening
    if (lowerMsg.match(/\b(good morning|morning|habari za asubuhi)\b/)) {
        html = '<p><strong>Good morning, farmer! ☀️</strong></p>';
        html += '<p>Asante kwa kuamka mapema! Early bird catches the worm!</p>';
        html += '<p><strong>How can I help your day?</strong></p>';
        html += '<ul>';
        html += '<li>🌱 Check what to plant this month</li>';
        html += '<li>🌤️ Review weather forecast</li>';
        html += '<li>🐄 Get livestock care tips</li>';
        html += '</ul>';
        return html;
    }
    
    if (lowerMsg.match(/\b(good afternoon|afternoon)\b/)) {
        return '<p><strong>Good afternoon! 🌤️</strong></p><p>How\'s your shamba treating you today? Ask me anything!</p>';
    }
    
    if (lowerMsg.match(/\b(good evening|evening)\b/)) {
        return '<p><strong>Good evening! 🌅</strong></p><p>Time to rest after a productive day! Anything I can help with?</p>';
    }
    
    if (lowerMsg.match(/\b(good night|goodnight)\b/)) {
        return '<p><strong>Good night! 🌙</strong></p><p>Rest well, farmer! Tomorrow brings new harvests! Kwaheri!</p>';
    }
    
    // Greetings
    if (lowerMsg.match(/^(hi|hello|hey|greetings|howdy|jambo|hujambo|sasa|niaje|mambo|vipi|habari|yo|sup)\b/) || 
        lowerMsg.match(/\b(hi there|hello there|hey there)\b/)) {
        html = '<p><strong>Jambo sana!</strong> Habari yako? 👋</p>';
        html += '<p>I\'m <strong>Barn-E</strong>, your AI farming companion!</p>';
        html += '<p><strong>I can help with:</strong></p>';
        html += '<ul>';
        html += '<li>🌱 <strong>Crops:</strong> 26 types with full guides</li>';
        html += '<li>🐄 <strong>Livestock:</strong> Cattle, goats, chickens & more</li>';
        html += '<li>🐛 <strong>Pests & Diseases:</strong> ID and treatment</li>';
        html += '<li>🏛️ <strong>Government Resources:</strong> Official links & contacts</li>';
        html += '</ul>';
        html += '<p><em>Try: "What can I plant now?" or "Tell me about tomatoes"</em></p>';
        return html;
    }
    
    // Goodbye
    if (lowerMsg.match(/^(bye|goodbye|see you|kwaheri|ta-ta|later|ciao|take care)\b/)) {
        var byeResponses = [
            '<p><strong>Kwaheri! Take care of your shamba! 👋</strong></p><p>Come back anytime!</p>',
            '<p><strong>See you soon! 🌱</strong></p><p>Happy farming, my friend!</p>',
            '<p><strong>Till next time! 😊</strong></p><p>May your harvests be bountiful!</p>'
        ];
        return byeResponses[Math.floor(Math.random() * byeResponses.length)];
    }

    // =====================================================
    // GOVERNMENT RESOURCES & OFFICIAL LINKS
    // =====================================================
    
    if (lowerMsg.match(/\b(government|govt|government resources|official|ministry|kari|kalro|kephis)\b/)) {
        html = '<p><strong>🏛️ Kenya Government Agriculture Resources</strong></p>';
        html += '<p><strong>Key Institutions:</strong></p>';
        html += '<ul>';
        html += '<li><strong>Ministry of Agriculture:</strong> <a href="https://www.kilimo.go.ke" target="_blank">www.kilimo.go.ke</a></li>';
        html += '<li><strong>KALRO (Research):</strong> <a href="https://www.kalro.org" target="_blank">www.kalro.org</a></li>';
        html += '<li><strong>KEPHIS (Seeds/Quality):</strong> <a href="https://www.kephis.org" target="_blank">www.kephis.org</a></li>';
        html += '<li><strong>Agriculture Finance Corp:</strong> <a href="https://www.agrifinance.org" target="_blank">www.agrifinance.org</a></li>';
        html += '<li><strong>NIB (Irrigation):</strong> <a href="https://www.nib.go.ke" target="_blank">www.nib.go.ke</a></li>';
        html += '<li><strong>KDB (Dairy Board):</strong> <a href="https://www.kdb.co.ke" target="_blank">www.kdb.co.ke</a></li>';
        html += '</ul>';
        html += '<p><em>These are official government resources!</em></p>';
        return html;
    }
    
    if (lowerMsg.match(/\b(ministry of agriculture|kilimo|agriculture ministry)\b/)) {
        html = '<p><strong>🏛️ Ministry of Agriculture, Livestock & Fisheries</strong></p>';
        html += '<p><strong>Website:</strong> <a href="https://www.kilimo.go.ke" target="_blank">www.kilimo.go.ke</a></p>';
        html += '<p><strong>Services:</strong></p>';
        html += '<ul>';
        html += '<li>Farming subsidies & programs</li>';
        html += '<li>Fertilizer subsidies (e-voucher)</li>';
        html += '<li>Extension services</li>';
        html += '<li>Agricultural policies</li>';
        html += '</ul>';
        html += '<p><strong>Contact:</strong> +254 20 2718870</p>';
        return html;
    }
    
    if (lowerMsg.match(/\b(kalro|kari|research|agricultural research)\b/)) {
        html = '<p><strong>🔬 KALRO - Kenya Agricultural & Livestock Research Organization</strong></p>';
        html += '<p><strong>Website:</strong> <a href="https://www.kalro.org" target="_blank">www.kalro.org</a></p>';
        html += '<p><strong>What they offer:</strong></p>';
        html += '<ul>';
        html += '<li>Crop varieties & seeds</li>';
        html += '<li>Livestock breeds research</li>';
        html += '<li>Soil analysis services</li>';
        html += '<li>Farming manuals & guides</li>';
        html += '<li>Training programs</li>';
        html += '</ul>';
        html += '<p><strong>Contact:</strong> +254 20 4183301</p>';
        return html;
    }
    
    if (lowerMsg.match(/\b(kephis|seed quality|certified seeds|seed certification)\b/)) {
        html = '<p><strong>🌱 KEPHIS - Kenya Plant Health Inspectorate Service</strong></p>';
        html += '<p><strong>Website:</strong> <a href="https://www.kephis.org" target="_blank">www.kephis.org</a></p>';
        html += '<p><strong>Services:</strong></p>';
        html += '<ul>';
        html += '<li>Certified seed verification</li>';
        html += '<li>Plant variety protection</li>';
        html += '<li>Seed quality testing</li>';
        html += '<li>Plant quarantine services</li>';
        html += '</ul>';
        html += '<p><strong>Contact:</strong> +254 20 6618000</p>';
        html += '<p><em>Always buy seeds with KEPHIS certification!</em></p>';
        return html;
    }
    
    if (lowerMsg.match(/\b(veterinary|vet board|directorate of veterinary)\b/)) {
        html = '<p><strong>🏥 Directorate of Veterinary Services</strong></p>';
        html += '<p><strong>Website:</strong> <a href="https://www.kilimo.go.ke" target="_blank">www.kilimo.go.ke</a></p>';
        html += '<p><strong>Services:</strong></p>';
        html += '<ul>';
        html += '<li>Animal disease control</li>';
        html += '<li>Veterinary licenses</li>';
        html += '<li>Vaccination programs</li>';
        html += '<li>Meat inspection</li>';
        html += '</ul>';
        html += '<p><strong>Kenya Veterinary Board:</strong> +254 20 2718370</p>';
        html += '<p><strong>Emergency:</strong> For disease outbreaks, report immediately!</p>';
        return html;
    }
    
    if (lowerMsg.match(/\b(subsidy|subsidies|fertilizer subsidy|evoucher|e-voucher)\b/)) {
        html = '<p><strong>💰 Government Fertilizer Subsidy Program</strong></p>';
        html += '<p><strong>How to access:</strong></p>';
        html += '<ol>';
        html += '<li>Register at your county agriculture office</li>';
        html += '<li>Get e-voucher through your phone</li>';
        html += '<li>Redeem at accredited agro-dealers</li>';
        html += '</ol>';
        html += '<p><strong>Subsidized products:</strong> DAP, CAN, Urea, NPK, Seeds</p>';
        html += '<p><strong>Info:</strong> <a href="https://www.kilimo.go.ke" target="_blank">www.kilimo.go.ke</a></p>';
        html += '<p><strong>Helpline:</strong> Call your county agriculture office</p>';
        return html;
    }
    
    if (lowerMsg.match(/\b(county agriculture|extension officer|extension services|agricultural officer)\b/)) {
        html = '<p><strong>👨‍🌾 County Agricultural Extension Services</strong></p>';
        html += '<p><strong>How to find your officer:</strong></p>';
        html += '<ul>';
        html += '<li>Visit your County Agriculture Office</li>';
        html += '<li>Ask at your local chief\'s office</li>';
        html += '<li>Contact: <a href="https://www.kilimo.go.ke" target="_blank">www.kilimo.go.ke</a></li>';
        html += '</ul>';
        html += '<p><strong>Services offered:</strong></p>';
        html += '<ul>';
        html += '<li>Free farming advice</li>';
        html += '<li>Training programs</li>';
        html += '<li>Disease reporting</li>';
        html += '<li>Subsidy registration</li>';
        html += '</ul>';
        return html;
    }

    // =====================================================
    // PLANTING RECOMMENDATIONS
    // =====================================================
    
    if (lowerMsg.match(/\b(what can i plant|what to plant|can i plant|should i plant|what should i plant)\b/)) {
        var inSeasonCrops = cropDataAvailable ? CROP_DATA.filter(function(c) { return c.seasons.indexOf(currentMonth) !== -1; }) : [];
        html = '<p><strong>🌱 What to Plant in ' + currentMonthFull + '</strong></p>';
        html += '<p><strong>Crops in season NOW:</strong></p>';
        html += '<ul>';
        if (inSeasonCrops.length > 0) {
            for (var i = 0; i < Math.min(8, inSeasonCrops.length); i++) {
                html += '<li>' + inSeasonCrops[i].name + '</li>';
            }
        } else {
            html += '<li>Check local conditions - varies by region</li>';
        }
        html += '</ul>';
        html += '<p><strong>Kenya Planting Calendar:</strong></p>';
        html += '<ul>';
        html += '<li><strong>Long Rains (Mar-May):</strong> Maize, beans, potatoes, vegetables</li>';
        html += '<li><strong>Short Rains (Oct-Dec):</strong> Maize, beans, sorghum, millet</li>';
        html += '</ul>';
        html += '<p><em>Set your county for specific recommendations!</em></p>';
        return html;
    }
    
    if (lowerMsg.match(/\b(plant now|plant this month|planting now|planting this month)\b/)) {
        var inSeasonCrops = cropDataAvailable ? CROP_DATA.filter(function(c) { return c.seasons.indexOf(currentMonth) !== -1; }) : [];
        html = '<p><strong>🌱 What to Plant in ' + currentMonthFull + '</strong></p>';
        if (inSeasonCrops.length > 0) {
            html += '<p><strong>In season:</strong> ' + inSeasonCrops.slice(0,6).map(function(c) { return c.name; }).join(', ') + '</p>';
        }
        html += '<p><em>Set county for location-specific advice!</em></p>';
        return html;
    }
    
    if (lowerMsg.match(/\b(what do you know|what can you|your capabilities|your abilities|what are your features)\b/)) {
        html = '<p><strong>Here\'s what I know! 🧠</strong></p>';
        html += '<p><strong>🌱 CROPS (26 types):</strong> Maize, Beans, Tomatoes, Kale, Potatoes, Onions, Cabbage, Spinach, Carrots, Bananas, Avocados, Mangoes, Coffee, Tea, Sorghum, Millet, Cassava, Sweet Potatoes, Watermelon, Rice, Capsicum, Cowpeas, Pumpkin, Passion Fruit, Sugarcane, Groundnuts</p>';
        html += '<p><strong>🐄 LIVESTOCK (8 types):</strong> Dairy Cattle, Beef Cattle, Goats, Poultry, Sheep, Pigs, Rabbits, Fish</p>';
        html += '<p><strong>🐛 PESTS & DISEASES:</strong> Armyworms, Aphids, Blights, Wilts, Newcastle, Mastitis, ASF, Coccidiosis, Tuta Absoluta, Ticks</p>';
        html += '<p><strong>🏛️ GOVERNMENT:</strong> Ministry links, KALRO, KEPHIS, Subsidies</p>';
        html += '<p><strong>🧪 OTHER:</strong> Soil, Fertilizers, Manure, Compost, Irrigation, Harvest, Storage</p>';
        html += '<p><em>Just ask anything!</em></p>';
        return html;
    }

    // =====================================================
    // CROPS - DETAILED GUIDES
    // =====================================================
    
    // Maize
    if (lowerMsg.match(/\b(maize|corn|mahindi)\b/)) {
        html = '<p><strong>🌽 Maize Farming - Complete Guide</strong></p>';
        html += '<p><strong>Season:</strong> Mar-May (long rains), Oct-Dec (short rains)</p>';
        html += '<p><strong>Harvest:</strong> 90-120 days</p>';
        html += '<p><strong>Spacing:</strong> 75cm rows, 25cm plants (1 seed per hole)</p>';
        html += '<p><strong>Seed rate:</strong> 8-10 kg/acre</p>';
        html += '<p><strong>Varieties:</strong></p>';
        html += '<ul>';
        html += '<li><strong>H614D:</strong> High altitude, 6-8 weeks to tassel</li>';
        html += '<li><strong>H6213:</strong> High yield, disease resistant</li>';
        html += '<li><strong>Duma 43:</strong> Dry areas, drought tolerant</li>';
        html += '<li><strong>WH505:</strong> Medium altitude</li>';
        html += '</ul>';
        html += '<p><strong>Fertilizer:</strong> DAP 50kg/acre at planting, CAN 50kg when knee-high</p>';
        html += '<p><strong>⚠️ Major threats:</strong> Fall armyworm, stalk borer, MLN, Striga weed</p>';
        html += '<p><strong>Yield:</strong> 15-30 bags/acre (90kg bags)</p>';
        html += '<p><strong>Best regions:</strong> Trans Nzoia, Uasin Gishu, Nakuru, Bungoma</p>';
        html += '<p><em>Armyworm control: Scout daily, use sand in whorl, spray when young!</em></p>';
        return html;
    }
    
    // Beans
    if (lowerMsg.match(/\b(beans?|bean|maharage)\b/)) {
        html = '<p><strong>🫘 Beans Farming - Complete Guide</strong></p>';
        html += '<p><strong>Season:</strong> Mar-May, Oct-Dec (with rains)</p>';
        html += '<p><strong>Harvest:</strong> 60-90 days</p>';
        html += '<p><strong>Spacing:</strong> 50cm rows, 10cm plants</p>';
        html += '<p><strong>Seed rate:</strong> 20-25 kg/acre</p>';
        html += '<p><strong>Varieties:</strong></p>';
        html += '<ul>';
        html += '<li><strong>Wairimu:</strong> Red speckled, popular</li>';
        html += '<li><strong>Rose Coco:</strong> Pink/red, good market</li>';
        html += '<li><strong>Mwitemania:</strong> Drought tolerant</li>';
        html += '<li><strong>KK8:</strong> Bean fly resistant</li>';
        html += '</ul>';
        html += '<p><strong>Benefits:</strong> Fixes nitrogen (80-100kg N/ha), excellent for rotation!</p>';
        html += '<p><strong>Fertilizer:</strong> Usually no N needed, apply DAP if soil poor</p>';
        html += '<p><strong>Pests:</strong> Bean fly, aphids, bruchids in storage</p>';
        html += '<p><strong>Yield:</strong> 4-8 bags/acre</p>';
        return html;
    }
    
    // Tomatoes
    if (lowerMsg.match(/\b(tomato|tomatoes|nyanya)\b/)) {
        html = '<p><strong>🍅 Tomato Farming - Complete Guide</strong></p>';
        html += '<p><strong>Season:</strong> Year-round with irrigation</p>';
        html += '<p><strong>Harvest:</strong> 75-90 days after transplanting</p>';
        html += '<p><strong>Spacing:</strong> 90cm rows, 60cm plants</p>';
        html += '<p><strong>Seed rate:</strong> 200-300g/acre (nursery), 10,000-15,000 seedlings</p>';
        html += '<p><strong>Varieties:</strong></p>';
        html += '<ul>';
        html += '<li><strong>Anna F1:</strong> Determinate, 70-80 days, high yield</li>';
        html += '<li><strong>Kilele F1:</strong> Determinate, disease resistant</li>';
        html += '<li><strong>Rio Grande:</strong> Processing type</li>';
        html += '<li><strong>Cal J:</strong> Fresh market, firm</li>';
        html += '</ul>';
        html += '<p><strong>Nursery:</strong> 4-6 weeks before transplanting</p>';
        html += '<p><strong>Fertilizer:</strong> DAP at planting, CAN top dress, foliar feed</p>';
        html += '<p><strong>⚠️ Major problems:</strong></p>';
        html += '<ul>';
        html += '<li><strong>Tuta absoluta:</strong> Pheromone traps, spray early</li>';
        html += '<li><strong>Late blight:</strong> Copper fungicides, good drainage</li>';
        html += '<li><strong>Bacterial wilt:</strong> No cure - rotate crops!</li>';
        html += '</ul>';
        html += '<p><strong>Tips:</strong> Stake plants, prune suckers, mulch, drip irrigation</p>';
        html += '<p><strong>Yield:</strong> 15,000-30,000 kg/acre (good management)</p>';
        return html;
    }
    
    // Kale/Sukuma Wiki
    if (lowerMsg.match(/\b(kale|sukuma|sukuma wiki)\b/)) {
        html = '<p><strong>🥬 Kale (Sukuma Wiki) - Complete Guide</strong></p>';
        html += '<p><strong>Season:</strong> Year-round! Very versatile</p>';
        html += '<p><strong>Harvest:</strong> 45-60 days, continuous for 4-6 months</p>';
        html += '<p><strong>Spacing:</strong> 60cm rows, 45cm plants</p>';
        html += '<p><strong>Seed rate:</strong> 300-400g/acre</p>';
        html += '<p><strong>Varieties:</strong> Collard, Thousand Headed, Marrow Stem</p>';
        html += '<p><strong>Planting:</strong></p>';
        html += '<ul>';
        html += '<li>Direct seeding OR nursery transplant</li>';
        html += '<li>Transplant at 4-5 leaf stage</li>';
        html += '</ul>';
        html += '<p><strong>Care:</strong></p>';
        html += '<ul>';
        html += '<li>Harvest outer leaves first</li>';
        html += '<li>Apply manure/compost regularly</li>';
        html += '<li>Water consistently</li>';
        html += '</ul>';
        html += '<p><strong>Pests:</strong> Diamondback moth, aphids, cabbage sawfly</p>';
        html += '<p><strong>Yield:</strong> 8,000-15,000 kg/acre</p>';
        html += '<p><strong>Profit:</strong> Very profitable! High demand in urban markets</p>';
        return html;
    }
    
    // Potatoes
    if (lowerMsg.match(/\b(potato|potatoes|waru|viazi)\b/)) {
        html = '<p><strong>🥔 Potato Farming - Complete Guide</strong></p>';
        html += '<p><strong>Season:</strong> Mar-Apr, Aug-Sep</p>';
        html += '<p><strong>Harvest:</strong> 90-120 days</p>';
        html += '<p><strong>Spacing:</strong> 75cm rows, 30cm plants</p>';
        html += '<p><strong>Seed tubers:</strong> 8-10 bags (50kg) per acre</p>';
        html += '<p><strong>Varieties:</strong></p>';
        html += '<ul>';
        html += '<li><strong>Shangi:</strong> Popular, good cooking quality</li>';
        html += '<li><strong>Tigoni:</strong> Processing, chips</li>';
        html += '<li><strong>Desiree:</strong> Red skin, fresh market</li>';
        html += '<li><strong>Asante:</strong> Red, good storage</li>';
        html += '</ul>';
        html += '<p><strong>⚠️ CRITICAL: Use CERTIFIED seed potatoes!</strong></p>';
        html += '<p><strong>Why certified?</strong> Prevents bacterial wilt spread, ensures quality</p>';
        html += '<p><strong>Fertilizer:</strong> DAP 200kg/acre, add manure</p>';
        html += '<p><strong>Diseases:</strong> Late blight (spray copper), Bacterial wilt (no cure - rotate!)</p>';
        html += '<p><strong>Hilling:</strong> Earth up when plants 15-20cm tall</p>';
        html += '<p><strong>Yield:</strong> 80-150 bags/acre (110kg bags)</p>';
        html += '<p><strong>Best regions:</strong> Nyandarua, Nakuru, Meru, Elgeyo Marakwet</p>';
        html += '<p><strong>KEPHIS:</strong> <a href="https://www.kephis.org" target="_blank">www.kephis.org</a> for seed certification</p>';
        return html;
    }
    
    // Onions
    if (lowerMsg.match(/\b(onion|onions|kitunguu)\b/)) {
        html = '<p><strong>🧅 Onion Farming - Complete Guide</strong></p>';
        html += '<p><strong>Season:</strong> Jan-Feb, Jun-Jul planting</p>';
        html += '<p><strong>Harvest:</strong> 90-150 days</p>';
        html += '<p><strong>Spacing:</strong> 30cm rows, 8cm plants</p>';
        html += '<p><strong>Varieties:</strong></p>';
        html += '<ul>';
        html += '<li><strong>Red Creole:</strong> Popular, stores well</li>';
        html += '<li><strong>Texas Grano:</strong> Yellow, large bulbs</li>';
        html += '<li><strong>Bombay Red:</strong> Local favorite</li>';
        html += '</ul>';
        html += '<p><strong>Planting:</strong> Nursery for 6-8 weeks, then transplant</p>';
        html += '<p><strong>Care:</strong></p>';
        html += '<ul>';
        html += '<li>Needs full sun</li>';
        html += '<li>Stop watering when tops fall over</li>';
        html += '<li>Cure 2-3 weeks before storage</li>';
        html += '</ul>';
        html += '<p><strong>Yield:</strong> 8,000-15,000 kg/acre</p>';
        html += '<p><strong>Tip:</strong> Onions are heavy feeders - needs good fertility!</p>';
        return html;
    }
    
    // Cabbage
    if (lowerMsg.match(/\b(cabbage|kabichi)\b/)) {
        html = '<p><strong>🥬 Cabbage Farming - Complete Guide</strong></p>';
        html += '<p><strong>Season:</strong> Feb-Mar, Aug-Sep</p>';
        html += '<p><strong>Harvest:</strong> 85-110 days</p>';
        html += '<p><strong>Spacing:</strong> 60cm x 45cm</p>';
        html += '<p><strong>Varieties:</strong> Gloria F1, Queen of Heaven, Copenhagen Market</p>';
        html += '<p><strong>Tips:</strong></p>';
        html += '<ul>';
        html += '<li>Transplant at 4-5 weeks</li>';
        html += '<li>Heads form in cool weather</li>';
        html += '<li>Needs consistent moisture</li>';
        html += '</ul>';
        html += '<p><strong>Pests:</strong> Diamondback moth, cabbage aphid</p>';
        html += '<p><strong>Yield:</strong> 10,000-20,000 heads/acre</p>';
        return html;
    }
    
    // Spinach
    if (lowerMsg.match(/\b(spinach)\b/)) {
        html = '<p><strong>🥬 Spinach Farming</strong></p>';
        html += '<p><strong>Season:</strong> Year-round, prefers cool weather</p>';
        html += '<p><strong>Harvest:</strong> 40-50 days</p>';
        html += '<p><strong>Spacing:</strong> 30cm rows, 15cm plants</p>';
        html += '<p><strong>Varieties:</strong> Fordhook Giant, Swiss Chard</p>';
        html += '<p><strong>Tips:</strong> Pick outer leaves, water regularly, bolts in heat</p>';
        html += '<p><strong>Yield:</strong> 5,000-8,000 kg/acre</p>';
        return html;
    }
    
    // Carrots
    if (lowerMsg.match(/\b(carrot|carrots|mkaroti)\b/)) {
        html = '<p><strong>🥕 Carrot Farming</strong></p>';
        html += '<p><strong>Season:</strong> Feb-Mar, Aug-Sep</p>';
        html += '<p><strong>Harvest:</strong> 70-100 days</p>';
        html += '<p><strong>Spacing:</strong> 30cm rows, 5cm plants (thin after germination)</p>';
        html += '<p><strong>⚠️ CRITICAL: Do NOT add fresh manure!</strong></p>';
        html += '<p>Causes forked, hairy roots - use well-rotted compost instead</p>';
        html += '<p><strong>Soil:</strong> Needs loose, sandy soil for straight roots</p>';
        html += '<p><strong>Varieties:</strong> Nantes, Chantenay</p>';
        html += '<p><strong>Yield:</strong> 8,000-12,000 kg/acre</p>';
        return html;
    }
    
    // Bananas
    if (lowerMsg.match(/\b(banana|bananas|ndizi)\b/)) {
        html = '<p><strong>🍌 Banana Farming - Complete Guide</strong></p>';
        html += '<p><strong>First Harvest:</strong> 12-18 months after planting</p>';
        html += '<p><strong>Spacing:</strong> 3m x 3m (about 450 plants/acre)</p>';
        html += '<p><strong>Varieties:</strong></p>';
        html += '<ul>';
        html += '<li><strong>Williams:</strong> Export quality, tall</li>';
        html += '<li><strong>Grand Nain:</strong> Dwarf, wind resistant</li>';
        html += '<li><strong>Apple banana:</strong> Sweet, local market</li>';
        html += '<li><strong>Cooking banana (Ng\'ombe):</strong> For matoke</li>';
        html += '</ul>';
        html += '<p><strong>Planting:</strong> Use healthy suckers or tissue culture</p>';
        html += '<p><strong>Care:</strong></p>';
        html += '<ul>';
        html += '<li>Mulch heavily around plants</li>';
        html += '<li>Remove dead leaves</li>';
        html += '<li>De-sucker (keep 3-4 stems per stool)</li>';
        html += '<li>Prop heavy bunches</li>';
        html += '</ul>';
        html += '<p><strong>Diseases:</strong> Panama disease, Sigatoka, Banana weevil</p>';
        html += '<p><strong>Yield:</strong> 30-60 bunches/acre/year (15-40kg/bunch)</p>';
        return html;
    }
    
    // Avocados
    if (lowerMsg.match(/\b(avocado|avocados|parachichi)\b/)) {
        html = '<p><strong>🥑 Avocado Farming - Complete Guide</strong></p>';
        html += '<p><strong>First Fruit:</strong> 3-5 years (grafted), 7-10 years (seedling)</p>';
        html += '<p><strong>Spacing:</strong> 6-10m between trees (about 100-150 trees/acre)</p>';
        html += '<p><strong>Varieties:</strong></p>';
        html += '<ul>';
        html += '<li><strong>Hass:</strong> Export favorite, black skin when ripe</li>';
        html += '<li><strong>Fuerte:</strong> Green skin, high oil content</li>';
        html += '<li><strong>Puebla:</strong> Local variety, adaptable</li>';
        html += '</ul>';
        html += '<p><strong>Care:</strong></p>';
        html += '<ul>';
        html += '<li>Graft for faster fruiting & quality</li>';
        html += '<li>Mulch heavily</li>';
        html += '<li>Protect young trees from frost</li>';
        html += '<li>Irrigate during dry season</li>';
        html += '</ul>';
        html += '<p><strong>Harvest:</strong> Pick when mature (skin changes, stem yellow)</p>';
        html += '<p><strong>Yield:</strong> 300-500 fruits/tree annually (mature tree)</p>';
        html += '<p><strong>Export potential:</strong> HIGH! Kenya is major exporter</p>';
        return html;
    }
    
    // Mangoes
    if (lowerMsg.match(/\b(mango|mangoes|embe)\b/)) {
        html = '<p><strong>🥭 Mango Farming - Complete Guide</strong></p>';
        html += '<p><strong>First Fruit:</strong> 3-5 years (grafted)</p>';
        html += '<p><strong>Spacing:</strong> 8-10m between trees</p>';
        html += '<p><strong>Varieties:</strong></p>';
        html += '<ul>';
        html += '<li><strong>Apple:</strong> Small, sweet, popular</li>';
        html += '<li><strong>Ngowe:</strong> Large, export quality</li>';
        html += '<li><strong>Tommy Atkins:</strong> Export, red blush</li>';
        html += '<li><strong>Kent:</strong> Late season, export</li>';
        html += '</ul>';
        html += '<p><strong>Care:</strong></p>';
        html += '<ul>';
        html += '<li>Graft for quality fruit</li>';
        html += '<li>Prune after harvest</li>';
        html += '<li>Control fruit fly (bait sprays)</li>';
        html += '</ul>';
        html += '<p><strong>Best regions:</strong> Machakos, Makueni, Kitui, Kilifi, Kwale</p>';
        html += '<p><strong>Season:</strong> Nov-Mar (main), Jul-Aug (off-season possible)</p>';
        return html;
    }
    
    // Coffee
    if (lowerMsg.match(/\b(coffee|kahawa)\b/)) {
        html = '<p><strong>☕ Coffee Farming - Complete Guide</strong></p>';
        html += '<p><strong>First Harvest:</strong> 3-4 years</p>';
        html += '<p><strong>Spacing:</strong> 2.5m x 2.5m (~1,600 trees/acre)</p>';
        html += '<p><strong>Varieties:</strong></p>';
        html += '<ul>';
        html += '<li><strong>SL28:</strong> High quality, drought tolerant</li>';
        html += '<li><strong>SL34:</strong> High altitude, quality</li>';
        html += '<li><strong>Batian:</strong> Disease resistant</li>';
        html += '<li><strong>Ruiru 11:</strong> Disease resistant, compact</li>';
        html += '</ul>';
        html += '<p><strong>Care:</strong></p>';
        html += '<ul>';
        html += '<li>Needs shade trees (Gravelia, Cordia)</li>';
        html += '<li>Prune regularly</li>';
        html += '<li>Pick only RIPE red cherries</li>';
        html += '<li>Process immediately after picking</li>';
        html += '</ul>';
        html += '<p><strong>Diseases:</strong> Coffee Berry Disease, Leaf Rust</p>';
        html += '<p><strong>Best regions:</strong> Nyeri, Murang\'a, Kiambu, Kirinyaga, Kericho</p>';
        html += '<p><strong>Coffee Board:</strong> <a href="https://www.ckb.co.ke" target="_blank">www.ckb.co.ke</a></p>';
        return html;
    }
    
    // Tea
    if (lowerMsg.match(/\b(tea|chai)\b/)) {
        html = '<p><strong>🍵 Tea Farming - Complete Guide</strong></p>';
        html += '<p><strong>First Harvest:</strong> 3-5 years after planting</p>';
        html += '<p><strong>Spacing:</strong> 1.2m rows, 0.75m plants (~5,000 bushes/acre)</p>';
        html += '<p><strong>Harvesting:</strong></p>';
        html += '<ul>';
        html += '<li>Pick 2 leaves + 1 bud (fine plucking)</li>';
        html += '<li>Pluck every 7-14 days</li>';
        html += '<li>Never pluck below marking stick</li>';
        html += '</ul>';
        html += '<p><strong>Requirements:</strong></p>';
        html += '<ul>';
        html += '<li>Cool highland climate (1,500-2,700m)</li>';
        html += '<li>High rainfall (1,500-2,500mm)</li>';
        html += '<li>Acidic soil (pH 4.5-5.5)</li>';
        html += '</ul>';
        html += '<p><strong>Pruning:</strong> Every 3-5 years to maintain height</p>';
        html += '<p><strong>Best regions:</strong> Kericho, Bomet, Nandi, Kisii, Nyamira, Murang\'a</p>';
        html += '<p><strong>Tea Board:</strong> <a href="https://www.teaboard.or.ke" target="_blank">www.teaboard.or.ke</a></p>';
        return html;
    }
    
    // Sorghum
    if (lowerMsg.match(/\b(sorghum|mtema|mtama)\b/)) {
        html = '<p><strong>🌾 Sorghum Farming - Complete Guide</strong></p>';
        html += '<p><strong>Harvest:</strong> 100-120 days</p>';
        html += '<p><strong>Spacing:</strong> 60cm rows, 15cm plants</p>';
        html += '<p><strong>Seed rate:</strong> 4-5 kg/acre</p>';
        html += '<p><strong>Varieties:</strong></p>';
        html += '<ul>';
        html += '<li><strong>Serena:</strong> White grain, dual purpose</li>';
        html += '<li><strong>Serendo:</strong> Early maturing</li>';
        html += '<li><strong>Gadam:</strong> Very early (60-70 days), drought escape</li>';
        html += '<li><strong>E6518:</strong> Brewers grade</li>';
        html += '</ul>';
        html += '<p><strong>Benefits:</strong></p>';
        html += '<ul>';
        html += '<li>Very drought tolerant</li>';
        html += '<li>Low input requirements</li>';
        html += '<li>High brewery demand</li>';
        html += '<li>Bird damage - use bird-resistant varieties</li>';
        html += '</ul>';
        html += '<p><strong>Yield:</strong> 5-12 bags/acre</p>';
        html += '<p><strong>Best for:</strong> ASAL areas (Machakos, Kitui, Makueni)</p>';
        return html;
    }
    
    // Millet
    if (lowerMsg.match(/\b(millet|wimbi|uwele)\b/)) {
        html = '<p><strong>🌾 Millet Farming - Complete Guide</strong></p>';
        html += '<p><strong>Harvest:</strong> 90-100 days</p>';
        html += '<p><strong>Spacing:</strong> 25cm rows, 10cm plants</p>';
        html += '<p><strong>Seed rate:</strong> 3-4 kg/acre</p>';
        html += '<p><strong>Varieties:</strong> Pearl millet, Finger millet (Wimbi)</p>';
        html += '<p><strong>Benefits:</strong></p>';
        html += '<ul>';
        html += '<li>Extremely drought tolerant</li>';
        html += '<li>Highly nutritious (calcium, iron)</li>';
        html += '<li>Low input, grows in poor soils</li>';
        html += '<li>Traditional food (ugali, porridge)</li>';
        html += '</ul>';
        html += '<p><strong>Yield:</strong> 3-6 bags/acre</p>';
        html += '<p><strong>Best for:</strong> Dry areas, food security</p>';
        return html;
    }
    
    // Cassava
    if (lowerMsg.match(/\b(cassava|muhogo)\b/)) {
        html = '<p><strong>🥔 Cassava Farming - Complete Guide</strong></p>';
        html += '<p><strong>Harvest:</strong> 8-12 months (can stay in ground 2 years)</p>';
        html += '<p><strong>Spacing:</strong> 1m x 1m (4,000 plants/acre)</p>';
        html += '<p><strong>Planting:</strong> Stem cuttings 25-30cm long</p>';
        html += '<p><strong>Varieties:</strong> MH95/0183, MM96/4191, MM96/1871 (sweet varieties)</p>';
        html += '<p><strong>Benefits:</strong></p>';
        html += '<ul>';
        html += '<li>Very drought tolerant</li>';
        html += '<li>Famine reserve crop</li>';
        html += '<li>Low input, grows in poor soils</li>';
        html += '<li>Multiple uses: Flour, chips, starch</li>';
        html += '</ul>';
        html += '<p><strong>⚠️ WARNING: ALWAYS cook thoroughly before eating!</strong></p>';
        html += '<p>Raw cassava contains cyanide - must be processed!</p>';
        html += '<p><strong>Diseases:</strong> Cassava Mosaic, Cassava Brown Streak</p>';
        html += '<p><strong>Yield:</strong> 10-25 tons/acre fresh roots</p>';
        return html;
    }
    
    // Sweet Potato
    if (lowerMsg.match(/\b(sweet potato|ngwaci|ngwaci)\b/)) {
        html = '<p><strong>🍠 Sweet Potato Farming</strong></p>';
        html += '<p><strong>Harvest:</strong> 90-150 days</p>';
        html += '<p><strong>Spacing:</strong> 1m rows, 30cm plants</p>';
        html += '<p><strong>Planting:</strong> Vine cuttings 20-30cm</p>';
        html += '<p><strong>Varieties:</strong></p>';
        html += '<ul>';
        html += '<li><strong>Kemb 10:</strong> Orange fleshed, high Vitamin A</li>';
        html += '<li><strong>SPK004:</strong> White fleshed, high yielding</li>';
        html += '</ul>';
        html += '<p><strong>Tips:</strong></p>';
        html += '<ul>';
        html += '<li>Plant on ridges/mounds</li>';
        html += '<li>Leaves also edible (cooked like spinach)</li>';
        html += '<li>Harvest when leaves yellow</li>';
        html += '</ul>';
        html += '<p><strong>Yield:</strong> 8-15 tons/acre</p>';
        return html;
    }
    
    // Watermelon
    if (lowerMsg.match(/\b(watermelon|tikiti)\b/)) {
        html = '<p><strong>🍉 Watermelon Farming - Complete Guide</strong></p>';
        html += '<p><strong>Harvest:</strong> 80-100 days</p>';
        html += '<p><strong>Spacing:</strong> 2m rows, 1m plants (2,000 plants/acre)</p>';
        html += '<p><strong>Seed rate:</strong> 500g-1kg/acre</p>';
        html += '<p><strong>Varieties:</strong></p>';
        html += '<ul>';
        html += '<li><strong>Sugar Baby:</strong> Small, sweet, early</li>';
        html += '<li><strong>Sukari F1:</strong> Popular, sweet</li>';
        html += '<li><strong>Crimson Sweet:</strong> Medium size</li>';
        html += '</ul>';
        html += '<p><strong>Care:</strong></p>';
        html += '<ul>';
        html += '<li>Needs warm climate, full sun</li>';
        html += '<li>Stop watering 1 week before harvest for sweetness</li>';
        html += '<li>Hand pollination may help</li>';
        html += '</ul>';
        html += '<p><strong>Harvest signs:</strong> Tendril dries, hollow sound when tapped</p>';
        html += '<p><strong>Yield:</strong> 10,000-20,000 fruits/acre (5-8kg average)</p>';
        return html;
    }
    
    // Rice
    if (lowerMsg.match(/\b(rice|mpunga)\b/)) {
        html = '<p><strong>🍚 Rice Farming - Complete Guide</strong></p>';
        html += '<p><strong>Harvest:</strong> 100-150 days</p>';
        html += '<p><strong>Spacing:</strong> 25cm x 25cm</p>';
        html += '<p><strong>Seed rate:</strong> 20-25 kg/acre</p>';
        html += '<p><strong>Varieties:</strong></p>';
        html += '<ul>';
        html += '<li><strong>IR 2793:</strong> Lowland, popular in Mwea</li>';
        html += '<li><strong>Basmati 370:</strong> Aromatic, premium</li>';
        html += '<li><strong>Sindano:</strong> Long grain</li>';
        html += '</ul>';
        html += '<p><strong>Requirements:</strong></p>';
        html += '<ul>';
        html += '<li>Flooded fields or reliable irrigation</li>';
        html += '<li>Heavy clay soils (water retaining)</li>';
        html += '<li>1,000-1,500mm water during growth</li>';
        html += '</ul>';
        html += '<p><strong>Major areas:</strong> Mwea (Kirinyaga), Ahero (Kisumu), Bunyala (Busia)</p>';
        html += '<p><strong>Yield:</strong> 20-40 bags/acre (90kg bags)</p>';
        html += '<p><strong>NIB:</strong> <a href="https://www.nib.go.ke" target="_blank">www.nib.go.ke</a> for irrigation schemes</p>';
        return html;
    }
    
    // Capsicum
    if (lowerMsg.match(/\b(capsicum|pepper|hoho|pilipili hoho)\b/)) {
        html = '<p><strong>🫑 Capsicum Farming - Complete Guide</strong></p>';
        html += '<p><strong>Harvest:</strong> 70-90 days after transplant</p>';
        html += '<p><strong>Spacing:</strong> 60cm rows, 45cm plants</p>';
        html += '<p><strong>Varieties:</strong></p>';
        html += '<ul>';
        html += '<li><strong>California Wonder:</strong> Blocky, green</li>';
        html += '<li><strong>Rambo:</strong> Adaptable, high yielding</li>';
        html += '<li><strong>Yolo Wonder:</strong> Large fruits</li>';
        html += '</ul>';
        html += '<p><strong>✅ HIGH VALUE CROP!</strong></p>';
        html += '<p><strong>Tips:</strong></p>';
        html += '<ul>';
        html += '<li>Nursery 4-6 weeks before transplant</li>';
        html += '<li>Stake for support</li>';
        html += '<li>Regular harvesting encourages more fruits</li>';
        html += '</ul>';
        html += '<p><strong>Yield:</strong> 8,000-15,000 kg/acre</p>';
        html += '<p><strong>Market:</strong> Hotels, supermarkets, export</p>';
        return html;
    }
    
    // Cowpeas
    if (lowerMsg.match(/\b(cowpeas?|kunde)\b/)) {
        html = '<p><strong>🫛 Cowpeas (Kunde) - Complete Guide</strong></p>';
        html += '<p><strong>Harvest:</strong> 60-90 days</p>';
        html += '<p><strong>Spacing:</strong> 50cm rows, 20cm plants</p>';
        html += '<p><strong>Seed rate:</strong> 8-10 kg/acre</p>';
        html += '<p><strong>Varieties:</strong> K80, M66, KVU 27-1</p>';
        html += '<p><strong>Benefits:</strong></p>';
        html += '<ul>';
        html += '<li>Very drought tolerant</li>';
        html += '<li>Fixes nitrogen</li>';
        html += '<li>Leaves AND pods edible</li>';
        html += '<li>Good for intercropping</li>';
        html += '</ul>';
        html += '<p><strong>Yield:</strong> 4-8 bags/acre (dry seeds)</p>';
        return html;
    }
    
    // Pumpkin
    if (lowerMsg.match(/\b(pumpkin|malebwe)\b/)) {
        html = '<p><strong>🎃 Pumpkin Farming</strong></p>';
        html += '<p><strong>Harvest:</strong> 90-120 days</p>';
        html += '<p><strong>Spacing:</strong> 2m x 2m (vines need space!)</p>';
        html += '<p><strong>Seed rate:</strong> 1-2 kg/acre</p>';
        html += '<p><strong>Tips:</strong></p>';
        html += '<ul>';
        html += '<li>Harvest when skin hardens (can\'t puncture with nail)</li>';
        html += '<li>Stores for months in cool, dry place</li>';
        html += '<li>Leaves and seeds also edible</li>';
        html += '</ul>';
        html += '<p><strong>Yield:</strong> 5,000-10,000 fruits/acre</p>';
        return html;
    }
    
    // Passion Fruit
    if (lowerMsg.match(/\b(passion\s?fruit|maracuja)\b/)) {
        html = '<p><strong>🍇 Passion Fruit Farming</strong></p>';
        html += '<p><strong>First Harvest:</strong> 1-2 years after planting</p>';
        html += '<p><strong>Spacing:</strong> 3m x 3m (needs trellis support)</p>';
        html += '<p><strong>Varieties:</strong></p>';
        html += '<ul>';
        html += '<li><strong>Purple:</strong> Highlands, smaller, sweeter</li>';
        html += '<li><strong>Yellow:</strong> Lowlands, larger, more acidic</li>';
        html += '</ul>';
        html += '<p><strong>Care:</strong></p>';
        html += '<ul>';
        html += '<li>Install trellis before planting</li>';
        html += '<li>Prune regularly</li>';
        html += '<li>Harvest when fruits drop naturally</li>';
        html += '</ul>';
        html += '<p><strong>Yield:</strong> 10-15 tons/acre/year</p>';
        html += '<p><strong>Market:</strong> Juice processing, export</p>';
        return html;
    }
    
    // Sugarcane
    if (lowerMsg.match(/\b(sugarcane|muwa)\b/)) {
        html = '<p><strong>🎋 Sugarcane Farming</strong></p>';
        html += '<p><strong>Harvest:</strong> 12-18 months (ratoon crops every 12 months)</p>';
        html += '<p><strong>Spacing:</strong> 1.5m rows, 0.5m plants</p>';
        html += '<p><strong>Varieties:</strong> CO421, CO617, KEN 83-737</p>';
        html += '<p><strong>Requirements:</strong></p>';
        html += '<ul>';
        html += '<li>LOTS of water (1,500-2,500mm)</li>';
        html += '<li>Deep, fertile soils</li>';
        html += '<li>Hot climate</li>';
        html += '</ul>';
        html += '<p><strong>Yield:</strong> 80-120 tons/acre</p>';
        html += '<p><strong>Areas:</strong> Western Kenya (Mumias, Nzoia), Coastal (Kwale)</p>';
        return html;
    }
    
    // Groundnuts
    if (lowerMsg.match(/\b(groundnut|groundnuts|peanut|peanuts|karanga)\b/)) {
        html = '<p><strong>🥜 Groundnut (Peanut) Farming</strong></p>';
        html += '<p><strong>Harvest:</strong> 90-120 days</p>';
        html += '<p><strong>Spacing:</strong> 50cm rows, 10cm plants</p>';
        html += '<p><strong>Seed rate:</strong> 20-25 kg/acre</p>';
        html += '<p><strong>Varieties:</strong> Red Valencia, Manipintar, Makulu Red</p>';
        html += '<p><strong>Benefits:</strong></p>';
        html += '<ul>';
        html += '<li>Fixes nitrogen</li>';
        html += '<li>High protein food</li>';
        html += '<li>Oil extraction potential</li>';
        html += '</ul>';
        html += '<p><strong>Tips:</strong></p>';
        html += '<ul>';
        html += '<li>Needs sandy-loam soil</li>';
        html += '<li>Harvest when leaves yellow</li>';
        html += '<li>Dry well before storage</li>';
        html += '</ul>';
        html += '<p><strong>Yield:</strong> 6-12 bags/acre</p>';
        return html;
    }

    // =====================================================
    // LIVESTOCK - DETAILED GUIDES
    // =====================================================
    
    // Dairy Cattle
    if (lowerMsg.match(/\b(dairy\s?cattle|dairy\s?cow|dairy|friesian|ayrshire|jersey|milking\s?cow|milk cow)\b/)) {
        html = '<p><strong>🐄 Dairy Cattle - Complete Guide</strong></p>';
        html += '<p><strong>Breeds & Production:</strong></p>';
        html += '<ul>';
        html += '<li><strong>Friesian:</strong> 25-35L/day, black & white</li>';
        html += '<li><strong>Ayrshire:</strong> 20-25L/day, hardy</li>';
        html += '<li><strong>Jersey:</strong> 15-20L/day, high butterfat</li>';
        html += '<li><strong>Guernsey:</strong> 18-22L/day, yellow milk</li>';
        html += '</ul>';
        html += '<p><strong>Feeding:</strong></p>';
        html += '<ul>';
        html += '<li>Water: 50-100L/day (more when lactating)</li>';
        html += '<li>Fodder: Napier, hay, silage</li>';
        html += '<li>Dairy meal: 2kg per 10L milk produced</li>';
        html += '<li>Mineral lick: Always available</li>';
        html += '</ul>';
        html += '<p><strong>Housing:</strong> Cubicles, clean bedding, good ventilation</p>';
        html += '<p><strong>Health:</strong></p>';
        html += '<ul>';
        html += '<li><strong>Vaccinations:</strong> FMD every 6 months, Lumpy skin annually, Blackquarter</li>';
        html += '<li><strong>Diseases:</strong> Mastitis, Tick-borne (ECF, Anaplasmosis)</li>';
        html += '<li><strong>Deworming:</strong> Every 3 months</li>';
        html += '<li><strong>Dipping:</strong> Weekly for tick control</li>';
        html += '</ul>';
        html += '<p><strong>KDB:</strong> <a href="https://www.kdb.co.ke" target="_blank">www.kdb.co.ke</a></p>';
        return html;
    }
    
    // Beef Cattle
    if (lowerMsg.match(/\b(beef\s?cattle|beef\s?cow|beef|boran|sahiwal|zebu|fattening)\b/)) {
        html = '<p><strong>🐄 Beef Cattle - Complete Guide</strong></p>';
        html += '<p><strong>Breeds:</strong></p>';
        html += '<ul>';
        html += '<li><strong>Boran:</strong> Local Zebu, very hardy, drought tolerant</li>';
        html += '<li><strong>Sahiwal:</strong> Dual purpose, tick resistant</li>';
        html += '<li><strong>Charolais:</strong> Large frame, fast growth</li>';
        html += '<li><strong>Hereford:</strong> Good temperament, efficient</li>';
        html += '</ul>';
        html += '<p><strong>Feeding:</strong></p>';
        html += '<ul>';
        html += '<li>Pasture grazing (main feed)</li>';
        html += '<li>Mineral licks essential</li>';
        html += '<li>Supplement with hay/crop residues in dry season</li>';
        html += '<li>Finishing: High energy feed 90-120 days</li>';
        html += '</ul>';
        html += '<p><strong>Market:</strong> 2-4 years, 350-450kg live weight</p>';
        html += '<p><strong>KMC:</strong> Kenya Meat Commission buys at ~KES 320-400/kg</p>';
        return html;
    }
    
    // General cattle
    if (lowerMsg.match(/\b(cattle|cow|cows|ng'ombe)\b/)) {
        html = '<p><strong>🐄 Cattle Farming Overview</strong></p>';
        html += '<p>Ask specifically about:</p>';
        html += '<ul>';
        html += '<li>🥛 <strong>"Dairy cattle"</strong> - For milk production</li>';
        html += '<li>🥩 <strong>"Beef cattle"</strong> - For meat production</li>';
        html += '</ul>';
        html += '<p><strong>General care for all cattle:</strong></p>';
        html += '<ul>';
        html += '<li>Deworm every 3 months</li>';
        html += '<li>Vaccinate: FMD (6 months), Lumpy skin (annually)</li>';
        html += '<li>Dip/spray weekly for tick control</li>';
        html += '<li>Provide clean water always</li>';
        html += '</ul>';
        html += '<p><strong>Vet emergency:</strong> Kenya Veterinary Board 020 2718370</p>';
        return html;
    }
    
    // Goats
    if (lowerMsg.match(/\b(goat|goats|mbuzi)\b/)) {
        html = '<p><strong>🐐 Goat Farming - Complete Guide</strong></p>';
        html += '<p><strong>Breeds:</strong></p>';
        html += '<ul>';
        html += '<li><strong>Galla:</strong> White, very hardy, dual purpose</li>';
        html += '<li><strong>Small East African:</strong> Local, hardy, small</li>';
        html += '<li><strong>Saanen:</strong> Dairy, 3-5L/day, white</li>';
        html += '<li><strong>Toggenburg:</strong> Dairy, 2-4L/day, brown/white</li>';
        html += '<li><strong>Boer:</strong> Meat, fast growing</li>';
        html += '</ul>';
        html += '<p><strong>Feeding:</strong></p>';
        html += '<ul>';
        html += '<li>Browsers - prefer shrubs, leaves, bushes</li>';
        html += '<li>Supplement with hay, concentrates</li>';
        html += '<li>Clean water always</li>';
        html += '</ul>';
        html += '<p><strong>Housing:</strong> Raised floor, dry, well-ventilated</p>';
        html += '<p><strong>Health:</strong></p>';
        html += '<ul>';
        html += '<li>Deworm every 2-3 months</li>';
        html += '<li>Vaccinate: PPR, Contagious Caprine Pleuropneumonia (CCPP)</li>';
        html += '<li>Watch for pneumonia, parasites</li>';
        html += '</ul>';
        html += '<p><strong>Breeding:</strong> Gestation 150 days, 1-3 kids per birth</p>';
        html += '<p><strong>Market:</strong> 1.5-2 years, 25-40kg for meat</p>';
        return html;
    }
    
    // Poultry
    if (lowerMsg.match(/\b(chicken|chickens|kuku|poultry|layers?|broilers?|kienyeji|kuroiler)\b/)) {
        html = '<p><strong>🐔 Poultry Farming - Complete Guide</strong></p>';
        html += '<p><strong>Types:</strong></p>';
        html += '<ul>';
        html += '<li><strong>Layers:</strong> Eggs (Isa Brown, Hyline, Kuroiler)</li>';
        html += '<li><strong>Broilers:</strong> Meat (Cobb, Ross - 6-7 weeks)</li>';
        html += '<li><strong>Kienyeji:</strong> Indigenous, hardy, dual purpose</li>';
        html += '<li><strong>Kuroiler:</strong> Improved kienyeji, 200+ eggs/year</li>';
        html += '</ul>';
        html += '<p><strong>Feeding:</strong></p>';
        html += '<ul>';
        html += '<li>Layers: 120-150g/bird/day</li>';
        html += '<li>Broilers: Starter → Finisher feeds</li>';
        html += '<li>Kienyeji: Free range + supplement</li>';
        html += '<li>Fresh water always!</li>';
        html += '</ul>';
        html += '<p><strong>Housing:</strong></p>';
        html += '<ul>';
        html += '<li>1 sq ft per bird minimum</li>';
        html += '<li>Good ventilation</li>';
        html += '<li>Clean dry litter</li>';
        html += '<li>Nest boxes for layers</li>';
        html += '</ul>';
        html += '<p><strong>🚨 CRITICAL - Newcastle Disease:</strong></p>';
        html += '<ul>';
        html += '<li>NO CURE!</li>';
        html += '<li>Vaccinate EVERY 3 MONTHS!</li>';
        html += '<li>Signs: Difficulty breathing, twisted neck, sudden death</li>';
        html += '</ul>';
        html += '<p><strong>Other diseases:</strong> Gumboro (vaccinate), Coccidiosis, Fowl Pox, Bird Flu</p>';
        html += '<p><strong>Lay rate:</strong> 85-95% at peak for commercial layers</p>';
        return html;
    }
    
    // Sheep
    if (lowerMsg.match(/\b(sheep|kondoo)\b/)) {
        html = '<p><strong>🐑 Sheep Farming - Complete Guide</strong></p>';
        html += '<p><strong>Breeds:</strong></p>';
        html += '<ul>';
        html += '<li><strong>Red Maasai:</strong> Fat tail, very hardy, drought resistant</li>';
        html += '<li><strong>Dorper:</strong> Meat breed, fast growing</li>';
        html += '<li><strong>Merino:</strong> Wool production</li>';
        html += '<li><strong>Corriedale:</strong> Dual purpose</li>';
        html += '</ul>';
        html += '<p><strong>Feeding:</strong> Grazing + mineral blocks + hay in dry season</p>';
        html += '<p><strong>Health:</strong></p>';
        html += '<ul>';
        html += '<li>Foot rot prevention (trim hooves)</li>';
        html += '<li>Regular deworming</li>';
        html += '<li>Dipping for external parasites</li>';
        html += '</ul>';
        html += '<p><strong>Market:</strong> 8-12 months, 30-45kg for meat</p>';
        html += '<p><strong>Best for:</strong> ASAL areas, low input farming</p>';
        return html;
    }
    
    // Pigs
    if (lowerMsg.match(/\b(pig|pigs|swine|nguruwe)\b/)) {
        html = '<p><strong>🐷 Pig Farming - Complete Guide</strong></p>';
        html += '<p><strong>Breeds:</strong></p>';
        html += '<ul>';
        html += '<li><strong>Large White:</strong> White, popular, good mothers</li>';
        html += '<li><strong>Landrace:</strong> White, droopy ears, good mothers</li>';
        html += '<li><strong>Duroc:</strong> Red/brown, fast growing</li>';
        html += '<li><strong>Hampshire:</strong> Black with white belt</li>';
        html += '</ul>';
        html += '<p><strong>Feeding:</strong></p>';
        html += '<ul>';
        html += '<li>Kitchen waste (MUST be cooked!)</li>';
        html += '<li>Commercial feed: 2-3kg/day</li>';
        html += '<li>Pigs are omnivores - varied diet</li>';
        html += '</ul>';
        html += '<p><strong>Housing:</strong> Shade + mud wallows (pigs cannot sweat!)</p>';
        html += '<p><strong>🚨 African Swine Fever (ASF):</strong></p>';
        html += '<ul>';
        html += '<li>NO CURE! NO VACCINE! 100% DEATH RATE!</li>';
        html += '<li>Strict biosecurity essential</li>';
        html += '<li>No raw pork products</li>';
        html += '<li>Quarantine new pigs 21 days</li>';
        html += '<li>Keep wild pigs away!</li>';
        html += '</ul>';
        html += '<p><strong>Market:</strong> 90-100kg at 6-7 months</p>';
        return html;
    }
    
    // Rabbits
    if (lowerMsg.match(/\b(rabbit|rabbits|sungura)\b/)) {
        html = '<p><strong>🐰 Rabbit Farming - Complete Guide</strong></p>';
        html += '<p><strong>Breeds:</strong></p>';
        html += '<ul>';
        html += '<li><strong>New Zealand White:</strong> White, meat breed</li>';
        html += '<li><strong>California:</strong> White with black points</li>';
        html += '<li><strong>Flemish Giant:</strong> Very large, dual purpose</li>';
        html += '<li><strong>Chinchilla:</strong> Grey, good for meat</li>';
        html += '</ul>';
        html += '<p><strong>Feeding:</strong></p>';
        html += '<ul>';
        html += '<li>80% hay (essential for digestion)</li>';
        html += '<li>Fresh vegetables (kale, carrot tops)</li>';
        html += '<li>Commercial pellets</li>';
        html += '<li>Clean water always</li>';
        html += '</ul>';
        html += '<p><strong>Housing:</strong> Wire cages off ground, protected from wind/rain</p>';
        html += '<p><strong>Breeding:</strong></p>';
        html += '<ul>';
        html += '<li>Gestation: 28-35 days</li>';
        html += '<li>Litter size: 6-12 kits</li>';
        html += '<li>Wean at 6-8 weeks</li>';
        html += '<li>Does can breed back 2-3 weeks after kindling</li>';
        html += '</ul>';
        html += '<p><strong>Market:</strong> 2-3kg at 4-5 months</p>';
        html += '<p><strong>Diseases:</strong> Ear mites, respiratory infections, enteritis</p>';
        return html;
    }
    
    // Fish
    if (lowerMsg.match(/\b(fish|aquaculture|tilapia|catfish|samaki|pond|fish farming)\b/)) {
        html = '<p><strong>🐟 Fish Farming (Aquaculture) - Complete Guide</strong></p>';
        html += '<p><strong>Popular Species:</strong></p>';
        html += '<ul>';
        html += '<li><strong>Nile Tilapia:</strong> Most popular, 6-8 months to harvest</li>';
        html += '<li><strong>African Catfish:</strong> Hardier, grows faster, 5-6 months</li>';
        html += '<li><strong>Trout:</strong> Cold water only (highlands)</li>';
        html += '</ul>';
        html += '<p><strong>Pond Setup:</strong></p>';
        html += '<ul>';
        html += '<li>Size: 300-1000 sq meters typical</li>';
        html += '<li>Depth: 1-1.5m</li>';
        html += '<li>Stocking: 2-5 fish per sq meter</li>';
        html += '<li>Water pH: 6.5-9.0</li>';
        html += '</ul>';
        html += '<p><strong>Feeding:</strong></p>';
        html += '<ul>';
        html += '<li>2-3 times daily</li>';
        html += '<li>Floating pellets recommended</li>';
        html += '<li>Don\'t overfeed!</li>';
        html += '</ul>';
        html += '<p><strong>Water Management:</strong></p>';
        html += '<ul>';
        html += '<li>Replace 10-20% water weekly</li>';
        html += '<li>Monitor dissolved oxygen</li>';
        html += '<li>Watch for disease signs</li>';
        html += '</ul>';
        html += '<p><strong>Harvest:</strong> 6-8 months, 250-400g for tilapia</p>';
        html += '<p><strong>State Department of Fisheries:</strong> <a href="https://www.kilimo.go.ke" target="_blank">www.kilimo.go.ke</a></p>';
        return html;
    }

    // =====================================================
    // PESTS & DISEASES
    // =====================================================
    
    // Fall Armyworm
    if (lowerMsg.match(/\b(armyworm|fall armyworm|army worm)\b/)) {
        html = '<p><strong>🐛 Fall Armyworm - Complete Control Guide</strong></p>';
        html += '<p><strong>Attacks:</strong> Maize, sorghum, millet, rice, grasses</p>';
        html += '<p><strong>Signs:</strong></p>';
        html += '<ul>';
        html += '<li>Windowpane leaves (transparent patches)</li>';
        html += '<li>Sawdust-like frass in whorl</li>';
        html += '<li>Ragged leaf edges</li>';
        html += '<li>Young larvae are green, older brown with stripes</li>';
        html += '</ul>';
        html += '<p><strong>Control:</strong></p>';
        html += '<ul>';
        html += '<li><strong>Scout DAILY</strong> during vegetative stage</li>';
        html += '<li><strong>Traditional:</strong> Sand/soil in whorl</li>';
        html += '<li><strong>Chemicals:</strong> Emamectin benzoate, Spinosad, Pyrethroids (spray when larvae young - morning/evening)</li>';
        html += '<li><strong>Push-pull:</strong> Plant Desmodium + Napier around field</li>';
        html += '<li><strong>Biocontrol:</strong> Natural enemies (parasitic wasps)</li>';
        html += '</ul>';
        html += '<p><strong>Report outbreaks:</strong> County agriculture office</p>';
        return html;
    }
    
    // Aphids
    if (lowerMsg.match(/\b(aphid|aphids|greenfly|blackfly)\b/)) {
        html = '<p><strong>🐛 Aphids - Complete Control Guide</strong></p>';
        html += '<p><strong>Attacks:</strong> Vegetables, beans, flowers, young shoots</p>';
        html += '<p><strong>Signs:</strong></p>';
        html += '<ul>';
        html += '<li>Clusters of small green/black insects on leaves/stems</li>';
        html += '<li>Curled, distorted leaves</li>';
        html += '<li>Sticky honeydew on leaves</li>';
        html += '<li>Black sooty mold on honeydew</li>';
        html += '</ul>';
        html += '<p><strong>Control:</strong></p>';
        html += '<ul>';
        html += '<li><strong>Water:</strong> Strong spray to knock off</li>';
        html += '<li><strong>Soap spray:</strong> 1-2 tbsp liquid soap per liter water</li>';
        html += '<li><strong>Neem oil:</strong> Natural insecticide</li>';
        html += '<li><strong>Encourage predators:</strong> Ladybirds, lacewings eat aphids</li>';
        html += '<li><strong>Chemicals:</strong> Pirimicarb, Dimethoate (if severe)</li>';
        html += '</ul>';
        html += '<p><strong>Tip:</strong> Ants protect aphids - control ants too!</p>';
        return html;
    }
    
    // Blight
    if (lowerMsg.match(/\b(blight|late blight|early blight|tomato blight|potato blight)\b/)) {
        html = '<p><strong>🍄 Blight Disease - Complete Guide</strong></p>';
        html += '<p><strong>Late Blight (Very serious!):</strong></p>';
        html += '<ul>';
        html += '<li>Water-soaked patches on leaves</li>';
        html += '<li>White mold on leaf undersides</li>';
        html += '<li>Rapid spread in cool, wet weather</li>';
        html += '<li>Can destroy entire crop in days</li>';
        html += '</ul>';
        html += '<p><strong>Early Blight:</strong></p>';
        html += '<ul>';
        html += '<li>Target-like concentric rings on leaves</li>';
        html += '<li>Yellowing from bottom up</li>';
        html += '<li>Slow progression</li>';
        html += '</ul>';
        html += '<p><strong>Control:</strong></p>';
        html += '<ul>';
        html += '<li>Use resistant varieties</li>';
        html += '<li>Copper-based fungicides (preventive & curative)</li>';
        html += '<li>Remove and destroy infected plants</li>';
        html += '<li>Good spacing for air circulation</li>';
        html += '<li>Avoid overhead irrigation</li>';
        html += '<li>Crop rotation (3-4 years)</li>';
        html += '</ul>';
        return html;
    }
    
    // Wilt
    if (lowerMsg.match(/\b(wilt|wilting|bacterial wilt|fusarium wilt)\b/)) {
        html = '<p><strong>🦠 Wilt Disease - Complete Guide</strong></p>';
        html += '<p><strong>Bacterial Wilt:</strong></p>';
        html += '<ul>';
        html += '<li>Rapid wilting without yellowing</li>';
        html += '<li>White ooze when cut stem placed in water</li>';
        html += '<li>Common in tomatoes, potatoes, bananas</li>';
        html += '</ul>';
        html += '<p><strong>⚠️ NO CURE for bacterial wilt!</strong></p>';
        html += '<p><strong>Fusarium Wilt:</strong></p>';
        html += '<ul>';
        html += '<li>Yellowing starts on one side</li>';
        html += '<li>Brown streaks in stem when cut</li>';
        html += '</ul>';
        html += '<p><strong>Management:</strong></p>';
        html += '<ul>';
        html += '<li>Remove and BURN infected plants</li>';
        html += '<li>Rotate crops 3-5 years</li>';
        html += '<li>Use clean, certified seed</li>';
        html += '<li>Good drainage essential</li>';
        html += '<li>Plant resistant varieties</li>';
        html += '<li>Solarize soil (clear plastic, hot season)</li>';
        html += '</ul>';
        return html;
    }
    
    // Newcastle
    if (lowerMsg.match(/\b(newcastle|newcastle disease)\b/)) {
        html = '<p><strong>🚨 Newcastle Disease - CRITICAL</strong></p>';
        html += '<p><strong>⚠️ HIGHLY FATAL - Can wipe out entire flock!</strong></p>';
        html += '<p><strong>Signs:</strong></p>';
        html += '<ul>';
        html += '<li>Difficulty breathing, gasping</li>';
        html += '<li>Twisted neck (torticollis)</li>';
        html += '<li>Greenish diarrhea</li>';
        html += '<li>Drop in egg production</li>';
        html += '<li>Sudden death - up to 100% mortality!</li>';
        html += '</ul>';
        html += '<p><strong>⚠️ NO CURE! Prevention only!</strong></p>';
        html += '<p><strong>VACCINATION SCHEDULE:</strong></p>';
        html += '<ul>';
        html += '<li>Day 7-14: First vaccination</li>';
        html += '<li>Repeat EVERY 3 MONTHS!</li>';
        html += '<li>Use Hitchner B1 or Lasota strains</li>';
        html += '</ul>';
        html += '<p><strong>Outbreak response:</strong></p>';
        html += '<ul>';
        html += '<li>Isolate sick birds immediately</li>';
        html += '<li>Stop all movement on/off farm</li>';
        html += '<li>Report to nearest vet office</li>';
        html += '<li>Disinfect everything</li>';
        html += '</ul>';
        return html;
    }
    
    // Mastitis
    if (lowerMsg.match(/\b(mastitis)\b/)) {
        html = '<p><strong>🥛 Mastitis (Dairy Cows) - Complete Guide</strong></p>';
        html += '<p><strong>Signs:</strong></p>';
        html += '<ul>';
        html += '<li>Swollen, hot, painful udder</li>';
        html += '<li>Clots, blood, or pus in milk</li>';
        html += '<li>Watery or discolored milk</li>';
        html += '<li>Cow may have fever</li>';
        html += '<li>Reduced milk yield</li>';
        html += '</ul>';
        html += '<p><strong>Treatment:</strong></p>';
        html += '<ul>';
        html += '<li>Call veterinarian!</li>';
        html += '<li>Intramammary antibiotics</li>';
        html += '<li>Frequent milking (strip out infected quarter)</li>';
        html += '<li>Do NOT milk into bulk tank!</li>';
        html += '</ul>';
        html += '<p><strong>Prevention:</strong></p>';
        html += '<ul>';
        html += '<li>Clean teats BEFORE and AFTER milking</li>';
        html += '<li>Use clean, dry bedding</li>';
        html += '<li>Dry cow therapy</li>';
        html += '<li>Regular testing (California Mastitis Test)</li>';
        html += '<li>Cull chronic cases</li>';
        html += '</ul>';
        return html;
    }
    
    // ASF
    if (lowerMsg.match(/\b(african swine fever|asf|swine fever)\b/)) {
        html = '<p><strong>🚨 African Swine Fever (ASF) - CRITICAL</strong></p>';
        html += '<p><strong>⚠️ NO CURE! NO VACCINE! UP TO 100% MORTALITY!</strong></p>';
        html += '<p><strong>Signs:</strong></p>';
        html += '<ul>';
        html += '<li>High fever</li>';
        html += '<li>Reddened skin (ears, belly)</li>';
        html += '<li>Loss of appetite</li>';
        html += '<li>Difficulty breathing</li>';
        html += '<li>Diarrhea, vomiting</li>';
        html += '<li>Sudden death</li>';
        html += '</ul>';
        html += '<p><strong>STRICT BIOSECURITY - Prevention only!</strong></p>';
        html += '<ul>';
        html += '<li>Never feed raw pork or pork products</li>';
        html += '<li>Quarantine ALL new pigs for 21 days</li>';
        html += '<li>Disinfect EVERYTHING entering farm</li>';
        html += '<li>Keep wild pigs away (fencing)</li>';
        html += '<li>Limit visitors</li>';
        html += '<li>Report any suspicious deaths IMMEDIATELY</li>';
        html += '</ul>';
        html += '<p><strong>Report to:</strong> County Veterinary Office or call 020 2718370</p>';
        return html;
    }
    
    // Coccidiosis
    if (lowerMsg.match(/\b(coccidiosis|coccidia)\b/)) {
        html = '<p><strong>🐛 Coccidiosis (Poultry) - Complete Guide</strong></p>';
        html += '<p><strong>Signs:</strong></p>';
        html += '<ul>';
        html += '<li>Blood in droppings</li>';
        html += '<li>Hunched, ruffled birds</li>';
        html += '<li>Diarrhea</li>';
        html += '<li>Reduced feed intake</li>';
        html += '<li>High mortality in young birds</li>';
        html += '</ul>';
        html += '<p><strong>Treatment:</strong></p>';
        html += '<ul>';
        html += '<li>Coccidiostats in water (Amprolium, Sulfa drugs)</li>';
        html += '<li>Vitamins A and K to aid recovery</li>';
        html += '</ul>';
        html += '<p><strong>Prevention:</strong></p>';
        html += '<ul>';
        html += '<li>Keep litter DRY!</li>';
        html += '<li>Avoid water spills</li>';
        html += '<li>Proper stocking density</li>';
        html += '<li>Coccidiostat in feed (preventive)</li>';
        html += '<li>Vaccination available</li>';
        html += '</ul>';
        return html;
    }
    
    // Tuta Absoluta
    if (lowerMsg.match(/\b(tuta|tuta absoluta|leaf miner|tomato leaf miner)\b/)) {
        html = '<p><strong>🐛 Tuta Absoluta (Tomato Leaf Miner) - Complete Guide</strong></p>';
        html += '<p><strong>⚠️ Can cause 100% tomato loss if uncontrolled!</strong></p>';
        html += '<p><strong>Signs:</strong></p>';
        html += '<ul>';
        html += '<li>Mines/galleries in leaves</li>';
        html += '<li>Black frass in mines</li>';
        html += '<li>Holes in fruits (entry points)</li>';
        html += '<li>Deformed fruits</li>';
        html += '</ul>';
        html += '<p><strong>Control:</strong></p>';
        html += '<ul>';
        html += '<li><strong>Pheromone traps:</strong> Monitor & mass trap males</li>';
        html += '<li>Remove and destroy infected plant material</li>';
        html += '<li><strong>Chemicals:</strong> Spinosad, Emamectin, Abamectin, Chlorantraniliprole</li>';
        html += '<li>Crop rotation (not solanaceous crops)</li>';
        html += '<li>Clean crop residues after harvest</li>';
        html += '<li>Biological: Parasitic wasps (Trichogramma)</li>';
        html += '</ul>';
        html += '<p><strong>Start control early!</strong> Before flowering if possible</p>';
        return html;
    }
    
    // Ticks
    if (lowerMsg.match(/\b(tick|ticks)\b/)) {
        html = '<p><strong>🐛 Tick Control - Complete Guide</strong></p>';
        html += '<p><strong>Diseases transmitted:</strong></p>';
        html += '<ul>';
        html += '<li><strong>East Coast Fever (ECF):</strong> High fever, swollen lymph nodes, death</li>';
        html += '<li><strong>Heartwater:</strong> Nervous signs, death</li>';
        html += '<li><strong>Anaplasmosis:</strong> Fever, anemia, jaundice</li>';
        html += '<li><strong>Babesiosis:</strong> Red urine, fever, anemia</li>';
        html += '</ul>';
        html += '<p><strong>Control:</strong></p>';
        html += '<ul>';
        html += '<li>Weekly dipping or spraying with acaricides</li>';
        html += '<li>Rotate acaricide classes to prevent resistance</li>';
        html += '<li>Hand dressing for hard-to-reach areas</li>';
        html += '<li>Pasture rotation</li>';
        html += '<li>Breed for tick tolerance (Boran, Sahiwal)</li>';
        html += '</ul>';
        html += '<p><strong>ECF vaccine:</strong> Available - ask your vet about infection-and-treatment method</p>';
        return html;
    }

    // =====================================================
    // FERTILIZER, MANURE, COMPOST
    // =====================================================
    
    if (lowerMsg.match(/\b(fertilizer|fertilizers|fertiliser|fertilisers)\b/) ||
        lowerMsg.match(/\b(dap fertilizer|can fertilizer|npk fertilizer|urea fertilizer)\b/) ||
        lowerMsg.match(/\b(about dap|about npk|about urea|about can)\b/)) {
        html = '<p><strong>🧪 Fertilizer Guide - Complete</strong></p>';
        html += '<p><strong>Types & Uses:</strong></p>';
        html += '<ul>';
        html += '<li><strong>DAP (18-46-0):</strong> Planting - high phosphorus for root development. Apply in planting hole.</li>';
        html += '<li><strong>CAN (26-0-0):</strong> Top dressing - nitrogen for vegetative growth. Apply when crop is growing.</li>';
        html += '<li><strong>NPK (17-17-17):</strong> Balanced - general purpose, vegetables love it.</li>';
        html += '<li><strong>Urea (46-0-0):</strong> Highest nitrogen - rapid green growth. Apply to moist soil, incorporate.</li>';
        html += '<li><strong>MOP (Potash):</strong> Potassium - for root crops, fruit quality, disease resistance.</li>';
        html += '</ul>';
        html += '<p><strong>Application Tips:</strong></p>';
        html += '<ul>';
        html += '<li>Maize: DAP 50kg/acre at planting, CAN 50kg when knee-high</li>';
        html += '<li>NEVER put fertilizer directly touching seeds!</li>';
        html += '<li>Apply when soil is moist</li>';
        html += '<li>Get soil test for exact requirements</li>';
        html += '<li>Don\'t apply too late - reduces yield</li>';
        html += '</ul>';
        html += '<p><strong>Subsidy:</strong> Check <a href="https://www.kilimo.go.ke" target="_blank">www.kilimo.go.ke</a> for e-voucher</p>';
        html += '<p><em>Ask about "manure" or "compost" for organic alternatives!</em></p>';
        return html;
    }
    
    if (lowerMsg.match(/\b(manure|manures|animal manure|organic manure)\b/)) {
        html = '<p><strong>💩 Manure Guide - Complete</strong></p>';
        html += '<p><strong>Types:</strong></p>';
        html += '<ul>';
        html += '<li><strong>Cattle:</strong> Balanced NPK, good for all crops. 5-10 tons/acre.</li>';
        html += '<li><strong>Poultry:</strong> Very high nitrogen! Compost for 6 weeks before use. Apply sparingly.</li>';
        html += '<li><strong>Goat/Sheep:</strong> Richer than cattle, drier pellets. Good all-rounder.</li>';
        html += '<li><strong>Rabbit:</strong> Very rich, can apply fresh (won\'t burn plants).</li>';
        html += '<li><strong>Pig:</strong> Good nutrient content, compost first.</li>';
        html += '</ul>';
        html += '<p><strong>Application:</strong></p>';
        html += '<ul>';
        html += '<li>Apply 5-10 tons/acre</li>';
        html += '<li>Incorporate into soil</li>';
        html += '<li>Apply 2-4 weeks before planting</li>';
        html += '<li>Fresh manure can burn plants - age it!</li>';
        html += '</ul>';
        html += '<p><strong>Benefits:</strong> Improves soil structure, water retention, microbial activity!</p>';
        return html;
    }
    
    if (lowerMsg.match(/\b(compost|composting|make compost)\b/)) {
        html = '<p><strong>🍂 Composting - Complete Guide</strong></p>';
        html += '<p><strong>Ingredients (Carbon:Nitrogen ratio):</strong></p>';
        html += '<ul>';
        html += '<li><strong>Green materials (Nitrogen):</strong> Kitchen scraps, fresh leaves, grass clippings, manure</li>';
        html += '<li><strong>Brown materials (Carbon):</strong> Dry leaves, straw, sawdust, paper, cardboard</li>';
        html += '</ul>';
        html += '<p><strong>Method:</strong></p>';
        html += '<ul>';
        html += '<li>Layer 3 parts brown : 1 part green</li>';
        html += '<li>Keep moist (like wrung sponge)</li>';
        html += '<li>Turn every 2-3 weeks for air</li>';
        html += '<li>Size: Minimum 1 cubic meter for heat</li>';
        html += '</ul>';
        html += '<p><strong>Ready in 3-6 months:</strong> Dark, crumbly, earthy smell!</p>';
        html += '<p><strong>Do NOT compost:</strong> Meat, dairy, pet waste, diseased plants, weeds with seeds</p>';
        html += '<p><strong>Tip:</strong> Chop materials small for faster decomposition!</p>';
        return html;
    }

    // =====================================================
    // SOIL
    // =====================================================
    
    if (lowerMsg.match(/\b(soil|soils|soil type|types of soil|soil ph|acidity|alkalinity|soil test)\b/)) {
        html = '<p><strong>🌍 Soil Guide - Complete</strong></p>';
        html += '<p><strong>Types:</strong></p>';
        html += '<ul>';
        html += '<li><strong>Sandy:</strong> Drains fast, warms quickly, needs organic matter. Good for carrots, cassava.</li>';
        html += '<li><strong>Clay:</strong> Holds water/nutrients well, hard when dry, needs compost. Good for rice, bananas.</li>';
        html += '<li><strong>Loam:</strong> Ideal! Mix of sand, silt, clay. Most crops thrive.</li>';
        html += '<li><strong>Volcanic:</strong> Very fertile, found in Rift Valley. Great for most crops.</li>';
        html += '</ul>';
        html += '<p><strong>pH:</strong></p>';
        html += '<ul>';
        html += '<li>Most crops: 5.5-7.0</li>';
        html += '<li>Tea: 4.5-5.5 (acidic)</li>';
        html += '<li>Too acidic: Add lime</li>';
        html += '<li>Too alkaline: Add sulfur, organic matter</li>';
        html += '</ul>';
        html += '<p><strong>Soil Testing:</strong></p>';
        html += '<ul>';
        html += '<li>Test every 2-3 years</li>';
        html += '<li>KALRO, KEPHIS offer services</li>';
        html += '<li>Shows nutrient levels, pH, recommendations</li>';
        html += '</ul>';
        html += '<p><strong>Tips:</strong> Add organic matter, rotate crops, prevent erosion</p>';
        return html;
    }

    // =====================================================
    // WATER & IRRIGATION
    // =====================================================
    
    if (lowerMsg.match(/\b(water|watering|irrigation|irrigate|drip|sprinkler|maji)\b/)) {
        html = '<p><strong>💧 Irrigation Guide - Complete</strong></p>';
        html += '<p><strong>Best time:</strong> Early morning (less evaporation, prevents disease)</p>';
        html += '<p><strong>Methods:</strong></p>';
        html += '<ul>';
        html += '<li><strong>Drip:</strong> Most efficient (90-95%), saves water, reduces disease. Best for vegetables.</li>';
        html += '<li><strong>Sprinkler:</strong> Good for large areas, lawns. Use in morning.</li>';
        html += '<li><strong>Furrow:</strong> Traditional, for row crops. Requires leveled land.</li>';
        html += '<li><strong>Basin:</strong> For trees, individual basins.</li>';
        html += '</ul>';
        html += '<p><strong>Water Saving Tips:</strong></p>';
        html += '<ul>';
        html += '<li>Mulch heavily to reduce evaporation</li>';
        html += '<li>Water deeply but less often (encourages deep roots)</li>';
        html += '<li>Avoid overhead watering in evening</li>';
        html += '<li>Use water-harvesting techniques</li>';
        html += '</ul>';
        html += '<p><strong>NIB:</strong> <a href="https://www.nib.go.ke" target="_blank">www.nib.go.ke</a> for irrigation support</p>';
        return html;
    }

    // =====================================================
    // HARVEST & STORAGE
    // =====================================================
    
    if (lowerMsg.match(/\b(harvest|harvesting|harvest time|when to harvest|storage|storing)\b/)) {
        html = '<p><strong>🌾 Harvest Guide - Complete</strong></p>';
        html += '<p><strong>Signs of maturity:</strong></p>';
        html += '<ul>';
        html += '<li><strong>Maize:</strong> Husks dry, kernels hard, black layer at base</li>';
        html += '<li><strong>Beans:</strong> Pods dry, seeds rattle, leaves yellow</li>';
        html += '<li><strong>Tomatoes:</strong> Color changes (breakers stage for transport)</li>';
        html += '<li><strong>Potatoes:</strong> Leaves yellow and die, skin doesn\'t rub off</li>';
        html += '<li><strong>Onions:</strong> Tops fall over, necks dry</li>';
        html += '</ul>';
        html += '<p><strong>Best practices:</strong></p>';
        html += '<ul>';
        html += '<li>Harvest early morning when cool</li>';
        html += '<li>Harvest in dry weather</li>';
        html += '<li>Handle carefully to avoid damage</li>';
        html += '</ul>';
        html += '<p><strong>Storage:</strong></p>';
        html += '<ul>';
        html += '<li>Dry thoroughly before storage</li>';
        html += '<li>Cool, dry, ventilated place</li>';
        html += '<li>Use hermetic bags for grain (PICS bags)</li>';
        html += '<li>Check regularly for pests</li>';
        html += '</ul>';
        return html;
    }

    // =====================================================
    // WEATHER & SEASONS
    // =====================================================
    
    if (lowerMsg.match(/\b(weather|rain|rainfall|climate|season|temperature|mvua)\b/)) {
        html = '<p><strong>🌤️ Kenya Weather & Seasons</strong></p>';
        html += '<p><strong>Rainfall Pattern:</strong></p>';
        html += '<ul>';
        html += '<li><strong>Long Rains:</strong> March - May (main planting season)</li>';
        html += '<li><strong>Short Rains:</strong> October - December (second season)</li>';
        html += '<li><strong>Dry Season:</strong> June - September, January - February</li>';
        html += '</ul>';
        html += '<p><strong>Regional variations:</strong></p>';
        html += '<ul>';
        html += '<li><strong>Highlands:</strong> Cooler, more rain (Central, Rift Valley)</li>';
        html += '<li><strong>Coast:</strong> Hot, humid, different pattern</li>';
        html += '<li><strong>ASAL:</strong> Low, unreliable rainfall (Eastern, Northern)</li>';
        html += '<li><strong>Lake Region:</strong> Rain almost year-round</li>';
        html += '</ul>';
        html += '<p><strong>Tip:</strong> Set your county in the app for localized weather!</p>';
        html += '<p><strong>KMD:</strong> <a href="https://www.meteo.go.ke" target="_blank">www.meteo.go.ke</a></p>';
        return html;
    }

    // =====================================================
    // MARKET
    // =====================================================
    
    if (lowerMsg.match(/\b(market|sell|buy|price|prices|profit|trade|soko)\b/)) {
        html = '<p><strong>💰 Market Information</strong></p>';
        html += '<p>Go to <strong>Market tab</strong> to:</p>';
        html += '<ul>';
        html += '<li>🛒 Buy farm products</li>';
        html += '<li>💰 Sell your produce</li>';
        html += '<li>👥 Join 4,800+ farmer community</li>';
        html += '</ul>';
        html += '<p><strong>Reference Prices (KES):</strong></p>';
        html += '<ul>';
        html += '<li><strong>Eggs:</strong> 380-520/tray</li>';
        html += '<li><strong>Milk:</strong> 45-70/liter</li>';
        html += '<li><strong>Chicken (live):</strong> 450-700/kg</li>';
        html += '<li><strong>Maize:</strong> 3,000-4,500/90kg bag</li>';
        html += '<li><strong>Beans:</strong> 6,000-10,000/90kg bag</li>';
        html += '</ul>';
        html += '<p><em>Prices vary by location and season!</em></p>';
        return html;
    }

    // =====================================================
    // APP NAVIGATION
    // =====================================================
    
    if (lowerMsg.match(/\b(how to use|how do i|guide|help me use|app features)\b/)) {
        html = '<p><strong>📱 Using AgriXen</strong></p>';
        html += '<p><strong>Tabs:</strong></p>';
        html += '<ul>';
        html += '<li>🌱 <strong>Crops:</strong> 26 crops with details, "In Season" & "Fit" tags</li>';
        html += '<li>🐄 <strong>Livestock:</strong> 8 animals + profit calculator</li>';
        html += '<li>🤖 <strong>Barn-E:</strong> Chat with me!</li>';
        html += '<li>🏥 <strong>VetLine:</strong> Find veterinarians</li>';
        html += '<li>🛒 <strong>Market:</strong> Buy/sell + community</li>';
        html += '</ul>';
        html += '<p>📍 Set county with pin icon for personalized advice!</p>';
        return html;
    }
    
    if (lowerMsg.match(/\b(location|county|set location|my area)\b/)) {
        html = '<p><strong>📍 Set Your County</strong></p>';
        html += '<p>Tap pin icon (top right) → Select county → Confirm</p>';
        html += '<p><strong>Benefits:</strong></p>';
        html += '<ul>';
        html += '<li>Crop recommendations for your region</li>';
        html += '<li>Local weather forecast</li>';
        html += '<li>Market connections nearby</li>';
        html += '<li>County-specific tips</li>';
        html += '</ul>';
        return html;
    }
    
    if (lowerMsg.match(/\b(vet|veterinary|vetline|animal doctor)\b/)) {
        html = '<p><strong>🏥 VetLine - Veterinary Directory</strong></p>';
        html += '<p>Find vets in <strong>VetLine tab</strong> - filter by county and specialty</p>';
        html += '<p><strong>Emergency Contacts:</strong></p>';
        html += '<ul>';
        html += '<li><strong>Kenya Veterinary Board:</strong> 020 2718370</li>';
        html += '<li><strong>FAO Kenya Emergency:</strong> +254 20 7625000</li>';
        html += '<li><strong>Directorate of Veterinary Services:</strong> 020 2718870</li>';
        html += '</ul>';
        return html;
    }
    
    if (lowerMsg.match(/\b(calculator|profit calculator)\b/)) {
        html = '<p><strong>🧮 Profit Calculator</strong></p>';
        html += '<p>Find in <strong>Livestock tab</strong></p>';
        html += '<p><strong>How to use:</strong></p>';
        html += '<ol>';
        html += '<li>Select produce type (eggs, milk, etc.)</li>';
        html += '<li>Enter units sold</li>';
        html += '<li>Enter price per unit</li>';
        html += '<li>Enter total production costs</li>';
        html += '<li>Calculate to see profit/loss!</li>';
        html += '</ol>';
        return html;
    }
    
    if (lowerMsg.match(/\b(community|join community)\b/)) {
        html = '<p><strong>👥 AgriXen Community</strong></p>';
        html += '<p>Join 4,800+ farmers!</p>';
        html += '<p><strong>How to join:</strong></p>';
        html += '<p>Market tab → Community → Join Us</p>';
        html += '<p><strong>Benefits:</strong></p>';
        html += '<ul>';
        html += '<li>Farming tips and updates</li>';
        html += '<li>Seasonal alerts</li>';
        html += '<li>Market information</li>';
        html += '<li>Connect with other farmers</li>';
        html += '</ul>';
        return html;
    }
    
    if (lowerMsg.match(/\b(is it free|cost|price of app|subscription|do i pay)\b/)) {
        html = '<p><strong>🎉 AgriXen is 100% FREE!</strong></p>';
        html += '<p>✅ No subscription fees</p>';
        html += '<p>✅ No account required</p>';
        html += '<p>✅ No hidden costs</p>';
        html += '<p>✅ No ads interrupting your experience</p>';
        html += '<p>Built for Kenyan farmers, by Kenyans! 🇰🇪</p>';
        return html;
    }
    
    if (lowerMsg.match(/\b(who made|who created|developer|mortapps|built this|created this)\b/)) {
        html = '<p><strong>AgriXen was created by MortApps Studios!</strong></p>';
        html += '<p><strong>Contact:</strong></p>';
        html += '<ul>';
        html += '<li>📧 labs@mortappsstudios.com</li>';
        html += '<li>📧 agrixen.ke@gmail.com</li>';
        html += '<li>📱 +254 113 400 063</li>';
        html += '<li>🌐 <a href="https://www.mortappsstudios.com" target="_blank">www.mortappsstudios.com</a></li>';
        html += '</ul>';
        return html;
    }
    
    if (lowerMsg.match(/\b(contact|support|phone number|email address|help desk)\b/)) {
        html = '<p><strong>Contact AgriXen Support</strong></p>';
        html += '<ul>';
        html += '<li>📧 labs@mortappsstudios.com</li>';
        html += '<li>📧 agrixen.ke@gmail.com</li>';
        html += '<li>📱 +254 113 400 063</li>';
        html += '</ul>';
        return html;
    }

    // =====================================================
    // YES/NO RESPONSES
    // =====================================================
    
    if (lowerMsg.match(/^(yes|yeah|yep|ndiyo|sawa|ok|okay|sure|alright)\b/)) {
        var yesResponses = [
            '<p><strong>Poa! 😊</strong> What would you like to know?</p>',
            '<p><strong>Sawa! 👍</strong> Ask me anything about farming!</p>',
            '<p><strong>Great! 🌱</strong> What crop or livestock interests you?</p>'
        ];
        return yesResponses[Math.floor(Math.random() * yesResponses.length)];
    }
    
    if (lowerMsg.match(/^(no|nope|hapana)\b/)) {
        var noResponses = [
            '<p><strong>Hakuna shida! 👍</strong> I\'m here whenever you need help!</p>',
            '<p><strong>No problem! 😊</strong> Ask me anything anytime!</p>',
            '<p><strong>Sawa! 🌾</strong> Happy farming!</p>'
        ];
        return noResponses[Math.floor(Math.random() * noResponses.length)];
    }

    // =====================================================
    // GENERAL KEYWORD MATCHING
    // =====================================================
    
    if (lowerMsg.match(/\b(crop|crops|vegetable|vegetables|shamba|farm|farming)\b/)) {
        html = '<p><strong>🌱 Crops in AgriXen</strong></p>';
        html += '<p><strong>Cereals:</strong> Maize, Rice, Sorghum, Millet</p>';
        html += '<p><strong>Vegetables:</strong> Tomatoes, Kale, Cabbage, Spinach, Onions, Carrots, Capsicum</p>';
        html += '<p><strong>Roots:</strong> Potatoes, Sweet Potatoes, Cassava</p>';
        html += '<p><strong>Fruits:</strong> Bananas, Mangoes, Avocados, Watermelon, Passion Fruit, Pumpkin</p>';
        html += '<p><strong>Cash Crops:</strong> Coffee, Tea, Sugarcane</p>';
        html += '<p><strong>Legumes:</strong> Beans, Cowpeas, Groundnuts</p>';
        html += '<p><em>Ask about a specific crop! Example: "Tell me about tomatoes"</em></p>';
        return html;
    }
    
    if (lowerMsg.match(/\b(livestock|animal|animals)\b/)) {
        html = '<p><strong>🐄 Livestock in AgriXen</strong></p>';
        html += '<p><strong>Ruminants:</strong> Dairy Cattle, Beef Cattle, Goats, Sheep</p>';
        html += '<p><strong>Poultry:</strong> Chickens (Layers, Broilers, Kienyeji, Kuroiler)</p>';
        html += '<p><strong>Others:</strong> Pigs, Rabbits, Fish</p>';
        html += '<p><em>Ask about specific animal! Example: "Tell me about dairy cattle"</em></p>';
        return html;
    }
    
    if (lowerMsg.match(/\b(pest|pests|disease|diseases|sick|infection)\b/)) {
        html = '<p><strong>🐛 Pests & Diseases</strong></p>';
        html += '<p><strong>Crop Pests:</strong> Armyworms, Aphids, Tuta Absoluta, Stalk Borer, Fruit Fly</p>';
        html += '<p><strong>Crop Diseases:</strong> Blight, Wilt, Rust, Mosaic Viruses</p>';
        html += '<p><strong>Livestock Diseases:</strong> Newcastle, Mastitis, ASF, ECF, FMD, Coccidiosis</p>';
        html += '<p><em>Ask about specific problem! Example: "How to control aphids?"</em></p>';
        return html;
    }
    
    if (lowerMsg.match(/\b(land preparation|prepare land|prepare soil|prepare my farm)\b/)) {
        html = '<p><strong>🌱 Land Preparation</strong></p>';
        html += '<ol>';
        html += '<li><strong>Clear land</strong> - Remove trees, bushes, rocks, weeds</li>';
        html += '<li><strong>Plough</strong> - 2-4 weeks before planting, 15-30cm deep</li>';
        html += '<li><strong>Add organic matter</strong> - Manure/compost 5-10 tons/acre</li>';
        html += '<li><strong>Harrow</strong> - Break clods, level field, fine tilth</li>';
        html += '<li><strong>Make rows/beds</strong> - According to crop spacing</li>';
        html += '</ol>';
        html += '<p><strong>Tip:</strong> Good land prep = 50% of success!</p>';
        return html;
    }
    
    if (lowerMsg.match(/\b(planting season|farming calendar|when to plant|planting calendar|season calendar)\b/)) {
        html = '<p><strong>📅 Kenya Planting Calendar</strong></p>';
        html += '<p><strong>Long Rains (Mar-May):</strong> Maize, beans, potatoes, vegetables, rice, sorghum</p>';
        html += '<p><strong>Short Rains (Oct-Dec):</strong> Maize, beans, sorghum, millet, cowpeas, wheat</p>';
        html += '<p><strong>Year-round (with irrigation):</strong> Tomatoes, onions, vegetables, watermelon, capsicum</p>';
        html += '<p><em>Ask "What can I plant now?" for current month!</em></p>';
        return html;
    }

    // =====================================================
    // FALLBACK
    // =====================================================
    
    console.log('[Barn-E] No match found, returning fallback');
    html = '<p><strong>I heard you! 🤔</strong></p>';
    html += '<p>You asked: <em>"' + message + '"</em></p>';
    html += '<p>I\'m still learning! Try asking about:</p>';
    html += '<ul>';
    html += '<li>🌱 Crops (maize, tomatoes, potatoes...)</li>';
    html += '<li>🐄 Livestock (cattle, goats, chickens...)</li>';
    html += '<li>🐛 Pests & Diseases</li>';
    html += '<li>🏛️ Government resources</li>';
    html += '<li>💰 Market prices</li>';
    html += '</ul>';
    html += '<p><strong>Or contact us:</strong></p>';
    html += '<ul>';
    html += '<li>📧 labs@mortappsstudios.com</li>';
    html += '<li>📱 +254 113 400 063</li>';
    html += '</ul>';
    
    return html;
}

console.log('[Barn-E] Response engine loaded successfully');
