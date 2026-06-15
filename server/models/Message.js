import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    // Who sent the message
    sender: {
      name: { type: String, required: true },
      initials: { type: String, required: true },
      gradFrom: { type: String, default: "#C0C1FF" },
      gradTo: { type: String, default: "#DDB7FF" },
      textColor: { type: String, default: "#3b0d8c" },
    },

    // Message content
    text: { type: String, required: true, trim: true },

    // Channel / room the message belongs to
    channel: {
      type: String,
      required: true,
      default: "public-channel",
      index: true,
    },

    // Message type: "sent" or "received" is determined client-side,
    // but we store the sender ID to differentiate
    type: {
      type: String,
      enum: ["text", "image", "file"],
      default: "text",
    },

    // Optional image attachments (array of URLs)
    images: [{ type: String }],

    // Read status
    read: { type: Boolean, default: false },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

// Index for fast channel + time queries
messageSchema.index({ channel: 1, createdAt: -1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;
