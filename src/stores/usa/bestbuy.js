import { USA, US_DOLLARS } from '../../constants/index.js'

export default {
  vendor: 'BestBuy',
  slug: 'bestbuy-us',
  url: 'https://www.bestbuy.com/site/searchpage.jsp?intl=nosplash&st=playstation+5',
  logo: 'bestbuy-logo.png',
  usesPagination: false,
  logoPath: 'assets/img/bestbuy-logo.png',
  country: USA,
  currency: US_DOLLARS,
  getPageNumberQueryString: () => '',
  checkEmptyPage: async () => false,
  getAvailableItems: async ({ page }) => {
    const items = await page.$$('li[class=sku-item]')
    const ps5Items = []

    for (const item of items) {
      const outOfStock = await item.$('button[data-button-state=SOLD_OUT]')
      if (outOfStock) {
        continue
      }
      const title = await item.$eval('h4[class=sku-header]>a', element => element.innerText)
      const url = await item.$eval('h4[class=sku-header]>a', element => element.href)
      const price = await item.$eval('div[class^=priceView-hero-price]>span', element => element.innerText)
      const thumbnail = await item.$eval('img', element => element.src)
      ps5Items.push({
        title,
        url,
        price,
        thumbnail
      })
    }
    return ps5Items
  }
}
