// js/state.js

// Exporta as variáveis de estado para que outros módulos possam importá-las
export let dataAtual = new Date();
export let diaSelecionado = null;
export let eventos = JSON.parse(localStorage.getItem('eventos')) || {};

// Funções que alteram (mutam) o estado
export function setDataAtual(novaData) {
    dataAtual = novaData;
}

export function setDiaSelecionado(novoDia) {
    diaSelecionado = novoDia;
}

function salvarEventos() {
    localStorage.setItem('eventos', JSON.stringify(eventos));
}

export function addEvento(dataStr, eventoObj) {
    if (!eventos[dataStr]) {
        eventos[dataStr] = [];
    }
    eventos[dataStr].push(eventoObj);
    salvarEventos();
}

export function deleteEvento(dataStr, index) {
    if (eventos[dataStr] && eventos[dataStr][index]) {
        eventos[dataStr].splice(index, 1);
        if (eventos[dataStr].length === 0) {
            delete eventos[dataStr];
        }
        salvarEventos();
    }
}

export function apagarEventosDoMes() {
    const mesAtual = dataAtual.getMonth() + 1;
    const anoAtual = dataAtual.getFullYear();
    Object.keys(eventos).forEach(data => {
        const [ano, mes] = data.split('-');
        if (parseInt(ano) === anoAtual && parseInt(mes) === mesAtual) {
            delete eventos[data];
        }
    });
    salvarEventos();
}