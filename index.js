// @ts-check

import { chromium } from 'playwright'

const sites = [
  {
    vendor: 'Sony Store',
    slug: 'sony-store-ar',
    logoPath: './assets/img/sony-logo.png',
    country: 'AR',
    currency: 'ARS',
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
  },
  {
    vendor: 'Fravega',
    slug: 'fravega-ar',
    url: 'https://www.fravega.com/l/?categorias=videojuegos/consolas&keyword=playstation%205',
    logoPath: './assets/img/fravega-logo.webp',
    country: 'AR',
    currency: 'ARS',
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
        const url = await item.$eval('a', element => element.href)
        const price = await item.$eval('div[data-test-id=product-price]', element => element.innerText)
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
  },
  {
    vendor: 'Playstation Direct',
    slug: 'playstation-direct-us',
    url: 'https://direct.playstation.com/en-us/hardware/ps5',
    logoPath: './assets/img/playstation-logo.png',
    country: 'US',
    currency: 'USD',
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
  },
  {
    vendor: 'Necxus',
    slug: 'necxus-ar',
    url: 'https://www.necxus.com.ar/categorias/53/530901/Playstation-5/',
    logoPath: './assets/img/necxus-logo.svg',
    country: 'AR',
    currency: 'ARS',
    usesPagination: false,
    getPageNumberQueryString: () => '',
    checkEmptyPage: async () => false,
    getAvailableItems: async ({ page }) => {
      const items = await page.$$('.grid-custom-wrap')
      const ps5Items = []
      console.log({ items })

      for (const item of items) {
        const title = await item.$eval('h2', element => element.innerText)
        console.log(title)
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
  },
  {
    vendor: 'BestBuy',
    slug: 'bestbuy-us',
    url: 'https://www.bestbuy.com/site/searchpage.jsp?intl=nosplash&st=playstation+5',
    logo: 'bestbuy-logo.png',
    usesPagination: false,
    logoPath: './assets/img/bestbuy-logo.png',
    country: 'US',
    currency: 'USD',
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
]

const findItemsBySite = async ({ context, site }) => {
  const page = await context.newPage()
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
  return foundItems
}

;(async () => {
  const browser = await chromium.launch()
  const context = await browser.newContext({ userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36' })
  const promises = sites.map(site => findItemsBySite({ context, site }))
  const result = await Promise.all(promises)
  const report = {
    stores: result.map((items, idx) => {
      const { vendor, slug, logoPath, country, currency } = sites[idx]
      return {
        vendor,
        slug,
        logo: logoPath,
        country,
        currency,
        products: items
      }
    })
  }
  console.log(JSON.stringify(report, null, 4))
  await browser.close()
})()
