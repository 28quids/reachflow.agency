import { google } from 'googleapis';

// Initialize Google Sheets client
const getSheetsClient = () => {
  console.log('Initializing Google Sheets client...');
  console.log('Client Email exists:', !!process.env.GOOGLE_CLIENT_EMAIL);
  console.log('Private Key exists:', !!process.env.GOOGLE_PRIVATE_KEY);
  console.log('Sheet ID exists:', !!process.env.GOOGLE_SHEET_ID);

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
  console.log('=== Appending to Sheet ===');
  console.log('Sheet Name:', sheetName);
  console.log('Values:', values);
  
  const sheets = getSheetsClient();
  
  try {
    console.log('Making append request...');
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `${sheetName}!A:Z`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [values],
      },
    });
    
    console.log('Append successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error appending to sheet:', error);
    throw error;
  }
}; 