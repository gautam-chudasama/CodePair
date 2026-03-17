import { chatClient, streamClient } from "../lib/stream.js";
import Session from "../models/session.model.js";

export async function createSession(req, res) {
  try {
    const { problem, difficulty } = req.body;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    if (!problem || !difficulty) {
      return res.status(400).json({
        message: "Problem and difficulty are required",
      });
    }

    const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Step 1: Create session in DB
    let session;
    try {
      session = await Session.create({
        problem,
        difficulty,
        host: userId,
        callId,
      });
      console.log("✅ Session created in DB:", session._id);
    } catch (dbError) {
      console.error("❌ DB session creation failed:", dbError.message);
      return res
        .status(500)
        .json({ message: "Failed to create session in database" });
    }

    // Step 2: Create Stream video call
    try {
      await streamClient.video.call("default", callId).getOrCreate({
        data: {
          created_by_id: clerkId,
          custom: { problem, difficulty, sessionId: session._id.toString() },
        },
      });
      console.log("✅ Stream video call created:", callId);
    } catch (streamVideoError) {
      console.error(
        "❌ Stream video call creation failed:",
        streamVideoError.message,
      );
      // Clean up DB session since video call failed
      await Session.findByIdAndDelete(session._id).catch(() => {});
      return res.status(500).json({ message: "Failed to create video call" });
    }

    // Step 3: Create Stream chat channel
    try {
      const channel = chatClient.channel("messaging", callId, {
        name: `${problem} Session`,
        created_by_id: clerkId,
        members: [clerkId],
      });
      await channel.create();
      console.log("✅ Stream chat channel created:", callId);
    } catch (chatError) {
      console.error(
        "❌ Stream chat channel creation failed:",
        chatError.message,
      );
      // Don't fail the whole request for chat — session and video call are more critical
      // But log it clearly
    }

    res.status(201).json({ session });
  } catch (error) {
    console.error("❌ Error in createSession controller:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function getActiveSessions(_, res) {
  try {
    const sessions = await Session.find({ status: "active" })
      .populate("host", "name profileImage email clerkId")
      .populate("participant", "name profileImage email clerkId")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getActiveSessions controller: ", error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function getMyRecentSessions(req, res) {
  try {
    const userId = req.user._id;

    const sessions = await Session.find({
      status: "completed",
      $or: [{ host: userId }, { participant: userId }],
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getMyRecentSessions controller: ", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function getSessionById(req, res) {
  try {
    const { id } = req.params;

    const session = await Session.findById(id)
      .populate("host", "name email profileImage clerkId")
      .populate("participant", "name email profileImage clerkId");

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in getSessionById controller: ", error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function joinSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    if (session.status !== "active") {
      return res.status(400).json({
        message: "cannot join this session",
      });
    }

    if (session.host.toString() === userId.toString()) {
      return res.status(400).json({
        message: "Host cannot join as participant",
      });
    }

    if (session.participant) {
      return res.status(409).json({
        message: "Session is full",
      });
    }

    session.participant = userId;
    await session.save();

    try {
      const channel = chatClient.channel("messaging", session.callId);
      await channel.addMembers([clerkId]);
    } catch (chatError) {
      console.error(
        "❌ Failed to add member to chat channel:",
        chatError.message,
      );
      // Don't fail the join — participant is saved, chat is secondary
    }

    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in joinSession controller: ", error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function endSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    if (session.host.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Only the host can end the session",
      });
    }

    if (session.status === "completed") {
      return res.status(400).json({
        message: "Session is already completed",
      });
    }

    try {
      const call = streamClient.video.call("default", session.callId);
      await call.delete({ hard: true });
    } catch (streamErr) {
      console.error("❌ Failed to delete stream call:", streamErr.message);
    }

    try {
      const channel = chatClient.channel("messaging", session.callId);
      await channel.delete();
    } catch (chatErr) {
      console.error("❌ Failed to delete chat channel:", chatErr.message);
    }

    session.status = "completed";
    await session.save();

    res.status(200).json({
      message: "Session ended successfully",
    });
  } catch (error) {
    console.log("Error in endSession controller: ", error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}
