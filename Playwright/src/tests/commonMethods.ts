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

  static async readExcel(filePath: string, sheetName: string): Promise<Record<string, string>> {
    const dataMap: Record<string, string> = {};

    // Read the Excel file
    const workbook = XLSX.readFile(filePath);

    // Get the specified sheet
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) {
      throw new Error(`Sheet "${sheetName}" not found in the Excel file.`);
    }

    // Convert the sheet to JSON format
    const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][];

    // Iterate through rows, assuming the first column is the key and the second is the value
    for (const row of sheetData) {
      const key = row[0]?.toString().trim();
      const value = row[1]?.toString().trim();

      if (key && value) {
        dataMap[key] = value;
      }
    }

    return dataMap;
  }
}
