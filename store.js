
import RevolutCheckout from "@revolut/checkout";

if (document.readyState == 'loading') {
  document.addEventListener('DOMContentLoaded', ready)
} else {
  ready()
}


RevolutCheckout.payments({
  locale: 'en', // optional, defaults to 'en'
  mode: 'sandbox', // defaults to 'prod'
  publicToken: 'pk_t57IdWMw6olEbAd1ftm4qcfQ3UmVbzM3sc63Qq1weJVH2hlr', // merchant public API key
}).then((paymentInstance) => {
  var totalCents = total * 100
  const paymentOptions = {
    currency: 'USD', // 3-letter currency code
    totalAmount: totalCents, // in lowest denomination e.g., cents
    
    buttonStyle: {
      action: 'pay',
      variant: 'dark',
      size: 'large',
      radius: 'small',
    },

    createOrder: async () => {
      const order = await fetch('', {
        method: 'POST',
        body: JSON.stringify({ amount: totalCents, currency }),
        headers: {
          "Content-Type": "application/json",
        }
      }).then((res) => res.json()).then((data) => {return data})
      
      return { publicId: order.public_id }
    },
  }
})

const revolutPay = paymentInstance.revolutPay 


revolutPay.mount(document.getElementById('revolut-pay'), paymentOptions)

revolutPay.on('payment', (event) => {
  switch (event.type) {
    case 'cancel': {
      if (event.dropOffState === 'payment_summary') {
        log('what a shame, please complete your payment')
      }
      break
    }

    case 'success':
      onSuccess()
      break

    case 'error':
      onError(event.error)
      break
  }
})

function ready() {
  var removeCartItemButton = document.getElementsByClassName('btn-danger')
  console.log(removeCartItemButton)

  for (var i = 0; i < removeCartItemButton.length; i++) {
    var button = removeCartItemButton[i]
    button.addEventListener('click', removeCartItem)
  }

  var quantityInputs = document.getElementsByClassName('cart-quantity-input')
  for (var i = 0; i < quantityInputs.length; i++) {
    var input = quantityInputs[i]
    input.addEventListener('change', quantityChanged)
  }

  var addToCartButtons = document.getElementsByClassName('shop-item-button')
  for (var i = 0; i < addToCartButtons.length; i++) {
    var button = addToCartButtons[i]
    button.addEventListener('click', addToCartClicked)
  }

  document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
}

function purchaseClicked() {
  alert('Thank you for your purchase')
  var cartItems = document.getElementsByClassName('cart-items')[0]
  while (cartItems.hasChildNodes()) {
    cartItems.removeChild(cartItems.firstChild)
  }
  updateCardTotal()
}

function removeCartItem(event) {
  var buttonClicked = event.target
  buttonClicked.parentElement.parentElement.remove()
  updateCardTotal()
}

function quantityChanged(event) {
  var input = event.target
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1
  }
  updateCardTotal()
}

function addToCartClicked(event) {
  var button = event.target
  var shopItem = button.parentElement.parentElement
  var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
  var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
  var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src

  addItemToCart(title, price, imageSrc)
  updateCardTotal()
}

function addItemToCart(title, price, imageSrc) {
  var cartRow = document.createElement('div')
  cartRow.classList.add('cart-row')
  var cartItems = document.getElementsByClassName('cart-items')[0]
  var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
  for (var i = 0; i < cartItemNames.length; i++) {
    if (cartItemNames[i].innerText == title) {
      alert('This item is already added to the cart')
      return
    }
  } 


  var cartRowContents = `
    <div class="cart-item cart-column">
      <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
      <span class="cart-item-title">${title}</span>
    </div>
    <span class="cart-price cart-column">${price}</span>
    <div class="cart-quantity cart-column">
      <input class="cart-quantity-input" type="number" value="1">
      <button class="btn btn-danger" type="button">REMOVE</button>
    </div>`
  cartRow.innerHTML = cartRowContents
  cartItems.append(cartRow)
  cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
  cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
}

function updateCardTotal() {
  var cartItemContainer = document.getElementsByClassName('cart-items')[0]
  var cartRows = cartItemContainer.getElementsByClassName('cart-row')
  var total = 0
  for (var i = 0; i < cartRows.length; i++) {
    var cartRow = cartRows[i]
    var priceElement = cartRow.getElementsByClassName('cart-price')[0]
    var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
    
    var price = parseFloat(priceElement.innerText.replace('$', ''))
    var quantity = quantityElement.value
    total = total + (price * quantity)
    console.log(total)
  }
  total = Math.round(total * 100) / 100
  document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total
}




