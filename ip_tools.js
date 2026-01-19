// ================= IP SCANNER LOGIC (Clean Toasts - No Glow) =================

// 1. دالة عرض الإشعارات
function showIpToast(message) {
    const toast = document.getElementById("toast");
    if (toast) {
        toast.style.border = "1px solid #00A1BA"; 
        toast.style.boxShadow = "none"; 
    }
    if (typeof showToast === "function") {
        showToast(message);
    } else {
        alert(message);
    }
}

// دالة البدء
function initIpTab() {
    fetchMyIpInfo();
}

// 2. جلب بيانات المستخدم
// 1. جلب بيانات المستخدم
async function fetchMyIpInfo() {
    const ipEl = document.getElementById('my_ip');
    const utcBadge = document.getElementById('my_tz_utc');
    
    ipEl.innerText = "Loading...";
    ipEl.style.color = "#fff";
    document.getElementById('my_flag').innerText = "🏳️";
    document.getElementById('my_country').innerText = "---";
    document.getElementById('my_region').innerText = "---";
    document.getElementById('my_org').innerText = "---";
    document.getElementById('my_tz_id').innerText = "---";
    utcBadge.innerText = "UTC";
    utcBadge.style.backgroundColor = "var(--primary)"; // إعادة اللون للافتراضي مؤقتاً

    try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        const myIp = ipData.ip;

        const detailsResponse = await fetch(`https://corsproxy.io/?https://ipwho.is/${myIp}`);
        const data = await detailsResponse.json();

        if (!data.success) throw new Error(data.message || "Failed to fetch data");

        ipEl.innerText = data.ip;
        document.getElementById('my_flag').innerText = data.flag ? data.flag.emoji : "🏳️";
        document.getElementById('my_country').innerText = data.country || "N/A";
        document.getElementById('my_region').innerText = data.region || "N/A";
        document.getElementById('my_org').innerText = data.connection.org || data.connection.isp || "N/A";
        document.getElementById('my_tz_id').innerText = data.timezone.id || "N/A";
        
        // عرض التوقيت
        utcBadge.innerText = "UTC " + (data.timezone.utc || "");

        // ✅ كود كشف الـ VPN عن طريق مقارنة التوقيت
        // 1. نجيب فرق التوقيت المحلي بالجهاز (بالثواني)
        // getTimezoneOffset بترجع الفرق بالدقائق (إشارة معكوسة)، بنضرب في -60 عشان نحولها ثواني ونعدل الإشارة
        const systemOffset = -(new Date().getTimezoneOffset() * 60);
        
        // 2. نجيب فرق توقيت الـ IP من الـ API
        const apiOffset = data.timezone.offset; // القيمة دي بتيجي بالثواني جاهزة من ipwho.is

        // 3. المقارنة
        if (apiOffset === systemOffset) {
            // ✅ الوقت متطابق (أمان)
            utcBadge.style.backgroundColor = "#009C38"; 
        } else {
            // ❌ الوقت مختلف (احتمال VPN)
            utcBadge.style.backgroundColor = "#ff4d4d"; 
        }

    } catch (error) {
        console.error("My IP Error:", error);
        ipEl.innerText = "Error!";
        ipEl.style.color = "#ff4d4d";
    }
}

// 3. البحث عن IP + خريطة OpenStreetMap
async function lookupTargetIp() {
    const input = document.getElementById('targetIpInput').value.trim();
    const resultBox = document.getElementById('scanResultContent');
    const emptyState = document.getElementById('scanEmptyState');
    const mapContainer = document.getElementById('mapContainer');
    const btn = document.getElementById('btnIpSearch');

    if (!input) {
        showIpToast("⚠️ Please enter an IP address!");
        return;
    }

    btn.innerText = "Scanning... 📡";
    btn.disabled = true;
    resultBox.style.display = 'none';
    mapContainer.style.display = 'none';

    try {
        const response = await fetch(`https://corsproxy.io/?https://ipwho.is/${input}`);
        const data = await response.json();

        btn.innerText = "SCAN TARGET 🚀";
        btn.disabled = false;

        if (!data.success) {
            showIpToast("❌ API Error: " + (data.message || "Invalid IP"));
            emptyState.style.display = 'flex';
            return;
        }

        // --- تعبئة النتائج ---
        
        // ✅ إضافة العلم بجانب الـ IP
        document.getElementById('res_ip').innerText = `${data.flag ? data.flag.emoji : ""} ${data.ip}`;
        
        document.getElementById('res_type').innerText = data.type || "IPv4";
        document.getElementById('res_continent').innerText = data.continent || "N/A";
        document.getElementById('res_country').innerText = data.country || "N/A";
        document.getElementById('res_region').innerText = data.region || "N/A";
        // ❌ تم إزالة الـ City
        document.getElementById('res_postal').innerText = data.postal || "N/A";
        document.getElementById('res_org').innerText = data.connection.org || "N/A";
        document.getElementById('res_isp').innerText = data.connection.isp || "N/A";
        document.getElementById('res_domain').innerText = data.connection.domain || "N/A";

        // --- خريطة OpenStreetMap ---
        const lat = parseFloat(data.latitude);
        const lon = parseFloat(data.longitude);
        
        const delta = 0.1; 
        const bbox = `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`;
        const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
        
        document.getElementById('ipMapFrame').src = mapUrl;

        emptyState.style.display = 'none';
        resultBox.style.display = 'block';
        mapContainer.style.display = 'block';

    } catch (error) {
        console.error("Search Error:", error);
        btn.innerText = "SCAN TARGET 🚀";
        btn.disabled = false;
        
        showIpToast("⚠️ Network Error! Please check your connection.");
        emptyState.style.display = 'flex';
    }
}