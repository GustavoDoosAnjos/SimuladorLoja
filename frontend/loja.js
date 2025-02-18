document.addEventListener('DOMContentLoaded', () => {
  const cepInput = document.getElementById('cepInput')
  const fetchProductsBtn = document.getElementById('fetchProductsBtn')
  const productFilter = document.getElementById('productFilter')
  const productList = document.getElementById('productList')
  const cartItems = document.getElementById('cartItems')

  let products = []
  let cart = []

  fetchProductsBtn.addEventListener('click', async () => {
    showLoading()
    const numberRegex = /^\d{5}-?\d{3}$/
    cepInput.value.replace('-', '')
    const cep = cepInput.value.trim().match(numberRegex)

    if (!cep) {
      alert('Digite um CEP válido')
      hideLoading()
      return
    }

    const productsResponse = await fetch('http://localhost:3000/api/products')
    const data = await productsResponse.json()

    try {
      const cepResponse = await fetch(`http://localhost:3000/api/cep/${cep}`)
      const address = await cepResponse.json()
      if (address.erro) {
        alert('CEP inválido')
        return
      }

      products = await Promise.all(
        data.items.map(async (product) => {
          const cepProduto = product.cep.replace('-', '')
          try {
            const productResponse = await fetch(`http://localhost:3000/api/cep/${cepProduto}`)
            const enderecoProduto = await productResponse.json()

            if (enderecoProduto.uf === address.uf) {
              return product
            }
          } catch (error) {
            console.error(`Erro ao buscar dados do produto ${product.id}:`, error)
          }
          return null
        })
      )
      const filteredProducts = products.filter((product) => product !== null)

      renderProducts(filteredProducts)
      hideLoading()
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
      alert('Erro ao buscar dados. Tente novamente.')
    }
  })

  productFilter.addEventListener('input', () => {
    const keyword = productFilter.value.trim().toLowerCase()
    const filteredProducts = products.filter(
      (product) => product !== null && product.name.toLowerCase().includes(keyword)
    )
    renderProducts(filteredProducts)
  })

  function renderProducts(products) {
    productList.innerHTML = products
      .map(
        (product) => `
        <article class="col-md-3">
          <div class="product-card">
            <h3>${product.name}</h3>
            <p>${product.desc}</p>
            <p><strong>Preço:</strong> ${product.pricing.price_usd}</p>
            <p><strong>cep:</strong> ${product.cep}</p>
            <button class="adicionarAoCarrinho btn btn-success btn-sm id-${product.id}" onclick="addToCart('${product.id}')">
              <span class="cartText">Adicionar ao carrinho</span>
              <span class="check hidden">Adicionado!</span>
            </button>
          </div>
        </article>
      `
      )
      .join('')
  }

  window.addToCart = (productId) => {
    const filteredProducts = products.filter((product) => product !== null)
    const product = filteredProducts.find((p) => p.id === productId)
    showCheck(productId)

    if (product) {
      const existingProduct = cart.find((item) => item.product.id === productId)
      if (existingProduct) {
        existingProduct.quantity += 1
      } else {
        const productObj = { product, quantity: 1 }
        cart.push(productObj)
      }

      renderCart()
    }

    setTimeout(() => {
      hideCheck(productId)
    }, 800)
  }

  window.removeFromCart = (productId) => {
    const existingProduct = cart.find((item) => item.product.id === productId)

    if (existingProduct && existingProduct.quantity > 1) {
      existingProduct.quantity -= 1
    } else {
      cart = cart.filter((item) => item.product.id !== productId)
    }
    renderCart()
  }

  function renderCart() {
    cartItems.innerHTML = cart
      .map(
        (item) => `
        <li class="list-group-item">
          ${item.product.name} - ${item.product.pricing.price_usd}

          <div class="col-md-3 col-lg-3 col-xl-2 d-flex">
                      <button data-mdb-button-init data-mdb-ripple-init class="btn btn-link px-2 m-2"
                        onclick="removeFromCart('${item.product.id}')">
                        <i class="fas fa-minus"></i>
                      </button>

                      <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                      <h6 class="mt-3">${item.quantity}</h6>
                      </div>

                      <button data-mdb-button-init data-mdb-ripple-init class="btn btn-link px-2 m-2"
                        onclick="addToCart('${item.product.id}')">
                        <i class="fas fa-plus"></i>
                      </button>
                    </div>
        </li>
      `
      )
      .join('')
  }

  async function fetchProdutos() {
    const productsResponse = await fetch('http://localhost:3000/api/products')
    const data = await productsResponse.json()

    products = data.items

    renderProducts(products)
  }

  function showLoading() {
    document.querySelector('.buttonSpan').classList.remove('shown')
    document.querySelector('.buttonSpan').classList.add('hidden')
    document.querySelector('.loader').classList.remove('hidden')
    document.querySelector('.loader').classList.add('shown')
  }

  function hideLoading() {
    document.querySelector('.buttonSpan').classList.remove('hidden')
    document.querySelector('.buttonSpan').classList.add('shown')
    document.querySelector('.loader').classList.remove('shown')
    document.querySelector('.loader').classList.add('hidden')
  }

  function showCheck(id) {
    document.querySelector(`.id-${id} > .cartText`).classList.remove('shown')
    document.querySelector(`.id-${id} > .cartText`).classList.add('hidden')
    document.querySelector(`.id-${id} > .check`).classList.remove('hidden')
    document.querySelector(`.id-${id} > .check`).classList.add('shown')
  }

  function hideCheck(id) {
    document.querySelector(`.id-${id} > .cartText`).classList.remove('hidden')
    document.querySelector(`.id-${id} > .cartText`).classList.add('shown')
    document.querySelector(`.id-${id} > .check`).classList.remove('shown')
    document.querySelector(`.id-${id} > .check`).classList.add('hidden')
  }

  fetchProdutos()
})
