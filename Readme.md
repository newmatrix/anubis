# 💀 ANUBIS TOOLS v1.0

![Version](https://img.shields.io/badge/Version-1.0-ff3366?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-00ff88?style=flat-square)
![Platform](https://img.shields.io/badge/Platform-Web-f1c40f?style=flat-square)

**ANUBIS TOOLS** is a comprehensive, sleek, dark-themed web toolkit designed for developers, testers, and security researchers. It provides a suite of tools ranging from payment system testing to OSINT data gathering, all within a fast, single-page application (SPA).

---

## ✨ Features & Modules

### 💳 1. Card System
* **Card Generator:** Generate valid test credit card numbers using the standard Luhn Algorithm or Raw format. Supports custom BINs, random expirations, and CVVs.
* **Stripe Checker:** Bulk check the status of generated cards (Live, Dead, Unknown) utilizing external APIs with built-in Rate Limit handling and smart delays.
* **BIN Lookup:** Instantly retrieve bank name, brand, card type, level, and country details for any given 6-digit BIN.

### 🏦 2. IBAN Tools
* **IBAN Generator:** Generate mathematically valid IBANs for multiple Top Tier countries (DE, NL, FR, etc.) based on ISO 7064 Mod 97-10 algorithm.
* **IBAN Calculator:** Generate a valid IBAN using a specific target country and Bank Code (BLZ).
* **IBAN Validator:** Bulk validate IBANs and extract Bank Code, BIC, and City information.
* **Visual Analyzer:** A color-coded breakdown of any IBAN structure (Country Code, Check Digits, Bank Code, Account Number).

### 👤 3. Fake Identity Generator
* Generate realistic, random user identities including Full Name, Date of Birth, Address, ZIP Code, and correctly formatted Phone Numbers.
* Supports over 12 regions including US, GB, EG, SA, DE, FR, CA, AU, IT, ES, BR, and TR.

### 🌐 4. IP Scanner & Tools
* **My Digital Identity:** Instantly view your current IP address, Geolocation, ISP, and Timezone.
* **DNS Leak Test:** Checks if your DNS location matches your IP location to ensure privacy.
* **Target IP Lookup:** Scan any IPv4/IPv6 address to get detailed OSINT data (Location, ASN, ISP) along with an embedded OpenStreetMap view.

### 🔍 5. Subdomain Enumeration
* Scan and discover subdomains for any target domain.
* Verifies the live/dead status of discovered subdomains.
* *(Note: Relies on Certificate Transparency Logs and external APIs).*

---

## 🛠️ Technologies & APIs Used

* **Frontend:** Vanilla HTML5, CSS3, JavaScript (No heavy frameworks used).
* **UI/UX:** Custom Dark Theme (`color-scheme: dark`), Glassmorphism panels, CSS Animations, and interactive Toast notifications.
* **External APIs & Services:**
    * `api.chkr.cc` (Card validation)
    * `lookup.binlist.net` (BIN information)
    * `openiban.com` (IBAN validation & calculation)
    * `api.ipify.org` & `ipwho.is` (IP Geolocation)
    * `edns.ip-api.com` (DNS Leak detection)
    * `api.allorigins.win` & `corsproxy.io` (CORS bypass proxies)

---

## 🚀 Installation & Usage

Since this is a client-side only application, no backend server setup is required.

1.  Clone the repository:
    ```bash
    git clone [https://github.com/yourusername/anubis-tools.git](https://github.com/yourusername/anubis-tools.git)
    ```
2.  Navigate to the project folder.
3.  Open `index.html` directly in any modern web browser.
4.  *Alternatively*, you can host it directly on **GitHub Pages**, **Netlify**, or **Vercel**.

---

## ⚠️ Legal & Ethical Disclaimer

**For Educational and Testing Purposes Only.**

This tool was created to assist developers in testing payment gateways, validating inputs, and conducting basic network research. 
* The card and IBAN generators create **mathematically valid but entirely fake** numbers. They are not linked to any real bank accounts and cannot be used for actual financial transactions.
* The author assumes no liability and is not responsible for any misuse or damage caused by this program. Users must adhere to all applicable local and international laws while using this tool.

---
*Powered by **Hesham Taha*** 💀