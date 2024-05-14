import fs from 'fs';
import path from 'path';

export async function GET(req: Request, res: Response) {
  const filePath = path.join(process.cwd(), '/src/app/api/csv/data/10k.csv');
  try {
    // Read the CSV file
    const csvData = await fs.promises.readFile(filePath, 'utf-8');

    // Send the CSV data as the response
    return new Response(csvData, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="file.csv"',
      },
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
