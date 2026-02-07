
import { GoogleGenAI } from "@google/genai";
import { UserProfile, Post, ContentPillar } from "../types";

/**
 * DATABASE SERVICE (Currently LocalStorage, Ready for Cloud)
 */
export const db = {
  getUsers: (): UserProfile[] => {
    return JSON.parse(localStorage.getItem('wco_users') || '[]');
  },

  saveUser: (user: UserProfile) => {
    const users = db.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index > -1) {
      users[index] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem('wco_users', JSON.stringify(users));
  },

  getSession: (): UserProfile | null => {
    const stored = localStorage.getItem('wco_session');
    return stored ? JSON.parse(stored) : null;
  },

  setSession: (user: UserProfile | null) => {
    if (user) {
      localStorage.setItem('wco_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('wco_session');
    }
  },

  getPosts: (fallback: Post[]): Post[] => {
    const stored = localStorage.getItem('wco_posts');
    return stored ? JSON.parse(stored) : fallback;
  },

  savePosts: (posts: Post[]) => {
    localStorage.setItem('wco_posts', JSON.stringify(posts));
  }
};

/**
 * AI SERVICE (Gemini Integration)
 */
export const medAI = {
  getClinicalInsight: async (post: Post, user: UserProfile): Promise<string> => {
    // Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key from the environment.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are a Senior Medical Resident acting as a mentor for ${user.year}. 
        Analyze this medical post and provide a high-yield "Senior Pearl".
        Post Title: ${post.title}
        Post Content: ${post.content}
        
        Focus on:
        1. Brief pathophysiology explanation.
        2. One common "trap" or "pitfall" in board exams or clinical practice.
        3. A mnemonic if applicable.
        Keep the tone professional, encouraging, and concise.`,
        config: {
          temperature: 0.7,
          maxOutputTokens: 300
        }
      });
      // response.text is a property, not a method.
      return response.text || "I'm currently reviewing the latest literature. Please try again in a moment, doctor.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Unable to consult the AI library at this moment. Check your connectivity.";
    }
  },

  // Fix: Added generateMedicalVideo method to handle Veo video generation for medical simulations.
  // This resolves the compilation error in components/VideoLab.tsx where medAI.generateMedicalVideo was undefined.
  generateMedicalVideo: async (
    prompt: string, 
    aspectRatio: '16:9' | '9:16', 
    onStatusChange: (status: string) => void
  ): Promise<string> => {
    // Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      onStatusChange("Connecting to Simulation Engine...");
      
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: `High-fidelity medical education simulation of: ${prompt}. Detailed anatomical visualization suitable for clinicians.`,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: aspectRatio
        }
      });

      // Clear and reassuring messages to display on the loading screen to improve UX during long generation times.
      const statuses = [
        "Synthesizing anatomical geometry...",
        "Simulating physiological interactions...",
        "Rendering cellular dynamics...",
        "Applying clinical lighting models...",
        "Validating visual accuracy...",
        "Encoding final simulation sequence..."
      ];
      let statusIdx = 0;

      while (!operation.done) {
        onStatusChange(statuses[statusIdx % statuses.length]);
        statusIdx++;
        
        // Wait 10 seconds between polling attempts to check operation status.
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      onStatusChange("Retrieving final simulation...");
      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      
      if (!downloadLink) {
        throw new Error("Simulation output was not found. Please try a different prompt.");
      }

      // Append the API key when fetching from the download link as required for Veo output access.
      const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
      if (!response.ok) {
        throw new Error("Failed to download simulation data from the server.");
      }
      
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error: any) {
      console.error("Simulation Lab Error:", error);
      throw error;
    }
  }
};
