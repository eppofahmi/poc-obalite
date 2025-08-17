// OBA System JavaScript
// UNU Yogyakarta - Outcome-Based Assessment System

class OBASystem {
  constructor() {
    this.init();
    this.bindEvents();
    this.loadDashboardData();
  }

  init() {
    // Initialize system components
    this.currentUser = {
      name: 'Dr. Admin',
      role: 'Academic Admin',
      permissions: ['create_rps', 'upload_files', 'view_reports', 'manage_users']
    };
    
    this.notifications = [];
    this.dashboardData = {};
    
    console.log('OBA System initialized');
  }

  bindEvents() {
    // Navigation events
    this.bindNavigationEvents();
    
    // Modal events
    this.bindModalEvents();
    
    // Form events
    this.bindFormEvents();
    
    // File upload events
    this.bindFileUploadEvents();
    
    // Dashboard interaction events
    this.bindDashboardEvents();
  }

  bindNavigationEvents() {
    // Sidebar navigation
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        this.navigate(href);
      });
    });

    // Mobile sidebar toggle
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', () => {
        document.querySelector('.sidebar').classList.toggle('open');
      });
    }

    // User dropdown
    document.querySelectorAll('.dropdown-content a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const action = link.getAttribute('href').substring(1);
        this.handleUserAction(action);
      });
    });
  }

  bindModalEvents() {
    // Modal close events
    document.querySelectorAll('.modal-close').forEach(closeBtn => {
      closeBtn.addEventListener('click', () => {
        this.closeModal();
      });
    });

    // Modal background click to close
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal();
        }
      });
    });

    // Modal buttons
    document.getElementById('modalCancel')?.addEventListener('click', () => {
      this.closeModal();
    });

    document.getElementById('modalConfirm')?.addEventListener('click', () => {
      this.handleModalConfirm();
    });
  }

  bindFormEvents() {
    // Form validation and submission
    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleFormSubmission(form);
      });
    });

    // Dynamic form fields
    document.addEventListener('change', (e) => {
      if (e.target.classList.contains('dynamic-field')) {
        this.handleDynamicFieldChange(e.target);
      }
    });
  }

  bindFileUploadEvents() {
    // File input events
    document.querySelectorAll('input[type="file"]').forEach(input => {
      input.addEventListener('change', (e) => {
        this.handleFileUpload(e.target);
      });
    });

    // Drag and drop functionality
    document.querySelectorAll('.file-drop-zone').forEach(zone => {
      zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('drag-over');
      });

      zone.addEventListener('dragleave', () => {
        zone.classList.remove('drag-over');
      });

      zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        this.handleFileDrop(e.dataTransfer.files, zone);
      });
    });
  }

  bindDashboardEvents() {
    // Quick action buttons
    document.querySelectorAll('.action-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.querySelector('span').textContent.trim();
        this.handleQuickAction(action);
      });
    });

    // Progress bar animations
    this.animateProgressBars();
    
    // Auto-refresh dashboard data
    setInterval(() => {
      this.refreshDashboardData();
    }, 30000); // Refresh every 30 seconds
  }

  // Navigation
  navigate(route) {
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });

    // Add active class to current nav item
    const currentNavItem = document.querySelector(`a[href="${route}"]`)?.closest('.nav-item');
    if (currentNavItem) {
      currentNavItem.classList.add('active');
    }

    // Update breadcrumb
    this.updateBreadcrumb(route);

    // Load content based on route
    this.loadContent(route);

    console.log(`Navigated to: ${route}`);
  }

  updateBreadcrumb(route) {
    const breadcrumb = document.querySelector('.breadcrumb');
    const routeNames = {
      '#dashboard': 'Dashboard',
      '#manajemen-rps': 'Manajemen RPS'
    };

    if (breadcrumb && routeNames[route]) {
      breadcrumb.textContent = routeNames[route];
    }
  }

  loadContent(route) {
    // Simulate content loading
    this.showLoading();
    
    setTimeout(() => {
      this.hideLoading();
      // Here you would load the actual content for the route
      console.log(`Loading content for: ${route}`);
    }, 500);
  }

  // Modal Management
  showModal(title, content, confirmText = 'Confirm', cancelText = 'Cancel') {
    const modal = document.getElementById('genericModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalConfirm = document.getElementById('modalConfirm');
    const modalCancel = document.getElementById('modalCancel');

    if (modal && modalTitle && modalBody) {
      modalTitle.textContent = title;
      modalBody.innerHTML = content;
      modalConfirm.textContent = confirmText;
      modalCancel.textContent = cancelText;
      
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal() {
    const modal = document.getElementById('genericModal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  }

  handleModalConfirm() {
    // Handle modal confirmation based on current context
    console.log('Modal confirmed');
    this.closeModal();
  }

  // Loading States
  showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
      overlay.style.display = 'flex';
    }
  }

  hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
  }

  // File Handling
  handleFileUpload(input) {
    const files = input.files;
    if (files.length > 0) {
      this.processFiles(files);
    }
  }

  handleFileDrop(files, dropZone) {
    this.processFiles(files);
  }

  processFiles(files) {
    this.showLoading();
    
    Array.from(files).forEach(file => {
      console.log(`Processing file: ${file.name}`);
      
      // Validate file type
      if (this.validateFile(file)) {
        this.uploadFile(file);
      } else {
        this.showNotification(`Invalid file type: ${file.name}`, 'error');
      }
    });
  }

  validateFile(file) {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'application/pdf',
      'text/csv'
    ];
    
    return allowedTypes.includes(file.type);
  }

  uploadFile(file) {
    // Simulate file upload
    const formData = new FormData();
    formData.append('file', file);
    
    // Here you would make an actual API call
    setTimeout(() => {
      this.hideLoading();
      this.showNotification(`File uploaded successfully: ${file.name}`, 'success');
      this.refreshDashboardData();
    }, 2000);
  }

  // Form Handling
  handleFormSubmission(form) {
    const formData = new FormData(form);
    const formType = form.getAttribute('data-form-type');
    
    this.showLoading();
    
    // Validate form
    if (this.validateForm(form)) {
      this.submitForm(formData, formType);
    } else {
      this.hideLoading();
      this.showNotification('Please fill in all required fields', 'error');
    }
  }

  validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        field.classList.add('error');
      } else {
        field.classList.remove('error');
      }
    });
    
    return isValid;
  }

  submitForm(formData, formType) {
    // Simulate form submission
    setTimeout(() => {
      this.hideLoading();
      this.showNotification(`${formType} saved successfully`, 'success');
    }, 1500);
  }

  handleDynamicFieldChange(field) {
    // Handle dynamic field changes (e.g., CPMK selection updates)
    const fieldType = field.getAttribute('data-field-type');
    console.log(`Dynamic field changed: ${fieldType}`, field.value);
  }

  // Quick Actions
  handleQuickAction(action) {
    const actions = {
      'Buat RPS': () => this.navigate('#manajemen-rps'),
      'Upload Data': () => this.showUploadModal(),
      'Generate Report': () => this.generateReport(),
      'Print Queue': () => this.showPrintQueue()
    };
    
    if (actions[action]) {
      actions[action]();
    } else {
      console.log(`Unknown action: ${action}`);
    }
  }

  generateReport() {
    this.showModal(
      'Generate Report',
      `
      <div class="form-group">
        <label>Report Type:</label>
        <select class="form-control">
          <option>Course Progress Report</option>
          <option>CPMK Achievement Report</option>
          <option>Portfolio Summary</option>
        </select>
      </div>
      <div class="form-group">
        <label>Date Range:</label>
        <input type="date" class="form-control">
      </div>
      `,
      'Generate',
      'Cancel'
    );
  }

  // User Actions
  handleUserAction(action) {
    const actions = {
      'profile': () => this.showUserProfile(),
      'settings': () => this.showSettings(),
      'logout': () => this.logout()
    };
    
    if (actions[action]) {
      actions[action]();
    }
  }

  showUserProfile() {
    this.showModal(
      'User Profile',
      `
      <div class="profile-info">
        <div class="profile-avatar">
          <i class="fas fa-user"></i>
        </div>
        <div class="profile-details">
          <h4>${this.currentUser.name}</h4>
          <p>${this.currentUser.role}</p>
        </div>
      </div>
      `
    );
  }

  showSettings() {
    this.navigate('#settings');
  }

  logout() {
    if (confirm('Are you sure you want to logout?')) {
      // Handle logout
      console.log('User logged out');
      window.location.href = '/login';
    }
  }

  // Dashboard Data Management
  loadDashboardData() {
    this.dashboardData = {
      stats: {
        totalCourses: 45,
        activeLecturers: 28,
        rpsCompleted: 32,
        assessmentsDone: 18
      },
      recentActivities: [
        {
          user: 'Dr. Sari',
          action: 'uploaded grade template for AKT2201',
          time: '2 hours ago',
          icon: 'upload'
        },
        {
          user: 'Admin',
          action: 'created RPS for Akuntansi Sektor Publik',
          time: '4 hours ago',
          icon: 'file-alt'
        }
      ],
      courseProgress: [
        { code: 'AKT2201', name: 'Akuntansi Sektor Publik', progress: 85 },
        { code: 'MNG3201', name: 'Manajemen Strategis', progress: 60 },
        { code: 'EKO1101', name: 'Mikroekonomi', progress: 40 }
      ]
    };
    
    this.updateDashboardDisplay();
  }

  refreshDashboardData() {
    // Simulate data refresh
    console.log('Refreshing dashboard data...');
    // Here you would make API calls to get fresh data
  }

  updateDashboardDisplay() {
    // Update statistics
    this.updateStatistics();
    
    // Update progress bars
    this.updateProgressBars();
    
    // Update activity feed
    this.updateActivityFeed();
  }

  updateStatistics() {
    const stats = this.dashboardData.stats;
    document.querySelectorAll('.stat-card').forEach((card, index) => {
      const value = Object.values(stats)[index];
      const h3 = card.querySelector('h3');
      if (h3 && value !== undefined) {
        this.animateNumber(h3, parseInt(h3.textContent) || 0, value);
      }
    });
  }

  updateProgressBars() {
    const progressItems = document.querySelectorAll('.progress-item');
    this.dashboardData.courseProgress.forEach((course, index) => {
      if (progressItems[index]) {
        const progressFill = progressItems[index].querySelector('.progress-fill');
        const progressPercentage = progressItems[index].querySelector('.progress-percentage');
        
        if (progressFill && progressPercentage) {
          setTimeout(() => {
            progressFill.style.width = `${course.progress}%`;
            progressPercentage.textContent = `${course.progress}%`;
          }, index * 200);
        }
      }
    });
  }

  updateActivityFeed() {
    // Update recent activities
    // This would typically involve fetching new activities and updating the DOM
  }

  animateProgressBars() {
    document.querySelectorAll('.progress-fill').forEach((fill, index) => {
      const width = fill.style.width;
      fill.style.width = '0%';
      setTimeout(() => {
        fill.style.width = width;
      }, index * 200);
    });
  }

  animateNumber(element, start, end) {
    const duration = 1000;
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const current = Math.floor(start + (end - start) * progress);
      element.textContent = current;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }

  // Notifications
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <span>${message}</span>
      <button class="notification-close">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.remove();
    }, 5000);
    
    // Manual close
    notification.querySelector('.notification-close').addEventListener('click', () => {
      notification.remove();
    });
  }

  // Grade Calculations (for OBA system)
  calculateFinalGrade(assessmentScores, weights) {
    let totalScore = 0;
    let totalWeight = 0;
    
    for (let component in assessmentScores) {
      if (weights[component] && assessmentScores[component] !== null) {
        totalScore += assessmentScores[component] * (weights[component] / 100);
        totalWeight += weights[component] / 100;
      }
    }
    
    const finalScore = totalWeight > 0 ? totalScore / totalWeight : 0;
    return {
      numeric: Math.round(finalScore * 100) / 100,
      letter: this.convertToLetterGrade(finalScore)
    };
  }

  convertToLetterGrade(score) {
    if (score >= 85) return 'A';
    if (score >= 80) return 'A-';
    if (score >= 75) return 'B+';
    if (score >= 70) return 'B';
    if (score >= 65) return 'B-';
    if (score >= 60) return 'C+';
    if (score >= 55) return 'C';
    if (score >= 50) return 'C-';
    if (score >= 45) return 'D+';
    if (score >= 40) return 'D';
    return 'E';
  }

  // CPMK Analysis
  analyzeCPMKAchievement(studentGrades, cpmkMapping) {
    const cpmkScores = {};
    
    // Calculate average scores for each CPMK
    for (let cpmk in cpmkMapping) {
      const relatedQuestions = cpmkMapping[cpmk];
      let totalScore = 0;
      let questionCount = 0;
      
      relatedQuestions.forEach(questionId => {
        if (studentGrades[questionId] !== undefined) {
          totalScore += studentGrades[questionId];
          questionCount++;
        }
      });
      
      cpmkScores[cpmk] = questionCount > 0 ? totalScore / questionCount : 0;
    }
    
    return cpmkScores;
  }

  // Utility Functions
  formatDate(date) {
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }
}

// Initialize the OBA System when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.obaSystem = new OBASystem();
  
  // Add notification styles if they don't exist
  if (!document.querySelector('.notification-styles')) {
    const style = document.createElement('style');
    style.className = 'notification-styles';
    style.textContent = `
      .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: slideIn 0.3s ease;
      }
      
      .notification-success { background-color: #10b981; }
      .notification-error { background-color: #ef4444; }
      .notification-warning { background-color: #f59e0b; }
      .notification-info { background-color: #3b82f6; }
      
      .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        margin-left: 15px;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }
});