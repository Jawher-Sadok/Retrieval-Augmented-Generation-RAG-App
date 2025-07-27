// src/utils/chatUtils.ts
import axios from 'axios';

export interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    sources?: string[];
    feedback?: 'positive' | 'negative';
}

// Enhanced RAG function using FastAPI backend
export const generateResponse = async (userInput: string): Promise<{ answer: string; sources?: string[] }> => {
  console.log('Sending query:', userInput);  
  try {
        const response = await axios.post('http://localhost:8000/query/', { question: userInput });
        const { answer, sources } = response.data;
        return { answer, sources }; // Return both answer and sources
    } catch (error) {
        console.error('Error fetching response:', error);
        return { answer: "Sorry, I couldn't process your request. Please try again or upload a document for more context." };
    }
};

// Utility function to extract keywords for better matching (can be used for local preprocessing if needed)
export const extractKeywords = (text: string): string[] => {
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'how', 'what', 'where', 'when', 'why', 'is', 'are', 'was', 'were', 'do', 'does', 'did', 'can', 'could', 'should', 'would', 'i', 'you', 'he', 'she', 'it', 'we', 'they'];
    
    return text.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 2 && !stopWords.includes(word));
};