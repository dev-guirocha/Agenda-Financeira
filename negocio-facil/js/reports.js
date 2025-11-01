// js/reports.js
import { dataAtual, eventos } from './state.js';

// Função auxiliar para formatar valores
function formatarValor(valor) {
    return valor % 1 === 0 ? valor.toString() : valor.toFixed(2);
}

// Modificação na função gerarRelatorioMensal
export function gerarRelatorioMensal() {
    let totalEntrada = 0;
    let totalSaida = 0;
    let maiorEntrada = { valor: 0, descricao: '' };
    let maiorSaida = { valor: 0, descricao: '' };
    let qtdEntradas = 0;
    let qtdSaidas = 0;

    const relatorioDiv = document.createElement('div');
    relatorioDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: var(--preto);
        border: 2px solid var(--dourado);
        padding: 20px;
        width: 90%;
        max-width: 500px;
        max-height: 80vh;
        overflow-y: auto;
        z-index: 1000;
        color: var(--branco);
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    `;

    const mesAtual = dataAtual.getMonth() + 1;
    const anoAtual = dataAtual.getFullYear();
    const nomeMes = dataAtual.toLocaleDateString('pt-BR', { month: 'long' });

    let relatorioHTML = `
        <h3 style="color: var(--dourado); text-align: center; margin-bottom: 20px;">
            Relatório Detalhado de ${nomeMes} ${anoAtual}
        </h3>
    `;

    let eventosPorDia = {};
    let temEventos = false;

    // Agrupa eventos por dia e calcula totais
    for (const [data, eventosDia] of Object.entries(eventos)) {
        const [ano, mes, dia] = data.split('-');
        if (parseInt(ano) === anoAtual && parseInt(mes) === mesAtual) {
            temEventos = true;
            eventosPorDia[dia] = eventosDia;

            eventosDia.forEach(evento => {
                const valor = parseFloat(evento.valor || 0);
                if (evento.tipo === 'entrada') {
                    totalEntrada += valor;
                    qtdEntradas++;
                    if (valor > maiorEntrada.valor) {
                        maiorEntrada = { valor, descricao: evento.descricao };
                    }
                } else if (evento.tipo === 'saida') {
                    totalSaida += valor;
                    qtdSaidas++;
                    if (valor > maiorSaida.valor) {
                        maiorSaida = { valor, descricao: evento.descricao };
                    }
                }
            });
        }
    }

    if (!temEventos) {
        relatorioHTML += '<p style="text-align: center; color: var(--dourado);">Nenhum evento registrado neste mês.</p>';
    } else {
        // Resumo Geral
        relatorioHTML += `
            <div style="margin-bottom: 20px; padding: 15px; background-color: rgba(255,215,0,0.1); border-radius: 5px;">
                <h4 style="color: var(--dourado); margin-bottom: 10px;">Resumo Geral</h4>
                <p>Total de Movimentações: ${qtdEntradas + qtdSaidas}</p>
                <p>Quantidade de Entradas: ${qtdEntradas}</p>
                <p>Quantidade de Saídas: ${qtdSaidas}</p>
                <p>Média de Entradas: R$ ${qtdEntradas > 0 ? formatarValor(totalEntrada / qtdEntradas) : '0'}</p>
                <p>Média de Saídas: R$ ${qtdSaidas > 0 ? formatarValor(totalSaida / qtdSaidas) : '0'}</p>
            </div>

            <div style="margin-bottom: 20px;">
                <h4 style="color: var(--dourado);">Maiores Movimentações</h4>
                ${maiorEntrada.descricao ? `
                    <p>Maior Entrada: ${maiorEntrada.descricao} - R$ ${formatarValor(maiorEntrada.valor)}</p>
                ` : ''}
                ${maiorSaida.descricao ? `
                    <p>Maior Saída: ${maiorSaida.descricao} - R$ ${formatarValor(maiorSaida.valor)}</p>
                ` : ''}
            </div>

            <h4 style="color: var(--dourado);">Detalhamento por Dia</h4>
        `;

        // Detalhamento diário
        Object.entries(eventosPorDia)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .forEach(([dia, eventosDia]) => {
                let entradaDia = 0;
                let saidaDia = 0;

                relatorioHTML += `
                    <div style="margin-bottom: 15px; padding: 10px; border: 1px solid var(--dourado); border-radius: 5px;">
                        <strong>Dia ${dia}</strong>
                        <ul style="list-style: none; padding: 0; margin: 10px 0;">
                `;

                eventosDia.forEach(evento => {
                    const valor = parseFloat(evento.valor || 0);
                    if (evento.tipo === 'entrada') entradaDia += valor;
                    if (evento.tipo === 'saida') saidaDia += valor;

                    relatorioHTML += `
                        <li style="margin-bottom: 5px;">
                            <span style="color: ${evento.tipo === 'entrada' ? '#28a745' : '#dc3545'};">
                                ${evento.descricao} - R$ ${formatarValor(valor)}
                            </span>
                        </li>
                    `;
                });

                relatorioHTML += `
                        </ul>
                        <div style="font-size: 0.9em; margin-top: 5px;">
                            <p>Total do dia: R$ ${formatarValor(entradaDia - saidaDia)}</p>
                        </div>
                    </div>
                `;
            });

        // Balanço Final
        const saldoFinal = totalEntrada - totalSaida;
        const percentualGasto = totalEntrada > 0 ? (totalSaida / totalEntrada) * 100 : 0;

        relatorioHTML += `
            <div style="margin-top: 20px; border-top: 2px solid var(--dourado); padding-top: 15px;">
                <h4 style="color: var(--dourado);">Balanço Final</h4>
                <p>Total de Entradas: <span style="color: #28a745;">R$ ${formatarValor(totalEntrada)}</span></p>
                <p>Total de Saídas: <span style="color: #dc3545;">R$ ${formatarValor(totalSaida)}</span></p>
                <p>Saldo do Mês: <span style="color: ${saldoFinal >= 0 ? '#28a745' : '#dc3545'}">
                    R$ ${formatarValor(saldoFinal)}</span></p>
                <p>Percentual Gasto: ${formatarValor(percentualGasto)}%</p>
                <p>Status: <strong style="color: ${saldoFinal >= 0 ? '#28a745' : '#dc3545'}">
                    ${saldoFinal >= 0 ? 'Positivo' : 'Negativo'}</strong></p>
            </div>
        `;
    }

    relatorioHTML += `
        <button onclick="this.parentElement.remove()" style="
            display: block;
            margin: 20px auto 0;
            background-color: var(--dourado);
            color: var(--preto);
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        ">Fechar Relatório</button>
    `;

    relatorioDiv.innerHTML = relatorioHTML;
    document.body.appendChild(relatorioDiv);
}

// Modificação na função gerarRelatorioAnual
export function gerarRelatorioAnual() {
    let totalEntradaAnual = 0;
    let totalSaidaAnual = 0;
    let melhorMes = { saldo: -Infinity, nome: '' };
    let piorMes = { saldo: Infinity, nome: '' };
    let mesesComEventos = {};

    const relatorioDiv = document.createElement('div');
    relatorioDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: var(--preto);
        border: 2px solid var(--dourado);
        padding: 20px;
        width: 90%;
        max-width: 500px;
        max-height: 80vh;
        overflow-y: auto;
        z-index: 1000;
        color: var(--branco);
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    `;

    const anoAtual = dataAtual.getFullYear();
    let relatorioHTML = `
        <h3 style="color: var(--dourado); text-align: center; margin-bottom: 20px;">
            Relatório Anual Detalhado de ${anoAtual}
        </h3>
    `;

    let temEventos = false;

    // Processamento inicial dos dados
    for (const [data, eventosDia] of Object.entries(eventos)) {
        const [ano, mes] = data.split('-');
        if (parseInt(ano) === anoAtual) {
            temEventos = true;
            if (!mesesComEventos[mes]) {
                mesesComEventos[mes] = {
                    entradas: 0,
                    saidas: 0,
                    qtdEntradas: 0,
                    qtdSaidas: 0,
                    maiorEntrada: { valor: 0, descricao: '' },
                    maiorSaida: { valor: 0, descricao: '' }
                };
            }

            eventosDia.forEach(evento => {
                const valor = parseFloat(evento.valor || 0);
                if (evento.tipo === 'entrada') {
                    mesesComEventos[mes].entradas += valor;
                    mesesComEventos[mes].qtdEntradas++;
                    if (valor > mesesComEventos[mes].maiorEntrada.valor) {
                        mesesComEventos[mes].maiorEntrada = { valor, descricao: evento.descricao };
                    }
                    totalEntradaAnual += valor;
                } else if (evento.tipo === 'saida') {
                    mesesComEventos[mes].saidas += valor;
                    mesesComEventos[mes].qtdSaidas++;
                    if (valor > mesesComEventos[mes].maiorSaida.valor) {
                        mesesComEventos[mes].maiorSaida = { valor, descricao: evento.descricao };
                    }
                    totalSaidaAnual += valor;
                }
            });

            // Calcula saldo do mês para determinar melhor e pior mês
            const saldoMes = mesesComEventos[mes].entradas - mesesComEventos[mes].saidas;
            const nomeMes = new Date(anoAtual, parseInt(mes) - 1).toLocaleDateString('pt-BR', { month: 'long' });
            
            if (saldoMes > melhorMes.saldo) {
                melhorMes = { saldo: saldoMes, nome: nomeMes };
            }
            if (saldoMes < piorMes.saldo) {
                piorMes = { saldo: saldoMes, nome: nomeMes };
            }
        }
    }

    if (!temEventos) {
        relatorioHTML += '<p style="text-align: center; color: var(--dourado);">Nenhum evento registrado neste ano.</p>';
    } else {
        // Visão Geral Anual
        const saldoAnual = totalEntradaAnual - totalSaidaAnual;
        const percentualGastoAnual = totalEntradaAnual > 0 ? (totalSaidaAnual / totalEntradaAnual) * 100 : 0;

        relatorioHTML += `
            <div style="margin-bottom: 20px; padding: 15px; background-color: rgba(255,215,0,0.1); border-radius: 5px;">
                <h4 style="color: var(--dourado);">Visão Geral do Ano</h4>
                <p>Total de Entradas: <span style="color: #28a745;">R$ ${formatarValor(totalEntradaAnual)}</span></p>
                <p>Total de Saídas: <span style="color: #dc3545;">R$ ${formatarValor(totalSaidaAnual)}</span></p>
                <p>Saldo Anual: <span style="color: ${saldoAnual >= 0 ? '#28a745' : '#dc3545'}">
                    R$ ${formatarValor(saldoAnual)}</span></p>
                <p>Percentual Gasto: ${formatarValor(percentualGastoAnual)}%</p>
            </div>

            <div style="margin-bottom: 20px;">
                <h4 style="color: var(--dourado);">Análise de Desempenho</h4>
                <p>Melhor Mês: ${melhorMes.nome} (R$ ${formatarValor(melhorMes.saldo)})</p>
                <p>Pior Mês: ${piorMes.nome} (R$ ${formatarValor(piorMes.saldo)})</p>
            </div>

            <h4 style="color: var(--dourado);">Detalhamento Mensal</h4>
        `;

        // Detalhamento por mês
        Object.entries(mesesComEventos)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .forEach(([mes, dados]) => {
                const nomeMes = new Date(anoAtual, parseInt(mes) - 1).toLocaleDateString('pt-BR', { month: 'long' });
                const saldoMes = dados.entradas - dados.saidas;
                const percentualGastoMes = dados.entradas > 0 ? (dados.saidas / dados.entradas) * 100 : 0;

                relatorioHTML += `
                    <div style="margin-bottom: 15px; padding: 10px; border: 1px solid var(--dourado); border-radius: 5px;">
                        <h4 style="color: var(--dourado); margin: 0 0 10px;">${nomeMes}</h4>
                        <div style="margin-bottom: 10px;">
                            <p>Entradas: R$ ${formatarValor(dados.entradas)} (${dados.qtdEntradas} operações)</p>
                            <p>Saídas: R$ ${formatarValor(dados.saidas)} (${dados.qtdSaidas} operações)</p>
                            <p>Saldo: <span style="color: ${saldoMes >= 0 ? '#28a745' : '#dc3545'}">
                                R$ ${formatarValor(saldoMes)}</span></p>
                            <p>Percentual Gasto: ${formatarValor(percentualGastoMes)}%</p>
                        </div>
                        <div style="font-size: 0.9em;">
                            <p>Maior Entrada: ${dados.maiorEntrada.descricao} - R$ ${formatarValor(dados.maiorEntrada.valor)}</p>
                            <p>Maior Saída: ${dados.maiorSaida.descricao} - R$ ${formatarValor(dados.maiorSaida.valor)}</p>
                        </div>
                    </div>
                `;
            });

        // Conclusão e Recomendações
        relatorioHTML += `
            <div style="margin-top: 20px; border-top: 2px solid var(--dourado); padding-top: 15px;">
                <h4 style="color: var(--dourado);">Conclusão</h4>
                <p>Status Anual: <strong style="color: ${saldoAnual >= 0 ? '#28a745' : '#dc3545'}">
                    ${saldoAnual >= 0 ? 'Positivo' : 'Negativo'}</strong></p>
                <p>Média Mensal de Entradas: R$ ${formatarValor(totalEntradaAnual / 12)}</p>
                <p>Média Mensal de Saídas: R$ ${formatarValor(totalSaidaAnual / 12)}</p>
            </div>
        `;
    }

    relatorioHTML += `
        <button onclick="this.parentElement.remove()" style="
            display: block;
            margin: 20px auto 0;
            background-color: var(--dourado);
            color: var(--preto);
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        ">Fechar Relatório</button>
    `;

    relatorioDiv.innerHTML = relatorioHTML;
    document.body.appendChild(relatorioDiv);
}