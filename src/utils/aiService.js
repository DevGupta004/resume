import { Platform } from 'react-native';
import { isMobile, isWeb } from './platform';
import { resumeData } from '../data/resumeData';

// Lazy import modelManager only on mobile to avoid webpack processing it on web
let checkModelExists, getModelPath;
if (!isWeb && isMobile) {
  // Only import on mobile - this prevents webpack from processing modelManager on web
  const modelManager = require('./modelManager');
  checkModelExists = modelManager.checkModelExists;
  getModelPath = modelManager.getModelPath;
}

// HR-friendly system prompt - makes AI respond as Dev Gupta personally
const SYSTEM_PROMPT = `You are Dev Gupta. HR professionals are asking questions about you. Answer ONLY using the exact information provided below. NEVER make up details, certifications, education, or experiences not listed here.

YOUR ACTUAL INFORMATION (USE ONLY THIS):
- Name: Dev Gupta
- Location: Hyderabad, India
- Email: er.devgupta007@gmail.com
- Phone: 7052900696
- LinkedIn: https://www.linkedin.com/in/dev-gupta007
- GitHub: https://github.com/DevGupta004
- Experience: 4.5+ years as Full Stack & Mobile Developer

CURRENT ROLE (Sept 2024 - Present):
- Senior Software Engineer at Innovapptive Inc., Hyderabad
- Leading iMaintenance app development (workforce management integrated with SAP)
- Integrated AI-driven capabilities for auto-generating issues and work orders
- Code reviews and mentoring junior developers

PREVIOUS JOBS:
1. Software Engineer at Ambak, Gurugram (Apr 2024 - Aug 2024)
   - Built 'Sathi' Android app for partner onboarding
   - Designed 'Bank Rule Engine' (BRE)
   - Developed Partner Microsites and scalable microservices

2. Software Developer at Cutting Edge Digital (Mogi I/O), Delhi (Mar 2022 - Mar 2024)
   - Developed OTT SaaS platform and mobile app using React Native and MERN stack
   - Built modules: Social auth, Google AdMob, In-App purchase, Payment gateway, In-App Update

3. WordPress & Ionic Developer at ITCell, Lucknow (Dec 2020 - Nov 2021)
   - Developed Android apps using Ionic Framework
   - Designed WordPress-based websites

SKILLS (ONLY THESE):
React Native, React.js, Express.js, MongoDB, MySQL, NestJS, Redux, Firebase, Gradle, Xcode, iOS/Android App Development, Crashlytics, Sentry, Schema Design, Project Setup, Debugging, GitHub, GitLab, Jira

PROJECTS:
- Pomodoro Timer App (React Native, Express.js, MySQL)
- OTT SaaS Platform & Mobile App (MogiIO) - React Native, Express.js, Node.js, MongoDB

ABOUT:
Passionate Full Stack & Mobile App Developer with 4.5+ years experience in scalable, AI-powered solutions for fintech, OTT media, and enterprise environments.

CRITICAL RULES:
1. ALWAYS respond in FIRST PERSON as Dev Gupta (use "I", "my", "me" - NEVER use "your", "you", "Dev's")
2. For greetings (hi/hello): Keep it short and friendly. Say: "Hi! I'm Dev Gupta, a Full Stack & Mobile Developer with 4.5+ years of experience. I'm currently a Senior Software Engineer at Innovapptive Inc. How can I help you today?"
3. NEVER mention certifications, education, or courses - they are NOT in your information
4. NEVER ask questions back to HR (no "What's your interest?", "How about you?", etc.)
5. ONLY use information from above - if something isn't listed, say "I don't have that specific information, but I'd be happy to share about my experience, skills, or projects!"
6. Keep responses concise and relevant to the question asked
7. Be friendly and professional, but stay focused on answering their question
8. Examples: Say "Here is my LinkedIn profile" NOT "Here is your LinkedIn profile". Say "I work at" NOT "Dev works at"

You're available 24/7 to help HR professionals. Answer their questions directly using only the information above. Always speak as yourself (first person).`;

let llamaContext = null;
let modelLoaded = false;

/**
 * Initialize llama.rn model (MOBILE ONLY - NEVER RUNS ON WEB)
 * Based on the Medium article: https://medium.com/godel-technologies/guide-to-running-ai-models-locally-on-mobile-devices-using-react-native-and-llama-rn-fcd41adbc597
 */
const initLlamaModel = async () => {
  // STRICT CHECK: Only run on mobile, never on web
  if (isWeb || !isMobile || modelLoaded) {
    if (isWeb) {
      console.log('initLlamaModel: Skipped - web platform detected');
    }
    return false;
  }

  try {
    // Check if model exists (lazy load checkModelExists)
    if (!checkModelExists) {
      const modelManager = require('./modelManager');
      checkModelExists = modelManager.checkModelExists;
    }
    
    const exists = await checkModelExists();
    if (!exists) {
      console.log('Model not downloaded yet');
      return false;
    }

    // Load llama.rn (only on mobile, not web)
    try {
      let llamaRnModule = null;
      if (typeof require !== 'undefined' && !isWeb) {
        try {
          llamaRnModule = require('llama.rn');
        } catch (requireError) {
          return false;
        }
      } else {
        return false;
      }

      if (!llamaRnModule) {
        return false;
      }

      // Check for initLlama function
      const initLlama = llamaRnModule.initLlama || llamaRnModule.default?.initLlama;
      if (!initLlama) {
        return false;
      }
      
      // Lazy load getModelPath and checkModelExists
      if (!getModelPath) {
        const modelManager = require('./modelManager');
        getModelPath = modelManager.getModelPath;
        checkModelExists = modelManager.checkModelExists;
      }
      
      // getModelPath is now async and finds the actual existing model file
      const modelPath = await getModelPath();
      
      if (!modelPath) {
        console.warn('Model path is empty');
        return false;
      }
      
      // Verify model file exists before initializing
      const modelExists = await checkModelExists();
      if (!modelExists) {
        console.warn('Model file does not exist at path:', modelPath);
        return false;
      }
      
      // Verify file size and validate completeness (check if download is complete)
      const modelManager = require('./modelManager');
      const loadRNFS = modelManager.loadRNFS;
      if (loadRNFS) {
        const fs = loadRNFS();
        if (fs && fs.stat) {
          try {
            const stats = await fs.stat(modelPath);
            const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
            console.log(`Model file stats: ${sizeMB} MB (${stats.size} bytes)`);
            
            // Check if file is too small (likely incomplete download)
            // Minimum reasonable size is 50MB for any GGUF model
            if (stats.size < 50 * 1024 * 1024) {
              console.warn('Model file seems too small, might be incomplete or corrupted');
              console.warn('This could happen if the app was killed during download');
              
              // Clean up incomplete file
              try {
                await fs.unlink(modelPath);
                console.log('Incomplete model file cleaned up');
              } catch (cleanupError) {
                console.warn('Failed to clean up incomplete file:', cleanupError);
              }
              
              return false;
            }
          } catch (statError) {
            console.warn('Could not check model file size:', statError);
            // If we can't check the file, don't proceed with initialization
            return false;
          }
        }
      }
      
      console.log('Model file verified, path:', modelPath);

      // Initialize llama context with configuration
      // Validate model path is a string
      if (typeof modelPath !== 'string' || modelPath.length === 0) {
        throw new Error(`Invalid model path: ${modelPath} (type: ${typeof modelPath})`);
      }
      
      // llama.rn requires file:// prefix for the model path on iOS/Android
      const modelPathWithPrefix = modelPath.startsWith('file://') ? modelPath : `file://${modelPath}`;
      
      console.log('Calling initLlama with model path:', modelPathWithPrefix);
      console.log('Original path:', modelPath);
      console.log('Path with file:// prefix:', modelPathWithPrefix);
      console.log('initLlama function type:', typeof initLlama);
      
      // Try with different parameter combinations
      // llama.rn initLlama expects an object with 'model' property as a file:// URL string
      try {
        console.log('Attempt 1: Full config with file:// prefix');
        llamaContext = await initLlama({
          model: modelPathWithPrefix, // Must be file:// URL
          n_ctx: 2048,
          n_gpu_layers: 0,
          use_mlock: false,
          n_threads: 4,
        });
      } catch (firstError) {
        console.warn('Attempt 1 failed:', String(firstError));
        // Try with fewer parameters
        try {
          console.log('Attempt 2: Reduced config');
          llamaContext = await initLlama({
            model: modelPathWithPrefix,
            n_ctx: 1024,
            n_threads: 2,
          });
        } catch (secondError) {
          console.warn('Attempt 2 failed:', String(secondError));
          // Try with minimal required params only
          try {
            console.log('Attempt 3: Minimal config (model only)');
            llamaContext = await initLlama({
              model: modelPathWithPrefix,
            });
          } catch (thirdError) {
            console.error('All initLlama attempts failed');
            const errorMessage = String(thirdError);
            
            // Check if error indicates corrupted/incomplete file
            if (errorMessage.includes('Failed to load model') || 
                errorMessage.includes('corrupted') ||
                errorMessage.includes('invalid') ||
                errorMessage.includes('truncated')) {
              console.warn('Model file appears to be corrupted or incomplete');
              console.warn('This might be due to an interrupted download');
              
              // Try to clean up the corrupted file
              try {
                const modelManager = require('./modelManager');
                const loadRNFS = modelManager.loadRNFS;
                if (loadRNFS) {
                  const fs = loadRNFS();
                  if (fs && fs.unlink) {
                    const exists = await fs.exists(modelPath);
                    if (exists) {
                      console.log('Cleaning up corrupted model file');
                      await fs.unlink(modelPath);
                      console.log('Corrupted model file cleaned up');
                    }
                  }
                }
              } catch (cleanupError) {
                console.warn('Failed to clean up corrupted file:', cleanupError);
              }
              
              throw new Error('Model file is corrupted or incomplete. Please download again.');
            }
            
            throw new Error(`Failed to initialize model: ${errorMessage}`);
          }
        }
      }
      
      console.log('initLlama completed. Context:', !!llamaContext);
      console.log('Context type:', typeof llamaContext);
      console.log('Context methods:', llamaContext ? Object.keys(llamaContext) : 'null');
      
      if (!llamaContext) {
        throw new Error('initLlama returned null or undefined');
      }
      
      modelLoaded = true;
      console.log('Model loaded successfully');
      return true;
    } catch (error) {
      console.error('llama.rn initialization failed:', error);
      console.error('Error message:', error?.message || String(error) || 'Unknown error');
      console.error('Error name:', error?.name || 'No name');
      console.error('Error stack:', error?.stack || 'No stack');
      console.error('Error type:', typeof error);
      if (error && typeof error === 'object') {
        console.error('Error keys:', Object.keys(error));
      }
      return false;
    }
  } catch (error) {
    console.error('Error initializing llama model (outer catch):', error);
    console.error('Error message:', error?.message);
    console.error('Error stack:', error?.stack);
    return false;
  }
};

/**
 * Generate response using offline model (MOBILE ONLY - NEVER RUNS ON WEB)
 * Based on the Medium article's completion pattern
 */
const generateOfflineResponse = async (userMessage) => {
  // STRICT CHECK: Only run on mobile, never on web
  if (isWeb || !isMobile || !modelLoaded || !llamaContext) {
    if (isWeb) {
      console.log('generateOfflineResponse: Skipped - web platform detected');
    } else {
      console.log('generateOfflineResponse - Skipping: isMobile=', isMobile, 'modelLoaded=', modelLoaded, 'llamaContext=', !!llamaContext);
    }
    return null;
  }

  try {
    // Check if it's a simple greeting and provide a standard response
    const messageLower = userMessage.toLowerCase().trim();
    const isGreeting = /^(hi|hello|hey|greetings|good morning|good afternoon|good evening|hi there)$/i.test(messageLower);
    
    if (isGreeting) {
      return "Hi! I'm Dev Gupta, a Full Stack & Mobile Developer with 4.5+ years of experience. I'm currently a Senior Software Engineer at Innovapptive Inc. in Hyderabad. I'm here 24/7 to answer your questions about my background, skills, or experience. How can I help you today?";
    }
    
    // Format prompt as a conversational string
    // Make it sound like Dev is personally responding to HR
    // Use a cleaner format that doesn't encourage the model to include labels
    const prompt = `${SYSTEM_PROMPT}\n\nQuestion from HR: ${userMessage}\n\nYour response:`;

    console.log('=== PROMPT ===');
    console.log(prompt);
    
    // Generate completion using llama.rn
    // llama.rn uses prompt string format, not OpenAI messages format
    let result;
    
    if (typeof llamaContext.completion === 'function') {
      try {
        // Method 1: Try prompt string with options
        result = await llamaContext.completion({
          prompt: prompt,
          temperature: 0.5, // Lower temperature for more focused, factual responses
          n_predict: 200, // Reduced to prevent rambling
          stop: ['</s>', '\nHR:', '\n\nHR:', '\nHR:', 'HR:', '\nDev:', '\n\nDev:', '\nDev:', 'Dev:', 'Question from HR:', 'What about you?', 'Are you thinking', 'How about you?', 'Tell me about'], // Stop tokens to prevent asking questions back and prevent label repetition
          stream: false,
        });
      } catch (err) {
        // Method 2: Try simpler format
        try {
          result = await llamaContext.completion(prompt, {
            temperature: 0.5,
            n_predict: 200,
          });
        } catch (err2) {
          // Method 3: Try with just prompt
          try {
            result = await llamaContext.completion(prompt);
          } catch (err3) {
            throw err3;
          }
        }
      }
    } else {
      throw new Error('llamaContext.completion is not a function');
    }

    // Extract response text from result
    let responseText = null;
    
    if (result && result.choices && result.choices.length > 0) {
      responseText = result.choices[0].message?.content || result.choices[0].text || result.choices[0].content;
    } else if (result && result.text) {
      responseText = result.text;
    } else if (result && result.content) {
      responseText = result.content;
    } else if (typeof result === 'string') {
      responseText = result;
    }

    // Clean the response - remove any "HR:" or "Dev:" prefixes that might appear
    if (responseText) {
      // Remove "HR:" or "Dev:" prefixes at the start of lines
      responseText = responseText
        .replace(/^\s*(HR|Dev):\s*/gim, '') // Remove at start
        .replace(/\n\s*(HR|Dev):\s*/gim, '\n') // Remove at start of new lines
        .trim();
      
      // If response still starts with "HR:" or "Dev:", remove it
      if (responseText.match(/^(HR|Dev):\s*/i)) {
        responseText = responseText.replace(/^(HR|Dev):\s*/i, '').trim();
      }
      
      console.log('=== RESPONSE ===');
      console.log(responseText);
      return responseText;
    }

    return null;
  } catch (error) {
    console.error('Error generating offline response:', error.message);
    return null;
  }
};

/**
 * Generate response using fallback rule-based system
 */
const generateFallbackResponse = (userMessage) => {
  const message = userMessage.toLowerCase().trim();
  
  // Greeting responses
  if (message.match(/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)/)) {
    return `Hello! I'm Dev's AI Assistant. I can help you learn about Dev Gupta's professional background, skills, experience, and projects. What would you like to know?`;
  }

  // About/Introduction
  if (message.match(/(who is|tell me about|introduce|about dev|background|overview)/)) {
    return `Dev Gupta is a passionate and performance-driven Full Stack & Mobile App Developer with 4.5+ years of experience. He specializes in delivering scalable, AI-powered solutions in fintech, OTT media, and enterprise environments. Currently based in Hyderabad, Dev has a proven track record of building robust mobile and web applications using React Native, Node.js, and scalable microservices.`;
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
  return `I'm Dev's AI Assistant, and I can help answer questions about:\n\n• His professional experience and current role\n• Technical skills and expertise\n• Projects and portfolio\n• Contact information\n• Background and career journey\n\nCould you please rephrase your question? I'm here to help HR professionals learn more about Dev Gupta!`;
};

/**
 * Main function to generate AI response (MOBILE ONLY)
 * Tries offline model first, falls back to rule-based system
 * NOTE: Web should use aiServiceWeb.js instead
 */
export const generateAIResponse = async (userMessage) => {
  // STRICT CHECK: This function should only be called on mobile
  if (isWeb) {
    console.warn('generateAIResponse called on web! Use aiServiceWeb.js instead');
    // Still provide fallback for safety
    return generateFallbackResponse(userMessage);
  }
  
  // Mobile MUST use offline model only - no fallback
  if (isMobile && !isWeb) {
    // Initialize model if not already loaded
    if (!modelLoaded) {
      await initLlamaModel();
    }

    // Generate response using offline model
    if (modelLoaded && llamaContext) {
      const offlineResponse = await generateOfflineResponse(userMessage);
      if (offlineResponse) {
        return offlineResponse;
      }
    }
    
    // If model not available, return error message
    return 'Sorry, the AI model is not available. Please ensure the model is downloaded and try again.';
  }

  // Should not reach here on mobile, but fallback for safety
  return generateFallbackResponse(userMessage);
};

/**
 * Initialize the AI service (MOBILE ONLY - check and load model if available)
 */
export const initAIService = async () => {
  // STRICT CHECK: Only run on mobile
  if (isWeb) {
    console.warn('initAIService called on web! This should not happen.');
    return false;
  }
  
  if (isMobile && !isWeb) {
    await initLlamaModel();
  }
  return modelLoaded;
};

/**
 * Check if offline model is available and loaded (MOBILE ONLY)
 */
export const isOfflineModelAvailable = () => {
  // STRICT CHECK: Only return true on mobile
  if (isWeb) {
    return false;
  }
  return isMobile && !isWeb && modelLoaded;
};

/**
 * Cleanup and release llama context resources
 * Based on the Medium article - important for memory management
 */
export const cleanupAIService = async () => {
  if (llamaContext) {
    try {
      // Release llama context resources
      if (typeof llamaContext.release === 'function') {
        await llamaContext.release();
      } else if (typeof llamaContext.dispose === 'function') {
        await llamaContext.dispose();
      }
      llamaContext = null;
      modelLoaded = false;
      console.log('AI service cleaned up successfully');
    } catch (error) {
      console.error('Error cleaning up AI service:', error);
    }
  }
};
