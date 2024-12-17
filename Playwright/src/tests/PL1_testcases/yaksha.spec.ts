import { expect, test, Page } from "playwright/test";
import AppointmentPage from "../../pages/AppointmentPage";
import UtilitiesPage from "../../pages/UtilitiesPage";
import DispensaryPage from "../../pages/DispensaryPage";
import { LoginPage } from "../../pages/LoginPage";
import ProcurementPage from "../../pages/ProcurementPage";
import PatientPage from "../../pages/PatientPage";
import ADTPage from "../../pages/ADTPage";
import RadiologyPage from "../../pages/RadiologyPage";
import LaboratoryPage from "../../pages/LaboratoryPage";
import path from "path";
import { CommonMethods } from "../commonMethods";

test.describe("Yaksha", () => {
  let appointmentPage: AppointmentPage;
  let utilitiesPage: UtilitiesPage;
  let dispensaryPage: DispensaryPage;
  let procurementPage: ProcurementPage;
  let loginPage: LoginPage;
  let patientPage: PatientPage;
  let adtPage: ADTPage;
  let radiologyPage: RadiologyPage;
  let laboratoryPage: LaboratoryPage;
  let context;
  let page: Page;

  test.beforeAll(async ({ browser: b }) => {
    context = await b.newContext();
    page = await context.newPage();
    loginPage = new LoginPage(page);
    utilitiesPage = new UtilitiesPage(page);
    appointmentPage = new AppointmentPage(page);
    dispensaryPage = new DispensaryPage(page);
    procurementPage = new ProcurementPage(page);
    patientPage = new PatientPage(page);
    adtPage = new ADTPage(page);
    radiologyPage = new RadiologyPage(page);
    laboratoryPage = new LaboratoryPage(page);
    await page.goto("/");
  });

  let filePath = path.join(__dirname, "..", "..", "Data", "Result.xlsx");

  test.describe("boundary", () => {
    test("TS-1 Login with valid credentials from Excel", async () => {
      const loginData = await CommonMethods.readExcel(filePath, "Login");
      await loginPage.performLogin(loginData);
      await verifyUserIsLoggedin(page);
    });

    test("TS-3 Patient Search with Valid Data ", async () => {
      await appointmentPage.navigateToAppointmentPage();
      const patientName = await appointmentPage.selectFirstPatient();
      await appointmentPage.searchPatient(patientName);
      await appointmentPage.verifypatientName(patientName);
      await verifyPatientSearchHappened(page);
    });

    test("TS-4 Activate Counter in Dispensary", async () => {
      await dispensaryPage.verifyActiveCounterMessageInDispensary();
      await verifyDispensaryCounterActivation(page);
    });

    test("TS-5 Purchase Request List Load", async () => {
      await procurementPage.verifyPurchaseRequestListElements();
      await verifyPurchaseRequestListURL(
        page,
        "ProcurementMain/PurchaseRequest/PurchaseRequestList"
      );
    });

    test("TS-17 Web Element Handling for Dropdowns in Purchase Request", async () => {
      const data = await CommonMethods.readExcel(filePath, "DateRange");
      await procurementPage.verifyRequestedDateColumnDateWithinRange(data);
      await verifyPurchaseReqDataIsPresent(page);
    });

    test("TS-18 Login with invalid credentials", async () => {
      const loginData = await CommonMethods.readExcel(filePath, "InvalidLogin");
      await loginPage.performLoginWithInvalidCredentials(loginData);
      await verifyUserIsNotLoggedin(page);
    });
  });
});

async function verifyUserIsLoggedin(page: Page) {
  // Verify successful login by checking if 'admin' element is visible
  await page
    .locator('//li[@class="dropdown dropdown-user"]')
    .waitFor({ state: "visible", timeout: 20000 });
  expect(
    await page.locator('//li[@class="dropdown dropdown-user"]').isVisible()
  );
}

async function verifyPatientSearchHappened(page: Page) {
  const patientList = await page.$$(
    `//div[@role='gridcell' and @col-id='ShortName']`
  );
  if (patientList.length == 1) {
    console.log("Patient search happened");
  } else {
    throw new Error("Patient search didn't happened");
  }
}

async function verifyDispensaryCounterActivation(page: Page) {
  expect(
    await page
      .locator("//button[contains(text(),'Deactivate Counter')]")
      .isVisible()
  ).toBeTruthy();
}

async function verifyPurchaseRequestListURL(page: Page, expectedURL: string) {
  const getActualURl = page.url();
  expect(getActualURl).toContain(expectedURL);
}

async function verifyPurchaseReqDataIsPresent(page: Page) {
  const tableData = await page.$$(
    `div[ref="eCenterContainer"] div[col-id="RequestDate"]`
  );
  expect(tableData.length).toBeGreaterThanOrEqual(1);
}

async function verifyUserIsNotLoggedin(page: Page) {
  expect(
    await page
      .locator('//div[contains(text(),"Invalid credentials !")]')
      .isVisible()
  ).toBeTruthy();
}
