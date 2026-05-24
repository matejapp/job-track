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
  return <p className="form-error">{message}</p>;
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

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit application" : "New application"}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="modal-body">
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="companyName" className="form-label">Company *</label>
              <input
                id="companyName"
                className="input-field"
                placeholder="e.g. Linear"
                {...register("companyName")}
              />
              <FieldError message={errors.companyName?.message} />
            </div>
            <div className="form-field">
              <label htmlFor="position" className="form-label">Role *</label>
              <input
                id="position"
                className="input-field"
                placeholder="e.g. Frontend Engineer"
                {...register("position")}
              />
              <FieldError message={errors.position?.message} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="status" className="form-label">Status *</label>
              <select id="status" className="input-field select" {...register("status")}>
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <FieldError message={errors.status?.message} />
            </div>
            <div className="form-field">
              <label htmlFor="dateApplied" className="form-label">Date applied *</label>
              <input
                id="dateApplied"
                type="date"
                className="input-field"
                {...register("dateApplied")}
              />
              <FieldError message={errors.dateApplied?.message} />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="applicationLink" className="form-label">Job posting URL *</label>
            <input
              id="applicationLink"
              type="url"
              className="input-field"
              placeholder="https://..."
              {...register("applicationLink")}
            />
            <FieldError message={errors.applicationLink?.message} />
          </div>

          <div className="form-field">
            <label htmlFor="description" className="form-label">Notes *</label>
            <textarea
              id="description"
              className="input-field textarea"
              rows={3}
              placeholder="Recruiter contact, interview notes, anything useful…"
              {...register("description")}
            />
            <FieldError message={errors.description?.message} />
          </div>
        </div>

        <div className="modal-foot">
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-dark btn-sm">
            {isEdit ? "Save changes" : "Add application"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
