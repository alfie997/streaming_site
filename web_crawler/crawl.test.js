const { normalizeURL, getURLsFromHTML, extractiframe } = require('./crawl.js')
const { test, expect } = require('@jest/globals')

test('normalizeURL strip protocol', () => {
    const input = 'https://blog.boot.dev/path'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
})

test('normalizeURL strip trailing slash', () => {
    const input = 'https://blog.boot.dev/path/'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
})

test('normalizeURL capitals', () => {
    const input = 'https://BLOG.boot.dev/path'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
})

test('normalizeURL strip http', () => {
    const input = 'http://blog.boot.dev/path'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
})

test('getURLsFromHTML absolute', () => {
    const inputHTMLBody = `
    <html>
        <body>
            <a href="https://blog.boot.dev/path/">
                Boot.dev Blog
            </a>
        </body>
    </html>
    `
    const inputBaseURL = "https://blog.boot.dev/path/"
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL)
    const expected = ["https://blog.boot.dev/path/"]
    expect(actual).toEqual(expected)
})

test.skip('getURLsFromHTML relative', () => {
    const inputHTMLBody = `
    <html>
        <body>
            <a href="/path/">
                Boot.dev Blog
            </a>
        </body>
    </html>
    `
    const inputBaseURL = "https://blog.boot.dev"
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL)
    const expected = ["https://blog.boot.dev/path/"]
    expect(actual).toEqual(expected)
})

test.skip('getURLsFromHTML both', () => {
    const inputHTMLBody = `
    <html>
        <body>
            <a href="https://blog.boot.dev/path1/">
                Boot.dev Blog Path One
            </a>
            <a href="/path2/">
                Boot.dev Blog Path Two
            </a>
        </body>
    </html>
    `
    const inputBaseURL = "https://blog.boot.dev"
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL)
    const expected = ["https://blog.boot.dev/path1/", "https://blog.boot.dev/path2/"]
    expect(actual).toEqual(expected)
})

test('getURLsFromHTML invalid', () => {
    const inputHTMLBody = `
    <html>
        <body>
            <a href="invalid">
                Invalid URL
            </a>
        </body>
    </html>
    `
    const inputBaseURL = "https://blog.boot.dev"
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL)
    const expected = []
    expect(actual).toEqual(expected)
})

test('getURLsFromHTML category', () => {
    const inputHTMLBody = `
    <html>
        <body>
            <a href="/category/">
                Anime Entry
            </a>
        </body>
    </html>
    `
    const inputBaseURL = "https://blog.boot.dev/list"
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL)
    const expected = ["https://blog.boot.dev/category/"]
    expect(actual).toEqual(expected)
})

test('getURLsFromHTML episode', () => {
    const inputHTMLBody = `
    <html>
        <body>
            <a href="/nabari-no-ou--episode-6/">
                Anime Episode
            </a>
            <a href="/nabari-no-ou--episode-7/">
                Anime Episode
            </a>
            <a href="/login.html">
                Login
            </a>
        </body>
    </html>
    `
    const inputBaseURL = "https://gogoanime3.co/category/nabari-no-ou-/"
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL)
    const expected = ["https://gogoanime3.co/nabari-no-ou--episode-6/",
                        "https://gogoanime3.co/nabari-no-ou--episode-7/"]
    expect(actual).toEqual(expected)
})

test('extractiframe iframe', () => {
    const inputHTMLBody = `
    <html>
        <body>
            <iframe>
                Video
            </iframe>
        </body>
    </html>
    `
    const actual = extractiframe(inputHTMLBody).tagName
    const expected = "IFRAME"
    expect(actual).toEqual(expected)
})