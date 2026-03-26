// ===== ÇEKİ LİSTESİ MODÜLÜ =====

(function() {
    let kalemler = [];

    const tarihInput = document.getElementById('cl-tarih');
    const irsaliyeInput = document.getElementById('cl-irsaliye');
    const plakaInput = document.getElementById('cl-plaka');
    const aliciInput = document.getElementById('cl-alici');
    const adresInput = document.getElementById('cl-adres');
    const telefonInput = document.getElementById('cl-telefon');

    const urunInput = document.getElementById('cl-urun');
    const topInput = document.getElementById('cl-top');
    const renkInput = document.getElementById('cl-renk');
    const metreInput = document.getElementById('cl-metre');
    const brutInput = document.getElementById('cl-brut');
    const netInput = document.getElementById('cl-net');
    const ekleBtn = document.getElementById('cl-ekle');

    const tbody = document.getElementById('cl-tbody');
    const tarihDisplay = document.getElementById('cl-tarih-display');
    const irsaliyeDisplay = document.getElementById('cl-irsaliye-display');
    const aliciDisplay = document.getElementById('cl-alici-display');
    const adresDisplay = document.getElementById('cl-adres-display');
    const plakaDisplay = document.getElementById('cl-plaka-display');

    const totalTop = document.getElementById('cl-total-top');
    const totalMetre = document.getElementById('cl-total-metre');
    const totalBrut = document.getElementById('cl-total-brut');
    const totalNet = document.getElementById('cl-total-net');

    const pdfBtn = document.getElementById('cl-pdf');
    const temizleBtn = document.getElementById('cl-temizle');

    // Display alanlarını güncelle
    function updateDisplays() {
        tarihDisplay.textContent = formatDate(tarihInput.value);
        irsaliyeDisplay.textContent = irsaliyeInput.value;
        aliciDisplay.textContent = aliciInput.value;
        adresDisplay.textContent = adresInput.value;
        plakaDisplay.textContent = plakaInput.value;
    }

    [tarihInput, irsaliyeInput, plakaInput, aliciInput, adresInput].forEach(el => {
        el.addEventListener('input', updateDisplays);
        el.addEventListener('change', updateDisplays);
    });

    setTimeout(updateDisplays, 100);

    // Ürün ekle
    function addItem() {
        const urunAdi = urunInput.value.trim().toUpperCase();
        const top = parseInt(topInput.value) || 0;
        const renk = renkInput.value.trim();
        const metre = parseFloat(metreInput.value) || 0;
        const brut = parseFloat(brutInput.value) || 0;
        const net = parseFloat(netInput.value) || 0;

        if (!urunAdi) {
            urunInput.focus();
            return;
        }

        kalemler.push({
            ad: urunAdi,
            top: top,
            renk: renk,
            metre: metre,
            brut: brut,
            net: net
        });

        renderTable();

        urunInput.value = '';
        topInput.value = '';
        renkInput.value = '';
        metreInput.value = '';
        brutInput.value = '';
        netInput.value = '';
        urunInput.focus();
    }

    ekleBtn.addEventListener('click', addItem);
    netInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addItem();
    });

    // Tabloyu render et
    function renderTable() {
        tbody.innerHTML = '';

        let sumTop = 0, sumMetre = 0, sumBrut = 0, sumNet = 0;

        kalemler.forEach((kalem, index) => {
            sumTop += kalem.top;
            sumMetre += kalem.metre;
            sumBrut += kalem.brut;
            sumNet += kalem.net;

            const tr = document.createElement('tr');
            tr.innerHTML =
                '<td>' + (index + 1) + '</td>' +
                '<td>' + kalem.ad +
                    ' <button class="delete-btn" data-index="' + index + '" title="Sil">&times;</button>' +
                '</td>' +
                '<td>' + kalem.top + '</td>' +
                '<td>' + kalem.renk + '</td>' +
                '<td>' + kalem.metre.toFixed(2) + '</td>' +
                '<td>' + kalem.brut.toFixed(2) + '</td>' +
                '<td>' + kalem.net.toFixed(2) + '</td>';
            tbody.appendChild(tr);
        });

        totalTop.innerHTML = '<strong>' + sumTop + '</strong>';
        totalMetre.innerHTML = '<strong>' + sumMetre.toFixed(2) + '</strong>';
        totalBrut.innerHTML = '<strong>' + sumBrut.toFixed(2) + '</strong>';
        totalNet.innerHTML = '<strong>' + sumNet.toFixed(2) + '</strong>';

        // Sil butonları
        tbody.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                kalemler.splice(parseInt(this.dataset.index), 1);
                renderTable();
            });
        });
    }

    // PDF export
    pdfBtn.addEventListener('click', function() {
        if (kalemler.length === 0) {
            showToast('Lütfen en az bir ürün ekleyin.');
            return;
        }
        const tarih = formatDate(tarihInput.value).replace(/\//g, '-');
        exportPDF('cl-document', 'ORMEN_Ceki_Listesi_' + tarih + '.pdf');
    });

    // Temizle
    temizleBtn.addEventListener('click', function() {
        kalemler = [];
        renderTable();
        showToast('Liste temizlendi.');
    });
})();
