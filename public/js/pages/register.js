// ===== SCRIPT DA PÁGINA DE REGISTRO =====

document.addEventListener('DOMContentLoaded', function() {
  // Carregar tema salvo
  Utils.loadSavedTheme();
  
  // Inicializar eventos de formulário de cadastro
  const senhaInput = document.getElementById('senha');
  const confirmarInput = document.getElementById('confirmarSenha');
  
  if (senhaInput) {
    senhaInput.addEventListener('input', () => Utils.updatePasswordStrength());
  }
  
  if (confirmarInput) {
    confirmarInput.addEventListener('input', () => Utils.checkPasswordMatch());
  }
  
  // Inicializar formulário de registro
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const senha = document.getElementById('senha').value;
      const confirmar = document.getElementById('confirmarSenha').value;
      const errorMsg = document.getElementById('errorMsg');
      const successMsg = document.getElementById('successMsg');
      
      if (senha !== confirmar) {
        if (errorMsg) {
          errorMsg.textContent = 'As senhas não coincidem!';
          errorMsg.style.display = 'block';
        }
        return;
      }
      
      if (senha.length < 6) {
        if (errorMsg) {
          errorMsg.textContent = 'A senha deve ter pelo menos 6 caracteres!';
          errorMsg.style.display = 'block';
        }
        return;
      }
      
      const result = await API.register(email, senha);
      
      if (result.success) {
        if (successMsg) {
          successMsg.textContent = result.message + ' Redirecionando...';
          successMsg.style.display = 'block';
        }
        if (errorMsg) errorMsg.style.display = 'none';
        
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        if (errorMsg) {
          errorMsg.textContent = result.message;
          errorMsg.style.display = 'block';
        }
        if (successMsg) successMsg.style.display = 'none';
      }
    });
  }
});
