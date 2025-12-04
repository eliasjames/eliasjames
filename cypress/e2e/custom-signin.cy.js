import messagesEn from "../../messages/en.json";

describe("custom-signin", () => {
  const baseUrl = Cypress.config().baseUrl;

  const dashboardPagename = messagesEn.DashboardPage.pagename;
  const dashboardPath = "/" + dashboardPagename;
  const signInPagename = messagesEn.SignInPage.pagename;
  const signInPath = "/" + signInPagename;
  const signInTestingPost = messagesEn.SignInPage.testingPost;

  it("should redirect after successful auth", () => {
    cy.intercept("POST", signInTestingPost).as("postLogin");

    cy.visit(signInPath);
    const insecureTestingPassword = Cypress.env("INSECURE_TESTING_PASSWORD");
    cy.get("#input-password-for-insecure-testing-provider").type(
      insecureTestingPassword,
    );
    cy.get("#submitButton")
      .click()
    cy.wait("@postLogin")
      .then(() => {
        cy.url().should("eq", baseUrl + dashboardPath);
      });
  });
});
