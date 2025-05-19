'use client';
import { useState } from 'react';
import { z } from 'zod';
import { ChatWidgetContactSettings } from '@/types/Modifier';

type Props = {
  settings: ChatWidgetContactSettings;
  isSaving: boolean;
};

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
});

export default function ContactForm({ settings, isSaving }: Props) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const result = formSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: FormData = { name: '', email: '', subject: '', message: '' };
      result.error.issues.forEach((issue) => {
        if (issue.path[0] in newErrors) {
          newErrors[issue.path[0] as keyof FormData] = issue.message;
        }
      });
      setErrors(newErrors);
      return false;
    }
    setErrors({ name: '', email: '', subject: '', message: '' });
    return true;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Contact Form Submitted:', formData);
      setIsSubmitted(true);
    }
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', subject: '', message: '' });
    setErrors({ name: '', email: '', subject: '', message: '' });
    setIsSubmitted(false);
  };

  return (
    <div className="p-4">
      {!isSubmitted && (
        <div className="mb-4 text-center">
          <p className="text-sm text-gray-700 dark:text-gray-300">Please fill in the form we will reach out</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">We are sorry our chat experts are busy right now</p>
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">{settings.formTitle || 'Contact Us'}</h3>
      {isSubmitted ? (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name:</label>
            <p className="px-3 py-1 text-gray-900 dark:text-gray-100">{formData.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email:</label>
            <p className="px-3 py-1 text-gray-900 dark:text-gray-100">{formData.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subject:</label>
            <p className="px-3 py-1 text-gray-900 dark:text-gray-100">{formData.subject}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message:</label>
            <p className="px-3 py-1 text-gray-900 dark:text-gray-100">{formData.message}</p>
          </div>
          <button
            onClick={handleReset}
            className="w-full px-4 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
          >
            Edit Form
          </button>
        </div>
      ) : (
        <form onSubmit={handleFormSubmit} className="space-y-3">
          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              placeholder="Your Name"
              className="w-full border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              disabled={isSaving}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              placeholder="Your Email"
              className="w-full border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              disabled={isSaving}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleFormChange}
              placeholder="Subject"
              className="w-full border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              disabled={isSaving}
            />
            {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
          </div>
          <div>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleFormChange}
              placeholder="Your Message"
              rows={3}
              className="w-full border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              disabled={isSaving}
            />
            {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full px-4 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center text-sm"
            disabled={isSaving}
          >
            <span>Submit</span>
          </button>
        </form>
      )}
      {isSubmitted && (
        <div className="mt-3 flex justify-center">
          <div className="flex items-center px-4 py-1.5 bg-green-500 text-white rounded-md animate-checkmark text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Submitted</span>
          </div>
        </div>
      )}
      <style jsx>{`
        @keyframes checkmark {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.5;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-checkmark {
          animation: checkmark 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}