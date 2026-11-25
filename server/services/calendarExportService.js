const Profile = require('../models/Profile');
const ProblemAssignment = require('../models/ProblemAssignment');
const PlatformEvent = require('../models/PlatformEvent');
const StudyTask = require('../models/StudyTask');
const PracticeRoom = require('../models/PracticeRoom');
const contestService = require('./contestService');
const { buildIcs } = require('../utils/icsBuilder');

// Course-aware — a source only appears in the export if it's actually relevant to that
// student's course, same discipline as the rest of the platform's course-gating.
const buildUserCalendarIcs = async (userId) => {
  const profile = await Profile.findOne({ userId }).select('course');
  const course = profile?.course;
  const events = [];

  const platformEvents = await PlatformEvent.find({ $or: [{ course: null }, { course }] }).select('title description startsAt endsAt');
  platformEvents.forEach((ev) => {
    events.push({ uid: `event-${ev._id}`, title: ev.title, description: ev.description, start: ev.startsAt, end: ev.endsAt });
  });

  if (course === 'BE' || course === 'BCA') {
    const contest = await contestService.getCurrentContest(userId);
    events.push({
      uid: `contest-${contest.id}`,
      title: 'Weekend Coding Contest',
      description: 'Solve for bonus points on top of the normal first-solve points.',
      start: contest.startsAt,
      end: contest.endsAt,
    });

    const assignments = await ProblemAssignment.find({
      $or: [{ assignedTo: userId }, { assignedToAll: true, course }],
      dueDate: { $exists: true, $ne: null },
    }).populate('problemId', 'title');
    assignments
      .filter((a) => a.problemId)
      .forEach((a) => {
        events.push({
          uid: `assignment-${a._id}`,
          title: `Assignment Due: ${a.problemId.title}`,
          description: 'Coding problem assigned by faculty/admin.',
          start: a.dueDate,
          end: a.dueDate,
        });
      });
  }

  if (course === 'UPSC') {
    const tasks = await StudyTask.find({ userId, dueDate: { $exists: true, $ne: null }, done: false }).select('title notes dueDate');
    tasks.forEach((t) => {
      events.push({ uid: `task-${t._id}`, title: t.title, description: t.notes, start: t.dueDate, end: t.dueDate });
    });
  }

  // Scheduled peer practice rooms this student is hosting or has reserved a spot in — available
  // regardless of course, same as the feature itself.
  const practiceRooms = await PracticeRoom.find({
    $or: [{ hostId: userId }, { joinedById: userId }],
    status: { $in: ['scheduled', 'reserved'] },
    scheduledFor: { $ne: null },
  }).select('topic scheduledFor hostName');
  practiceRooms.forEach((r) => {
    const end = new Date(r.scheduledFor);
    end.setHours(end.getHours() + 1);
    events.push({
      uid: `practice-room-${r._id}`,
      title: `Peer Practice: ${r.topic}`,
      description: `Hosted by ${r.hostName}`,
      start: r.scheduledFor,
      end,
    });
  });

  return buildIcs(events, { calendarName: 'PlacementPrep' });
};

module.exports = { buildUserCalendarIcs };
