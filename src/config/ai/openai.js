const OpenAi = require("openai");
const VARIABLES = require("..");
const User = require("../../modules/user/user.model");
const Wallpaper = require("../../modules/wallpaper/wallpaper.model");
const { agent_data } = require("./agentData");
const Profile = require("../../modules/profile/profile.model");

const openai = new OpenAi({
  apiKey: VARIABLES.OPENAI_API_KEY,
});

const generateAIAssistantMessage = async (messages = []) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are WPS Assistant, an AI assistant for admin tasks. You only assist with the given Mongoose models: "User", "Profile" and "Wallpaper", . If asked about anything else, respond politely that you cannot help. Your responses must be MongoDB aggregation queries.
  
            Please respond in the following JSON format:
            {
                "model": "",  -> "User", "Profile", "Wallpaper" or null (if not type Query)
                "query": "<your aggregation query>",  
                "message": "<optional message>",  
                "type": "",  -> "Query", "Message", "Need_data"
            }
  
            Schema models:
            ${agent_data.modelsForAiAgent}
  
            Note: Your response must fit within max_tokens: 500.
            `,
        },
        ...messages,
      ],
      max_tokens: 500,
      response_format: { type: "json_object" },
    });

    if (!response?.choices?.length || !response?.choices[0]?.message?.content) {
      return {
        success: false,
        message: "AI did not return a valid response.",
        error: "Empty response from AI",
      };
    }

    let message;
    try {
      message = JSON.parse(response.choices[0].message.content);
    } catch (jsonError) {
      console.error("JSON Parsing Error:", jsonError);
      return {
        success: false,
        message: "AI response format error.",
        error: jsonError.message,
      };
    }

    console.log("Message: ", message);

    let result = null;
    if (message?.type === "Query" && message.query) {
      try {
        if (message.model === "User") {
          result = await User.aggregate(message.query);
        } else if (message.model === "Profile") {
          result = await Profile.aggregate(message.query);
        } else if (message.model === "Wallpaper") {
          result = await Wallpaper.aggregate(message.query);
        }
      } catch (dbError) {
        return {
          success: false,
          message: "Database query execution failed.",
          error: dbError.message,
        };
      }
    }
    return {
      success: true,
      message: "Message generated successfully",
      ai_response: message,
      description: message.message,
      result: result,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to generate message.",
      error: error.message,
    };
  }
};

module.exports = {
  generateAIAssistantMessage,
};
