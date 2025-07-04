/**
 * Cria ou atualiza um cookie no navegador com um valor informado e tempo de expiração em dias
 * @param {string} nome - Nome do cookie
 * @param {string} valor - Valor a ser armazenado no cookie
 * @param {number} dias - Quantidade de dias até o cookie expirar
 */
function setCookie(nome, valor, dias) {
    var d = new Date()
    d.setTime(d.getTime() + (dias*24*60*60*1000))
    var expires = "expires=" + d.toUTCString()
    document.cookie = nome + "=" + encodeURIComponent(valor) + ";" + expires + ";path=/"
}

/**
 * Recupera o valor de um cookie pelo nome
 * @param {string} nome - Nome do cookie a ser recuperado
 * @returns {string} Valor do cookie ou string vazia caso não exista
 */
function getCookie(nome) {
    var name = nome + "=";
    var ca = document.cookie.split(';')
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i]
        while (c.charAt(0) == ' ') c = c.substring(1)
        if (c.indexOf(name) == 0) return decodeURIComponent(c.substring(name.length, c.length))
    }
    return ""
}

/**
 * Classe responsável por gerenciar scripts personalizados (CRUD)
 * @constructor
 */
function Script(){
    this.id = 1
    this.arrayScript = []
    this.editId = null
    this.carregarDoCookie()
    this.listaTabela()
    
}

/**
 * Salva a lista de scripts e o id atual no cookie do navegador
 */
Script.prototype.salvarNoCookie = function() {
    setCookie('arrayScript', JSON.stringify(this.arrayScript), 365) // Salva por 1 ano
    setCookie('scriptId', this.id, 365)
};

/**
 * Carrega a lista de scripts e o id atual a partir dos cookies do navegador,
 * caso existam, atualizando os dados da classe.
 */
Script.prototype.carregarDoCookie = function() {
    var s = getCookie('arrayScript')
    if (s) {
        this.arrayScript = JSON.parse(s)
        this.id = parseInt(getCookie('scriptId'), 10) || 1
    }
}

/**
 * Adiciona um novo script ou atualiza um existente.
 *
 * - Valida os campos de entrada do formulário.
 * - Caso esteja em modo de edição, atualiza o script correspondente, senão adiciona um novo.
 * - Salva a lista de scripts no cookie para persistência.
 * - Atualiza a tabela de visualização e limpa os campos do formulário ao final.
 *
 * @function adicionar
 * @memberof Script
 * @returns {void}
 */
Script.prototype.adicionar = function(){

    let script = this.lerDados()
    let validaCampos = this.validaCampos(script)

    if (validaCampos == true){
        if(this.editId == null){
            this.salvarScript(script)
        }else{
            this.atualizar(this.editId, script)
            
        }
    }
    this.salvarNoCookie()
    this.listaTabela()
    this.limparDados()   
}

/**
 * Limpa os campos do formulário do script.
 *
 * Este método realiza as seguintes ações:
 * - Limpa os campos de entrada para nome e caminho do script.
 * - Altera o texto do botão para 'Adicionar Script'.
 * - Reseta a propriedade 'editId', finalizando o modo de edição atual.
 *
 * @function limparDados
 * @memberof Script
 */

Script.prototype.limparDados = function() {

    document.getElementById("nome_script").value = ''
    document.getElementById("path_script").value = ''
    document.getElementById("btn_config").innerText = 'Adicionar Script'

    this.editId = null
}

/**
 * Preenche dinamicamente a tabela HTML com os scripts armazenados no array interno.
 *
 * Para cada script, adiciona uma linha na tabela com:
 * - Um link apontando para o caminho do script.
 * - Botões/ícones para editar e deletar o script, com eventos configurados.
 *
 * Requisitos:
 * - O elemento <tbody> deve existir no HTML com o id "tbody".
 * - Os métodos script.prepararEditar e script.deletar devem estar implementados.
 * - Espera que os objetos do array this.arrayScript possuam as propriedades:
 *   - nomeScript: string
 *   - path: string (URL/caminho do script)
 *   - id: identificador único para deleção
 *
 * @function listaTabela
 * @memberof Script
 */

Script.prototype.listaTabela = function(){
     // Obtém o tbody da tabela
    let tbody = document.getElementById("tbody")
    // Limpa a tabela para evitar linhas duplicadas
    tbody.innerText = ''


     // Itera sobre todos os scripts armazenados
    for (let i = 0;  i< this.arrayScript.length; i++){
        let tr = tbody.insertRow() // Cria uma nova linha na tabela

        // Cria as duas células: nome e ações
        let td_nomeScript = tr.insertCell()
        let td_acoes = tr.insertCell()

         // Cria o link com o nome do script
        let linkScript = document.createElement('a')
        linkScript.href = this.arrayScript[i].path
        linkScript.innerText = this.arrayScript[i].nomeScript
        
        // Adiciona uma classe para estilizar a coluna de ações
        td_acoes.classList.add('images')
        
        // Cria o ícone de editar e adiciona evento para preparar edição
        let imgEdit = document.createElement('img')
        imgEdit.src = 'img/botao-editar.png'
        imgEdit.setAttribute(
            "onclick",
            "script.prepararEditar("+JSON.stringify(this.arrayScript[i])+")"
        )

         // Cria o ícone de deletar e adiciona evento para exclusão
        let imgDelete = document.createElement('img')
        imgDelete.src = 'img/remover-arquivo.png'
        imgDelete.setAttribute(
            "onclick",
            "script.deletar("+this.arrayScript[i].id+")"
        )

        // Adiciona os ícones de ação à célula correspondente
        td_acoes.appendChild(imgEdit)
        td_acoes.appendChild(imgDelete)
        // Adiciona o link do script à célula de nome
        td_nomeScript.appendChild(linkScript)
        
        // Exibe o array completo no console (útil para depuração)
        console.log(this.arrayScript)
    }
}

/**
 * Preenche os campos do formulário para editar um script existente.
 * Também troca o texto do botão para 'Atualizar'.
 * 
 * @function prepararEditar
 * @param {Object} dados - Objeto do script a ser editado, contendo ao menos { id, nomeScript, path }.
 * @memberof Script
 */
Script.prototype.prepararEditar = function(dados){
    this.editId = dados.id
    document.getElementById('nome_script').value = dados.nomeScript
    document.getElementById('path_script').value = dados.path
    document.getElementById('btn_config').innerHTML = 'Atualizar'
}

/**
 * Adiciona um novo script ao array de scripts e incrementa o ID sequencial.
 * 
 * @function salvarScript
 * @param {Object} script - Objeto representando o script a ser salvo (com id, nomeScript e path).
 * @memberof Script
 */
Script.prototype.salvarScript = function(script){
    this.arrayScript.push(script)
    this.id++
}

/**
 * Atualiza um script existente no array com base no ID fornecido.
 *
 * @function atualizar
 * @param {number} id - ID do script a ser atualizado.
 * @param {Object} script - Novos dados do script { nomeScript, path }.
 * @memberof Script
 */
Script.prototype.atualizar = function(id, script){
    for (let i = 0; i< this.arrayScript.length; i++){
        if (this.arrayScript[i].id == id){
            this.arrayScript[i].nomeScript = script.nomeScript
            this.arrayScript[i].path = script.path
        }
    }
}

/**
 * Lê os dados do formulário HTML e retorna um objeto do tipo script.
 * 
 * @function lerDados
 * @memberof Script
 * @returns {Object} Um objeto com id, nomeScript e path.
 * 
 */
Script.prototype.lerDados = function(){
    let script = {}
    
    script.id = this.id
    script.nomeScript = document.getElementById("nome_script").value
    script.path = document.getElementById("path_script").value

    return script
}

/**
 * Valida os campos obrigatórios do objeto script.
 * Exibe alertas para campos faltantes.
 * 
 * @function validaCampos
 * @param {Object} script - Objeto a ser validado.
 * @returns {boolean} True se válido, false caso contrário.
 * @memberof Script
 */
Script.prototype.validaCampos = function(script){
    let msg = ''
    
    if (script.nomeScript == ''){
        msg += ' - Informe o nome do Script. \n'
    }else if(script.path == ''){
        msg+= '- Informe o path do Script.\n'
    }
    
    if(msg != ''){
        alert(msg)
        return false
    }

    return true
}

/**
 * Remove um script do array e da tabela, com confirmação do usuário.
 * 
 * @function deletar
 * @param {number} id - ID do script a ser removido.
 * @memberof Script
 */

Script.prototype.deletar = function(id){

    let tbody = document.getElementById("tbody")

    for (let i=0; i < this.arrayScript.length; i++){
        if(this.arrayScript[i].id == id){
            if(confirm('Deseja realmente deleta o script '+ this.arrayScript[i].nomeScript)){
                this.arrayScript.splice(i,1)
                tbody.deleteRow(i)
            }     
        }
    }
    this.salvarNoCookie()
    this.listaTabela()
    console.log(this.arrayScript)
}
/**
 * Instancia a classe Script e a coloca no escopo global quando o documento é carregado.
 * 
 * @function
 */    
window.onload = function () {
    window.script = new Script(); // Cria no escopo global se precisar acessar via HTML
  }