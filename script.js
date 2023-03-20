class Despesa {
    constructor(ano, mes,dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validaDados() {
        for(let i in this) {
          if(this[i] == undefined || this[i] == '' || this[i] == null) {
            return false
          }
        }
          return true
        }
      }

class BD {
    constructor() {
        let id = localStorage.getItem('id')
        if(id === null) {
            localStorage.setItem('id', 0)
        }
    }

    getProximoId() {
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }
    armazenar(d) {
        let id = this.getProximoId()
        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id', id)
    }
    recuperarTodosRegistros() {
        let despesas = Array()

        let id = localStorage.getItem('id')

        for(let i = 1; i <= id; i++) {
            let despesa = JSON.parse(localStorage.getItem(i))

            if(despesa === null) {
                continue
            }
            despesa.id = 1;
            despesas.push(despesa)
        }
        return despesas
    }

    pesquisar(despesa) {
        let despesasFiltradas = Array()
        despesasFiltradas = this.recuperarTodosRegistros()
        
        if(despesa.ano != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.ano)
        }

        if(despesa.mes != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }

        if(despesa.dia != '') {
            despesasFiltradas = despesasFiltradas.filter(d => despesa.dia == despesa.dia)
        }

        if(despesa.tipo != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == d.tipo)
        }

        if(despesa.descricao != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == d.descricao)
        }

        if(despesa.valor != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == d.valor)
        }
        return despesasFiltradas;
    }

    remover(id) {
        localStorage.removeItem(id)
    }
}

let bd = new BD()

function cadastrarDespesa() {
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa (
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    )

    if(despesa.validaDados()) {
        bd.armazenar(despesa)

        document.getElementById('modal-titulo').innerHTML = 'Registro inserido com sucesso'
        document.getElementById('modal-header-div').className = 'modal-header text-success'
        document.getElementById('modal-body').innerHTML = 'Despesa inserida com sucesso'
        document.getElementById('modal-btn').innerHTML = 'Voltar'
        document.getElementById('modal-btn').className = 'btn btn-success'
        $('#modalRegistraDespesas').modal('show')

        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''
    } else {
        document.getElementById('modal-titulo').innerHTML = 'Erro na gravação do registro'
        document.getElementById('modal-header-div').className = 'modal-header text-danger'
        document.getElementById('modal-body').innerHTML = 'Verifique se todos os campos foram inseridos corretamente'
        document.getElementById('modal-btn').innerHTML = 'Voltar e corrigir'
        document.getElementById('modal-btn').className = 'btn btn-danger'
        $('#modalRegistraDespesas').modal('show')
    }   
}

function carregaListaDespesas(despesas = Array(), filtro = false) {
    if(despesas.length == 0 && filtro == false) {
        despesas = bd.recuperarTodosRegistros()
    }
    /*               <tr>
                <td>07/03/2023</td>
                <td>Lazer</td>
                <td>Cinema</td>
                <td>12,50</td>
              </tr>
    */
    let tabelaDespesas = document.getElementById('tabelaDespesas')
    tabelaDespesas.innerHTML = ''

    despesas.forEach(function(d) {
        let linha = tabelaDespesas.insertRow()

        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

        switch(d.tipo) {
            case '1': d.tipo = 'Alimentação'
                break;
            case '2': d.tipo = 'Educação'
                break;
            case '3': d.tipo = 'Lazer'
                break;
            case '4': d.tipo = 'Saúde'
                break;
            case '5': d.tipo = 'Transporte'
                break;
        }

        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

        let btn = document.createElement('button')
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_despesa_${d.id}`
        btn.onclick = function() {
            let id = this.id.replace('id_despesa_','')
            bd.remover(id)
            window.location.reload()
        }
        linha.insertCell(4).append(btn)
        console.log(d)
    })
}

function filtroPesquisa() {
    let ano = document.getElementById('ano').value;
    let mes = document.getElementById('mes').value;
    let dia = document.getElementById('dia').value;
    let tipo = document.getElementById('tipo').value;
    let descricao = document.getElementById('descricao').value;
    let valor = document.getElementById('valor').value;

    let despesa = new Despesa (ano,mes,dia,tipo,descricao,valor)
    let despesas = bd.pesquisar(despesa);
    
    this.carregaListaDespesas(despesas,true)
} 