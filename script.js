/**
 * Get references to DOM elements used in the app
 */
const text = document.getElementById("input");
const convertBtn = document.getElementById("convertBtn");
const voiceSelect = document.getElementById("voiceSelect");
const error = document.querySelector(".errors");

const pauseBtn = document.getElementById("pauseBtn");
const resumeBtn = document.getElementById("resumeBtn");
const stopBtn = document.getElementById("stopBtn");

/**
 * Array to hold available speech synthesis voices
 */
let voices = [];

/**
 * Populate the voice selection dropdown with available voices
 */
function populateVoiceList() {
    voices = speechSynthesis.getVoices();

    // Clear existing options
    voiceSelect.innerHTML = "";

    // Add each voice as an option in the dropdown
    voices.forEach((voice, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = `${voice.name} (${voice.lang})${voice.default ? " — DEFAULT" : ""}`;
        voiceSelect.appendChild(option);
    });

    // Select the default voice if available
    const defaultVoiceIndex = voices.findIndex(v => v.default);
    if (defaultVoiceIndex !== -1) {
        voiceSelect.value = defaultVoiceIndex;
    }
}

/* Update voice list when voices change (e.g., on some browsers)
Ensures voice list updates dynamically */
speechSynthesis.onvoiceschanged = populateVoiceList;

/**
 * Event listener for the convert button to start speech synthesis
 */
convertBtn.addEventListener("click", function () {
    const enteredText = text.value.trim();

    // Validate input text
    if (!enteredText) {
        error.textContent = "Nothing to Convert! Enter text in the text area.";
        return;
    }

    // Clear any previous error message
    error.textContent = "";

    // Create a new speech synthesis utterance
    const utter = new SpeechSynthesisUtterance(enteredText);

    // Set the selected voice if available
    const selectedVoice = voices[voiceSelect.value];
    if (selectedVoice) {
        utter.voice = selectedVoice;
    }

    // Update button text to indicate speech is playing
    convertBtn.textContent = "Sound is Playing...";

    // Reset button text when speech ends
    utter.onend = () => {
        convertBtn.textContent = "Play Converted Sound";
    };

    // Speak the utterance
    speechSynthesis.speak(utter);
});

/**
 * Event listener for pause button to pause speech synthesis
 */
pauseBtn.addEventListener("click", () => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
        speechSynthesis.pause();
        convertBtn.textContent = "Paused...";
    }
});

/**
 * Event listener for resume button to resume speech synthesis
 */
resumeBtn.addEventListener("click", () => {
    if (speechSynthesis.paused) {
        speechSynthesis.resume();
        convertBtn.textContent = "Resuming...";
    }
});

/**
 * Event listener for stop button to cancel speech synthesis
 */
stopBtn.addEventListener("click", () => {
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        convertBtn.textContent = "Play Converted Sound";
    }
});

