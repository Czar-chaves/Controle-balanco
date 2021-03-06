const Modal = {
    open() {
        document
            .querySelector('.modal-overlay')
            .classList
            .add('active')
    },
    close() {
        document
            .querySelector('.modal-overlay')
            .classList
            .remove('active')

    }
}

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || 
        []
    },

    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    }
}

const Transaction = {
    all: Storage.get(),

    add(transaction){
        Transaction.all.push(transaction)

        App.reload()
    },
    remove(index) {
        Transaction.all.splice(index, 1)

        App.reload()
    },
    incomes () {
        let income = 0;
        Transaction.all.forEach(transaction => {
            if (transaction.amount > 0){
                income += transaction.amount * transaction.quantity;
            }
        })
        return income;
    },
    expenses () {
        let expense = 0;
        Transaction.all.forEach(transaction => {
            if (transaction.amount < 0){
                expense += transaction.amount * transaction.quantity;
            }
        })
        return expense;
        
    },
    total() {
        return Transaction.incomes() + Transaction.expenses();
    }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {        
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)

    },
    
    innerHTMLTransaction(transaction, index) {

        const CSSclass = transaction.amount > 0 ? "income" : "expense" 

        const quantity = Utils.formatQuantity(number.value)

        const amount = Utils.formatCurrency(transaction.amount)

        const html =`
            <td class="description">${transaction.description}</td>
            <td class="quantity">${transaction.quantity}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <th>
            <button class="remove-button"; onclick="Transaction.remove(${index})"  alt="Remover transa????o">Remover</button>
            </th>
             `
        return html

    },

    updateBalance() {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions(){
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {
    formatAmount(value) {
        value = Number(value) * 100
        
        return value
    },

   formatQuantity(value) {
        value = Number(value) 

        return value
    },

    formatDate(date){
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""
        
        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-br", {
            style: "currency",
            currency:"BRL"
        })

        return signal + value

        
    }
}

const Form = {
    description: document.querySelector('input#description'),
    quantity: document.querySelector('input#number'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return{
            description: Form.description.value,
            quantity: Form.quantity.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateField(){
        const {description,quantity, amount, date} = Form.getValues()

        if(
            description.trim() === "" || 
            quantity.trim() === "" || 
            amount.trim() === "" || 
            date.trim() === "") {
                throw new Error ("Por favor, preencha todos os campos")
        }
        

    },

    formatValues() {
        let {description, quantity, amount, date} = Form.getValues()
        
        quantity = Utils.formatQuantity(quantity)

        amount = Utils.formatAmount(amount)        

        date = Utils.formatDate(date)

        return {
          description,
          quantity,
          amount,
          date  
        }
    },

    clearFields() {
        Form.description.value = ""
        Form.quantity.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event) {
        event.preventDefault()

        try {
            Form.validateField()
            const transaction = Form.formatValues()
            Transaction.add(transaction)
            Form.clearFields()
            Modal.close()
        } catch (error) {
            alert(error.message)
        }
        
    }
}

const App = {
    init() {
        Transaction.all.forEach(DOM.addTransaction) 
        
        DOM.updateBalance() 
               
        Storage.set(Transaction.all)
    },

    reload() {
        DOM.clearTransactions()
        App.init()
    },

}

App.init()
