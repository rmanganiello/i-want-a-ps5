import { ARGENTINA, ARGENTINIAN_PESOS } from '../../constants/index.js'

export default {
  vendor: 'Walmart Argentina',
  slug: 'walmart-ar',
  url: 'https://www.walmart.com.ar/consola-playstation-5-standard/p',
  logoPath: 'assets/img/walmart-logo.png',
  country: ARGENTINA,
  currency: ARGENTINIAN_PESOS,
  usesPagination: false,
  getPageNumberQueryString: () => '',
  checkEmptyPage: async () => false,
  getAvailableItems: async ({ page }) => {
    const outOfStock = await page.$('div[class=u-center]>h3')
    if (outOfStock) {
      return []
    }
    const title = await page.$eval('div[class*=productName]', element => element.innerText)
    const priceItems = await page.$$('.skuBestPrice>span')
    const [amount, cents] = await Promise.all(priceItems.slice(1).map(item => item.innerText()))
    const price = `${amount},${cents}`
    const thumbnail = await page.$eval('#image-main', element => element.src)
    return [{
      title,
      url: 'https://www.walmart.com.ar/consola-playstation-5-standard/p',
      price: `$ ${price}`,
      thumbnail
    }]
  }
}
