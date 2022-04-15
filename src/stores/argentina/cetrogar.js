import { ARGENTINA, ARGENTINIAN_PESOS } from '../../constants/index.js'

export default {
  vendor: 'Cetrogar',
  slug: 'cetrogar-ar',
  url: 'https://www.cetrogar.com.ar/tecnologia/video-juegos/consolas.html',
  logoPath: 'assets/img/cetrogar-logo.svg',
  country: ARGENTINA,
  currency: ARGENTINIAN_PESOS,
  usesPagination: false,
  getPageNumberQueryString: () => '',
  checkEmptyPage: async () => false,
  getAvailableItems: async ({ page }) => {
    const items = await page.$$('.product-item')
    const ps5Items = []
    for (const item of items) {
      const title = await item.$eval('.product-item-name', element => element.innerText)
      if (title.toLowerCase().includes('playstation 5') || title.toLowerCase().includes('ps5')) {
        const price = await item.$eval('span[data-price-type=finalPrice]', element => element.innerText)
        const backgroundImage = await item.$eval('.product-image-photo', element => element.style.backgroundImage)
        const thumbnail = backgroundImage.split(/"/)[1]
        const url = await item.$eval('a', element => element.href)
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
