const fs = require("fs")
const path = require("path")
const { JSDOM } = require("jsdom")

const IDS = [
  "clienteNome",
  "clienteEmail",
  "clienteVip",
  "listaClientes",
  "petNome",
  "petTipo",
  "petIdade",
  "listaPets",
  "produtoNome",
  "produtoPreco",
  "listaProdutos",
  "produtoSelect",
  "compraClienteVip",
  "listaCarrinho",
  "total",
]

function setupDomAndLoadApp(options = {}) {
  const { mockSetInterval = true } = options

  const indexHtml = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8")
  const appJs = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8")

  const dom = new JSDOM(indexHtml, {
    runScripts: "outside-only",
    url: "http://localhost",
  })

  const { window } = dom

  window.alert = jest.fn()

  if (mockSetInterval) {
    jest.spyOn(window, "setInterval").mockImplementation(() => 0)
  }

  for (const id of IDS) {
    const el = window.document.getElementById(id)
    if (el) window[id] = el
  }

  window.eval(appJs)

  return window
}

describe("Testes de Cliente", () => {
  test("1. Deve permitir criar cliente com nome válido", () => {
    const window = setupDomAndLoadApp()
    window.clienteNome.value = "Maria"
    window.clienteEmail.value = "maria@email.com"
    window.clienteVip.checked = false
    window.criarCliente()
    expect(window.alert).not.toHaveBeenCalled()
    expect(window.listaClientes.children.length).toBe(1)
    expect(window.listaClientes.children[0].textContent).toContain("Maria")
  })

  test("2. Não deve permitir cliente com nome vazio", () => {
    const window = setupDomAndLoadApp()
    window.clienteNome.value = ""
    window.clienteEmail.value = "a@b.com"
    window.criarCliente()
    expect(window.alert).toHaveBeenCalledWith("Nome inválido")
    expect(window.listaClientes.children.length).toBe(0)
  })

  test("3. Deve permitir cadastrar cliente com email válido", () => {
    const window = setupDomAndLoadApp()
    window.clienteNome.value = "João"
    window.clienteEmail.value = "joao@provedor.com"
    window.criarCliente()
    expect(window.alert).not.toHaveBeenCalled()
    expect(window.listaClientes.children.length).toBe(1)
    expect(window.listaClientes.textContent).toContain("joao@provedor.com")
  })

  test("4. Não deve permitir email inválido", () => {
    const window = setupDomAndLoadApp()
    window.clienteNome.value = "João"
    window.clienteEmail.value = "semarroba"
    window.criarCliente()
    expect(window.alert).toHaveBeenCalledWith("Email inválido")
    expect(window.listaClientes.children.length).toBe(0)
  })

  test("5. Deve permitir marcar cliente como VIP", () => {
    const window = setupDomAndLoadApp()
    window.clienteNome.value = "VIP User"
    window.clienteEmail.value = "vip@email.com"
    window.clienteVip.checked = true
    window.criarCliente()
    expect(window.alert).not.toHaveBeenCalled()
    expect(window.listaClientes.textContent).toContain("(VIP)")
  })
})

describe("Testes de Pet", () => {
  test("6. Deve permitir cadastrar um pet", () => {
    const window = setupDomAndLoadApp()
    window.petNome.value = "Rex"
    window.petTipo.value = "cachorro"
    window.petIdade.value = "3"
    window.cadastrarPet()
    expect(window.alert).not.toHaveBeenCalled()
    expect(window.listaPets.children.length).toBe(1)
    expect(window.listaPets.textContent).toContain("Rex")
    expect(window.listaPets.textContent).toContain("cachorro")
  })

  test("7. Pet deve possuir nome obrigatório", () => {
    const window = setupDomAndLoadApp()
    window.petNome.value = ""
    window.petTipo.value = "gato"
    window.petIdade.value = "2"
    window.cadastrarPet()
    expect(window.alert).toHaveBeenCalledWith("Pet precisa de nome")
    expect(window.listaPets.children.length).toBe(0)
  })

  test("8. Pet deve possuir tipo (cachorro, gato, etc)", () => {
    const window = setupDomAndLoadApp()
    window.petNome.value = "Miau"
    window.petTipo.value = ""
    window.petIdade.value = "1"
    window.cadastrarPet()
    expect(window.alert).toHaveBeenCalledWith("Pet precisa de tipo")
    expect(window.listaPets.children.length).toBe(0)
  })

  test("9. Pet deve possuir idade válida (número)", () => {
    const window = setupDomAndLoadApp()
    window.petNome.value = "Bob"
    window.petTipo.value = "gato"
    window.petIdade.value = "abc"
    window.cadastrarPet()
    expect(window.alert).toHaveBeenCalledWith("Idade inválida")
    expect(window.listaPets.children.length).toBe(0)

    window.alert.mockClear()
    window.petIdade.value = "-5"
    window.cadastrarPet()
    expect(window.alert).toHaveBeenCalledWith("Idade inválida")
    expect(window.listaPets.children.length).toBe(0)
  })
})

describe("Testes de Produto", () => {
  test("10. Deve permitir criar produto com nome", () => {
    const window = setupDomAndLoadApp()
    window.produtoNome.value = "Ração"
    window.produtoPreco.value = "45.9"
    window.criarProduto()
    expect(window.alert).not.toHaveBeenCalled()
    expect(window.listaProdutos.children.length).toBe(1)
    expect(window.listaProdutos.textContent).toContain("Ração")
  })

  test("11. Produto deve possuir preço maior que zero", () => {
    const window = setupDomAndLoadApp()
    window.produtoNome.value = "Item"
    window.produtoPreco.value = "0"
    window.criarProduto()
    expect(window.alert).toHaveBeenCalledWith("Preço inválido")
    expect(window.listaProdutos.children.length).toBe(0)
  })

  test("12. Produto não pode possuir preço negativo", () => {
    const window = setupDomAndLoadApp()
    window.produtoNome.value = "Item"
    window.produtoPreco.value = "-10"
    window.criarProduto()
    expect(window.alert).toHaveBeenCalledWith("Preço inválido")
    expect(window.listaProdutos.children.length).toBe(0)
  })

  test("13. Produto deve aparecer na lista de produtos cadastrados", () => {
    const window = setupDomAndLoadApp()
    window.produtoNome.value = "Coleira"
    window.produtoPreco.value = "29"
    window.criarProduto()
    const itens = [...window.listaProdutos.querySelectorAll("li")]
    expect(itens.some((li) => li.textContent.includes("Coleira"))).toBe(true)
  })
})

describe("Testes de Carrinho", () => {
  test("14. Deve permitir adicionar produto ao carrinho", () => {
    const window = setupDomAndLoadApp()
    window.produtoNome.value = "P1"
    window.produtoPreco.value = "10"
    window.criarProduto()
    window.produtoSelect.value = "0"
    window.adicionarCarrinho()
    expect(window.listaCarrinho.children.length).toBe(1)
    expect(window.listaCarrinho.textContent).toContain("P1")
  })

  test("15. Deve permitir remover produto do carrinho", () => {
    const window = setupDomAndLoadApp()
    window.produtoNome.value = "A"
    window.produtoPreco.value = "5"
    window.criarProduto()
    window.produtoNome.value = "B"
    window.produtoPreco.value = "7"
    window.criarProduto()
    window.produtoSelect.value = "0"
    window.adicionarCarrinho()
    window.produtoSelect.value = "1"
    window.adicionarCarrinho()
    window.removerCarrinho()
    expect(window.listaCarrinho.children.length).toBe(1)
    expect(window.listaCarrinho.textContent).toContain("B")
  })

  test("16. Carrinho deve listar todos os produtos adicionados", () => {
    const window = setupDomAndLoadApp()
    window.produtoNome.value = "X"
    window.produtoPreco.value = "10"
    window.criarProduto()
    window.produtoNome.value = "Y"
    window.produtoPreco.value = "20"
    window.criarProduto()
    window.produtoSelect.value = "0"
    window.adicionarCarrinho()
    window.produtoSelect.value = "1"
    window.adicionarCarrinho()
    expect(window.listaCarrinho.children.length).toBe(2)
    const text = window.listaCarrinho.textContent
    expect(text).toContain("X")
    expect(text).toContain("Y")
  })

  test("17. Carrinho deve calcular o valor total da compra", () => {
    const window = setupDomAndLoadApp()
    window.produtoNome.value = "A"
    window.produtoPreco.value = "30"
    window.criarProduto()
    window.produtoNome.value = "B"
    window.produtoPreco.value = "20"
    window.criarProduto()
    window.produtoSelect.value = "0"
    window.adicionarCarrinho()
    window.produtoSelect.value = "1"
    window.adicionarCarrinho()
    expect(window.document.getElementById("total").textContent).toBe("50.00")
  })
})

describe("Testes de Regras de Negócio", () => {
  test("18. Compra acima de R$100 deve aplicar desconto de 10%", () => {
    const window = setupDomAndLoadApp()
    window.compraClienteVip.checked = false
    window.produtoNome.value = "Big"
    window.produtoPreco.value = "60"
    window.criarProduto()
    window.produtoNome.value = "Big2"
    window.produtoPreco.value = "50"
    window.criarProduto()
    window.produtoSelect.value = "0"
    window.adicionarCarrinho()
    window.produtoSelect.value = "1"
    window.adicionarCarrinho()
    expect(window.document.getElementById("total").textContent).toBe("99.00")
  })

  test("19. Cliente VIP deve receber desconto de 15%", () => {
    const window = setupDomAndLoadApp()
    window.compraClienteVip.checked = true
    window.produtoNome.value = "Item"
    window.produtoPreco.value = "100"
    window.criarProduto()
    window.produtoSelect.value = "0"
    window.adicionarCarrinho()
    expect(window.document.getElementById("total").textContent).toBe("85.00")
  })

  test("20. Carrinho não deve aceitar produto com preço igual a zero", () => {
    const window = setupDomAndLoadApp()
    expect(window.__petshopTestHelpers).toBeDefined()
    window.__petshopTestHelpers.injectProduto({ nome: "Brinde", preco: 0 })
    window.produtoSelect.value = "0"
    window.adicionarCarrinho()
    expect(window.alert).toHaveBeenCalledWith("Produto com preço inválido para o carrinho")
    expect(window.listaCarrinho.children.length).toBe(0)
  })
})

describe("Outros Testes", () => {
  test("21. Carrinho vazio deve retornar total igual a 0", () => {
    const window = setupDomAndLoadApp()
    expect(Number.parseFloat(window.document.getElementById("total").textContent)).toBe(0)
  })

  test("22. Ao finalizar compra o carrinho deve ser limpo", () => {
    const window = setupDomAndLoadApp()
    window.produtoNome.value = "P"
    window.produtoPreco.value = "15"
    window.criarProduto()
    window.produtoSelect.value = "0"
    window.adicionarCarrinho()
    expect(window.listaCarrinho.children.length).toBeGreaterThan(0)
    window.finalizarCompra()
    expect(window.listaCarrinho.children.length).toBe(0)
    expect(window.alert).toHaveBeenCalled()
  })

  test("23. O carrossel deve trocar automaticamente as imagens (setInterval)", () => {
    const indexHtml = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8")
    const appJs = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8")
    const dom = new JSDOM(indexHtml, { runScripts: "outside-only", url: "http://localhost" })
    const window = dom.window
    window.alert = jest.fn()
    for (const id of IDS) {
      const el = window.document.getElementById(id)
      if (el) window[id] = el
    }
    let intervalCallback
    jest.spyOn(window, "setInterval").mockImplementation((fn) => {
      intervalCallback = fn
      return 1
    })
    window.eval(appJs)
    expect(window.setInterval).toHaveBeenCalledWith(expect.any(Function), 4000)
    const slides = window.document.querySelector(".slides")
    const before = slides.style.transform
    intervalCallback()
    expect(slides.style.transform).not.toBe(before)
  })

  test("24. Botões Adicionar / Remover / Finalizar devem funcionar corretamente", () => {
    const window = setupDomAndLoadApp()
    window.produtoNome.value = "Prod"
    window.produtoPreco.value = "10"
    window.criarProduto()
    window.produtoSelect.value = "0"

    const carrinhoCard = [...window.document.querySelectorAll(".card")].find((c) =>
      c.querySelector("#listaCarrinho")
    )
    const botoes = [...carrinhoCard.querySelectorAll("button")]
    const btnAdd = botoes.find((b) => b.textContent.includes("Adicionar"))
    const btnRem = botoes.find((b) => b.textContent.includes("Remover"))
    const btnFin = botoes.find((b) => b.textContent.includes("Finalizar"))

    btnAdd.click()
    expect(window.listaCarrinho.children.length).toBe(1)

    btnAdd.click()
    expect(window.listaCarrinho.children.length).toBe(2)

    btnRem.click()
    expect(window.listaCarrinho.children.length).toBe(1)

    btnFin.click()
    expect(window.listaCarrinho.children.length).toBe(0)
    expect(window.alert).toHaveBeenCalled()
  })
})
