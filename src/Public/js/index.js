socket.on("connect", () => {
    console.log("Conectado ao servidor");
})

socket.on("refreshProducts", () => {
    alert("Produto atualizados com sucesso");
    location.reload(); // Recarrega a página para refletir as alterações
});



