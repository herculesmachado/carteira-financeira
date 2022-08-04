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

// Este objeto armazena as informações na localStorage do browser
const Storage = {
    // Pegar
    get() {
        // parse é a funcionalidade que vai pegar a minhas strings e transformar elas em uma array ou objeto para array
        return JSON.parse(localStorage.getItem('dev.finances: transaction')) || []
    },

    // Setar
    set(transaction) {
        //Ele vai transformar as minhas transaction em uma string
        localStorage.setItem('dev.finances: Transaction', JSON.stringify(transaction))
    }
}

// Meus dados da tabela

const Transaction = {
    all: Storage.get(),

    // Adiconar uma transação
    add(transaction) {
        Transaction.all.push(transaction)

        App.reload()
    },

    // remove uma transação (index) é uma imagem de formato circular com um traço vermelho em que toda vez que clicar nele a tabela é desfeita
    remove(index) {
        Transaction.all.splice(index, 1)

        App.reload()
    },


    // Somando as contas
    incomes() {
        let income = 0
        // Pega cada transação
        Transaction.all.forEach(transaction => {
            // Se ela for maior que zero
            if (transaction.amount > 0) {
                // Soma a uma variavel e retonar a variavel
                income += transaction.amount
            }
        })
        return income
    },

    // subtraindo as contas
    expenses() {
        let expense = 0
        // Pega cada transação
        Transaction.all.forEach(transaction => {
            // Se ela for maior que zero
            if (transaction.amount < 0) {
                // Como estou subtraindo os sinais nesse caso são inverso, o mais para fronte e os 
                expense += transaction.amount
            }
        })
        return expense
    },

    // totalizando as
    total() {
        return Transaction.incomes() + Transaction.expenses()
    }
}

//Substituir os dados do HTML com os dados do JS

const DOM = {

    //To adicionando as tabela no tbody do HTML
    transactionContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        //Elemento criado pelo HTML
        DOM.transactionContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction, index) {
        //verifica se o numero é maior que 0, se sim, é ganho(income), senão e perda(expense)
        const CSSclass = transaction.amount > 0 ? 'income' : 'expense'

        const amount = Utils.formatCurrency(transaction.amount)

        // Modelo padrão da tabela HTMl, quando toda vez for adicionar algo novo, esse esqueleto de tabela é feito assim gerando outra tabela da mesma forma
        const html = `
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
            <img onclick="Transaction.remove(${index})" src="./assets/assets/minus.svg" alt="Remover Transação">
        </td>
        `

        return html
    },

    // Mostrar os valores atualizados 
    updateBalance() {
        // 
        document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes())

        document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses())

        document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total())
    },


    clearTransaction() {
        DOM.transactionContainer.innerHTML = ''
    }
}

const Utils = {
    formatAmount(value) {
        value = Number(value) * 100

        return value
    },

    // Forma as datas
    formatDate(date) {
        const splittedDate = date.split('-')
        return `${splittedDate[2]}/${splittedDate[1]} ${splittedDate[0]}`
    },


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

const Form = {

    // Esta forma eu to linkando com os inputs lá do HTML
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),


    // Toda vez em que eu acessar o getValue eu vou ter todos os valores
    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value,
        }
    },

    // Vai validar os dados
    validateFields() {
        const { description, amount, date } = Form.getValues()

        if (description.trim() === '' ||
            amount.trim() === '' ||
            date.trim() === '') {

            // Lança um erro caso o usuario não coloque todos os dados
            throw new Error('Por favor, preencha todas as informações')

        }

    },

    // Formata os valores adicionadas
    formatValues() {
        let { description, amount, date } = Form.getValues()

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date
        }
    },

    // Salva a transação
    saveTransaction(transaction) {
        transaction.add(transaction)
    },

    // Limpando os campos a transação
    clearFields() {
        Form.description.value = ''
        Form.amount.value = ''
        Form.date.value = ''
    },

    submit(event) {
        // Quando chegar aqui ele não vai gerar varios numeros ao lado da URL
        event.preventDefault()

        // Aqui eu estou tratando o erro caso a pessoa não tenha colocado todas as informações do formulario, e este erro esta sendo lançando uma nova mensagem no validateFields -> if -> throw.
        try {
            // Verificar se todas as informações foram preenchidas
            Form.validateFields()
            // formatar os dados para salvar
            const transaction = Form.formatValues()
            // Salvar
            Transaction.add(transaction)
            // apagar os dados do formulario
            Form.clearFields()
            // modal feche
            modal.close()
        } catch (e) {
            alert("Error: " + e.message)
        }
    }
}

const App = {
    init() {

        Transaction.all.forEach(DOM.addTransaction)

        DOM.updateBalance()

        Storage.set(Transaction.all)

    },

    // Toda vez que acontece algo na transaction ele recarrega, assim dando um reload()
    reload() {
        DOM.clearTransaction()

        App.init()
    }
}
App.init()



