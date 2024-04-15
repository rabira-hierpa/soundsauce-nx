'use server';
import { NextApiRequest, NextApiResponse } from 'next';
const baseUrl = 'https://jsonplaceholder.typicode.com/todos/';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch(baseUrl);
    const todo = await response.json();
    return new Response(JSON.stringify(todo), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
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

export async function PUT(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch(`${baseUrl}${req.body.id}`, {
      method: 'PUT',
      body: JSON.stringify(req.body),
    });
    const todo = await response.json();
    return new Response(JSON.stringify(todo), { status: 200 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  try {
    await fetch(`${baseUrl}${req.body.id}`, {
      method: 'DELETE',
    });
    return new Response('Deleted', { status: 200 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}
