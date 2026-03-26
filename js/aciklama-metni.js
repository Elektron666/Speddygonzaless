// ===== AÇIKLAMA METNİ MODÜLÜ (WhatsApp Paylaşım) =====

(function() {
    let generatedText = '';

    const urunInput = document.getElementById('am-urun');
    const tipInput = document.getElementById('am-tip');
    const ozellikInput = document.getElementById('am-ozellik');
    const renkInput = document.getElementById('am-renk');
    const enInput = document.getElementById('am-en');
    const fiyatInput = document.getElementById('am-fiyat');
    const minInput = document.getElementById('am-min');
    const notInput = document.getElementById('am-not');
    const olusturBtn = document.getElementById('am-olustur');
    const textOutput = document.getElementById('am-text-output');
    const kopyalaBtn = document.getElementById('am-kopyala');
    const whatsappBtn = document.getElementById('am-whatsapp');

    // Metin oluştur
    olusturBtn.addEventListener('click', function() {
        const urun = urunInput.value.trim();
        const tip = tipInput.value.trim();
        const ozellik = ozellikInput.value.trim();
        const renk = renkInput.value.trim();
        const en = enInput.value.trim();
        const fiyat = fiyatInput.value.trim();
        const min = minInput.value.trim();
        const not_ = notInput.value.trim();

        if (!urun) {
            urunInput.focus();
            showToast('Lütfen ürün adını girin.');
            return;
        }

        let text = '';
        text += '━━━━━━━━━━━━━━━━━━━━\n';
        text += '  *ORMEN TEKSTİL*\n';
        text += '  Yeni Ürün Tanıtımı\n';
        text += '━━━━━━━━━━━━━━━━━━━━\n\n';

        text += '🏷️ *' + urun.toUpperCase() + '*';
        if (tip) text += ' - ' + tip;
        text += '\n\n';

        if (ozellik) {
            text += '📋 *Özellikler:*\n';
            text += ozellik + '\n\n';
        }

        if (renk) {
            text += '🎨 *Renk Seçenekleri:*\n';
            text += renk + '\n\n';
        }

        if (en) {
            text += '📏 *En:* ' + en + '\n';
        }

        if (fiyat) {
            text += '💰 *Fiyat:* ' + fiyat + '\n';
        }

        if (min) {
            text += '📦 *Minimum Sipariş:* ' + min + '\n';
        }

        if (not_) {
            text += '\n⚡ ' + not_ + '\n';
        }

        text += '\n━━━━━━━━━━━━━━━━━━━━\n';
        text += '📞 0312 345 63 83\n';
        text += '📱 0546 345 63 83 (WhatsApp)\n';
        text += '🌐 www.ormentekstil.com.tr\n';
        text += '━━━━━━━━━━━━━━━━━━━━';

        generatedText = text;
        textOutput.textContent = text;
        textOutput.classList.remove('placeholder-text');
        showToast('Metin oluşturuldu!');
    });

    // Kopyala
    kopyalaBtn.addEventListener('click', function() {
        if (!generatedText) {
            showToast('Önce metin oluşturun.');
            return;
        }
        copyToClipboard(generatedText);
        this.classList.add('copied');
        this.textContent = 'Kopyalandı!';
        setTimeout(() => {
            this.classList.remove('copied');
            this.textContent = 'Metni Kopyala';
        }, 2000);
    });

    // WhatsApp paylaş
    whatsappBtn.addEventListener('click', function() {
        if (!generatedText) {
            showToast('Önce metin oluşturun.');
            return;
        }
        const encoded = encodeURIComponent(generatedText);
        window.open('https://wa.me/?text=' + encoded, '_blank');
    });
})();
