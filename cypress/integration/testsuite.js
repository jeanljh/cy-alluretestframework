/// <reference types='cypress' />

import data from '../fixtures/testdata.json'

context('Test Suite - Add Visit', () => {
    const today = new Date()
    const todayDate = (today.getDate() + '/').padStart(3, '0') + (today.getMonth() + 1 + '/').padStart(3, '0') + today.getFullYear()
    
    const tmr = new Date(today)
    tmr.setDate(tmr.getDate() + 1)
    const tmrDate = (tmr.getDate() + '/').padStart(3, '0') + (tmr.getMonth() + 1 + '/').padStart(3, '0') + tmr.getFullYear()

    beforeEach('Visit /add_visit', () => {
        cy.intercept('https://app.genesiscare.com.my/frg').as('frg')
        .visit(Cypress.config().baseUrl + '/add_visit')
        .wait('@frg')
    })

    specify('Test Visit Date - Default Date', () => {
        cy.get('.date_div').invoke('val').should('eq', tmrDate)
    })

    specify('Test Visit Date - Today Date', () => {
        cy.get('.date_div').as('picker').click()
        .get('.picker__button--today').click()
        .get('@picker').should('have.value', todayDate)
    })

    specify('Test Visit Date - Clear Date', () => {
        cy.get('.date_div').as('picker').click()
        .get('.picker__day--highlighted').click()
        .get('@picker').click()
        .get('.picker__button--clear').click({force: true})
        .get('@picker').should('have.value', tmrDate)
    })

    specify('Test Visit Date - Close Date Picker', () => {
        cy.get('.date_div').click()
        .get('.picker__holder').as('pickerBox').should('be.visible')
        .get('.picker__button--close').click()
        .get('@pickerBox').should('not.be.visible')
    })

    specify('Test Visit Date - Select Date Picker', () => {
        const dt = new Date(data['pickerDate'])
        const year = dt.getFullYear().toString()
        const month = dt.getMonth().toString()
        const day = dt.getDate().toString()
        
        cy.get('.date_div').as('picker').click()
        .get('.picker__select--year').as('year').find('option').should('contain.text', year)
        .get('@year').select(year)
        .get('@year').find(':selected').should('have.text', year)

        // cy.get('.picker__select--month').find(':not(option[disabled])').invoke('text')
        .get('.picker__select--month').as('month').find('option').not(':disabled')
        .then(el => {
            let match = false
            for (const e of el) {
                if (e.getAttribute('value') === month) match = true
            }
            expect(match).to.be.true
        })
        .get('@month').select(month)
        .get('@month').find(':selected').should('have.prop', 'value', month)

        .get(".picker__table div:not([class*='disabled'],[class*='outfocus'])")
        .then(el => {
            let match = false
            for (const e of el) {
                if (e.textContent === day) {
                    e.click()
                    match = true
                    break
                }
            }
            expect(match).to.be.true
        })

        const result = day.padStart(2, '0') + '/' + (dt.getMonth() + 1 + '/').padStart(3, '0') + year
        cy.get('@picker').should('have.value', result)
    })

    specify('Test Time Slot - Select Checkbox', () => {
        cy.contains('.radio-info > label', data['timeslot']).click() // method 1
        // cy.contains('.radio-info > label', data['timeslot']).prev().click({force: true}) // method 2
        // cy.get(`input[value='${data['timeslot'].replace(/ /g, '_')}']`).click({force: true}) // method 3
    })
})