// js/main.js

// ImportaÃ§Ãµes de MÃ³dulos
// O "./" significa "na mesma pasta que eu (main.js)"
import { atualizarCalendario, mesAnterior, proximoMes } from './calendar.js';
import { 
    mostrarEventosDia, abrirModalNovoEvento, salvarEvento, atualizarCamposEvento, 
    abrirModalApagar, confirmarExclusao, apagarDadosMes 
} from './events.js';
import { gerarRelatorioMensal, gerarRelatorioAnual } from './reports.js';
import { 
    carregarConfiguracoesPersonalizadas, abrirModalPersonalizar, salvarPersonalizacao, 
    restaurarConfiguracoes, adicionarLogo, adicionarFundo 
} from './cutomizations.js';
import { 
    fecharModalEventosDia, fecharModalNovoEvento, fecharModalPersonalizar 
} from './ui.js';
import { diaSelecionado } from './state.js'; // Importa o estado

// --- INICIALIZAÃ‡ÃƒO ---

// Esconde a tela de carregamento
setTimeout(() => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
    }
}, 2000);

// Carrega configuraÃ§Ãµes e renderiza o calendÃ¡rio inicial
document.addEventListener('DOMContentLoaded', () => {
    carregarConfiguracoesPersonalizadas();
    atualizarCalendario();
});

// --- PONTE ENTRE MÃ“DULOS (Ouvintes de Eventos) ---

// Ouve o evento 'diaClicado' disparado pelo calendar.js
document.addEventListener('diaClicado', (e) => {
    if (e.detail && e.detail.dia) {
        mostrarEventosDia(e.detail.dia);
    }
});

// Ouve o evento 'eventosUpdated' disparado pelo events.js
document.addEventListener('eventosUpdated', () => {
    atualizarCalendario();
    // Se o modal de eventos do dia estiver aberto, atualiza-o
    if (document.getElementById('modal-eventos-dia').style.display === 'block') {
        mostrarEventosDia(diaSelecionado);
    }
});

// --- EXPÃ•E FUNÃ‡Ã•ES PARA O HTML (onclick) ---
// Para os atributos 'onclick=""' no HTML funcionarem com mÃ³dulos,
// eles precisam de acesso global (no objeto 'window').
window.mesAnterior = mesAnterior;
window.proximoMes = proximoMes;
window.abrirModalPersonalizar = abrirModalPersonalizar;
window.fecharModalPersonalizar = fecharModalPersonalizar;
window.salvarPersonalizacao = salvarPersonalizacao;
window.restaurarConfiguracoes = restaurarConfiguracoes;
window.adicionarLogo = adicionarLogo;
window.adicionarFundo = adicionarFundo;

window.fecharModalEventosDia = fecharModalEventosDia;
window.abrirModalNovoEvento = abrirModalNovoEvento;

window.gerarRelatorioMensal = gerarRelatorioMensal;
window.gerarRelatorioAnual = gerarRelatorioAnual;
window.apagarDadosMes = apagarDadosMes;

window.fecharModal = fecharModalNovoEvento; // 'fecharModal()' no HTML
window.salvarEvento = salvarEvento;
window.atualizarCamposEvento = atualizarCamposEvento;

window.abrirModalApagar = abrirModalApagar;
window.confirmarExclusao = confirmarExclusao;

// --- REGISTRO DO SERVICE WORKER ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // O sw.js estÃ¡ na raiz, junto com o index.html
        navigator.serviceWorker.register('./sw.js') 
            .then(registration => console.log('ServiceWorker registrado com sucesso'))
            .catch(err => console.log('Erro no registro do ServiceWorker:', err));
    });
}
