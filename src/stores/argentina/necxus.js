import { ARGENTINA, ARGENTINIAN_PESOS } from '../../constants/index.js'

export default {
  vendor: 'Necxus',
  slug: 'necxus-ar',
  url: 'https://www.necxus.com.ar/categorias/53/530901/Playstation-5/',
  logoPath: 'assets/img/necxus-logo.svg',
  country: ARGENTINA,
  currency: ARGENTINIAN_PESOS,
  usesPagination: false,
  getPageNumberQueryString: () => '',
  checkEmptyPage: async () => false,
  getAvailableItems: async ({ page }) => {
    const items = await page.$$('.grid-custom-wrap')
    const ps5Items = []

    for (const item of items) {
      const title = await item.$eval('h2', element => element.innerText)
      if (title.toLowerCase().includes('consola')) {
        const url = await item.$eval('a', element => element.href)
        const price = await item.$eval('span[class=final-price]', element => element.innerText)
        const thumbnail = await item.$eval('img', element => element.src)
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
