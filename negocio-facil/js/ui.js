// js/ui.js

export function mostrarToast(mensagem, tipo = 'info') {
    const toastExistente = document.querySelector('.toast');
    if (toastExistente) {
        toastExistente.remove();
    }

    const toast = document.createElement('div');
    toast.classList.add('toast');
    
    switch(tipo) {
        case 'sucesso': toast.style.borderColor = '#28A745'; break;
        case 'erro': toast.style.borderColor = '#DC3545'; break;
        case 'aviso': toast.style.borderColor = '#FFC107'; break;
        default: toast.style.borderColor = 'var(--dourado)';
    }

    toast.textContent = mensagem;
    document.body.appendChild(toast);

    setTimeout(() => {
        if (document.body.contains(toast)) {
            toast.remove();
        }
    }, 3000);
}

// Funções genéricas de modal
export function abrirModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        // Modais diferentes têm 'display' diferentes
        if (modalId === 'modal-personalizar' || modalId === 'modal') {
             modal.style.display = 'flex';
        } else {
             modal.style.display = 'block';
        }
    }
}

export function fecharModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Funções específicas de fechar modal (para limpar campos, etc.)
export function fecharModalEventosDia() {
    fecharModal('modal-eventos-dia');
}

export function fecharModalNovoEvento() {
    fecharModal('modal');
    document.getElementById('evento-descricao').value = '';
    document.getElementById('evento-valor').value = '';
}

export function fecharModalPersonalizar() {
    fecharModal('modal-personalizar');
}