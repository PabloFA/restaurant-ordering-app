import { menuArray } from '/data.js'

const openBtn = document.getElementById('openOrder')
const closeBtn = document.getElementById('closeOrder')
const order = document.getElementById('order-popup')
const completeOrderBtn = document.getElementById('completeOrder')
const cardDetails = document.getElementById('card-details')
const finalPopup = document.getElementById('final-popup')
const starBtn = document.querySelectorAll('.stars i')
const totalPrice = document.getElementById('totalPrice')
const finalPrice = document.getElementById('finalPrice')
const menuContainer = document.getElementById('item-list')
const orderContainer = document.getElementById('menu-order')
const orderDetails = document.getElementById('order-details')
const discountInput = document.getElementById('discount-input')
const discountBtn = document.getElementById('discount-btn')
const discountCode = 'OFF10'
const newOrder = document.getElementById('new-order')
let selectedItems = []

const form = document.querySelector('.form')

form.addEventListener('submit', function (event) {
  event.preventDefault()

  // Check if all input fields are filled
  const nameInput = document.getElementById('name')
  const cardNumInput = document.getElementById('cardNum')
  const cvvInput = document.getElementById('cvv')

  if (nameInput.value.trim() === '') {
    alert('Please enter your name.')
    return
  }

  if (cardNumInput.value.trim() === '') {
    alert('Please enter your card number.')
    return
  }

  if (cvvInput.value.trim() === '') {
    alert('Please enter your CVV.')
    return
  }

  finalPopup.classList.add('open')
  document.getElementById('name').value = ''
  document.getElementById('cardNum').value = ''
  document.getElementById('cvv').value = ''
  renderOrderDetails()
})

function handleItemClick(event, food) {
  event.preventDefault()
  const alreadyAdded = selectedItems.some(
    (item) => JSON.stringify(item) === JSON.stringify(food)
  )

  alreadyAdded
    ? alert('This item is already added to your order')
    : selectedItems.push(food)
}

function clearArr() {
  selectedItems = []
  orderContainer.innerHTML = ''
}

// SHOW THE ENTIRE LIST OF FOOD ITEMS

function render() {
  menuArray.forEach((food) => {
    const itemElement = document.createElement('div')
    itemElement.classList.add('item')
    itemElement.innerHTML = `<img class="item-img" src="Image/${
      food.img
    }" alt="" />
        <div class="item-info">
          <h2 class="item-title">${food.name}</h2>
          <p class="item-ingredients">${food.ingredients.join(
            ', '
          )}</p>
          <p class="item-price">$${food.price}</p>
        </div>
        <a class="btn-item" href="#">
          <i class="fa-solid fa-plus"></i>
        </a>`
    const btnItem = itemElement.querySelector('.btn-item')
    btnItem.addEventListener('click', (event) =>
      handleItemClick(event, food)
    )
    menuContainer.appendChild(itemElement)
  })
}
render()

//SHOW ORDER LIST

function renderOrder() {
  selectedItems.forEach((food) => {
    const orderElement = document.createElement('div')
    orderElement.classList.add('item')
    orderElement.innerHTML = `<img class="item-img" src="Image/${
      food.img
    }" alt="" />
        <div class="item-info">
          <h2 class="item-title">${food.name}</h2>
          <p class="item-ingredients">${food.ingredients.join(
            ', '
          )}</p>
          <p class="item-price" id='item-price'>$${food.price}</p>
        </div>
        <a class="btn-item" href="#">
        <i class="fas fa-minus"></i>
      </a>`
    const btnItem = orderElement.querySelector('.btn-item')
    btnItem.addEventListener('click', () => removeItem(food.id))
    orderContainer.appendChild(orderElement)
  })
}

function renderOrderDetails() {
  selectedItems.forEach((food) => {
    const orderDetailsElement = document.createElement('div')
    orderDetailsElement.classList.add('item')
    orderDetailsElement.innerHTML = `<img class="item-img" src="Image/${
      food.img
    }" alt="" />
        <div class="item-info">
          <h2 class="item-title">${food.name}</h2>
          <p class="item-ingredients">${food.ingredients.join(
            ', '
          )}</p>
          <p class="item-price">$${food.price}</p>
        </div>`
    orderDetails.appendChild(orderDetailsElement)
  })
}

// CALCULATE TOTAL PRICE OF ORDER

function calculateTotalPrice(arr) {
  const totalP = arr.reduce(
    (total, currentPrice) => total + currentPrice.price,
    0
  )
  totalPrice.innerHTML = `$${totalP}`
  return totalP
}

// DISCOUNT

function applyDiscount(arr, discountPercentage) {
  arr.forEach((item) => {
    if (!item.discountApplied) {
      const discountedPrice =
        item.price - (item.price * discountPercentage) / 100
      item.price = discountedPrice
      item.discountApplied = true
    }
  })

  return arr
}

function updateUI() {
  // Remove existing items
  orderContainer.innerHTML = ''

  // Re-render menuArray
  selectedItems.forEach((food) => {
    const itemElement = document.createElement('div')
    itemElement.classList.add('item')
    itemElement.innerHTML = `
      <img class="item-img" src="Image/${food.img}" alt="" />
      <div class="item-info">
        <h2 class="item-title">${food.name}</h2>
        <p class="item-ingredients">${food.ingredients.join(', ')}</p>
        <p class="item-price">$${food.price}</p>
      </div>
      <a class="btn-item" href="#">
        <i class="fas fa-minus"></i>
      </a>
    `
    const btnItem = itemElement.querySelector('.btn-item')
    btnItem.addEventListener('click', () => removeItem(food.id))
    orderContainer.appendChild(itemElement)
  })
  totalPrice.innerHTML = `$${calculateTotalPrice(selectedItems)}`
}

function removeItem(itemId) {
  const index = selectedItems.findIndex((item) => item.id === itemId)

  if (index !== -1) {
    selectedItems.splice(index, 1)
    updateUI()
  }
}

openBtn.addEventListener('click', () => {
  order.classList.add('open')
  calculateTotalPrice(selectedItems)
  renderOrder()
})

closeBtn.addEventListener('click', () => {
  clearArr()
  order.classList.remove('open')
})

discountBtn.addEventListener('click', () => {
  if (discountCode === discountInput.value) {
    applyDiscount(selectedItems, 10)
    totalPrice.innerHTML = `$${calculateTotalPrice(selectedItems)}`
    finalPrice.innerHTML = `$${calculateTotalPrice(selectedItems)}`
  } else {
    alert('Your discount is not available anymore')
  }
  discountInput.value = ''
})

completeOrderBtn.addEventListener('click', () => {
  finalPrice.innerHTML = `$${calculateTotalPrice(selectedItems)}`
  cardDetails.classList.add('open')
  order.classList.remove('open')
})

function resetOrder(selectedItems, menuArray) {
  selectedItems.length = 0

  // Reset prices and discount flags in menuArray
  menuArray.forEach((item) => {
    item.price = originalPrices[item.id]
    item.discountApplied = false
  })
}

// Store original prices of items for resetting
const originalPrices = menuArray.reduce((acc, item) => {
  acc[item.id] = item.price
  return acc
}, {})

newOrder.addEventListener('click', () => {
  resetOrder(selectedItems, menuArray)

  orderDetails.innerHTML = ''

  updateUI()

  finalPopup.classList.remove('open')
  cardDetails.classList.remove('open')
  resetReview()
})

// REVIEW STARS

starBtn.forEach((star, index1) => {
  star.addEventListener('click', () => {
    starBtn.forEach((star, index2) => {
      index1 >= index2
        ? star.classList.add('active')
        : star.classList.remove('active')
    })
  })
})

function resetReview() {
  const stars = document.querySelectorAll('.fa-star')
  stars.forEach((star) => {
    star.classList.remove('active')
  })
}
