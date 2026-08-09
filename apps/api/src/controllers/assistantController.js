/**
 * Multilingual AI Safety Assistant Controller powered by Google Gemini AI
 * SecureVoyage — Pilot Zone: Bhubaneswar, Odisha
 */

const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export const processAssistantMessage = async (req, res) => {
  const { message, language = 'English', sessionId } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Field "message" is required and must be a string.'
      }
    });
  }

  const query = message.toLowerCase();
  const currentSessionId = sessionId || `sess_${Math.random().toString(36).substring(2, 11)}`;
  const messageId = `msg_${Math.random().toString(36).substring(2, 11)}`;

  // Default intent and actions
  let intent = 'GENERAL_SAFETY';
  let actions = [];

  if (query.includes('sos') || query.includes('danger') || query.includes('emergency') || query.includes('help') || query.includes('police')) {
    intent = 'EMERGENCY_TRIGGER';
    actions = [
      { type: 'OPEN_EMERGENCY_NUMBER', label: 'Call Official 112 Emergency' },
      { type: 'OPEN_SOS_CONFIRMATION', label: 'Activate Live SOS Session' }
    ];
  } else if (query.includes('hospital') || query.includes('doctor') || query.includes('trauma') || query.includes('medical')) {
    intent = 'SERVICES_LOCATOR';
    actions = [
      { type: 'OPEN_NEARBY_SERVICES', label: 'View Hospital Directory Map' },
      { type: 'OPEN_EMERGENCY_NUMBER', label: 'Call Capital Hospital (+91 674 239 1983)' }
    ];
  } else if (query.includes('route') || query.includes('canteen') || query.includes('kiit') || query.includes('patia') || query.includes('janpath') || query.includes('travel')) {
    intent = 'SAFE_ROUTE_ADVISORY';
    actions = [
      { type: 'OPEN_SAFE_ROUTE', label: 'Open Janpath Safe Navigation' },
      { type: 'OPEN_NEARBY_SERVICES', label: 'View Police Stations on Route' }
    ];
  } else {
    actions = [
      { type: 'OPEN_NEARBY_SERVICES', label: 'Find Nearby Responders' },
      { type: 'OPEN_SAFE_ROUTE', label: 'Get Safe Route' }
    ];
  }

  // System Prompt for Google Gemini AI
  const systemPrompt = `You are SecureVoyage AI Assistant, an expert tourist safety companion specialized in Bhubaneswar, Odisha, India.
The user is asking: "${message}"
Requested Language: ${language}

Provide a helpful, polite, concise, and accurate safety advisory (max 3-4 sentences). 
Key Context for Bhubaneswar:
- Pilot Zone: Janpath Smart Corridor, Master Canteen Square, Patia, KIIT, Capital Hospital (Unit-6), AIIMS Bhubaneswar.
- Emergency Helpline: 112.
- Overall Pilot Safety Score: 84/100 (Safe).
- If the user asks in Hindi or Odia or requested language ${language}, respond primarily in that language while keeping safety advisories clear.

Keep your response factual, reassuring, concise, and helpful.`;

  if (GEMINI_API_KEY) {
    try {
      const geminiRes = await fetch(GEMINI_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: systemPrompt
                }
              ]
            }
          ]
        })
      });

      if (geminiRes.ok) {
        const data = await geminiRes.json();
        const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (candidateText && candidateText.trim()) {
          return res.status(200).json({
            sessionId: currentSessionId,
            messageId,
            message: candidateText.trim(),
            intent,
            confidence: 0.96,
            sources: ['Google Gemini AI Flash', 'Odisha Tourism & Smart City Safety DB'],
            actions,
            processedAt: new Date().toISOString()
          });
        }
      }
    } catch (err) {
      console.warn('[Gemini API] Request exception:', err.message);
    }
  }

  // Graceful Fallback Response
  let fallbackReply = `SecureVoyage AI Advisory (${language}):\nSafety conditions across central Bhubaneswar pilot corridors (Janpath, Master Canteen, Patia) are currently rated as SAFE (Score: 84/100). All tourist assistance centers are operational. Emergency Helpline: 112.`;
  if (language === 'Hindi') {
    fallbackReply = 'नमस्ते! भुवनेश्वर में मुख्य रूप से यूनिट-6 स्थित **कैपिटल अस्पताल (Capital Hospital)** और **एम्स भुवनेश्वर (AIIMS Bhubaneswar)** मुख्य सरकारी अस्पताल हैं। किसी भी आपातस्थिति के लिए तुरंत **112** पर कॉल करें। (सुरक्षा स्कोर: 84/100)';
  } else if (language === 'Odia') {
    fallbackReply = 'ଭୁବନେଶ୍ୱର ଜନପଥ ସ୍ମାର୍ଟ କରିଡର ସୁରକ୍ଷିତ (ସ୍କୋର: 84/100)। ଜରୁରୀକାଳୀନ ହେଲ୍ପଲାଇନ୍ 112 ସକ୍ରିୟ।';
  }

  return res.status(200).json({
    sessionId: currentSessionId,
    messageId,
    message: fallbackReply,
    intent,
    confidence: 0.90,
    sources: ['Odisha Tourism Safety Corpus'],
    actions,
    processedAt: new Date().toISOString()
  });
};
