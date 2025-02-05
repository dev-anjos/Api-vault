const socket = io();

socket.on("connect", () => {
    console.log("Conectado ao servidor");
})

socket.on("refreshProducts", () => {
    alert("Produto atualizados com sucesso");
    location.reload(); // Recarrega a página para refletir as alterações
});

// Recebe as mensagens do servidor e exibe no chat
socket.on('chat message', (msg) => {
    const chatBox = document.getElementById('chatBox');
    const message = document.createElement('p');
    message.textContent = msg;
    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight; // Rola para a última mensagem
});

// Função para enviar a mensagem
function sendMessage() {
    const inputMessage = document.getElementById('messageInput');
    const inputUsername = document.getElementById('user');

    if (inputMessage.value && inputUsername.value) {
        socket.emit('chat message', inputUsername.value , inputMessage.value);
        inputMessage.value = ''; // Limpa o campo de entrada
    }
}

messageInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        if (messageInput.value.trim().length > 0) {
            event.preventDefault();
            sendMessage();
        }
    }
});
