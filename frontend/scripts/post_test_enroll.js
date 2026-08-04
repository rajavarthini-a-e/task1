const payload = {
  studentName: 'Test User',
  email: 'test.user@example.com',
  phone: '+919876543210',
  courseInterested: 'Artificial Intelligence Masterclass',
  qualification: 'Working Professional',
  learningGoal: 'Testing enrollment flow.',
};

async function run() {
  try {
    const res = await fetch('http://localhost:3000/api/enroll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    console.log('STATUS', res.status);
    console.log(text);
  } catch (err) {
    console.error('Fetch error:', err);
    process.exit(1);
  }
}

run();
