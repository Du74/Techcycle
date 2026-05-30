// ===== MÓDULO DE UTILITÁRIOS =====
// Funções auxiliares compartilhadas entre páginas

const Utils = {
  // ===== AUTENTICAÇÃO =====
  logout() {
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  checkAuth() {
    const user = localStorage.getItem('user');
    const currentPage = window.location.pathname;
    
    const publicPages = ['/login', '/register', '/', '/introducao_techcycle.html', '/about', '/about.html'];
    
    const isPublicPage = publicPages.some(page => currentPage.includes(page));
    
    if (!user && !isPublicPage) {
      window.location.href = '/login';
      return false;
    }
    
    return true;
  },

  // ===== TEMA =====
  toggleTheme() {
    const body = document.body;
    const isLightTheme = body.classList.contains('light-theme');
    
    if (isLightTheme) {
      body.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
      this.updateThemeIcon('dark');
    } else {
      body.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
      this.updateThemeIcon('light');
    }
  },

  updateThemeIcon(theme) {
    const themeIcons = document.querySelectorAll('.theme-toggle i');
    themeIcons.forEach(icon => {
      if (theme === 'light') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
      } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
      }
    });
  },

  loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
      this.updateThemeIcon('light');
    } else {
      document.body.classList.remove('light-theme');
      this.updateThemeIcon('dark');
    }
  },

  // ===== FORMATAÇÃO =====
  formatarData(dataString) {
    if (!dataString) return '-';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  },

  getStatusClass(status) {
    if (status === 'Concluído') return 'badge-completed';
    if (status === 'Processando') return 'badge-processing';
    return 'badge-pending';
  },

  getStatusText(status) {
    return status || 'Pendente';
  },

  // ===== VALIDAÇÃO DE SENHA =====
  checkPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    return 'strong';
  },

  updatePasswordStrength() {
    const senhaInput = document.getElementById('senha');
    const strengthFill = document.getElementById('passwordStrength');
    
    if (senhaInput && strengthFill) {
      const strength = this.checkPasswordStrength(senhaInput.value);
      
      strengthFill.classList.remove('strength-weak', 'strength-medium', 'strength-strong');
      
      if (strength === 'weak') {
        strengthFill.classList.add('strength-weak');
        strengthFill.style.width = '33%';
      } else if (strength === 'medium') {
        strengthFill.classList.add('strength-medium');
        strengthFill.style.width = '66%';
      } else if (strength === 'strong') {
        strengthFill.classList.add('strength-strong');
        strengthFill.style.width = '100%';
      } else {
        strengthFill.style.width = '0%';
      }
    }
  },

  checkPasswordMatch() {
    const senha = document.getElementById('senha');
    const confirmar = document.getElementById('confirmarSenha');
    const matchDiv = document.getElementById('passwordMatch');
    
    if (senha && confirmar && matchDiv) {
      if (confirmar.value !== '') {
        if (senha.value === confirmar.value) {
          matchDiv.style.display = 'block';
        } else {
          matchDiv.style.display = 'none';
        }
      } else {
        matchDiv.style.display = 'none';
      }
    }
  }
};

// Exportar para uso global
window.Utils = Utils;
