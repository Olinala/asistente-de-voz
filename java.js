document.getElementById("startButton").addEventListener("click", function()
{
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();


recognition.lang = "es-ES"; // Idioma: Español recognition.start();

recognition.onresult = function (event) {
const transcript = event.results[0][0].transcript; document.getElementById("texto").innerText = "Dijiste: " + transcript;
};

recognition.onerror = function () { document.getElementById("texto").innerText = "Error al reconocer la
voz.";
};
});
