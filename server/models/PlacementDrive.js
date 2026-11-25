const mongoose = require('mongoose');

const resumeScreeningSchema = new mongoose.Schema(
  {
    status: { type: String, enum: ['pending', 'passed', 'failed'], default: 'pending' },
    score: { type: Number, min: 0, max: 100, default: 0 },
    feedback: { type: [String], default: [] },
    generatedByAI: { type: Boolean, default: false },
    aiProvider: { type: String, default: 'mock' },
    source: { type: String, enum: ['platform', 'uploaded'], default: 'platform' },
    uploadedFileName: { type: String, default: '' },
    completedAt: { type: Date },
  },
  { _id: false }
);

const onlineAssessmentSchema = new mongoose.Schema(
  {
    status: { type: String, enum: ['pending', 'in_progress', 'passed', 'failed'], default: 'pending' },
    assignedCategories: { type: [String], default: [] },
    assignedCodingSlug: { type: String, default: '' },
    aptitudeAttemptIds: { type: [mongoose.Schema.Types.ObjectId], ref: 'AptitudeAttempt', default: [] },
    codingAttemptId: { type: mongoose.Schema.Types.ObjectId, ref: 'CodingAttempt' },
    aptitudeScorePercent: { type: Number, default: 0 },
    codingScorePercent: { type: Number, default: 0 },
    score: { type: Number, min: 0, max: 100, default: 0 },
    completedAt: { type: Date },
  },
  { _id: false }
);

const interviewStageSchema = new mongoose.Schema(
  {
    status: { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' },
    configId: { type: mongoose.Schema.Types.ObjectId, ref: 'InterviewConfiguration' },
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'InterviewSession' },
    overallScore: { type: Number, default: 0 },
    completedAt: { type: Date },
  },
  { _id: false }
);

const finalEvaluationSchema = new mongoose.Schema(
  {
    overallScore: { type: Number, default: 0 },
    verdict: { type: String, enum: ['Selected', 'OnHold', 'Rejected'] },
    breakdown: {
      resumeWeighted: { type: Number, default: 0 },
      assessmentWeighted: { type: Number, default: 0 },
      technicalWeighted: { type: Number, default: 0 },
      hrWeighted: { type: Number, default: 0 },
    },
    completedAt: { type: Date },
  },
  { _id: false }
);

const placementDriveSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: String, enum: ['BE', 'BCA'], required: true },
    branch: { type: String, default: '' },
    jobRole: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    currentStage: {
      type: String,
      enum: ['resume_screening', 'online_assessment', 'technical_interview', 'hr_interview', 'final_evaluation', 'result'],
      default: 'resume_screening',
    },
    status: { type: String, enum: ['in_progress', 'completed', 'abandoned'], default: 'in_progress' },
    resumeScreening: { type: resumeScreeningSchema, default: () => ({}) },
    onlineAssessment: { type: onlineAssessmentSchema, default: () => ({}) },
    technicalInterview: { type: interviewStageSchema, default: () => ({}) },
    hrInterview: { type: interviewStageSchema, default: () => ({}) },
    finalEvaluation: { type: finalEvaluationSchema, default: () => ({}) },
  },
  { timestamps: true }
);

placementDriveSchema.index({ userId: 1, status: 1 });
placementDriveSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('PlacementDrive', placementDriveSchema);
