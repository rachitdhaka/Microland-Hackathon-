const { GoogleGenAI } = require("@google/genai");
const User = require("../models/User");

/**
 * @desc    Find matching users based on AI analysis of skills and bio
 * @route   POST /api/users/match
 * @access  Public (or Private if auth is added)
 */
exports.matchUsers = async (req, res) => {
  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({
        success: false,
        message: "Please provide a description of the person you are looking for.",
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "AI matching is currently unavailable (API key missing).",
      });
    }

    // Initialize Gemini with the new SDK
    // The SDK automatically uses GEMINI_API_KEY from process.env if available,
    // but we can also pass it explicitly if needed.
    const ai = new GoogleGenAI({ apiKey: apiKey.trim() });

    // Fetch all users
    const users = await User.find({}, "name email skills bio availability");
    console.log(`AI Match: Found ${users.length} users in DB.`);

    if (users.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No users found in the database.",
      });
    }

    // Prepare user data for matching
    const userData = users.map((u) => ({
      id: u._id,
      name: u.name,
      skills: u.skills.join(", "),
      bio: u.bio,
      availability: u.availability,
    }));

    const prompt = `
      You are an AI Talent Matcher for a hackathon platform called Microland.
      Your goal is to find the best potential teammates based on a user's description.

      Search Description: "${description}"

      Available Users:
      ${JSON.stringify(userData, null, 2)}

      Task:
      1. Analyze each user's skills and bio against the search description.
      2. Rank them based on relevance.
      3. Return a JSON array of objects containing:
         - userId: The user's ID
         - matchScore: A score from 0 to 100
         - reasoning: A short, 1-sentence explanation of why they are a good match.

      CRITICAL SAFETY RULE: 
      If the 'Search Description' is UNRELATED to finding a teammate, hackathon projects, technology, or skills (e.g., general knowledge questions like "who is the PM of India", "what is covid 19", "how are you", jokes, or general chatting), you MUST return an EMPTY ARRAY: []. 
      This is strictly a matchmaking service for the Microland hackathon. Do NOT attempt to answer unrelated questions or match them to users if the intent is not to find a teammate.

      Important: Return ONLY the JSON array, no other text or formatting.
    `;

    console.log("AI Match: Sending request to gemini-2.5-flash...");
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    const responseText = response.text;
    console.log("AI Match: Gemini response received.");
    
    // Extract JSON from potentially markdown-fenced response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Failed to parse AI response as JSON");
    }
    
    const rankings = JSON.parse(jsonMatch[0]);

    // If AI determined it's out of context, it returns []
    if (rankings.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "Give me a relevant Query",
      });
    }

    // Map rankings back to user objects
    const matchedUsers = rankings
      .filter(r => r.matchScore > 20) // Filter out low matches
      .sort((a, b) => b.matchScore - a.matchScore)
      .map(r => {
        const user = users.find(u => u._id.toString() === r.userId.toString());
        return user ? {
          ...user.toObject(),
          matchScore: r.matchScore,
          reasoning: r.reasoning
        } : null;
      })
      .filter(Boolean);

    res.status(200).json({
      success: true,
      data: matchedUsers,
    });
  } catch (error) {
    console.error("AI Match Error details:", error);
    let errorMessage = "An error occurred during AI matching.";
    
    if (error.status === 404) {
      errorMessage = "AI Model not found (404). The requested model 'gemini-2.5-flash' might be unavailable.";
    } else if (error.status === 403) {
      errorMessage = "AI Access denied (403). Please check your API key permissions.";
    } else if (error.status === 429) {
      errorMessage = "AI Quota exceeded (429). Please try again in a few minutes.";
    }

    res.status(500).json({
      success: false,
      message: errorMessage,
      error: error.message,
    });
  }
};
