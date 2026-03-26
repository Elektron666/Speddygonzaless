// ===== GÖRSEL KART OLUŞTURUCU v2 =====

(function() {
    var sablonSelect = document.getElementById('am-sablon');
    var arkaplanSelect = document.getElementById('am-arkaplan');
    var baslikInput = document.getElementById('am-baslik');
    var aciklamaInput = document.getElementById('am-aciklama');
    var card = document.getElementById('am-card');
    var cardBaslik = document.getElementById('am-card-baslik');
    var cardAciklama = document.getElementById('am-card-aciklama');
    var indirBtn = document.getElementById('am-indir');
    var whatsappBtn = document.getElementById('am-whatsapp');

    // Şablon verileri
    var sablonlar = {
        'bos': { baslik: '', aciklama: '' },
        'yeni-urun': {
            baslik: 'Yeni Sezon Kumaşlarımız',
            aciklama: 'En kaliteli kumaşlar uygun fiyatlarla sizlerle.\nDetaylı bilgi için iletişime geçin.'
        },
        'bayram': {
            baslik: 'Bayramınız Mübarek Olsun',
            aciklama: 'ORMEN TEKSTİL ailesi olarak\ntüm iş ortaklarımızın ve müşterilerimizin\nbayramını en içten dileklerimizle kutlarız.'
        },
        'kampanya': {
            baslik: 'Özel İndirim Fırsatı',
            aciklama: 'Seçili ürünlerde özel indirim fırsatları.\nStoklar sınırlıdır, acele edin!'
        }
    };

    // Şablon değişince formu doldur
    sablonSelect.addEventListener('change', function() {
        var s = sablonlar[this.value];
        if (s) {
            baslikInput.value = s.baslik;
            aciklamaInput.value = s.aciklama;
            updateCard();
        }
    });

    // Arka plan değişince kart sınıfını güncelle
    arkaplanSelect.addEventListener('change', updateCard);
    baslikInput.addEventListener('input', updateCard);
    aciklamaInput.addEventListener('input', updateCard);

    function updateCard() {
        // Arka plan sınıfı
        card.className = 'visual-card bg-' + arkaplanSelect.value;

        // Metin
        cardBaslik.textContent = baslikInput.value || 'Başlık Metni';
        cardAciklama.textContent = aciklamaInput.value || 'Açıklama metni buraya gelecek';
    }

    // İlk yükleme
    updateCard();

    // PNG İndir (html2canvas)
    indirBtn.addEventListener('click', function() {
        if (!baslikInput.value.trim()) {
            showToast('Lütfen bir başlık girin.');
            return;
        }

        html2canvas(card, {
            scale: 2,
            useCORS: true,
            backgroundColor: null,
            logging: false
        }).then(function(canvas) {
            var link = document.createElement('a');
            link.download = 'ORMEN_' + baslikInput.value.trim().replace(/\s+/g, '_').substring(0, 30) + '.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            showToast('Görsel indirildi!');
        });
    });

    // WhatsApp paylaş (metin olarak)
    whatsappBtn.addEventListener('click', function() {
        var text = '';
        text += '*ORMEN TEKSTİL*\n\n';
        if (baslikInput.value.trim()) {
            text += '*' + baslikInput.value.trim() + '*\n\n';
        }
        if (aciklamaInput.value.trim()) {
            text += aciklamaInput.value.trim() + '\n\n';
        }
        text += '📞 (0312) 345 63 83\n';
        text += '📱 0546 345 63 83 (WhatsApp)\n';
        text += '🌐 www.ormentekstil.com.tr';

        var encoded = encodeURIComponent(text);
        window.open('https://wa.me/?text=' + encoded, '_blank');
    });
})();
