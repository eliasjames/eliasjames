import messagesEn from "../../messages/en.json";

describe("auth-deny", () => {
  const baseUrl = Cypress.config().baseUrl;

  const dashboardPagename = messagesEn.DashboardPage.pagename;
  const dashboardPath = "/" + dashboardPagename;
  const signInPagename = messagesEn.SignInPage.pagename;
  const signInPath = "/" + signInPagename;
  const signOutPath = "/auth/signout";

  it("should redirect from protected routes", () => {
    cy.visit(dashboardPath);
    cy.url().should(
      "eq",
      baseUrl +
        signInPath +
        "?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2F" +
        dashboardPagename,
    );
  });

  it("should not redirect unprotected routes", () => {
    cy.visit("/content/about");
    cy.url().should("eq", baseUrl + "/content/about");
  });

  it("should return 401 from protected apis", () => {
    cy.request({
      method: "GET",
      url: "/api/protected",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });

  it("should redirect after logout", () => {
    cy.intercept("POST", signOutPath).as("signOut");

    cy.visit("/auth/signout");
    cy.get("#submitButton")
      .click();
    cy.wait("@signOut")
      .then(() => {
        cy.url().should("eq", baseUrl + "/");
      });
  });
});
