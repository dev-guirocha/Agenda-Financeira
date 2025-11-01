// js/calendar.js
import { dataAtual, eventos, setDataAtual } from './state.js';
import { fecharModalEventosDia } from './ui.js';

function criarDia(numero) {
    const div = document.createElement('div');
    div.className = 'dia';
    div.innerHTML = `<div class="dia-numero">${numero}</div><div class="indicadores"></div>`;
    
    const dataStr = `${dataAtual.getFullYear()}-${(dataAtual.getMonth()+1).toString().padStart(2, '0')}-${numero.toString().padStart(2, '0')}`;
    
    if (eventos[dataStr]) {
        const indicadoresDiv = div.querySelector('.indicadores');
        const tiposEventos = new Set(eventos[dataStr].map(e => e.tipo));
        
        tiposEventos.forEach(tipo => {
            const indicador = document.createElement('div');
            indicador.className = 'evento-indicador';
            switch (tipo) {
                case 'entrada': indicador.style.backgroundColor = '#28a745'; break;
                case 'saida': indicador.style.backgroundColor = '#dc3545'; break;
                case 'normal': indicador.style.backgroundColor = '#007bff'; break;
            }
            indicadoresDiv.appendChild(indicador);
        });
    }
    
    // MUDANÇA: Em vez de chamar uma função, disparamos um evento.
    // Isso evita dependências circulares (calendar importar events e vice-versa).
    div.onclick = () => {
        document.dispatchEvent(new CustomEvent('diaClicado', { 
            detail: { dia: numero } 
        }));
    };
    return div;
}

function criarDiaVazio() {
    const div = document.createElement('div');
    div.className = 'dia';
    return div;
}

export function atualizarCalendario() {
    const calendario = document.querySelector('.calendario');
    if (!calendario) return;
    
    calendario.innerHTML = '';
    document.getElementById('mes-atual').textContent = 
        dataAtual.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

    const primeiroDia = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1);
    const ultimoDia = new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1, 0);
    
    const diasNoMes = ultimoDia.getDate();
    const diasAntes = primeiroDia.getDay();
    const diasDepois = 6 - ultimoDia.getDay();

    for (let i = 0; i < diasAntes; i++) calendario.appendChild(criarDiaVazio());
    for (let dia = 1; dia <= diasNoMes; dia++) calendario.appendChild(criarDia(dia));
    for (let i = 0; i < diasDepois; i++) calendario.appendChild(criarDiaVazio());
}

export function mesAnterior() {
    setDataAtual(new Date(dataAtual.setMonth(dataAtual.getMonth() - 1)));
    fecharModalEventosDia();
    atualizarCalendario();
}

export function proximoMes() {
    setDataAtual(new Date(dataAtual.setMonth(dataAtual.getMonth() + 1)));
    fecharModalEventosDia();
    atualizarCalendario();
}