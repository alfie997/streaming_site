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

test.skip('getURLsFromHTML absolute', () => {
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
        <div id="load_ep">
            <ul id="episode_related">
                <li><a href="/nabari-no-ou--episode-7" class="">
                    <div class="name"><span>EP</span> 7</div>
                    <div class="vien"></div>
                    <div class="cate">SUB</div>
                </a></li>
                <li><a href="/nabari-no-ou--episode-6" class="">
                    <div class="name"><span>EP</span> 6</div>
                    <div class="vien"></div>
                    <div class="cate">SUB</div>
                </a></li>
            </ul>
        </div>
        <a href="/login.html">
            Login
        </a>
        </body>
    </html>
    `
    const inputBaseURL = "https://gogoanime3.co/category/nabari-no-ou-/"
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL)
    const expected = ["https://gogoanime3.co/nabari-no-ou--episode-7",
                        "https://gogoanime3.co/nabari-no-ou--episode-6"]
    expect(actual).toEqual(expected)
})

test('getURLsFromHTML episode related', () => {
    const inputHTMLBody = `
    <html>
        <body>
        <div id="load_ep">
            <ul id="episode_related">
                <li><a href="/nabari-no-ou--episode-7" class="">
                    <div class="name"><span>EP</span> 7</div>
                    <div class="vien"></div>
                    <div class="cate">SUB</div>
                </a></li>
                <li><a href="/nabari-no-ou--episode-6" class="">
                    <div class="name"><span>EP</span> 6</div>
                    <div class="vien"></div>
                    <div class="cate">SUB</div>
                </a></li>
            </ul>
        </div>
        <li>
            <a href="/wan-jie-du-zun-2nd-season-episode-217" title="Wan Jie Du Zun 2nd Season">
            <div class="thumbnail-recent" style="background: url('https://gogocdn.net/cover/wan-jie-du-zun-2nd-season.png');"></div>
                Wan Jie Du Zun 2nd Season                                        </a>
            <a href="/wan-jie-du-zun-2nd-season-episode-217" title="Wan Jie Du Zun 2nd Season">
                <p class="time_2">Episode 217</p>
            </a>
	    </li>
        <a href="/login.html">
            Login
        </a>
        </body>
    </html>
    `
    const inputBaseURL = "https://gogoanime3.co/category/nabari-no-ou-/"
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL)
    const expected = ["https://gogoanime3.co/nabari-no-ou--episode-7",
                        "https://gogoanime3.co/nabari-no-ou--episode-6"]
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