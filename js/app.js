// ===== ORMEN TEKSTİL - Ana Uygulama v2 =====

document.addEventListener('DOMContentLoaded', function() {
    // === Sekme Yönetimi ===
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

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
    var sayac = parseInt(localStorage.getItem('ceki_sayac') || '0') + 1;
    localStorage.setItem('ceki_sayac', sayac.toString());
    var yil = new Date().getFullYear();
    return 'CK-' + yil + '-' + String(sayac).padStart(3, '0');
}
