// ================= IBAN TOOLS (ISO 13616 COMPLIANT) =================

const isoCountries = {
    // الدول الأكثر استخداماً (Top Tier)
    "DE": 22, // Germany
    "NL": 18, // Netherlands
    "AT": 20, // Austria (جديد)
    "BE": 16, // Belgium (جديد)
    "FR": 27, // France
    "ES": 24, // Spain
    
    // باقي الدول
    "GB": 22, "IT": 27, "SA": 24, "EG": 29, 
    "TR": 26, "AE": 23, "BR": 29, "CH": 21, 
    "KW": 30, "JO": 30, "QA": 29
};

let validIbansList = []; 
let validCount = 0;   
let invalidCount = 0; 
let ibanStartTime;
let ibanCheckedCount = 0;
let isIbanChecking = false; 

// === دوال التحكم في الواجهة ===

function toggleIbanMode() {
    const mode = document.getElementById('ibanCountryGen').value;
    const calcSection = document.getElementById('modeCalc');
    
    if (mode === 'CALC') {
        calcSection.classList.remove('disabled-section');
        document.getElementById('ibanAmountGen').value = "10";
    } else {
        calcSection.classList.add('disabled-section');
    }
}

function openIbanInfoModal() {
    document.getElementById('ibanInfoModal').style.display = "block";
}

function closeIbanInfoModal() {
    document.getElementById('ibanInfoModal').style.display = "none";
}

function updateIbanCount() {
    const list = document.getElementById('ibanList').value.trim();
    const count = list === "" ? 0 : list.split('\n').filter(line => line.trim() !== "").length;
    document.getElementById('ibanCountBadge').innerText = `COUNT: ${count}`;
}

// === منطق التوليد ===

async function generateIbans() {
    const mode = document.getElementById('ibanCountryGen').value;
    let amount = parseInt(document.getElementById('ibanAmountGen').value);
    if (isNaN(amount) || amount < 1) amount = 1;
    
    if (mode === 'CALC') {
        await generateCalculatedIbans(amount);
        return;
    }

    const length = isoCountries[mode];
    if (!length) return;

    let output = "";
    const bbanLength = length - 4; 

    for (let k = 0; k < amount; k++) {
        let bban = "";
        for (let i = 0; i < bbanLength; i++) {
            bban += Math.floor(Math.random() * 10);
        }

        const countryCodeNum = (mode.charCodeAt(0) - 55).toString() + (mode.charCodeAt(1) - 55).toString();
        const tempString = bban + countryCodeNum + "00";
        const remainder = isoMod97(tempString);
        const checkDigits = (98 - remainder).toString().padStart(2, '0');

        output += `${mode}${checkDigits}${bban}\n`;
    }

    document.getElementById('ibanList').value = output.trim();
    updateIbanCount();
}

async function generateCalculatedIbans(amount) {
    const country = document.getElementById('calcTargetCountry').value;
    const bankCode = document.getElementById('calcBankCode').value.trim();
    const outputField = document.getElementById('ibanList');
    
    if (!bankCode) {
        // تم استبدال Alert بـ showToast لتظهر مثل تبويب الـ BINs
        showToast("⚠️ Please enter a Bank Code first!");
        return;
    }

    outputField.value = "Calculating... Please wait ⏳";
    let results = "";
    const proxy = "https://corsproxy.io/?";

    for (let i = 0; i < amount; i++) {
        let randomAcc = "";
        for(let j=0; j<10; j++) randomAcc += Math.floor(Math.random()*10);

        try {
            const url = `https://openiban.com/v2/calculate/${country}/${bankCode}/${randomAcc}`;
            const response = await fetch(proxy + encodeURIComponent(url));
            if(response.ok) {
                const data = await response.json();
                if(data.valid && data.iban) {
                    results += data.iban + "\n";
                } else {
                    results += `Error generating for ${randomAcc}\n`;
                }
            }
        } catch (e) {
            results += `Network Error\n`;
        }
        
        outputField.value = results.trim();
        await new Promise(r => setTimeout(r, 200)); 
    }
    updateIbanCount();
}

function isoMod97(str) {
    let checksum = str.slice(0, 2);
    for (let offset = 2; offset < str.length; offset += 7) {
        let fragment = String(checksum) + str.substring(offset, offset + 7);
        checksum = parseInt(fragment, 10) % 97;
    }
    return checksum;
}

// === دوال الفحص والتحقق ===

function calculateIbanSpeed() {
    if (!ibanStartTime || ibanCheckedCount === 0) return;
    const now = new Date();
    const diffInSeconds = (now - ibanStartTime) / 1000;
    const cpm = Math.round((ibanCheckedCount / diffInSeconds) * 60);
    
    const speedEl = document.getElementById('ibanSpeedMeter');
    if(speedEl) speedEl.innerText = `iBAN Peer Minute: ${cpm}`;
}

function clearIbanList() {
    if (isIbanChecking) return;
    document.getElementById('ibanList').value = "";
    document.getElementById('resIbanInvalid').innerHTML = ""; 
    invalidCount = 0;
    document.getElementById('ibanDeadCount').innerText = "0";
    
    const speedEl = document.getElementById('ibanSpeedMeter');
    if(speedEl) speedEl.innerText = "iBan Peer Minute: 0";
    
    // تصفير شريط التقدم
    document.getElementById('ibanProgBar').style.width = "0%";
    
    updateIbanCount();
}

function clearIbanHits() {
    document.getElementById('resIbanValid').innerHTML = "";
    validIbansList = [];
    validCount = 0;
    document.getElementById('ibanHitCount').innerText = "0";
    toggleIbanActions(false);
}

function toggleIbanActions(show) {
    const display = show ? "inline-block" : "none";
    document.getElementById('clearIbanHitsBtn').style.display = display;
    document.getElementById('saveIbanHitsBtn').style.display = display;
    document.getElementById('ibanFileName').style.display = display;
}

function saveIbanHits() {
    if (validIbansList.length === 0) return;
    let customName = document.getElementById('ibanFileName').value.trim();
    if (!customName) customName = "Live_IBANs";
    const content = validIbansList.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const a = document.createElement('a');
    a.download = `${customName}.txt`;
    a.href = window.URL.createObjectURL(blob);
    a.click();
}

async function startIbanCheck() {
    const listStr = document.getElementById('ibanList').value.trim();
    if (!listStr) return;

    const list = listStr.split('\n').filter(l => l.trim() !== "");
    const total = list.length;
    
    isIbanChecking = true;
    ibanStartTime = new Date(); 
    ibanCheckedCount = 0;       

    const btnCheck = document.getElementById('btnIbanCheck');
    const btnStop = document.getElementById('btnIbanStop');
    const btnClear = document.getElementById('btnIbanClear');
    
    const progCont = document.getElementById('ibanProgCont');
    const progBar = document.getElementById('ibanProgBar');
    if(progCont) progCont.style.display = "block";
    if(progBar) progBar.style.width = "0%";

	btnCheck.disabled = true;
    btnCheck.style.opacity = "0.5";
    btnCheck.style.cursor = "default";

    btnClear.style.display = 'none';
    btnStop.style.display = 'inline-block';

    const proxy = "https://corsproxy.io/?";

    for (let i = 0; i < total; i++) {
        if (!isIbanChecking) break;

        let currentVal = document.getElementById('ibanList').value.split('\n');
        let checkingIban = currentVal.shift();
        document.getElementById('ibanList').value = currentVal.join('\n');
        updateIbanCount();

        try {
            const apiUrl = `https://openiban.com/validate/${checkingIban.trim()}?validateBankCode=true&getBIC=true`;
            const response = await fetch(proxy + encodeURIComponent(apiUrl));
            const data = await response.json();
            
            ibanCheckedCount++;
            calculateIbanSpeed();

            // 1. التحقق الصارم: يجب أن يكون Valid + يحتوي على كود بنك
            const hasBankInfo = data.bankData && data.bankData.bankCode;

            if (data.valid && hasBankInfo) {
                validCount++;
                document.getElementById('ibanHitCount').innerText = validCount;
                
                const bankName = data.bankData.name || "N/A";
                const bankCode = data.bankData.bankCode || "N/A";
                const bic = data.bankData.bic || "N/A";
                const city = data.bankData.city || "N/A";
                const zip = data.bankData.zip || "N/A";
                
                const logEntry = `IBAN: ${checkingIban} | Bank: ${bankName} | Code: ${bankCode} | BIC: ${bic} | City: ${city} | Zip: ${zip}`;
                validIbansList.push(logEntry);

                const item = document.createElement('div');
                item.className = 'hit-item';
                item.innerHTML = `
                    <div style="font-family:monospace; font-size:14px; margin-bottom:8px; color:var(--hit-color); font-weight:bold; letter-spacing:1px;">
                        ✅ ${checkingIban}
                    </div>
                    <div class="hit-info">
                        <div>🏦 Bank: ${bankName}</div>
                        <div>🔢 Code: ${bankCode}</div>
                        <div>📍 BIC: ${bic}</div>
                        <div>📮 Zip: ${zip}</div>
                        <div>🏙️ City: ${city}</div>
                    </div>
                `;
                document.getElementById('resIbanValid').prepend(item);
                toggleIbanActions(true);

            } else {
                invalidCount++;
                document.getElementById('ibanDeadCount').innerText = invalidCount;

                // تحديد سبب الرفض بدقة
                let reason = "Invalid";
                if (data.messages && data.messages.length > 0) {
                    reason = data.messages[0];
                } else if (data.valid && !hasBankInfo) {
                    reason = "Missing Bank Info"; // سبب جديد للأيبانات الناقصة
                }

                const item = document.createElement('div');
                item.style.padding = "5px";
                item.style.borderBottom = "1px solid rgba(255,255,255,0.05)";
                item.style.color = "var(--dead-color)";
                item.style.fontSize = "11px";
                item.innerHTML = `❌ ${checkingIban} <span style="color:#777;">(${reason})</span>`;
                document.getElementById('resIbanInvalid').prepend(item);
            }

        } catch (error) {
            ibanCheckedCount++; 
            calculateIbanSpeed(); 
            invalidCount++;
            document.getElementById('ibanDeadCount').innerText = invalidCount;

            const item = document.createElement('div');
            item.style.color = "orange";
            item.style.padding = "5px";
            item.style.fontSize = "11px";
            item.innerHTML = `⚠️ ${checkingIban} (Network Error)`;
            document.getElementById('resIbanInvalid').prepend(item);
        }

        const percent = ((i + 1) / total) * 100;
        if(progBar) progBar.style.width = `${percent}%`;

        await new Promise(r => setTimeout(r, 100));
    }

    stopIbanCheck();
}

function stopIbanCheck() {
    isIbanChecking = false;

    // إخفاء شريط التقدم عند التوقف
    const progCont = document.getElementById('ibanProgCont');
    if(progCont) progCont.style.display = "none";
    document.getElementById('ibanProgBar').style.width = "0%";

    const btnCheck = document.getElementById('btnIbanCheck');
    const btnStop = document.getElementById('btnIbanStop');
    const btnClear = document.getElementById('btnIbanClear');

    btnCheck.disabled = false;
    btnCheck.style.opacity = "1";
    btnCheck.style.cursor = "pointer";

    btnStop.style.display = 'none';
    btnClear.style.display = 'inline-block';
}