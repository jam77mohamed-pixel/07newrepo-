import axios from 'axios';

const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1/volumes';

/**
 * In-memory response cache to prevent redundant API calls & rate-limiting
 */
const queryCache = new Map();
const suggestionCache = new Map();

/**
 * Curated list of popular quick search suggestion tags
 */
export const POPULAR_SEARCH_SUGGESTIONS = [
  'Clean Code',
  'Atomic Habits',
  'Sapiens',
  'Design Patterns',
  'Frank Herbert Dune',
  'Psychology of Money',
  'Artificial Intelligence',
  'To Kill a Mockingbird',
  'The Great Gatsby',
  'Machine Learning',
  'Deep Work',
  'Steve Jobs'
];

/**
 * Comprehensive offline library collection used as instant fallback when Google Books rate-limits
 */
const OFFLINE_FALLBACK_BOOKS = [
  {
    id: 'fb-clean-code',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    isbn: '9780132350884',
    genre: 'Computer Science',
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400',
    description: 'Even bad code can function. But if code isn\'t clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code.',
    pageCount: 464,
    publisher: 'Prentice Hall',
    publishedDate: '2008-08-01',
    totalCopies: 6,
    availableCopies: 6
  },
  {
    id: 'fb-atomic-habits',
    title: 'Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones',
    author: 'James Clear',
    isbn: '9780735211292',
    genre: 'Self-Help',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400',
    description: 'No matter your goals, Atomic Habits offers a proven framework for improving--every day. James Clear reveals practical strategies that will teach you exactly how to form good habits and break bad ones.',
    pageCount: 320,
    publisher: 'Avery',
    publishedDate: '2018-10-16',
    totalCopies: 5,
    availableCopies: 5
  },
  {
    id: 'fb-design-patterns',
    title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
    author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
    isbn: '9780201633610',
    genre: 'Computer Science',
    coverImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&q=80&w=400',
    description: 'Capturing a wealth of experience about the design of object-oriented software, four top-notch designers present a catalog of simple and succinct solutions to commonly occurring design problems.',
    pageCount: 416,
    publisher: 'Addison-Wesley Professional',
    publishedDate: '1994-10-31',
    totalCopies: 4,
    availableCopies: 4
  },
  {
    id: 'fb-sapiens',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    isbn: '9780062316097',
    genre: 'History',
    coverImage: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=400',
    description: '100,000 years ago, at least six human species inhabited the earth. Today there is just one. Us. Homo sapiens. How did our species succeed in the battle for dominance?',
    pageCount: 498,
    publisher: 'Harper',
    publishedDate: '2015-02-10',
    totalCopies: 5,
    availableCopies: 5
  },
  {
    id: 'fb-dune',
    title: 'Dune',
    author: 'Frank Herbert',
    isbn: '9780441172719',
    genre: 'Science Fiction',
    coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=400',
    description: 'Set on the desert planet Arrakis, Dune is the story of Paul Atreides—who would become the mysterious man known as Muad\'Dib. He would avenge the traitorous plot against his noble family.',
    pageCount: 688,
    publisher: 'Ace Books',
    publishedDate: '1965-08-01',
    totalCopies: 6,
    availableCopies: 6
  },
  {
    id: 'fb-psychology-money',
    title: 'The Psychology of Money: Timeless lessons on wealth, greed, and happiness',
    author: 'Morgan Housel',
    isbn: '9780857197689',
    genre: 'Finance',
    coverImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=400',
    description: 'Doing well with money isn\'t necessarily about what you know. It\'s about how you behave. And behavior is hard to teach, even to really smart people.',
    pageCount: 256,
    publisher: 'Harriman House',
    publishedDate: '2020-09-08',
    totalCopies: 5,
    availableCopies: 5
  },
  {
    id: 'fb-deep-work',
    title: 'Deep Work: Rules for Focused Success in a Distracted World',
    author: 'Cal Newport',
    isbn: '9781455586691',
    genre: 'Productivity',
    coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=400',
    description: 'Deep work is the ability to focus without distraction on a cognitively demanding task. It\'s a skill that allows you to quickly master complicated information.',
    pageCount: 304,
    publisher: 'Grand Central Publishing',
    publishedDate: '2016-01-05',
    totalCopies: 4,
    availableCopies: 4
  },
  {
    id: 'fb-pragmatic-programmer',
    title: 'The Pragmatic Programmer: Your Journey To Mastery',
    author: 'David Thomas, Andrew Hunt',
    isbn: '9780135957059',
    genre: 'Computer Science',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=400',
    description: 'Straight from the programming trenches, The Pragmatic Programmer cuts through the increasing specialization and technicalities of modern software development.',
    pageCount: 352,
    publisher: 'Addison-Wesley',
    publishedDate: '2019-09-13',
    totalCopies: 5,
    availableCopies: 5
  },
  {
    id: 'fb-gatsby',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '9780743273565',
    genre: 'Classic Literature',
    coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400',
    description: 'The story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan in 1920s Jazz Age America.',
    pageCount: 180,
    publisher: 'Scribner',
    publishedDate: '1925-04-10',
    totalCopies: 6,
    availableCopies: 6
  },
  {
    id: 'fb-mockingbird',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '9780060935467',
    genre: 'Classic Literature',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400',
    description: 'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it, exploring courage and compassion.',
    pageCount: 336,
    publisher: 'Harper Perennial',
    publishedDate: '1960-07-11',
    totalCopies: 6,
    availableCopies: 6
  }
];

/**
 * Filter offline fallback collection by search query
 */
const searchOfflineFallbacks = (query) => {
  const q = query.toLowerCase().trim();
  const cleanIsbn = q.replace(/[\s-]/g, '');

  return OFFLINE_FALLBACK_BOOKS.filter((b) => {
    return (
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.genre.toLowerCase().includes(q) ||
      b.isbn.replace(/[\s-]/g, '').includes(cleanIsbn)
    );
  });
};

/**
 * Fetch fast live autocomplete suggestions (with aggressive caching and rate-limit guard)
 * @param {string} query - user input query
 * @param {number} limit - maximum number of suggestions (default: 5)
 * @returns {Promise<Array>} list of suggestion objects
 */
export const fetchBookSuggestions = async (query, limit = 5) => {
  if (!query || query.trim().length < 2) return [];

  const cleanQuery = query.trim().toLowerCase();

  // 1. Check in-memory suggestion cache
  if (suggestionCache.has(cleanQuery)) {
    return suggestionCache.get(cleanQuery).slice(0, limit);
  }

  // 2. Query Google Books API with safe error-handling
  try {
    const isIsbn = /^[0-9-]{9,17}$/.test(cleanQuery.replace(/[\s-]/g, ''));
    const searchQuery = isIsbn ? `isbn:${cleanQuery.replace(/[\s-]/g, '')}` : cleanQuery;

    const response = await axios.get(GOOGLE_BOOKS_API_URL, {
      params: {
        q: searchQuery,
        maxResults: limit,
        printType: 'books',
        projection: 'lite'
      },
      timeout: 4000
    });

    if (response.data && response.data.items && response.data.items.length > 0) {
      const items = response.data.items.map((item) => {
        const info = item.volumeInfo || {};
        
        let coverImage = '';
        if (info.imageLinks) {
          coverImage = info.imageLinks.thumbnail || info.imageLinks.smallThumbnail || '';
          if (coverImage.startsWith('http://')) {
            coverImage = coverImage.replace('http://', 'https://');
          }
        }

        let isbn = '';
        if (info.industryIdentifiers && info.industryIdentifiers.length > 0) {
          const isbn13 = info.industryIdentifiers.find((id) => id.type === 'ISBN_13');
          const isbn10 = info.industryIdentifiers.find((id) => id.type === 'ISBN_10');
          isbn = isbn13 ? isbn13.identifier : isbn10 ? isbn10.identifier : info.industryIdentifiers[0].identifier;
        }

        return {
          id: item.id,
          title: info.title || 'Untitled Book',
          author: info.authors ? info.authors.join(', ') : 'Unknown Author',
          genre: info.categories && info.categories.length > 0 ? info.categories[0] : 'General',
          coverImage: coverImage || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400',
          isbn: isbn || 'N/A',
          publishedDate: info.publishedDate || ''
        };
      });

      // Save to cache
      suggestionCache.set(cleanQuery, items);
      return items;
    }
  } catch (err) {
    // Graceful silent fallback without noisy error popups
    console.warn('Google Books live suggestion API notice (using local suggestions):', err.message);
  }

  // 3. Fallback to matching offline books if API is throttled or offline
  const offlineMatches = searchOfflineFallbacks(cleanQuery).map((b) => ({
    id: b.id,
    title: b.title,
    author: b.author,
    genre: b.genre,
    coverImage: b.coverImage,
    isbn: b.isbn,
    publishedDate: b.publishedDate
  }));

  if (offlineMatches.length > 0) {
    suggestionCache.set(cleanQuery, offlineMatches);
    return offlineMatches.slice(0, limit);
  }

  return [];
};

/**
 * Search books via the Google Books API (with smart fallback & rate limit prevention)
 * @param {string} query - Search term (title, author, or ISBN)
 * @param {number} maxResults - Number of results to fetch (default 12)
 * @returns {Promise<Array>} Array of parsed book objects
 */
export const searchGoogleBooks = async (query, maxResults = 12) => {
  if (!query || !query.trim()) return [];

  const cleanQuery = query.trim();
  const cacheKey = `${cleanQuery.toLowerCase()}_${maxResults}`;

  // 1. Check in-memory query cache
  if (queryCache.has(cacheKey)) {
    return queryCache.get(cacheKey);
  }

  const isIsbn = /^[0-9-]{9,17}$/.test(cleanQuery.replace(/[\s-]/g, ''));
  const searchQuery = isIsbn ? `isbn:${cleanQuery.replace(/[\s-]/g, '')}` : cleanQuery;

  try {
    const response = await axios.get(GOOGLE_BOOKS_API_URL, {
      params: {
        q: searchQuery,
        maxResults,
        printType: 'books'
      },
      timeout: 7000
    });

    if (response.data && response.data.items && response.data.items.length > 0) {
      const parsedResults = response.data.items.map((item) => {
        const info = item.volumeInfo || {};
        
        // Extract ISBN-13 or ISBN-10
        let isbn = '';
        if (info.industryIdentifiers && info.industryIdentifiers.length > 0) {
          const isbn13 = info.industryIdentifiers.find((id) => id.type === 'ISBN_13');
          const isbn10 = info.industryIdentifiers.find((id) => id.type === 'ISBN_10');
          isbn = isbn13 ? isbn13.identifier : isbn10 ? isbn10.identifier : info.industryIdentifiers[0].identifier;
        }

        // Extract high quality image if available, with fallback
        let coverImage = '';
        if (info.imageLinks) {
          coverImage = info.imageLinks.thumbnail || info.imageLinks.smallThumbnail || '';
          if (coverImage.startsWith('http://')) {
            coverImage = coverImage.replace('http://', 'https://');
          }
        }

        const genre = info.categories && info.categories.length > 0 
          ? info.categories[0] 
          : 'Fiction';

        return {
          id: item.id,
          title: info.title || 'Untitled Book',
          author: info.authors ? info.authors.join(', ') : 'Unknown Author',
          isbn: isbn || 'N/A',
          genre: genre,
          coverImage: coverImage || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400',
          description: info.description || 'No description available for this book from Google Books.',
          pageCount: info.pageCount || 0,
          publisher: info.publisher || '',
          publishedDate: info.publishedDate || '',
          totalCopies: 5,
          availableCopies: 5
        };
      });

      queryCache.set(cacheKey, parsedResults);
      return parsedResults;
    }
  } catch (error) {
    console.warn('Google Books API rate-limit/network notice (switching to curated fallback):', error.message);
  }

  // 2. If Google API is throttled or offline, seamlessly return matching offline books
  const fallbackMatches = searchOfflineFallbacks(cleanQuery);
  if (fallbackMatches.length > 0) {
    queryCache.set(cacheKey, fallbackMatches);
    return fallbackMatches;
  }

  // If no direct keyword match, return curated top fallback books
  const generalFallbacks = OFFLINE_FALLBACK_BOOKS.slice(0, 8);
  queryCache.set(cacheKey, generalFallbacks);
  return generalFallbacks;
};
