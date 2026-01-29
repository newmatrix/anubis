// قاعدة بيانات ذكية (أسماء، مدن، أرقام هواتف صحيحة)
const fakeData = {
    // === الدول الأصلية ===
    "US": {
        male: ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph"],
        female: ["Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica"],
        last: ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis"],
        cities: [
            { name: "New York", zip: "10001", state: "NY" }, { name: "Los Angeles", zip: "90001", state: "CA" },
            { name: "Chicago", zip: "60601", state: "IL" }, { name: "Houston", zip: "77001", state: "TX" },
            { name: "Miami", zip: "33101", state: "FL" }
        ],
        streets: ["Main St", "Broadway", "Park Ave", "Oak St", "Pine St", "Maple Dr"],
        phone: "+1 (xxx) xxx-xxxx"
    },
    "GB": {
        male: ["Oliver", "George", "Harry", "Noah", "Jack", "Leo", "Arthur", "Thomas"],
        female: ["Olivia", "Amelia", "Isla", "Ava", "Mia", "Isabella", "Sophia", "Grace"],
        last: ["Smith", "Jones", "Taylor", "Brown", "Wilson", "Evans", "Thomas", "Roberts"],
        cities: [
            { name: "London", zip: "SW1A 1AA", state: "England" }, { name: "Manchester", zip: "M1 1AD", state: "England" },
            { name: "Birmingham", zip: "B1 1AA", state: "England" }, { name: "Glasgow", zip: "G1 1QX", state: "Scotland" }
        ],
        streets: ["High Street", "Station Road", "London Road", "Victoria Road", "Church St"],
        phone: "+44 7xxx xxxxxx"
    },
    "EG": {
        male: ["Ahmed", "Mohamed", "Mahmoud", "Ali", "Omar", "Hassan", "Youssef", "Ibrahim"],
        female: ["Fatma", "Mariam", "Sara", "Nour", "Heba", "Aya", "Mona", "Salma"],
        last: ["Hassan", "Ali", "Ibrahim", "Mostafa", "Mohamed", "Ahmed", "Mahmoud", "Saad"],
        cities: [
            { name: "Cairo", zip: "11511", state: "Cairo" }, { name: "Giza", zip: "12613", state: "Giza" },
            { name: "Alexandria", zip: "21523", state: "Alexandria" }, { name: "Mansoura", zip: "35511", state: "Dakahlia" }
        ],
        streets: ["Tahrir St", "Ramses St", "Pyramids St", "Nile Corniche", "Galaa St"],
        phone: "+20 1xxxxxxxxx"
    },
    "SA": {
        male: ["Mohammed", "Abdullah", "Fahad", "Saud", "Khalid", "Abdulrahman", "Ali", "Salman"],
        female: ["Noura", "Sara", "Reem", "Maha", "Fatima", "Aisha", "Latifa", "Hessa"],
        last: ["Al-Saud", "Al-Otaibi", "Al-Qahtani", "Al-Harbi", "Al-Zahrani", "Al-Ghamdi", "Al-Dossari"],
        cities: [
            { name: "Riyadh", zip: "11564", state: "Riyadh" }, { name: "Jeddah", zip: "21442", state: "Makkah" },
            { name: "Dammam", zip: "31433", state: "Eastern" }, { name: "Mecca", zip: "21955", state: "Makkah" }
        ],
        streets: ["King Fahd Rd", "Olaya St", "Tahlia St", "King Abdullah Rd", "Prince Sultan St"],
        phone: "+966 5xxxxxxxx"
    },
    "DE": {
        male: ["Maximilian", "Alexander", "Paul", "Elias", "Ben", "Noah", "Leon", "Louis"],
        female: ["Maria", "Sophie", "Maria", "Anna", "Laura", "Leonie", "Lena", "Emilia"],
        last: ["Müller", "Schmidt", "Schneider", "Fischer", "Weber", "Meyer", "Wagner"],
        cities: [
            { name: "Berlin", zip: "10115", state: "Berlin" }, { name: "Munich", zip: "80331", state: "Bavaria" },
            { name: "Hamburg", zip: "20095", state: "Hamburg" }, { name: "Frankfurt", zip: "60311", state: "Hesse" }
        ],
        streets: ["Hauptstraße", "Bahnhofstraße", "Dorfstraße", "Schulstraße", "Gartenstraße"],
        phone: "+49 1xxxxxxxxx"
    },
    "FR": {
        male: ["Gabriel", "Leo", "Raphael", "Arthur", "Louis", "Lucas", "Adam", "Hugo"],
        female: ["Emma", "Jade", "Louise", "Alice", "Chloé", "Léa", "Manon", "Rose"],
        last: ["Martin", "Bernard", "Thomas", "Petit", "Robert", "Richard", "Durand"],
        cities: [
            { name: "Paris", zip: "75001", state: "Île-de-France" }, { name: "Marseille", zip: "13001", state: "Provence" },
            { name: "Lyon", zip: "69001", state: "Auvergne" }, { name: "Toulouse", zip: "31000", state: "Occitanie" }
        ],
        streets: ["Rue de la Paix", "Avenue des Champs-Élysées", "Rue Victor Hugo", "Rue de Rivoli"],
        phone: "+33 6xxxxxxxx"
    },

    // === الدول الجديدة المضافة ===
    "CA": { // كندا
        male: ["Liam", "Noah", "William", "Lucas", "Benjamin", "Oliver", "Leo", "Jack"],
        female: ["Olivia", "Emma", "Charlotte", "Amelia", "Ava", "Sophia", "Chloe", "Mia"],
        last: ["Smith", "Brown", "Tremblay", "Martin", "Roy", "Wilson", "Lee", "Gagnon"],
        cities: [
            { name: "Toronto", zip: "M5H 2N2", state: "ON" }, { name: "Montreal", zip: "H3B 1A7", state: "QC" },
            { name: "Vancouver", zip: "V6C 2R6", state: "BC" }, { name: "Calgary", zip: "T2P 1J9", state: "AB" }
        ],
        streets: ["Yonge St", "Queen St", "Broadway", "Main St", "King St"],
        phone: "+1 (xxx) xxx-xxxx"
    },
    "AU": { // أستراليا
        male: ["Oliver", "Noah", "Jack", "William", "Leo", "Lucas", "Thomas", "Henry"],
        female: ["Charlotte", "Olivia", "Amelia", "Isla", "Mia", "Ava", "Grace", "Willow"],
        last: ["Smith", "Jones", "Williams", "Brown", "Wilson", "Taylor", "Nguyen", "White"],
        cities: [
            { name: "Sydney", zip: "2000", state: "NSW" }, { name: "Melbourne", zip: "3000", state: "VIC" },
            { name: "Brisbane", zip: "4000", state: "QLD" }, { name: "Perth", zip: "6000", state: "WA" }
        ],
        streets: ["George St", "Pitt St", "Collins St", "Bourke St", "Adelaide St"],
        phone: "+61 4xx xxx xxx"
    },
    "IT": { // إيطاليا
        male: ["Leonardo", "Francesco", "Alessandro", "Lorenzo", "Mattia", "Tommaso", "Gabriele", "Andrea"],
        female: ["Sofia", "Giulia", "Aurora", "Alice", "Ginevra", "Emma", "Giorgia", "Beatrice"],
        last: ["Rossi", "Russo", "Ferrari", "Esposito", "Bianchi", "Romano", "Colombo", "Ricci"],
        cities: [
            { name: "Rome", zip: "00184", state: "Lazio" }, { name: "Milan", zip: "20121", state: "Lombardy" },
            { name: "Naples", zip: "80132", state: "Campania" }, { name: "Turin", zip: "10121", state: "Piedmont" }
        ],
        streets: ["Via Roma", "Corso Vittorio Emanuele", "Via Garibaldi", "Via Dante", "Via Mazzini"],
        phone: "+39 3xx xxxxxxx"
    },
    "ES": { // إسبانيا
        male: ["Hugo", "Mateo", "Martin", "Lucas", "Leo", "Daniel", "Alejandro", "Manuel"],
        female: ["Lucia", "Sofia", "Martina", "Maria", "Julia", "Paula", "Valeria", "Daniela"],
        last: ["Garcia", "Rodriguez", "Gonzalez", "Fernandez", "Lopez", "Martinez", "Sanchez", "Perez"],
        cities: [
            { name: "Madrid", zip: "28001", state: "Madrid" }, { name: "Barcelona", zip: "08001", state: "Catalonia" },
            { name: "Valencia", zip: "46001", state: "Valencia" }, { name: "Seville", zip: "41001", state: "Andalusia" }
        ],
        streets: ["Gran Vía", "Calle Mayor", "La Rambla", "Paseo de la Castellana", "Calle Alcala"],
        phone: "+34 6xx xxx xxx"
    },
    "BR": { // البرازيل
        male: ["Miguel", "Arthur", "Heitor", "Bernardo", "Davi", "Théo", "Lorenzo", "Gabriel"],
        female: ["Alice", "Sophia", "Helena", "Valentina", "Laura", "Isabella", "Manuela", "Julia"],
        last: ["Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira"],
        cities: [
            { name: "Sao Paulo", zip: "01000-000", state: "SP" }, { name: "Rio de Janeiro", zip: "20000-000", state: "RJ" },
            { name: "Brasilia", zip: "70000-000", state: "DF" }, { name: "Salvador", zip: "40000-000", state: "BA" }
        ],
        streets: ["Avenida Paulista", "Rua Augusta", "Avenida Atlântica", "Rua Oscar Freire"],
        phone: "+55 (xx) 9xxxx-xxxx"
    },
    "TR": { // تركيا
        male: ["Yusuf", "Eymen", "Miraç", "Ömer", "Mustafa", "Ahmet", "Mehmet", "Kerem"],
        female: ["Zeynep", "Elif", "Defne", "Hiranur", "Ebrar", "Eylül", "Miray", "Zehra"],
        last: ["Yilmaz", "Kaya", "Demir", "Çelik", "Şahin", "Yildiz", "Yildirim", "Öztürk"],
        cities: [
            { name: "Istanbul", zip: "34000", state: "Marmara" }, { name: "Ankara", zip: "06000", state: "Central Anatolia" },
            { name: "Izmir", zip: "35000", state: "Aegean" }, { name: "Bursa", zip: "16000", state: "Marmara" }
        ],
        streets: ["Istiklal Cd", "Bagdat Cd", "Ataturk Blv", "Ismet Inonu Blv", "Cumhuriyet Cd"],
        phone: "+90 5xx xxx xx xx"
    }
};

function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateIdentity() {
    const countryCode = document.getElementById('idCountry').value;
    const genderSelect = document.getElementById('idGender').value;
    const ageSelect = document.getElementById('idAge').value;
    
    const data = fakeData[countryCode];
    
    // 1. Gender Logic
    let gender = genderSelect;
    if (gender === 'random') {
        gender = Math.random() < 0.5 ? 'male' : 'female';
    }
    
    // 2. Name Generation
    const firstName = getRandom(data[gender]);
    const lastName = getRandom(data.last);
    
    // 3. Address & Zip
    const cityObj = getRandom(data.cities);
    const street = getRandom(data.streets);
    const houseNum = Math.floor(Math.random() * 100) + 1;
    
    // 4. Phone Generation (Correct Formats)
    let phone = "";
    if (countryCode === "EG") {
        const prefixes = ["10", "11", "12", "15"];
        phone = "+20 " + getRandom(prefixes);
        for(let i=0; i<8; i++) phone += Math.floor(Math.random()*10);
    } else {
        phone = data.phone;
        while(phone.includes('x')) {
            phone = phone.replace('x', Math.floor(Math.random() * 10));
        }
    }

    // 5. Age & DOB Generation
    let minAge = 18, maxAge = 60;
    if (ageSelect !== 'random') {
        const parts = ageSelect.split('-');
        if (parts.length === 2) {
            minAge = parseInt(parts[0]);
            maxAge = parseInt(parts[1]);
        } else {
            minAge = 50; maxAge = 80; // 50+
        }
    }
    const age = Math.floor(Math.random() * (maxAge - minAge + 1)) + minAge;
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - age;
    const birthMonth = Math.floor(Math.random() * 12) + 1;
    const birthDay = Math.floor(Math.random() * 28) + 1;
    const dob = `${birthYear}-${String(birthMonth).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`;

    // 6. Display Results
    document.getElementById('res_name').innerText = `${firstName} ${lastName}`;
    document.getElementById('res_dob').innerText = `${dob} (${age} y.o)`;
    document.getElementById('res_phone').innerText = phone;
    document.getElementById('res_address').innerText = `${houseNum} ${street}, ${cityObj.name}`;
    document.getElementById('res_zip').innerText = cityObj.zip;
    document.getElementById('res_city').innerText = cityObj.name;

    // Show Results Box
    document.getElementById('idEmptyState').style.display = 'none';
    document.getElementById('idResultBox').style.display = 'block';
}