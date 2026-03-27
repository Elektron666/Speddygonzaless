// ===== ÇEKİ LİSTESİ MODÜLÜ v6 (Detay + Özet) =====

(function() {
    var toplar = [];  // her satır = 1 top: { kod: 'BENTLEY 03', metre: 50 }
    var gruplar = []; // gruplanmış: { kod: 'BENTLEY 03', metre: 102, top: 2 }

    // Form
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
    var hamVeriTextarea = document.getElementById('cl-ham-veri');
    var analizBtn = document.getElementById('cl-analiz');
    var notlarTextarea = document.getElementById('cl-notlar');

    // Detay tablo
    var tbody = document.getElementById('cl-tbody');
    var countBadge = document.getElementById('cl-count');
    var totalMetre = document.getElementById('cl-total-metre');

    // Özet tablo
    var ozetTbody = document.getElementById('cl-ozet-tbody');
    var ozetCount = document.getElementById('cl-ozet-count');
    var ozetTotalMetre = document.getElementById('cl-ozet-total-metre');
    var ozetTotalTop = document.getElementById('cl-ozet-total-top');

    // Belge
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
    var docTotalMetre = document.getElementById('cl-doc-total-metre');
    var docOzetTbody = document.getElementById('cl-doc-ozet-tbody');
    var docOzetTotalMetre = document.getElementById('cl-doc-ozet-total-metre');
    var docOzetTotalTop = document.getElementById('cl-doc-ozet-total-top');
    var docNotlar = document.getElementById('cl-doc-notlar');
    var docNotlarText = document.getElementById('cl-doc-notlar-text');

    // Butonlar
    var pdfBtn = document.getElementById('cl-pdf');
    var yazdirBtn = document.getElementById('cl-yazdir');
    var temizleBtn = document.getElementById('cl-temizle');
    var whatsappBtn = document.getElementById('cl-whatsapp');
    var excelBtn = document.getElementById('cl-excel');

    // === Init ===
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
        if (draft.hamVeri) hamVeriTextarea.value = draft.hamVeri;
        if (draft.toplar && draft.toplar.length > 0) toplar = draft.toplar;
        if (draft.gruplar && draft.gruplar.length > 0) gruplar = draft.gruplar;
    } else {
        cekiNoInput.value = generateCekiNo();
    }

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
            hamVeri: hamVeriTextarea.value,
            toplar: toplar,
            gruplar: gruplar
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

        var qrText = 'ORMEN-' + cekiNoInput.value + '|' + formatDate(tarihInput.value) + '|' + (aliciInput.value || '');
        generateQR('cl-qr-code', qrText);

        triggerAutoSave();
    }

    var allInputs = [tarihInput, irsaliyeInput, sevkTipiSelect, plakaInput, soforInput,
                     aliciInput, yetkiliInput, adresInput, sehirInput, telefonInput, notlarTextarea, hamVeriTextarea];
    allInputs.forEach(function(el) {
        el.addEventListener('input', updateDisplays);
        el.addEventListener('change', updateDisplays);
    });

    // === HAM VERİ PARSE ===
    function parseHamVeri(text) {
        var lines = text.split('\n');
        var items = []; // her satır tek tek

        lines.forEach(function(line) {
            line = line.trim();
            if (!line) return;

            var parts = line.split(/\s*-\s*/);
            if (parts.length < 2) return;

            var kod = parts[0].trim().toUpperCase();
            var metreStr = parts.slice(1).join('-').trim().replace(/[^0-9.,]/g, '');
            var metre = parseFloat(metreStr.replace(',', '.')) || 0;

            if (!kod) return;
            items.push({ kod: kod, metre: metre });
        });

        return items;
    }

    // Toplardan grup oluştur
    function grupla(items) {
        var map = {};
        var order = [];

        items.forEach(function(t) {
            if (!map[t.kod]) {
                map[t.kod] = { metre: 0, top: 0 };
                order.push(t.kod);
            }
            map[t.kod].metre += t.metre;
            map[t.kod].top += 1;
        });

        var result = [];
        order.forEach(function(kod) {
            result.push({
                kod: kod,
                metre: Math.round(map[kod].metre * 100) / 100,
                top: map[kod].top
            });
        });
        return result;
    }

    // Analiz Et
    analizBtn.addEventListener('click', function() {
        var text = hamVeriTextarea.value.trim();
        if (!text) {
            showToast('Lütfen ürün verisi girin.');
            hamVeriTextarea.focus();
            return;
        }

        toplar = parseHamVeri(text);
        if (toplar.length === 0) {
            showToast('Veri okunamadı. Format: Ürün Kodu - Metre');
            return;
        }

        gruplar = grupla(toplar);
        renderAll();
        triggerAutoSave();
        showToast(toplar.length + ' top, ' + gruplar.length + ' ürün listelendi!');
    });

    // === RENDER ===
    function renderAll() {
        renderDetay();
        renderOzet();
    }

    // Detay: her top tek tek, checkbox ile
    function renderDetay() {
        tbody.innerHTML = '';
        docTbody.innerHTML = '';
        var sumMetre = 0;

        if (toplar.length === 0) {
            tbody.innerHTML = '<tr class="empty-row"><td colspan="5">Henüz ürün eklenmedi</td></tr>';
        }

        toplar.forEach(function(t, i) {
            sumMetre += t.metre;

            // UI satır
            var tr = document.createElement('tr');
            tr.style.animation = 'slideIn 0.2s ease';
            tr.innerHTML =
                '<td class="col-check"><input type="checkbox" class="top-check" data-index="' + i + '"></td>' +
                '<td>' + (i + 1) + '</td>' +
                '<td><strong>' + t.kod + '</strong></td>' +
                '<td>' + t.metre + ' mt</td>' +
                '<td class="col-action"><button class="delete-btn" data-index="' + i + '">&times;</button></td>';
            tbody.appendChild(tr);

            // Belge satır (kutucuk ile)
            var docTr = document.createElement('tr');
            docTr.innerHTML =
                '<td class="col-check-doc"><span class="check-box"></span></td>' +
                '<td>' + (i + 1) + '</td>' +
                '<td>' + t.kod + '</td>' +
                '<td>' + t.metre + '</td>';
            docTbody.appendChild(docTr);
        });

        totalMetre.innerHTML = '<strong>' + sumMetre + '</strong>';
        docTotalMetre.innerHTML = '<strong>' + sumMetre + '</strong>';
        countBadge.textContent = toplar.length + ' top';

        // Sil butonları
        tbody.querySelectorAll('.delete-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                toplar.splice(parseInt(this.dataset.index), 1);
                gruplar = grupla(toplar);
                renderAll();
                triggerAutoSave();
            });
        });

        // Checkbox - satırı işaretle
        tbody.querySelectorAll('.top-check').forEach(function(cb) {
            cb.addEventListener('change', function() {
                var row = this.closest('tr');
                if (this.checked) {
                    row.classList.add('checked-row');
                } else {
                    row.classList.remove('checked-row');
                }
            });
        });
    }

    // Özet: gruplanmış
    function renderOzet() {
        ozetTbody.innerHTML = '';
        docOzetTbody.innerHTML = '';
        var sumMetre = 0, sumTop = 0;

        gruplar.forEach(function(g, i) {
            sumMetre += g.metre;
            sumTop += g.top;

            var tr = document.createElement('tr');
            tr.innerHTML =
                '<td>' + (i + 1) + '</td>' +
                '<td><strong>' + g.kod + '</strong></td>' +
                '<td>' + g.metre + ' mt</td>' +
                '<td>' + g.top + '</td>';
            ozetTbody.appendChild(tr);

            var docTr = document.createElement('tr');
            docTr.innerHTML =
                '<td>' + g.kod + '</td>' +
                '<td>' + g.metre + '</td>' +
                '<td>' + g.top + '</td>';
            docOzetTbody.appendChild(docTr);
        });

        ozetTotalMetre.innerHTML = '<strong>' + sumMetre + '</strong>';
        ozetTotalTop.innerHTML = '<strong>' + sumTop + '</strong>';
        ozetCount.textContent = gruplar.length + ' kalem';

        docOzetTotalMetre.innerHTML = '<strong>' + sumMetre + '</strong>';
        docOzetTotalTop.innerHTML = '<strong>' + sumTop + '</strong>';
    }

    // === PDF ===
    pdfBtn.addEventListener('click', function() {
        if (toplar.length === 0) { showToast('Önce verileri analiz edin.'); return; }
        var tarih = formatDate(tarihInput.value).replace(/\//g, '-');
        var alici = aliciInput.value.trim().replace(/\s+/g, '_') || 'Ceki';
        exportPDF('cl-document', 'ORMEN_Ceki_' + alici + '_' + tarih + '.pdf');
    });

    // === Yazdır ===
    yazdirBtn.addEventListener('click', function() {
        if (toplar.length === 0) { showToast('Önce verileri analiz edin.'); return; }
        window.print();
    });

    // === WhatsApp ===
    whatsappBtn.addEventListener('click', function() {
        if (toplar.length === 0) { showToast('Önce verileri analiz edin.'); return; }

        var text = '*ORMEN TEKSTİL - Çeki Özeti*\n';
        text += '━━━━━━━━━━━━━━━━━━━━\n';
        text += 'Çeki No: ' + cekiNoInput.value + '\n';
        text += 'Tarih: ' + formatDate(tarihInput.value) + '\n';
        if (aliciInput.value) text += 'Alıcı: *' + aliciInput.value + '*\n';
        text += '━━━━━━━━━━━━━━━━━━━━\n\n';

        text += '*DETAY:*\n';
        toplar.forEach(function(t, i) {
            text += (i + 1) + '. ' + t.kod + ' - ' + t.metre + ' mt\n';
        });

        text += '\n*ÖZET:*\n';
        var sumMetre = 0, sumTop = 0;
        gruplar.forEach(function(g) {
            text += '📦 ' + g.kod + ' - ' + g.metre + ' mt (' + g.top + ' top)\n';
            sumMetre += g.metre;
            sumTop += g.top;
        });

        text += '\n━━━━━━━━━━━━━━━━━━━━\n';
        text += '*TOPLAM: ' + sumMetre + ' metre (' + sumTop + ' top)*\n';
        text += '━━━━━━━━━━━━━━━━━━━━\n';
        text += 'ORMEN TEKSTİL | 0312 349 68 88';

        window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
    });

    // === Excel ===
    excelBtn.addEventListener('click', function() {
        if (toplar.length === 0) { showToast('Önce verileri analiz edin.'); return; }

        var meta = [
            ['ORMEN TEKSTİL - ÇEKİ LİSTESİ'],
            ['Çeki No: ' + cekiNoInput.value, '', 'Tarih: ' + formatDate(tarihInput.value)],
            ['Alıcı: ' + (aliciInput.value || '-'), '', 'İrsaliye: ' + (irsaliyeInput.value || '-')],
            [],
            ['TOP DETAY'],
            ['NO', 'ÜRÜN KODU', 'METRE']
        ];

        var sumMetre = 0;
        toplar.forEach(function(t, i) {
            meta.push([i + 1, t.kod, t.metre]);
            sumMetre += t.metre;
        });
        meta.push(['', 'TOPLAM', sumMetre]);
        meta.push([]);
        meta.push(['ÖZET']);
        meta.push(['ÜRÜN KODU', 'TOPLAM METRE', 'TOP SAYISI']);

        var sumTop = 0;
        gruplar.forEach(function(g) {
            meta.push([g.kod, g.metre, g.top]);
            sumTop += g.top;
        });
        meta.push(['GENEL TOPLAM', sumMetre, sumTop]);

        var tarih = formatDate(tarihInput.value).replace(/\//g, '-');
        exportExcel(meta,
            'ORMEN_Ceki_' + (aliciInput.value.trim().replace(/\s+/g, '_') || 'Liste') + '_' + tarih + '.xlsx');
    });

    // === Temizle ===
    temizleBtn.addEventListener('click', function() {
        toplar = [];
        gruplar = [];
        renderAll();
        hamVeriTextarea.value = '';
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
        renderAll();
    }, 100);
})();
