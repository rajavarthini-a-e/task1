import { getEnrollmentLeadsFromDatabase } from '../../../../lib/database';

function escapeCsv(value: string) {
  if (value == null) return '';
  const escaped = value.replace(/"/g, '""');
  return `"${escaped}"`;
}

export async function GET() {
  try {
    const leads = await getEnrollmentLeadsFromDatabase();

    const headers = [
      'Timestamp',
      'Student Name',
      'Email',
      'Phone',
      'Course Interested',
      'Qualification',
      'Learning Goal',
    ];

    const csvRows = [headers.join(',')];

    for (const lead of leads) {
      const row = [
        escapeCsv(lead.timestamp),
        escapeCsv(lead.studentName),
        escapeCsv(lead.email),
        escapeCsv(lead.phone),
        escapeCsv(lead.courseInterested),
        escapeCsv(lead.qualification),
        escapeCsv(lead.learningGoal),
      ];
      csvRows.push(row.join(','));
    }

    const csvData = csvRows.join('\r\n');

    return new Response(csvData, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="enrollment_submissions.csv"',
      },
    });
  } catch (error: any) {
    return new Response('Unable to generate CSV export: ' + (error?.message || 'Unknown error'), {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}
