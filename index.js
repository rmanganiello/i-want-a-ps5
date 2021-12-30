// @ts-check

import { chromium } from 'playwright'

const sites = [
  {
    vendor: 'Sony AR',
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
          const url = await item.$eval('.vtex-product-summary-2-x-clearLink', element => element.href)
          let price = null
          if (!outOfStock) {
            price = await item.$eval('.vtex-product-price-1-x-currencyContainer', element => element.innerText)
          }
          ps5Items.push({
            title,
            url,
            price,
            hasStock: !outOfStock
          })
        }
      }
      return ps5Items
    }
  },
  {
    vendor: 'Fravega AR',
    url: 'https://www.fravega.com/l/?keyword=playstation+5',
    usesPagination: true,
    getPageNumberQueryString: ({ pageNumber }) => `&page=${pageNumber}`,
    checkEmptyPage: async ({ page }) => {
      const notFoundElement = await page.$('svg[class^=BannerNoSuggestion__NotFoundImageStyled]')
      return !!notFoundElement
    },
    getAvailableItems: async ({ page }) => {
      const items = await page.$$('article[class^=ProductCard__Card-shopping-ui]')
      const ps5Items = []

      for (const item of items) {
        const title = await item.$eval('span[class^=PieceTitle-shopping-ui]', element => element.innerText)
        if (title.includes('Consola Sony PlayStation 5')) {
          const url = await item.$eval('a', element => element.href)
          const price = await item.$eval('div[data-test-id=product-price]', element => element.innerText)
          ps5Items.push({
            title,
            url,
            price,
            hasStock: true
          })
        }
      }
      return ps5Items
    }
  },
  {
    vendor: 'Playstation Direct US',
    url: 'https://direct.playstation.com/en-us/hardware/ps5',
    usesPagination: false,
    getPageNumberQueryString: () => '',
    checkEmptyPage: async () => false,
    getAvailableItems: async ({ page }) => {
      const items = await page.$$('hero-component')
      const ps5Items = []

      for (const item of items) {
        const outOfStock = await item.$('.out-stock-wrpr')
        const title = await item.$eval('p[class=sony-text-overline]', element => element.innerText)
        const url = await item.$eval('a', element => element.href)
        const price = await item.$eval('span[class^=product-price]', element => element.innerText)
        ps5Items.push({
          title,
          url,
          price: `$ ${price}`,
          hasStock: !outOfStock
        })
      }
      return ps5Items
    }
  },
  {
    vendor: 'BestBuy US',
    url: 'https://www.bestbuy.com/site/searchpage.jsp?intl=nosplash&st=playstation+5',
    usesPagination: false,
    getPageNumberQueryString: () => '',
    checkEmptyPage: async () => false,
    getAvailableItems: async ({ page }) => {
      const items = await page.$$('li[class=sku-item]')
      const ps5Items = []

      for (const item of items) {
        const outOfStock = await item.$('button[data-button-state=SOLD_OUT]')
        const title = await item.$eval('h4[class=sku-header]>a', element => element.innerText)
        const url = await item.$eval('h4[class=sku-header]>a', element => element.href)
        const price = await item.$eval('div[class^=priceView-hero-price]>span', element => element.innerText)
        ps5Items.push({
          title,
          url,
          price,
          hasStock: !outOfStock
        })
      }
      return ps5Items
    }
  }
]

const findItemsBySite = async ({ browser, site }) => {
  const page = await browser.newPage()
  let pageNumber = 1
  const foundItems = []
  while (true) {
    let siteUrl = site.url
    if (site.usesPagination) {
      siteUrl += site.getPageNumberQueryString({ pageNumber })
    }
    try {
      await page.goto(siteUrl)
      const isPageEmpty = await site.checkEmptyPage({ page })
      if (isPageEmpty) {
        break
      }
      foundItems.push(...await site.getAvailableItems({ page }))
      if (!site.usesPagination) {
        break
      }
      pageNumber += 1
    } catch (e) {
      console.error(e)
      break
    }
  }
  await page.close()
  return {
    vendor: site.vendor,
    foundItems
  }
}

;(async () => {
  const browser = await chromium.launch({ headless: false })
  const promises = sites.map(site => findItemsBySite({ browser, site }))
  const itemsBySite = await Promise.all(promises)
  const itemsByVendor = {}
  for (const result of itemsBySite) {
    itemsByVendor[result.vendor] = result.foundItems
  }
  console.log(JSON.stringify(itemsByVendor, null, 4))
  await browser.close()
})()
