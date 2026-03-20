let clientes = []
let pets = []
let produtos = []
let carrinho = []

function criarCliente() {
  let nome = clienteNome.value
  let email = clienteEmail.value
  let vip = clienteVip.checked

  if (nome == "") {
    alert("Nome inválido")
    return
  }

  if (!email.includes("@")) {
    alert("Email inválido")
    return
  }

  clientes.push({ nome, email, vip })

  renderClientes()
}

function renderClientes() {
  listaClientes.innerHTML = ""

  clientes.forEach((c) => {
    let li = document.createElement("li")
    li.innerText = c.nome + " - " + c.email + (c.vip ? " (VIP)" : "")
    listaClientes.appendChild(li)
  })
}

function cadastrarPet() {
  let nome = petNome.value
  let tipo = petTipo.value
  let idade = parseInt(petIdade.value, 10)

  if (nome == "") {
    alert("Pet precisa de nome")
    return
  }

  if (tipo == null || String(tipo).trim() === "") {
    alert("Pet precisa de tipo")
    return
  }

  if (Number.isNaN(idade) || idade < 0) {
    alert("Idade inválida")
    return
  }

  pets.push({ nome, tipo, idade })

  renderPets()
}

function renderPets() {
  listaPets.innerHTML = ""

  pets.forEach((p) => {
    let li = document.createElement("li")
    li.innerText = p.nome + " (" + p.tipo + ")"
    listaPets.appendChild(li)
  })
}

function criarProduto() {
  let nome = produtoNome.value
  let preco = parseFloat(produtoPreco.value)

  if (nome == null || String(nome).trim() === "") {
    alert("Nome do produto inválido")
    return
  }

  if (Number.isNaN(preco) || preco <= 0) {
    alert("Preço inválido")
    return
  }

  produtos.push({ nome, preco })

  renderProdutos()
}

function renderProdutos() {
  listaProdutos.innerHTML = ""
  produtoSelect.innerHTML = ""

  produtos.forEach((p, i) => {
    let li = document.createElement("li")
    li.innerText = p.nome + " - R$ " + p.preco
    listaProdutos.appendChild(li)

    let op = document.createElement("option")
    op.value = i
    op.innerText = p.nome
    produtoSelect.appendChild(op)
  })
}

function adicionarCarrinho() {
  let idx = produtoSelect.value
  let p = produtos[idx]

  if (!p) {
    alert("Selecione um produto")
    return
  }

  if (p.preco === 0 || p.preco <= 0) {
    alert("Produto com preço inválido para o carrinho")
    return
  }

  carrinho.push(p)

  renderCarrinho()
}

function removerCarrinho() {
  carrinho.shift()

  renderCarrinho()
}

function renderCarrinho() {
  listaCarrinho.innerHTML = ""

  carrinho.forEach((p) => {
    let li = document.createElement("li")
    li.innerText = p.nome + " - " + p.preco
    listaCarrinho.appendChild(li)
  })

  calcularTotal()
}

function calcularTotal() {
  let subtotal = 0

  carrinho.forEach((p) => {
    subtotal += p.preco
  })

  let total = subtotal

  const vipCompra =
    typeof compraClienteVip !== "undefined" && compraClienteVip && compraClienteVip.checked

  if (vipCompra) {
    total *= 0.85
  } else if (total > 100) {
    total *= 0.9
  }

  total = Number(total.toFixed(2))
  const texto = total.toFixed(2)

  document.getElementById("total").innerText = texto

  return texto
}

function finalizarCompra() {
  alert("Compra finalizada: " + calcularTotal())

  carrinho = []

  renderCarrinho()
}

let slideIndex = 0

function nextSlide() {
  slideIndex++
  updateSlide()
}

function prevSlide() {
  slideIndex--
  updateSlide()
}

function updateSlide() {
  const slides = document.querySelector(".slides")
  const total = document.querySelectorAll(".slide").length

  if (slideIndex >= total) slideIndex = 0
  if (slideIndex < 0) slideIndex = total - 1

  slides.style.transform = "translateX(-" + slideIndex * 100 + "%)"
}

setInterval(nextSlide, 4000)

if (typeof process !== "undefined" && process.env.NODE_ENV === "test" && typeof window !== "undefined") {
  window.__petshopTestHelpers = {
    injectProduto(p) {
      produtos.push(p)
      renderProdutos()
    },
    limparCarrinho() {
      carrinho = []
      renderCarrinho()
    },
  }
}
