document.addEventListener('DOMContentLoaded', () => {
    // Inicializar variables
    let recognition;
    let currentLanguage = 'es-ES';
    
    // Configurar reconocimiento de voz
    function initRecognition() {
        try {
            window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = false;
            recognition.lang = currentLanguage;

            recognition.onstart = () => {
                document.getElementById('texto').textContent = 'Escuchando...';
            };

            recognition.onresult = (event) => {
                const result = event.results[event.results.length - 1];
                const text = result[0].transcript;
                document.getElementById('originalText').value += text + '\n';
                
                // Procesar comandos especiales
                if (text.toLowerCase().includes('qué hora es')) {
                    showTime();
                }
                
                // Traducir el texto
                translateText(text);
            };

            recognition.onerror = (event) => {
                console.error('Error:', event.error);
                document.getElementById('texto').textContent = 'Error: ' + event.error;
            };

            recognition.onend = () => {
                document.getElementById('texto').textContent = 'Reconocimiento finalizado';
            };

        } catch (error) {
            console.error('Error al inicializar:', error);
            document.getElementById('texto').textContent = 'Error: Su navegador no soporta reconocimiento de voz';
        }
    }

    // Función para mostrar la hora
    function showTime() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString();
        document.getElementById('timeDisplay').textContent = timeStr;
        speak('La hora actual es ' + timeStr);
    }

    // Función para traducir texto
    async function translateText(text) {
        try {
            const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${currentLanguage.slice(0,2)}|${currentLanguage === 'es-ES' ? 'en' : 'es'}`);
            const data = await response.json();
            document.getElementById('translatedText').value += data.responseData.translatedText + '\n';
        } catch (error) {
            console.error('Error en traducción:', error);
            document.getElementById('translatedText').value += 'Error en la traducción\n';
        }
    }

    // Función para hablar
    function speak(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = currentLanguage;
        window.speechSynthesis.speak(utterance);
    }

    // Event Listeners
    document.getElementById('startButton').addEventListener('click', () => {
        recognition.start();
    });

    document.getElementById('stopButton').addEventListener('click', () => {
        recognition.stop();
    });

    document.getElementById('speakOriginal').addEventListener('click', () => {
        const text = document.getElementById('originalText').value;
        if (text) speak(text);
    });

    document.getElementById('speakTranslated').addEventListener('click', () => {
        const text = document.getElementById('translatedText').value;
        if (text) speak(text);
    });

    // Cambio de idioma
    document.querySelectorAll('.language-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.language-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentLanguage = button.dataset.lang === 'es' ? 'es-ES' : 'en-US';
            recognition.lang = currentLanguage;
        });
    });

    // Inicializar el reconocimiento de voz
    initRecognition();
});