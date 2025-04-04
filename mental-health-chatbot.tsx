"use client"

import React, { useState, useEffect, useRef } from 'react';

// Define the message type
interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

// More comprehensive bot responses with categories for different mental health concerns
const botResponses = {
  // Emotions and feelings
  sad: "I notice you're feeling sad. That's a normal human emotion, though it can be difficult to experience. Would you like to talk about what's making you feel this way?",
  depressed: "I hear that you're feeling depressed. Depression can be overwhelming and isolating. Have you considered speaking with a mental health professional? In the meantime, would it help to talk about what you're experiencing?",
  anxious: "Anxiety can feel overwhelming. Some find it helpful to practice deep breathing - try breathing in for 4 counts, hold for 4, and exhale for 6. Would you like to share what's making you feel anxious?",
  stressed: "Stress affects us all differently. Have you identified what's causing your stress? Sometimes breaking down big problems into smaller tasks can help make things more manageable.",
  angry: "It sounds like you're feeling angry. That's a natural emotion. Would it help to talk about what triggered these feelings?",
  overwhelmed: "Feeling overwhelmed is common when there's too much happening at once. Maybe we could break down what's on your mind into smaller parts?",
  lonely: "Loneliness can be difficult to navigate. Have you been able to connect with friends or family recently? Sometimes even small interactions can help.",
  hopeless: "I'm sorry you're feeling hopeless. These feelings can be very intense, but they don't last forever. Would it help to talk about specific concerns?",
  
  // Specific issues
  sleep: "Sleep issues can significantly impact mental health. Are you having trouble falling asleep or staying asleep? I could suggest some relaxation techniques that might help.",
  motivation: "Lack of motivation can be frustrating. Sometimes setting very small, achievable goals can help rebuild momentum. What's one tiny step you could take today?",
  relationship: "Relationships can bring both joy and challenges. Would you like to talk more about what's happening in your relationship?",
  work: "Work stress affects many people. Are there specific aspects of your job that are causing you difficulty?",
  grief: "I'm so sorry for your loss. Grief is a deeply personal experience, and there's no right way to process it. Would it help to share memories or feelings about your loved one?",
  trauma: "Processing trauma can be incredibly difficult. Have you worked with a professional therapist on this? They can provide specialized support for trauma recovery.",
  
  // Self-improvement
  meditation: "Meditation can be a wonderful practice for mental well-being. Would you like some suggestions for beginner-friendly meditation exercises?",
  exercise: "Physical activity is strongly linked to improved mental health. Even a short walk can help boost mood. What kinds of movement do you enjoy?",
  gratitude: "Practicing gratitude has been shown to improve mental well-being. Would you like to share something you're grateful for today?",
  journal: "Journaling can be a powerful tool for processing emotions. Have you tried writing down your thoughts and feelings?",
  
  // Crisis responses
  suicide: "I'm really concerned about what you're sharing. These feelings are serious, and you deserve immediate support. Please reach out to a crisis helpline right away - in the US, you can text HOME to 741741 or call 988 for the Suicide & Crisis Lifeline. They have trained counselors available 24/7.",
  harm: "I'm concerned about your safety. Please reach out to a crisis support service immediately - in the US, you can text HOME to 741741 or call 988. Would you like information on other resources?",
  emergency: "This sounds like an emergency situation. Please contact emergency services (like 911 in the US) immediately if you or someone else is in danger.",
  
  // Help-seeking
  therapy: "Seeking therapy is a positive step toward better mental health. Would you like some information about how to find a therapist?",
  medication: "Medication can be an important part of mental health treatment for many people. Have you spoken with a healthcare provider about this option?",
  resources: "There are many mental health resources available. Would you like information about support groups, educational materials, or crisis services?",
  
  // For when multiple keywords are detected
  complex: "It sounds like you're dealing with several challenging feelings. Would you like to focus on one particular aspect first?",
  
  // Default response for when no keywords are matched
  default: "I'm here to support you. Can you tell me more about what you're experiencing right now?",
  
  // Greeting responses
  greeting: "Hello! I'm Mind Shakti, your supportive AI companion. How are you feeling today?",
  thanks: "You're welcome. I'm here to support you whenever you need someone to talk to.",
  goodbye: "Take care of yourself. Remember that it's okay to reach out whenever you need support."
};

// Function to get the current timestamp
const getCurrentTimestamp = (): string => {
  const now = new Date();
  return now.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

// Main Chatbot Component
const MentalHealthChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Welcome to Mind Shakti, your supportive AI companion. Share your thoughts and feelings in a safe, judgment-free space. How are you feeling today?",
      sender: 'bot',
      timestamp: getCurrentTimestamp(),
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [chatHistory, setChatHistory] = useState<Array<Array<Message>>>([]);
  const [currentChatIndex, setCurrentChatIndex] = useState<number>(0);

  // Scroll to the bottom of the chat when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = () => {
    if (input.trim() === '') return;

    // Add user message to the chat
    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: getCurrentTimestamp(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(input.toLowerCase());
      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot',
        timestamp: getCurrentTimestamp(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000); // Delay to simulate bot "thinking"

    // Clear input
    setInput('');
  };

  // Get bot response based on user input
  const getBotResponse = (userInput: string): string => {
    for (const keyword in botResponses) {
      if (userInput.includes(keyword)) {
        return botResponses[keyword];
      }
    }
    return botResponses.default;
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleNewChat = () => {
    // Implement the logic to start a new chat
    console.log("Starting a new chat");
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.iconContainer}>
            <span style={styles.emoji}>🤗</span>
          </div>
          <div>
            <h2 style={styles.title}>Mind Shakti</h2>
            <p style={styles.status}>Online</p>
          </div>
        </div>
        <button 
          style={styles.newChatButton} 
          onClick={handleNewChat}
        >
          New Chat
        </button>
      </div>

      {/* Chat Area */}
      <div style={styles.chatContainer} ref={chatContainerRef}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={
              message.sender === 'user'
                ? styles.userMessage
                : styles.botMessage
            }
          >
            <p style={styles.messageText}>{message.text}</p>
            <span style={styles.timestamp}>{message.timestamp}</span>
          </div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div style={styles.botMessage}>
            <div style={styles.typingIndicator}>
              <span style={styles.typingDot}></span>
              <span style={styles.typingDot}></span>
              <span style={styles.typingDot}></span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Write your message..."
          style={styles.input}
        />
        <button 
          onClick={handleSendMessage} 
          style={input.trim() ? styles.sendButtonActive : styles.sendButton}
          disabled={!input.trim()}
        >
          ➤
        </button>
      </div>
      
      {/* Disclaimer */}
      <div style={styles.disclaimer}>
        <p>Mind Shakti is an AI companion and not a substitute for professional mental health services. 
        If you're experiencing a crisis, please contact emergency services or a mental health professional.</p>
      </div>
    </div>
  );
};

// Enhanced styles
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: '100%',
    maxWidth: '600px',
    height: '80vh',
    margin: '0 auto',
    border: '1px solid #ddd',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f5f5f5',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#e6e6fa',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  iconContainer: {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: '50%',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  emoji: {
    fontSize: '24px',
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 'bold',
  },
  status: {
    margin: 0,
    fontSize: '12px',
    color: 'green',
  },
  newChatButton: {
    padding: '8px 16px',
    backgroundColor: '#d9534f',
    color: '#fff',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
  },
  chatContainer: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
    backgroundColor: '#f0f0ff',
    backgroundImage: 'url("/light-paper-fibers.png")',
  },
  userMessage: {
    marginBottom: '15px',
    textAlign: 'left',
    maxWidth: '70%',
    marginLeft: 'auto',
  },
  botMessage: {
    marginBottom: '15px',
    textAlign: 'left',
    maxWidth: '70%',
  },
  messageText: {
    padding: '10px 15px',
    backgroundColor: '#fff',
    borderRadius: '15px',
    margin: 0,
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
  },
  timestamp: {
    fontSize: '12px',
    color: '#888',
    display: 'block',
    marginTop: '5px',
  },
  inputContainer: {
    display: 'flex',
    padding: '10px',
    borderTop: '1px solid #ddd',
    backgroundColor: '#fff',
    borderBottomLeftRadius: '10px',
    borderBottomRightRadius: '10px',
  },
  input: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '20px',
    outline: 'none',
    fontSize: '14px',
  },
  sendButton: {
    marginLeft: '10px',
    padding: '10px',
    backgroundColor: '#6a5acd',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    marginLeft: '10px',
    padding: '10px',
    backgroundColor: '#6a5acd',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  typingIndicator: {
    padding: '15px',
    backgroundColor: '#e6e6fa',
    borderRadius: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '5px',
  },
  typingDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#6a5acd',
    borderRadius: '50%',
    animation: 'bounce 1.5s infinite',
  },
  disclaimer: {
    padding: '10px 15px',
    fontSize: '12px',
    color: '#777',
    textAlign: 'center',
    borderTop: '1px solid #eee',
    backgroundColor: '#fafafa',
  },
};

export default MentalHealthChatbot; 