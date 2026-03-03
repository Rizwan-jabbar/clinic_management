import Message from "../../model/messageModel/messageModel.js";
// ✅ Send Message
const sendMessage = async (req, res) => {
  try {
    const senderId = req.user; // logged in user
    const { receiverId, text } = req.body;

    console.log("Sender ID:", senderId);
    console.log("Receiver ID:", receiverId);
    console.log("Message Text:", text);

    if (!receiverId || !text) {
      return res.status(400).json({
        success: false,
        message: "Receiver and text are required",
      });
    }

    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      text,
    });

    res.status(201).json({
      success: true,
      data: message,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getMessages = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const userId = req.user;



    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: doctorId },
        { sender: doctorId, receiver: userId },
      ],
    })
      .populate("sender", "name role")
      .populate("receiver", "name role")
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      data: messages,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const messageController = { sendMessage, getMessages };

export default messageController;