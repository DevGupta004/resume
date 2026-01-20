import { resumeData } from '../data/resumeData';

/**
 * Web-only AI service - uses rule-based system only
 * No llama.rn, no react-native-fs, no mobile dependencies
 */

/**
 * Generate response using rule-based system (web only)
 */
const generateFallbackResponse = (userMessage) => {
  const message = userMessage.toLowerCase().trim();
  
  // Greeting responses
  if (message.match(/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)/)) {
    return `Hi! Great to meet you! I'm Dev Gupta, and I'm here 24/7 to help answer any questions you have about my background, experience, skills, or projects. What would you like to know?`;
  }

  // About/Introduction
  if (message.match(/(who is|tell me about|introduce|about dev|background|overview)/)) {
    return `Dev Gupta is a passionate and performance-driven React Native & Full Stack Developer with 4.5+ years of experience. He specializes in building scalable, AI-powered applications across fintech, OTT media, and SAP-based enterprise environments. Currently based in Hyderabad, Dev has a proven track record of delivering robust mobile and web solutions using React Native and the MERN stack.`;
  }

  // Experience
  if (message.match(/(experience|work|job|career|employment|current role|where does|company)/)) {
    const currentExp = resumeData.experience[0];
    return `Dev is currently working as a ${currentExp.role} at ${currentExp.company} in ${currentExp.location} (${currentExp.period}). His key responsibilities include:\n\n• ${currentExp.details[0]}\n• ${currentExp.details[1]}\n• ${currentExp.details[2]}\n\nPreviously, Dev worked at Ambak, Cutting Edge Digital (Mogi I/O), and ITCell, gaining diverse experience in fintech, OTT platforms, and enterprise solutions.`;
  }

  // Skills
  if (message.match(/(skill|technology|tech stack|what can|proficient|expertise|knows|proficient in)/)) {
    const skillsList = resumeData.skills.slice(0, 10).join(', ');
    return `Dev is skilled in various technologies including:\n\n${skillsList}\n\nAnd many more. He has strong expertise in React Native, React.js, Node.js, MongoDB, MySQL, and building scalable microservices architectures.`;
  }

  // Projects
  if (message.match(/(project|built|developed|portfolio|github|work sample)/)) {
    const projectsList = resumeData.projects.map(p => 
      `• ${p.title} - ${p.description} (Tech: ${p.tech.join(', ')})`
    ).join('\n\n');
    return `Dev has worked on several notable projects:\n\n${projectsList}\n\nYou can find more details about his work on his GitHub profile.`;
  }

  // Education
  if (message.match(/(education|degree|university|college|qualification|studied)/)) {
    return `I don't have specific education details in my database, but Dev has 4.5+ years of professional experience demonstrating strong technical skills and expertise in full-stack and mobile development.`;
  }

  // Contact information
  if (message.match(/(contact|email|phone|reach|get in touch|linkedin|github|how to contact)/)) {
    return `You can reach Dev through:\n\n📧 Email: ${resumeData.email}\n📱 Phone: ${resumeData.phone}\n💼 LinkedIn: ${resumeData.linkedin}\n💻 GitHub: ${resumeData.github}\n\nFeel free to connect with him for opportunities or collaborations!`;
  }

  // Location
  if (message.match(/(location|where|based|city|address|live)/)) {
    return `Dev is currently based in ${resumeData.location}. He's open to remote opportunities and willing to relocate for the right opportunity.`;
  }

  // Availability/Open to work
  if (message.match(/(available|open to|looking for|hiring|opportunity|job|position|role)/)) {
    return `Dev is currently working as a Senior Software Engineer at Innovapptive Inc. However, he's always open to discussing exciting opportunities, especially in full-stack development, mobile app development, or AI-powered solutions. Feel free to reach out via email or LinkedIn!`;
  }

  // Years of experience
  if (message.match(/(how long|years|experience|tenure|duration)/)) {
    return `Dev has 4.5+ years of professional experience in software development, with expertise spanning full-stack development, mobile app development, and building scalable microservices.`;
  }

  // Specific technologies
  if (message.match(/(react native|react\.js|node\.js|mongodb|mysql|express|nestjs|redux|firebase)/)) {
    const tech = message.match(/(react native|react\.js|node\.js|mongodb|mysql|express|nestjs|redux|firebase)/i)?.[0];
    return `Yes, Dev has extensive experience with ${tech}. He has used it in multiple projects including OTT platforms, fintech applications, and enterprise solutions. ${tech} is one of his core competencies.`;
  }

  // Default response
  return `I'm Dev Gupta, and I'm here 24/7 to help! I can answer questions about:\n\n• My professional experience and current role\n• My technical skills and expertise\n• Projects I've worked on\n• Contact information\n• My background and career journey\n\nFeel free to ask me anything - I'm always happy to chat! 😊`;
};

/**
 * Main function to generate AI response (web only - rule-based)
 */
export const generateAIResponse = async (userMessage) => {
  // Web always uses rule-based system
  return generateFallbackResponse(userMessage);
};
