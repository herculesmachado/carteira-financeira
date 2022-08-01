//Este objeto tem a funcionalidade de ligar e desligar o modal
const modal = {
    open() {
        //Abrir modal
        document.querySelector('.modal-overlay').classList.add('active')
        //Adicionar a class active ao modal
    },
    close() {
        //Remover o modal
        document.querySelector('.modal-overlay').classList.remove('active')
    }
}

// Meus dados da tabela
const transaction = [
    {
        id: 1,
        description: 'Luz',
        amount: -50000,
        date: '23/07/2022'
    },
    {
        id: 2,
        description: 'Criação website',
        amount: 500000,
        date: '14/05/2022'
    },
    {
        id: 3,
        description: 'Internet',
        amount: -5000,
        date: '20/06/2022'
    },
    {
        id: 4,
        description: 'App',
        amount: 200000,
        date: '20/06/2022'
    },
]

const Transaction = {
    income() {
        //Pegar todas as transções
        // para cada transação, se for maior que 0 somar a uma varaivel e retornar a variavel
    },
    expense() {
        //Adiciona as perdas
        return 'aqui'
    },
    total() {
        //Adiciona o total
        return 'discover'
    }
}

//Substituir os dados do HTML com os dados do JS

const DOM = {

    //To adicionando as tabela no tbody do HTML
    transactionContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction)

        //Elemento criado pelo HTML
        DOM.transactionContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction) {
        //verifica se o numero é maior que 0, se sim, é ganho(income), senão e perda(expense)
        const CSSclass = transaction.amount > 0 ? 'income' : 'expense'

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
            <img src="./assets/assets/minus.svg" alt="Remover Transação">
        </td>
        `

        return html
    },

    // Mostrar os valores atualizados 
    updateBalance() {
        document.getElementById('incomeDisplay').innerHTML.Transaction.income()

        document.getElementById('expenseDisplay').innerHTML.Transaction.expense()

        document.getElementById('totalDisplay').innerHTML.Transaction.total()
    }
}

const Utils = {
    formatCurrency(value) {
        // To fazendo uma lógica na qual to forçando o dato (value) para ser um Number, e com isso to dizendo que se o (value) for menor que 0, add um -(negativo), caso não, não add nada
        const signal = Number(value) < 0 ? '-' : ''

        // O "/\D/g" é uma caracteristica prorpia da expressão regular que pega todo o conteudo de string e transformando em puro numero
        value = String(value).replace(/\D/g, '')

        // Adiciona o ponto ao final do valor recebido 
        value = Number(value) / 100

        // Formatando a moeda para BRL (Real)
        value = value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',

        })
        
        return signal + value

    }
}

//Para cade elementos de transações está rodando uma funcionalidade, ai esta funcionalidade vai rodar a transação do momento que é o (transaction)
transaction.forEach(function(transaction) {
    DOM.addTransaction(transaction)
})

// Chamanda do updateBalance
DOM.updateBalance()


