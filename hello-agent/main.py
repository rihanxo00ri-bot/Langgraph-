import os
import base64
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from langchain_core.messages import HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from graph import coding_graph
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()

# Fast model dedicated to transcribing your voice clip
transcriber_llm = ChatGoogleGenerativeAI(model="gemini-3.8-flash", temperature=0)

class BuildRequest(BaseModel):
    prompt: str
    thread_id: str = "voice-session-1"

@app.post("/build")
async def build_site(request: BuildRequest):
    config = {"configurable": {"thread_id": request.thread_id}}
    final_state = await coding_graph.ainvoke(
        {"messages": [HumanMessage(content=request.prompt)]},
        config=config
    )
    return {"reply": final_state["messages"][-1].content}

@app.post("/voice")
async def voice_command(audio: UploadFile = File(...), thread_id: str = "voice-session-1"):
    # 1. Read the recorded audio bytes from the browser
    audio_bytes = await audio.read()
    audio_b64 = base64.b64encode(audio_bytes).decode("utf-8")

    # 2. Ask Gemini to transcribe the audio directly
    transcribe_msg = HumanMessage(content=[
        {"type": "text", "text": "Transcribe this audio command accurately. Return ONLY the spoken words, nothing else."},
        {"type": "media", "mime_type": audio.content_type or "audio/webm", "data": audio_b64}
    ])
    transcription_res = await transcriber_llm.ainvoke([transcribe_msg])
    spoken_text = transcription_res.content.strip()

    # 3. Pass the transcribed command into your LangGraph coding agent
    config = {"configurable": {"thread_id": thread_id}}
    final_state = await coding_graph.ainvoke(
        {"messages": [HumanMessage(content=spoken_text)]},
        config=config
    )

    return {
        "transcript": spoken_text,
        "reply": final_state["messages"][-1].content
    }

@app.get("/", response_class=HTMLResponse)
async def voice_ui():
    return """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>VoiceDev AI Coding Agent</title>
        <style>
            body { font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            .card { background: #1e293b; padding: 2.5rem; border-radius: 1rem; text-align: center; width: 450px; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
            button { background: #3b82f6; color: white; border: none; padding: 0.9rem 1.8rem; font-size: 1rem; border-radius: 999px; cursor: pointer; transition: 0.2s; font-weight: 600; }
            button:hover { background: #2563eb; }
            button.recording { background: #ef4444; animation: pulse 1.2s infinite; }
            @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(239,68,68,0.7); } 70% { box-shadow: 0 0 0 15px rgba(239,68,68,0); } 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); } }
            .input-row { display: flex; gap: 0.5rem; margin-top: 1.5rem; }
            input { flex: 1; padding: 0.75rem 1rem; border-radius: 999px; border: 1px solid #334155; background: #0f172a; color: white; outline: none; }
            #transcript { margin-top: 1.2rem; color: #94a3b8; font-style: italic; min-height: 1.5rem; }
            #reply { margin-top: 1rem; color: #38bdf8; font-weight: 500; }
        </style>
    </head>
    <body>
        <div class="card">
            <h2>🎙️ VoiceDev AI</h2>
            <p>Click to record your command, click again to send.</p>
            <button id="micBtn">Start Recording</button>

            <div class="input-row">
                <input type="text" id="textInput" placeholder="Or type command here..." />
                <button id="sendBtn">Send</button>
            </div>

            <div id="transcript">Waiting for command...</div>
            <div id="reply"></div>
        </div>

        <script>
            const micBtn = document.getElementById('micBtn');
            const textInput = document.getElementById('textInput');
            const sendBtn = document.getElementById('sendBtn');
            const transcriptDiv = document.getElementById('transcript');
            const replyDiv = document.getElementById('reply');

            let mediaRecorder;
            let audioChunks = [];
            let isRecording = false;

            function speakReply(text) {
                const speech = new SpeechSynthesisUtterance(text);
                window.speechSynthesis.speak(speech);
            }

            async function sendTextCommand(command) {
                if (!command.trim()) return;
                micBtn.textContent = 'Thinking & Coding...';
                transcriptDiv.textContent = `You: "${command}"`;
                replyDiv.textContent = '';

                try {
                    const res = await fetch('/build', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ prompt: command })
                    });
                    const data = await res.json();
                    replyDiv.textContent = `Agent: ${data.reply}`;
                    speakReply(data.reply);
                } catch (err) {
                    replyDiv.textContent = `Error: ${err.message}`;
                } finally {
                    micBtn.textContent = 'Start Recording';
                }
            }

            sendBtn.onclick = () => { sendTextCommand(textInput.value); textInput.value = ''; };
            textInput.onkeypress = (e) => { if (e.key === 'Enter') sendBtn.onclick(); };

            micBtn.onclick = async () => {
                if (!isRecording) {
                    try {
                        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                        mediaRecorder = new MediaRecorder(stream);
                        audioChunks = [];

                        mediaRecorder.ondataavailable = (e) => {
                            if (e.data.size > 0) audioChunks.push(e.data);
                        };

                        mediaRecorder.onstop = async () => {
                            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                            const formData = new FormData();
                            formData.append('audio', audioBlob, 'command.webm');

                            micBtn.textContent = 'Transcribing & Coding...';
                            transcriptDiv.textContent = 'Processing voice...';

                            try {
                                const res = await fetch('/voice', { method: 'POST', body: formData });
                                const data = await res.json();
                                transcriptDiv.textContent = `You: "${data.transcript}"`;
                                replyDiv.textContent = `Agent: ${data.reply}`;
                                speakReply(data.reply);
                            } catch (err) {
                                replyDiv.textContent = `Error: ${err.message}`;
                            } finally {
                                micBtn.textContent = 'Start Recording';
                            }
                        };

                        mediaRecorder.start();
                        isRecording = true;
                        micBtn.classList.add('recording');
                        micBtn.textContent = 'Stop & Send';
                        transcriptDiv.textContent = 'Recording... speak your command!';
                    } catch (err) {
                        transcriptDiv.textContent = `Mic access denied: ${err.message}`;
                    }
                } else {
                    mediaRecorder.stop();
                    isRecording = false;
                    micBtn.classList.remove('recording');
                }
            };
        </script>
    </body>
    </html>
    """