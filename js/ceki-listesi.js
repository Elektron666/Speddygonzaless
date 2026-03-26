// ===== ÇEKİ LİSTESİ MODÜLÜ v3 =====

(function() {
    var kalemler = [];

    // Form elemanları
    var cekiNoInput = document.getElementById('cl-ceki-no');
    var tarihInput = document.getElementById('cl-tarih');
    var irsaliyeInput = document.getElementById('cl-irsaliye');
    var sevkTipiSelect = document.getElementById('cl-sevk-tipi');
    var plakaInput = document.getElementById('cl-plaka');
    var soforInput = document.getElementById('cl-sofor');
    var aliciInput = document.getElementById('cl-alici');
    var yetkiliInput = document.getElementById('cl-yetkili');
    var adresInput = document.getElementById('cl-adres');
    var sehirInput = document.getElementById('cl-sehir');
    var telefonInput = document.getElementById('cl-telefon');
    var urunInput = document.getElementById('cl-urun');
    var renkInput = document.getElementById('cl-renk');
    var partiInput = document.getElementById('cl-parti');
    var topInput = document.getElementById('cl-top');
    var metreInput = document.getElementById('cl-metre');
    var brutInput = document.getElementById('cl-brut');
    var netInput = document.getElementById('cl-net');
    var ekleBtn = document.getElementById('cl-ekle');
    var notlarTextarea = document.getElementById('cl-notlar');

    // Katalog
    var katalogSelect = document.getElementById('cl-katalog');
    var katalogKaydetBtn = document.getElementById('cl-katalog-kaydet');

    // Tablo
    var tbody = document.getElementById('cl-tbody');
    var countBadge = document.getElementById('cl-count');
    var totalTop = document.getElementById('cl-total-top');
    var totalMetre = document.getElementById('cl-total-metre');
    var totalBrut = document.getElementById('cl-total-brut');
    var totalNet = document.getElementById('cl-total-net');

    // Belge display
    var cekiNoDisplay = document.getElementById('cl-ceki-no-display');
    var tarihDisplay = document.getElementById('cl-tarih-display');
    var irsaliyeDisplay = document.getElementById('cl-irsaliye-display');
    var aliciDisplay = document.getElementById('cl-alici-display');
    var yetkiliDisplay = document.getElementById('cl-yetkili-display');
    var adresDisplay = document.getElementById('cl-adres-display');
    var sehirDisplay = document.getElementById('cl-sehir-display');
    var telefonDisplay = document.getElementById('cl-telefon-display');
    var sevkDisplay = document.getElementById('cl-sevk-display');
    var plakaDisplay = document.getElementById('cl-plaka-display');
    var soforDisplay = document.getElementById('cl-sofor-display');
    var docTbody = document.getElementById('cl-doc-tbody');
    var docTotalTop = document.getElementById('cl-doc-total-top');
    var docTotalMetre = document.getElementById('cl-doc-total-metre');
    var docTotalBrut = document.getElementById('cl-doc-total-brut');
    var docTotalNet = document.getElementById('cl-doc-total-net');
    var docNotlar = document.getElementById('cl-doc-notlar');
    var docNotlarText = document.getElementById('cl-doc-notlar-text');

    // Butonlar
    var pdfBtn = document.getElementById('cl-pdf');
    var yazdirBtn = document.getElementById('cl-yazdir');
    var temizleBtn = document.getElementById('cl-temizle');
    var whatsappBtn = document.getElementById('cl-whatsapp');
    var excelBtn = document.getElementById('cl-excel');

    // === Init ===
    // Taslak yükle
    var draft = loadDraft('ceki');
    if (draft) {
        cekiNoInput.value = draft.cekiNo || generateCekiNo();
        if (draft.irsaliye) irsaliyeInput.value = draft.irsaliye;
        if (draft.plaka) plakaInput.value = draft.plaka;
        if (draft.sofor) soforInput.value = draft.sofor;
        if (draft.sevkTipi) sevkTipiSelect.value = draft.sevkTipi;
        if (draft.alici) aliciInput.value = draft.alici;
        if (draft.yetkili) yetkiliInput.value = draft.yetkili;
        if (draft.adres) adresInput.value = draft.adres;
        if (draft.sehir) sehirInput.value = draft.sehir;
        if (draft.telefon) telefonInput.value = draft.telefon;
        if (draft.notlar) notlarTextarea.value = draft.notlar;
        if (draft.kalemler && draft.kalemler.length > 0) {
            kalemler = draft.kalemler;
        }
    } else {
        cekiNoInput.value = generateCekiNo();
    }

    // Katalog dropdown doldur
    renderKatalogSelect(katalogSelect);

    // === Auto-Save ===
    function triggerAutoSave() {
        autoSave('ceki', {
            cekiNo: cekiNoInput.value,
            irsaliye: irsaliyeInput.value,
            sevkTipi: sevkTipiSelect.value,
            plaka: plakaInput.value,
            sofor: soforInput.value,
            alici: aliciInput.value,
            yetkili: yetkiliInput.value,
            adres: adresInput.value,
            sehir: sehirInput.value,
            telefon: telefonInput.value,
            notlar: notlarTextarea.value,
            kalemler: kalemler
        });
    }

    // === Display Güncelle ===
    function updateDisplays() {
        cekiNoDisplay.textContent = cekiNoInput.value;
        tarihDisplay.textContent = formatDate(tarihInput.value);
        irsaliyeDisplay.textContent = irsaliyeInput.value || '-';
        aliciDisplay.textContent = aliciInput.value || '-';
        yetkiliDisplay.textContent = yetkiliInput.value ? 'Yetk: ' + yetkiliInput.value : '';
        adresDisplay.textContent = adresInput.value || '';
        sehirDisplay.textContent = sehirInput.value || '';
        telefonDisplay.textContent = telefonInput.value ? 'T: ' + telefonInput.value : '';
        sevkDisplay.textContent = sevkTipiSelect.value;
        plakaDisplay.textContent = plakaInput.value || '-';
        soforDisplay.textContent = soforInput.value || '-';

        var notlar = notlarTextarea.value.trim();
        if (notlar) {
            docNotlar.style.display = 'block';
            docNotlarText.textContent = notlar;
        } else {
            docNotlar.style.display = 'none';
        }

        // QR kod güncelle
        var qrText = 'ORMEN-' + cekiNoInput.value + '|' + formatDate(tarihInput.value) + '|' + (aliciInput.value || '');
        generateQR('cl-qr-code', qrText);

        triggerAutoSave();
    }

    // Tüm input'lara dinleyici
    var allInputs = [tarihInput, irsaliyeInput, sevkTipiSelect, plakaInput, soforInput,
                     aliciInput, yetkiliInput, adresInput, sehirInput, telefonInput, notlarTextarea];
    allInputs.forEach(function(el) {
        el.addEventListener('input', updateDisplays);
        el.addEventListener('change', updateDisplays);
    });

    // === Katalog: Seçim ===
    katalogSelect.addEventListener('change', function() {
        if (this.value === '') return;
        var katalog = getKatalog();
        var urun = katalog[parseInt(this.value)];
        if (urun) {
            urunInput.value = urun.ad || '';
            renkInput.value = urun.renk || '';
            partiInput.value = urun.parti || '';
            if (urun.brut) brutInput.value = urun.brut;
            if (urun.net) netInput.value = urun.net;
            topInput.focus();
        }
        this.value = '';
    });

    // === Katalog: Kaydet ===
    katalogKaydetBtn.addEventListener('click', function() {
        var ad = urunInput.value.trim().toUpperCase();
        if (!ad) { showToast('Önce ürün adı girin.'); urunInput.focus(); return; }
        saveToKatalog({
            ad: ad,
            renk: renkInput.value.trim(),
            parti: partiInput.value.trim(),
            brut: brutInput.value || '',
            net: netInput.value || ''
        });
        renderKatalogSelect(katalogSelect);
        showToast(ad + ' kataloğa kaydedildi!');
    });

    // === Ürün Ekle ===
    function addItem() {
        var urunAdi = urunInput.value.trim().toUpperCase();
        if (!urunAdi) { urunInput.focus(); return; }

        kalemler.push({
            ad: urunAdi,
            renk: renkInput.value.trim(),
            parti: partiInput.value.trim(),
            top: parseInt(topInput.value) || 0,
            metre: parseFloat(metreInput.value) || 0,
            brut: parseFloat(brutInput.value) || 0,
            net: parseFloat(netInput.value) || 0
        });

        renderTable();
        triggerAutoSave();

        urunInput.value = '';
        renkInput.value = '';
        partiInput.value = '';
        topInput.value = '';
        metreInput.value = '';
        brutInput.value = '';
        netInput.value = '';
        urunInput.focus();
    }

    ekleBtn.addEventListener('click', addItem);

    // Enter tuşları
    var addInputs = [urunInput, renkInput, partiInput, topInput, metreInput, brutInput, netInput];
    addInputs.forEach(function(input, index) {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                if (index < addInputs.length - 1) {
                    addInputs[index + 1].focus();
                } else {
                    addItem();
                }
            }
        });
    });

    // === Tablo Render ===
    function renderTable() {
        tbody.innerHTML = '';
        docTbody.innerHTML = '';
        var sumTop = 0, sumMetre = 0, sumBrut = 0, sumNet = 0;

        if (kalemler.length === 0) {
            tbody.innerHTML = '<tr class="empty-row"><td colspan="9">Henüz ürün eklenmedi</td></tr>';
        }

        kalemler.forEach(function(kalem, index) {
            sumTop += kalem.top;
            sumMetre += kalem.metre;
            sumBrut += kalem.brut;
            sumNet += kalem.net;

            var tr = document.createElement('tr');
            tr.style.animation = 'slideIn 0.2s ease';
            tr.innerHTML =
                '<td>' + (index + 1) + '</td>' +
                '<td><strong>' + kalem.ad + '</strong></td>' +
                '<td>' + kalem.renk + '</td>' +
                '<td>' + kalem.parti + '</td>' +
                '<td>' + kalem.top + '</td>' +
                '<td>' + kalem.metre.toFixed(2) + '</td>' +
                '<td>' + kalem.brut.toFixed(2) + '</td>' +
                '<td>' + kalem.net.toFixed(2) + '</td>' +
                '<td class="col-action"><button class="delete-btn" data-index="' + index + '">&times;</button></td>';
            tbody.appendChild(tr);

            var docTr = document.createElement('tr');
            docTr.innerHTML =
                '<td>' + (index + 1) + '</td>' +
                '<td>' + kalem.ad + '</td>' +
                '<td>' + kalem.renk + '</td>' +
                '<td>' + kalem.parti + '</td>' +
                '<td>' + kalem.top + '</td>' +
                '<td>' + kalem.metre.toFixed(2) + '</td>' +
                '<td>' + kalem.brut.toFixed(2) + '</td>' +
                '<td>' + kalem.net.toFixed(2) + '</td>';
            docTbody.appendChild(docTr);
        });

        totalTop.innerHTML = '<strong>' + sumTop + '</strong>';
        totalMetre.innerHTML = '<strong>' + sumMetre.toFixed(2) + '</strong>';
        totalBrut.innerHTML = '<strong>' + sumBrut.toFixed(2) + '</strong>';
        totalNet.innerHTML = '<strong>' + sumNet.toFixed(2) + '</strong>';

        docTotalTop.innerHTML = '<strong>' + sumTop + '</strong>';
        docTotalMetre.innerHTML = '<strong>' + sumMetre.toFixed(2) + '</strong>';
        docTotalBrut.innerHTML = '<strong>' + sumBrut.toFixed(2) + '</strong>';
        docTotalNet.innerHTML = '<strong>' + sumNet.toFixed(2) + '</strong>';

        countBadge.textContent = kalemler.length + ' kalem';

        tbody.querySelectorAll('.delete-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                kalemler.splice(parseInt(this.dataset.index), 1);
                renderTable();
                triggerAutoSave();
            });
        });
    }

    // === PDF Export ===
    pdfBtn.addEventListener('click', function() {
        if (kalemler.length === 0) { showToast('Lütfen en az bir ürün ekleyin.'); return; }
        var tarih = formatDate(tarihInput.value).replace(/\//g, '-');
        var alici = aliciInput.value.trim().replace(/\s+/g, '_') || 'Ceki';
        exportPDF('cl-document', 'ORMEN_Ceki_' + alici + '_' + tarih + '.pdf');
    });

    // === Yazdır ===
    yazdirBtn.addEventListener('click', function() {
        if (kalemler.length === 0) { showToast('Lütfen en az bir ürün ekleyin.'); return; }
        window.print();
    });

    // === WhatsApp Çeki Özeti ===
    whatsappBtn.addEventListener('click', function() {
        if (kalemler.length === 0) { showToast('Lütfen en az bir ürün ekleyin.'); return; }

        var text = '*ORMEN TEKSTİL - Çeki Özeti*\n';
        text += '━━━━━━━━━━━━━━━━━━━━\n';
        text += 'Çeki No: ' + cekiNoInput.value + '\n';
        text += 'Tarih: ' + formatDate(tarihInput.value) + '\n';
        if (aliciInput.value) text += 'Alıcı: *' + aliciInput.value + '*\n';
        text += '━━━━━━━━━━━━━━━━━━━━\n\n';

        var sumTop = 0, sumMetre = 0;
        kalemler.forEach(function(k) {
            text += '📦 ' + k.ad;
            if (k.renk) text += ' (' + k.renk + ')';
            text += ' - ' + k.top + ' top';
            if (k.metre > 0) text += ' / ' + k.metre.toFixed(0) + ' mt';
            text += '\n';
            sumTop += k.top;
            sumMetre += k.metre;
        });

        text += '\n━━━━━━━━━━━━━━━━━━━━\n';
        text += '*TOPLAM: ' + sumTop + ' top';
        if (sumMetre > 0) text += ' / ' + sumMetre.toFixed(0) + ' mt';
        text += '*\n';
        text += '━━━━━━━━━━━━━━━━━━━━\n';
        text += 'ORMEN TEKSTİL | (0312) 345 63 83';

        var encoded = encodeURIComponent(text);
        window.open('https://wa.me/?text=' + encoded, '_blank');
    });

    // === Excel Export ===
    excelBtn.addEventListener('click', function() {
        if (kalemler.length === 0) { showToast('Lütfen en az bir ürün ekleyin.'); return; }

        var headers = ['NO', 'ÜRÜN ADI', 'RENK', 'PARTİ NO', 'TOP', 'METRE/KG', 'BRÜT (kg)', 'NET (kg)'];
        var data = kalemler.map(function(k, i) {
            return [i + 1, k.ad, k.renk, k.parti, k.top, k.metre, k.brut, k.net];
        });

        // Toplam satırı
        var sumTop = 0, sumMetre = 0, sumBrut = 0, sumNet = 0;
        kalemler.forEach(function(k) {
            sumTop += k.top; sumMetre += k.metre; sumBrut += k.brut; sumNet += k.net;
        });
        data.push(['', 'TOPLAM', '', '', sumTop, sumMetre, sumBrut, sumNet]);

        // Meta bilgi satırları (üste)
        var meta = [
            ['ORMEN TEKSTİL - ÇEKİ LİSTESİ'],
            ['Çeki No: ' + cekiNoInput.value, '', 'Tarih: ' + formatDate(tarihInput.value)],
            ['Alıcı: ' + (aliciInput.value || '-'), '', 'İrsaliye: ' + (irsaliyeInput.value || '-')],
            []
        ];

        var tarih = formatDate(tarihInput.value).replace(/\//g, '-');
        exportExcel(meta.concat([headers]).concat(data),
            'ORMEN_Ceki_' + (aliciInput.value.trim().replace(/\s+/g, '_') || 'Liste') + '_' + tarih + '.xlsx');
    });

    // === Temizle ===
    temizleBtn.addEventListener('click', function() {
        kalemler = [];
        renderTable();
        irsaliyeInput.value = '';
        plakaInput.value = '';
        soforInput.value = '';
        aliciInput.value = '';
        yetkiliInput.value = '';
        adresInput.value = '';
        sehirInput.value = '';
        telefonInput.value = '';
        notlarTextarea.value = '';
        cekiNoInput.value = generateCekiNo();
        clearDraft('ceki');
        updateDisplays();
        showToast('Liste temizlendi.');
    });

    // İlk render
    setTimeout(function() {
        updateDisplays();
        renderTable();
    }, 100);
})();
