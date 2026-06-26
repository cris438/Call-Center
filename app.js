class Nodo {
    constructor(ticket, nombre, numero, motivo) {
        this.ticket = ticket
        this.nombre = nombre
        this.numero = numero
        this.motivo = motivo
        this.next = null
    }
}

class Queue {
    constructor() {
        this.first = null
        this.last = null
        this.length = 0
    }
    peek() {
        return this.first
    }
    enqueue(nombre, numero, motivo) {
        this.length++
        const newNode = new Nodo(this.length, nombre, numero, motivo)
        if (this.length === 1) {
            this.first = newNode
            this.last = newNode
        } else {
            this.last.next = newNode
            this.last = newNode

        }
        return this
    }
    dequeue() {
        const topEliminado = this.first
        this.first = this.first.next
        this.length--
        return topEliminado
    }
    renderizar() {
        let html = ''
        let llamadaActual = this.first
        for (let i = 0; i < this.length; i++) {
            html += `
                  <li class="list-group-item bg-dark text-light">
                Ticket ${llamadaActual.ticket} - ${llamadaActual.nombre} (${llamadaActual.numero}) - ${llamadaActual.motivo}
            </li>`
            llamadaActual = llamadaActual.next
        }
        return html
    }
    proximaLlamada() {
        let siguienteLlamada = this.peek()
        let html =
            `<p><strong>Ticket:</strong> ${siguienteLlamada.ticket}</p>
            <p><strong>Cliente:</strong> ${siguienteLlamada.nombre}</p>
            <p><strong>Teléfono:</strong> ${siguienteLlamada.numero}</p>
            <p><strong>Motivo:</strong> ${siguienteLlamada.motivo}</p>
            `
        return html
    }
}

class NodoHistorial {
    constructor(ticket, cliente, numero, motivo, estado) {
        this.ticket = ticket
        this.cliente = cliente
        this.numero = numero
        this.motivo = motivo
        this.estado = estado
        this.next = null
    }
}
class QueueHistorial {
    constructor() {
        this.first = null
        this.last = null
        this.length = 0
    }
    enqueue(cliente, numero, motivo, estado) {
        this.length++
        const newNode = new NodoHistorial(this.length, cliente, numero, motivo, estado)
        if (this.length === 1) {
            this.first = newNode
            this.last = newNode
        } else {
            this.last.next = newNode
            this.last = newNode

        }
        return this
    }
    renderizar() {
        let html = ''
        let llamadaActual = this.first
        for (let i = 0; i < this.length; i++) {
            html += `
                  <tr>
                    <td>${llamadaActual.ticket}</td>
                    <td>${llamadaActual.cliente}</td>
                    <td>${llamadaActual.numero}</td>
                    <td>${llamadaActual.motivo}</td>
                    <td>${llamadaActual.estado}</td>
                </tr>`
            llamadaActual = llamadaActual.next
        }
        return html
    }
}

let llamadas = new Queue()
let historial = new QueueHistorial()

let btnAtender = document.querySelector('#btnAtender')
let colaEspera = document.querySelector('#colaEspera')
let formNuevaLlamada = document.querySelector('#formLlamada')
let proximaLlamada = document.querySelector('#proximaLlamada')
let llamadaActual = document.querySelector('#llamadaActual')
let controlesLlamada = document.querySelector('#controlesLlamada')
let modalEstado = document.querySelector('#btnsEstados')
let contenedorHistorial = document.querySelector('#historial')
let atendido;
let btnRegistrar = document.querySelector('#btnRegistrar')
let inputTelefono = document.querySelector('#telefono')

const modalLlamada = document.querySelector('#modalLlamada');
const registrarBtn = document.querySelector('#registrarLlamada');

let habilitacionDeBotonAtender = (desabilitar) => {
    if (desabilitar) {
        btnAtender.classList.add('d-none')
        return
    }
    if (llamadas.length != 0) {
        btnAtender.classList.remove('d-none')
    } else {
        btnAtender.classList.add('d-none')
    }
}

let validacionNumero = (numero) => {
    console.log(numero)
    if (numero.length >= 8 && numero.length<=15) {
        btnRegistrar.disabled = false
    }else{
        btnRegistrar.disabled = true
    }
}



// Cargar el sonido (puede ser mp3, ogg, wav)
const sonidoLlamada = new Audio('audio/llamada.mp3');

btnRegistrar.addEventListener('click', () => {
  sonidoLlamada.play();
});

inputTelefono.addEventListener('keyup',(event)=>{
    validacionNumero(inputTelefono.value)
})

formNuevaLlamada.addEventListener('submit', (event) => {
    event.preventDefault()
    llamadas.enqueue(event.target["cliente"].value, event.target['telefono'].value, event.target['motivo'].value)
    colaEspera.innerHTML = llamadas.renderizar()
    proximaLlamada.innerHTML = llamadas.proximaLlamada()
    habilitacionDeBotonAtender(false)
    formNuevaLlamada.reset()
})
btnAtender.addEventListener('click', (event) => {
    llamadaActual.innerHTML = llamadas.proximaLlamada()
    if (llamadas.length <= 1) {
        proximaLlamada.textContent = 'No hay llamadas en cola.'
        atendido = llamadas.dequeue()
        colaEspera.innerHTML = llamadas.renderizar()
    } else {
        atendido = llamadas.dequeue()
        colaEspera.innerHTML = llamadas.renderizar()
        proximaLlamada.innerHTML = llamadas.proximaLlamada()
    }
    controlesLlamada.classList.remove('d-none')
    habilitacionDeBotonAtender(true)
})

modalEstado.addEventListener('click', (event) => {
    console.log('hola')
    if (event.target.classList.contains('resuelta')) {
        console.log('resuelta')
        llamadaActual.textContent = 'Ninguna llamada en atención'
        controlesLlamada.classList.add('d-none')
        habilitacionDeBotonAtender(false)
        historial.enqueue(atendido.nombre, atendido.numero, atendido.motivo, 'Resuelta')
        contenedorHistorial.innerHTML = historial.renderizar()
    } else if (event.target.classList.contains('pendiente')) {
        console.log('pendiente')
        llamadaActual.textContent = 'Ninguna llamada en atención'
        controlesLlamada.classList.add('d-none')
        habilitacionDeBotonAtender(false)
        historial.enqueue(atendido.nombre, atendido.numero, atendido.motivo, 'Pendiente')
        contenedorHistorial.innerHTML = historial.renderizar()
    } else if (event.target.classList.contains('seguimiento')) {
        console.log('seguimienot')
        llamadaActual.textContent = 'Ninguna llamada en atención'
        controlesLlamada.classList.add('d-none')
        habilitacionDeBotonAtender(false)
        historial.enqueue(atendido.nombre, atendido.numero, atendido.motivo, 'Requiere seguimiento')
        contenedorHistorial.innerHTML = historial.renderizar()
    }
})





















// Antes de que el modal se oculte, mueve el foco al botón de apertura
// modalLlamada.addEventListener('hide.bs.modal', () => {
//     if (registrarBtn) {
//         registrarBtn.focus();
//     }
// });
