'use server';
const baseUrl = 'https://jsonplaceholder.typicode.com/todos/';

export async function GET(req: Request, res: Response) {
  try {
    const response = await fetch(baseUrl);
    const todo = await response.json();
    return new Response(JSON.stringify(todo), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request, res: Response) {
  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      body: JSON.stringify(req.body),
    });
    const todo = await response.json();
    return new Response(JSON.stringify(todo), { status: 201 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}
