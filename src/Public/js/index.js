const socket = io();

socket.on("connect", () => {
    console.log("Conectado ao servidor");
})

socket.on("refreshProducts", () => {
    alert("Produto atualizados com sucesso");
    location.reload();
});

// Recebe as mensagens do servidor e exibe no chat
socket.on('chat message', (msg) => {
    const chatBox = document.getElementById('chatBox');
    const message = document.createElement('p');
    message.textContent = msg;
    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;
});

// Função para enviar a mensagem
function sendMessage() {
    const inputMessage = document.getElementById('messageInput');
    const inputUsername = document.getElementById('user');

    if (inputMessage.value && inputUsername.value) {
        socket.emit('chat message', inputUsername.value , inputMessage.value);
        inputMessage.value = '';
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
