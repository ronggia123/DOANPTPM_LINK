const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Đọc dữ liệu FAQ
const faqPath = path.join(__dirname, "data", "faq.json");
const faqData = JSON.parse(fs.readFileSync(faqPath, "utf-8"));

// Hàm tìm câu trả lời
function getReply(message) {
  const msg = message.toLowerCase().trim();

  for (let item of faqData) {
    for (let keyword of item.keywords) {
      if (msg.includes(keyword.toLowerCase())) {
        return item.answer;
      }
    }
  }

  return "Xin lỗi, tôi chưa hiểu câu hỏi của bạn 😅. Bạn có thể hỏi về: đăng ký môn, tín chỉ, lịch học, học phí, điểm, quên mật khẩu...";
}

// API chatbot
app.post("/chat", (req, res) => {
  const userMessage = req.body.message || "";
  const reply = getReply(userMessage);
  res.json({ reply });
});

// Route mặc định
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// BẮT BUỘC phải có đoạn này để server chạy
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});