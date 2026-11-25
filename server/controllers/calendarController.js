const asyncHandler = require('../utils/asyncHandler');
const calendarExportService = require('../services/calendarExportService');

const exportIcs = asyncHandler(async (req, res) => {
  const ics = await calendarExportService.buildUserCalendarIcs(req.user._id);
  res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="placementprep-calendar.ics"');
  res.status(200).send(ics);
});

module.exports = { exportIcs };
