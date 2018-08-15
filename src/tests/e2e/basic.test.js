import { Selector } from 'testcafe'
import { user, anonymous } from './roles'

function inspect(item) { // for debugging
    // console.log(require('util').inspect(item, {colors: true, depth: 0}))
}
const f = fixture('Basic Sanity Check')
    .page(`http://localhost:${process.env.PORT}/`)

inspect({ fixture: f })

test('title matches', async (t) => {
    const m = await Selector('title')
    inspect({
        t, m,
    })
    await t
        .useRole(anonymous())
        .expect(Selector('title').innerText).eql('Streamr')
})

test('does not have logout in nav', async (t) => {
    await t
        .useRole(anonymous())
        .expect(await Selector('#nav-logout-link').exists).notOk()
})

test('has logout in nav', async (t) => {
    await t
        .useRole(user)
        .expect(await Selector('#nav-logout-link').exists).ok()
})
