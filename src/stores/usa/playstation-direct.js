import { USA, US_DOLLARS } from '../../constants/index.js'

export default {
  vendor: 'Playstation Direct',
  slug: 'playstation-direct-us',
  url: 'https://direct.playstation.com/en-us/hardware/ps5',
  logoPath: 'assets/img/playstation-logo.png',
  country: USA,
  currency: US_DOLLARS,
  usesPagination: false,
  getPageNumberQueryString: () => '',
  checkEmptyPage: async () => false,
  getAvailableItems: async ({ page }) => {
    const items = await page.$$('hero-component')
    const ps5Items = []

    for (const item of items) {
      const outOfStock = await item.$('.out-stock-wrpr')
      if (outOfStock) {
        continue
      }
      const title = await item.$eval('p[class=sony-text-overline]', element => element.innerText)
      const url = await item.$eval('a', element => element.href)
      const price = await item.$eval('span[class^=product-price]', element => element.innerText)
      const thumbnail = await item.$eval('img', element => element.src)
      ps5Items.push({
        title,
        url,
        price: `$ ${price}`,
        thumbnail
      })
    }
    return ps5Items
  }
}
