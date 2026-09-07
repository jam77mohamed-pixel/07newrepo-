export const INITIAL_BOOKS = [
  {
    id: 'b-1',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    isbn: '9780132350884',
    genre: 'Technology & Programming',
    totalCopies: 8,
    availableCopies: 5,
    coverImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?auto=format&fit=crop&q=80&w=400',
    description: 'Even bad code can function. But if code isn\'t clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code.',
    createdAt: '2025-01-10T10:00:00Z'
  },
  {
    id: 'b-2',
    title: 'The Pragmatic Programmer: Your Journey To Mastery',
    author: 'David Thomas, Andrew Hunt',
    isbn: '9780135957059',
    genre: 'Technology & Programming',
    totalCopies: 6,
    availableCopies: 3,
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400',
    description: 'The Pragmatic Programmer is one of those rare tech books you\'ll read, re-read, and read again over the years. Whether you\'re new to the field or an experienced practitioner, you\'ll come away with fresh insights.',
    createdAt: '2025-01-12T11:30:00Z'
  },
  {
    id: 'b-3',
    title: 'Dune',
    author: 'Frank Herbert',
    isbn: '9780441172719',
    genre: 'Science Fiction',
    totalCopies: 10,
    availableCopies: 7,
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400',
    description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the \'spice\' melange.',
    createdAt: '2025-01-15T09:15:00Z'
  },
  {
    id: 'b-4',
    title: 'Atomic Habits: An Easy & Proven Way to Build Good Habits',
    author: 'James Clear',
    isbn: '9780735211292',
    genre: 'Self-Help & Psychology',
    totalCopies: 12,
    availableCopies: 8,
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400',
    description: 'No matter your goals, Atomic Habits offers a proven framework for improving--every day. James Clear, one of the world\'s leading experts on habit formation, reveals practical strategies.',
    createdAt: '2025-01-18T14:20:00Z'
  },
  {
    id: 'b-5',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '9780061120084',
    genre: 'Classic Literature',
    totalCopies: 5,
    availableCopies: 2,
    coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400',
    description: 'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it, To Kill A Mockingbird became both an instant bestseller and a critical triumph.',
    createdAt: '2025-01-20T16:00:00Z'
  },
  {
    id: 'b-6',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    isbn: '9780062316097',
    genre: 'History',
    totalCopies: 7,
    availableCopies: 4,
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400',
    description: 'One hundred thousand years ago, at least six different species of humans inhabited Earth. Yet today there is only one—homo sapiens. What happened to the others? And what may happen to us?',
    createdAt: '2025-01-22T08:45:00Z'
  },
  {
    id: 'b-7',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    isbn: '9781449373320',
    genre: 'Technology & Programming',
    totalCopies: 5,
    availableCopies: 2,
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400',
    description: 'Data is at the center of many challenges in system design today. Difficult issues need to be figured out, such as scalability, consistency, reliability, efficiency, and maintainability.',
    createdAt: '2025-01-25T13:10:00Z'
  },
  {
    id: 'b-8',
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    isbn: '9781250301696',
    genre: 'Mystery & Thriller',
    totalCopies: 6,
    availableCopies: 4,
    coverImage: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400',
    description: 'Alicia Berenson’s life is seemingly perfect. A famous painter married to an in-demand fashion photographer, she lives in a grand house overlooking a park in London. Then one evening, she shoots her husband five times in the face and never speaks again.',
    createdAt: '2025-01-28T15:40:00Z'
  }
];

export const INITIAL_MEMBERS = [
  {
    id: 'm-1',
    name: 'Sarah Connor',
    email: 'sarah.connor@example.com',
    phone: '+1 (555) 234-5678',
    membershipId: 'LIB-2024-001',
    membershipDate: '2024-01-15',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'm-2',
    name: 'Alex Vance',
    email: 'alex.vance@example.com',
    phone: '+1 (555) 876-5432',
    membershipId: 'LIB-2024-002',
    membershipDate: '2024-02-10',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'm-3',
    name: 'Elena Rostova',
    email: 'elena.rostova@example.com',
    phone: '+1 (555) 345-6789',
    membershipId: 'LIB-2024-003',
    membershipDate: '2024-03-05',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'm-4',
    name: 'Marcus Brody',
    email: 'marcus.brody@example.com',
    phone: '+1 (555) 987-6543',
    membershipId: 'LIB-2024-004',
    membershipDate: '2024-03-20',
    status: 'Inactive',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'm-5',
    name: 'John Member (Current User)',
    email: 'member@library.com',
    phone: '+1 (555) 111-2233',
    membershipId: 'LIB-2024-005',
    membershipDate: '2024-01-01',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'
  }
];

export const INITIAL_BORROWS = [
  {
    id: 'br-1',
    bookId: 'b-1',
    bookTitle: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    bookIsbn: '9780132350884',
    memberId: 'm-5',
    memberName: 'John Member (Current User)',
    memberEmail: 'member@library.com',
    borrowDate: '2026-08-10',
    dueDate: '2026-08-24',
    returnDate: null,
    status: 'Overdue', // Overdue since today is after Aug 24
    finePaid: 0
  },
  {
    id: 'br-2',
    bookId: 'b-2',
    bookTitle: 'The Pragmatic Programmer: Your Journey To Mastery',
    bookIsbn: '9780135957059',
    memberId: 'm-1',
    memberName: 'Sarah Connor',
    memberEmail: 'sarah.connor@example.com',
    borrowDate: '2026-08-25',
    dueDate: '2026-09-08',
    returnDate: null,
    status: 'Borrowed',
    finePaid: 0
  },
  {
    id: 'br-3',
    bookId: 'b-3',
    bookTitle: 'Dune',
    bookIsbn: '9780441172719',
    memberId: 'm-2',
    memberName: 'Alex Vance',
    memberEmail: 'alex.vance@example.com',
    borrowDate: '2026-08-20',
    dueDate: '2026-09-03',
    returnDate: null,
    status: 'Borrowed',
    finePaid: 0
  },
  {
    id: 'br-4',
    bookId: 'b-5',
    bookTitle: 'To Kill a Mockingbird',
    bookIsbn: '9780061120084',
    memberId: 'm-3',
    memberName: 'Elena Rostova',
    memberEmail: 'elena.rostova@example.com',
    borrowDate: '2026-08-01',
    dueDate: '2026-08-15',
    returnDate: '2026-08-14',
    status: 'Returned',
    finePaid: 0
  },
  {
    id: 'br-5',
    bookId: 'b-7',
    bookTitle: 'Designing Data-Intensive Applications',
    bookIsbn: '9781449373320',
    memberId: 'm-5',
    memberName: 'John Member (Current User)',
    memberEmail: 'member@library.com',
    borrowDate: '2026-07-15',
    dueDate: '2026-07-29',
    returnDate: '2026-07-28',
    status: 'Returned',
    finePaid: 0
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Book Overdue Alert',
    message: 'John Member: "Clean Code" is past its return due date (Aug 24, 2026). Overdue fine applies.',
    type: 'overdue',
    createdAt: '2026-08-25T09:00:00Z',
    isRead: false,
    link: '/borrows'
  },
  {
    id: 'notif-2',
    title: 'Book Due Soon',
    message: 'Alex Vance: "Dune" is due for return in 2 days (Sep 03, 2026).',
    type: 'due_soon',
    createdAt: '2026-08-31T10:00:00Z',
    isRead: false,
    link: '/borrows'
  },
  {
    id: 'notif-3',
    title: 'New Book Added',
    message: '"The Silent Patient" was added to the library catalog.',
    type: 'new_book',
    createdAt: '2026-08-28T14:30:00Z',
    isRead: true,
    link: '/books'
  }
];
