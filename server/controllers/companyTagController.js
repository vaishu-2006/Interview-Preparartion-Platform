const asyncHandler = require('../utils/asyncHandler');
const companyTagService = require('../services/companyTagService');

const listTags = asyncHandler(async (req, res) => {
  const tags = await companyTagService.listTags(req.params.slug);
  res.status(200).json({ success: true, tags });
});

const addTag = asyncHandler(async (req, res) => {
  const tags = await companyTagService.addTag(req.user._id, req.params.slug, req.body.company, req.body.roundType);
  res.status(201).json({ success: true, tags });
});

module.exports = { listTags, addTag };
