import messagesEn from "../../messages/en.json";

describe("auth-allow", () => {
  const baseUrl = Cypress.config().baseUrl;

  // use a strong random value:
  // `$ openssl rand -base64 32` on the command line
  // set in cypress.config.ts and .env
  const insecureTestingPassword = Cypress.env("INSECURE_TESTING_PASSWORD");

  const dashboardPagename = messagesEn.DashboardPage.pagename;
  const signInPagename = messagesEn.SignInPage.pagename;
  const signInPath = "/" + signInPagename;
  const signInTestingPost = messagesEn.SignInPage.testingPost;

  // if using auth.ts > pages property, then callback gets set in cookie
  // if using default Next-Auth, callback not set in cookie
  // (to switch, change the _default values in messages/en.json, and delete auth.ts > pages property)
  const cookieCallback =
    messagesEn.SignInPage.testingPost === "/auth/callback/insecure-testing"
      ? ""
      : "%2F" + dashboardPagename;

  beforeEach(() => {
    // aliases are reset after each test
    cy.intercept("POST", signInTestingPost).as("postLogin");

    cy.visit(signInPath);
    cy.get("#input-password-for-insecure-testing-provider").type(
      insecureTestingPassword,
    );
    // needs to be #submitButton so that tests will work with both built-in next-auth and custom signin pages
    // e.g., /auth/signin and auth.ts > "pages" config property > /login
    cy.get("#submitButton").click();
  });

  it("should have a cookie after successful auth", () => {
    cy.wait("@postLogin").then(() => {
      cy.getCookie("authjs.callback-url").should(
        "have.property",
        "value",
        "http%3A%2F%2Flocalhost%3A3000" + cookieCallback,
      );
    });
  });

  it("should return 200 from protected apis after successful auth", () => {
    cy.wait("@postLogin").then(() => {
      cy.request({
        method: "GET",
        url: "/api/protected",
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200);
      });
    });
  });

  it("should not redirect protected routes after successful auth", () => {
    cy.wait("@postLogin").then(() => {
      cy.visit("/dashboard");
      cy.url().should("eq", baseUrl + "/dashboard");
    });
  });
});
