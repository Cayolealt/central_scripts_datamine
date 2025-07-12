# 🛠️ Gerenciador de Scripts Customizados para Datamine STUDIO RM ⛏️

## ✨ Visão Geral

Este projeto é um gerenciador de scripts customizados desenvolvido em JavaScript e HTML/CSS para ser utilizado dentro do software **Datamine STUDIO RM**, especificamente através da sua funcionalidade de rotina de scripts. O principal objetivo é centralizar, organizar e facilitar o acesso a múltiplos scripts que um usuário (como um geólogo ou engenheiro de minas) possa utilizar em sua rotina diária no Datamine.

Ao invés de procurar e carregar scripts individualmente, esta ferramenta cria uma interface interativa diretamente no Datamine, permitindo adicionar, editar, visualizar e remover seus scripts com facilidade, otimizando o fluxo de trabalho e a produtividade.

## �� Funcionalidades

*   **Adição de Scripts:** Cadastre novos scripts informando um nome e o caminho (URL local ou remoto) do arquivo index.HTML do script.
*   **Edição de Scripts:** Altere o nome ou o caminho de scripts já registrados.
*   **Exclusão de Scripts:** Remova scripts que não são mais necessários da lista.
*   **Visualização Centralizada:** Todos os scripts registrados são listados em uma tabela organizada, com links diretos para sua execução ou acesso.
*   **Persistência de Dados:** Os dados dos scripts são salvos automaticamente (via cookies) e carregados ao inicia/reiniciar o Datamine STUDIO RM direto na aba Customization, garantindo que suas configurações sejam mantidas.
*   **Validação de Campos:** Garante que informações essenciais (nome e caminho do script) sejam fornecidas antes do cadastro.

## ⚙️ Como Funciona (Detalhes Técnicos)

O coração desta solução é uma série de funções JavaScript que manipulam o DOM (Document Object Model) para criar a interface do usuário e funções auxiliares para persistência de dados.

### 🍪 Persistência de Dados via Cookies

As funções `setCookie` e `getCookie` são responsáveis por armazenar e recuperar os dados dos scripts no navegador.

*   **`setCookie(nome, valor, dias)`:** Cria ou atualiza um cookie com um nome, valor e tempo de expiração em dias. Utiliza `encodeURIComponent` para garantir que o valor do cookie seja formatado corretamente, especialmente ao lidar com JSON.
*   **`getCookie(nome)`:** Recupera o valor de um cookie pelo seu nome. Percorre todos os cookies do documento, decodificando o valor com `decodeURIComponent`.

### 🏗️ Classe `Script` (Gerenciamento Principal)

A classe `Script` encapsula toda a lógica de gerenciamento dos scripts:

*   **`constructor()`:** Inicializa as propriedades da instância (`id` para o próximo script, `arrayScript` para armazenar a lista de scripts, `editId` para controlar o modo de edição). Em seguida, tenta carregar dados de cookies (`carregarDoCookie()`) e, finalmente, renderiza a tabela de scripts (`listaTabela()`).
*   **`salvarNoCookie()`:** Serializa `this.arrayScript` para JSON e o salva como cookie `arrayScript`, juntamente com o `this.id` atual como cookie `scriptId`.
*   **`carregarDoCookie()`:** Lê os cookies `arrayScript` e `scriptId`, desserializando o JSON para popular `this.arrayScript` e `this.id`.
*   **`adicionar()`:** É o método principal para processar o formulário. Ele lê os dados (`lerDados()`), valida-os (`validaCampos()`) e, dependendo de `editId` (nulo para novo, valor para edição), chama `salvarScript()` ou `atualizar()`. Finaliza salvando no cookie, atualizando a tabela e limpando o formulário.
*   **`limparDados()`:** Reseta os campos do formulário e o texto do botão para o estado inicial, desativando o modo de edição.
*   **`listaTabela()`:** Responsável por renderizar a tabela HTML com os scripts. Limpa o `<tbody>` existente e cria uma nova linha (`<tr>`) para cada script em `this.arrayScript`. Para cada script, cria células para o nome (com um link `<a>` para o `path`) e ações (botões de editar e deletar com eventos `onclick` que chamam `prepararEditar()` e `deletar()`).
*   **`prepararEditar(dados)`:** Preenche o formulário com os dados do script selecionado para edição e muda o texto do botão de "Adicionar" para "Atualizar". Define `this.editId` para o ID do script que está sendo editado.
*   **`salvarScript(script)`:** Adiciona um novo objeto `script` ao `this.arrayScript` e incrementa `this.id`.
*   **`atualizar(id, script)`:** Encontra o script com o `id` correspondente em `this.arrayScript` e atualiza suas propriedades (`nomeScript` e `path`).
*   **`lerDados()`:** Extrai os valores dos campos de input do formulário (`nome_script` e `path_script`) e os empacota em um objeto `script` junto com o `this.id` atual.
*   **`validaCampos(script)`:** Verifica se os campos `nomeScript` e `path` estão preenchidos, exibindo um `alert` se algum estiver vazio.
*   **`deletar(id)`:** Remove um script de `this.arrayScript` e da tabela HTML. Inclui uma confirmação (`confirm()`) antes da exclusão. Após a remoção, salva os dados atualizados nos cookies.

### �� Inicialização Global

O script é instanciado globalmente quando a página é carregada (`window.onload`), garantindo que `script = new Script()` esteja disponível para manipulação de eventos HTML.

## 📋 Pré-requisitos

*   **Datamine STUDIO RM:** Este script é projetado para rodar no ambiente da aba CUSTOMIZATION do software.
*   **Navegador Web:** O componente de customização do Datamine utiliza um navegador web embutido, que deve suportar JavaScript e o uso de cookies.

## 🚀 Instalação e Uso

1.  **Obtenha o Código:**
    *   Clone este repositório ou baixe a pasta inteira do projeto.

2.  **Configuração no Datamine STUDIO RM:**
    *   Abra o Datamine STUDIO RM.
    *   Navegue até o menu principal, na aba HOME procure pelo botão SYSTEM do PROGRAM OPTIONS.
  
       <img width="1916" height="205" alt="image" src="https://github.com/user-attachments/assets/94ac734c-4670-4b2e-b45b-ec81657c4baa" />
       
    *   Na janela de Options procure pela pasta ENVIRONMENT em seguida Web Browser.
    *   Configure a entrada de URL do Default Customization Page como caminho completo para o arquivo HTML que contém este script (ex: `D:\02 - SCRIPTS\central_scripts_gegem\index.html`).
    *   Pressione OK.
   
      <img width="796" height="501" alt="image" src="https://github.com/user-attachments/assets/df69ef0b-9fb5-437a-a58b-867642e0d24c" />

3.  **Adicionando seu Primeiro Script:**
    *   Navegue até a aba Customization
    *   Na interface carregada, você verá campos para "Nome do Script" e "Path do Script".
    *   **Nome do Script:** Digite um nome amigável para o seu script (ex: "Relatório de Reservas", "Cálculo de Desvio de Furo").
    *   **Path do Script:** Insira o caminho completo para o arquivo index.html do seu script ou o respectivo arquivo html de inicialização (ex: URL `D:\02 - SCRIPTS\Relatorio_reservas\index.html`).
    *   Clique no botão **"Adicionar Script"**.
    *   O script aparecerá na tabela abaixo.
      <img width="1918" height="1022" alt="image" src="https://github.com/user-attachments/assets/ab29646e-f05d-4ade-b97f-14acf5c5db4f" />
      <img width="418" height="1017" alt="image" src="https://github.com/user-attachments/assets/e2cc4cff-c045-43f7-ba0a-f7730ab76932" />



5.  **Editando um Script:**
    *   Clique no ícone de **edição (lápis)** ao lado do script que deseja modificar na tabela.
    *   Os campos do formulário serão preenchidos com os dados do script.
    *   Faça as alterações necessárias e clique no botão **"Atualizar"**.
      <img width="422" height="740" alt="image" src="https://github.com/user-attachments/assets/5bfb4b36-fb97-4379-b4db-e1c8547685cd" />


6.  **Excluindo um Script:**
    *   Clique no ícone de **excluir (lixeira)** ao lado do script que deseja remover.
    *   Confirme a exclusão quando solicitado.
      <img width="422" height="740" alt="image" src="https://github.com/user-attachments/assets/f8204ca5-4dcd-49ac-8c2c-16e3c44216c6" />


7.  **Acessando/Executando um Script:**
    *   Na tabela, o nome de cada script será um link. Clicar neste link carregará o script correspondente no ambiente do navegador do Datamine, permitindo sua execução.

## 🌟 Benefícios para Geólogos em Mineradoras

*   **Organização Centralizada:** Elimina a necessidade de procurar scripts em diferentes pastas, reunindo tudo em um só lugar.
*   **Acesso Rápido:** Com apenas um clique, você pode carregar e executar seus scripts mais utilizados.
*   **Produtividade Aumentada:** Reduz o tempo gasto com tarefas repetitivas de busca e carregamento de scripts, liberando mais tempo para análises geológicas.
*   **Compartilhamento Simplificado:** Se outros colegas tiverem acesso ao mesmo arquivo HTML e aos scripts de destino, a solução pode ser compartilhada, padronizando o acesso aos utilitários.
*   **Curva de Aprendizagem:** Serve como um excelente exemplo prático de manipulação de DOM, gerenciamento de estado e persistência de dados em JavaScript para quem está começando a aprender programação.

## 🤝 Contribuições

Sinta-se à vontade para abrir issues para sugestões de melhoria ou reportar bugs. Pull requests são bem-vindos!
