import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import bookmarkService from '../services/bookmarkService';

// Shared save/unsave logic for any page that renders bookmarkable resource links
// (ResourceCategoryGrid-based pages) — keeps the fetch-toggle-optimistic-update pattern in
// one place instead of duplicating it across Study Materials / Previous Papers / Current Affairs.
const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(() => {
    bookmarkService
      .list()
      .then((data) => setBookmarks(data.bookmarks))
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const bookmarkedHrefs = new Set(bookmarks.map((b) => b.href));

  const toggle = async (link, category) => {
    const existing = bookmarks.find((b) => b.href === link.href);
    if (existing) {
      setBookmarks((prev) => prev.filter((b) => b.href !== link.href));
      try {
        await bookmarkService.remove(existing._id);
      } catch {
        load();
      }
      return;
    }
    setBookmarks((prev) => [...prev, { _id: `temp-${link.href}`, label: link.label, href: link.href, category }]);
    try {
      const data = await bookmarkService.create({ label: link.label, href: link.href, category });
      setBookmarks((prev) => prev.map((b) => (b._id === `temp-${link.href}` ? data.bookmark : b)));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save bookmark');
      load();
    }
  };

  return { bookmarks, bookmarkedHrefs, loaded, toggle, refresh: load };
};

export default useBookmarks;
