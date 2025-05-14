import { google } from 'googleapis';

// Initialize Google Sheets client
const getSheetsClient = () => {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
};

// Append data to a specific sheet
export const appendToSheet = async (sheetName: string, values: any[]) => {
  const sheets = getSheetsClient();
  
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `${sheetName}!A:Z`, // Using A:Z to accommodate any number of columns
    valueInputOption: 'RAW',
    requestBody: {
      values: [values],
    },
  });
}; 