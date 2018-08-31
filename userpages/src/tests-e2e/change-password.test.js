import links from '../links'
import { login } from './mixins/session'

function link(path) {
    return `http://localhost:${process.env.PORT}${path}`
}

const { LOGIN_PASSWORD } = process.env
const NEW_PASSWORD = `${LOGIN_PASSWORD}-new`

const wait = (timeout) => (
    new Promise((resolve) => setTimeout(resolve, timeout))
)

describe('Profile', () => {
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
        await wait(2000)
        const message = await page.$eval('.notifications-wrapper', (node) => node.innerText)
        await expect(message).toContain('Password Changed')
        await page.click('.notifications-wrapper .notification-dismiss')
    })

    it('when: click to log out', async () => {
        const nav = page.waitForNavigation()
        await page.hover('#accountDropdown', { timeout: 2000 })
        await page.click('#nav-logout-link')
        await nav
        await page.goto(link(links.profile))
        await expect(page).not.toMatchElement('#nav-logout-link', { timeout: 500 })
    })

    it('then: can log back in with the new password', async () => {
        await login(page, { password: NEW_PASSWORD })
        await page.goto(link(links.profile))
        await expect(page).toMatchElement('#nav-logout-link')
    })

    it('then: password is changed back', async () => {
        await page.goto(link(links.profile))
        await page.click('[aria-label="Change Password"]')
        await page.type('#changePassword [name=currentPassword]', NEW_PASSWORD)
        await page.type('#changePassword [name=newPassword]', LOGIN_PASSWORD)
        await page.type('#changePassword [name=confirmNewPassword]', LOGIN_PASSWORD)
        await page.click('#changePassword [type=submit]')
        await wait(1000)
        const message = await page.$eval('.notifications-wrapper', (node) => node.innerText)
        await expect(message).toContain('Password Changed')
    })

    /*
        when: "logged back in with the new password"
        username = "tester1@streamr.com"
        password = "!#¤%testPassword123!?"
        loginButton.click()
        then: "logged in normally"
        waitFor { at CanvasPage }

    it('when: name and desc are entered and next button is clicked', async () => {
        const nav = page.waitForNavigation()
        await page.type('[name=name]', streamName)
        await page.type('[name=description]', `${streamName} description`)
        await page.click('[name=next]')
        await nav
    })

    it('then: must navigate to stream show page, showing info about non-configured stream', async () => {
        const url = await page.url()
        expect(url).toStartWith(link(links.streamShow))
        // grab stream id from page
        streamId = await page.$eval('.stream-id', (node) => node.innerText)
        expect(streamId).toBeNonEmptyString()
    })

    it('when: Configure Fields button is clicked', async () => {
        await page.click('#configure-fields-button')
    })

    it('then: field configure form is visible', async () => {
        await expect(page).toMatchElement('#configure-fields-form')
    })

// TODO: auto detect not yet implemented
//when('Produce an event into the stream and click autodetect button', async () => {
//const client = new StreamrClient({
//url: config.wsUrl,
//restUrl: config.restUrl,
//authKey: process.env.it_USER_KEY,
//autoconnect: false,
//autoDisconnect: false,
//})
//await client.connect()
//await client.produceToStream(streamId, {
//foo: 'bar',
//xyz: 45.5,
//})
//await wait(1000)
//await client.disconnect()
//await page.click('#autodetect')
//}).then('The fields in the stream must appear and be of correct type', async () => {
//const form = await page.$('#configure-fields-form')
//const fieldNames = await form.$$('[name=field_name]')
//expect(fieldNames.length).toEqual(2)
//const fieldTypes = await form.$$('[name=field_type]')
//expect(fieldTypes.length).toEqual(2)
//expect(await (await fieldTypes[0].getProperty('value')).jsonValue()).toEqual('string')
//expect(await (await fieldTypes[1].getProperty('value')).jsonValue()).toEqual('number')
//const deleteButtons = await form.$$('.delete-field-button')
//expect(deleteButtons.length).toEqual(2)
//})

    it('when: open menu', async () => {
        await page.click('#edit-dropdown')
    })

    it('then: delete in menu', async () => {
        await expect(page).toMatchElement('#delete-stream-button')
    })

    it('when: delete stream button is clicked', async () => {
        await page.click('#delete-stream-button')
    })
    it('then: must show confirmation', async () => {
        await expect(page).toMatchElement('#stream-delete-confirm')
    })

    it('when: confirmation accepted', async () => {
        const nav = page.waitForNavigation()
        await page.click('#stream-delete-confirm .btn-primary')
        await nav
    })

    it('then: must navigate to list page and show message', async () => {
        expect(await page.url()).toEqual(link(links.streamList))
    })
    */
})
/*

import LoginTester1Spec
import pages.CanvasPage
import pages.ChangePasswordPage
import pages.LoginPage
import pages.ProfileEditPage

class ProfileEditCoreSpec extends LoginTester1Spec {

    def "changing password works correctly"() {
        when: "profile edit page is clicked to open"
        $("#navSettingsLink").click()
        $("#navProfileLink").click()
        then: "must go to profile edit page"
        waitFor { at ProfileEditPage }

//		Password changed from original to another

        when: "password is changed"
        changePassword.click()
        waitFor { at ChangePasswordPage }
        currentPassword << "tester1TESTER1"
        newPassword << "!#¤%testPassword123!?"
        newPasswordAgain << "!#¤%testPassword123!?"
        changePassword.click()

        then: "profile page must open with text 'Password Changed'"
        waitFor { at ProfileEditPage }
        $(".alert", text:"Password changed!").displayed

        when: "click to Log Out"
        $("#navSettingsLink").click()
        $("#navLogoutLink").click()
        then: "logged out"
        waitFor { at LoginPage }

        when: "logged back in with the new password"
        username = "tester1@streamr.com"
        password = "!#¤%testPassword123!?"
        loginButton.click()
        then: "logged in normally"
        waitFor { at CanvasPage }

//		Password changed back to original

        when: "profile edit page is clicked to open"
        $("#navSettingsLink").click()
        $("#navProfileLink").click()
        then: "must go to profile edit page"
        waitFor { at ProfileEditPage }

        when: "password is changed"
        changePassword.click()
        waitFor { at ChangePasswordPage }
        currentPassword << "!#¤%testPassword123!?"
        newPassword << "tester1TESTER1"
        newPasswordAgain << "tester1TESTER1"
        changePassword.click()

        then: "profile page must open with text 'Password Changed'"
        waitFor { at ProfileEditPage }
        $(".alert", text:"Password changed!").displayed

        when: "click to Log Out"
        $("#navSettingsLink").click()
        $("#navLogoutLink").click()
        then: "logged out"
        waitFor { at LoginPage }

        when: "logged back in with the 'new' password"
        username = "tester1@streamr.com"
        password = "tester1TESTER1"
        loginButton.click()
        then: "logged in normally"
        waitFor { at CanvasPage }
    }

    def "password cannot be changed to an invalid one"() {
        //		Wrong Current Password and too short New Password
        when: "profile edit page is clicked to open"
        $("#navSettingsLink").click()
        $("#navProfileLink").click()

        then: "must go to profile edit page"
        waitFor { at ProfileEditPage }

        when: "old password typed wrong"
        changePassword.click()
        waitFor { at ChangePasswordPage }
        currentPassword << "INCORRECTPASSWORD"
        newPassword << "shortPW"
        newPasswordAgain << "shortPW"
        changePassword.click()

        then: "same page with text 'Password not Changed'"
        waitFor { at ChangePasswordPage }
        $(".alert", text:"Password not changed!").displayed
        $(".text-danger li", text: "Incorrect password!").displayed
        $(".text-danger li", text: "Please use a stronger password!").displayed

//		Correct Current Password, New Password without numbers or special characters
        when: "profile edit page is clicked to open"
        $("#navSettingsLink").click()
        $("#navProfileLink").click()

        then: "must go to profile edit page"
        waitFor { at ProfileEditPage }

        when: "old password typed right"
        changePassword.click()
        waitFor { at ChangePasswordPage }
        currentPassword << "KASMoney!Machine1"
        newPassword << "nonumberspwd"
        newPasswordAgain << "DIFFERENTnonumberspwd"
        changePassword.click()

        then: "same page with text 'Password not changed'"
        waitFor { at ChangePasswordPage }
        $(".alert", text:"Password not changed!").displayed

//		Password not changed

        when: "click to Log Out"
        $("#navSettingsLink").click()
        $("#navLogoutLink").click()
        then: "logged out"
        waitFor { at LoginPage }

        when: "logged back with original password"
        username = "tester1@streamr.com"
        password = "tester1TESTER1"
        loginButton.click()
        then: "logged in normally"
        waitFor { at CanvasPage }
    }	
}
*/
