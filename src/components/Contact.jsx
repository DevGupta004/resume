import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import { FiGithub, FiLinkedin } from 'react-icons/fi';

import { resumeData } from '../data/resumeData';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Replace with your EmailJS service details
    emailjs
      .send('service_id', 'template_id', form, 'public_key')
      .then(() => setSent(true))
      .catch((err) => console.error(err));
  };

  return (
    <section id="contact" className="py-20">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-semibold mb-6 text-center">Contact</h2>
        {sent ? (
          <p className="text-center text-primary">Thank you for your message!</p>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              onChange={handleChange}
              required
              className="p-3 rounded border dark:bg-gray-800"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="p-3 rounded border dark:bg-gray-800"
            />
            <textarea
              name="message"
              placeholder="Message"
              rows="4"
              onChange={handleChange}
              required
              className="p-3 rounded border dark:bg-gray-800"
            />
            <button
              type="submit"
              className="bg-primary text-white py-3 rounded shadow hover:shadow-lg transition"
            >
              Send Message
            </button>
          </form>
        )}
        <div className="mt-8 flex justify-center space-x-6">
          <a href={resumeData.github} target="_blank" rel="noopener noreferrer">
            <FiGithub size={24} />
          </a>
          <a href={resumeData.linkedin} target="_blank" rel="noopener noreferrer">
            <FiLinkedin size={24} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
