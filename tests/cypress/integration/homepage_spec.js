describe('Homepage Tests', () => {
  it('renders the "Find support" heading', () => {
    cy.visit('/')

    cy.contains('Find support')
  })
})
