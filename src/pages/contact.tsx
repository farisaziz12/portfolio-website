// pages/contact.js
import { useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import { sendPushoverNotification } from '@/utils/pushover';

const ContactPage = () => {
    // Form state
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: 'general' // Default contact type
    });

    // Form submission state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Refs for form elements
    const formRef = useRef(null);

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // Send Pushover notification
            await sendPushoverNotification({
                title: `New Contact Form Submission: ${formState.subject}`,
                message: `
                Name: ${formState.name}
                Email: ${formState.email}
                Type: ${formState.type}
                Message: ${formState.message}
                `.trim(),
                        priority: 1
                });

            // Reset form
            setFormState({
                name: '',
                email: '',
                subject: '',
                message: '',
                type: 'general'
            });

            // Show success message
            setSubmitted(true);
        } catch (error) {
            console.error('Error submitting form:', error);
            setError('Oops! Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout>
            <Head>
                <title>Get in Touch | Faris Aziz</title>
                <meta
                    name="description"
                    content="Connect with Faris Aziz - Frontend Engineer and Conference Speaker. Let's talk about frontend development, speaking opportunities, or tech communities!"
                />
            </Head>

            <div className="bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-900 py-16 md:py-24">
                <div className="container mx-auto px-6">
                    <motion.div
                        className="max-w-4xl mx-auto text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-4">
                            Let&apos;s Connect!
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Get in Touch 👋
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Whether you&apos;re interested in working together, inviting me to speak at your event, or just want to say hello, I&apos;d love to hear from you! Let&apos;s make something awesome together!
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                        {/* Contact Form */}
                        <motion.div
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            {submitted ? (
                                <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
                                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Message Sent! 🎉</h3>
                                    <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                                        Thanks for reaching out! I&apos;ll get back to you as soon as possible.
                                    </p>
                                    <motion.button
                                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setSubmitted(false)}
                                    >
                                        Send Another Message
                                    </motion.button>
                                </div>
                            ) : (
                                <form ref={formRef} onSubmit={handleSubmit} className="p-8">
                                    <h2 className="text-2xl font-bold mb-6">Drop Me a Message</h2>

                                    {/* Contact Type Selection */}
                                    <div className="mb-6">
                                        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                                            What&apos;s this about? 💬
                                        </label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {[
                                                { value: 'general', label: 'Just Saying Hello' },
                                                { value: 'work', label: 'Work Opportunity' },
                                                { value: 'speaking', label: 'Speaking Inquiry' },
                                                { value: 'community', label: 'Community Collab' }
                                            ].map((option) => (
                                                <div key={option.value} className="relative">
                                                    <input
                                                        type="radio"
                                                        name="type"
                                                        id={`type-${option.value}`}
                                                        value={option.value}
                                                        className="sr-only"
                                                        onChange={handleChange}
                                                        checked={formState.type === option.value}
                                                    />
                                                    <label
                                                        htmlFor={`type-${option.value}`}
                                                        className={`block w-full px-4 py-3 text-center border rounded-lg cursor-pointer transition-colors ${formState.type === option.value
                                                                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-300'
                                                                : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                                                            }`}
                                                    >
                                                        {option.label}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Name Field */}
                                    <div className="mb-6">
                                        <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                                            Your Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formState.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                            placeholder="Jane Smith"
                                        />
                                    </div>

                                    {/* Email Field */}
                                    <div className="mb-6">
                                        <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                                            Your Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formState.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                            placeholder="jane@example.com"
                                        />
                                    </div>

                                    {/* Subject Field */}
                                    <div className="mb-6">
                                        <label htmlFor="subject" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                                            Subject
                                        </label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            value={formState.subject}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                            placeholder="How can I help you?"
                                        />
                                    </div>

                                    {/* Message Field */}
                                    <div className="mb-6">
                                        <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                                            Your Message
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formState.message}
                                            onChange={handleChange}
                                            required
                                            rows={5}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
                                            placeholder="Hey Faris! I'd love to chat about..."
                                        ></textarea>
                                    </div>

                                    {/* Error Message */}
                                    {error && (
                                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
                                            {error}
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <motion.button
                                        type="submit"
                                        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Sending...
                                            </>
                                        ) : (
                                            'Send Message ✨'
                                        )}
                                    </motion.button>
                                </form>
                            )}
                        </motion.div>

                        {/* Contact Info & Community Section */}
                        <motion.div
                            className="space-y-8"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            {/* Contact Info */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                                <h2 className="text-2xl font-bold mb-6">Connect With Me</h2>

                                <div className="space-y-4">
                                    <a
                                        href="mailto:faris@zurichjs.com"
                                        className="flex items-start hover:bg-blue-50 dark:hover:bg-blue-900/20 p-3 rounded-lg transition-colors"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="font-medium">Email</h3>
                                            <p className="text-gray-600 dark:text-gray-300">faris@zurichjs.com</p>
                                        </div>
                                    </a>

                                    <a
                                        href="https://linkedin.com/in/farisaziz12"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-start hover:bg-blue-50 dark:hover:bg-blue-900/20 p-3 rounded-lg transition-colors"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                                            <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="font-medium">LinkedIn</h3>
                                            <p className="text-gray-600 dark:text-gray-300">linkedin.com/in/farisaziz12</p>
                                        </div>
                                    </a>

                                    <a
                                        href="https://github.com/farisaziz12"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-start hover:bg-blue-50 dark:hover:bg-blue-900/20 p-3 rounded-lg transition-colors"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                                            <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="font-medium">GitHub</h3>
                                            <p className="text-gray-600 dark:text-gray-300">github.com/farisaziz12</p>
                                        </div>
                                    </a>
                                </div>
                            </div>

                            {/* Community Highlight */}
                            <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 rounded-xl shadow-lg p-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 dark:bg-blue-800/50 rounded-bl-full -mt-8 -mr-8 opacity-70"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-200 dark:bg-purple-800/50 rounded-tr-full -mb-6 -ml-6 opacity-70"></div>

                                <div className="relative z-10">
                                    <h2 className="text-2xl font-bold mb-2">Join our Tech Community! 🚀</h2>
                                    <p className="mb-6 text-gray-700 dark:text-gray-200">
                                        Hey JavaScript lovers! I run the ZurichJS meetup - the hottest tech community in the Swiss German region. We&apos;re always looking for speakers, sponsors, and awesome new members!
                                    </p>

                                    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg p-4 mb-6">
                                        <div>
                                            <div className="flex items-center mb-2">
                                                <div className="mr-3 text-blue-500">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <h3 className="font-medium">ZurichJS Regular Meetups</h3>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 ml-11">
                                                Join our thriving JavaScript community for tech talks, networking, and knowledge sharing!
                                            </p>
                                        </div>
                                    </div>

                                    <a
                                        href="https://zurichjs.com?utm_source=personal-site&utm_medium=contact-link&utm_campaign=js-community-2025"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                                    >
                                        <span>Visit ZurichJS</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </a>
                                </div>
                            </div>

                            {/* Speaking CTA */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                                <h2 className="text-2xl font-bold mb-4">Invite Me to Speak! 🎤</h2>
                                <p className="text-gray-600 dark:text-gray-300 mb-6">
                                    Looking for a speaker for your next tech event? I&apos;d love to share insights on frontend development, engineering leadership, or building scalable systems!
                                </p>
                                <Link href="/speaking" legacyBehavior>
                                    <motion.a
                                        className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700"
                                        whileHover={{ x: 5 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    >
                                        View my speaking experience
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </motion.a>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="container mx-auto px-6 py-16">
                <div className="max-w-3xl mx-auto">
                    <motion.h2
                        className="text-3xl font-bold text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        Frequently Asked Questions
                    </motion.h2>

                    <div className="space-y-6">
                        {[
                            {
                                question: "What's the best way to contact you for speaking opportunities?",
                                answer: "The contact form above is perfect for speaking inquiries! Just select 'Speaking Inquiry' option, and I'll get back to you quickly. For urgent requests, you can also reach out directly via email, LinkedIn or even better, come to ZurichJS meetup and say hi!"
                            },
                            {
                                question: "Do you offer mentorship or consulting services?",
                                answer: "Yes! I'm currently mentoring through platforms like MentorCruise. I also offer consulting services for NextJS implementations, frontend architecture, and engineering team structures."
                            },
                            {
                                question: "How can I join ZurichJS?",
                                answer: "ZurichJS is open to everyone interested in JavaScript and web development! Visit zurichjs.com for upcoming events, and join our community Meetup.com to stay connected with fellow JS enthusiasts!"
                            },
                            {
                                question: "What technologies are you currently excited about?",
                                answer: "I'm currently diving deep into frontend observability, React Codebase Architecture, and exploring new ways to improve user experience through platform resilience. Always happy to chat about these topics!"
                            }
                        ].map((faq, index) => (
                            <motion.div
                                key={index}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                            >
                                <h3 className="text-xl font-bold mb-3">{faq.question}</h3>
                                <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ContactPage;