// Tab System
const tabs = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const tabIndicator = document.getElementById('tab-indicator');

let currentTab = 0;

function showTab(index) {
  // Validate index
  if (index < 0 || index >= tabs.length) return;
  
  // Update active tab
  tabs.forEach(tab => tab.classList.remove('active'));
  tabContents.forEach(content => content.classList.remove('active'));
  
  tabs[index].classList.add('active');
  tabContents[index].classList.add('active');
  currentTab = index;
  
  // Update navigation
  prevBtn.disabled = index === 0;
  nextBtn.textContent = index === tabs.length - 1 ? 'Simpan' : 'Berikutnya';
  tabIndicator.textContent = `${index + 1}/${tabs.length}`;
  
  // Scroll to top
  window.scrollTo(0, 0);
}

// Tab click event
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => showTab(index));
});

// Navigation buttons
prevBtn.addEventListener('click', () => showTab(currentTab - 1));
nextBtn.addEventListener('click', () => {
  if (currentTab < tabs.length - 1) {
    showTab(currentTab + 1);
  } else {
    saveForm();
  }
});

// Dynamic Row Addition
function addRow(type) {
  const tableConfig = {
    'cpl': {
      tableId: 'tabel-cpl',
      columns: [
        '<input type="text" placeholder="CPL1">',
        '<input type="text" placeholder="Deskripsi CPL">'
      ]
    },
    'cpmk': {
      tableId: 'tabel-cpmk',
      columns: [
        '<input type="text" placeholder="CPMK1">',
        '<input type="text" placeholder="Deskripsi CPMK">'
      ]
    },
    'materi': {
      tableId: 'tabel-materi',
      columns: [
        '<select><option>CPMK1</option><option>CPMK2</option><option>CPMK3</option></select>',
        '<input type="text" placeholder="Judul Materi">',
        '<select><option>Luring</option><option>Daring</option></select>',
        '<input type="text" placeholder="10x50 menit">'
      ]
    },
    'penilaian': {
      tableId: 'tabel-penilaian',
      columns: [
        `<select>
          <option>Aktivitas Partisipatif</option>
          <option>Hasil Project/Studi Kasus</option>
          <option>Kognitif</option>
        </select>`,
        '<input type="text" placeholder="Tugas/UTS/UAS">',
        '<input type="number" min="0" max="100" placeholder="0-100">',
        '<select><option>CPMK1</option><option>CPMK2</option><option>CPMK3</option></select>',
        '<input type="number" min="0" max="100" placeholder="0-100">'
      ]
    },
    'referensi': {
      tableId: 'tabel-referensi',
      columns: [
        '<span class="row-number"></span>',
        '<input type="text" placeholder="Judul Buku">',
        '<input type="text" placeholder="Pengarang">',
        '<input type="text" placeholder="Tahun">'
      ]
    },
    'dosen': {
      tableId: 'tabel-dosen',
      columns: [
        '<input type="text" placeholder="Nama Dosen">',
        '<input type="text" placeholder="Gelar">',
        '<select><option>Pengampu Utama</option><option>Team Teaching</option></select>'
      ]
    }
  };

  const config = tableConfig[type];
  if (!config) return;

  const tbody = document.querySelector(`#${config.tableId} tbody`);
  const row = document.createElement('tr');
  
  config.columns.forEach(col => {
    const td = document.createElement('td');
    td.innerHTML = col;
    row.appendChild(td);
  });

  // Add delete button if not reference table
  if (type !== 'referensi') {
    const deleteCell = document.createElement('td');
    deleteCell.innerHTML = '<button class="btn-delete">Hapus</button>';
    row.appendChild(deleteCell);
  }

  tbody.appendChild(row);

  // Update row numbers for reference table
  if (type === 'referensi') {
    updateRowNumbers();
  }

  // Add delete event
  const deleteBtn = row.querySelector('.btn-delete');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', function() {
      if (tbody.rows.length > 1) {
        row.remove();
        if (type === 'referensi') updateRowNumbers();
      } else {
        alert('Minimal harus ada satu baris!');
      }
    });
  }
}

// Update row numbers for reference table
function updateRowNumbers() {
  const rows = document.querySelectorAll('#tabel-referensi tbody tr');
  rows.forEach((row, index) => {
    row.querySelector('.row-number').textContent = index + 1;
  });
}

// Save form data
function saveForm() {
  // Validate total evaluation weight = 100%
  const bobotInputs = document.querySelectorAll('#tabel-penilaian input[type="number"]:nth-of-type(1)');
  let totalBobot = 0;
  
  bobotInputs.forEach(input => {
    totalBobot += parseInt(input.value) || 0;
  });

  if (totalBobot !== 100) {
    alert(`Total bobot penilaian harus 100% (Saat ini: ${totalBobot}%)`);
    showTab(8); // Jump to penilaian tab
    return;
  }

  // Here you would typically send data to server
  alert('Data RPS berhasil disimpan!');
  console.log('Form data saved');
}

// Initialize first tab
showTab(0);

// Add initial rows
addRow('cpl');
addRow('cpmk');
addRow('materi');
addRow('penilaian');
addRow('referensi');