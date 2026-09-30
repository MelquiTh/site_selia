const calendario = document.querySelector('#dias-calendario');
const tituloMes = document.querySelector('#mes-atual');
const botaoMesAnterior = document.querySelector('#mes-anterior');
const botaoMesProximo = document.querySelector('#mes-proximo');
const campoEntrada = document.querySelector('#data-entrada');
const campoSaida = document.querySelector('#data-saida');
const textoNoites = document.querySelector('#total-noites');
const textoStatus = document.querySelector('#agenda-status');
const datasBloqueadas = new Set(window.datasIndisponiveis || []);
const hoje = new Date();
hoje.setHours(0, 0, 0, 0);

let mesVisivel = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
let dataEntrada = null;
let dataSaida = null;

function paraISO(data){
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
}

function paraDataLegivel(data){
    if(!data) return '-- / -- / ----';
    return new Intl.DateTimeFormat('pt-BR').format(data);
}

function diaBloqueado(data){
    return datasBloqueadas.has(paraISO(data));
}

function atualizarResumo(){
    campoEntrada.textContent = paraDataLegivel(dataEntrada);
    campoSaida.textContent = paraDataLegivel(dataSaida);

    if(dataEntrada && dataSaida){
        const noites = Math.round((dataSaida - dataEntrada) / 86400000);
        textoNoites.textContent = `${noites} ${noites === 1 ? 'noite selecionada' : 'noites selecionadas'}`;
        textoStatus.textContent = 'Período selecionado para consulta. A seleção não confirma nem bloqueia a reserva; aguarde a confirmação da proprietária.';
    }else if(dataEntrada){
        textoNoites.textContent = 'Agora selecione a saída';
        textoStatus.textContent = 'Escolha uma data de saída posterior à chegada. Dias indisponíveis não podem fazer parte do período.';
    }else{
        textoNoites.textContent = 'Nenhuma data selecionada';
        textoStatus.textContent = 'A disponibilidade é atualizada manualmente pela proprietária. A seleção não confirma nem bloqueia a reserva.';
    }
}

function selecionarData(data){
    if(!dataEntrada || dataSaida || data <= dataEntrada){
        dataEntrada = data;
        dataSaida = null;
        textoStatus.textContent = 'Chegada selecionada. Agora escolha a saída.';
        atualizarResumo();
        renderizarCalendario();
        return;
    }

    const periodoBloqueado = new Date(dataEntrada);
    while(periodoBloqueado <= data){
        if(diaBloqueado(periodoBloqueado)){
            textoStatus.textContent = 'Esse período inclui uma data indisponível. Escolha outra data de saída.';
            return;
        }
        periodoBloqueado.setDate(periodoBloqueado.getDate() + 1);
    }

    dataSaida = data;
    atualizarResumo();
    renderizarCalendario();
}

function renderizarCalendario(){
    const ano = mesVisivel.getFullYear();
    const mes = mesVisivel.getMonth();
    const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
    const totalDias = new Date(ano, mes + 1, 0).getDate();
    const nomeMes = new Intl.DateTimeFormat('pt-BR', {
        month: 'long',
        year: 'numeric'
    }).format(mesVisivel);

    tituloMes.textContent = nomeMes;
    calendario.replaceChildren();
    botaoMesAnterior.disabled = ano === hoje.getFullYear() && mes === hoje.getMonth();

    for(let indice = 0; indice < primeiroDiaSemana; indice += 1){
        const vazio = document.createElement('span');
        vazio.className = 'agenda-day-empty';
        vazio.setAttribute('aria-hidden', 'true');
        calendario.append(vazio);
    }

    for(let numeroDia = 1; numeroDia <= totalDias; numeroDia += 1){
        const data = new Date(ano, mes, numeroDia);
        const dataISO = paraISO(data);
        const passada = data < hoje;
        const indisponivel = diaBloqueado(data);
        const dia = document.createElement('button');

        dia.type = 'button';
        dia.className = 'agenda-day';
        dia.textContent = numeroDia;
        dia.setAttribute('aria-label', `${numeroDia} de ${nomeMes}${indisponivel ? ', indisponível' : passada ? ', data passada' : ', disponível'}`);
        dia.disabled = passada || indisponivel;

        if(data.getTime() === hoje.getTime()) dia.classList.add('is-today');
        if(passada) dia.classList.add('is-past');
        if(indisponivel) dia.classList.add('is-unavailable');
        if(dataEntrada && data.getTime() === dataEntrada.getTime()) dia.classList.add('is-selected');
        if(dataSaida && data.getTime() === dataSaida.getTime()) dia.classList.add('is-selected');
        if(dataEntrada && dataSaida && data > dataEntrada && data < dataSaida) dia.classList.add('is-in-range');

        dia.addEventListener('click', () => selecionarData(data));
        calendario.append(dia);
    }
}

botaoMesAnterior.addEventListener('click', () => {
    mesVisivel = new Date(mesVisivel.getFullYear(), mesVisivel.getMonth() - 1, 1);
    renderizarCalendario();
});

botaoMesProximo.addEventListener('click', () => {
    mesVisivel = new Date(mesVisivel.getFullYear(), mesVisivel.getMonth() + 1, 1);
    renderizarCalendario();
});

atualizarResumo();
renderizarCalendario();