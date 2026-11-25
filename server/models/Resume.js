const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema(
  {
    institution: { type: String, required: true },
    degree: { type: String, default: '' },
    fieldOfStudy: { type: String, default: '' },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    grade: { type: String, default: '' },
  },
  { timestamps: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    techStack: { type: [String], default: [] },
    link: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    fromGithub: { type: Boolean, default: false },
  },
  { timestamps: false }
);

const experienceSchema = new mongoose.Schema(
  {
    company: { type: String, required: true },
    role: { type: String, default: '' },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  { timestamps: false }
);

const certificationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    issuer: { type: String, default: '' },
    date: { type: String, default: '' },
    link: { type: String, default: '' },
  },
  { timestamps: false }
);

const achievementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    date: { type: String, default: '' },
  },
  { timestamps: false }
);

const languageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    proficiency: { type: String, default: 'Intermediate' },
  },
  { timestamps: false }
);

const resumeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    template: { type: String, enum: ['modern', 'classic', 'minimal'], default: 'modern' },
    sectionOrder: {
      type: [String],
      default: ['education', 'skills', 'experience', 'projects', 'certifications', 'achievements', 'languages'],
    },
    personalDetails: {
      fullName: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      portfolio: { type: String, default: '' },
      summary: { type: String, default: '' },
    },
    education: { type: [educationSchema], default: [] },
    skills: { type: [String], default: [] },
    projects: { type: [projectSchema], default: [] },
    experience: { type: [experienceSchema], default: [] },
    certifications: { type: [certificationSchema], default: [] },
    achievements: { type: [achievementSchema], default: [] },
    languages: { type: [languageSchema], default: [] },
    declaration: {
      text: { type: String, default: 'I hereby declare that the information provided above is true to the best of my knowledge.' },
      place: { type: String, default: '' },
      date: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resume', resumeSchema);
