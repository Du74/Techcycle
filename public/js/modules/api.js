// ===== MÓDULO DE API =====
// Centraliza todas as chamadas fetch para o servidor

const API = {
  // ===== AUTENTICAÇÃO =====
  async register(email, senha) {
    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });
      
      let data;
      try {
        data = await response.json();
      } catch (e) {
        const text = await response.text();
        console.error('Resposta não-JSON do servidor:', text);
        return { success: false, message: `Erro no servidor (${response.status})` };
      }
      
      if (response.ok) {
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.error || data.details || 'Erro desconhecido' };
      }
    } catch (error) {
      console.error('Erro no registro:', error);
      return { success: false, message: 'Erro de conexão: ' + error.message };
    }
  },

  async login(email, senha) {
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });
      
      let data;
      try {
        data = await response.json();
      } catch (e) {
        const text = await response.text();
        console.error('Resposta não-JSON do servidor:', text);
        return { success: false, message: `Erro no servidor (${response.status})` };
      }
      
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.usuario));
        return { success: true, message: data.message, user: data.usuario };
      } else {
        return { success: false, message: data.error || data.details || 'Erro desconhecido' };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, message: 'Erro de conexão: ' + error.message };
    }
  },

  async solicitarRecuperacao(email) {
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
  },

  // ===== CHAMADOS =====
  async listarChamados() {
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
  },

  async criarChamado(dados) {
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
  },

  async deletarChamado(id) {
    try {
      const response = await fetch(`/chamados/${id}`, { method: 'DELETE' });
      return { success: response.ok };
    } catch (error) {
      console.error('Erro ao deletar chamado:', error);
      return { success: false };
    }
  },

  async deletarTodosChamados() {
    try {
      const response = await fetch('/chamados', { method: 'DELETE' });
      const data = await response.json();
      return { success: response.ok, count: data.deletedCount };
    } catch (error) {
      console.error('Erro ao limpar chamados:', error);
      return { success: false, count: 0 };
    }
  },

  async obterEstatisticas() {
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
};

// Exportar para uso global
window.API = API;
