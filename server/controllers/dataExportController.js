const asyncHandler = require('../utils/asyncHandler');
const dataExportService = require('../services/dataExportService');

const exportMyData = asyncHandler(async (req, res) => {
  const data = await dataExportService.buildExport(req.user._id);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="placementprep-my-data.json"');
  res.status(200).send(JSON.stringify(data, null, 2));
});

module.exports = { exportMyData };
