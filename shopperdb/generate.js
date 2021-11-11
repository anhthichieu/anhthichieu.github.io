const { random, round } = require('lodash')
const fs = require('fs');
const newProductInfo = require('./newProductInfo');

let controlProductId = 0;
let controlVariantId = 0;
const categoryKeys = ['women', 'men', 'kids'];

/* Get image URLs */
function getImages(productIndex, colorIndex, group) {
  let array = [];
  for (let i = 1; i <= 4; i++) {
    array.push(`/img/products/${group}/product${productIndex + 1}-color${colorIndex + 1}-${i}.jpeg`)
  }
  return array;
}

/* Get product status (new or sale) */
let productStatus = {
  isNew: undefined,
  price: undefined,
  discountVal: undefined,
  priceAfterDiscount: undefined
}

function getProductStatus() {
  // New
  const newExpression = Math.random() >= 0.5; // Expression will return true 50% of the time, and false the other 50%
  productStatus.isNew = newExpression;

  // Discount
  const discountExpression = Math.random() >= 0.5
  let isDiscounted = productStatus.isNew ? false : discountExpression; // New product is not discounted
  productStatus.discountVal = isDiscounted ? round(random(0.1, 0.7), 2) : 0

  // Price
  productStatus.price = (random(30, 500));
  productStatus.priceAfterDiscount = productStatus.price * (1 - productStatus.discountVal);
}

/* Sizes */
function getSizes(category) {
  switch (category) {
    case 'Shoes':
    case 'Sneakers':
    case 'Sandals':
      return ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13', '14'];
    case 'Dresses':
    case 'Sweats':
    case 'Skirts':
    case 'Shirts':
    case 'Pants':
    case 'Coats':
    case 'Jackets':
    case 'T-Shirts':
    case 'Shorts':
      return ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    case 'Headbands':
    case 'Hats':
      return ['Free size']
    default:
      return ['One size']
  }
}

/* Stock */
function getStock(sizeList) {
  return sizeList.reduce((stockArray, size) => {
    stockArray.push({
      [size]: random(0, 5)
    })
    return stockArray;
  }, [])
}


/* Variants */
function getVariants(colorList, sizeList, productIndex, group) {
  return colorList.reduce((variantArray, color, colorIndex) => {
    variantArray.push({
      variantId: controlVariantId++,
      variantColor: color,
      variantImages: getImages(productIndex, colorIndex, group),
      stock: getStock(sizeList)
    })
    return variantArray;
  }, [])
}

function createData(group) {
  let products = [];
  let category = ''
  let sizes = []
  let variants = [];
  let colors = [];

  for (let [i, product] of newProductInfo[group].entries()) {
    getProductStatus();
    controlProductId++;
    category = product.category;
    sizes = getSizes(category);
    colors = product.colors;
    variants = getVariants(colors, sizes, i, group);

    products.push({
      productGroup: group,
      id: controlProductId,
      category: category,
      name: product.productName,
      isNew: productStatus.isNew,
      pricing: {
        price: productStatus.price,
        discount: productStatus.discountVal,
        priceAfterDiscount: productStatus.priceAfterDiscount,
      },
      variants: variants,
    })
  }
  return products;
}

for (const key of categoryKeys) {
  const data = createData(key);
  fs.writeFileSync(`./${key}.json`, JSON.stringify(data));
}

/* Cach cu de gen data tu json-server
const generate = function () {
  let data = {}
  for (const key of categoryKeys) {
    data[key] = createData(key);
  }
  return data
}
const data = generate();
fs.writeFileSync('./db.json', JSON.stringify(data));
*/
