import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email address is required')
    .email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
});

export const registerSchema = yup.object().shape({
  name: yup
    .string()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: yup
    .string()
    .required('Email address is required')
    .email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  role: yup
    .string()
    .required('Role is required')
    .oneOf(['Admin', 'Member'], 'Select a valid role')
});

export const bookSchema = yup.object().shape({
  title: yup
    .string()
    .required('Book title is required')
    .min(2, 'Title must be at least 2 characters'),
  author: yup
    .string()
    .required('Author name is required'),
  isbn: yup
    .string()
    .required('ISBN is required')
    .matches(/^[0-9-]{10,17}$/, 'ISBN must be 10-13 digits (hyphens allowed)'),
  genre: yup
    .string()
    .required('Please select a category/genre'),
  totalCopies: yup
    .number()
    .typeError('Total copies must be a number')
    .required('Total copies is required')
    .min(1, 'Total copies must be at least 1')
    .integer('Must be a whole number'),
  availableCopies: yup
    .number()
    .typeError('Available copies must be a number')
    .required('Available copies is required')
    .min(0, 'Available copies cannot be negative')
    .test('copies-check', 'Available copies cannot exceed total copies', function (value) {
      const { totalCopies } = this.parent;
      return value <= totalCopies;
    })
    .integer('Must be a whole number'),
  coverImage: yup
    .string()
    .url('Cover image must be a valid URL')
    .nullable()
    .transform((value) => (value === '' ? null : value)),
  description: yup
    .string()
    .required('Description is required')
    .min(10, 'Description should be at least 10 characters')
});

export const memberSchema = yup.object().shape({
  name: yup
    .string()
    .required('Member name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  phone: yup
    .string()
    .required('Phone number is required')
    .min(7, 'Enter a valid phone number'),
  membershipId: yup
    .string()
    .required('Membership ID is required'),
  membershipDate: yup
    .string()
    .required('Membership date is required'),
  status: yup
    .string()
    .required('Status is required')
    .oneOf(['Active', 'Inactive'])
});

export const issueBookSchema = yup.object().shape({
  bookId: yup
    .string()
    .required('Please select a book to issue'),
  memberId: yup
    .string()
    .required('Please select a member'),
  dueDate: yup
    .string()
    .required('Return due date is required')
});
