const { random, round } = require('lodash')
const fs = require('fs');
var faker = require('faker');
const { address } = require('faker');
faker.locale = 'en_US';

const statuses = ['In Processing', 'Awating Pickup', 'Partially Shipped', 'Shipped', 'Delivered', 'Cancelled'];

const itemList = [{ "productId": 1, "image": "/img/products/women/product1-color2-1.jpeg", "name": "Harper Ankle Strap Heels", "variantColor": "Blue", "sizeName": "7.5", "quantity": 2, "sizeStock": 5, "price": 154.38000000000002 }, { "productId": 2, "image": "/img/products/women/product2-color1-1.jpeg", "name": "In the Meadows Crochet Lace Babydoll Dress", "variantColor": "Mustard Yellow", "sizeName": "M", "quantity": 4, "sizeStock": 5, "price": 408 }, { "productId": 3, "image": "/img/products/women/product3-color1-1.jpeg", "name": "Fayth Chunky Sneakers", "variantColor": "White and Green", "sizeName": "7.5", "quantity": 1, "sizeStock": 2, "price": 499 }, { "productId": 6, "image": "/img/products/women/product6-color3-1.jpeg", "name": "Sidewalk Stunner Vegan Leather Backpack", "variantColor": "Grey", "sizeName": "One size", "quantity": 1, "sizeStock": 3, "price": 209 }, { "productId": 8, "image": "/img/products/women/product8-color2-1.jpeg", "name": "Shasta Suede Ankle Booties", "variantColor": "Black", "sizeName": "11.5", "quantity": 1, "sizeStock": 4, "price": 480 }, { "productId": 12, "image": "/img/products/men/product4-color1-1.jpeg", "name": "Essential Fleece Pullover", "variantColor": "Washed Teal", "sizeName": "M", "quantity": 1, "sizeStock": 2, "price": 69 }, { "productId": 15, "image": "/img/products/men/product7-color2-1.jpeg", "name": "Lorne Sunglasses", "variantColor": "Tort/Green", "sizeName": "One size", "quantity": 2, "sizeStock": 5, "price": 338.12 }, { "productId": 17, "image": "/img/products/kids/product1-color2-1.jpeg", "name": "Emmy Oversized Denim Jacket", "variantColor": "Bleach Wash/Contrast Floral", "sizeName": "S", "quantity": 1, "sizeStock": 3, "price": 28.439999999999998 }, { "productId": 19, "image": "/img/products/kids/product3-color1-1.jpeg", "name": "Libby Sleeveless Dress", "variantColor": "Indigo Blue Wash", "sizeName": "XL", "quantity": 1, "sizeStock": 2, "price": 280 }, { "productId": 20, "image": "/img/products/kids/product4-color1-1.jpeg", "name": "Classic Homeboots", "variantColor": "Silver Sage", "sizeName": "11", "quantity": 1, "sizeStock": 5, "price": 358.83000000000004 }]

const shippingOptions = [
  {
    method: 'Standard Shipping (5-7 days)',
    deliveryPrice: 8,
  },
  {
    method: 'Express Shipping (3-5 days)',
    deliveryPrice: 12,
  },
  {
    method: '1-2 day Shipping',
    deliveryPrice: 18,
  },
  {
    method: 'Free Shipping',
    deliveryPrice: 0,
  },
];

const paymentMethod = ['Debit Mastercard', 'Paypal']

function getItems() {
  let quantity = random(1, 5);
  let items = [];
  let randomSelection;
  while (items.length < quantity) {
    randomSelection = itemList[random(0, itemList.length - 1)]
    if (!items.includes(randomSelection)) items.push(randomSelection)
  }
  return items;
}

function getAddress() {
  const billing = [
    faker.name.findName(),
    faker.address.streetAddress(),
    faker.address.city(),
    faker.address.state(),
    faker.address.zipCodeByState(),
    faker.address.country(),
    faker.address.zipCode(),
  ];

  let isBillingAndShippingSame = faker.datatype.boolean();
  let shipping;

  if (isBillingAndShippingSame) {
    shipping = [...billing];
  } else {
    shipping = [faker.name.findName(), faker.address.streetAddress(), faker.address.city(), faker.address.state(), faker.address.zipCodeByState()];
  }

  let addresses = { billing, shipping };
  return addresses;
}

function getShipping() {
  let index = random(0, shippingOptions.length - 1);
  return {
    shippingMethod: shippingOptions[index].method,
    shippingFee: shippingOptions[index].deliveryPrice,
  }
}

/* DATA GENERATING */
function createData() {
  let orders = [];

  for (let i = 0; i <= 5; i++) {
    orders.push({
      orderNo: faker.finance.routingNumber(),
      status: statuses[random(0, statuses.length - 1)],
      items: getItems(),
      shipping: getShipping(),
      addresses: getAddress(),
      paymentMethod: paymentMethod[random(0, paymentMethod.length - 1)]
    })
  }

  return orders;
}

const data = createData();
fs.writeFileSync("./orders.json", JSON.stringify(data));