"use client"

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, Send, Settings } from "lucide-react";

// Define types for the chatbot
interface Message {
  text: string;
  sender: "user" | "bot";
  timestamp: string;
  options?: string[];
  isError?: boolean;
}

interface AIResponse {
  response_text: string;
  suggestions?: string[];
  intent?: string;
  action?: string;
}

// Utility function to track interactions for analytics
const trackChatbotInteraction = (userInput: string, intent?: string) => {
  // In a production app, this would send data to an analytics service
  console.log("Tracking chatbot interaction:", { userInput, intent, timestamp: new Date() });
  
  // Example integration with analytics service
  // if (window.analytics) {
  //   window.analytics.track('Chatbot Interaction', {
  //     userInput,
  //     intent,
  //     timestamp: new Date().toISOString()
  //   });
  // }
};

// Mock AI response generator - in a real app, this would be replaced with an API call
const generateResponse = (text: string, userContext: any): AIResponse => {
  const lowerText = text.toLowerCase();
  const { language, authenticated } = userContext;

  // Simple language-aware responses
  if (lowerText.includes("hello") || lowerText.includes("hi")) {
    return {
      response_text: language === "es" ? "¡Hola! ¿Cómo puedo ayudarte hoy?" 
        : language === "fr" ? "Bonjour! Comment puis-je vous aider aujourd'hui?"
        : "Hello! How can I help you today?",
      intent: "greeting"
    };
  }
  
  if (lowerText.includes("appointment") || lowerText.includes("book") || lowerText.includes("schedule")) {
    if (!authenticated) {
      return {
        response_text: "You'll need to log in to book an appointment. Would you like to sign in now?",
        suggestions: ["Sign In", "Not now"],
        intent: "auth_required"
      };
    }
    
    return {
      response_text: "I can help you book an appointment. What type of specialist would you like to see?",
      suggestions: ["Primary Care", "Cardiology", "Dermatology", "Orthopedics"],
      intent: "appointment_booking"
    };
  }
  
  if (lowerText.includes("help") || lowerText.includes("agent") || lowerText.includes("human")) {
    return {
      response_text: "Would you like to speak with a human agent?",
      suggestions: ["Yes, connect me", "No, continue with bot"],
      intent: "human",
      action: "transfer_to_human"
    };
  }
  
  // Default response
  return {
    response_text: "I'm not sure I understand. How else can I assist you with your healthcare needs?",
    suggestions: ["Book appointment", "Check records", "Speak to a human"],
    intent: "fallback"
  };
};

const ChatbotComponent: React.FC = () => {
  // State variables
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! I'm your healthcare assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date().toISOString(),
      options: ["Book appointment", "Check my records", "Medication reminders"]
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [transferringToHuman, setTransferringToHuman] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [language, setLanguage] = useState("en"); // Default to English
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages when they change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Process user input and generate bot response using our AI model
  const processUserInput = async (text: string) => {
    if (!text.trim()) return; // Don't process empty messages
    
    setLoading(true);
    
    try {
      // Use context data to personalize responses
      const userContext = {
        authenticated: isAuthenticated,
        userData: userData,
        language: language,
        messageHistory: messages.slice(-5), // Include recent conversation history for context
        timestamp: new Date().toISOString()
      };
  
      // API-based approach (uncomment when backend API is ready)
      // const response = await fetch('/api/chatbot', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ text, userContext })
      // });
      // 
      // if (!response.ok) throw new Error(`API error: ${response.status}`);
      // const aiResponse = await response.json();
  
      // Fallback to local processing until API is ready
      const aiResponse = generateResponse(text, userContext);
  
      // Create bot response with clear typing
      const botResponse: Message = {
        text: aiResponse.response_text,
        sender: "bot",
        timestamp: new Date().toISOString(),
        options: aiResponse.suggestions || []
      };
  
      // Add the response to messages with immutable update pattern
      setMessages((prev) => [...prev, botResponse]);
  
      // Handle special actions
      if (aiResponse.intent === "human" && aiResponse.action === "transfer_to_human") {
        // Notify user and prepare for human agent handoff
        setTransferringToHuman(true);
        // In a real implementation, this would call a service to queue the conversation for a human agent
      }
  
      // Handle authentication intents across multiple languages
      const loginTerms = [
        "login", "sign in", "log in", "signin", 
        "iniciar sesión", "connexion", "登录", "entrar", 
        "anmelden", "登入", "로그인"
      ];
      
      if (loginTerms.some(term => text.toLowerCase().includes(term))) {
        handleLogin();
      }
      
      // Track analytics for the conversation
      trackChatbotInteraction(text, aiResponse.intent);
      
    } catch (error) {
      console.error("Error processing message:", error);
      
      // Add error message to the chat
      setMessages((prev) => [...prev, {
        text: "I'm having trouble processing your request right now. Please try again later.",
        sender: "bot",
        timestamp: new Date().toISOString(),
        isError: true
      }]);
      
    } finally {
      setLoading(false);
    }
  };

  // Handle user login
  const handleLogin = () => {
    // In a real app, this would open a login modal or redirect to login page
    setIsAuthenticated(true);
    setUserData({ 
      name: "John Doe", 
      patientId: "P123456", 
      lastVisit: "2025-03-15"
    });
    
    // Add bot confirmation message
    setMessages(prev => [...prev, {
      text: "You've been successfully logged in. How can I assist you now?",
      sender: "bot",
      timestamp: new Date().toISOString(),
      options: ["Book appointment", "Check my records", "Speak to a doctor"]
    }]);
  };

  // Handle sending a new message
  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;
    
    // Add user message to chat
    const userMessage: Message = {
      text: inputValue,
      sender: "user",
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Process the user input
    processUserInput(inputValue);
    
    // Clear input field
    setInputValue("");
  };

  // Handle language change
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    
    // Add language confirmation message
    const confirmationText = 
      newLanguage === "es" ? "Idioma cambiado a Español." :
      newLanguage === "fr" ? "Langue changée en Français." :
      "Language changed to English.";
      
    setMessages(prev => [...prev, {
      text: confirmationText,
      sender: "bot",
      timestamp: new Date().toISOString()
    }]);
  };

  return (
    <Card className="w-full max-w-md mx-auto h-[600px] flex flex-col">
      <CardHeader className="p-4 border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="/bot-avatar.png" alt="AI Assistant" />
              <AvatarFallback>HC</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">HealthConnect Assistant</h3>
              {transferringToHuman && (
                <p className="text-xs text-blue-500">Connecting to human agent...</p>
              )}
            </div>
          </div>
          <Tabs defaultValue="en" className="w-[120px]">
            <TabsList>
              <TabsTrigger value="en" onClick={() => handleLanguageChange("en")}>EN</TabsTrigger>
              <TabsTrigger value="es" onClick={() => handleLanguageChange("es")}>ES</TabsTrigger>
              <TabsTrigger value="fr" onClick={() => handleLanguageChange("fr")}>FR</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-lg p-3 ${
              message.sender === "user" 
                ? "bg-blue-500 text-white rounded-br-none" 
                : "bg-gray-100 dark:bg-gray-800 rounded-bl-none"
            } ${message.isError ? "bg-red-100 text-red-500 dark:bg-red-900 dark:text-red-200" : ""}`}>
              <p>{message.text}</p>
              
              {message.options && message.options.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {message.options.map((option, i) => (
                    <Button 
                      key={i} 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setInputValue(option);
                        setTimeout(() => handleSendMessage(), 100);
                      }}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
        
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] bg-gray-100 dark:bg-gray-800 rounded-lg p-3 rounded-bl-none">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 border-t">
        <div className="flex w-full gap-2">
          <Button variant="outline" size="icon">
            <Mic className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={loading || inputValue.trim() === ""}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChatbotComponent; 