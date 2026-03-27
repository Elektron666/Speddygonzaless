// ===== ÇEKİ LİSTESİ MODÜLÜ v4 (Textarea → Analiz → Grupla) =====

(function() {
    var gruplar = []; // { kod: 'Bentley 03', metre: 102, top: 2, karma: 0 }
    var fizikselTopSayisi = 0; // toplam fiziksel top (karma dahil)

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
    var hamVeriTextarea = document.getElementById('cl-ham-veri');
    var analizBtn = document.getElementById('cl-analiz');
    var notlarTextarea = document.getElementById('cl-notlar');

    // Tablo
    var tbody = document.getElementById('cl-tbody');
    var countBadge = document.getElementById('cl-count');
    var totalTop = document.getElementById('cl-total-top');
    var totalMetre = document.getElementById('cl-total-metre');

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
        if (draft.gruplar && draft.gruplar.length > 0) {
            gruplar = draft.gruplar;
        }
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

        // QR kod güncelle
        var qrText = 'ORMEN-' + cekiNoInput.value + '|' + formatDate(tarihInput.value) + '|' + (aliciInput.value || '');
        generateQR('cl-qr-code', qrText);

        triggerAutoSave();
    }

    // Tüm input'lara dinleyici
    var allInputs = [tarihInput, irsaliyeInput, sevkTipiSelect, plakaInput, soforInput,
                     aliciInput, yetkiliInput, adresInput, sehirInput, telefonInput, notlarTextarea, hamVeriTextarea];
    allInputs.forEach(function(el) {
        el.addEventListener('input', updateDisplays);
        el.addEventListener('change', updateDisplays);
    });

    // === HAM VERİ ANALİZ ===
    // Normal satır: "Bentley 03 - 50 metre"  → 1 fiziksel top
    // Karma satır:  "+Bentley 02 - 17 metre" → aynı fiziksel top (karma sarım)
    function parseHamVeri(text) {
        var lines = text.split('\n');
        var map = {}; // { 'BENTLEY 03': { metre: 0, top: 0, karma: 0 } }
        var order = []; // sırayı koru
        var topCount = 0; // fiziksel top sayacı

        lines.forEach(function(line) {
            line = line.trim();
            if (!line) return;

            // + ile başlıyorsa karma top (önceki topun devamı)
            var isKarma = line.charAt(0) === '+';
            if (isKarma) {
                line = line.substring(1).trim();
            } else {
                topCount++; // yeni fiziksel top
            }

            // "Bentley 03 - 50 metre" veya "Bentley 03 - 50"
            var parts = line.split(/\s*-\s*/);
            if (parts.length < 2) return;

            var kod = parts[0].trim().toUpperCase();
            var metreStr = parts.slice(1).join('-').trim().replace(/[^0-9.,]/g, '');
            var metre = parseFloat(metreStr.replace(',', '.')) || 0;

            if (!kod) return;

            if (!map[kod]) {
                map[kod] = { metre: 0, top: 0, karma: 0 };
                order.push(kod);
            }
            map[kod].metre += metre;
            if (isKarma) {
                map[kod].karma += 1;
            } else {
                map[kod].top += 1;
            }
        });

        fizikselTopSayisi = topCount;

        var result = [];
        order.forEach(function(kod) {
            result.push({
                kod: kod,
                metre: Math.round(map[kod].metre * 100) / 100,
                top: map[kod].top,
                karma: map[kod].karma
            });
        });
        return result;
    }

    // Analiz Et butonu
    analizBtn.addEventListener('click', function() {
        var text = hamVeriTextarea.value.trim();
        if (!text) {
            showToast('Lütfen ürün verisi girin.');
            hamVeriTextarea.focus();
            return;
        }

        gruplar = parseHamVeri(text);

        if (gruplar.length === 0) {
            showToast('Veri okunamadı. Format: Ürün Kodu - Metre');
            return;
        }

        renderTable();
        triggerAutoSave();
        showToast(gruplar.length + ' ürün gruplanarak listelendi!');
    });

    // Top bilgisi string oluştur
    function topLabel(g) {
        if (g.karma > 0 && g.top > 0) {
            return g.top + ' top + ' + g.karma + ' karma';
        } else if (g.karma > 0 && g.top === 0) {
            return g.karma + ' karma';
        }
        return g.top + ' top';
    }

    // === Tablo Render ===
    function renderTable() {
        tbody.innerHTML = '';
        docTbody.innerHTML = '';
        var sumMetre = 0;
        var hasKarma = false;

        if (gruplar.length === 0) {
            tbody.innerHTML = '<tr class="empty-row"><td colspan="5">Henüz ürün eklenmedi</td></tr>';
        }

        gruplar.forEach(function(g, index) {
            sumMetre += g.metre;
            if (g.karma > 0) hasKarma = true;

            var topStr = topLabel(g);

            // UI tablo
            var tr = document.createElement('tr');
            tr.style.animation = 'slideIn 0.2s ease';
            if (g.karma > 0) tr.classList.add('karma-row');
            tr.innerHTML =
                '<td>' + (index + 1) + '</td>' +
                '<td><strong>' + g.kod + '</strong>' + (g.karma > 0 ? ' <span class="karma-badge">K</span>' : '') + '</td>' +
                '<td>' + g.metre + ' metre</td>' +
                '<td>' + topStr + '</td>' +
                '<td class="col-action"><button class="delete-btn" data-index="' + index + '">&times;</button></td>';
            tbody.appendChild(tr);

            // Belge tablo
            var docTr = document.createElement('tr');
            docTr.innerHTML =
                '<td>' + (index + 1) + '</td>' +
                '<td>' + g.kod + (g.karma > 0 ? ' *' : '') + '</td>' +
                '<td>' + g.metre + '</td>' +
                '<td>' + topStr + '</td>';
            docTbody.appendChild(docTr);
        });

        totalMetre.innerHTML = '<strong>' + sumMetre + '</strong>';
        totalTop.innerHTML = '<strong>' + fizikselTopSayisi + '</strong>';

        docTotalMetre.innerHTML = '<strong>' + sumMetre + '</strong>';
        docTotalTop.innerHTML = '<strong>' + fizikselTopSayisi + '</strong>';

        countBadge.textContent = gruplar.length + ' kalem' + (hasKarma ? ' (karma var)' : '') + ' | ' + fizikselTopSayisi + ' fiziksel top';

        tbody.querySelectorAll('.delete-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                gruplar.splice(parseInt(this.dataset.index), 1);
                renderTable();
                triggerAutoSave();
            });
        });
    }

    // === PDF Export ===
    pdfBtn.addEventListener('click', function() {
        if (gruplar.length === 0) { showToast('Önce verileri analiz edin.'); return; }
        var tarih = formatDate(tarihInput.value).replace(/\//g, '-');
        var alici = aliciInput.value.trim().replace(/\s+/g, '_') || 'Ceki';
        exportPDF('cl-document', 'ORMEN_Ceki_' + alici + '_' + tarih + '.pdf');
    });

    // === Yazdır ===
    yazdirBtn.addEventListener('click', function() {
        if (gruplar.length === 0) { showToast('Önce verileri analiz edin.'); return; }
        window.print();
    });

    // === WhatsApp Çeki Özeti ===
    whatsappBtn.addEventListener('click', function() {
        if (gruplar.length === 0) { showToast('Önce verileri analiz edin.'); return; }

        var text = '*ORMEN TEKSTİL - Çeki Özeti*\n';
        text += '━━━━━━━━━━━━━━━━━━━━\n';
        text += 'Çeki No: ' + cekiNoInput.value + '\n';
        text += 'Tarih: ' + formatDate(tarihInput.value) + '\n';
        if (aliciInput.value) text += 'Alıcı: *' + aliciInput.value + '*\n';
        text += '━━━━━━━━━━━━━━━━━━━━\n\n';

        var sumMetre = 0;
        gruplar.forEach(function(g) {
            text += '📦 ' + g.kod + ' - ' + g.metre + ' metre (' + topLabel(g) + ')\n';
            sumMetre += g.metre;
        });

        text += '\n━━━━━━━━━━━━━━━━━━━━\n';
        text += '*TOPLAM: ' + sumMetre + ' metre (' + fizikselTopSayisi + ' fiziksel top)*\n';
        text += '━━━━━━━━━━━━━━━━━━━━\n';
        text += 'ORMEN TEKSTİL | 0312 349 68 88';

        var encoded = encodeURIComponent(text);
        window.open('https://wa.me/?text=' + encoded, '_blank');
    });

    // === Excel Export ===
    excelBtn.addEventListener('click', function() {
        if (gruplar.length === 0) { showToast('Önce verileri analiz edin.'); return; }

        var headers = ['NO', 'ÜRÜN KODU', 'METRE', 'TOP'];
        var data = gruplar.map(function(g, i) {
            return [i + 1, g.kod, g.metre, topLabel(g)];
        });

        var sumMetre = 0;
        gruplar.forEach(function(g) { sumMetre += g.metre; });
        data.push(['', 'TOPLAM', sumMetre, fizikselTopSayisi + ' fiziksel top']);

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
        gruplar = [];
        renderTable();
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
        renderTable();
    }, 100);
})();
