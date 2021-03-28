describe('Homepage Tests', () => {
  it('renders the "Find Something" heading', () => {
    cy.visit('/')

    cy.contains('Find Something')
  })
})
