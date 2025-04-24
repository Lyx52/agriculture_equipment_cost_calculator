/* eslint-disable  @typescript-eslint/no-explicit-any */
import { FarmlandModel } from '@/stores/model/farmlandModel.ts'
import xlsx from 'node-xlsx'
import { DisplayNumber, DownloadFileFromBuffer } from '@/utils.ts'

const buildRange = (startColumn: number, startRow: number, endColumn: number, endRow: number): any => {
  return {
    s: { c: startColumn, r: startRow },
    e: { c: endColumn, r: endRow }
  }
}
const buildFormula = (formula: string): any => {
  return {
    t: 'n',
    z: '0.00',
    f: formula
  }
}
const buildNumber = (value: any): any => {
  return {
    v: DisplayNumber(value),
    t: 'n',
    z: '0.00',
  }
}
const buildSupportAdjustmentRows = (farmland: FarmlandModel, startRow: number): any[] => {
  const rows = [];
  let row = startRow;
  for (const supportType of farmland.agriculturalSupportAdjustments) {
    rows.push([
      "",
      supportType.displayName,
      "",
      "ha",
      buildNumber(farmland.landArea),
      buildNumber(supportType.value),
      buildFormula(`=E${row} * F${row}`),
    ]);
    row++;
  }
  return rows;
}

const buildOtherAdjustmentCosts = (farmland: FarmlandModel, startRow: number): any[] => {
  const rows = [];
  let row = startRow;
  for (const otherCost of farmland.otherAdjustmentCosts) {
    rows.push([
      "",
      "",
      otherCost.displayName,
      "ha",
      buildNumber(farmland.landArea),
      buildNumber(otherCost.costPerHectare),
      buildFormula(`=E${row} * F${row}`),
    ]);
    row++;
  }
  return rows;
}

const buildOperationCostsFirst = (farmland: FarmlandModel): any[] => {
  const rows = [];
  for (const operation of farmland.operations) {
    rows.push([
      "",
      "",
      `${operation.displayName}, ${operation.equipmentOrExternalServiceDisplayName}`,
      buildNumber(operation.depreciationValue('ha')),
      buildNumber(operation.equipmentOperatorWageCosts('ha')),
      buildNumber(operation.accumulatedRepairCosts('ha')),
      "",
    ]);
  }
  return rows;
}

const buildOperationCostsSecond = (farmland: FarmlandModel, firstStartRow: number, secondEndRow: number): any[] => {
  const rows = [];
  let row = 1;
  for (const operation of farmland.operations) {
    rows.push([
      "",
      "",
      `${operation.displayName}, ${operation.equipmentOrExternalServiceDisplayName}`,
      buildNumber(operation.totalFuelCosts('ha')),
      buildNumber(operation.lubricationCosts('ha')),
      buildFormula(`=(SUM(D${firstStartRow + row}:F${firstStartRow + row}) + SUM(D${secondEndRow + row}:E${secondEndRow + row}))`),
      buildFormula(`=F${secondEndRow + row} * ${farmland.landArea}`),
    ]);
    row++;
  }
  return rows;
}

export const buildXlsxReport = (farmland: FarmlandModel) => {
  const title = [ `Bruto seguma novērtējums, ${farmland.displayName}` ]
  const header = [ "Ieņēmumi", "", "", "Mērvienība", "Daudzums", "Cena, EUR", "Kopā, EUR" ];
  const supportAdjustmentStartRow = 6;
  const supportAdjustmentRows = buildSupportAdjustmentRows(farmland, supportAdjustmentStartRow);
  const supportAdjustmentEndRow = supportAdjustmentStartRow + supportAdjustmentRows.length - 1;

  const otherAdjustmentStartRow = supportAdjustmentEndRow + 5;
  const otherAdjustmentRows = buildOtherAdjustmentCosts(farmland, otherAdjustmentStartRow);
  const otherAdjustmentEndRow = otherAdjustmentStartRow + otherAdjustmentRows.length - 1;

  const operationCostsFirstStartRow = otherAdjustmentEndRow + 2;
  const operationCostsFirstRows = buildOperationCostsFirst(farmland);
  const operationCostsFirstEndRow = operationCostsFirstStartRow + operationCostsFirstRows.length - 1;

  const operationCostsSecondStartRow = operationCostsFirstEndRow + 2;
  const operationCostsSecondRows = buildOperationCostsSecond(farmland, operationCostsFirstStartRow, operationCostsSecondStartRow);
  const operationCostsSecondEndRow = operationCostsSecondStartRow + operationCostsSecondRows.length - 1;

  const data = [
    title,
    header,
    [ "", farmland.cropName, "", "t", buildNumber(farmland.totalProductTons), buildNumber(farmland.standardProductPrice), buildFormula('=E3 * F3') ],
    [ "", "Ieņēmumi kopā (1)", "", "", "", "", buildFormula('=SUM(G3:G3)') ],
    [ "Atbalsts", "", "", "", "", "", "" ],
    ...supportAdjustmentRows,
    [ "", "Atbalsts kopā (2)", "", "", "", "", buildFormula(`=SUM(G${supportAdjustmentStartRow}:G${supportAdjustmentEndRow})`) ],
    [ "Mainīgās izmaksas", "", "", "", "", "", "" ],
    [ "", "Izejvielu izmaksas", "", "", "", "", "" ],
    [ "", "", "Sēklas/stādi", "t", buildNumber(farmland.cropUsageTotalTons), buildNumber(farmland.cropCostsPerTon), buildFormula(`=E${supportAdjustmentEndRow + 4} * F${supportAdjustmentEndRow + 4}`) ],
    ...otherAdjustmentRows,
    [ "", "", "Izejvielu izmaksas kopā (3)", "", "", "", buildFormula(`=SUM(G${otherAdjustmentStartRow - 1}:G${otherAdjustmentEndRow})`) ],
    [ "", "Eksplautācijas izmaksas (4.1)", "", "Amortizācija, EUR/ha", "Darbaspēka izmaksas, EUR/ha", "Remonta izmaksas, EUR/ha", "" ],
    ...operationCostsFirstRows,
    [ "", "Eksplautācijas izmaksas (4.2)", "", "Degvielas izmaksas, EUR/ha", "Smērvielu izmaksas, EUR/ha", "Eksplautācijas izmaksas, EUR/ha", "" ],
    ...operationCostsSecondRows,
    [ "", "", "Eksplautācijas izmaksas kopā (4)", "", "", "", buildFormula(`=SUM(G${operationCostsSecondStartRow + 1}:G${operationCostsSecondEndRow + 1})`) ],
    [ "Izmaksas kopā (3 + 4)", "", "", "", "", "", buildFormula(`=G${operationCostsSecondEndRow + 2} + G${otherAdjustmentEndRow + 1}`) ],
    [ "Bruto segums 1 (Ieņēmumi - Izejvielu izmaksas)", "", "", "", "", "", buildFormula(`=G4 - G${otherAdjustmentEndRow + 1}`) ],
    [ "Bruto segums 2 (Ieņēmumi - Eksplautācijas izmaksas)", "", "", "", "", "", buildFormula(`=G4 - G${operationCostsSecondEndRow + 2}`) ],
    [ "Bruto segums 3 ((Ieņēmumi + Atbalsts) - Eksplautācijas izmaksas)", "", "", "", "", "", buildFormula(`=(G4 + G${supportAdjustmentEndRow + 1}) - G${operationCostsSecondEndRow + 2}`) ],
  ]


  const sheetOptions = {
    '!merges': [
      buildRange(0, 0, 6, 0), // Title merge
      buildRange(0, 1, 2, 1), // Header merge
      buildRange(1, 2, 2, 2),
      buildRange(1, 3, 5, 3),
      buildRange(0, 4, 6, 4),
      ...supportAdjustmentRows.map((row, index) => buildRange(1, 5 + index, 2, 5 + index)), // Support adjustment rows
      buildRange(1, supportAdjustmentEndRow, 5, supportAdjustmentEndRow),
      buildRange(0, supportAdjustmentEndRow + 1, 6, supportAdjustmentEndRow + 1),
      buildRange(1, supportAdjustmentEndRow + 2, 6, supportAdjustmentEndRow + 2),
      buildRange(2, otherAdjustmentEndRow, 5, otherAdjustmentEndRow),

      // Operation adjustments 4.1
      buildRange(1, otherAdjustmentEndRow + 1, 2, otherAdjustmentEndRow + 1),
      buildRange(5, otherAdjustmentEndRow + 1, 6, otherAdjustmentEndRow + 1),

      // Operation adjustments 4.2
      buildRange(1, operationCostsFirstEndRow + 1, 2, operationCostsFirstEndRow + 1),
      buildRange(5, operationCostsFirstEndRow + 1, 6, operationCostsFirstEndRow + 1),

      buildRange(2, operationCostsSecondEndRow + 1, 5, operationCostsSecondEndRow + 1),
      buildRange(0, operationCostsSecondEndRow + 2, 5, operationCostsSecondEndRow + 2),
      buildRange(0, operationCostsSecondEndRow + 3, 5, operationCostsSecondEndRow + 3),
      buildRange(0, operationCostsSecondEndRow + 4, 5, operationCostsSecondEndRow + 4),
      buildRange(0, operationCostsSecondEndRow + 5, 5, operationCostsSecondEndRow + 5),
    ],
    '!cols': [ {wch: 8}, {wch: 8}, {wch: farmland.cropName.length - 8}, {wch: 25}, {wch: 25}, {wch: 25}, {wch: 25} ], // Column widths
  };


  const buffer = xlsx.build([{name: 'bruto_segums', data: data as any[], options: {}}], {
    sheetOptions
  });

  DownloadFileFromBuffer(buffer, 'bruto_segums.xlsx', 'aapplication/vnd.ms-excel');
}
