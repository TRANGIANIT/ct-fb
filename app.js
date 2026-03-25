document.addEventListener('DOMContentLoaded', () => {
    // === DOM Elements ===
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');
    const uploadContent = document.getElementById('uploadContent');
    const previewContainer = document.getElementById('previewContainer');
    const mediaPreview = document.getElementById('mediaPreview');
    const removeMediaBtn = document.getElementById('removeMediaBtn');
    
    const themeBtns = document.querySelectorAll('.theme-btn');
    const generateBtn = document.getElementById('generateBtn');
    
    const resultPanel = document.getElementById('resultPanel');
    const resultText = document.getElementById('resultText');
    const copyBtn = document.getElementById('copyBtn');
    
    // Audio Player Elements
    const playAudioBtn = document.getElementById('playAudioBtn');
    const audioProgress = document.getElementById('audioProgress');
    const progressBarBg = document.getElementById('progressBarBg');
    const currentTimeDisplay = document.getElementById('currentTimeDisplay');
    const downloadAudioBtn = document.getElementById('downloadAudioBtn');
    
    // Settings Elements
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');
    const apiKeyInput = document.getElementById('apiKeyInput');
    const saveKeyBtn = document.getElementById('saveKeyBtn');
    
    // Global State
    let currentTheme = 'review';
    let hasMedia = false;
    let base64Image = null; // Store image for API: data:image/...
    let isPlaying = false;
    
    // Audio Dual State
    let audioMode = 'speech'; // 'blob' (OpenAI) or 'speech' (Web Speech)
    let globalAudio = null; // HTMLAudioElement for blob
    let globalSpeech = null; // SpeechSynthesisUtterance cho fallback mượt
    let fullTextForSpeech = ""; // Chứa text cho speech progress


    // === Settings Logic ===
    const GEMINI_KEY = 'gemini_api_key_content_studio';
    const OPENAI_KEY = 'openai_tts_key_content_studio';
    const OPENAI_VOICE_KEY = 'openai_voice_key';
    const ELEVENLABS_KEY = 'elevenlabs_key_content_studio';
    const ELVENLABS_VOICE_ID_KEY = 'elevenlabs_voice_id_content_studio';
    
    // Elements for config
    const openaiKeyInput = document.getElementById('openaiKeyInput');
    const openaiVoiceSelect = document.getElementById('openaiVoiceSelect');
    const elevenlabsKeyInput = document.getElementById('elevenlabsKeyInput');
    const elevenlabsVoiceId = document.getElementById('elevenlabsVoiceId');

    // Load keys on start
    const savedKey = localStorage.getItem(GEMINI_KEY);
    if (savedKey) apiKeyInput.value = savedKey;
    
    const savedOpenAI = localStorage.getItem(OPENAI_KEY);
    if (savedOpenAI && openaiKeyInput) openaiKeyInput.value = savedOpenAI;
    const savedOpenAIVoice = localStorage.getItem(OPENAI_VOICE_KEY);
    if (savedOpenAIVoice && openaiVoiceSelect) openaiVoiceSelect.value = savedOpenAIVoice;

    const savedElevenlabs = localStorage.getItem(ELEVENLABS_KEY);
    if (savedElevenlabs && elevenlabsKeyInput) elevenlabsKeyInput.value = savedElevenlabs;
    const savedElevenlabsVoice = localStorage.getItem(ELVENLABS_VOICE_ID_KEY);
    if (savedElevenlabsVoice && elevenlabsVoiceId) elevenlabsVoiceId.value = savedElevenlabsVoice;

    settingsBtn.addEventListener('click', () => settingsModal.classList.remove('hidden'));
    closeSettingsBtn.addEventListener('click', () => settingsModal.classList.add('hidden'));
    
    saveKeyBtn.addEventListener('click', () => {
        const val = apiKeyInput.value.trim();
        const oaVal = openaiKeyInput ? openaiKeyInput.value.trim() : '';
        const oaVoice = openaiVoiceSelect ? openaiVoiceSelect.value : 'nova';
        const elVal = elevenlabsKeyInput ? elevenlabsKeyInput.value.trim() : '';
        const elVoice = elevenlabsVoiceId ? elevenlabsVoiceId.value.trim() : 'pNInz6obpgDQGcFmaJcg'; // Mặc định giọng chuẩn (Adam/Rachel... tuỳ ID)
        
        if (val) localStorage.setItem(GEMINI_KEY, val);
        else localStorage.removeItem(GEMINI_KEY);
        
        if (oaVal) localStorage.setItem(OPENAI_KEY, oaVal);
        else localStorage.removeItem(OPENAI_KEY);
        localStorage.setItem(OPENAI_VOICE_KEY, oaVoice);

        if (elVal) localStorage.setItem(ELEVENLABS_KEY, elVal);
        else localStorage.removeItem(ELEVENLABS_KEY);
        localStorage.setItem(ELVENLABS_VOICE_ID_KEY, elVoice);
        
        alert('Đã lưu các cấu hình API thành công! Giọng đọc mới sẽ được áp dụng trong lần Tạo Nội Dung tiếp theo.');
        settingsModal.classList.add('hidden');
    });

    // === Theme Selection ===
    const themePrompts = {
        review: "Viết bài review đánh giá chất lượng sản phẩm/dịch vụ/trải nghiệm trong ảnh. Giọng điệu hào hứng, khen ngợi tinh tế, có call-to-action kêu gọi click link.",
        funny: "Viết nội dung cực kỳ hài hước, tấu hài, trào phúng hoặc chế meme dựa vào chi tiết trong ảnh. Giọng điệu gen-z, lầy lội.",
        story: "Kể một câu chuyện truyền cảm hứng, xúc động hoặc tâm tình từ góc nhìn nhân vật liên quan đến bức ảnh. Giọng điệu sâu lắng, chân thành.",
        drama: "Viết nội dung giật gân, tạo sự tò mò, hóng hớt (drama) dựa vào ngữ cảnh bức ảnh. Giọng điệu gây sốc, lôi cuốn.",
        knowledge: "Chia sẻ một mẹo vặt, thủ thuật hoặc kiến thức chuyên sâu hữu ích liên quan trực tiếp đến bức ảnh. Giọng điệu chuyên gia, rõ ràng."
    };

    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            themeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTheme = btn.dataset.theme;
        });
    });

    // === Upload Logic ===
    uploadZone.addEventListener('click', (e) => {
        if (!hasMedia && !e.target.closest('.remove-btn')) {
            fileInput.click();
        }
    });

    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        if(!hasMedia) uploadZone.classList.add('dragover');
    });

    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('dragover');
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        if (!hasMedia && e.dataTransfer.files.length) {
            handleFiles(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFiles(e.target.files[0]);
        }
    });

    function handleFiles(file) {
        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
            alert('Vui lòng chọn file hình ảnh hoặc video hợp lệ!');
            return;
        }

        uploadContent.classList.add('hidden');
        previewContainer.classList.remove('hidden');
        
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                base64Image = e.target.result; // data:image/...
                mediaPreview.innerHTML = `<img src="${base64Image}" alt="Preview">`;
                hasMedia = true;
            };
            reader.readAsDataURL(file);
        } else {
            // Video extraction logic
            const videoUrl = URL.createObjectURL(file);
            const video = document.createElement('video');
            video.src = videoUrl;
            video.muted = true;
            video.controls = true;
            
            mediaPreview.innerHTML = '';
            mediaPreview.appendChild(video);
            
            hasMedia = true;

            // Extract frame after loaded metadata
            video.addEventListener('loadeddata', () => {
                video.currentTime = Math.min(1, video.duration / 2); // Seek to middle or 1s
            });

            video.addEventListener('seeked', () => {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                base64Image = canvas.toDataURL('image/jpeg', 0.8);
            }, { once: true });
        }
    }

    removeMediaBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.value = '';
        mediaPreview.innerHTML = '';
        previewContainer.classList.add('hidden');
        uploadContent.classList.remove('hidden');
        hasMedia = false;
        base64Image = null;
        resultPanel.classList.add('hidden');
        resetAllAudio();
    });

    function resetAllAudio() {
        if(globalAudio) {
            globalAudio.pause();
            globalAudio.src = '';
        }
        window.speechSynthesis.cancel();
        isPlaying = false;
        playAudioBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        audioProgress.style.width = '0%';
        const durDisp = document.getElementById('durationDisplay');
        const curDisp = document.getElementById('currentTimeDisplay');
        if(durDisp) durDisp.textContent = '...';
        if(curDisp) curDisp.textContent = '0:00';
    }

    async function getAvailableModel(apiKey) {
        try {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
            const data = await res.json();
            if (data.models) {
                // Lọc các model có hỗ trợ generateContent
                const valids = data.models.filter(m => m.supportedGenerationMethods.includes("generateContent"));
                const flash = valids.find(m => m.name.includes("1.5-flash"));
                const pro = valids.find(m => m.name.includes("1.5-pro"));
                const vision = valids.find(m => m.name.includes("pro-vision"));
                
                let chosen = flash || pro || vision || valids[0];
                if (chosen) {
                    return chosen.name.replace('models/', ''); // VD: gemini-1.5-flash
                }
            }
            return 'gemini-1.5-flash'; // Default fallback
        } catch (e) {
            return 'gemini-1.5-flash';
        }
    }

    // === Generate Logic API Call ===
    async function generateContentAI(apiKey, imageBase, theme) {
        const themeContext = themePrompts[theme];
        const promptText = `Bạn là một chuyên gia sáng tạo nội dung mạng xã hội (Viral Content Creator) hàng đầu. Hãy quan sát bức ảnh đính kèm và:\n${themeContext}\n\nHãy viết một bài đăng Facebook/TikTok hoàn chỉnh khoảng 10-15 câu ngắn ngọn, có emoji và hashtags phù hợp, lôi cuốn được người xem. Trả về ĐÚNG phần nội dung caption, tuyệt đối không thêm câu dạ vâng, chào hỏi hay phân tích.`;

        // Parse base64
        const mimeType = imageBase.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)[1];
        const base64Data = imageBase.split(',')[1];
        
        // Auto - Fetch model valid for this specific key
        const modelName = await getAvailableModel(apiKey);

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: promptText },
                        { inlineData: { mimeType: mimeType, data: base64Data } } // fix: inlineData (camelCase)
                    ]
                }]
            })
        });
            
        const data = await response.json();

        if (!response.ok || data.error) {
            throw new Error(data.error?.message || "Lỗi khi gọi API Gemini với model " + modelName);
        }
        
        return data.candidates[0].content.parts[0].text.trim();
    }

    async function generateAudioAI(text) {
        const elevenlabsKey = localStorage.getItem(ELEVENLABS_KEY);
        const openaiKey = localStorage.getItem(OPENAI_KEY);
        
        let cleanText = text.replace(/[#"*]/g, '').trim();

        // Ưu tiên 1: ElevenLabs (Voice Cloning Siêu chân thực)
        if (elevenlabsKey) {
            try {
                let elText = cleanText.substring(0, 1000);
                const voiceId = localStorage.getItem(ELVENLABS_VOICE_ID_KEY) || 'pNInz6obpgDQGcFmaJcg';
                // model: eleven_multilingual_v2 hoạt động cực mượt với Tiếng Việt
                const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'audio/mpeg',
                        'Content-Type': 'application/json',
                        'xi-api-key': elevenlabsKey
                    },
                    body: JSON.stringify({
                        text: elText,
                        model_id: "eleven_multilingual_v2",
                        voice_settings: { stability: 0.5, similarity_boost: 0.75 }
                    })
                });

                if (res.ok) {
                    const blob = await res.blob();
                    return { type: 'blob', url: URL.createObjectURL(blob), text: elText };
                } else {
                    console.error("ElevenLabs TTS Error", await res.text());
                }
            } catch (err) {
                console.error("Failed to generate ElevenLabs audio", err);
            }
        }

        // Ưu tiên 2: OpenAI TTS (Nhiều lựa chọn giọng)
        if (openaiKey) {
            try {
                let openaiText = cleanText.substring(0, 500); // Mở rộng limit cho OpenAI
                const chosenVoice = localStorage.getItem(OPENAI_VOICE_KEY) || 'nova';
                
                const res = await fetch("https://api.openai.com/v1/audio/speech", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${openaiKey}`
                    },
                    body: JSON.stringify({
                        model: "tts-1",
                        voice: chosenVoice,
                        input: openaiText
                    })
                });

                if (res.ok) {
                    const blob = await res.blob();
                    return { type: 'blob', url: URL.createObjectURL(blob), text: openaiText };
                } else {
                    console.error("OpenAI TTS Error", await res.text());
                }
            } catch (err) {
                console.error("Failed to generate OpenAI audio", err);
            }
        }
        
        // Cấp cuối (Mặc định offline): Trả về Web Speech API Native
        return { type: 'speech', text: cleanText };
    }

    // === Generate Button Action ===
    generateBtn.addEventListener('click', async () => {
        if (!hasMedia || !base64Image) {
            alert('Vui lòng tải lên một hình ảnh hoặc chờ hệ thống load xong video!');
            return;
        }

        const apiKey = localStorage.getItem(GEMINI_KEY);
        if (!apiKey) {
            settingsModal.classList.remove('hidden');
            return;
        }

        generateBtn.classList.add('generating');
        resultPanel.classList.remove('hidden');
        resultPanel.style.opacity = '0.5';
        
        resultText.value = 'Hệ thống Gemini 1.5 đang quét hình ảnh và sáng tạo nội dung... Vui lòng đợi trong giây lát...';
        resetAllAudio(); // Clear existings

        try {
            // 1. Generate Text (Gemini 1.5 Flash Vision)
            const textContent = await generateContentAI(apiKey, base64Image, currentTheme);
            resultText.value = textContent;
            
            // 2. Setup Audio Logic
            document.querySelector('.custom-audio-player .time-info').innerHTML = '<span style="color:var(--accent)"><i class="fa-solid fa-spinner fa-spin"></i> Đang nạp âm thanh...</span>';
            const audioData = await generateAudioAI(textContent);
            
            // Re-setup Player based on Audio Mode
            audioMode = audioData.type;
            
            const durDisp = document.getElementById('durationDisplay');
            const curDisp = document.getElementById('currentTimeDisplay');
            
            if (audioMode === 'blob') {
                globalAudio = document.createElement('audio');
                globalAudio.src = audioData.url;
                globalAudio.load();
                setupBlobAudioListeners();
                
                downloadAudioBtn.onclick = () => {
                    const a = document.createElement('a');
                    a.href = audioData.url;
                    a.download = `AI_Audio_${new Date().getTime()}.mp3`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                };
            } else {
                // SpeechSynthesis mode setup
                fullTextForSpeech = audioData.text;
                globalSpeech = new SpeechSynthesisUtterance(fullTextForSpeech);
                globalSpeech.lang = 'vi-VN';
                // Pick best voice if possible
                const voices = window.speechSynthesis.getVoices();
                const viVoice = voices.find(v => v.lang.includes('vi'));
                if(viVoice) globalSpeech.voice = viVoice;
                
                setupSpeechEventListeners();
                
                downloadAudioBtn.onclick = () => {
                    alert('Lưu ý: Bạn đang sử dụng giọng đọc máy (Trình duyệt nội bộ) không xuất file được. Vui lòng nhập OpenAI Key vào mục Cài đặt nếu muốn thu âm và Tải audio tự nhiên xuất file chất lượng nhé!');
                };
                
                document.querySelector('.custom-audio-player .time-info').innerHTML = '<span id="currentTimeDisplay">0%</span> / <span id="durationDisplay">Tiến độ</span>';
            }
            
        } catch (error) {
            alert('Lỗi API: ' + error.message);
            resultText.value = 'Đã có lỗi xảy ra. Hãy kiểm tra lại API Key Gemini của bạn.\nLỗi: ' + error.message;
            document.querySelector('.custom-audio-player .time-info').innerHTML = '<span>Lỗi phát thanh</span>';
        } finally {
            generateBtn.classList.remove('generating');
            resultPanel.style.opacity = '1';
            if(window.innerWidth < 900) {
                resultPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });

    // === Tools & Interactivity ===

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(resultText.value).then(() => {
            const icon = copyBtn.querySelector('i');
            icon.className = 'fa-solid fa-check';
            icon.style.color = '#00F0FF';
            setTimeout(() => {
                icon.className = 'fa-regular fa-copy';
                icon.style.color = '';
            }, 2000);
        });
    });

    // === Audio Player Dual Control ===
    
    function formatTime(seconds) {
        if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }

    // Blob Audio Setup
    function setupBlobAudioListeners() {
        globalAudio.addEventListener('loadedmetadata', () => {
            const dur = globalAudio.duration;
            document.querySelector('.custom-audio-player .time-info').innerHTML = '<span id="currentTimeDisplay">0:00</span> / <span id="durationDisplay">' + formatTime(dur) + '</span>';
        });

        globalAudio.addEventListener('timeupdate', () => {
            const curr = globalAudio.currentTime;
            const dur = globalAudio.duration;
            if (dur && isFinite(dur)) {
                audioProgress.style.width = ((curr / dur) * 100) + '%';
                const curDisp = document.getElementById('currentTimeDisplay');
                if (curDisp) curDisp.textContent = formatTime(curr);
            }
        });

        globalAudio.addEventListener('ended', () => {
            isPlaying = false;
            playAudioBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
            audioProgress.style.width = '0%';
        });

        globalAudio.addEventListener('error', () => {
           console.error('Audio playback failed.');
           const durDisp = document.getElementById('durationDisplay');
           if(durDisp) durDisp.textContent = 'Lỗi file';
        });
    }

    // Speech Setup
    function setupSpeechEventListeners() {
        globalSpeech.onstart = () => {
            isPlaying = true;
            playAudioBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        };
        
        globalSpeech.onpause = () => {
            isPlaying = false;
            playAudioBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        };
        
        globalSpeech.onresume = () => {
            isPlaying = true;
            playAudioBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        };

        globalSpeech.onboundary = (e) => {
            if (fullTextForSpeech.length > 0) {
                const percent = (e.charIndex / fullTextForSpeech.length) * 100;
                audioProgress.style.width = percent + '%';
                const curDisp = document.getElementById('currentTimeDisplay');
                if (curDisp) curDisp.textContent = Math.round(percent) + '%';
            }
        };

        globalSpeech.onend = () => {
            isPlaying = false;
            playAudioBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
            audioProgress.style.width = '0%';
            const curDisp = document.getElementById('currentTimeDisplay');
            if (curDisp) curDisp.textContent = '0%';
        };
    }

    playAudioBtn.addEventListener('click', () => {
        if (audioMode === 'blob') {
            if (!globalAudio) return;
            if (isPlaying) {
                globalAudio.pause();
                isPlaying = false;
                playAudioBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
            } else {
                globalAudio.play().catch(e => console.error("Play failed", e));
                isPlaying = true;
                playAudioBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
            }
        } else if (audioMode === 'speech') {
            if (!globalSpeech) return;
            if (isPlaying) {
                window.speechSynthesis.pause();
                // Fix for pause bug on some browsers triggering event incorrectly
                isPlaying = false;
                playAudioBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
            } else {
                // Determine if we are paused or stopped
                if (window.speechSynthesis.paused) {
                    window.speechSynthesis.resume();
                } else {
                    window.speechSynthesis.cancel(); // restart
                    window.speechSynthesis.speak(globalSpeech);
                }
                isPlaying = true;
                playAudioBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
            }
        }
    });

    // Seek Audio
    progressBarBg.addEventListener('click', (e) => {
        const rect = progressBarBg.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        let p = clickX / width;
        if(p < 0) p = 0;
        if(p > 1) p = 1;
        
        if (audioMode === 'blob' && globalAudio && isFinite(globalAudio.duration)) {
            globalAudio.currentTime = p * globalAudio.duration;
        } else if (audioMode === 'speech') {
            // SpeechSynthesis cannot seek. We intercept click to notify
            alert("Giọng đọc Trình duyệt nội bộ không hỗ trợ tua Audio. Hãy nhập OpenAI Key vào mục Cài đặt để mở full tính năng Audio Pro.");
        }
    });

    // Handle export btn
    const exportContentBtn = document.getElementById('exportContentBtn');
    exportContentBtn.addEventListener('click', () => {
        alert('Phần chữ, bạn có thể sao chép trực tiếp. Phần Audio có thể lấy bằng nút Tải xuống (nếu dùng OpenAI API)! Tính năng tự động trộn Video sẽ cập nhật sau nhé!');
    });
});
