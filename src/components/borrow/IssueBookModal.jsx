import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { issueBookSchema } from '../../utils/validationSchemas';
import { Modal } from '../common/Modal';
import { Select } from '../common/Select';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useBooks } from '../../context/BookContext';
import { useMembers } from '../../context/MemberContext';
import dayjs from 'dayjs';
import { FiBookOpen } from 'react-icons/fi';

export const IssueBookModal = ({
  isOpen,
  onClose,
  onSubmit,
  preselectedBook = null,
  loading = false
}) => {
  const { books } = useBooks();
  const { members } = useMembers();

  // Auto-calculate standard 14 days due date
  const defaultDueDate = dayjs().add(14, 'day').format('YYYY-MM-DD');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(issueBookSchema),
    defaultValues: {
      bookId: '',
      memberId: '',
      dueDate: defaultDueDate
    }
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        bookId: preselectedBook?.id || '',
        memberId: '',
        dueDate: defaultDueDate
      });
    }
  }, [isOpen, preselectedBook, defaultDueDate, reset]);

  // Available books with copies > 0
  const availableBookOptions = books
    .filter((b) => Number(b.availableCopies) > 0 || (preselectedBook && b.id === preselectedBook.id))
    .map((b) => ({
      value: b.id,
      label: `${b.title} (${b.availableCopies} available)`
    }));

  // Active members only
  const activeMemberOptions = members
    .filter((m) => m.status === 'Active')
    .map((m) => ({
      value: m.id,
      label: `${m.name} (${m.membershipId}) - ${m.email}`
    }));

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Issue Book to Member"
      subtitle="Select a book and an active member to record a new loan"
      size="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Select
          label="Select Book"
          placeholder="Choose a book from inventory"
          options={availableBookOptions}
          {...register('bookId')}
          error={errors.bookId?.message}
          required
        />

        <Select
          label="Select Active Member"
          placeholder="Choose an active library member"
          options={activeMemberOptions}
          {...register('memberId')}
          error={errors.memberId?.message}
          required
        />

        <Input
          type="date"
          label="Return Due Date"
          helperText="Default loan period is 14 days (can be customized)"
          {...register('dueDate')}
          error={errors.dueDate?.message}
          required
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            icon={FiBookOpen}
          >
            Confirm Issue
          </Button>
        </div>
      </form>
    </Modal>
  );
};
