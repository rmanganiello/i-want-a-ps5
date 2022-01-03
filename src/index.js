// @ts-check

import { chromium } from 'playwright'
import { USER_AGENT } from './constants/index.js'
import {
  fravega,
  necxus,
  serviclub,
  sony,
  walmart,
  bestbuy,
  playstation
} from './stores/index.js'

const sites = [
  sony,
  fravega,
  necxus,
  serviclub,
  walmart,
  bestbuy,
  playstation
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
  const context = await browser.newContext({ userAgent: USER_AGENT })
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
