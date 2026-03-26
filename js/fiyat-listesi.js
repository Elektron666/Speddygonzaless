// ===== FİYAT LİSTESİ MODÜLÜ =====

(function() {
    let urunler = [];

    const tarihInput = document.getElementById('fl-tarih');
    const odemeSelect = document.getElementById('fl-odeme');
    const paraSelect = document.getElementById('fl-para');
    const urunInput = document.getElementById('fl-urun');
    const fiyatInput = document.getElementById('fl-fiyat');
    const ekleBtn = document.getElementById('fl-ekle');
    const tbody = document.getElementById('fl-tbody');
    const tarihDisplay = document.getElementById('fl-tarih-display');
    const odemeDisplay = document.getElementById('fl-odeme-display');
    const pdfBtn = document.getElementById('fl-pdf');
    const temizleBtn = document.getElementById('fl-temizle');

    // Tarih ve ödeme display güncelle
    function updateMeta() {
        tarihDisplay.textContent = formatDate(tarihInput.value);
        odemeDisplay.textContent = odemeSelect.value;
    }

    tarihInput.addEventListener('change', updateMeta);
    odemeSelect.addEventListener('change', updateMeta);

    // Sayfa yüklendiğinde tarih göster
    setTimeout(updateMeta, 100);

    // Ürün ekle
    function addProduct() {
        const urunAdi = urunInput.value.trim().toUpperCase();
        const fiyat = parseFloat(fiyatInput.value);
        const paraBirimi = paraSelect.value;

        if (!urunAdi) {
            urunInput.focus();
            return;
        }
        if (isNaN(fiyat) || fiyat <= 0) {
            fiyatInput.focus();
            return;
        }

        urunler.push({ ad: urunAdi, fiyat: fiyat, para: paraBirimi });
        renderTable();

        urunInput.value = '';
        fiyatInput.value = '';
        urunInput.focus();
    }

    ekleBtn.addEventListener('click', addProduct);

    // Enter tuşu ile ekleme
    fiyatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addProduct();
    });
    urunInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') fiyatInput.focus();
    });

    // Tabloyu render et
    function renderTable() {
        tbody.innerHTML = '';
        urunler.forEach((urun, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML =
                '<td>' + (index + 1) + '</td>' +
                '<td>' + urun.ad + '</td>' +
                '<td class="fiyat-cell">' +
                    urun.fiyat.toFixed(2) + urun.para +
                    ' <button class="delete-btn" data-index="' + index + '" title="Sil">&times;</button>' +
                '</td>';
            tbody.appendChild(tr);
        });

        // Sil butonları
        tbody.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                urunler.splice(parseInt(this.dataset.index), 1);
                renderTable();
            });
        });
    }

    // PDF export
    pdfBtn.addEventListener('click', function() {
        if (urunler.length === 0) {
            showToast('Lütfen en az bir ürün ekleyin.');
            return;
        }
        const tarih = formatDate(tarihInput.value).replace(/\//g, '-');
        exportPDF('fl-document', 'ORMEN_Fiyat_Listesi_' + tarih + '.pdf');
    });

    // Temizle
    temizleBtn.addEventListener('click', function() {
        urunler = [];
        renderTable();
        showToast('Liste temizlendi.');
    });
})();
