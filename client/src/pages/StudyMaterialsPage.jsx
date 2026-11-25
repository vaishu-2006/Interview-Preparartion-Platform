import { useSelector } from 'react-redux';
import ResourceCategoryGrid from '../components/common/ResourceCategoryGrid';
import useBookmarks from '../hooks/useBookmarks';

const PLACEMENT_CATEGORIES = [
  {
    title: 'Data Structures & Algorithms',
    description: 'Core DSA topics that show up in almost every technical round.',
    icon: 'cpu',
    links: [
      { label: 'GeeksforGeeks — DSA', href: 'https://www.geeksforgeeks.org/data-structures/', desc: 'Topic-wise notes and practice problems.' },
      { label: 'LeetCode', href: 'https://leetcode.com/', desc: 'The largest bank of coding interview problems.' },
      { label: 'VisuAlgo', href: 'https://visualgo.net/', desc: 'Visualize how algorithms and data structures actually work.' },
    ],
  },
  {
    title: 'Core CS Subjects',
    description: 'Operating Systems, DBMS, and Computer Networks — the branch-specific theory rounds test.',
    icon: 'graduationCap',
    links: [
      { label: 'Operating Systems — GeeksforGeeks', href: 'https://www.geeksforgeeks.org/operating-systems/', desc: 'Processes, scheduling, memory management, deadlocks.' },
      { label: 'DBMS — GeeksforGeeks', href: 'https://www.geeksforgeeks.org/dbms/', desc: 'Normalization, transactions, indexing, SQL.' },
      { label: 'Computer Networks — GeeksforGeeks', href: 'https://www.geeksforgeeks.org/computer-network-tutorials/', desc: 'OSI/TCP model, routing, protocols.' },
      { label: 'NPTEL', href: 'https://nptel.ac.in/', desc: 'Free university-grade video courses on every core CS subject.' },
    ],
  },
  {
    title: 'Web Development',
    description: 'Reference docs and tutorials for full-stack and frontend roles.',
    icon: 'globe',
    links: [
      { label: 'MDN Web Docs', href: 'https://developer.mozilla.org/', desc: 'The definitive reference for HTML, CSS, and JavaScript.' },
      { label: 'freeCodeCamp', href: 'https://www.freecodecamp.org/', desc: 'Free, project-based full-stack curriculum.' },
      { label: 'W3Schools', href: 'https://www.w3schools.com/', desc: 'Quick, example-driven web technology references.' },
    ],
  },
  {
    title: 'Aptitude & Reasoning',
    description: 'Extra practice beyond what\'s already in the Aptitude module here.',
    icon: 'calculator',
    links: [
      { label: 'IndiaBix', href: 'https://www.indiabix.com/', desc: 'Category-wise quantitative, logical, and verbal practice sets.' },
      { label: 'GeeksforGeeks — Aptitude', href: 'https://www.geeksforgeeks.org/aptitude-questions-and-answers/', desc: 'Explained aptitude problems with solutions.' },
    ],
  },
  {
    title: 'Interview Preparation',
    description: 'Real interview experiences, questions, and behavioral-round prep.',
    icon: 'target',
    links: [
      { label: 'InterviewBit', href: 'https://www.interviewbit.com/', desc: 'Company-wise interview questions and prep guides.' },
      { label: 'GeeksforGeeks — Interview Experiences', href: 'https://www.geeksforgeeks.org/category/interview-experiences/', desc: 'Real candidate write-ups by company and role.' },
      { label: 'Glassdoor — Interview Questions', href: 'https://www.glassdoor.com/Interview/index.htm', desc: 'Crowd-sourced interview questions by company.' },
    ],
  },
];

const UPSC_CATEGORIES = [
  {
    title: 'UPSC Preparation',
    description: 'Official and free resources for civil services aspirants.',
    icon: 'landmark',
    links: [
      { label: 'UPSC — Official Website', href: 'https://upsc.gov.in/', desc: 'Notifications, syllabus, and exam calendar, straight from the source.' },
      { label: 'NCERT Textbooks', href: 'https://ncert.nic.in/textbook.php', desc: 'Free official PDFs — the standard foundation for UPSC prep.' },
      { label: 'PIB — Press Information Bureau', href: 'https://pib.gov.in/', desc: 'Official government press releases, useful for current affairs.' },
    ],
  },
];

const StudyMaterialsPage = () => {
  // Course-scoped, not a manual tab switcher — a BE/BCA student has no reason to see UPSC
  // resources here (and vice versa); UPSC also has its own dedicated Previous Papers/Current
  // Affairs pages, this page just needs to show the one category set that applies to them.
  const course = useSelector((state) => state.dashboard.data?.course);
  const activeCategories = course === 'UPSC' ? UPSC_CATEGORIES : PLACEMENT_CATEGORIES;
  const { bookmarkedHrefs, toggle } = useBookmarks();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink-1">Study Materials</h1>
        <p className="mt-1 text-ink-3">Curated, free resources to supplement your practice on this platform.</p>
      </div>

      <ResourceCategoryGrid categories={activeCategories} bookmarkedHrefs={bookmarkedHrefs} onToggleBookmark={toggle} />
    </div>
  );
};

export default StudyMaterialsPage;
