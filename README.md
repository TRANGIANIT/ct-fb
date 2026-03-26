# AI Content Studio 🎨🤖

[English](#english) | [Tiếng Việt](#tiếng-việt) | [日本語](#日本語)

---

## Tiếng Việt

**AI Content Studio** là một ứng dụng Web đẳng cấp được xây dựng trên nền tảng Frontend thuần (HTML, CSS Glassmorphism, Vanilla JS) giúp tự động hóa quá trình sáng tạo nội dung cho mạng xã hội (Facebook, TikTok, Instagram) chỉ từ một bước thao tác tải ảnh hoặc video.

### 🌟 Tính năng nổi bật
- **Upload Đa Phương Tiện (Multi-Media):** Hỗ trợ kéo & thả tải lên vô số hình ảnh hoặc trích xuất tự động khung hình từ Video MP4.
- **Trình chiếu dạng Slide (Slider UI):** Giao diện Xem ảnh cận cảnh, kết hợp dải Thumbnail dạng lưới bên dưới vô cùng trực quan.
- **Drag & Drop Timeline (Sắp xếp Dòng thời gian):** Nhấn giữ để kéo thả đổi vị trí các bức ảnh. AI sẽ tự động phân tích và kể chuyện theo đúng luồng thời gian (Timeline) mà bạn sắp xếp!
- **Tích hợp Trí tuệ Nhân tạo (Google Gemini Vision 1.5):** Phân tích cực mạnh bối cảnh từ loạt hình ảnh để viết ra Bài đăng (Content) cực bắt trend, chứa đủ Emoji & Hashtag. Hỗ trợ nhập lệnh `Prompt Tùy Chỉnh` để AI viết y hệt ý đồ người dùng.
- **Hệ thống Audio Đa Lớp (Dual Audio System):**
  1. Hỗ trợ ghép API của **ElevenLabs** (Cho phép Voice Cloning - giả lập lại 100% giọng thật của bạn).
  2. Hỗ trợ API của **OpenAI TTS** (Cho ra chất giọng Nova, Alloy truyền cảm...).
  3. Tính năng nội bộ **Web Speech API** (Miễn phí, không tốn Token, phát âm The Text To Speech ngay tại trình duyệt).
- **Lưu trữ bảo mật:** Tất cả cấu hình API Keys đều lưu trực tiếp dưới máy tính (`localStorage`), không có backend ở giữa đọc trộm dữ liệu.

### 🚀 Cài đặt & Sử dụng
1. Tải toàn bộ Source Code về máy tính.
2. Mở Terminal / CMD tại thư mục dự án và khởi chạy Web Server nội bộ (Ví dụ: `python3 -m http.server 8000`).
3. Mở trình duyệt và truy cập vào địa chỉ `http://localhost:8000/`.
4. Bấm vào nút cài đặt `Cấu hình AI` góc trên phải để nhập **Gemini API Key** (và tuỳ chọn OpenAI/ElevenLabs nếu cần), chọn Theme tuỳ chỉnh ở danh sách và bấm Tạo nội dung!

---

## English

**AI Content Studio** is a premium Web application built with raw Front-end tech (HTML, CSS Glassmorphism, Vanilla JS) that automates the whole social media content creation process (Facebook, TikTok, Instagram) using your uploaded images or videos.

### 🌟 Key Features
- **Multi-Media Upload:** Supports Drag & Drop for uploading multiple images or automatically extracting frames from MP4 Videos.
- **Premium Slider UI:** Cinematic Main Slide viewer along with an intuitive Image Thumbnail strip at the bottom.
- **Drag & Drop Timeline Reordering:** Press & hold to drag, drop and reorder your thumbnails visually. The AI will strictly follow your rearranged timeline flow to write sequential stories!
- **Google Gemini 1.5 Multimodal AI:** Deep contextual analysis over multiple image arrays to craft viral, trend-following captions with inclusive Emojis & Hashtags. Fully supports specific `Custom Prompts`.
- **Dual Audio System:**
  1. Integrates with **ElevenLabs API** (Empowering Voice Cloning—100% realism of your cloned speaking voice).
  2. Integrates with **OpenAI TTS API** (Rich, vivid audio voices like Nova, Alloy, and Echo).
  3. Integrated **Web Speech API fallback** (Free audio, zero-token cost directly via browser engine).
- **Hardcore Privacy:** No backend proxy server. APIs keys safely stored in local browser cache (`localStorage`) — fully client-side secured.

### 🚀 Getting Started
1. Clone bounds / Download this repository.
2. Open a Terminal inside over the exact project repository folder and spawn a local internal HTTP server (e.g., `python3 -m http.server 8000`).
3. Journey to your web browser and navigate to `http://localhost:8000/`.
4. Tap the Settings icon on the top right, insert your **Google Gemini API Key** (and TTS Keys if needed), pick any theme, optionally input a Custom Prompt, and hit Generate!

---

## 日本語

**AI Content Studio（AIコンテンツスタジオ）** は、画像や動画をアップロードするだけで、SNS（Facebook、TikTok、Instagram）向けのコンテンツ作成を自動化する、HTML/CSS (グラスモーフィズム) / Vanilla JS だけで構築されたプレミアムウェブアプリケーションです。

### 🌟 主な機能
- **マルチメディアアップロード:** 画像の複数選択（ドラッグ＆ドロップ）や、MP4動画からの自動フレーム抽出をサポート。
- **スライダーUI表示:** 大画面のスライダーと直感的なサムネイルストリップの組み合わされた美しいUI。
- **ドラッグ＆ドロップ タイムライン (並び替え):** サムネイルをドラッグ＆ドロップして画像の順番を自由に変更可能。AIはあなたが整理した順序（タイムライン）の文脈に従ってストーリーを作成します！
- **Google Gemini 1.5 マルチモーダルAI:** 複数の画像の文脈を分析し、絵文字やハッシュタグを含むバイラル効果の高いキャプションを生成。「カスタムプロンプト」を入力してAIの書き方を完全に制御することも可能。
- **高度な音声再生システム (Dual Audio):**
  1. **ElevenLabs API** 対応（自分の声の完全クローン機能「Voice Cloning」や多言語超高音質TTSに対応）。
  2. **OpenAI TTS API** 対応（Nova, Alloy等の感情豊かなAI音声）。
  3. **Web Speech API** の標準搭載（APIキー不要、ブラウザ単体で完結する完全無料の音声機能）。
- **完全なプライバシー:** バックエンドなし。入力されたAPIキーはすべてブラウザの内部(`localStorage`)に安全に保存されます。

### 🚀 インストール & 使い方
1. プロジェクトのソースコードをダウンロードします。
2. ターミナルで本ディレクトリを開き、ローカルサーバーを起動します。（例: `python3 -m http.server 8000`）。
3. ブラウザで `http://localhost:8000/` にアクセスします。
4. 右上の「AI設定」ボタンから **Gemini API Key** を入力後、テーマを選択（またはご自身のカスタム要件を入力）し、ワンクリックでコンテンツを生成しましょう！
