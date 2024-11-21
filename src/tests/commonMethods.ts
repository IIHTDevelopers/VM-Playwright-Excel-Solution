// src/common/CommonMethods.ts

import { Locator } from "playwright";
import * as XLSX from "xlsx";

export class CommonMethods {
  // Method to highlight an element
  static async highlightElement(element: Locator) {
    await element.evaluate((el: HTMLElement) => {
      el.style.border = "2px solid yellow"; // Highlight with yellow border
      el.style.backgroundColor = "yellow"; // Highlight with yellow background
    });

    // Optional: Keep the highlight for a short duration, then remove
    await element.evaluate((el: HTMLElement) => {
      setTimeout(() => {
        el.style.border = "";
        el.style.backgroundColor = "";
      }, 1000); // Keeps highlight for 1 seconds
    });
  }
  // Method to read data from any sheet in an Excel file
  static async readExcelData(
    filePath: string,
    sheetName: string,
    columnNames: string[]
  ): Promise<{ [key: string]: string }[]> {
    const workbook = XLSX.readFile(filePath); // Read the Excel file
    const worksheet = workbook.Sheets[sheetName]; // Access the specified sheet

    // Read the data from the sheet as an array of objects
    const data = XLSX.utils.sheet_to_json<{ [key: string]: string }>(worksheet);

    // Filter the data to only include the specified columns
    const result = data.map((row) => {
      const filteredRow: { [key: string]: string } = {};
      for (const columnName of columnNames) {
        filteredRow[columnName] = row[columnName];
      }
      return filteredRow;
    });

    return result;
  }
}
