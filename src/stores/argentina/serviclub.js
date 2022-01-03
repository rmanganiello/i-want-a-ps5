import { ARGENTINA, ARGENTINIAN_PESOS } from '../../constants/index.js'

export default {
  vendor: 'YPF Serviclub',
  slug: 'ypf-serviclub-ar',
  url: 'https://www.serviclub.com.ar/tecnologia/32487-playstation-5.html',
  logoPath: 'assets/img/serviclub-logo.jpg',
  country: ARGENTINA,
  currency: ARGENTINIAN_PESOS,
  usesPagination: false,
  getPageNumberQueryString: () => '',
  checkEmptyPage: async () => false,
  getAvailableItems: async ({ page }) => {
    const outOfStock = await page.$('.product-unavailable')
    if (outOfStock) {
      return []
    }
    const title = await page.$eval('div[itemprop=name]', element => element.innerText)
    const price = await page.$eval('span[itemprop=price]', element => element.innerText)
    const thumbnail = await page.$eval('img[itemprop=image]', element => element.src)
    return [{
      title,
      url: 'https://www.serviclub.com.ar/tecnologia/32487-playstation-5.html',
      price,
      thumbnail
    }]
  }
}
