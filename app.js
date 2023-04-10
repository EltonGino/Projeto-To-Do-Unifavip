//Referencias iniciais
const novaAtividadeInput = document.querySelector("#new-task input"),
atividadesDiv = document.querySelector("#atividades");
let deletarAtividades, editarAtividades, atividades, count, updateNote = "";

//Ao carregar a janela mostrar as atividades
window.onload = () => {
    updateNote = "",
        count = Object.keys(localStorage).length,
        displayTasks()
};

//Exibir atividades
const displayTasks = () => {
    Object.keys(localStorage).length > 0 ?
        atividadesDiv.style.display = "inline-block"
        : atividadesDiv.style.display = "none",

        //Limpar as atividades
        atividadesDiv.innerHTML = "";

    //Buscar as Keys no armazenamento local
    let e = Object.keys(localStorage);
    e = e.sort();
    for (let t of e) {
        let e = localStorage.getItem(t), a = document.createElement("div");

        //Pegar todos os valores
        a.classList.add("task"),
            a.setAttribute("id", t),
            a.innerHTML = `<span id = "taskname"> ${t.split("_")[1]} </span>`;

        //Armazenamento local feito em boolean como string e depois rearmazenado em boolean
        let s = document.createElement("button");
        s.classList.add("edit"),
            s.innerHTML = '<i class="fa-solid fa-pen-clip"></i>',
            JSON.parse(e) ? (
                s.style.visibility = "hidden",
                a.classList.add("completed")
            )
                : s.style.visibility = "visible",
            a.appendChild(s),
            a.innerHTML += '<button class="delete"><i class="fa-solid fa-trash-can"></i></button>',
            atividadesDiv.appendChild(a)
    }

    //Atividade completada
    e = document.querySelectorAll(".task"),
        e.forEach(((e, t) => {
            e.onclick = () => {

                //Atualização do armazenamento local
                e.classList.contains("completed") ?
                    updateStorage(e.id.split("_")[0],
                        e.innerText, false) :
                    updateStorage(e.id.split("_")[0],
                        e.innerText, true)
            }
        })),

        //Editar atividades
        editarAtividades = document.getElementsByClassName("edit"),
        Array.from(editarAtividades).forEach(((e, t) => {
            e.addEventListener("click", (t => {

                //Parar propagação 
                t.stopPropagation(),

                    //Desabilitar o botão de edião enquanto uma atividade estiver sendo editada
                    disableButtons(true);

                //Atualizar o valor do input e remover a div
                let a = e.parentElement;
                novaAtividadeInput.value = a.querySelector("#taskname").innerText,

                    //updateNote para atividade sendo editada
                    updateNote = a.id,

                    //remover atividade
                    a.remove()
            })
            )
        }
        )),

        //Deletar atividade
        deletarAtividades = document.getElementsByClassName("delete"),
        Array.from(deletarAtividades).forEach(((e, t) => {
            e.addEventListener("click", (t => {
                t.stopPropagation();

                //Deletar do armazenamento local e remover a div
                let a = e.parentElement;
                removeTask(a.id),
                    a.remove(),
                    count -= 1
            }))
        }))

},
    //Disabilitar o botão de edição
    disableButtons = e => {
        let t = document.getElementsByClassName("edit");
        Array.from(t).forEach((t => { t.disabled = e }))
    },
    removeTask = e => { localStorage.removeItem(e), displayTasks() },
    updateStorage = (e, t, a) => {
        localStorage.setItem(`${e}_${t}`, a),
            displayTasks()
    };

//Add nova atividade
document.querySelector("#push").addEventListener("click", (() => {
    if (
        //Permitir o botão de edição
        disableButtons(false),
        0 == novaAtividadeInput.value.length)
        alert("Por favor, digite uma atividade!");
    else {
        //Guardar e exibir do armazenamento local
        if ("" == updateNote)
            //nova atividade
            updateStorage(count, novaAtividadeInput.value, false); else {
            //atualizar atividade
            let e = updateNote.split("_")[0];
            removeTask(updateNote),
                updateStorage(e, novaAtividadeInput.value, false),
                updateNote = ""
        } count += 1,
            novaAtividadeInput.value = ""
    }
}));