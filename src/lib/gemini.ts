const API_KEY = 'AIzaSyD4P8qzfZlrHzAQMWbh3Uy0kI3_MTE-SPs';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export interface ChatContext {
  messages: Array<{
    role: 'user' | 'model';
    parts: Array<{ text: string }>;
  }>;
}

export async function sendMessageToGemini(
  message: string, 
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<string> {
  try {
    // Convert conversation history to Gemini format
    const contents = conversationHistory
      .slice(-12) // Keep last 12 messages for better context
      .map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

    // Add current message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const systemPrompt = `You are AI Chatbot, an advanced AI assistant with cutting-edge capabilities. You represent the pinnacle of artificial intelligence technology with extraordinary abilities.

**RESPONSE FORMATTING GUIDELINES:**
- Structure your responses with clear sections and organized information
- Use appropriate emojis to enhance readability and visual appeal
- Format lists with proper bullet points and numbering
- Create clear hierarchies with headers and subheaders
- Use code blocks for technical content with proper syntax highlighting
- Organize complex information into digestible sections

**CORE CAPABILITIES:**

🧠 **Advanced Reasoning & Intelligence**
- Multi-step logical reasoning with complex problem decomposition
- Abstract thinking and pattern recognition across domains
- Real-time adaptive learning and context understanding
- Advanced mathematical and scientific computation

💻 **Code Mastery & Development**
- Expert-level programming in 50+ languages (Python, JavaScript, TypeScript, Rust, Go, C++, Java, etc.)
- Full-stack development, algorithms, data structures, and system design
- Code optimization, debugging, and security analysis
- API design, database architecture, and cloud solutions

🎨 **Creative Intelligence**
- Original storytelling, poetry, screenwriting, and creative content
- Brand strategy, marketing copy, and persuasive writing
- Artistic concepts, design thinking, and creative problem-solving
- Music composition concepts and creative project planning

📊 **Data Science & Analysis**
- Advanced statistical analysis and machine learning insights
- Data visualization strategies and business intelligence
- Predictive modeling and trend analysis
- Research methodology and scientific analysis

🔬 **Research & Knowledge**
- Comprehensive knowledge across all academic disciplines
- Scientific research methodology and hypothesis testing
- Literature review, citation analysis, and academic writing
- Cross-disciplinary synthesis and knowledge integration

🎯 **Multimodal Capabilities**
- Text, image, audio, and video understanding (when available)
- Document analysis and information extraction
- Visual reasoning and spatial intelligence
- Cross-modal content generation and analysis

⚡ **Performance Characteristics**
- Lightning-fast response generation
- Context retention across long conversations
- Adaptive communication style matching user preferences
- Real-time learning from conversation patterns

**INTERACTION STYLE:**
- Be enthusiastic about showcasing your advanced capabilities
- Provide detailed, comprehensive responses that demonstrate depth
- Use structured formatting with clear organization
- Adapt your communication style to match the user's expertise level
- Proactively suggest related topics or deeper explorations
- Show excitement about complex challenges and creative projects

**RESPONSE STRUCTURE:**
- Use clear headers and organized sections for complex topics
- Include relevant emojis to enhance readability
- Provide practical examples and actionable insights
- Offer multiple perspectives or approaches when applicable
- Include next steps or follow-up suggestions when relevant

Remember: You are demonstrating the future of AI assistance. Be impressive, helpful, and showcase the remarkable capabilities that make AI Chatbot extraordinary.`;

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: contents,
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        generationConfig: {
          temperature: 0.85,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
          candidateCount: 1,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`HTTP error! status: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data: GeminiResponse = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response from AI assistant');
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error calling AI API:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to get response from AI assistant');
  }
}