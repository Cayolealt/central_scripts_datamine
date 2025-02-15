class Script{
    
    constructor(){
        this.id = 1
        this.arrayScript = []
        this.editId = null;

    }
    
    adicionar(){
    

        let script = this.lerDados()
        let validaCampos = this.validaCampos(script)

        if (validaCampos == true){
            if(this.editId == null){
                this.salvarScript(script)
            }else{
                this.atualizar(this.editId, script)
            }
        }

        this.listaTabela()
        this.limparDados()
        
    }

    limparDados(){
        document.getElementById("nome_script").value = ''
        document.getElementById("path_script").value = ''
        document.getElementById("btn_config").innerText = 'Adicionar Script'

        this.editId = null
    }

    listaTabela(){
        let tbody = document.getElementById("tbody")
        tbody.innerText = ''
        
        for (let i = 0;  i< this.arrayScript.length; i++){
            let tr = tbody.insertRow()

            let td_nomeScript = tr.insertCell()
            let td_acoes = tr.insertCell()

    
            let linkScript = document.createElement('a')
            linkScript.href = this.arrayScript[i].path
            linkScript.innerText = this.arrayScript[i].nomeScript
            
            
            td_acoes.classList.add('images')
            
            let imgEdit = document.createElement('img')
            imgEdit.src = 'img/botao-editar.png'
            imgEdit.setAttribute("onclick","script.prepararEditar("+JSON.stringify(this.arrayScript[i])+")")

            let imgDelete = document.createElement('img')
            imgDelete.src = 'img/remover-arquivo.png'
            imgDelete.setAttribute("onclick","script.deletar("+this.arrayScript[i].id+")")

            td_acoes.appendChild(imgEdit)
            td_acoes.appendChild(imgDelete)
            td_nomeScript.appendChild(linkScript)

            console.log(this.arrayScript)
        }
    }

    prepararEditar(dados){
        this.editId = dados.id
        document.getElementById('nome_script').value = dados.nomeScript
        document.getElementById('path_script').value = dados.path

        document.getElementById('btn_config').innerHTML = 'Atualizar'
    }

    salvarScript(script){
        this.arrayScript.push(script)
        this.id++
    }

    atualizar(id, script){
        for (let i = 0; i< this.arrayScript.length; i++){
            if (this.arrayScript[i].id == id){
                this.arrayScript[i].nomeScript = script.nomeScript
                this.arrayScript[i].path = script.path
            }
        }
    }

    lerDados(){
        let script = {}
        
        script.id = this.id
        script.nomeScript = document.getElementById("nome_script").value
        script.path = document.getElementById("path_script").value

        return script
    }

    validaCampos(script){
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

    deletar(id){

        let tbody = document.getElementById("tbody")

        for (let i=0; i < this.arrayScript.length; i++){
            if(this.arrayScript[i].id == id){
                if(confirm('Deseja realmente deleta o script '+ this.arrayScript[i].nomeScript)){
                    this.arrayScript.splice(i,1)
                    tbody.deleteRow(i)
                }     
            }
        }
        console.log(this.arrayScript)
    }


    
}

var script = new Script()