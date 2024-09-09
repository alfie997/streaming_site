const { JSDOM } = require('jsdom')

const iframes = []

async function crawlPage(baseURL, currentURL, pages) {
    const baseURLObj = new URL(baseURL)
    const currentURLObj = new URL(currentURL)
    if (baseURLObj.hostname !== currentURLObj.hostname) {
        return pages
    }

    const normalizedCurrentURL = normalizeURL(currentURL)
    if (pages[normalizedCurrentURL] > 0) {
        pages[normalizedCurrentURL]++
        return pages
    }

    pages[normalizedCurrentURL] = 1

    console.log(`actively crawling: ${currentURL}`)

    try {
        const resp = await fetch(currentURL)
        if (resp.status > 399) {
            console.log(`error in fetch with status code: ${resp.status}, on page: ${currentURL}`)
            return pages
        }

        const contentType = resp.headers.get("content-type")
        if (!contentType.includes("text/html")) {
            console.log(`non html response, content type: ${contentType}, on page: ${currentURL}`)
            return pages
        }

        const htmlBody = await resp.text()

        const nextURLs = getURLsFromHTML(htmlBody, baseURL)

        const iframe = extractiframe(htmlBody)
        if (iframe !== undefined) {
            iframes.push(iframe)
            console.log(iframes)
            // for (const iframe of iframes) {
            //     console.log(iframe.src)
            // }
        }

        for (const nextURL of nextURLs) {
            if (iframes.length > 10) return pages
            pages = await crawlPage(baseURL, nextURL, pages)
        }
    } catch (err) {
        console.log(`error in fetch: ${err.message}, on page: ${currentURL}`)
    }
    return pages
}

function getURLsFromHTML(htmlBody, baseURL) {
    const urls = []
    const dom = new JSDOM(htmlBody)
    const linkElements = dom.window.document.querySelectorAll('a')
    // const episodeRelated = dom.window.document.querySelector('#episode_related')
    // console.log(episodeRelated.)
    // const episodes = episodeRelated.q
    // console.log(episodes)
    for (const linkElement of linkElements) {
        if (linkElement.href.slice(0, 1) === '/') {
            try {
                // let urlObj
                if (linkElement.href.includes("/category")) {
                    // console.log("category")
                    const newURL = baseURL.slice(0, 21)
                    // console.log(newURL)
                    const urlObj = new URL(`${newURL}${linkElement.href}`)
                    urls.push(urlObj.href)
                } else if (linkElement.href.includes("episode") && linkElement.parentElement.parentElement.id === "episode_related") {
                    // console.log(linkElement.parentElement.parentElement.id)
                    // console.log("episode")
                    const newURL = baseURL.slice(0, 21)
                    const urlObj = new URL(`${newURL}${linkElement.href}`)
                    urls.push(urlObj.href)
                }
                // } else {
                //     const urlObj = new URL(`${baseURL}${linkElement.href}`)
                //     urls.push(urlObj.href)
                // }
                // const urlObj = new URL(`${baseURL}${linkElement.href}`)
                // urls.push(urlObj.href)
            } catch (err) {
                console.log(`error with relative url: ${err.message}`)
            }}
        // } else {
        //     try {
        //         const urlObj = new URL(linkElement.href)
        //         urls.push(urlObj.href)
        //     } catch (err) {
        //         console.log(`error with absolute url: ${err.message}`)
        //     }
        // }
    }
    return urls
}

function extractiframe(htmlBody) {
    const dom = new JSDOM(htmlBody)
    if (htmlBody.includes('iframe')) {
        const iframe = dom.window.document.querySelector('iframe')
        // console.log(iframe.src)
        return iframe
    }
    // console.log(iframe.tagName)
}

function normalizeURL(urlString) {
    const urlObj = new URL(urlString)
    const hostPath = `${urlObj.hostname}${urlObj.pathname}`
    if (hostPath.length > 0 && hostPath.slice(-1) === '/') {
        return hostPath.slice(0, -1)
    }
    return hostPath
}

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    extractiframe,
    crawlPage,
    iframes
}