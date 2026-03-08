import { NextResponse } from 'next/server';

const CALENDLY_API_KEY = process.env.CALENDLY_API_KEY;
const EVENT_TYPE_URI = "https://api.calendly.com/event_types/521346aa-5164-4bff-99f3-228c714a690e";

export async function GET(request: Request) {
  if (!CALENDLY_API_KEY) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const startTime = searchParams.get('start_time');
  const endTime = searchParams.get('end_time');

  if (!startTime || !endTime) {
    return NextResponse.json({ error: 'Missing start_time or end_time' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://api.calendly.com/event_type_available_times?event_type=${encodeURIComponent(EVENT_TYPE_URI)}&start_time=${encodeURIComponent(startTime)}&end_time=${encodeURIComponent(endTime)}`,
      {
        headers: {
          'Authorization': `Bearer ${CALENDLY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
        const errData = await response.json();
        return NextResponse.json({ error: 'Calendly API Error', details: errData }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Calendly availability:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
