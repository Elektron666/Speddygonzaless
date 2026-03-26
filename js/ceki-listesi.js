// ===== ÇEKİ LİSTESİ MODÜLÜ v2 =====

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

    // Tablo
    var tbody = document.getElementById('cl-tbody');
    var countBadge = document.getElementById('cl-count');
    var totalTop = document.getElementById('cl-total-top');
    var totalMetre = document.getElementById('cl-total-metre');
    var totalBrut = document.getElementById('cl-total-brut');
    var totalNet = document.getElementById('cl-total-net');

    // Belge display elemanları
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
    var notlarTextarea = document.getElementById('cl-notlar');

    // Butonlar
    var pdfBtn = document.getElementById('cl-pdf');
    var yazdirBtn = document.getElementById('cl-yazdir');
    var temizleBtn = document.getElementById('cl-temizle');

    // === Çeki No Oluştur ===
    cekiNoInput.value = generateCekiNo();

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

        // Notlar
        var notlar = notlarTextarea.value.trim();
        if (notlar) {
            docNotlar.style.display = 'block';
            docNotlarText.textContent = notlar;
        } else {
            docNotlar.style.display = 'none';
        }
    }

    // Tüm input'lara dinleyici ekle
    var allInputs = [tarihInput, irsaliyeInput, sevkTipiSelect, plakaInput, soforInput,
                     aliciInput, yetkiliInput, adresInput, sehirInput, telefonInput, notlarTextarea];
    allInputs.forEach(function(el) {
        el.addEventListener('input', updateDisplays);
        el.addEventListener('change', updateDisplays);
    });

    setTimeout(updateDisplays, 100);

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

        // Formları temizle
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

            // Form tablosu
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
                '<td class="col-action"><button class="delete-btn" data-index="' + index + '" title="Sil">&times;</button></td>';
            tbody.appendChild(tr);

            // Belge tablosu
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

        // Toplamlar
        totalTop.innerHTML = '<strong>' + sumTop + '</strong>';
        totalMetre.innerHTML = '<strong>' + sumMetre.toFixed(2) + '</strong>';
        totalBrut.innerHTML = '<strong>' + sumBrut.toFixed(2) + '</strong>';
        totalNet.innerHTML = '<strong>' + sumNet.toFixed(2) + '</strong>';

        docTotalTop.innerHTML = '<strong>' + sumTop + '</strong>';
        docTotalMetre.innerHTML = '<strong>' + sumMetre.toFixed(2) + '</strong>';
        docTotalBrut.innerHTML = '<strong>' + sumBrut.toFixed(2) + '</strong>';
        docTotalNet.innerHTML = '<strong>' + sumNet.toFixed(2) + '</strong>';

        // Badge
        countBadge.textContent = kalemler.length + ' kalem';

        // Sil butonları
        tbody.querySelectorAll('.delete-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                kalemler.splice(parseInt(this.dataset.index), 1);
                renderTable();
            });
        });
    }

    // === PDF Export ===
    pdfBtn.addEventListener('click', function() {
        if (kalemler.length === 0) {
            showToast('Lütfen en az bir ürün ekleyin.');
            return;
        }
        var tarih = formatDate(tarihInput.value).replace(/\//g, '-');
        var alici = aliciInput.value.trim().replace(/\s+/g, '_') || 'Ceki';
        exportPDF('cl-document', 'ORMEN_Ceki_' + alici + '_' + tarih + '.pdf');
    });

    // === Yazdır ===
    yazdirBtn.addEventListener('click', function() {
        if (kalemler.length === 0) {
            showToast('Lütfen en az bir ürün ekleyin.');
            return;
        }
        window.print();
    });

    // === Temizle ===
    temizleBtn.addEventListener('click', function() {
        if (kalemler.length === 0) return;
        kalemler = [];
        renderTable();
        // Yeni çeki no oluştur
        cekiNoInput.value = generateCekiNo();
        updateDisplays();
        showToast('Liste temizlendi.');
    });
})();
