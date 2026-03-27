// ===== ORMEN TEKSTİL - Ana Uygulama v3 =====

document.addEventListener('DOMContentLoaded', function() {
    // === Sekme Yönetimi ===
    var tabBtns = document.querySelectorAll('.tab-btn');
    var tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var tabId = this.dataset.tab;
            tabBtns.forEach(function(b) { b.classList.remove('active'); });
            tabContents.forEach(function(c) { c.classList.remove('active'); });
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Bugünün tarihini set et
    var today = new Date().toISOString().split('T')[0];
    document.querySelectorAll('input[type="date"]').forEach(function(input) {
        if (!input.value) input.value = today;
    });

    // Döviz kuru çek
    fetchCurrency();

    // PWA Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(function() {});
    }
});

// === Tarih Formatlama (DD/MM/YYYY) ===
function formatDate(dateStr) {
    if (!dateStr) return '';
    var d = new Date(dateStr);
    return String(d.getDate()).padStart(2, '0') + '/' +
           String(d.getMonth() + 1).padStart(2, '0') + '/' +
           d.getFullYear();
}

// === Toast Bildirimi ===
function showToast(message) {
    var toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(function() {
        toast.classList.remove('show');
    }, 2500);
}

// === Clipboard ===
function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function() {
            showToast('Kopyalandı!');
        });
    } else {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('Kopyalandı!');
    }
}

// === PDF Export ===
function exportPDF(elementId, filename) {
    var element = document.getElementById(elementId);
    var deleteBtns = element.querySelectorAll('.delete-btn');
    deleteBtns.forEach(function(btn) { btn.style.display = 'none'; });

    var opt = {
        margin: 0,
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(function() {
        deleteBtns.forEach(function(btn) { btn.style.display = ''; });
        showToast('PDF indirildi!');
    });
}

// === Çeki No Oluştur ===
function generateCekiNo() {
    var sayac = parseInt(localStorage.getItem('ceki_sayac') || '215') + 1;
    localStorage.setItem('ceki_sayac', sayac.toString());
    var yil = new Date().getFullYear();
    return 'CK-' + yil + '-' + String(sayac).padStart(3, '0');
}

// === Döviz Kuru ===
function fetchCurrency() {
    var usdEl = document.getElementById('cw-usd');
    var eurEl = document.getElementById('cw-eur');

    // Önce cache'den yükle
    var cached = localStorage.getItem('currency_cache');
    if (cached) {
        try {
            var data = JSON.parse(cached);
            if (Date.now() - data.ts < 3600000) { // 1 saat
                usdEl.textContent = data.usd;
                eurEl.textContent = data.eur;
            }
        } catch(e) {}
    }

    // API'den çek (free API)
    fetch('https://api.exchangerate-api.com/v4/latest/USD')
        .then(function(r) { return r.json(); })
        .then(function(data) {
            var tryRate = data.rates.TRY;
            var eurRate = data.rates.TRY / data.rates.EUR;
            var usdStr = tryRate.toFixed(2) + '₺';
            var eurStr = eurRate.toFixed(2) + '₺';
            usdEl.textContent = usdStr;
            eurEl.textContent = eurStr;
            localStorage.setItem('currency_cache', JSON.stringify({
                usd: usdStr, eur: eurStr, ts: Date.now()
            }));
        })
        .catch(function() {
            if (!cached) {
                usdEl.textContent = '--';
                eurEl.textContent = '--';
            }
        });
}

// === Ürün Kataloğu (localStorage) ===
function getKatalog() {
    try {
        return JSON.parse(localStorage.getItem('urun_katalogu') || '[]');
    } catch(e) { return []; }
}

function saveToKatalog(urun) {
    var katalog = getKatalog();
    // Aynı ürün varsa güncelle
    var existing = katalog.findIndex(function(k) { return k.ad === urun.ad; });
    if (existing >= 0) {
        katalog[existing] = urun;
    } else {
        katalog.push(urun);
    }
    localStorage.setItem('urun_katalogu', JSON.stringify(katalog));
}

function renderKatalogSelect(selectEl) {
    var katalog = getKatalog();
    selectEl.innerHTML = '<option value="">Katalogdan Seç...</option>';
    katalog.forEach(function(urun, i) {
        var opt = document.createElement('option');
        opt.value = i;
        opt.textContent = urun.ad + (urun.renk ? ' - ' + urun.renk : '');
        selectEl.appendChild(opt);
    });
}

// === Auto-Save ===
var _autoSaveTimer = null;
function autoSave(key, data) {
    clearTimeout(_autoSaveTimer);
    _autoSaveTimer = setTimeout(function() {
        localStorage.setItem('draft_' + key, JSON.stringify(data));
        showAutoSaveIndicator();
    }, 500);
}

function loadDraft(key) {
    try {
        return JSON.parse(localStorage.getItem('draft_' + key));
    } catch(e) { return null; }
}

function clearDraft(key) {
    localStorage.removeItem('draft_' + key);
}

function showAutoSaveIndicator() {
    var ind = document.querySelector('.autosave-indicator');
    if (!ind) {
        ind = document.createElement('div');
        ind.className = 'autosave-indicator';
        ind.innerHTML = '<span class="autosave-dot"></span> Taslak kaydedildi';
        document.body.appendChild(ind);
    }
    ind.classList.add('show');
    clearTimeout(ind._timeout);
    ind._timeout = setTimeout(function() {
        ind.classList.remove('show');
    }, 2000);
}

// === QR Kod Oluştur ===
function generateQR(elementId, text) {
    var el = document.getElementById(elementId);
    if (!el) return;
    el.innerHTML = '';
    if (typeof QRCode !== 'undefined') {
        new QRCode(el, {
            text: text,
            width: 80,
            height: 80,
            colorDark: '#000',
            colorLight: '#fff',
            correctLevel: QRCode.CorrectLevel.M
        });
    }
}

// === Excel Export ===
function exportExcel(rows, filename) {
    if (typeof XLSX === 'undefined') {
        showToast('Excel kütüphanesi yüklenemedi.');
        return;
    }
    var ws = XLSX.utils.aoa_to_sheet(rows);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Çeki Listesi');

    // Sütun genişlikleri — ilk satırdan belirle
    if (rows.length > 0) {
        ws['!cols'] = rows[0].map(function(h) {
            return { wch: Math.max(String(h || '').length + 2, 12) };
        });
    }

    XLSX.writeFile(wb, filename);
    showToast('Excel indirildi!');
}
