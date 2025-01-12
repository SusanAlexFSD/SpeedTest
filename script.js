const startButton = document.getElementById('start-test-button');
const typingLessonsButton = document.getElementById('typing-lessons-button');
const testTimeDropdown = document.getElementById('test-time');
const testLevelDropdown = document.getElementById('test-level');
const testArea = document.getElementById('test-area');
const timeLeftDisplay = document.getElementById('time-left');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');

let timer;
let timeLeft;
let isTestStarted = false;
let textToType = '';
let typedText = '';
let correctChars = 0;

import { textSamples, shuffle } from './textSamples.js';

function getRandomText(level) {
    const texts = textSamples[level];
    const randomIndex = Math.floor(Math.random() * texts.length);
    return texts[randomIndex];
}

startButton.addEventListener('click', startTest);
typingLessonsButton.addEventListener('click', () => {
    alert('Typing lessons feature coming soon!');
});

function startTest() {
    if (isTestStarted) return;

    const selectedTime = parseInt(testTimeDropdown.value, 10);
    const selectedLevel = testLevelDropdown.value;

    timeLeft = selectedTime;
    textToType = getRandomText(selectedLevel); // Set the text to type
    const sentences = textToType.split('. ').filter(Boolean); // Split into sentences

    const sentencesContainer = document.getElementById('sentences-container');
    sentencesContainer.innerHTML = ''; // Clear any previous sentences

    sentences.forEach((sentence, index) => {
        const sentenceContainer = document.createElement('div');
        sentenceContainer.classList.add('sentence-container');

        const sentenceElement = document.createElement('p');
        sentenceElement.classList.add('sentence');
        sentenceElement.dataset.index = index;
        sentenceElement.innerHTML = sentence.split(' ').map((word, wordIndex) => {
            return `<span class="word" data-word-index="${wordIndex}">${word}</span>`;
        }).join(' ');

        const inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.classList.add('typing-input');
        inputElement.dataset.index = index;

        // Add typing event listener
        inputElement.addEventListener('input', (e) => handleTyping(e, index, sentence));
        inputElement.addEventListener('keydown', (e) => handleEnterKey(e, index, sentence));

        sentenceContainer.appendChild(sentenceElement);
        sentenceContainer.appendChild(inputElement);
        sentencesContainer.appendChild(sentenceContainer);
    });

    testArea.style.display = 'block';
    timeLeftDisplay.innerText = timeLeft;
    wpmDisplay.innerText = '0';
    accuracyDisplay.innerText = '0';

    isTestStarted = true;
    timer = setInterval(updateTimer, 1000);
}

function handleTyping(event, sentenceIndex, sentence) {
    const inputElement = event.target;
    const words = sentence.split(' ');
    const typedWords = inputElement.value.trim().split(' ');

    const sentenceElement = document.querySelector(
        `.sentence-container .sentence[data-index="${sentenceIndex}"]`
    );

    // Reset all word colors
    const wordElements = sentenceElement.querySelectorAll('.word');
    wordElements.forEach((wordElement) => {
        wordElement.style.color = ''; // Reset text color to default
    });

    // Highlight the current word based on typed words
    const currentWordIndex = typedWords.length - 1; // Index of the current word being typed

    if (currentWordIndex < words.length) {
        const wordElement = wordElements[currentWordIndex];

        // Change the color of the current word to blue
        wordElement.style.color = '#0077b6'; // Blue color
    }

    // Check if the typed word matches the current word
    if (typedWords.length > 0) {
        const typedWord = typedWords[typedWords.length - 1];
        const currentWord = words[typedWords.length - 1];

        // Only move to the next word when the user presses space and the word is correct
        if (typedWord === currentWord && event.key === ' ') {
            // If the word is typed correctly, move to the next word
            const nextWordElement = wordElements[typedWords.length];
            if (nextWordElement) {
                nextWordElement.style.color = '#0077b6'; // Change the color of the next word to blue
            }
        }
    }

    // Check if the sentence is complete
    if (typedWords.length === words.length && inputElement.value.trim() === sentence) {
        inputElement.disabled = true; // Disable input for completed sentence

        // Optionally, move to the next sentence input
        const nextInput = document.querySelector(
            `.typing-input[data-index="${sentenceIndex + 1}"]`
        );
        if (nextInput) {
            nextInput.focus(); // Automatically move to the next input field
        }
    }
}



function handleEnterKey(event, sentenceIndex, sentence) {
    if (event.key === 'Enter') {
        const inputElement = event.target;
        const words = sentence.split(' ');
        const typedWords = inputElement.value.trim().split(' ');

        // Check if the sentence is complete
        if (typedWords.length === words.length && inputElement.value.trim() === sentence) {
            inputElement.disabled = true; // Disable input for completed sentence

            // Move to the next sentence input
            const nextInput = document.querySelector(
                `.typing-input[data-index="${sentenceIndex + 1}"]`
            );
            if (nextInput) {
                nextInput.focus(); // Focus the next input field
            }
        }
    }
}




function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timeLeftDisplay.innerText = timeLeft;
    } else {
        endTest();
    }
}

function updateTyping() {
    typedText = typingArea.value;
    correctChars = calculateCorrectChars(typedText, textToType);
    const wordsTyped = typedText.trim().split(/\s+/).length;
    const accuracy = ((correctChars / textToType.length) * 100).toFixed(2);
    const wpm = ((wordsTyped / (timeLeft === 0 ? 1 : 60 - timeLeft)) * 60).toFixed(2);

    accuracyDisplay.innerText = accuracy;
    wpmDisplay.innerText = wpm;
}

function calculateCorrectChars(typed, original) {
    let count = 0;
    for (let i = 0; i < typed.length; i++) {
        if (typed[i] === original[i]) count++;
    }
    return count;
}

function endTest() {
    clearInterval(timer);
    isTestStarted = false;
    alert('Test finished! Check your results.');
}
