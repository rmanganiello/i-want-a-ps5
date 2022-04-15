import { ARGENTINA, ARGENTINIAN_PESOS } from '../../constants/index.js'

export default {
  vendor: 'Más Online',
  slug: 'masonline-ar',
  url: 'https://www.masonline.com.ar/gaming/consolas',
  logoPath: 'assets/img/masonline-logo.svg',
  country: ARGENTINA,
  currency: ARGENTINIAN_PESOS,
  usesPagination: false,
  getPageNumberQueryString: () => '',
  checkEmptyPage: async () => false,
  navigationSettings: {
    waitUntil: 'networkidle'
  },
  getAvailableItems: async ({ page }) => {
    const items = await page.$$('section.vtex-product-summary-2-x-container')
    const ps5Items = []
    for (const item of items) {
      const title = await item.$eval('.vtex-product-summary-2-x-productBrand', element => element.innerText)
      if (title.toLowerCase().includes('playstation 5')) {
        const priceIntegers = await item.$$eval('.vtex-store-components-3-x-currencyInteger', elements => elements.map(element => element.innerText).join('.'))
        const priceFraction = await item.$eval('.vtex-store-components-3-x-currencyFraction', element => element.innerText)
        const parsedFraction = parseInt(priceFraction)
        const price = parsedFraction > 0 ? `${priceIntegers},${parsedFraction}` : priceIntegers
        const thumbnail = await item.$eval('img', element => element.src)
        const url = await item.$eval('a', element => element.href)
        ps5Items.push({
          title,
          url,
          price: `$ ${price}`,
          thumbnail
        })
      }
    }
    return ps5Items
  }
}
