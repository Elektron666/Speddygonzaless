// ===== SİPARİŞ MAİL MODÜLÜ =====

(function() {
    let kalemler = [];
    let generatedMail = '';

    const aliciInput = document.getElementById('sm-alici');
    const emailInput = document.getElementById('sm-email');
    const teslimInput = document.getElementById('sm-teslim');
    const odemeSelect = document.getElementById('sm-odeme');
    const notInput = document.getElementById('sm-not');

    const urunInput = document.getElementById('sm-urun');
    const renkInput = document.getElementById('sm-renk');
    const miktarInput = document.getElementById('sm-miktar');
    const fiyatInput = document.getElementById('sm-fiyat');
    const ekleBtn = document.getElementById('sm-ekle');

    const textOutput = document.getElementById('sm-text-output');
    const kopyalaBtn = document.getElementById('sm-kopyala');
    const mailtoBtn = document.getElementById('sm-mailto');

    // Sipariş kalemi ekle
    function addItem() {
        const urun = urunInput.value.trim().toUpperCase();
        const renk = renkInput.value.trim();
        const miktar = parseFloat(miktarInput.value) || 0;
        const fiyat = parseFloat(fiyatInput.value) || 0;

        if (!urun) {
            urunInput.focus();
            return;
        }
        if (miktar <= 0) {
            miktarInput.focus();
            return;
        }

        kalemler.push({
            urun: urun,
            renk: renk,
            miktar: miktar,
            fiyat: fiyat,
            toplam: miktar * fiyat
        });

        renderMail();

        urunInput.value = '';
        renkInput.value = '';
        miktarInput.value = '';
        fiyatInput.value = '';
        urunInput.focus();
    }

    ekleBtn.addEventListener('click', addItem);
    fiyatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addItem();
    });

    // Mail metnini oluştur ve göster
    function renderMail() {
        const alici = aliciInput.value.trim() || '[Firma Adı]';
        const teslim = teslimInput.value ? formatDate(teslimInput.value) : '[Tarih]';
        const odeme = odemeSelect.value;
        const not_ = notInput.value.trim();

        let mail = '';
        mail += 'Sayın ' + alici + ' Yetkilileri,\n\n';
        mail += 'Aşağıdaki siparişimizi bilgilerinize sunarız:\n\n';
        mail += '─────────────────────────────────\n';
        mail += 'SİPARİŞ DETAYLARI\n';
        mail += '─────────────────────────────────\n\n';

        let genelToplam = 0;

        kalemler.forEach((kalem, index) => {
            mail += (index + 1) + '. ' + kalem.urun;
            if (kalem.renk) mail += ' (' + kalem.renk + ')';
            mail += '\n';
            mail += '   Miktar: ' + kalem.miktar.toFixed(2) + ' metre/kg\n';
            if (kalem.fiyat > 0) {
                mail += '   Birim Fiyat: $' + kalem.fiyat.toFixed(2) + '\n';
                mail += '   Toplam: $' + kalem.toplam.toFixed(2) + '\n';
            }
            mail += '\n';
            genelToplam += kalem.toplam;
        });

        if (genelToplam > 0) {
            mail += '─────────────────────────────────\n';
            mail += 'GENEL TOPLAM: $' + genelToplam.toFixed(2) + '\n';
            mail += '─────────────────────────────────\n\n';
        }

        mail += 'Teslim Tarihi: ' + teslim + '\n';
        mail += 'Ödeme Koşulu: ' + odeme + '\n';

        if (not_) {
            mail += '\nNot: ' + not_ + '\n';
        }

        mail += '\nSiparişimizin onaylanmasını rica ederiz.\n\n';
        mail += 'Saygılarımızla,\n';
        mail += 'ORMEN TEKSTİL\n';
        mail += 'T: (0312) 345 63 83\n';
        mail += 'info@ormentekstil.com.tr\n';
        mail += 'www.ormentekstil.com.tr';

        generatedMail = mail;
        textOutput.textContent = mail;
        textOutput.classList.remove('placeholder-text');
    }

    // Input değişikliklerinde de güncelle
    [aliciInput, teslimInput, odemeSelect, notInput].forEach(el => {
        el.addEventListener('input', function() {
            if (kalemler.length > 0) renderMail();
        });
        el.addEventListener('change', function() {
            if (kalemler.length > 0) renderMail();
        });
    });

    // Kopyala
    kopyalaBtn.addEventListener('click', function() {
        if (!generatedMail) {
            showToast('Önce sipariş kalemlerini ekleyin.');
            return;
        }
        copyToClipboard(generatedMail);
        this.classList.add('copied');
        this.textContent = 'Kopyalandı!';
        setTimeout(() => {
            this.classList.remove('copied');
            this.textContent = 'Maili Kopyala';
        }, 2000);
    });

    // Mailto
    mailtoBtn.addEventListener('click', function() {
        if (!generatedMail) {
            showToast('Önce sipariş kalemlerini ekleyin.');
            return;
        }
        const email = emailInput.value.trim();
        const alici = aliciInput.value.trim() || 'Firma';
        const subject = encodeURIComponent('ORMEN TEKSTİL - Sipariş');
        const body = encodeURIComponent(generatedMail);

        if (email) {
            window.location.href = 'mailto:' + email + '?subject=' + subject + '&body=' + body;
        } else {
            window.location.href = 'mailto:?subject=' + subject + '&body=' + body;
        }
    });
})();
