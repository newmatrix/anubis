// ================= SUBDOMAIN SCANNER LOGIC (Quad-Source + Live Inline Checker) =================

async function scanSubdomains() {
    const input = document.getElementById('subInput').value.trim();
    const btn = document.getElementById('btnSubScan');
    const resultBox = document.getElementById('subResultList');
    const countBadge = document.getElementById('subCount');
    
    // تنظيف اسم الدومين
    let domain = input.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];

    if (!domain.includes('.')) {
        if (typeof showToast === "function") showToast("⚠️ Please enter a valid domain!");
        return;
    }

    btn.innerHTML = "Deep Scanning & Checking... 📡";
    btn.disabled = true;
    resultBox.innerHTML = '<div style="text-align:center; padding:20px; color:#aaa;">Gathering data from 4 sources & verifying status... ⏳</div>';
    countBadge.innerText = "0";

    let uniqueSubs = new Map(); 
    const proxy = "https://corsproxy.io/?";

    try {
        // 1. روابط الخدمات الأربعة
        const htUrl = `https://api.hackertarget.com/hostsearch/?q=${domain}`;
        const crtUrl = `https://crt.sh/?q=%.${domain}&output=json`;
        const rapidUrl = `https://rapiddns.io/subdomain/${domain}?full=1`;
        const otxUrl = `https://otx.alienvault.com/api/v1/indicators/domain/${domain}/passive_dns`;

        // 2. طلب البيانات بشكل متوازي
        const [htRes, crtRes, rapidRes, otxRes] = await Promise.allSettled([
            fetch(proxy + encodeURIComponent(htUrl)).then(r => r.text()),
            fetch(proxy + encodeURIComponent(crtUrl)).then(r => r.json()),
            fetch(proxy + encodeURIComponent(rapidUrl)).then(r => r.text()),
            fetch(proxy + encodeURIComponent(otxUrl)).then(r => r.json())
        ]);

        // معالجة نتائج HackerTarget
        if (htRes.status === "fulfilled" && !htRes.value.includes("error")) {
            htRes.value.split('\n').forEach(line => {
                if (line.trim()) {
                    const [sub, ip] = line.split(',');
                    uniqueSubs.set(sub.toLowerCase(), ip || "N/A");
                }
            });
        }

        // معالجة نتائج AlienVault OTX
        if (otxRes.status === "fulfilled" && otxRes.value.passive_dns) {
            otxRes.value.passive_dns.forEach(entry => {
                const sub = entry.hostname.toLowerCase();
                if (sub.endsWith(domain) && !uniqueSubs.has(sub)) {
                    uniqueSubs.set(sub, entry.address || "N/A");
                }
            });
        }

        // معالجة نتائج crt.sh
        if (crtRes.status === "fulfilled" && Array.isArray(crtRes.value)) {
            crtRes.value.forEach(entry => {
                const names = entry.name_value.split('\n');
                names.forEach(name => {
                    const sub = name.toLowerCase();
                    if (!sub.includes('*') && !uniqueSubs.has(sub)) {
                        uniqueSubs.set(sub, "DNS Lookup...");
                    }
                });
            });
        }

        // معالجة نتائج RapidDNS
        if (rapidRes.status === "fulfilled") {
            const parser = new DOMParser();
            const doc = parser.parseFromString(rapidRes.value, 'text/html');
            const rows = doc.querySelectorAll('table tbody tr');
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 2) {
                    const sub = cells[0].innerText.trim().toLowerCase();
                    const ip = cells[1].innerText.trim();
                    if (!uniqueSubs.has(sub)) uniqueSubs.set(sub, ip);
                }
            });
        }

        resultBox.innerHTML = "";
        const sortedSubs = Array.from(uniqueSubs.keys()).sort();

        if (sortedSubs.length === 0) {
            resultBox.innerHTML = '<div style="text-align:center; padding:20px; color:#ff4d4d;">❌ No subdomains found.</div>';
        } else {
            countBadge.innerText = sortedSubs.length;
            
            // 3. عرض النتائج في سطر واحد وفحص حالتها
            for (const sub of sortedSubs) {
                const ip = uniqueSubs.get(sub);
                const div = document.createElement('div');
                div.className = 'sub-item';
                
                div.innerHTML = `
                    <div class="sub-info-inline">
                        <span class="sub-name">${sub}</span>
                        <span class="sub-details">
                            <span class="sub-ip">[${ip}]</span>
                            <span class="status-check">Checking... ⏳</span>
                        </span>
                    </div>
                    <a href="http://${sub}" target="_blank" class="sub-link">OPEN ↗</a>
                `;
                resultBox.appendChild(div);

                checkLinkStatus(sub, div.querySelector('.status-check'));
            }
        }

    } catch (error) {
        console.error("Scan Error:", error);
        resultBox.innerHTML = '<div style="text-align:center; padding:20px; color:#ff4d4d;">❌ Scan failed. Check connection.</div>';
    }

    btn.innerHTML = "SCAN TARGET 🚀";
    btn.disabled = false;
}

async function checkLinkStatus(sub, statusEl) {
    const proxy = "https://corsproxy.io/?";
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); 

        const response = await fetch(proxy + encodeURIComponent(`http://${sub}`), { 
            method: 'HEAD', 
            signal: controller.signal 
        });
        
        clearTimeout(timeoutId);
        if (response.ok || response.status < 400) {
            statusEl.innerText = "LIVE ✅";
            statusEl.style.color = "#00ff88";
        } else {
            statusEl.innerText = "DEAD ❌";
            statusEl.style.color = "#ff4d4d";
        }
    } catch (e) {
        statusEl.innerText = "DEAD ❌";
        statusEl.style.color = "#ff4d4d";
    }
}

function copySubdomains() {
    const list = document.getElementById('subResultList');
    const items = list.querySelectorAll('.sub-name');
    if (items.length === 0) return;
    const text = Array.from(items).map(s => s.innerText).join('\n');
    navigator.clipboard.writeText(text).then(() => {
        if (typeof showToast === "function") showToast("✅ Subdomains list copied!");
    });
}

