import { NextResponse } from 'next/server';

export async function POST(request) {
  let email, tags;
  try {
    ({ email, tags } = await request.json());
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  if (!process.env.BUTTONDOWN_API_KEY) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  let res;
  try {
    res = await fetch('https://api.buttondown.email/v1/subscribers', {
      method: 'POST',
      headers: {
        Authorization: `Token ${process.env.BUTTONDOWN_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email_address: email, tags: tags || [] }),
    });
  } catch {
    return NextResponse.json({ error: 'Failed to reach subscription service' }, { status: 502 });
  }

  const bdJson = await res.json();
  console.log('Buttondown response:', res.status, JSON.stringify(bdJson));

  if (res.ok) {
    return NextResponse.json({ success: true });
  }

  if (res.status === 400) {
    return NextResponse.json({ error: "You're already subscribed!" }, { status: 400 });
  }

  return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: res.status || 500 });
}
