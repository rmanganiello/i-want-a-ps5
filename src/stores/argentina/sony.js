import { ARGENTINA, ARGENTINIAN_PESOS } from '../../constants/index.js'

export default {
  vendor: 'Sony Store',
  slug: 'sony-store-ar',
  logoPath: 'assets/img/sony-logo.png',
  country: ARGENTINA,
  currency: ARGENTINIAN_PESOS,
  url: 'https://store.sony.com.ar/ps5?cpint=PS5-Landing-SEP-29-2020',
  usesPagination: true,
  getPageNumberQueryString: ({ pageNumber }) => `&page=${pageNumber}`,
  checkEmptyPage: async ({ page }) => {
    const notFoundElement = await page.$('.vtex-rich-text-0-x-heading--notfound')
    return !!notFoundElement
  },
  getAvailableItems: async ({ page }) => {
    const items = await page.$$('.vtex-search-result-3-x-galleryItem')
    const ps5Items = []

    for (const item of items) {
      const title = await item.$eval('.vtex-product-summary-2-x-productBrand', element => element.innerText)
      if (title.includes('PS5 Estandar')) {
        const outOfStock = await item.$('.vtex-rich-text-0-x-paragraph--producto-sin-stock')
        if (outOfStock) {
          continue
        }
        const url = await item.$eval('.vtex-product-summary-2-x-clearLink', element => element.href)
        const thumbnail = await item.$eval('img', element => element.src)
        const price = await item.$eval('.vtex-product-price-1-x-currencyContainer', element => element.innerText)
        ps5Items.push({
          title,
          url,
          price,
          thumbnail
        })
      }
    }
    return ps5Items
  }
}
