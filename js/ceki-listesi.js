// ===== ÇEKİ LİSTESİ MODÜLÜ v7 (Karma Top Desteği) =====

(function() {
    // rolls = fiziksel toplar
    // Her roll: { no, karma, items: [{ kod, metre }] }
    var rolls = [];

    // Form
    var cekiNoInput = document.getElementById('cl-ceki-no');
    var tarihInput = document.getElementById('cl-tarih');
    var irsaliyeInput = document.getElementById('cl-irsaliye');
    var sevkTipiSelect = document.getElementById('cl-sevk-tipi');
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
    var totalMetre = document.getElementById('cl-total-metre');

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
    var docTbody = document.getElementById('cl-doc-tbody');
    var docTotalMetre = document.getElementById('cl-doc-total-metre');
    var docTotalLabel = document.getElementById('cl-doc-total-label');
    var docNotlar = document.getElementById('cl-doc-notlar');
    var docNotlarText = document.getElementById('cl-doc-notlar-text');
    var docSummary = document.getElementById('cl-doc-summary');
    var docSummaryItems = document.getElementById('cl-doc-summary-items');

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
        if (draft.tarih) tarihInput.value = draft.tarih;
        if (draft.irsaliye) irsaliyeInput.value = draft.irsaliye;
        if (draft.sevkTipi) sevkTipiSelect.value = draft.sevkTipi;
        if (draft.alici) aliciInput.value = draft.alici;
        if (draft.yetkili) yetkiliInput.value = draft.yetkili;
        if (draft.adres) adresInput.value = draft.adres;
        if (draft.sehir) sehirInput.value = draft.sehir;
        if (draft.telefon) telefonInput.value = draft.telefon;
        if (draft.notlar) notlarTextarea.value = draft.notlar;
        if (draft.hamVeri) hamVeriTextarea.value = draft.hamVeri;
        // Yeni format
        if (draft.rolls && draft.rolls.length > 0) {
            rolls = draft.rolls;
        // Eski format uyumluluk
        } else if (draft.toplar && draft.toplar.length > 0) {
            rolls = draft.toplar.map(function(t, i) {
                return { no: i + 1, karma: false, items: [{ kod: t.kod, metre: t.metre }] };
            });
        }
    } else {
        cekiNoInput.value = generateCekiNo();
    }

    // === Auto-Save ===
    function triggerAutoSave() {
        autoSave('ceki', {
            cekiNo: cekiNoInput.value,
            tarih: tarihInput.value,
            irsaliye: irsaliyeInput.value,
            sevkTipi: sevkTipiSelect.value,
            alici: aliciInput.value,
            yetkili: yetkiliInput.value,
            adres: adresInput.value,
            sehir: sehirInput.value,
            telefon: telefonInput.value,
            notlar: notlarTextarea.value,
            hamVeri: hamVeriTextarea.value,
            rolls: rolls
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

    var allInputs = [cekiNoInput, tarihInput, irsaliyeInput, sevkTipiSelect,
                     aliciInput, yetkiliInput, adresInput, sehirInput, telefonInput, notlarTextarea, hamVeriTextarea];
    allInputs.forEach(function(el) {
        el.addEventListener('input', updateDisplays);
        el.addEventListener('change', updateDisplays);
    });

    // === PARSER: Boş satır = yeni top, ardışık satırlar = aynı top (karma) ===
    // Ayraç: - – = ; tab (virgül ondalık ayıracı olduğu için kullanılmaz)
    function parseHamVeri(text) {
        var lines = text.split('\n');
        var result = [];
        var currentGroup = [];

        function commitGroup() {
            if (currentGroup.length === 0) return;
            result.push({
                no: result.length + 1,
                karma: currentGroup.length > 1,
                items: currentGroup.slice()
            });
            currentGroup = [];
        }

        lines.forEach(function(line) {
            line = line.trim();
            if (!line) {
                commitGroup();
                return;
            }

            var parts = line.split(/\s*[-–=;\t]\s*/);
            if (parts.length < 2) return;

            var kod = parts[0].trim().toUpperCase();
            var metreStr = parts.slice(1).join(' ').trim().replace(/[^0-9.,]/g, '');
            var metre = parseFloat(metreStr.replace(',', '.')) || 0;

            if (!kod) return;
            currentGroup.push({ kod: kod, metre: metre });
        });
        commitGroup(); // son grubu kapat

        return result;
    }

    // rolls → textarea metni (satır içi düzenleme sonrası senkron için)
    function rollsToText() {
        return rolls.map(function(roll) {
            return roll.items.map(function(it) {
                return it.kod + ' - ' + it.metre + ' metre';
            }).join('\n');
        }).join('\n\n');
    }

    // Analiz işlemi (buton + canlı analiz ortak kullanır)
    function runAnaliz(silent) {
        var text = hamVeriTextarea.value.trim();
        if (!text) {
            rolls = [];
            renderTable();
            triggerAutoSave();
            if (!silent) {
                showToast('Lütfen ürün verisi girin.');
                hamVeriTextarea.focus();
            }
            return;
        }

        rolls = parseHamVeri(text);
        renderTable();
        triggerAutoSave();

        if (silent) return;

        if (rolls.length === 0) {
            showToast('Veri okunamadı. Format: Ürün Kodu - Metre');
            return;
        }
        var karmaCount = rolls.filter(function(r) { return r.karma; }).length;
        var msg = rolls.length + ' top listelendi';
        if (karmaCount > 0) msg += ' (' + karmaCount + ' karma)';
        showToast(msg + '!');
    }

    // Analiz Et butonu
    analizBtn.addEventListener('click', function() { runAnaliz(false); });

    // Canlı analiz: yazdıkça (debounce) tabloyu güncelle
    var liveTimer = null;
    hamVeriTextarea.addEventListener('input', function() {
        clearTimeout(liveTimer);
        liveTimer = setTimeout(function() { runAnaliz(true); }, 600);
    });

    // === TABLO RENDER ===
    function renderTable() {
        tbody.innerHTML = '';
        docTbody.innerHTML = '';
        var sumMetre = 0;

        if (rolls.length === 0) {
            tbody.innerHTML = '<tr class="empty-row"><td colspan="4">Henüz ürün eklenmedi</td></tr>';
            totalMetre.innerHTML = '<strong>0</strong>';
            docTotalMetre.innerHTML = '<strong>0</strong>';
            countBadge.textContent = '0 top';
            if (docTotalLabel) docTotalLabel.innerHTML = '<strong>TOPLAM</strong>';
            if (docSummary) docSummary.style.display = 'none';
            return;
        }

        rolls.forEach(function(roll, rollIdx) {
            var rollMetre = 0;
            roll.items.forEach(function(item) { rollMetre += item.metre; });
            sumMetre += rollMetre;
            var rollMetreR = Math.round(rollMetre * 100) / 100;

            roll.items.forEach(function(item, idx) {
                var isFirst = (idx === 0);
                var isLast = (idx === roll.items.length - 1);
                var itemCount = roll.items.length;

                // === UI Tablo ===
                var tr = document.createElement('tr');
                if (roll.karma) {
                    tr.classList.add('karma-row');
                    if (isFirst) tr.classList.add('karma-first');
                    if (isLast) tr.classList.add('karma-last');
                }

                var noCell = '';
                if (isFirst) {
                    var badge = roll.karma
                        ? ' <span class="karma-badge">KARMA</span><span class="karma-sub">' + rollMetreR + ' mt</span>'
                        : '';
                    var rowspanAttr = roll.karma ? ' rowspan="' + itemCount + '"' : '';
                    noCell = '<td class="col-no"' + rowspanAttr + '>' + roll.no + badge + '</td>';
                }

                var deleteCell = '';
                if (isFirst) {
                    var delRowspan = roll.karma ? ' rowspan="' + itemCount + '"' : '';
                    deleteCell = '<td class="col-action"' + delRowspan + '><button class="delete-btn" data-roll="' + rollIdx + '">&times;</button></td>';
                }

                tr.innerHTML = noCell +
                    '<td><strong>' + item.kod + '</strong></td>' +
                    '<td class="col-metre"><span class="metre-edit" contenteditable="true" data-roll="' + rollIdx + '" data-item="' + idx + '">' + item.metre + '</span> mt</td>' +
                    deleteCell;
                tbody.appendChild(tr);

                // === Belge Tablo ===
                var docTr = document.createElement('tr');
                if (roll.karma) {
                    docTr.classList.add('doc-karma-row');
                    if (isFirst) docTr.classList.add('doc-karma-first');
                    if (isLast) docTr.classList.add('doc-karma-last');
                }

                var docNoCell = '';
                if (isFirst) {
                    var docBadge = roll.karma
                        ? '<span class="doc-karma-badge">K</span><span class="doc-karma-sub">' + rollMetreR + '</span>'
                        : '';
                    var docRowspan = roll.karma ? ' rowspan="' + itemCount + '"' : '';
                    docNoCell = '<td class="col-no"' + docRowspan + '>' + roll.no + docBadge + '</td>';
                }

                docTr.innerHTML = docNoCell +
                    '<td>' + item.kod + '</td>' +
                    '<td class="col-metre">' + item.metre + '</td>';
                docTbody.appendChild(docTr);
            });
        });

        var sumMetreR = Math.round(sumMetre * 100) / 100;
        totalMetre.innerHTML = '<strong>' + sumMetreR + ' mt</strong>';
        docTotalMetre.innerHTML = '<strong>' + sumMetreR + '</strong>';
        countBadge.textContent = rolls.length + ' top';

        // Belge TOPLAM satırına top sayısını yaz
        if (docTotalLabel) {
            docTotalLabel.innerHTML = '<strong>TOPLAM (' + rolls.length + ' TOP)</strong>';
        }

        // Ürün özeti (ürün kodu → top sayısı + toplam metre)
        var kodMap = {};
        var kodOrder = [];
        rolls.forEach(function(roll) {
            if (roll.karma) return; // karma toplar tek ürün değil, özete ekleme
            var kod = roll.items[0].kod;
            if (!kodMap[kod]) { kodMap[kod] = { top: 0, metre: 0 }; kodOrder.push(kod); }
            kodMap[kod].top += 1;
            kodMap[kod].metre += roll.items[0].metre;
        });
        if (kodOrder.length > 0) {
            docSummary.style.display = 'block';
            docSummaryItems.innerHTML = kodOrder.map(function(kod) {
                var m = Math.round(kodMap[kod].metre * 100) / 100;
                return '<div class="doc-summary-item"><span class="dsi-kod">' + kod + '</span>' +
                       '<span class="dsi-val">' + kodMap[kod].top + ' Top &middot; ' + m + ' mt</span></div>';
            }).join('');
        } else {
            docSummary.style.display = 'none';
        }

        // Sil butonları
        tbody.querySelectorAll('.delete-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var idx = parseInt(this.dataset.roll);
                rolls.splice(idx, 1);
                rolls.forEach(function(r, i) { r.no = i + 1; });
                hamVeriTextarea.value = rollsToText();
                renderTable();
                triggerAutoSave();
            });
        });

        // Satır içi metre düzenleme
        tbody.querySelectorAll('.metre-edit').forEach(function(cell) {
            function commitEdit() {
                var ri = parseInt(cell.dataset.roll);
                var ii = parseInt(cell.dataset.item);
                if (!rolls[ri] || !rolls[ri].items[ii]) return;
                var val = parseFloat(cell.textContent.trim().replace(',', '.'));
                if (isNaN(val) || val < 0) val = rolls[ri].items[ii].metre;
                rolls[ri].items[ii].metre = val;
                hamVeriTextarea.value = rollsToText();
                renderTable();
                triggerAutoSave();
            }
            cell.addEventListener('blur', commitEdit);
            cell.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') { e.preventDefault(); cell.blur(); }
            });
        });
    }

    // === PDF ===
    pdfBtn.addEventListener('click', function() {
        if (rolls.length === 0) { showToast('Önce verileri analiz edin.'); return; }
        var tarih = formatDate(tarihInput.value).replace(/\//g, '-');
        var alici = aliciInput.value.trim().replace(/\s+/g, '_') || 'Ceki';
        exportPDF('cl-document', 'ORMEN_Ceki_' + alici + '_' + tarih + '.pdf');
    });

    // === Yazdır ===
    yazdirBtn.addEventListener('click', function() {
        if (rolls.length === 0) { showToast('Önce verileri analiz edin.'); return; }
        window.print();
    });

    // === WhatsApp ===
    whatsappBtn.addEventListener('click', function() {
        if (rolls.length === 0) { showToast('Önce verileri analiz edin.'); return; }

        var text = '*ORMEN TEKSTİL - Çeki Listesi*\n';
        text += '━━━━━━━━━━━━━━━━━━━━\n';
        text += 'Çeki No: ' + cekiNoInput.value + '\n';
        text += 'Tarih: ' + formatDate(tarihInput.value) + '\n';
        if (aliciInput.value) text += 'Alıcı: *' + aliciInput.value + '*\n';
        text += '━━━━━━━━━━━━━━━━━━━━\n\n';

        var sumMetre = 0;
        rolls.forEach(function(roll) {
            if (roll.karma) {
                text += roll.no + '. *KARMA TOP:*\n';
                roll.items.forEach(function(item) {
                    text += '   • ' + item.kod + ' - ' + item.metre + ' mt\n';
                    sumMetre += item.metre;
                });
            } else {
                var item = roll.items[0];
                text += roll.no + '. ' + item.kod + ' - ' + item.metre + ' mt\n';
                sumMetre += item.metre;
            }
        });

        text += '\n━━━━━━━━━━━━━━━━━━━━\n';
        text += '*TOPLAM: ' + Math.round(sumMetre * 100) / 100 + ' metre (' + rolls.length + ' top)*\n';
        text += '━━━━━━━━━━━━━━━━━━━━\n';
        text += 'ORMEN TEKSTİL | 0312 349 68 88';

        window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
    });

    // === Excel ===
    excelBtn.addEventListener('click', function() {
        if (rolls.length === 0) { showToast('Önce verileri analiz edin.'); return; }

        var meta = [
            ['ORMEN TEKSTİL - ÇEKİ LİSTESİ'],
            ['Çeki No: ' + cekiNoInput.value, '', 'Tarih: ' + formatDate(tarihInput.value)],
            ['Alıcı: ' + (aliciInput.value || '-'), '', 'İrsaliye: ' + (irsaliyeInput.value || '-')],
            [],
            ['NO', 'ÜRÜN KODU', 'METRE', 'NOT']
        ];

        var sumMetre = 0;
        rolls.forEach(function(roll) {
            roll.items.forEach(function(item, idx) {
                var no = (idx === 0) ? roll.no : '';
                var not = (idx === 0 && roll.karma) ? 'KARMA TOP' : '';
                meta.push([no, item.kod, item.metre, not]);
                sumMetre += item.metre;
            });
        });
        meta.push(['', 'TOPLAM', Math.round(sumMetre * 100) / 100, rolls.length + ' TOP']);

        var tarih = formatDate(tarihInput.value).replace(/\//g, '-');
        exportExcel(meta,
            'ORMEN_Ceki_' + (aliciInput.value.trim().replace(/\s+/g, '_') || 'Liste') + '_' + tarih + '.xlsx');
    });

    // === Temizle ===
    temizleBtn.addEventListener('click', function() {
        rolls = [];
        renderTable();
        hamVeriTextarea.value = '';
        irsaliyeInput.value = '';
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
