class MedSearchPage {

  get searchInput() { return cy.get('input[name="search"]') }
  get paginationSelection() { return cy.get('.pagination') }
  get orderSummary() { return cy.get('.text-underline-hover') }

  typeSearch(searchText: string) {
    this.searchInput.clear().type(searchText), { force: true };
  }
}

export default new MedSearchPage()
