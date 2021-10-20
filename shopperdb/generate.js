const { random, round } = require('lodash')
const fs = require('fs');
const productInfo = require('./productInfo');

const arrayLength = 8;
let controlProductId = 0;
let controlVariantId = 0;
const categoryKeys = ['women', 'men', 'kids'];
const colors = ['White', 'Black'] // update later

/* Get image URLs */
function getImgUrl(index, group) {
  return `/img/products/${group}/product${index + 1}a.jpeg`
}

function getImgOnHoverUrl(index, group) {
  return `/img/products/${group}/product${index + 1}b.jpeg`
}

/* Get product status (new or sale) */
let productStatus = {
  isNew: undefined,
  price: undefined,
  discountVal: undefined,
  discountedPrice: undefined
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
  productStatus.price = (random(30, 500)).toFixed(2);
  productStatus.discountedPrice = isDiscounted ? '$' + ((productStatus.price * (1 - productStatus.discountVal)).toFixed(2)) : '';
}

/* Sizes */
function getSizes(category) {
  switch (category) {
    case 'Shoes':
    case 'Sneakers':
      return ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13', '14'];
    case 'Dresses':
    case 'Sweats':
    case 'Skirts':
    case 'Casual Shirts':
    case 'Pants':
    case 'Pants':
    case 'Coats':
    case 'Jackets':
    case 'T-Shirts':
      return ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    case 'Bags':
    case 'Backpacks':
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
function getVariants(colorList, sizeList, index, group) {
  return colorList.reduce((variantArray, color) => {
    variantArray.push({
      variantId: controlVariantId++,
      variantColor: color,
      variantImage: getImgUrl(index, group),
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

  for (let i = 0; i < arrayLength; i++) {
    getProductStatus();
    controlProductId++;
    category = productInfo[group]['categories'][i];
    sizes = getSizes(category);
    variants = getVariants(colors, sizes, i, group);

    products.push({
      "id": controlProductId,
      "images": {
        "img": getImgUrl(i, group),
        "imgOnHover": getImgOnHoverUrl(i, group),
      },
      "category": category,
      "name": productInfo[group]['productName'][i],
      "isNew": productStatus.isNew,
      "pricing": {
        "price": '$' + productStatus.price,
        "discount": productStatus.discountVal,
        "discountedPrice": productStatus.discountedPrice,
      },
      "sizes": sizes,
      "colors": ['White', 'Black'],
      "variants": variants,
      "isWishlisted": false
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
