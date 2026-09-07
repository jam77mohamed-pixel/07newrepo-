import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { memberSchema } from '../../utils/validationSchemas';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { FiSave, FiUserPlus } from 'react-icons/fi';

export const MemberFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  loading = false
}) => {
  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(memberSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      membershipId: `LIB-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      membershipDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        membershipId: initialData.membershipId || '',
        membershipDate: initialData.membershipDate || new Date().toISOString().split('T')[0],
        status: initialData.status || 'Active'
      });
    } else {
      reset({
        name: '',
        email: '',
        phone: '',
        membershipId: `LIB-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        membershipDate: new Date().toISOString().split('T')[0],
        status: 'Active'
      });
    }
  }, [initialData, reset, isOpen]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Member Profile' : 'Register New Member'}
      subtitle={
        isEdit
          ? 'Update the membership profile and contact information'
          : 'Create a new patron account to issue library books'
      }
      size="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          placeholder="e.g. Eleanor Vance"
          {...register('name')}
          error={errors.name?.message}
          required
        />

        <Input
          type="email"
          label="Email Address"
          placeholder="e.g. eleanor.vance@example.com"
          {...register('email')}
          error={errors.email?.message}
          required
        />

        <Input
          label="Phone Number"
          placeholder="e.g. +1 (555) 019-2834"
          {...register('phone')}
          error={errors.phone?.message}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Membership ID"
            placeholder="e.g. LIB-2025-104"
            {...register('membershipId')}
            error={errors.membershipId?.message}
            required
          />

          <Input
            type="date"
            label="Membership Start Date"
            {...register('membershipDate')}
            error={errors.membershipDate?.message}
            required
          />
        </div>

        <Select
          label="Membership Status"
          options={[
            { label: 'Active (Can borrow books)', value: 'Active' },
            { label: 'Inactive (Restricted)', value: 'Inactive' }
          ]}
          {...register('status')}
          error={errors.status?.message}
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
            icon={isEdit ? FiSave : FiUserPlus}
          >
            {isEdit ? 'Update Member' : 'Register Member'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
