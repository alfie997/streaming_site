const { JSDOM } = require('jsdom')
// const EventEmitter = require('node:events')
const puppeteer = require('puppeteer')
// import JSDOM from 'jsdom'
// import puppeteer from 'puppeteer'
// import Puppeteer, { Browser, PDFOptions } from "puppeteer";

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

        // const htmlBody = await resp.text()

        const browser = await puppeteer.launch({
            executablePath: '/usr/bin/chromium-browser'
        })
        // const browser = await puppeteer.launch()
        // if (typeof browser === "undefined") {
        //     browser = chrome
        // }
        const page = await browser.newPage()
        await page.goto(currentURL, { waitUntil: 'networkidle2' }).catch(e => void 0)

        const htmlBody = await page.content()

        const nextURLs = getURLsFromHTML(htmlBody, baseURL)

        const iframe = extractiframe(htmlBody)
        if (iframe !== undefined) {
            iframes.push(iframe)
            console.log(iframes)
            for (const iframe of iframes) {
                console.log(iframe.src)
            }
        }

        for (const nextURL of nextURLs) {
            if (iframes.length > 10) return pages
            pages = await crawlPage(baseURL, nextURL, pages)
        }

        await browser.close()
    } catch (err) {
        console.log(`error in fetch: ${err.message}, on page: ${currentURL}`)
    }
    return pages
}

function getURLsFromHTML(htmlBody, baseURL) {
    const urls = []
    const dom = new JSDOM(htmlBody)
    // const dom = new JSDOM(htmlBody, { runScripts: "dangerously"})
    // const eventEmitter = new EventEmitter()

    // dom.window.document.body.children.length === 2

    // const triggerEvent = (el, eventType, detail) =>
    //     el.dispatchEvent(new Event(eventType, { detail }))

    // const active = dom.window.document.querySelector('.active')
    // console.log(active.className)
    
    // triggerEvent(active, 'click')

    // const click = new Event("click", {bubbles: true, cancelable: false})
    // active.removeEventListener("click", click)
    // const event = new Event("click", (e) => {
    //     e.preventDefault();
    //     var ep_start = $(this).attr('ep_start');
    //     var ep_end = $(this).attr('ep_end');
    //     var id = $("input#movie_id").val();
    //     $('#episode_page a').removeClass('active');
    //     $(this).addClass('active');
    //     if (ep_end == '') ep_end = ep_start;
    //     var default_ep = $("input#default_ep").val();
    //     var alias = $("input#alias_anime").val();
    //     loadListEpisode(this, ep_start, ep_end, id, default_ep, alias)
    // })
    // active.dispatchEvent(click)

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
        console.log(iframe.src)
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