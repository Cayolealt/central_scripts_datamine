// Obtendo os elementos do botão de abrir e fechar
const openBtn = document.getElementById('open-btn');
const closeBtn = document.getElementById('close-btn');
const menu = document.getElementById('menu');

// Função para abrir o menu lateral
openBtn.addEventListener('click', () => {
    menu.style.left = '0';
});

// Função para fechar o menu lateral
closeBtn.addEventListener('click', () => {
    menu.style.left = '-250px';
});
