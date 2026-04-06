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
    var onaylaBtn = document.getElementById('cl-onayla');
    var whatsappGorselBtn = document.getElementById('cl-whatsapp-gorsel');
    var stampEl = document.getElementById('cl-stamp');
    var stampDateEl = document.getElementById('cl-stamp-date');
    var stampCekiEl = document.getElementById('cl-stamp-ceki');
    var isOnaylandi = false;

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

            var parts = line.split(/\s*-\s*/);
            if (parts.length < 2) return;

            var kod = parts[0].trim().toUpperCase();
            var metreStr = parts.slice(1).join('-').trim().replace(/[^0-9.,]/g, '');
            var metre = parseFloat(metreStr.replace(',', '.')) || 0;

            if (!kod) return;
            currentGroup.push({ kod: kod, metre: metre });
        });
        commitGroup(); // son grubu kapat

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

        rolls = parseHamVeri(text);
        if (rolls.length === 0) {
            showToast('Veri okunamadı. Format: Ürün Kodu - Metre');
            return;
        }

        var karmaCount = rolls.filter(function(r) { return r.karma; }).length;
        renderTable();
        triggerAutoSave();
        var msg = rolls.length + ' top listelendi';
        if (karmaCount > 0) msg += ' (' + karmaCount + ' karma)';
        showToast(msg + '!');
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
            return;
        }

        rolls.forEach(function(roll) {
            var rollMetre = 0;
            roll.items.forEach(function(item) { rollMetre += item.metre; });
            sumMetre += rollMetre;

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
                    var badge = roll.karma ? ' <span class="karma-badge">KARMA</span>' : '';
                    if (roll.karma) {
                        noCell = '<td class="col-no" rowspan="' + itemCount + '">' + roll.no + badge + '</td>';
                    } else {
                        noCell = '<td class="col-no">' + roll.no + '</td>';
                    }
                }

                var deleteCell = '';
                if (isFirst) {
                    if (roll.karma) {
                        deleteCell = '<td class="col-action" rowspan="' + itemCount + '"><button class="delete-btn" data-roll="' + (roll.no - 1) + '">&times;</button></td>';
                    } else {
                        deleteCell = '<td class="col-action"><button class="delete-btn" data-roll="' + (roll.no - 1) + '">&times;</button></td>';
                    }
                }

                tr.innerHTML = noCell +
                    '<td><strong>' + item.kod + '</strong></td>' +
                    '<td>' + item.metre + ' mt</td>' +
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
                    var docBadge = roll.karma ? '<span class="doc-karma-badge">K</span>' : '';
                    if (roll.karma) {
                        docNoCell = '<td class="col-no" rowspan="' + itemCount + '">' + roll.no + docBadge + '</td>';
                    } else {
                        docNoCell = '<td class="col-no">' + roll.no + '</td>';
                    }
                }

                docTr.innerHTML = docNoCell +
                    '<td>' + item.kod + '</td>' +
                    '<td>' + item.metre + '</td>';
                docTbody.appendChild(docTr);
            });
        });

        totalMetre.innerHTML = '<strong>' + Math.round(sumMetre * 100) / 100 + '</strong>';
        docTotalMetre.innerHTML = '<strong>' + Math.round(sumMetre * 100) / 100 + '</strong>';
        countBadge.textContent = rolls.length + ' top';

        // Ürün özeti (ürün kodu → top sayısı)
        var kodTopMap = {};
        rolls.forEach(function(roll) {
            if (roll.karma) return; // karma toplar tek ürün değil, özete ekleme
            var kod = roll.items[0].kod;
            kodTopMap[kod] = (kodTopMap[kod] || 0) + 1;
        });
        var kodKeys = Object.keys(kodTopMap);
        if (kodKeys.length > 0) {
            docSummary.style.display = 'block';
            docSummaryItems.innerHTML = kodKeys.map(function(kod) {
                return '<span class="doc-summary-item">' + kod + ' <span>- ' + kodTopMap[kod] + ' Top</span></span>';
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
                renderTable();
                triggerAutoSave();
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

    // === Onayla & Mühürle ===
    onaylaBtn.addEventListener('click', function() {
        if (rolls.length === 0) { showToast('Önce verileri analiz edin.'); return; }
        if (isOnaylandi) { showToast('Zaten onaylanmış.'); return; }

        var now = new Date();
        var dateStr = ('0' + now.getDate()).slice(-2) + '/' +
                      ('0' + (now.getMonth() + 1)).slice(-2) + '/' +
                      now.getFullYear() + ' ' +
                      ('0' + now.getHours()).slice(-2) + ':' +
                      ('0' + now.getMinutes()).slice(-2);

        stampDateEl.textContent = dateStr;
        stampCekiEl.textContent = cekiNoInput.value;
        stampEl.style.display = 'flex';

        // Animasyon
        var passport = stampEl.querySelector('.stamp-passport');
        passport.classList.remove('stamp-animate');
        void passport.offsetWidth; // reflow
        passport.classList.add('stamp-animate');

        isOnaylandi = true;
        showToast('Belge onaylandı ve mühürlendi!');
    });

    // === WhatsApp Görsel Gönder ===
    whatsappGorselBtn.addEventListener('click', function() {
        if (rolls.length === 0) { showToast('Önce verileri analiz edin.'); return; }
        if (!isOnaylandi) { showToast('Önce belgeyi onaylayın.'); return; }

        var doc = document.getElementById('cl-document');
        showToast('Görsel hazırlanıyor...');

        html2canvas(doc, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false
        }).then(function(canvas) {
            canvas.toBlob(function(blob) {
                var fileName = 'ORMEN_Ceki_' + cekiNoInput.value + '.png';

                // Web Share API destekliyorsa (mobil)
                if (navigator.share && navigator.canShare) {
                    var file = new File([blob], fileName, { type: 'image/png' });
                    var shareData = { files: [file] };

                    if (navigator.canShare(shareData)) {
                        navigator.share(shareData).then(function() {
                            showToast('Paylaşıldı!');
                        }).catch(function() {
                            // Kullanıcı iptal etti veya hata — fallback
                            downloadBlob(blob, fileName);
                        });
                        return;
                    }
                }

                // Fallback: İndir
                downloadBlob(blob, fileName);
            }, 'image/png');
        });
    });

    function downloadBlob(blob, fileName) {
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Görsel indirildi! WhatsApp\'tan paylaşabilirsiniz.');
    }

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
        isOnaylandi = false;
        stampEl.style.display = 'none';
        var passport = stampEl.querySelector('.stamp-passport');
        passport.classList.remove('stamp-animate');
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
