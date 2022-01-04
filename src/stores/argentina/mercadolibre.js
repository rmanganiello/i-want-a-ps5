import { ARGENTINA, ARGENTINIAN_PESOS } from '../../constants/index.js'

export default {
  vendor: 'MercadoLibre',
  slug: 'mercadolibre-ar',
  url: 'https://videojuegos.mercadolibre.com.ar/consolas/playstation-5/nuevo/playstation-5_NoIndex_True#applied_filter_id%3DITEM_CONDITION%26applied_filter_name%3DCondici%C3%B3n%26applied_filter_order%3D2%26applied_value_id%3D2230284%26applied_value_name%3DNuevo%26applied_value_order%3D1%26applied_value_results%3D172%26is_custom%3Dfalse',
  logoPath: 'assets/img/mercadolibre-logo.png',
  country: ARGENTINA,
  currency: ARGENTINIAN_PESOS,
  usesPagination: false,
  getPageNumberQueryString: () => '',
  checkEmptyPage: async () => false,
  getAvailableItems: async ({ page }) => {
    const items = await page.$$('li[class=ui-search-layout__item]')
    const ps5Items = []

    for (const item of items.slice(0, 4)) {
      const title = await item.$eval('h2', element => element.innerText)
      const url = await item.$eval('a', element => element.href)
      const price = await item.$eval('span[class=price-tag-fraction]', element => element.innerText)
      const thumbnail = await item.$eval('img[class=ui-search-result-image__element]', element => element.src)
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
