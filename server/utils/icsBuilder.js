// Minimal hand-rolled .ics (iCalendar, RFC 5545) builder — the format is plain text, so no
// external dependency is needed for a "download my calendar" one-off export.
const escapeText = (str = '') =>
  String(str).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

const formatDate = (date) => `${new Date(date).toISOString().replace(/[-:]/g, '').split('.')[0]}Z`;

const buildIcs = (events, { calendarName = 'PlacementPrep' } = {}) => {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PlacementPrep//Calendar Export//EN',
    `X-WR-CALNAME:${escapeText(calendarName)}`,
    'CALSCALE:GREGORIAN',
  ];

  events.forEach((ev) => {
    lines.push(
      'BEGIN:VEVENT',
      `UID:${ev.uid}@placementprep`,
      `DTSTAMP:${formatDate(new Date())}`,
      `DTSTART:${formatDate(ev.start)}`,
      `DTEND:${formatDate(ev.end || ev.start)}`,
      `SUMMARY:${escapeText(ev.title)}`,
      ...(ev.description ? [`DESCRIPTION:${escapeText(ev.description)}`] : []),
      'END:VEVENT'
    );
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
};

module.exports = { buildIcs };
