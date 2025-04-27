import React from "react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MusicNotes from "@/components/MusicNotes";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";

export default function LandingPage() {
  const [showVideo, setShowVideo] = useState(false);
  return (
    <div className="min-h-screen font-sans text-white bg-black">
      <MusicNotes />
      <Navbar />
      {/* YouTube Video Modal */}
      {showVideo && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="relative w-full max-w-4xl mx-4"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <button
              onClick={() => setShowVideo(false)}
              className="absolute -top-12 right-0 p-2 text-gray-300 hover:text-white transition"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>

            <div className="aspect-video bg-black">
              <iframe
                src="https://www.youtube.com/embed/J1OC_uqqYnw?autoplay=1&modestbranding=1&rel=0"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </motion.div>
        </motion.div>
      )}
      <main>
        {/* Hero section */}
        <section className="pt-32 pb-20 px-4">
          <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              <motion.div
                className="w-full lg:w-1/2 space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  <motion.span
                    className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  >
                    Generate Fire Rap Lyrics
                  </motion.span>
                  <span> in Seconds</span>
                </h1>
                <p className="text-xl text-gray-300">
                  Drop beats, not sweat. Let AI write your next chart-topping
                  rap verse with just a few clicks.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link href="/auth">
                    <motion.div
                      className="relative group"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-500"></div>
                      <Button className="relative px-8 py-7 bg-black text-white rounded-lg text-lg font-semibold flex items-center gap-2">
                        Try Now <i className="ri-arrow-right-line"></i>
                      </Button>
                    </motion.div>
                  </Link>
                  <Button
                    variant="outline"
                    className="px-8 py-7 bg-gray-900/50 hover:bg-gray-800 text-white rounded-lg text-lg font-semibold transition flex items-center justify-center gap-2"
                    onClick={() => setShowVideo(true)} // Add this
                  >
                    <i className="ri-play-circle-line"></i> See How It Works
                  </Button>
                </div>
              </motion.div>
              <motion.div
                className="w-full lg:w-1/2 flex justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="relative w-full max-w-md">
                  <motion.div
                    className="rounded-xl overflow-hidden"
                    animate={{
                      boxShadow: [
                        "0 0 0 rgba(109, 40, 217, 0)",
                        "0 0 20px rgba(109, 40, 217, 0.5)",
                        "0 0 0 rgba(109, 40, 217, 0)",
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  >
                    <div className="bg-gray-900/50 backdrop-blur-md rounded-xl p-1">
                      <img
                        src="https://images.unsplash.com/photo-1499415479124-43c32433a620?q=80&w=600&auto=format&fit=crop"
                        alt="Rapper with microphone"
                        className="rounded-lg w-full h-auto"
                      />
                    </div>
                  </motion.div>

                  {/* Floating elements */}
                  <motion.div
                    className="absolute -bottom-6 -left-6 bg-gray-900/80 backdrop-blur-md p-3 rounded-lg shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: 0.6,
                      repeat: Infinity,
                      repeatType: "reverse",
                      repeatDelay: 5,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <i className="ri-fire-fill text-orange-500 text-xl"></i>
                      <span className="text-white font-medium">
                        100+ Genres
                      </span>
                    </div>
                  </motion.div>
                  <motion.div
                    className="absolute -top-6 -right-6 bg-gray-900/80 backdrop-blur-md p-3 rounded-lg shadow-lg"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: 0.9,
                      repeat: Infinity,
                      repeatType: "reverse",
                      repeatDelay: 7,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <i className="ri-magic-line text-secondary text-xl"></i>
                      <span className="text-white font-medium">AI Magic</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section
          id="features"
          className="py-20 px-4 bg-gray-900/50 backdrop-blur-md"
        >
          <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Drop Beats, Not Features
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Our AI-powered platform gives you everything you need to create,
                customize and share professional rap lyrics.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature Cards */}
              {[
                {
                  icon: "ri-album-line",
                  color: "text-secondary",
                  title: "Genre Selection",
                  description:
                    "Choose from dozens of rap styles including Hip-Hop, Drill, Trap, Old School, and more.",
                },
                {
                  icon: "ri-brain-line",
                  color: "text-accent",
                  title: "AI Magic",
                  description:
                    "Powered by Google Gemini to generate perfect verses with on-point flow, rhymes, and style.",
                },
                {
                  icon: "ri-share-forward-line",
                  color: "text-primary",
                  title: "Share Everywhere",
                  description:
                    "Export your lyrics to social media, save them to your profile, or share with friends.",
                },
                {
                  icon: "ri-edit-line",
                  color: "text-secondary-light",
                  title: "Full Customization",
                  description:
                    "Edit generated lyrics, adjust stanza count, and toggle explicit content filters.",
                },
                {
                  icon: "ri-user-star-line",
                  color: "text-accent-light",
                  title: "Personal Profile",
                  description:
                    "Save your favorite creations and manage privacy settings from your dashboard.",
                },
                {
                  icon: "ri-global-line",
                  color: "text-primary-light",
                  title: "Public Gallery",
                  description:
                    "Discover public raps from other users, like your favorites, and get inspired.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 10px 30px -15px rgba(109, 40, 217, 0.3)",
                  }}
                >
                  <div className={`mb-4 ${feature.color} text-4xl`}>
                    <i className={feature.icon}></i>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-20 px-4">
          <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How RapMania Works
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Three simple steps to create your next rap masterpiece
              </p>
            </motion.div>

            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <motion.div
                className="w-full lg:w-1/2"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                {/* App mockup */}
                <div className="rounded-xl overflow-hidden border border-gray-800">
                  <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-8">
                    <div className="flex flex-col gap-6">
                      {/* Step 1: Form */}
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                          <span className="bg-primary rounded-full w-6 h-6 flex items-center justify-center text-white text-sm">
                            1
                          </span>
                          Select your options
                        </h3>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              Select Genre
                            </label>
                            <select className="w-full bg-gray-900 rounded-lg p-3 border border-gray-700">
                              <option>Hip-Hop</option>
                              <option>Drill</option>
                              <option>Trap</option>
                              <option>Old School</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              Topic
                            </label>
                            <textarea
                              className="w-full bg-gray-900 rounded-lg p-3 border border-gray-700"
                              placeholder="What's your rap about?"
                              rows={2}
                            ></textarea>
                            <div className="flex justify-end text-xs text-gray-400 mt-1">
                              0/150
                            </div>
                          </div>

                          <div className="flex gap-4">
                            <div className="w-1/2">
                              <label className="block text-sm font-medium text-gray-300 mb-1">
                                Stanza Count
                              </label>
                              <select className="w-full bg-gray-900 rounded-lg p-3 border border-gray-700">
                                <option>4 lines</option>
                                <option>8 lines</option>
                                <option>12 lines</option>
                                <option>16 lines</option>
                              </select>
                            </div>
                            <div className="w-1/2">
                              <label className="block text-sm font-medium text-gray-300 mb-1">
                                Content Rating
                              </label>
                              <div className="bg-gray-900 rounded-lg p-3 border border-gray-700 flex items-center justify-between">
                                <span>Clean Lyrics</span>
                                <div className="relative">
                                  <div className="w-10 h-5 bg-gray-700 rounded-full"></div>
                                  <div className="w-5 h-5 bg-primary rounded-full absolute top-0 left-0"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Step 2: AI Generation */}
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                          <span className="bg-primary rounded-full w-6 h-6 flex items-center justify-center text-white text-sm">
                            2
                          </span>
                          Generate with AI
                        </h3>

                        <div className="flex justify-center">
                          <motion.button
                            className="px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-lg font-semibold text-white flex items-center gap-2 hover:opacity-90 transition"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            animate={{
                              boxShadow: [
                                "0 0 0 rgba(109, 40, 217, 0)",
                                "0 0 20px rgba(109, 40, 217, 0.5)",
                                "0 0 0 rgba(109, 40, 217, 0)",
                              ],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              repeatType: "reverse",
                            }}
                          >
                            <i className="ri-mic-fill"></i> Drop the Mic
                          </motion.button>
                        </div>
                      </div>

                      {/* Step 3: Results */}
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                          <span className="bg-primary rounded-full w-6 h-6 flex items-center justify-center text-white text-sm">
                            3
                          </span>
                          Edit & Share
                        </h3>

                        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 mb-4">
                          <p className="font-mono text-gray-200 leading-relaxed">
                            {[
                              "From",
                              "the",
                              "streets",
                              "to",
                              "the",
                              "stage,",
                              "my",
                              "flow",
                              "so",
                              "hot,",
                            ].map((word, i) => (
                              <motion.span
                                key={i}
                                className="inline-block mr-1"
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{
                                  opacity: 1,
                                  y: 0,
                                  transition: { delay: i * 0.1 },
                                }}
                                viewport={{ once: true }}
                              >
                                {word}
                              </motion.span>
                            ))}
                            <br />
                            {[
                              "Burning",
                              "up",
                              "the",
                              "mic,",
                              "giving",
                              "all",
                              "I",
                              "got.",
                            ].map((word, i) => (
                              <motion.span
                                key={i}
                                className="inline-block mr-1"
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{
                                  opacity: 1,
                                  y: 0,
                                  transition: { delay: i * 0.1 + 1 },
                                }}
                                viewport={{ once: true }}
                              >
                                {word}
                              </motion.span>
                            ))}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button className="px-3 py-1.5 bg-gray-900 rounded-lg text-sm flex items-center gap-1 hover:bg-gray-800 transition">
                            <i className="ri-edit-line"></i> Edit
                          </button>
                          <button className="px-3 py-1.5 bg-gray-900 rounded-lg text-sm flex items-center gap-1 hover:bg-gray-800 transition">
                            <i className="ri-save-line"></i> Save
                          </button>
                          <button className="px-3 py-1.5 bg-gray-900 rounded-lg text-sm flex items-center gap-1 hover:bg-gray-800 transition">
                            <i className="ri-share-line"></i> Share
                          </button>
                          <button className="px-3 py-1.5 bg-gray-900 rounded-lg text-sm flex items-center gap-1 hover:bg-gray-800 transition">
                            <i className="ri-lock-line"></i> Privacy
                          </button>
                          <button className="px-3 py-1.5 bg-gray-900 rounded-lg text-sm flex items-center gap-1 hover:bg-gray-800 transition">
                            <i className="ri-clipboard-line"></i> Copy
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="w-full lg:w-1/2 space-y-8"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white text-xl">
                      1
                    </div>
                    <h3 className="text-2xl font-bold">
                      Tell us what you want
                    </h3>
                  </div>
                  <p className="text-gray-300 text-lg pl-14">
                    Choose your genre, input your topic, and customize settings
                    like stanza count and content rating.
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white text-xl">
                      2
                    </div>
                    <h3 className="text-2xl font-bold">Let AI do its magic</h3>
                  </div>
                  <p className="text-gray-300 text-lg pl-14">
                    Our AI engine analyzes your inputs and generates rap lyrics
                    that match your style and theme perfectly.
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white text-xl">
                      3
                    </div>
                    <h3 className="text-2xl font-bold">
                      Edit, save, and share
                    </h3>
                  </div>
                  <p className="text-gray-300 text-lg pl-14">
                    Fine-tune your lyrics, save them to your profile, and share
                    them with friends or on social media.
                  </p>
                </div>

                <div className="pt-4">
                  <Link href="/auth">
                    <motion.a
                      className="inline-block px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-lg text-lg font-semibold shadow-lg hover:opacity-90 transition"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Start Creating Now
                    </motion.a>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section
          id="testimonials"
          className="py-20 px-4 bg-gray-900/50 backdrop-blur-md"
        >
          <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                What Rappers Are Saying
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Don't just take our word for it, check out what our users think
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  text: "RapMania helped me break through writer's block. The AI suggestions were fire and gave me just the spark I needed for my next track!",
                  name: "DJ Lyrical",
                  title: "Hip-Hop Producer",
                  seed: "Dustin",
                  stars: 5,
                },
                {
                  text: "I was skeptical about AI-generated lyrics, but RapMania blew me away. The rhymes are tight, and it actually understands flow and style!",
                  name: "Verse Queen",
                  title: "Independent Artist",
                  seed: "Sarah",
                  stars: 5,
                },
                {
                  text: "As a rap battle coach, I use RapMania to help my students practice. The variety of styles and quick generation makes it perfect for training.",
                  name: "MC Teacher",
                  title: "Battle Rap Coach",
                  seed: "Marcus",
                  stars: 4.5,
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex-grow">
                      <div className="flex text-secondary mb-3">
                        {Array(Math.floor(testimonial.stars))
                          .fill(0)
                          .map((_, i) => (
                            <i key={i} className="ri-star-fill"></i>
                          ))}
                        {testimonial.stars % 1 > 0 && (
                          <i className="ri-star-half-fill"></i>
                        )}
                      </div>
                      <p className="text-gray-300 italic mb-6">
                        "{testimonial.text}"
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-800">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${testimonial.seed}`}
                          alt="User avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-gray-400">
                          {testimonial.title}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Discover section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Discover Popular Raps
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Check out what our community is creating
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  username: "FlowMaster",
                  genre: "Hip-Hop",
                  content:
                    "City lights reflect in my eyes as I rise,\nThrough darkest nights, I visualize the prize.\nHustling hard, no compromise,\nThis is my story, my life, no lies.",
                  likes: 24,
                  days: 3,
                  seed: "User1",
                  badge: { text: "POPULAR", color: "bg-primary-dark" },
                },
                {
                  username: "BeatDropper",
                  genre: "Trap",
                  content:
                    "Trap house vibes got me feelin' alive,\nStack up the cash, watch the numbers thrive.\nEnemies hate, but they can't survive,\nIn my lane now, ready to drive.",
                  likes: 42,
                  days: 1,
                  seed: "User2",
                  badge: { text: "TRENDING", color: "bg-secondary-dark" },
                },
                {
                  username: "LyricGenius",
                  genre: "Old School",
                  content:
                    "Back to the roots, classic boom-bap,\nGolden era flows, that's where it's at.\nWords have power, that's a fact,\nReal hip-hop never stepped back.",
                  likes: 18,
                  days: 0.2,
                  seed: "User3",
                  badge: { text: "NEW", color: "bg-accent-dark" },
                },
              ].map((rap, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-900/40 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-800"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800">
                          <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${rap.seed}`}
                            alt="User avatar"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold">{rap.username}</p>
                          <p className="text-xs text-gray-400">{rap.genre}</p>
                        </div>
                      </div>
                      <div
                        className={`px-2 py-1 ${rap.badge.color} rounded-full text-xs`}
                      >
                        {rap.badge.text}
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="font-mono text-gray-200 leading-relaxed">
                      {rap.content.split("\n").map((line, i) => (
                        <React.Fragment key={i}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))}
                    </p>
                  </div>
                  <div className="p-4 border-t border-gray-700 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 text-gray-400 hover:text-secondary transition">
                        <i className="ri-heart-line"></i>{" "}
                        <span>{rap.likes}</span>
                      </button>
                      <button className="flex items-center gap-1 text-gray-400 hover:text-accent transition">
                        <i className="ri-share-line"></i>
                      </button>
                    </div>
                    <span className="text-xs text-gray-400">
                      {rap.days === 0
                        ? "just now"
                        : rap.days < 1
                          ? `${Math.floor(rap.days * 24)} hours ago`
                          : rap.days === 1
                            ? "yesterday"
                            : `${rap.days} days ago`}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center mt-12">
              <Link href="/discover">
                <Button className="px-8 py-6 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-lg">
                  View All Raps
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="py-20 px-4 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-black to-primary/20"></div>
          <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              className="max-w-3xl mx-auto text-center space-y-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold">
                Ready to Drop Some Fire?
              </h2>
              <p className="text-xl text-gray-300">
                Join thousands of rappers and lyricists already using RapMania
                to create, share, and showcase their talent.
              </p>
              <div className="pt-6">
                <Link href="/auth">
                  <motion.div
                    className="relative group inline-block"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
                    <Button className="relative px-10 py-8 bg-gray-900 text-white rounded-lg text-xl font-semibold flex items-center justify-center gap-2">
                      Get Started Now <i className="ri-arrow-right-line"></i>
                    </Button>
                  </motion.div>
                </Link>
              </div>
              <p className="text-gray-400 pt-4">
                No credit card required. Free to use.
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
