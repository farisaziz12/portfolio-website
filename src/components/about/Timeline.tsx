// components/about/Timeline.js
import { motion } from 'framer-motion';
const Timeline = () => {
    // Updated timeline events with more detailed career progression
    const timelineEvents = [
        {
            year: "2024-Present",
            title: "Staff Frontend Engineer at Smallpdf",
            description: "Joined Smallpdf as a Staff Frontend Engineer, bringing engineering leadership and technical expertise to a platform used by millions of users worldwide.",
            highlight: "Excited to tackle new challenges in the monetization space and contribute to a product that helps people work smarter with documents! 📄✨",
            icon: "🚀",
            color: "bg-blue-100 dark:bg-blue-900/30",
            textColor: "text-blue-700 dark:text-blue-300"
        },
        {
            year: "2024",
            title: "Founding ZurichJS",
            description: "Started the ZurichJS meetup to build a vibrant JS community in the Swiss German region. Also joined Bletchley Institute as a Technical Mentor for Software Engineering.",
            highlight: "Building an awesome tech community where JS enthusiasts can connect, learn, and grow together! 🇨🇭",
            icon: "👨‍💻",
            color: "bg-purple-100 dark:bg-purple-900/30",
            textColor: "text-purple-700 dark:text-purple-300"
        },
        {
            year: "2023-2024",
            title: "Engineering Manager at Navro",
            description: "Promoted to Engineering Manager, overseeing both frontend and backend teams. Responsible for team growth, performance management, and engineering excellence.",
            highlight: "Led a growing engineering team through a critical company rebrand and product evolution! 🚀",
            icon: "👨‍💼",
            color: "bg-green-100 dark:bg-green-900/30",
            textColor: "text-green-700 dark:text-green-300"
        },
        {
            year: "2023",
            title: "Frontend Engineering Lead at Navro",
            description: "Promoted to Lead Frontend Engineer, guiding the frontend team and architectural decisions while managing engineers with varying levels of experience.",
            highlight: "Lead the frontend team at Navro! 🛠️",
            icon: "🧩",
            color: "bg-indigo-100 dark:bg-indigo-900/30",
            textColor: "text-indigo-700 dark:text-indigo-300"
        },
        {
            year: "2022-2023",
            title: "Senior Frontend Engineer at Navro (formerly Paytrix)",
            description: "Joined as the founding Senior Frontend Engineer, establishing the foundation for the frontend architecture and leading critical feature development.",
            highlight: "First member of the engineering team! Built the API docs platform and helped shape the company's technical direction! 💪",
            icon: "⚙️",
            color: "bg-amber-100 dark:bg-amber-900/30",
            textColor: "text-amber-700 dark:text-amber-300"
        },
        {
            year: "2022",
            title: "Mentorship Journey Begins",
            description: "Started mentoring aspiring developers through MentorCruise and later adplist.org. Helping the next generation level up their skills!",
            highlight: "Discovered the joy of helping others grow in their tech careers! ✨",
            icon: "👨‍🏫",
            color: "bg-teal-100 dark:bg-teal-900/30",
            textColor: "text-teal-700 dark:text-teal-300"
        },
        {
            year: "2021-2022",
            title: "Software Engineer at Fiit",
            description: "Worked at the #1 rated workout app, improving website performance and user experience. Led investigations to devise upgrade strategies.",
            highlight: "A marriage of my love for fitness and coding! ⚡",
            icon: "💪",
            color: "bg-red-100 dark:bg-red-900/30",
            textColor: "text-red-700 dark:text-red-300"
        },
        {
            year: "2021",
            title: "Open Source Contributor at Raycast",
            description: "Developed several high-quality extensions for the Raycast App Store, including Growthbook, Coinbase Pro, and Everhour Time Tracking integrations.",
            highlight: "Fell in love with open source and helping developers boost productivity! 🛠️",
            icon: "⌨️",
            color: "bg-yellow-100 dark:bg-yellow-900/30",
            textColor: "text-yellow-700 dark:text-yellow-300"
        },
        {
            year: "2020-2021",
            title: "Junior Frontend Developer at FX Digital",
            description: "Developed Connected TV applications for brands like Discovery+, Eurosport, and GCN. Focused on accessibility and user experience.",
            highlight: "First pro dev role! Worked on apps used by millions of viewers worldwide! 📺",
            icon: "📱",
            color: "bg-blue-100 dark:bg-blue-900/30",
            textColor: "text-blue-700 dark:text-blue-300"
        },
        {
            year: "2020",
            title: "Founded WOD-WITH-ME",
            description: "Created an all-in-one SaaS platform for fitness coaches to manage class schedules, payments, and bookings.",
            highlight: "My first major product! Combining my passion for fitness and coding! 💻",
            icon: "🏋️",
            color: "bg-orange-100 dark:bg-orange-900/30",
            textColor: "text-orange-700 dark:text-orange-300"
        },
        {
            year: "2019-2020",
            title: "Studied at Flatiron School",
            description: "Completed intensive Full Stack Web Development bootcamp, learning modern web technologies and best practices.",
            highlight: "The beginning of my coding journey! Discovered my passion for frontend! 🎓",
            icon: "📚",
            color: "bg-purple-100 dark:bg-purple-900/30",
            textColor: "text-purple-700 dark:text-purple-300"
        },
        {
            year: "2016-2020",
            title: "CrossFit Instructor & Athlete",
            description: "Led group classes and personal training sessions, helping clients achieve their fitness goals.",
            highlight: "Developed coaching and leadership skills that would later help in tech mentoring! 🏆",
            icon: "🏅",
            color: "bg-pink-100 dark:bg-pink-900/30",
            textColor: "text-pink-700 dark:text-pink-300"
        }
    ];

    return (
        <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-1 bg-blue-200 dark:bg-blue-800/50"></div>

            {/* Timeline Events */}
            <div className="space-y-12">
                {timelineEvents.map((event, index) => (
                    <motion.div
                        key={index}
                        className="relative flex flex-col md:flex-row items-start"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        {/* Left Side (for desktop) - either content or empty */}
                        <div className="hidden md:block md:w-1/2 md:pr-12 text-right">
                            {index % 2 === 0 ? (
                                <div>
                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-1 ${event.color} ${event.textColor}`}>
                                        {event.year}
                                    </span>
                                    <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                                        {event.description}
                                    </p>
                                    <p className={`text-sm font-medium ${event.textColor}`}>
                                        {event.highlight}
                                    </p>
                                </div>
                            ) : null}
                        </div>

                        {/* Timeline Node */}
                        <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 mt-1 z-10">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md ${event.color}`}>
                                <span className="text-lg">{event.icon}</span>
                            </div>
                        </div>

                        {/* Mobile Year (only visible on mobile) */}
                        <div className="md:hidden pl-16 mb-2">
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${event.color} ${event.textColor}`}>
                                {event.year}
                            </span>
                        </div>

                        {/* Right Side (for desktop) or Main Content (for mobile) */}
                        <div className={`pl-16 md:w-1/2 md:pl-12 ${index % 2 === 0 ? 'md:mt-0' : 'md:mt-0'}`}>
                            {/* Show on mobile or on right side of desktop */}
                            {index % 2 !== 0 || window.innerWidth < 768 ? (
                                <div>
                                    <h3 className="text-xl font-bold mb-2 md:hidden">{event.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-300 mb-2 md:hidden">
                                        {event.description}
                                    </p>
                                    <p className={`text-sm font-medium ${event.textColor} md:hidden`}>
                                        {event.highlight}
                                    </p>
                                </div>
                            ) : null}

                            {/* Desktop right side content */}
                            {index % 2 !== 0 ? (
                                <div className="hidden md:block">
                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-1 ${event.color} ${event.textColor}`}>
                                        {event.year}
                                    </span>
                                    <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                                        {event.description}
                                    </p>
                                    <p className={`text-sm font-medium ${event.textColor}`}>
                                        {event.highlight}
                                    </p>
                                </div>
                            ) : null}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Timeline Start */}
            <motion.div
                className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 -bottom-16 z-10"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
            </motion.div>
        </div>
    );
};

export default Timeline;