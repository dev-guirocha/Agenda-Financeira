// js/customization.js
import { abrirModal, fecharModalPersonalizar } from './ui.js';

// Função para carregar configurações personalizadas
export function carregarConfiguracoesPersonalizadas() {
    try {
        const configuracoesSalvas = JSON.parse(localStorage.getItem('configuracoes')) || {};

        // Título do app
        const appTitle = document.getElementById('app-title');
        if (appTitle) {
            if (configuracoesSalvas.titulo) {
                appTitle.textContent = configuracoesSalvas.titulo;
            }
            if (configuracoesSalvas.cor) {
                appTitle.style.color = configuracoesSalvas.cor;
            }
        }

        // Fundo
        if (configuracoesSalvas.opacidadeFundo) {
            document.body.style.backgroundColor = `rgba(30, 30, 30, ${configuracoesSalvas.opacidadeFundo})`;
        }
        if (configuracoesSalvas.fundo) {
            document.body.style.backgroundImage = `url('${configuracoesSalvas.fundo}')`;
        }

        // Botões
        const botoes = document.querySelectorAll('button');
        if (configuracoesSalvas.corBotao) {
            botoes.forEach(button => {
                button.style.backgroundColor = configuracoesSalvas.corBotao;
                button.style.color = '#FFFFFF';
            });
        }

        // Logo
        const logoImg = document.getElementById('logo-img');
        if (logoImg && configuracoesSalvas.logo) {
            logoImg.src = configuracoesSalvas.logo;
        }

    } catch (error) {
        console.error("Erro ao carregar configurações personalizadas:", error);
    }
}

export function salvarPersonalizacao() {
    try {
        const tituloApp = document.getElementById('titulo-app');
        const corTitulo = document.getElementById('cor-titulo');
        const opacidadeFundo = document.getElementById('opacidade-fundo');
        const corBotao = document.getElementById('cor-botao');

        const configuracoesSalvas = JSON.parse(localStorage.getItem('configuracoes')) || {};

        const novasConfiguracoes = {
            titulo: tituloApp.value,
            cor: corTitulo.value,
            opacidadeFundo: opacidadeFundo.value,
            corBotao: corBotao.value,
            logo: configuracoesSalvas.logo,
            fundo: configuracoesSalvas.fundo
        };

        const appTitle = document.getElementById('app-title');
        appTitle.textContent = novasConfiguracoes.titulo;
        appTitle.style.color = novasConfiguracoes.cor;
        document.body.style.backgroundColor = `rgba(30, 30, 30, ${novasConfiguracoes.opacidadeFundo})`;

        const botoes = document.querySelectorAll('button');
        botoes.forEach(button => {
            button.style.backgroundColor = novasConfiguracoes.corBotao;
            button.style.color = '#FFFFFF';
        });

        localStorage.setItem('configuracoes', JSON.stringify(novasConfiguracoes));
        fecharModalPersonalizar();
    } catch (error) {
        console.error("Erro ao salvar personalização:", error);
    }
}

export function abrirModalPersonalizar() {
    try {
        abrirModal('modal-personalizar'); // Chama a função de UI

        // Carrega configurações salvas
        const configuracoesSalvas = JSON.parse(localStorage.getItem('configuracoes')) || {};

        // Preenche os campos do modal com valores salvos ou padrões
        const elementos = {
            'titulo-app': configuracoesSalvas.titulo || document.getElementById('app-title').textContent,
            'cor-titulo': configuracoesSalvas.cor || '#FFD700',
            'cor-botao': configuracoesSalvas.corBotao || '#000000',
            'opacidade-fundo': configuracoesSalvas.opacidadeFundo || '0.8',
            'fonte-titulo': configuracoesSalvas.fonte || 'Arial, sans-serif',
            'borda-titulo': configuracoesSalvas.borda || 'none'
        };

        // Aplica os valores aos campos
        for (let id in elementos) {
            const elemento = document.getElementById(id);
            if (elemento) {
                elemento.value = elementos[id];
            }
        }

        // Aplica a cor atual ao título
        const appTitle = document.getElementById('app-title');
        if (appTitle) {
            appTitle.style.color = elementos['cor-titulo'];
            appTitle.style.fontFamily = elementos['fonte-titulo'];
            appTitle.style.border = elementos['borda-titulo'];
        }

    } catch (error) {
        console.error("Erro ao abrir modal:", error);
        alert("Erro ao abrir o modal: " + error.message);
    }
}

export function restaurarConfiguracoes() {
    try {
        const configuracoesPadrao = {
            titulo: 'Agenda Financeira',
            cor: '#FFD700',
            opacidadeFundo: 0.8,
            corBotao: '#000000',
            fonte: 'Arial, sans-serif',
            borda: 'none',
            logo: 'Imagem do WhatsApp de 2024-11-14 à(s) 21.42.02_a263ffdf.jpg', // Caminho da logo padrão
            background_color: '#000'
        };

        // Aplica as configurações padrão
        const appTitle = document.getElementById('app-title');
        if (appTitle) {
            appTitle.textContent = configuracoesPadrao.titulo;
            appTitle.style.color = configuracoesPadrao.cor;
            appTitle.style.fontFamily = configuracoesPadrao.fonte;
            appTitle.style.border = configuracoesPadrao.borda;
        }

        // Restaura logo padrão
        const logoImg = document.getElementById('logo-img');
        if (logoImg) {
            logoImg.src = configuracoesPadrao.logo;
        }

        document.body.style.backgroundColor = `rgba(30, 30, 30 , ${configuracoesPadrao.opacidadeFundo})`;
        document.body.style.backgroundImage = 'none';

        // Atualiza os campos do modal
        const elementos = {
            'titulo-app': configuracoesPadrao.titulo,
            'cor-titulo': configuracoesPadrao.cor,
            'cor-botao': configuracoesPadrao.corBotao,
            'opacidade-fundo': configuracoesPadrao.opacidadeFundo,
            'fonte-titulo': configuracoesPadrao.fonte,
            'borda-titulo': configuracoesPadrao.borda
        };

        for (let id in elementos) {
            const elemento = document.getElementById(id);
            if (elemento) {
                elemento.value = elementos[id];
            }
        }

        // Atualiza a cor dos botões
        const botoes = document.querySelectorAll('button');
        botoes.forEach(button => {
            button.style.backgroundColor = configuracoesPadrao.corBotao;
            button.style.color = '#FFFFFF';
        });

        // Limpa as configurações do localStorage
        localStorage.removeItem('configuracoes');

        fecharModalPersonalizar();
    } catch (error) {
        console.error("Erro ao restaurar configurações:", error);
        alert("Erro ao restaurar configurações: " + error.message);
    }
}

// Função para adicionar logo
export function adicionarLogo(files) {
    if (files.length > 0) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('logo-img').src = e.target.result;
            const configuracoesSalvas = JSON.parse(localStorage.getItem('configuracoes')) || {};
            configuracoesSalvas.logo = e.target.result;
            localStorage.setItem('configuracoes', JSON.stringify(configuracoesSalvas));
        };
        reader.readAsDataURL(files[0]);
    }
}

// Função para adicionar fundo
export function adicionarFundo(files) {
    if (files.length > 0) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.body.style.backgroundImage = `url('${e.target.result}')`;
            const configuracoesSalvas = JSON.parse(localStorage.getItem('configuracoes')) || {};
            configuracoesSalvas.fundo = e.target.result;
            localStorage.setItem('configuracoes', JSON.stringify(configuracoesSalvas));
        };
        reader.readAsDataURL(files[0]);
    }
}