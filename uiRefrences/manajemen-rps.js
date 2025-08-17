// Manajemen RPS JavaScript
class ManajemenRPS {
  constructor() {
    this.selectedRows = new Set();
    this.rpsData = [];
    this.currentEditId = null;
    this.cpmkCounter = 1;
    
    this.init();
    this.bindEvents();
    this.loadRPSData();
  }

  init() {
    console.log('Manajemen RPS initialized');
    
    // Initialize modals
    this.rpsModal = document.getElementById('rpsModal');
    this.confirmModal = document.getElementById('confirmModal');
    
    // Initialize form elements
    this.rpsForm = document.getElementById('rpsForm');
    this.cpmkContainer = document.getElementById('cpmkContainer');
    
    // Initialize table elements
    this.rpsTable = document.getElementById('rpsTable');
    this.bulkActionsBar = document.getElementById('bulkActionsBar');
  }

  bindEvents() {
    // Add RPS Button
    document.getElementById('addRpsBtn')?.addEventListener('click', () => {
      this.showRPSModal();
    });

    // Search functionality
    document.getElementById('searchInput')?.addEventListener('input', (e) => {
      this.filterTable();
    });

    // Filter dropdowns
    document.getElementById('semesterFilter')?.addEventListener('change', () => {
      this.filterTable();
    });

    document.getElementById('statusFilter')?.addEventListener('change', () => {
      this.filterTable();
    });

    // Table actions
    document.getElementById('selectAll')?.addEventListener('change', (e) => {
      this.toggleSelectAll(e.target.checked);
    });

    // Refresh button
    document.getElementById('refreshBtn')?.addEventListener('click', () => {
      this.refreshTable();
    });

    // Export button
    document.getElementById('exportBtn')?.addEventListener('click', () => {
      this.exportData();
    });

    // Modal events
    this.bindModalEvents();
    
    // Form events
    this.bindFormEvents();

    // Table row events
    this.bindTableEvents();

    // Bulk actions
    this.bindBulkActions();
  }

  bindModalEvents() {
    // RPS Modal
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => {
        this.closeModals();
      });
    });

    document.getElementById('rpsCancel')?.addEventListener('click', () => {
      this.closeModals();
    });

    document.getElementById('rpsSave')?.addEventListener('click', () => {
      this.saveRPS();
    });

    // Confirm Modal
    document.getElementById('confirmCancel')?.addEventListener('click', () => {
      this.closeModals();
    });

    document.getElementById('confirmDelete')?.addEventListener('click', () => {
      this.confirmDelete();
    });

    // Close modal when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModals();
        }
      });
    });
  }

  bindFormEvents() {
    // Add CPMK button
    document.getElementById('addCpmkBtn')?.addEventListener('click', () => {
      this.addCPMK();
    });

    // Remove CPMK buttons (delegated event)
    this.cpmkContainer?.addEventListener('click', (e) => {
      if (e.target.closest('.btn-remove-cpmk')) {
        this.removeCPMK(e.target.closest('.cpmk-item'));
      }
    });

    // Form validation
    this.rpsForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveRPS();
    });
  }

  bindTableEvents() {
    // Delegate events for table actions
    this.rpsTable?.addEventListener('click', (e) => {
      const target = e.target.closest('button');
      if (!target) return;

      const row = target.closest('tr');
      const rpsId = this.getRPSIdFromRow(row);

      if (target.classList.contains('btn-view')) {
        this.viewRPS(rpsId);
      } else if (target.classList.contains('btn-edit')) {
        this.editRPS(rpsId);
      } else if (target.classList.contains('btn-copy')) {
        this.copyRPS(rpsId);
      } else if (target.classList.contains('btn-delete')) {
        this.deleteRPS(rpsId);
      }
    });

    // Row selection
    this.rpsTable?.addEventListener('change', (e) => {
      if (e.target.classList.contains('row-select')) {
        this.toggleRowSelection(e.target);
      }
    });
  }

  bindBulkActions() {
    document.getElementById('bulkExport')?.addEventListener('click', () => {
      this.bulkExport();
    });

    document.getElementById('bulkArchive')?.addEventListener('click', () => {
      this.bulkArchive();
    });

    document.getElementById('bulkDelete')?.addEventListener('click', () => {
      this.bulkDelete();
    });
  }

  // RPS Modal Management
  showRPSModal(mode = 'add', rpsId = null) {
    this.currentEditId = rpsId;
    const title = document.getElementById('rpsModalTitle');
    const saveBtn = document.getElementById('rpsSave');

    if (mode === 'edit') {
      title.textContent = 'Edit RPS';
      saveBtn.textContent = 'Update RPS';
      this.loadRPSForEdit(rpsId);
    } else {
      title.textContent = 'Tambah RPS Baru';
      saveBtn.textContent = 'Simpan RPS';
      this.resetForm();
    }

    this.rpsModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  closeModals() {
    document.querySelectorAll('.modal').forEach(modal => {
      modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
    this.currentEditId = null;
  }

  // CPMK Management
  addCPMK() {
    this.cpmkCounter++;
    const cpmkItem = document.createElement('div');
    cpmkItem.className = 'cpmk-item';
    cpmkItem.innerHTML = `
      <div class="cpmk-header">
        <label>CPMK ${this.cpmkCounter}</label>
        <button type="button" class="btn-icon btn-remove-cpmk" title="Hapus CPMK">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <textarea name="cpmk[]" placeholder="Masukkan deskripsi CPMK ${this.cpmkCounter}..." rows="2"></textarea>
    `;
    this.cpmkContainer.appendChild(cpmkItem);
  }

  removeCPMK(cpmkItem) {
    if (this.cpmkContainer.children.length > 1) {
      cpmkItem.remove();
      this.renumberCPMK();
    } else {
      this.showNotification('Minimal harus ada 1 CPMK', 'warning');
    }
  }

  renumberCPMK() {
    const cpmkItems = this.cpmkContainer.querySelectorAll('.cpmk-item');
    cpmkItems.forEach((item, index) => {
      const label = item.querySelector('label');
      const textarea = item.querySelector('textarea');
      label.textContent = `CPMK ${index + 1}`;
      textarea.placeholder = `Masukkan deskripsi CPMK ${index + 1}...`;
    });
    this.cpmkCounter = cpmkItems.length;
  }

  // Form Management
  resetForm() {
    this.rpsForm?.reset();
    
    // Reset CPMK to just one item
    this.cpmkContainer.innerHTML = `
      <div class="cpmk-item">
        <div class="cpmk-header">
          <label>CPMK 1</label>
          <button type="button" class="btn-icon btn-remove-cpmk" title="Hapus CPMK">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <textarea name="cpmk[]" placeholder="Masukkan deskripsi CPMK 1..." rows="2"></textarea>
      </div>
    `;
    this.cpmkCounter = 1;
  }

  loadRPSForEdit(rpsId) {
    // Simulate loading RPS data for editing
    const rpsData = this.getRPSById(rpsId);
    if (rpsData) {
      // Populate form fields
      document.getElementById('courseCode').value = rpsData.courseCode;
      document.getElementById('courseName').value = rpsData.courseName;
      document.getElementById('credits').value = rpsData.credits;
      document.getElementById('semester').value = rpsData.semester;
      document.getElementById('lecturer').value = rpsData.lecturer;
      document.getElementById('prerequisites').value = rpsData.prerequisites || '';
      document.getElementById('courseDescription').value = rpsData.description || '';
      
      // Load CPMK data
      this.loadCPMKData(rpsData.cpmk || []);
    }
  }

  loadCPMKData(cpmkArray) {
    this.cpmkContainer.innerHTML = '';
    this.cpmkCounter = 0;
    
    if (cpmkArray.length === 0) {
      this.addCPMK();
    } else {
      cpmkArray.forEach((cpmk, index) => {
        this.cpmkCounter = index + 1;
        const cpmkItem = document.createElement('div');
        cpmkItem.className = 'cpmk-item';
        cpmkItem.innerHTML = `
          <div class="cpmk-header">
            <label>CPMK ${this.cpmkCounter}</label>
            <button type="button" class="btn-icon btn-remove-cpmk" title="Hapus CPMK">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <textarea name="cpmk[]" placeholder="Masukkan deskripsi CPMK ${this.cpmkCounter}..." rows="2">${cpmk}</textarea>
        `;
        this.cpmkContainer.appendChild(cpmkItem);
      });
    }
  }

  saveRPS() {
    if (!this.validateForm()) {
      return;
    }

    const formData = new FormData(this.rpsForm);
    const rpsData = {
      id: this.currentEditId || this.generateId(),
      courseCode: formData.get('courseCode'),
      courseName: formData.get('courseName'),
      credits: formData.get('credits'),
      semester: formData.get('semester'),
      lecturer: formData.get('lecturer'),
      prerequisites: formData.get('prerequisites'),
      description: formData.get('courseDescription'),
      cpl: formData.getAll('cpl[]'),
      cpmk: formData.getAll('cpmk[]').filter(cpmk => cpmk.trim() !== ''),
      status: this.currentEditId ? this.getRPSById(this.currentEditId)?.status || 'draft' : 'draft',
      lastModified: new Date().toISOString()
    };

    this.showLoading();
    
    // Simulate API call
    setTimeout(() => {
      if (this.currentEditId) {
        this.updateRPS(rpsData);
        this.showNotification('RPS berhasil diupdate', 'success');
      } else {
        this.addRPSToData(rpsData);
        this.showNotification('RPS berhasil ditambahkan', 'success');
      }
      
      this.hideLoading();
      this.closeModals();
      this.refreshTable();
    }, 1000);
  }

  validateForm() {
    const requiredFields = this.rpsForm.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        field.classList.add('error');
        isValid = false;
      } else {
        field.classList.remove('error');
      }
    });

    // Validate CPMK
    const cpmkTextareas = this.cpmkContainer.querySelectorAll('textarea');
    const hasValidCPMK = Array.from(cpmkTextareas).some(textarea => textarea.value.trim() !== '');
    
    if (!hasValidCPMK) {
      this.showNotification('Minimal harus ada 1 CPMK yang diisi', 'error');
      isValid = false;
    }

    if (!isValid) {
      this.showNotification('Mohon lengkapi semua field yang wajib diisi', 'error');
    }

    return isValid;
  }

  // Table Management
  filterTable() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const semesterFilter = document.getElementById('semesterFilter')?.value || '';
    const statusFilter = document.getElementById('statusFilter')?.value || '';

    const rows = this.rpsTable.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
      const courseCode = row.querySelector('.course-code')?.textContent.toLowerCase() || '';
      const courseName = row.querySelector('.course-title h4')?.textContent.toLowerCase() || '';
      const semester = row.querySelector('.semester-badge')?.textContent.toLowerCase() || '';
      const status = row.querySelector('.status-badge')?.textContent.toLowerCase() || '';

      const matchesSearch = courseCode.includes(searchTerm) || courseName.includes(searchTerm);
      const matchesSemester = !semesterFilter || semester === semesterFilter.toLowerCase();
      const matchesStatus = !statusFilter || status === statusFilter.toLowerCase();

      const shouldShow = matchesSearch && matchesSemester && matchesStatus;
      row.style.display = shouldShow ? '' : 'none';
    });

    this.updatePaginationInfo();
  }

  refreshTable() {
    this.showLoading();
    
    setTimeout(() => {
      this.loadRPSData();
      this.hideLoading();
      this.showNotification('Data berhasil diperbarui', 'success');
    }, 500);
  }

  // Selection Management
  toggleSelectAll(checked) {
    const checkboxes = this.rpsTable.querySelectorAll('.row-select');
    checkboxes.forEach(checkbox => {
      checkbox.checked = checked;
      this.toggleRowSelection(checkbox, false);
    });
    this.updateBulkActions();
  }

  toggleRowSelection(checkbox, updateSelectAll = true) {
    const row = checkbox.closest('tr');
    const rpsId = this.getRPSIdFromRow(row);

    if (checkbox.checked) {
      this.selectedRows.add(rpsId);
      row.classList.add('selected');
    } else {
      this.selectedRows.delete(rpsId);
      row.classList.remove('selected');
    }

    if (updateSelectAll) {
      this.updateSelectAllCheckbox();
    }
    
    this.updateBulkActions();
  }

  updateSelectAllCheckbox() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const checkboxes = this.rpsTable.querySelectorAll('.row-select');
    const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
    
    if (checkedCount === 0) {
      selectAllCheckbox.checked = false;
      selectAllCheckbox.indeterminate = false;
    } else if (checkedCount === checkboxes.length) {
      selectAllCheckbox.checked = true;
      selectAllCheckbox.indeterminate = false;
    } else {
      selectAllCheckbox.checked = false;
      selectAllCheckbox.indeterminate = true;
    }
  }

  updateBulkActions() {
    const selectedCount = this.selectedRows.size;
    const bulkActionsBar = document.getElementById('bulkActionsBar');
    const selectedCountSpan = document.getElementById('selectedCount');

    if (selectedCount > 0) {
      bulkActionsBar.style.display = 'flex';
      selectedCountSpan.textContent = selectedCount;
    } else {
      bulkActionsBar.style.display = 'none';
    }
  }

  // CRUD Operations
  viewRPS(rpsId) {
    console.log('View RPS:', rpsId);
    // Implement view functionality
    this.showNotification('Fitur view RPS akan segera tersedia', 'info');
  }

  editRPS(rpsId) {
    console.log('Edit RPS:', rpsId);
    this.showRPSModal('edit', rpsId);
  }

  copyRPS(rpsId) {
    console.log('Copy RPS:', rpsId);
    const rpsData = this.getRPSById(rpsId);
    if (rpsData) {
      const newRPS = {
        ...rpsData,
        id: this.generateId(),
        courseCode: rpsData.courseCode + '_copy',
        courseName: rpsData.courseName + ' (Copy)',
        status: 'draft',
        lastModified: new Date().toISOString()
      };
      
      this.addRPSToData(newRPS);
      this.refreshTable();
      this.showNotification('RPS berhasil diduplikasi', 'success');
    }
  }

  deleteRPS(rpsId) {
    this.showConfirmModal(
      'Hapus RPS',
      'Apakah Anda yakin ingin menghapus RPS ini? Tindakan ini tidak dapat dibatalkan.',
      () => this.performDelete(rpsId)
    );
  }

  performDelete(rpsId) {
    this.showLoading();
    
    setTimeout(() => {
      this.removeRPSFromData(rpsId);
      this.hideLoading();
      this.closeModals();
      this.refreshTable();
      this.showNotification('RPS berhasil dihapus', 'success');
    }, 500);
  }

  // Bulk Operations
  bulkExport() {
    const selectedIds = Array.from(this.selectedRows);
    console.log('Bulk export:', selectedIds);
    this.showNotification(`Mengekspor ${selectedIds.length} RPS...`, 'info');
  }

  bulkArchive() {
    const selectedIds = Array.from(this.selectedRows);
    console.log('Bulk archive:', selectedIds);
    this.showNotification(`Mengarsipkan ${selectedIds.length} RPS...`, 'info');
  }

  bulkDelete() {
    this.showConfirmModal(
      'Hapus Multiple RPS',
      `Apakah Anda yakin ingin menghapus ${this.selectedRows.size} RPS yang dipilih?`,
      () => this.performBulkDelete()
    );
  }

  performBulkDelete() {
    this.showLoading();
    
    setTimeout(() => {
      this.selectedRows.forEach(rpsId => {
        this.removeRPSFromData(rpsId);
      });
      
      this.selectedRows.clear();
      this.hideLoading();
      this.closeModals();
      this.refreshTable();
      this.updateBulkActions();
      this.showNotification('RPS yang dipilih berhasil dihapus', 'success');
    }, 1000);
  }

  // Data Management
  loadRPSData() {
    // Simulate loading data from API
    this.rpsData = [
      {
        id: '1',
        courseCode: 'AKT2201',
        courseName: 'Akuntansi Sektor Publik',
        credits: '3',
        semester: 'genap',
        lecturer: 'Dr. Zulfatun Ruscitasari, S.E., M.Acc.',
        status: 'active',
        cpmk: ['CPMK 1 description', 'CPMK 2 description', 'CPMK 3 description'],
        lastModified: '2024-03-15T10:30:00Z'
      },
      {
        id: '2',
        courseCode: 'MNG3201',
        courseName: 'Manajemen Strategis',
        credits: '3',
        semester: 'genap',
        lecturer: 'Dr. Ahmad Suryadi, M.M.',
        status: 'draft',
        cpmk: ['CPMK 1 description', 'CPMK 2 description', 'CPMK 3 description'],
        lastModified: '2024-03-12T14:15:00Z'
      }
    ];
  }

  getRPSById(rpsId) {
    return this.rpsData.find(rps => rps.id === rpsId);
  }

  getRPSIdFromRow(row) {
    // Extract RPS ID from row (in real implementation, this would be in a data attribute)
    const courseCode = row.querySelector('.course-code')?.textContent;
    return this.rpsData.find(rps => rps.courseCode === courseCode)?.id;
  }

  addRPSToData(rpsData) {
    this.rpsData.push(rpsData);
  }

  updateRPS(rpsData) {
    const index = this.rpsData.findIndex(rps => rps.id === rpsData.id);
    if (index !== -1) {
      this.rpsData[index] = rpsData;
    }
  }

  removeRPSFromData(rpsId) {
    this.rpsData = this.rpsData.filter(rps => rps.id !== rpsId);
  }

  // Utility Functions
  generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  exportData() {
    console.log('Exporting all RPS data');
    this.showNotification('Mengekspor data RPS...', 'info');
  }

  updatePaginationInfo() {
    const visibleRows = this.rpsTable.querySelectorAll('tbody tr:not([style*="display: none"])');
    const paginationInfo = document.querySelector('.pagination-info');
    if (paginationInfo) {
      paginationInfo.innerHTML = `Menampilkan <strong>1-${visibleRows.length}</strong> dari <strong>${visibleRows.length}</strong> RPS`;
    }
  }

  showConfirmModal(title, message, onConfirm) {
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMessage').textContent = message;
    
    // Store the callback
    this.confirmCallback = onConfirm;
    
    this.confirmModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  confirmDelete() {
    if (this.confirmCallback) {
      this.confirmCallback();
      this.confirmCallback = null;
    }
  }

  showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
  }

  hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
  }

  showNotification(message, type = 'info') {
    // Use the notification system from the main script
    if (window.obaSystem) {
      window.obaSystem.showNotification(message, type);
    } else {
      console.log(`${type}: ${message}`);
    }
  }
}

// Initialize Manajemen RPS when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('rpsTable')) {
    window.manajemenRPS = new ManajemenRPS();
  }
});