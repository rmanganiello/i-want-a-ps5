import { ARGENTINA, ARGENTINIAN_PESOS } from '../../constants/index.js'

export default {
  vendor: 'Atajo',
  slug: 'atajo-ar',
  url: 'https://www.atajo.com.ar/consolas-gaming--prod--110',
  logoPath: 'assets/img/atajo-logo.png',
  country: ARGENTINA,
  currency: ARGENTINIAN_PESOS,
  usesPagination: false,
  getPageNumberQueryString: () => '',
  checkEmptyPage: async () => false,
  getAvailableItems: async ({ page }) => {
    const items = await page.$$('div.cajasoferta')
    const ps5Items = []

    for (const item of items) {
      const title = await item.$eval('a.titprod', element => element.innerText)
      if (title.toLowerCase().includes('playstation 5')) {
        const url = await item.$eval('a.titprod', element => element.href)
        const price = await item.$eval('div.price', element => element.innerText)
        const thumbnail = await item.$eval('img.img-responsive', element => element.src)
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
