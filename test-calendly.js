const https = require('https');
const fs = require('fs');

const API_KEY = process.env.CALENDLY_API_KEY || 'eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzcyOTI2Mzc2LCJqdGkiOiJhNzkxYjZlMC0xMzMzLTQxZTItOWIyYy1mNmUzNGM4NzZjZDMiLCJ1c2VyX3V1aWQiOiI4MjU3ZmRmMC1kYjM2LTQ5NDktYjY4NC1lMzAwYTllM2ZmN2EiLCJzY29wZSI6ImF2YWlsYWJpbGl0eTpyZWFkIGF2YWlsYWJpbGl0eTp3cml0ZSBldmVudF90eXBlczpyZWFkIGV2ZW50X3R5cGVzOndyaXRlIGxvY2F0aW9uczpyZWFkIHJvdXRpbmdfZm9ybXM6cmVhZCBzaGFyZXM6d3JpdGUgc2NoZWR1bGVkX2V2ZW50czpyZWFkIHNjaGVkdWxlZF9ldmVudHM6d3JpdGUgc2NoZWR1bGluZ19saW5rczp3cml0ZSBncm91cHM6cmVhZCBvcmdhbml6YXRpb25zOnJlYWQgb3JnYW5pemF0aW9uczp3cml0ZSB1c2VyczpyZWFkIGFjdGl2aXR5X2xvZzpyZWFkIGRhdGFfY29tcGxpYW5jZTp3cml0ZSBvdXRnb2luZ19jb21tdW5pY2F0aW9uczpyZWFkIn0.mqBc1pjuLXRHy_vw0DOLQ4cZkxACJC66Z9pyznjUV_7Il38eG_7Gstl27qxEcOiX3gYhSbAmw5LMS4jfTFutew';

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.calendly.com',
      path: path,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function run() {
  try {
    const eventTypeUri = "https://api.calendly.com/event_types/521346aa-5164-4bff-99f3-228c714a690e";
    // Add 1 hour to start time to ensure it is in the future
    const startTime = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    const endTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    
    console.log(`Fetching availability for ${eventTypeUri} from ${startTime} to ${endTime}`);
    
    const path = `/event_type_available_times?event_type=${encodeURIComponent(eventTypeUri)}&start_time=${encodeURIComponent(startTime)}&end_time=${encodeURIComponent(endTime)}`;
    
    const res = await makeRequest(path);
    console.log('Status:', res.status);
    fs.writeFileSync('calendly-availability.json', JSON.stringify(res.data, null, 2), 'utf-8');
    console.log('Data written to calendly-availability.json');
  } catch (error) {
    console.error('Error:', error);
  }
}

run();
