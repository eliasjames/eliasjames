import messagesEn from "../../messages/en.json";

describe("Content", () => {
  it("should load the site name", () => {
    cy.visit("http://localhost:3000/");

    cy.get("h1").contains(messagesEn.Site.sitename);
  });

  it("should load dynamic content", () => {
    cy.visit("http://localhost:3000/content/about");

    cy.get("#demonstration").contains(messagesEn.ContentPage.about.text);
  });
});
