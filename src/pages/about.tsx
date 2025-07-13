// pages/about.js
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import SEO from '../components/shared/SEO';
import Timeline from '../components/about/Timeline';
import ValuesCard from '../components/about/ValuesCard';
import Skillset from '../components/about/Skillset';
import { uniqueCitiesCount } from '@/data/speaking-events';

const AboutPage = () => {
    // Tab state for different sections
    const [activeTab, setActiveTab] = useState('journey');

    // Fun facts about me
    const funFacts = [
        "I'm passionate about building community-driven tech events 🎉",
        `I've spoken at conferences across ${uniqueCitiesCount}+ cities! 🌍`,
        "CrossFit certified & enthusiast 🏋️‍♂️",
        "I love contributing to open-source projects in my free time 💻",
        "I've helped hundreds of developers level up through mentorship 🚀",
        "I'm constantly exploring why the build works on my machine but nowhere else! 🤔"
    ];

    // My core values
    const coreValues = [
        {
            title: "Community Over Competition",
            description: "I believe in the power of tech communities to lift everyone up. By sharing knowledge freely and supporting others, we all grow stronger together.",
            icon: "🤝"
        },
        {
            title: "Continuous Learning",
            description: "The tech landscape evolves rapidly. I'm committed to always learning, experimenting with new technologies, and pushing my boundaries.",
            icon: "🧠"
        },
        {
            title: "Psychological Safety",
            description: "Creating environments where people feel safe to express ideas, make mistakes, and be themselves is essential for innovation and growth.",
            icon: "🛡️"
        },
        {
            title: "Technical Excellence",
            description: "I strive for code that's not just functional, but maintainable, scalable, and performant. Quality matters in everything I build.",
            icon: "⚙️"
        },
        {
            title: "Inclusive Leadership",
            description: "Great teams thrive when everyone feels valued and heard. I work to create space for diverse perspectives and talents.",
            icon: "🌈"
        },
        {
            title: "Work-Life Integration",
            description: "I believe in building a career that complements life, not competes with it. Balance keeps us creative and prevents burnout.",
            icon: "⚖️"
        }
    ];

    return (
        <>
            <SEO
                title="About Faris Aziz | My Journey, Values & Expertise"
                description="Learn about my journey as a frontend engineering leader, my core values, technical expertise, and what drives me to build community-focused tech initiatives."
                keywords="engineering leadership, frontend expert, tech community, software engineering, career journey, technical leadership, mentorship, NextJS expert"
                pathname="/about"
            />
            
            <Layout>
                {/* Hero Section */}
                <div className="bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-900 py-16 md:py-24">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col lg:flex-row items-center gap-12 max-w-6xl mx-auto">
                            {/* Profile Image */}
                            <motion.div
                                className="lg:w-1/3"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
                                    <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl">
                                        <Image
                                            src="/images/profile.jpg"
                                            alt="Faris Aziz"
                                            fill
                                            className="object-cover"
                                            priority
                                        />
                                    </div>

                                    {/* Decorative elements */}
                                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full z-0"></div>
                                    <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full z-0"></div>
                                </div>
                            </motion.div>

                            {/* Bio Content */}
                            <motion.div
                                className="lg:w-2/3 text-center lg:text-left"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-4">
                                    Hey there, tech enthusiasts! 👋
                                </span>
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                                    I&apos;m Faris Aziz
                                </h1>
                                <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto lg:mx-0">
                                    A passionate Frontend Engineer, Conference Speaker, and Community Builder who loves creating exceptional web experiences and sharing knowledge with others!
                                </p>
                                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                                    <Link href="/speaking" legacyBehavior>
                                        <motion.a
                                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            My Talks & Workshops
                                        </motion.a>
                                    </Link>
                                    <Link href="/contact" legacyBehavior>
                                        <motion.a
                                            className="px-6 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg font-medium"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Let&apos;s Connect!
                                        </motion.a>
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Main Content with Tabs */}
                <div className="container mx-auto px-6 py-16">
                    {/* Tab Navigation */}
                    <div className="mb-8 sm:mb-12">
                        {/* Grid on mobile, centered horizontal on desktop */}
                        <div className="w-full px-4 sm:px-0 flex justify-center">
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-md grid grid-cols-2 sm:inline-flex gap-1">
                                {[
                                    { id: 'journey', label: 'My Journey' },
                                    { id: 'values', label: 'Core Values' },
                                    { id: 'skills', label: 'Skillset' },
                                    { id: 'fun', label: 'Fun Facts' }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-3 sm:px-5 py-2.5 rounded-md text-sm font-medium transition-colors ${
                                            activeTab === tab.id
                                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="max-w-5xl mx-auto">
                        {/* My Journey Section */}
                        {activeTab === 'journey' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="text-center mb-12">
                                    <h2 className="text-3xl font-bold mb-4">My Journey So Far 🚀</h2>
                                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                                        From my first lines of code to building systems used by millions, here&apos;s the story of my career in tech and how I became passionate about frontend development and community building.
                                    </p>
                                </div>

                                <Timeline />

                            </motion.div>
                        )}

                        {/* Core Values Section */}
                        {activeTab === 'values' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="text-center mb-12">
                                    <h2 className="text-3xl font-bold mb-4">Core Values That Drive Me 💫</h2>
                                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                                        These principles guide my approach to engineering, leadership, and community building. They represent what I stand for both professionally and personally.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {coreValues.map((value, index) => (
                                        <ValuesCard
                                            key={index}
                                            title={value.title}
                                            description={value.description}
                                            icon={value.icon}
                                            index={index}
                                        />
                                    ))}
                                </div>

                                <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <h3 className="text-xl font-bold mb-3">Community Mission Statement 🌟</h3>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        I&apos;m committed to fostering an inclusive tech community where knowledge is freely shared, newcomers feel welcome, and everyone has the opportunity to grow. Through ZurichJS and my speaking engagements, I aim to break down barriers in tech education and connect passionate developers worldwide.
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* Skills Section */}
                        {activeTab === 'skills' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="text-center mb-12">
                                    <h2 className="text-3xl font-bold mb-4">My Skillset 🧰</h2>
                                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                                        Here&apos;s where my expertise shines! From frontend frameworks to engineering leadership, these are the skills I&apos;ve honed throughout my career.
                                    </p>
                                </div>

                                <Skillset />

                                <div className="mt-16 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                                    <h3 className="text-xl font-bold mb-6 text-center">Achievement Highlights 🏆</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {[
                                            {
                                                title: "Engineering Leadership",
                                                description: "Developed and established career progression frameworks for engineering teams at Navro, helping dozens of engineers grow their careers."
                                            },
                                            {
                                                title: "Performance Optimization",
                                                description: "Redesigned data fetching, aggregation and caching mechanisms that yielded up to a 90% performance improvement on the frontend for some products."
                                            },
                                            {
                                                title: "Community Building",
                                                description: "Founded ZurichJS, building a thriving community of JS enthusiasts in Switzerland."
                                            },
                                            {
                                                title: "International Speaker",
                                                description: `Delivered talks and workshops at several conferences across ${uniqueCitiesCount}+ cities, sharing technical knowledge with thousands of developers.`
                                            },
                                        ].map((achievement, index) => (
                                            <motion.div
                                                key={index}
                                                className="border-l-4 border-blue-500 pl-4 py-2"
                                                initial={{ opacity: 0, x: -10 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                            >
                                                <h4 className="font-bold text-lg mb-1">{achievement.title}</h4>
                                                <p className="text-gray-600 dark:text-gray-300">{achievement.description}</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Fun Facts Section */}
                        {activeTab === 'fun' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="text-center"
                            >
                                <div className="mb-12">
                                    <h2 className="text-3xl font-bold mb-4">Fun Facts About Me 😄</h2>
                                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                                        Beyond code and conferences, here are some things that make me who I am!
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                                    {funFacts.map((fact, index) => (
                                        <motion.div
                                            key={index}
                                            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                                        >
                                            <div className="text-4xl mr-4">{fact.split(' ').pop()}</div>
                                            <p className="text-left">{fact}</p>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="mt-16 max-w-3xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-8">
                                    <h3 className="text-2xl font-bold mb-4">Community Spotlight! 🌟</h3>
                                    <p className="text-lg mb-6">
                                        I&apos;m super excited about our next ZurichJS meetup! We&apos;ve got amazing speakers, awesome networking, and plenty of pizza! 🍕
                                    </p>
                                    <a
                                        href="https://zurichjs.com?utm_source=personal-site&utm_medium=contact-link&utm_campaign=js-community-2025"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                                    >
                                        Join Our Next Event
                                    </a>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Call to Action */}
                <div className="bg-blue-50 dark:bg-blue-900/20 py-16">
                    <div className="container mx-auto px-6 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="text-3xl font-bold mb-6">Let&apos;s Build Something Amazing Together! 🚀</h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
                                Whether you&apos;re looking for a speaker, mentor, collaborator, or just want to connect with a fellow tech enthusiast, I&apos;d love to hear from you!
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <Link href="/contact" legacyBehavior>
                                    <motion.a
                                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Get in Touch
                                    </motion.a>
                                </Link>
                                <Link href="/speaking" legacyBehavior>
                                    <motion.a
                                        className="px-6 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg font-medium"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Invite Me to Speak
                                    </motion.a>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default AboutPage;