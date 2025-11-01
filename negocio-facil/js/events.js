// js/events.js
import { dataAtual, diaSelecionado, eventos, setDiaSelecionado, addEvento, deleteEvento, apagarEventosDoMes } from './state.js';
import { mostrarToast, fecharModalNovoEvento, abrirModal } from './ui.js';

export function mostrarEventosDia(dia) {
    setDiaSelecionado(dia);
    const dataStr = `${dataAtual.getFullYear()}-${(dataAtual.getMonth() + 1).toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
    const modalData = document.getElementById('modal-data');
    const listaEventos = document.getElementById('lista-eventos-dia');
    
    modalData.textContent = `${dia} de ${dataAtual.toLocaleDateString('pt-BR', { month: 'long' })} de ${dataAtual.getFullYear()}`;
    listaEventos.innerHTML = '';
    
    if (eventos[dataStr] && eventos[dataStr].length > 0) {
        eventos[dataStr].forEach((evento, index) => {
            const eventoDiv = document.createElement('div');
            eventoDiv.className = 'evento-detalhes';
            
            switch (evento.tipo) {
                case 'entrada': eventoDiv.style.borderLeftColor = '#28a745'; break;
                case 'saida': eventoDiv.style.borderLeftColor = '#dc3545'; break;
                case 'normal': eventoDiv.style.borderLeftColor = '#007bff'; break;
            }
            
            let conteudo = `<h4>${evento.descricao}</h4>`;
            if (evento.valor) conteudo += `<p>Valor: R$ ${evento.valor}</p>`;
            if (evento.tipo === 'normal') conteudo += `<p>Horário: ${evento.hora}</p>`;
            conteudo += `<button onclick="abrirModalApagar('${dataStr}', ${index})">Excluir</button>`;
            
            eventoDiv.innerHTML = conteudo;
            listaEventos.appendChild(eventoDiv);
        });
    } else {
        listaEventos.innerHTML = '<p>Nenhum evento para este dia.</p>';
    }
    
    abrirModal('modal-eventos-dia');
}

export function abrirModalNovoEvento() {
    const dataModal = document.getElementById('modal-data').textContent;
    const [dia, , mes, , ano] = dataModal.split(' '); // "1 de janeiro de 2025"
    
    setDiaSelecionado(parseInt(dia));
    
    const mesesNomes = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    const mesNumero = mesesNomes.indexOf(mes.toLowerCase()) + 1;
    
    const dataFormatada = `${ano}-${mesNumero.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
    
    document.getElementById('evento-data').value = dataFormatada;
    document.getElementById('evento-tipo').selectedIndex = 0;
    document.getElementById('data-selecionada').textContent = `Data Selecionada: ${dia} de ${mes} de ${ano}`;
    abrirModal('modal');
    atualizarCamposEvento();
}

export function atualizarCamposEvento() {
    const tipo = document.getElementById('evento-tipo').value;
    document.getElementById('campos-evento-normal').style.display = (tipo === 'normal') ? 'block' : 'none';
    document.getElementById('evento-valor').style.display = (tipo === 'entrada' || tipo === 'saida') ? 'block' : 'none';
}

export function salvarEvento() {
    const descricao = document.getElementById('evento-descricao').value;
    const tipo = document.getElementById('evento-tipo').value;
    const dataStr = `${dataAtual.getFullYear()}-${(dataAtual.getMonth() + 1).toString().padStart(2, '0')}-${diaSelecionado.toString().padStart(2, '0')}`;

    if (!descricao) {
        mostrarToast('Por favor, preencha a descrição do evento', 'erro');
        return;
    }

    let eventoObj = { descricao, tipo };

    if (tipo === 'entrada' || tipo === 'saida') {
        let valor = document.getElementById('evento-valor').value;
        if (!valor) {
            mostrarToast('Por favor, preencha o valor', 'erro');
            return;
        }
        valor = parseFloat(valor.replace(',', '.'));
        if (isNaN(valor)) {
            mostrarToast('Valor inválido.', 'erro');
            return;
        }
        eventoObj.valor = valor % 1 === 0 ? valor.toString() : valor.toFixed(2);
    } else if (tipo === 'normal') {
        const hora = document.getElementById('evento-hora').value;
        if (!hora) {
            mostrarToast('Por favor, preencha o horário do evento', 'erro');
            return;
        }
        eventoObj.data = dataStr;
        eventoObj.hora = hora;
    }

    addEvento(dataStr, eventoObj);
    
    // Dispara um evento para o 'main.js' atualizar o calendário
    document.dispatchEvent(new Event('eventosUpdated')); 
    
    mostrarToast('Evento registrado com sucesso', 'sucesso');
    fecharModalNovoEvento();
}

export function abrirModalApagar(dataStr, index) {
    const evento = eventos[dataStr][index];
    const modalConfirmacao = document.createElement('div');
    modalConfirmacao.style.cssText = `... (copie o CSS do modal de confirmação do script original) ...`;
    modalConfirmacao.innerHTML = `
        <h3 style="color: var(--dourado);">Confirmar Exclusão</h3>
        <p>Deseja apagar: <strong>${evento.descricao}</strong></p>
        ${evento.valor ? `<p>Valor: R$ ${evento.valor}</p>` : ''}
        <div>
            <button onclick="confirmarExclusao('${dataStr}', ${index})" style="background-color: #ff4444;">Confirmar</button>
            <button onclick="this.parentElement.parentElement.remove()">Cancelar</button>
        </div>
    `;
    document.body.appendChild(modalConfirmacao);
}

export function confirmarExclusao(dataStr, index) {
    deleteEvento(dataStr, index);
    document.dispatchEvent(new Event('eventosUpdated')); // Dispara evento
    document.querySelector('[style*="position: fixed"]').remove(); // Remove o modal
    mostrarToast('Evento excluído com sucesso', 'sucesso');
}

export function apagarDadosMes() {
    const modalConfirmacao = document.createElement('div');
    modalConfirmacao.style.cssText = `... (copie o CSS do modal de confirmação do script original) ...`;
    modalConfirmacao.innerHTML = `
        <h3 style="color: var(--dourado);">Confirmação</h3>
        <p>Deseja realmente apagar todos os dados do mês atual?</p>
        <div>
            <button id="btn-confirmar-reset" style="background-color: #dc3545;">Confirmar</button>
            <button id="btn-cancelar-reset">Cancelar</button>
        </div>
    `;
    document.body.appendChild(modalConfirmacao);

    document.getElementById('btn-confirmar-reset').onclick = () => {
        apagarEventosDoMes();
        document.dispatchEvent(new Event('eventosUpdated')); // Dispara evento
        modalConfirmacao.remove();
        mostrarToast('Dados do mês apagados com sucesso!', 'sucesso');
    };

    document.getElementById('btn-cancelar-reset').onclick = () => {
        modalConfirmacao.remove();
    };
}