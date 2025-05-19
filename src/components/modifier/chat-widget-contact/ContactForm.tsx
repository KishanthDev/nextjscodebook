'use client';
import { useState } from 'react';
import { z } from 'zod';
import { motion } from 'framer-motion';
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
            setIsSubmitted(true);
        }
    };

    return (
        <div className="p-4">
            {!isSubmitted && (
                <div className="mb-4 text-center">
                    <p className="text-lg font-semibold pb-3 text-gray-700 dark:text-gray-300">{settings.formMessage1 || 'Please fill in the form we will reach out'}</p>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{settings.formMessage2 || 'We are sorry our chat experts are busy right now'}</p>
                </div>
            )}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">{settings.formTitle || 'Contact Us'}</h3>
            <form onSubmit={handleFormSubmit} className="space-y-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        placeholder="Your Name"
                        className="w-full border rounded-lg px-3 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        disabled={isSaving || isSubmitted}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        placeholder="Your Email"
                        className="w-full border rounded-lg px-3 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        disabled={isSaving || isSubmitted}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subject:</label>
                    <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleFormChange}
                        placeholder="Subject"
                        className="w-full border rounded-lg px-3 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        disabled={isSaving || isSubmitted}
                    />
                    {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message:</label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleFormChange}
                        placeholder="Your Message"
                        rows={3}
                        className="w-full border rounded-lg px-3 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        disabled={isSaving || isSubmitted}
                    />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                </div>

                <div className="flex flex-col items-center justify-center mt-6 space-y-2">
                    <motion.button
                        type="submit"
                        disabled={isSaving || isSubmitted}
                        className={`rounded-full px-4 py-2 text-sm text-white flex items-center justify-center transition-all duration-300 ${isSubmitted ? 'bg-green-500 w-14 h-14' : 'bg-blue-500 w-full'
                            }`}
                        animate={{ width: isSubmitted ? '56px' : '100%' }}
                    >
                        {isSubmitted ? (
                            <motion.svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-7 w-7"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1.2 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 260,
                                    damping: 20,
                                    delay: 0.1,
                                }}
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </motion.svg>
                        ) : (
                            'Submit'
                        )}
                    </motion.button>

                    {/* Submitted Text */}
                    {isSubmitted && (
                        <motion.div
                            className="text-green-600 text-sm font-semibold"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.4 }}
                        >
                            Submitted!
                        </motion.div>
                    )}
                </div>

            </form>
        </div>
    );
}
