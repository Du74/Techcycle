// ===== SCRIPT DA PÁGINA DE LOGIN =====

document.addEventListener('DOMContentLoaded', function() {
  // Carregar tema salvo
  Utils.loadSavedTheme();
  
  // Inicializar formulário de login
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const senha = document.getElementById('password').value;
      const errorMsg = document.getElementById('errorMsg');
      
      const result = await API.login(email, senha);
      
      if (result.success) {
        window.location.href = '/dashboard';
      } else {
        if (errorMsg) {
          errorMsg.textContent = result.message;
          errorMsg.style.display = 'block';
        }
      }
    });
  }
  
  // Inicializar botão de recuperação de senha
  const sendResetLink = document.getElementById('sendResetLink');
  if (sendResetLink) {
    sendResetLink.addEventListener('click', async () => {
      const email = document.getElementById('resetEmail').value;
      const resetMessage = document.getElementById('resetMessage');
      
      if (!email) {
        if (resetMessage) {
          resetMessage.innerHTML = '<div class="alert alert-danger">Digite seu email!</div>';
          resetMessage.style.display = 'block';
        }
        return;
      }
      
      sendResetLink.disabled = true;
      sendResetLink.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
      
      const result = await API.solicitarRecuperacao(email);
      
      if (resetMessage) {
        if (result.success) {
          resetMessage.innerHTML = '<div class="alert alert-success">✓ ' + result.message + '</div>';
        } else {
          resetMessage.innerHTML = '<div class="alert alert-danger">❌ ' + result.message + '</div>';
        }
        resetMessage.style.display = 'block';
      }
      
      setTimeout(() => {
        sendResetLink.disabled = false;
        sendResetLink.innerHTML = 'Enviar Link';
      }, 3000);
    });
  }
});
