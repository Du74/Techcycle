// script.js - Funcionalidades globais

// ===== FUNÇÃO PARA ALTERNAR TEMA =====
function toggleTheme() {
    const body = document.body;
    const isLightTheme = body.classList.contains('light-theme');
    
    if (isLightTheme) {
        body.classList.remove('light-theme');
        localStorage.setItem('theme', 'dark');
        updateThemeIcon('dark');
    } else {
        body.classList.add('light-theme');
        localStorage.setItem('theme', 'light');
        updateThemeIcon('light');
    }
}

// Função para atualizar o ícone do tema
function updateThemeIcon(theme) {
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
}

// Carregar tema salvo ao iniciar
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        updateThemeIcon('light');
    } else {
        document.body.classList.remove('light-theme');
        updateThemeIcon('dark');
    }
}

// ===== FUNÇÕES DE AUTENTICAÇÃO =====
async function registerUser(email, senha) {
    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            return { success: true, message: data.message };
        } else {
            return { success: false, message: data.error };
        }
    } catch (error) {
        console.error('Erro no registro:', error);
        return { success: false, message: 'Erro de conexão com o servidor' };
    }
}

async function loginUser(email, senha) {
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('user', JSON.stringify(data.usuario));
            return { success: true, message: data.message, user: data.usuario };
        } else {
            return { success: false, message: data.error };
        }
    } catch (error) {
        console.error('Erro no login:', error);
        return { success: false, message: 'Erro de conexão com o servidor' };
    }
}

function logout() {
    localStorage.removeItem('user');
    window.location.href = '/login';
}

function checkAuth() {
    const user = localStorage.getItem('user');
    const currentPage = window.location.pathname;
    
    const publicPages = ['/login', '/register', '/', '/introducao_techcycle.html', '/about', '/about.html'];
    
    const isPublicPage = publicPages.some(page => currentPage.includes(page));
    
    if (!user && !isPublicPage) {
        window.location.href = '/login';
        return false;
    }
    
    return true;
}

// ===== FUNÇÕES DE CHAMADOS =====
async function carregarChamados() {
    try {
        const response = await fetch('/chamados');
        if (response.ok) {
            return await response.json();
        }
        return [];
    } catch (error) {
        console.error('Erro ao carregar chamados:', error);
        return [];
    }
}

async function criarChamado(dados) {
    try {
        const response = await fetch('/chamados', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            return { success: true, id: data.id, message: data.message };
        } else {
            return { success: false, message: data.error };
        }
    } catch (error) {
        console.error('Erro ao criar chamado:', error);
        return { success: false, message: 'Erro de conexão' };
    }
}

async function deletarChamado(id) {
    try {
        const response = await fetch(`/chamados/${id}`, { method: 'DELETE' });
        return { success: response.ok };
    } catch (error) {
        console.error('Erro ao deletar chamado:', error);
        return { success: false };
    }
}

async function limparTodosChamados() {
    try {
        const response = await fetch('/chamados', { method: 'DELETE' });
        const data = await response.json();
        return { success: response.ok, count: data.deletedCount };
    } catch (error) {
        console.error('Erro ao limpar chamados:', error);
        return { success: false, count: 0 };
    }
}

async function carregarEstatisticas() {
    try {
        const response = await fetch('/estatisticas');
        if (response.ok) {
            return await response.json();
        }
        return null;
    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
        return null;
    }
}

// ===== FUNÇÕES DE RECUPERAÇÃO DE SENHA =====
async function solicitarRecuperacao(email) {
    try {
        const response = await fetch('/api/esqueci-senha', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        return { success: response.ok, message: data.message };
    } catch (error) {
        console.error('Erro ao solicitar recuperação:', error);
        return { success: false, message: 'Erro de conexão' };
    }
}

// ===== FUNÇÕES AUXILIARES =====
function formatarData(dataString) {
    if (!dataString) return '-';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
}

function getStatusClass(status) {
    if (status === 'Concluído') return 'badge-completed';
    if (status === 'Processando') return 'badge-processing';
    return 'badge-pending';
}

function getStatusText(status) {
    return status || 'Pendente';
}

function checkPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    return 'strong';
}

function updatePasswordStrength() {
    const senhaInput = document.getElementById('senha');
    const strengthFill = document.getElementById('passwordStrength');
    
    if (senhaInput && strengthFill) {
        const strength = checkPasswordStrength(senhaInput.value);
        
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
}

function checkPasswordMatch() {
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

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    // Carregar tema salvo
    loadSavedTheme();
    
    // Verificar autenticação
    checkAuth();
    
    // Configurar data atual nos formulários
    const dataInputs = document.querySelectorAll('input[type="date"]');
    if (dataInputs.length > 0 && !dataInputs[0].value) {
        const hoje = new Date().toISOString().split('T')[0];
        dataInputs.forEach(input => {
            if (!input.value) input.value = hoje;
        });
    }
    
    // Inicializar eventos de formulário de cadastro
    const senhaInput = document.getElementById('senha');
    const confirmarInput = document.getElementById('confirmarSenha');
    
    if (senhaInput) {
        senhaInput.addEventListener('input', updatePasswordStrength);
    }
    
    if (confirmarInput) {
        confirmarInput.addEventListener('input', checkPasswordMatch);
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
            
            const result = await registerUser(email, senha);
            
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
    
    // Inicializar formulário de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const senha = document.getElementById('password').value;
            const errorMsg = document.getElementById('errorMsg');
            
            const result = await loginUser(email, senha);
            
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
            
            const result = await solicitarRecuperacao(email);
            
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

// Exportar funções para uso global
window.toggleTheme = toggleTheme;
window.logout = logout;
window.carregarChamados = carregarChamados;
window.criarChamado = criarChamado;
window.deletarChamado = deletarChamado;
window.limparTodosChamados = limparTodosChamados;
window.carregarEstatisticas = carregarEstatisticas;
window.formatarData = formatarData;
window.getStatusClass = getStatusClass;
window.getStatusText = getStatusText;