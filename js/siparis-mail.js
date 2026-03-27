// ===== SİPARİŞ MODÜLÜ v3 (Top + Metre Desteği) =====

(function() {
    var kalemler = [];

    var ustMetin = document.getElementById('sm-ust');
    var emailInput = document.getElementById('sm-email');
    var urunInput = document.getElementById('sm-urun');
    var miktarInput = document.getElementById('sm-miktar');
    var birimSelect = document.getElementById('sm-birim');
    var ekleBtn = document.getElementById('sm-ekle');
    var altMetin = document.getElementById('sm-alt');
    var kalemlerDiv = document.getElementById('sm-kalemler');
    var preview = document.getElementById('sm-preview');
    var kopyalaBtn = document.getElementById('sm-kopyala');
    var mailtoBtn = document.getElementById('sm-mailto');
    var whatsappBtn = document.getElementById('sm-whatsapp');

    // Kalem ekle
    function addItem() {
        var urun = urunInput.value.trim();
        var miktar = miktarInput.value.trim();

        if (!urun) { urunInput.focus(); return; }
        if (!miktar) { miktarInput.focus(); return; }

        kalemler.push({ urun: urun, miktar: miktar, birim: birimSelect.value });
        renderKalemler();
        renderPreview();

        urunInput.value = '';
        miktarInput.value = '';
        urunInput.focus();
    }

    ekleBtn.addEventListener('click', addItem);

    // Enter ile ekle veya sonraki inputa geç
    urunInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') miktarInput.focus();
    });
    miktarInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addItem();
    });

    // Kalem listesi render
    function renderKalemler() {
        kalemlerDiv.innerHTML = '';
        kalemler.forEach(function(kalem, index) {
            var div = document.createElement('div');
            div.className = 'siparis-kalem';
            div.innerHTML =
                '<span class="kalem-text">' + kalem.urun + ' - <strong>' + kalem.miktar + ' ' + kalem.birim + '</strong></span>' +
                '<button class="kalem-sil" data-index="' + index + '">&times;</button>';
            kalemlerDiv.appendChild(div);
        });

        // Sil butonları
        kalemlerDiv.querySelectorAll('.kalem-sil').forEach(function(btn) {
            btn.addEventListener('click', function() {
                kalemler.splice(parseInt(this.dataset.index), 1);
                renderKalemler();
                renderPreview();
            });
        });
    }

    // Mail önizleme render
    function renderPreview() {
        if (kalemler.length === 0) {
            preview.innerHTML = '<p class="placeholder-text">Sipariş kalemlerini ekleyin.</p>';
            return;
        }

        var text = generateMailText();
        preview.textContent = text;
        preview.classList.remove('placeholder-text');
    }

    // Mail metni oluştur
    function generateMailText() {
        var text = '';
        text += ustMetin.value.trim() + '\n\n';

        kalemler.forEach(function(kalem) {
            text += kalem.urun + ' - ' + kalem.miktar + ' ' + kalem.birim + '\n';
        });

        text += '\n' + altMetin.value.trim();
        return text;
    }

    // Üst/alt metin değiştiğinde güncelle
    ustMetin.addEventListener('input', renderPreview);
    altMetin.addEventListener('input', renderPreview);

    // Kopyala
    kopyalaBtn.addEventListener('click', function() {
        if (kalemler.length === 0) {
            showToast('Önce sipariş kalemlerini ekleyin.');
            return;
        }
        var text = generateMailText();
        copyToClipboard(text);
        this.classList.add('copied');
        this.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Kopyalandı!';
        var btn = this;
        setTimeout(function() {
            btn.classList.remove('copied');
            btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Kopyala';
        }, 2000);
    });

    // Mail gönder (mailto)
    mailtoBtn.addEventListener('click', function() {
        if (kalemler.length === 0) {
            showToast('Önce sipariş kalemlerini ekleyin.');
            return;
        }
        var email = emailInput.value.trim();
        var subject = encodeURIComponent('ORMEN TEKSTİL - Sipariş');
        var body = encodeURIComponent(generateMailText());

        if (email) {
            window.location.href = 'mailto:' + email + '?subject=' + subject + '&body=' + body;
        } else {
            window.location.href = 'mailto:?subject=' + subject + '&body=' + body;
        }
    });

    // WhatsApp gönder
    whatsappBtn.addEventListener('click', function() {
        if (kalemler.length === 0) {
            showToast('Önce sipariş kalemlerini ekleyin.');
            return;
        }
        var text = generateMailText();
        var encoded = encodeURIComponent(text);
        window.open('https://wa.me/?text=' + encoded, '_blank');
    });
})();
