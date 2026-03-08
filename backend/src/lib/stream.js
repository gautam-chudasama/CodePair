import dotenv from "dotenv";
dotenv.config({ quiet: true });
import { StreamClient } from "@stream-io/node-sdk";
import { StreamChat } from "stream-chat";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.log("STREAM_API_KEY and STREAM_API_SECRET must be set");
}

export const streamClient = new StreamClient(apiKey, apiSecret);
export const chatClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
  try {
    await chatClient.upsertUser(userData);
    console.log("Stream user upserted successfully", userData);
  } catch (error) {
    console.log("Error upserting stream user: ", error);
  }
};

export const deleteStreamUser = async (userId) => {
  try {
    await chatClient.deleteUser(userId);
    console.log("Stream user deleted successfully", userId);
  } catch (error) {
    console.log("Error deleting stream user: ", error);
  }
};
