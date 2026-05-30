// ===== SCRIPT DA PÁGINA DE DASHBOARD =====

let modalLimpar, modalTodos;

document.addEventListener('DOMContentLoaded', function() {
  // Verificar autenticação
  Utils.checkAuth();
  
  // Carregar tema salvo
  Utils.loadSavedTheme();
  
  // Configurar data atual
  configurarDataAtual();
  
  // Carregar dados iniciais
  carregarEstatisticas();
  carregarChamadosRecentes();
  
  // Inicializar modais
  modalLimpar = new bootstrap.Modal(document.getElementById('confirmarLimparModal'));
  modalTodos = new bootstrap.Modal(document.getElementById('todosChamadosModal'));
  
  // Configurar formulário de chamado
  const chamadoForm = document.getElementById('chamadoForm');
  if (chamadoForm) {
    chamadoForm.addEventListener('submit', handleSubmitChamado);
  }
});

function configurarDataAtual() {
  const hoje = new Date().toISOString().split('T')[0];
  const dataInput = document.getElementById('dataAbertura');
  if (dataInput) dataInput.value = hoje;
}

function toggleSidebar() {
  document.querySelector('.sidebar-modern').classList.toggle('active');
}

async function handleSubmitChamado(e) {
  e.preventDefault();
  
  const btn = e.target.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;
  
  const formData = {
    nome_chamado: document.getElementById('nomeChamado').value,
    tipo: document.getElementById('tipo').value,
    marca: document.getElementById('marca').value,
    data_abertura: document.getElementById('dataAbertura').value,
    dashboard: document.getElementById('dashboard').value,
    problema: document.getElementById('problema').value
  };

  try {
    btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Registrando...';
    btn.disabled = true;

    const result = await API.criarChamado(formData);
    
    if (result.success) {
      document.getElementById('chamadoForm').reset();
      configurarDataAtual();
      carregarEstatisticas();
      carregarChamadosRecentes();
      
      btn.innerHTML = '<i class="fas fa-check me-2"></i>Registrado!';
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }, 2000);
    } else {
      throw new Error('Erro ao registrar');
    }
  } catch (error) {
    alert('❌ Erro ao registrar chamado');
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}

async function carregarEstatisticas() {
  try {
    const data = await API.obterEstatisticas();
    
    if (data) {
      document.getElementById('totalChamados').textContent = data.total;
      document.getElementById('chamadosPendentes').textContent = data.pendentes;
      document.getElementById('chamadosConcluidos').textContent = data.concluidos;
      document.getElementById('taxaSucesso').textContent = data.taxaSucesso + '%';
      
      document.getElementById('headerTotal').textContent = data.total;
      document.getElementById('headerPendentes').textContent = data.pendentes;
      document.getElementById('headerConcluidos').textContent = data.concluidos;
      document.getElementById('headerSucesso').textContent = data.taxaSucesso + '%';
    }
  } catch (error) {
    console.error('Erro:', error);
  }
}

async function carregarChamadosRecentes() {
  try {
    const chamados = await API.listarChamados();
    const tbody = document.getElementById('tabelaChamados');
    
    if (chamados.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="text-center">Nenhum chamado encontrado</td></tr>';
      return;
    }
    
    tbody.innerHTML = '';
    chamados.slice(0, 5).forEach(chamado => {
      tbody.innerHTML += `
        <tr>
          <td>#${chamado.id}</td>
          <td>${chamado.nome_chamado}</td>
          <td><span class="badge badge-pending">${chamado.status || 'Pendente'}</span></td>
          <td>${Utils.formatarData(chamado.data_abertura)}</td>
        </tr>
      `;
    });
  } catch (error) {
    console.error('Erro:', error);
  }
}

async function carregarTodosChamados() {
  try {
    const chamados = await API.listarChamados();
    const tbody = document.getElementById('todosChamadosBody');
    
    if (chamados.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center">Nenhum chamado encontrado</td></tr>';
      return 0;
    }
    
    tbody.innerHTML = '';
    chamados.forEach(chamado => {
      tbody.innerHTML += `
        <tr>
          <td>#${chamado.id}</td>
          <td>${chamado.nome_chamado}</td>
          <td>${chamado.tipo}</td>
          <td>${chamado.marca}</td>
          <td><span class="badge badge-pending">${chamado.status || 'Pendente'}</span></td>
          <td>${Utils.formatarData(chamado.data_abertura)}</td>
          <td><button class="btn btn-sm btn-danger" onclick="deletarChamado(${chamado.id})"><i class="fas fa-trash"></i></button></td>
        </tr>
      `;
    });
    
    document.getElementById('totalChamadosCount').textContent = chamados.length;
    return chamados.length;
  } catch (error) {
    return 0;
  }
}

async function deletarChamado(id) {
  if (!confirm(`Deletar chamado #${id}?`)) return;
  const result = await API.deletarChamado(id);
  if (result.success) {
    carregarTodosChamados();
    carregarEstatisticas();
    carregarChamadosRecentes();
  }
}

async function limparTodosChamados() {
  const result = await API.deletarTodosChamados();
  if (result.success) {
    modalLimpar.hide();
    modalTodos.hide();
    carregarEstatisticas();
    carregarChamadosRecentes();
    alert('Todos os chamados foram removidos!');
  }
}

async function abrirTodosChamados() {
  await carregarTodosChamados();
  modalTodos.show();
}

async function abrirModalLimpar() {
  const total = await carregarTodosChamados();
  if (total > 0) modalLimpar.show();
  else alert('Não há chamados para limpar.');
}

// Exportar funções para uso global
window.toggleSidebar = toggleSidebar;
window.deletarChamado = deletarChamado;
window.limparTodosChamados = limparTodosChamados;
window.abrirTodosChamados = abrirTodosChamados;
window.abrirModalLimpar = abrirModalLimpar;
