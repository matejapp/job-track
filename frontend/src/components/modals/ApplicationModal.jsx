import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "../ui/Modal";
import { STATUSES } from "../../constants/statuses";
import {
  emptyJobApplicationForm,
  jobApplicationSchema,
  toJobApplicationForm,
} from "../../validation/jobApplicationSchema";

function FieldError({ message }) {
  if (!message) return null;

  return <p className="mt-1 text-xs font-medium text-red-500">{message}</p>;
}

export default function ApplicationModal({ open, onClose, onSubmit, app }) {
  const isEdit = !!app;
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm({
    defaultValues: emptyJobApplicationForm(),
    resolver: zodResolver(jobApplicationSchema),
  });

  useEffect(() => {
    if (!open) return;
    reset(app ? toJobApplicationForm(app) : emptyJobApplicationForm());
  }, [app, open, reset]);

  const submitForm = (values) => {
    onSubmit(values);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Application" : "New Application"}
    >
      <form onSubmit={handleSubmit(submitForm)} className="space-y-4" noValidate>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="companyName"
              className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5"
            >
              Company Name *
            </label>
            <input
              id="companyName"
              className="input-field"
              placeholder="e.g. Google"
              {...register("companyName")}
            />
            <FieldError message={errors.companyName?.message} />
          </div>
          <div>
            <label
              htmlFor="position"
              className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5"
            >
              Position *
            </label>
            <input
              id="position"
              className="input-field"
              placeholder="e.g. UX Designer"
              {...register("position")}
            />
            <FieldError message={errors.position?.message} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="status"
              className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5"
            >
              Status *
            </label>
            <select id="status" className="input-field" {...register("status")}>
              {STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <FieldError message={errors.status?.message} />
          </div>
          <div>
            <label
              htmlFor="dateApplied"
              className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5"
            >
              Date Applied *
            </label>
            <input
              id="dateApplied"
              type="date"
              className="input-field"
              {...register("dateApplied")}
            />
            <FieldError message={errors.dateApplied?.message} />
          </div>
        </div>

        <div>
          <label
            htmlFor="applicationLink"
            className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5"
          >
            Application Link *
          </label>
          <input
            id="applicationLink"
            type="url"
            className="input-field"
            placeholder="https://..."
            {...register("applicationLink")}
          />
          <FieldError message={errors.applicationLink?.message} />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5"
          >
            Notes *
          </label>
          <textarea
            id="description"
            className="input-field resize-none"
            rows={3}
            placeholder="Recruiter contact, interview notes, anything useful..."
            {...register("description")}
          />
          <FieldError message={errors.description?.message} />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            {isEdit ? "Save Changes" : "Add Application"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
