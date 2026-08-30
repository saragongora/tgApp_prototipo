
/*
 * ============================================================
 * TG APP — FORMULÁRIO DE CADASTRO
 * ============================================================
 */


document.addEventListener(
    "DOMContentLoaded",
    iniciarFormulario
);


/*
 * ============================================================
 * INICIALIZAÇÃO
 * ============================================================
 */

function iniciarFormulario() {

    const form =
        document.getElementById(
            "cadastroForm"
        );


    if (!form) {

        return;

    }


    preencherCursos();

    preencherAnos();

    configurarCamposDinamicos();

    configurarUpload();

    configurarFormulario(form);

}


/*
 * ============================================================
 * CURSOS
 * ============================================================
 */

function preencherCursos() {

    const select =
        document.getElementById(
            "curso"
        );


    if (!select) {

        return;

    }


    cursosDisponiveis.forEach(
        curso => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                curso;


            option.textContent =
                curso;


            select.appendChild(
                option
            );

        }
    );

}


/*
 * ============================================================
 * ANOS
 * ============================================================
 */

function preencherAnos() {

    const select =
        document.getElementById(
            "ano"
        );


    if (!select) {

        return;

    }


    const anoAtual =
        new Date().getFullYear();


    /*
     * Permite cadastrar trabalhos antigos
     * e também trabalhos futuros.
     */

    for (
        let ano = anoAtual + 1;
        ano >= 1980;
        ano--
    ) {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            ano;


        option.textContent =
            ano;


        select.appendChild(
            option
        );

    }

}


/*
 * ============================================================
 * CAMPOS DINÂMICOS
 * ============================================================
 */

function configurarCamposDinamicos() {

    const addAluno =
        document.getElementById(
            "addAluno"
        );


    const addOrientador =
        document.getElementById(
            "addOrientador"
        );


    if (addAluno) {

        addAluno.addEventListener(
            "click",
            adicionarAluno
        );

    }


    if (addOrientador) {

        addOrientador.addEventListener(
            "click",
            adicionarOrientador
        );

    }


    /*
     * Eventos de remoção dos campos que já existem.
     */

    configurarRemocaoDinamica();

}


/*
 * ============================================================
 * ADICIONAR ALUNO
 * ============================================================
 */

function adicionarAluno() {

    const container =
        document.getElementById(
            "alunosContainer"
        );


    if (!container) {

        return;

    }


    const campo =
        document.createElement(
            "div"
        );


    campo.className =
        "dynamic-field";


    campo.innerHTML = `

        <input
            type="text"
            name="alunos[]"
            placeholder="Nome do aluno"
            required
        >

        <button
            type="button"
            class="btn-remove-item"
            title="Remover aluno"
            aria-label="Remover aluno"
        >
            ×
        </button>

    `;


    container.appendChild(
        campo
    );


    configurarBotaoRemover(
        campo.querySelector(
            ".btn-remove-item"
        )
    );


    campo.querySelector(
        "input"
    ).focus();

}


/*
 * ============================================================
 * ADICIONAR ORIENTADOR
 * ============================================================
 */

function adicionarOrientador() {

    const container =
        document.getElementById(
            "orientadoresContainer"
        );


    if (!container) {

        return;

    }


    const campo =
        document.createElement(
            "div"
        );


    campo.className =
        "dynamic-field";


    campo.innerHTML = `

        <input
            type="text"
            name="orientadores[]"
            placeholder="Nome do orientador"
            required
        >

        <button
            type="button"
            class="btn-remove-item"
            title="Remover orientador"
            aria-label="Remover orientador"
        >
            ×
        </button>

    `;


    container.appendChild(
        campo
    );


    configurarBotaoRemover(
        campo.querySelector(
            ".btn-remove-item"
        )
    );


    campo.querySelector(
        "input"
    ).focus();

}


/*
 * ============================================================
 * REMOVER CAMPOS
 * ============================================================
 */

function configurarRemocaoDinamica() {

    document
        .querySelectorAll(
            ".btn-remove-item"
        )
        .forEach(
            botao => {

                configurarBotaoRemover(
                    botao
                );

            }
        );

}


/*
 * ============================================================
 * BOTÃO REMOVER
 * ============================================================
 */

function configurarBotaoRemover(
    botao
) {

    if (!botao) {

        return;

    }


    botao.addEventListener(
        "click",
        function () {

            const campo =
                botao.closest(
                    ".dynamic-field"
                );


            if (!campo) {

                return;

            }


            const container =
                campo.parentElement;


            /*
             * Não permite deixar a lista
             * completamente vazia.
             */

            if (
                container.children.length <= 1
            ) {

                campo.querySelector(
                    "input"
                ).value = "";


                campo.querySelector(
                    "input"
                ).focus();


                return;

            }


            campo.remove();

        }
    );

}


/*
 * ============================================================
 * UPLOAD DO PDF
 * ============================================================
 */

function configurarUpload() {

    const input =
        document.getElementById(
            "arquivo"
        );


    const nome =
        document.getElementById(
            "arquivoNome"
        );


    if (!input || !nome) {

        return;

    }


    input.addEventListener(
        "change",
        function () {

            const arquivo =
                input.files[0];


            if (!arquivo) {

                nome.textContent =
                    "Nenhum arquivo selecionado.";

                return;

            }


            if (
                arquivo.type !==
                "application/pdf"
            ) {

                nome.textContent =
                    "Selecione um arquivo PDF válido.";


                input.value = "";

                return;

            }


            nome.textContent =
                `${arquivo.name} (${formatarTamanho(
                    arquivo.size
                )})`;

        }
    );

}


/*
 * ============================================================
 * FORMULÁRIO
 * ============================================================
 */

function configurarFormulario(form) {

    form.addEventListener(
        "submit",
        async function (evento) {

            evento.preventDefault();


            limparMensagem();


            const projeto =
                coletarDadosFormulario();


            const validacao =
                validarProjeto(
                    projeto
                );


            if (!validacao.valido) {

                mostrarMensagem(
                    validacao.mensagem,
                    "error"
                );

                return;

            }


            try {

                /*
                 * O arquivo será implementado na próxima
                 * etapa com IndexedDB.
                 *
                 * Por enquanto guardamos somente os
                 * dados textuais.
                 */

                const arquivo =
                    document.getElementById(
                        "arquivo"
                    );


                if (
                    arquivo &&
                    arquivo.files.length > 0
                ) {

                    projeto.arquivoNome =
                        arquivo.files[0].name;

                }


                const novoProjeto =
                    adicionarProjeto(
                        projeto
                    );


                mostrarMensagem(
                    "Trabalho cadastrado com sucesso!",
                    "success"
                );


                /*
                 * Aguarda um momento para o usuário
                 * visualizar a confirmação.
                 */

                setTimeout(
                    function () {

                        window.location.href =
                            "../index.html";

                    },
                    1000
                );


            } catch (erro) {

                console.error(
                    erro
                );


                mostrarMensagem(
                    "Não foi possível salvar o trabalho.",
                    "error"
                );

            }

        }
    );

}


/*
 * ============================================================
 * COLETAR DADOS
 * ============================================================
 */

function coletarDadosFormulario() {

    const nome =
        document.getElementById(
            "nome_tg"
        ).value.trim();


    const tipo =
        document.getElementById(
            "tipo"
        ).value;


    const curso =
        document.getElementById(
            "curso"
        ).value;


    const ano =
        document.getElementById(
            "ano"
        ).value;


    const semestre =
        document.getElementById(
            "semestre"
        ).value;


    const alunos =
        Array.from(
            document.querySelectorAll(
                'input[name="alunos[]"]'
            )
        )
        .map(
            campo =>
                campo.value.trim()
        )
        .filter(
            nome => nome !== ""
        );


    const orientadores =
        Array.from(
            document.querySelectorAll(
                'input[name="orientadores[]"]'
            )
        )
        .map(
            campo =>
                campo.value.trim()
        )
        .filter(
            nome => nome !== ""
        );


    return {

        tipo,

        nome_tg: nome,

        curso,

        ano: Number(ano),

        semestre,

        orientadores,

        alunos,

        arquivo: null,

        arquivoNome: ""

    };

}


/*
 * ============================================================
 * VALIDAÇÃO
 * ============================================================
 */

function validarProjeto(projeto) {

    if (!projeto.nome_tg) {

        return {

            valido: false,

            mensagem:
                "Informe o nome do trabalho."

        };

    }


    if (!projeto.tipo) {

        return {

            valido: false,

            mensagem:
                "Selecione o tipo de trabalho."

        };

    }


    if (!projeto.curso) {

        return {

            valido: false,

            mensagem:
                "Selecione o curso."

        };

    }


    if (!projeto.ano) {

        return {

            valido: false,

            mensagem:
                "Informe o ano."

        };

    }


    if (!projeto.semestre) {

        return {

            valido: false,

            mensagem:
                "Selecione o semestre."

        };

    }


    if (
        projeto.alunos.length === 0
    ) {

        return {

            valido: false,

            mensagem:
                "Adicione pelo menos um aluno."

        };

    }


    if (
        projeto.orientadores.length === 0
    ) {

        return {

            valido: false,

            mensagem:
                "Adicione pelo menos um orientador."

        };

    }


    return {

        valido: true,

        mensagem: ""

    };

}


/*
 * ============================================================
 * MENSAGENS
 * ============================================================
 */

function mostrarMensagem(
    mensagem,
    tipo
) {

    const elemento =
        document.getElementById(
            "formMessage"
        );


    if (!elemento) {

        return;

    }


    elemento.textContent =
        mensagem;


    elemento.className =
        `form-message ${tipo}`;

}


function limparMensagem() {

    const elemento =
        document.getElementById(
            "formMessage"
        );


    if (!elemento) {

        return;

    }


    elemento.textContent =
        "";


    elemento.className =
        "form-message";

}


/*
 * ============================================================
 * TAMANHO DO ARQUIVO
 * ============================================================
 */

function formatarTamanho(bytes) {

    if (bytes < 1024) {

        return `${bytes} B`;

    }


    if (bytes < 1024 * 1024) {

        return `${(
            bytes / 1024
        ).toFixed(1)} KB`;

    }


    return `${(
        bytes /
        (1024 * 1024)
    ).toFixed(1)} MB`;

}

