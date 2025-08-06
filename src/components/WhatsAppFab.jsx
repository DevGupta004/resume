import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const phoneNumber = '1234567890'; // TODO: replace with your WhatsApp number (international format)

const WhatsAppFab = () => (
  <a
    href={`https://wa.me/${phoneNumber}`}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat on WhatsApp"
    className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition transform hover:scale-105 focus:outline-none"
  >
    <FaWhatsapp size={24} />
  </a>
);

export default WhatsAppFab;
