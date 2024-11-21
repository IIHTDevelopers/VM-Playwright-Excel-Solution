import { expect, test } from "playwright/test";
import AppointmentPage from "../../pages/AppointmentPage";
import UtilitiesPage from "../../pages/UtilitiesPage";
import DispensaryPage from "../../pages/DispensaryPage";
import { LoginPage } from "../../pages/LoginPage";
import ProcurementPage from "../../pages/ProcurementPage";
import PatientPage from "../../pages/PatientPage";
import ADTPage from "../../pages/ADTPage";
import RadiologyPage from "../../pages/RadiologyPage";
import LaboratoryPage from "../../pages/LaboratoryPage";
import * as XLSX from "xlsx";
import path from "path";

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

  test.beforeAll(async ({ browser: b }) => {
    context = await b.newContext();
    const page = await context.newPage();
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

  test.describe("boundary", () => {
    test("Login with valid credentials from Excel", async () => {
      expect(await loginPage.performLogin()).toBeTruthy();
    });
  });

  test("TS-2 Verify Page Navigation and Load Time for Billing Counter ", async () => {
    expect(await utilitiesPage.verifyBillingCounterLoadState()).toBeTruthy();
  });

  test("TS-3 Patient Search with Valid Data ", async () => {
    await appointmentPage.navigateToAppointmentPage();
    const patientName = await appointmentPage.selectFirstPatient();
    await appointmentPage.searchPatient(patientName);
    await appointmentPage.verifypatientName(patientName);
  });

  test("TS-4 Activate Counter in Dispensar", async () => {
    expect(
      await dispensaryPage.verifyActiveCounterMessageInDispensary()
    ).toBeTruthy();
  });

  test("TS-5 Purchase Request List Load", async () => {
    expect(
      await procurementPage.verifyPurchaseRequestListElements()
    ).toBeTruthy();
  });

  test("TS-6 Verify error message while adding new lab test in Laboratory", async () => {
    let filePath = path.join(
      __dirname,
      "..",
      "..",
      "Data",
      "Result.xlsx"
    );

    // Replace all backslashes with forward slashes
    filePath = filePath.replace(/\\/g, "/");

    console.log(`File path ------------> ${filePath}`);
    const workbook = XLSX.readFile(filePath);
    const sheetName = "LabNotificationText";
    const worksheet = workbook.Sheets[sheetName];
    // Define the expected structure of the sheet's data
    const data = XLSX.utils.sheet_to_json<{ [key: string]: string }>(worksheet);
    // Safely access tooltipText
    const tooltipText = data[0]?.["LabTextNotification"];
    console.log(`Tool tip text ----------------------------> ${tooltipText}`);
    expect(await laboratoryPage.verifyErrorMessage()).toEqual(
      "Lab Test Code Required."
    );
  });

  test("TS-7 Handle Alert on Radiology Module", async () => {
    expect(
      await radiologyPage.performRadiologyRequestAndHandleAlert()
    ).toBeTruthy();
  });

  test("TS-8 Data-Driven Testing for Patient Search", async () => {
    expect(await patientPage.searchAndVerifyPatients()).toBeTruthy();
  });

  test("TS-9 Error Handling and Logging in Purchase Request List", async () => {
    expect(
      await procurementPage.verifyNoticeMessageAfterEnteringIncorrectFilters()
    ).toEqual("Date is not between Range. Please enter again");
  });

  test("TS-10 Keyword-Driven Framework for Appointment Search", async ({ }) => {
    expect(await appointmentPage.searchAndVerifyPatient()).toBeTruthy();
  });

  test("TS-11 Modular Script for Patient Search", async () => {
    expect(await appointmentPage.searchPatientInAppointment()).toBeTruthy();
    expect(await patientPage.searchPatientInPatientPage()).toBeTruthy();
    expect(await adtPage.searchPatientInADT()).toBeTruthy();
  });

  test("TS-12 Verify Assertion for Counter Activation", async () => {
    expect.soft(await dispensaryPage.verifyCounterisActivated()).toBeTruthy();
  });

  test("TS-14 Verify Locator Strategy for Appointment Search ", async () => {
    expect(await appointmentPage.searchAndVerifyPatientList()).toBeTruthy();
  });

  test("TS-15 Verify the tooltip text on hover of Star icon in Laboratory", async () => {
    let filePath = path.join(
      __dirname,
      "..",
      "..",
      "Data",
      "Result.xlsx"
    );

    const workbook = XLSX.readFile(filePath);
    const sheetName = "ToolTipText";
    const worksheet = workbook.Sheets[sheetName];
    // Define the expected structure of the sheet's data
    const data = XLSX.utils.sheet_to_json<{ [key: string]: string }>(worksheet);
    // Safely access tooltipText
    const tooltipText = data[0]?.["StarTooltipText"];
    console.log(
      `------------Tool tip text from excel >> ${tooltipText} ---------------------`
    );
    expect(await laboratoryPage.verifyStarTooltip()).toEqual(tooltipText);
  });

  test("TS-16 Navigation Exception Handling on Dispensary Page ", async () => {
    expect(await dispensaryPage.navigateToDispensary()).toBeTruthy();
  });

  test("TS-17 Web Element Handling for Dropdowns in Purchase Request", async () => {
    expect(
      await procurementPage.verifyRequestedDateColumnDateWithinRange()
    ).toBeTruthy();
  });

  test("TS-18 Login with invalid credentials", async () => {
    expect(await loginPage.performLoginWithInvalidCredentials()).toEqual(
      "Invalid credentials !"
    );
  });
});
