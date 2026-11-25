import ResourceCategoryGrid from '../../components/common/ResourceCategoryGrid';
import useBookmarks from '../../hooks/useBookmarks';

const CATEGORIES = [
  {
    title: 'Previous Year Papers',
    description: 'Official and archived question papers for Prelims and Mains.',
    icon: 'archive',
    links: [
      { label: 'UPSC — Previous Papers', href: 'https://upsc.gov.in/examinations/previous-question-papers', desc: 'Official archive of Prelims and Mains question papers.' },
      { label: 'Insights on India — PYQs', href: 'https://www.insightsonindia.com/', desc: 'Categorized previous year questions with analysis.' },
      { label: 'ClearIAS — Previous Papers', href: 'https://www.clearias.com/upsc-previous-years-question-papers/', desc: 'Year-wise Prelims and Mains papers with solutions.' },
    ],
  },
  {
    title: 'Optional Subject Materials',
    description: 'Resources for Mains optional-subject preparation.',
    icon: 'layers',
    links: [
      { label: 'UPSC — Optional Syllabus', href: 'https://upsc.gov.in/examinations/syllabus', desc: 'Official syllabus for every optional subject.' },
      { label: 'Vision IAS', href: 'https://www.visionias.in/', desc: 'Structured notes and test series across optional subjects.' },
    ],
  },
  {
    title: 'Standard Reference Books',
    description: 'The commonly recommended standard texts for GS and CSAT.',
    icon: 'book',
    links: [
      { label: 'NCERT Booklist for UPSC', href: 'https://vajiramandravi.com/upsc-exam/ncert-books-for-upsc/', desc: 'Subject-wise Class VI-XII NCERT PDFs curated for the UPSC syllabus, not the full generic K-12 catalog.' },
      { label: 'India Year Book (Publications Division)', href: 'https://www.publicationsdivision.nic.in/', desc: 'Official annual reference on government schemes and data.' },
    ],
  },
];

const PreviousPapersPage = () => {
  const { bookmarkedHrefs, toggle } = useBookmarks();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink-1">Previous Papers</h1>
        <p className="mt-1 text-ink-3">Real, official and free resources — previous papers, optional subjects, and standard reference books.</p>
      </div>
      <ResourceCategoryGrid categories={CATEGORIES} bookmarkedHrefs={bookmarkedHrefs} onToggleBookmark={toggle} />
    </div>
  );
};

export default PreviousPapersPage;
