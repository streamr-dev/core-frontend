import links from '../links'
import { login, logout } from './mixins/session'

function link(path) {
    return `http://localhost:${process.env.PORT}${path}`
}

const { LOGIN_PASSWORD } = process.env
const NEW_PASSWORD = `${LOGIN_PASSWORD}-new`

const wait = (timeout) => (
    new Promise((resolve) => setTimeout(resolve, timeout))
)

describe('Change Password', () => {
    let page

    it('setup', async () => {
        const context = await browser.createIncognitoBrowserContext()
        page = await context.newPage()
        await page.goto(link(links.main))
        await login(page)

        await page.hover('#accountDropdown', { timeout: 2000 })
        await page.click('#nav-profile-link')
    })

    it('when: password is changed', async () => {
        await page.click('[aria-label="Change Password"]')
        await page.type('#changePassword [name=currentPassword]', LOGIN_PASSWORD)
        await page.type('#changePassword [name=newPassword]', NEW_PASSWORD)
        await page.type('#changePassword [name=confirmNewPassword]', NEW_PASSWORD)
        await page.click('#changePassword [type=submit]')
    })

    it('then: profile page must open with text "Password Changed"', async () => {
        await expect(page).not.toMatchElement('#changePassword.show')
        await wait(1000)
        const message = await page.$eval('.notifications-wrapper', (node) => node.innerText)
        await expect(message).toContain('Password Changed')
        await page.click('.notifications-wrapper .notification-dismiss')
        await wait(500)
    })

    test('change password form is cleared when reopening', async () => {
        await page.click('[aria-label="Change Password"]')
        await wait(500)
        expect(
            await page.$eval('#changePassword [name=currentPassword]', (el) => el.value),
        ).toBe('')
        expect(
            await page.$eval('#changePassword [name=newPassword]', (el) => el.value),
        ).toBe('')
        expect(
            await page.$eval('#changePassword [name=confirmNewPassword]', (el) => el.value),
        ).toBe('')
        await page.click('#changePassword [type=reset]')
    })

    it('when: logged out', async () => {
        await page.goto(link(links.main))
        await logout(page)
    })

    it('then: can log back in with the new password', async () => {
        await login(page, { password: NEW_PASSWORD })
        await page.goto(link(links.profile))
        await expect(page).toMatchElement('#nav-logout-link')
    })

    it('then: password is changed back', async () => {
        await page.click('[aria-label="Change Password"]')
        await page.type('#changePassword [name=currentPassword]', NEW_PASSWORD)
        await page.type('#changePassword [name=newPassword]', LOGIN_PASSWORD)
        await page.type('#changePassword [name=confirmNewPassword]', LOGIN_PASSWORD)
        await page.click('#changePassword [type=submit]')
        await wait(500)
        const message = await page.$eval('.notifications-wrapper', (node) => node.innerText)
        await expect(message).toContain('Password Changed')
        await page.click('.notifications-wrapper .notification-dismiss')
        await wait(500)
    })

    describe('password cannot be changed to an invalid one', () => {
        test('when: on profile edit page', async () => {
            await page.hover('#accountDropdown', { timeout: 2000 })
            await page.click('#nav-profile-link')
        })

        test.each([
            ['old password incorrect', ...[
                `${LOGIN_PASSWORD}wrong`,
                NEW_PASSWORD,
                NEW_PASSWORD,
            ]],
            ['mismatching password confirm', ...[
                LOGIN_PASSWORD,
                NEW_PASSWORD,
                `${NEW_PASSWORD}different`,
            ]],
            ['new password has no numbers or special characters', ...[
                `${LOGIN_PASSWORD}wrong`,
                'nospecialchars',
                'nospecialchars',
            ]],
            ['new password is too short', ...[
                `${LOGIN_PASSWORD}wrong`,
                'short12',
                'short12',
            ]],
        ])('%s', async (name, currentPassword, newPassword, confirmNewPassword) => {
            await page.click('[aria-label="Change Password"]')
            await page.type('#changePassword [name=currentPassword]', currentPassword)
            await page.type('#changePassword [name=newPassword]', newPassword)
            await page.type('#changePassword [name=confirmNewPassword]', confirmNewPassword)
            await page.click('#changePassword [type=submit]')
            await wait(100)
            const message = await page.$eval('.notifications-wrapper', (node) => node.innerText)
            await expect(message).toContain('Password Not Changed')
            await page.click('.notifications-wrapper .notification-dismiss')
            await wait(500)
            await page.click('#changePassword [type=reset]')
            await wait(100)
        })
    })
})
