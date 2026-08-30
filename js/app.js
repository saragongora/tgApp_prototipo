
/*
 * ============================================================
 * TG APP — APLICAÇÃO PRINCIPAL
 * ============================================================
 *
 * Substitui a lógica que anteriormente dependia de:
 *
 * Express
 * EJS
 * MySQL
 *
 * Agora tudo é executado no navegador.
 * ============================================================
 */


document.addEventListener(
    "DOMContentLoaded",
    iniciarAplicacao
);


/*
 * ============================================================
 * CONFIGURAÇÕES
 * ============================================================
 */

const RESULTADOS_POR_PAGINA = 5;

let projetos = [];

let paginaAtual = 1;

let termoAtual = "";

let filtrosAtuais = {

    ano: "",

    semestre: "",

    curso: "",

    tipo: ""

};


/*
 * ============================================================
 * INICIALIZAÇÃO
 * ============================================================
 */

function iniciarAplicacao() {

    if (typeof carregarProjetos !== "function") {

        console.error(
            "ERRO: storage.js não foi carregado."
        );

        return;

    }

    projetos = carregarProjetos();

    preencherAnos();

    configurarEventos();

    // Não renderiza projetos inicialmente.
}


/*
 * ============================================================
 * EVENTOS
 * ============================================================
 */

function configurarEventos() {

    const searchForm =
        document.getElementById("searchForm");


    if (searchForm) {

        searchForm.addEventListener(
            "submit",
            function (evento) {

                evento.preventDefault();


                realizarPesquisa();

            }
        );

    }


    const filterButton =
        document.getElementById("filterButton");


    if (filterButton) {

        filterButton.addEventListener(
            "click",
            abrirModalFiltro
        );

    }


    const closeFilterButton =
        document.getElementById("closeFilterButton");


    if (closeFilterButton) {

        closeFilterButton.addEventListener(
            "click",
            fecharModalFiltro
        );

    }


    const cancelFilterButton =
        document.getElementById("cancelFilterButton");


    if (cancelFilterButton) {

        cancelFilterButton.addEventListener(
            "click",
            fecharModalFiltro
        );

    }


    const applyFiltersButton =
        document.getElementById(
            "applyFiltersButton"
        );


    if (applyFiltersButton) {

        applyFiltersButton.addEventListener(
            "click",
            aplicarFiltros
        );

    }


    const clearFiltersButton =
        document.getElementById(
            "clearFiltersButton"
        );


    if (clearFiltersButton) {

        clearFiltersButton.addEventListener(
            "click",
            limparFiltros
        );

    }


    const filterModal =
        document.getElementById(
            "modal-filtro"
        );


    if (filterModal) {

        filterModal.addEventListener(
            "click",
            function (evento) {

                if (
                    evento.target === filterModal
                ) {

                    fecharModalFiltro();

                }

            }
        );

    }


    const detailsModal =
        document.getElementById(
            "detailsModal"
        );


    if (detailsModal) {

        detailsModal.addEventListener(
            "click",
            function (evento) {

                if (
                    evento.target === detailsModal
                ) {

                    fecharDetalhes();

                }

            }
        );

    }


    const closeDetailsButton =
        document.getElementById(
            "closeDetailsButton"
        );


    if (closeDetailsButton) {

        closeDetailsButton.addEventListener(
            "click",
            fecharDetalhes
        );

    }

}


/*
 * ============================================================
 * PESQUISA
 * ============================================================
 */

function realizarPesquisa() {

    const campo =
        document.getElementById("termo");


    termoAtual =
        campo
            ? campo.value.trim()
            : "";


    paginaAtual = 1;


    renderizarProjetos();

}


/*
 * ============================================================
 * OBTÉM PROJETOS FILTRADOS
 * ============================================================
 */

function obterProjetosFiltrados() {

    const termo =
        termoAtual
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");


    return projetos.filter(projeto => {


        /*
         * ------------------------------------------------------
         * Pesquisa
         * ------------------------------------------------------
         */

        let correspondePesquisa = true;


        if (termo) {

            const nome =
                normalizarTexto(
                    projeto.nome_tg
                );


            const curso =
                normalizarTexto(
                    projeto.curso
                );


            const orientadores =
                projeto.orientadores
                    .map(normalizarTexto)
                    .join(" ");


            const alunos =
                projeto.alunos
                    .map(normalizarTexto)
                    .join(" ");


            correspondePesquisa =
                nome.includes(termo) ||
                curso.includes(termo) ||
                orientadores.includes(termo) ||
                alunos.includes(termo);

        }


        if (!correspondePesquisa) {

            return false;

        }


        /*
         * ------------------------------------------------------
         * Filtro de ano
         * ------------------------------------------------------
         */

        if (
            filtrosAtuais.ano &&
            String(projeto.ano) !==
            String(filtrosAtuais.ano)
        ) {

            return false;

        }


        /*
         * ------------------------------------------------------
         * Filtro de semestre
         * ------------------------------------------------------
         */

        if (
            filtrosAtuais.semestre &&
            String(projeto.semestre) !==
            String(filtrosAtuais.semestre)
        ) {

            return false;

        }


        /*
         * ------------------------------------------------------
         * Filtro de curso
         * ------------------------------------------------------
         */

        if (
            filtrosAtuais.curso &&
            projeto.curso !==
            filtrosAtuais.curso
        ) {

            return false;

        }


        /*
         * ------------------------------------------------------
         * Filtro de tipo
         * ------------------------------------------------------
         */

        if (
            filtrosAtuais.tipo &&
            projeto.tipo !==
            filtrosAtuais.tipo
        ) {

            return false;

        }


        return true;

    });

}


/*
 * ============================================================
 * NORMALIZAÇÃO DE TEXTO
 * ============================================================
 */

function normalizarTexto(texto) {

    return String(texto || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

}


/*
 * ============================================================
 * RENDERIZAR PROJETOS
 * ============================================================
 */

function renderizarProjetos() {

    const lista =
        document.getElementById(
            "resultsList"
        );


    const emptyState =
        document.getElementById(
            "emptyState"
        );


    const resultsCount =
        document.getElementById(
            "resultsCount"
        );


    if (!lista) {

        return;

    }


    const resultados =
        obterProjetosFiltrados();


    const totalResultados =
        resultados.length;


    const totalPaginas =
        Math.max(
            1,
            Math.ceil(
                totalResultados /
                RESULTADOS_POR_PAGINA
            )
        );


    if (paginaAtual > totalPaginas) {

        paginaAtual = totalPaginas;

    }


    const inicio =
        (paginaAtual - 1) *
        RESULTADOS_POR_PAGINA;


    const resultadosPagina =
        resultados.slice(
            inicio,
            inicio + RESULTADOS_POR_PAGINA
        );


    lista.innerHTML = "";


    /*
     * ------------------------------------------------------
     * Mensagem
     * ------------------------------------------------------
     */

    if (termoAtual || existemFiltros()) {

        if (totalResultados === 0) {

            resultsCount.innerHTML =
                `Nenhum resultado encontrado${termoAtual
                    ? ` para: <strong>${escapeHTML(termoAtual)}</strong>`
                    : "."}`;

        } else {

            resultsCount.innerHTML =
                `${totalResultados} resultado${totalResultados !== 1 ? "s" : ""}
                ${termoAtual
                    ? `de busca para: <strong>${escapeHTML(termoAtual)}</strong>`
                    : "encontrado(s)."}`;

        }

    } else {

        resultsCount.innerHTML =
            `${totalResultados} trabalho${totalResultados !== 1 ? "s" : ""}
            disponível${totalResultados !== 1 ? "eis" : ""}.`;

    }


    /*
     * ------------------------------------------------------
     * Estado vazio
     * ------------------------------------------------------
     */

    if (totalResultados === 0) {

        if (emptyState) {

            emptyState.style.display =
                "block";

        }

    } else {

        if (emptyState) {

            emptyState.style.display =
                "none";

        }

    }


    /*
     * ------------------------------------------------------
     * Renderização dos cards
     * ------------------------------------------------------
     */

    resultadosPagina.forEach(
        projeto => {

            lista.appendChild(
                criarCardProjeto(projeto)
            );

        }
    );


    /*
     * ------------------------------------------------------
     * Paginação
     * ------------------------------------------------------
     */

    renderizarPaginacao(
        totalPaginas
    );


    /*
     * ------------------------------------------------------
     * Animação da área de pesquisa
     * ------------------------------------------------------
     */

    const searchArea =
        document.getElementById(
            "searchArea"
        );


    if (
        searchArea &&
        (termoAtual || existemFiltros())
    ) {

        searchArea.classList.add("top");

    } else if (searchArea) {

        searchArea.classList.remove("top");

    }

}


/*
 * ============================================================
 * CRIAR CARD DO PROJETO
 * ============================================================
 */

function criarCardProjeto(projeto) {

    const card =
        document.createElement("article");


    card.className =
        "projeto-card";


    /*
     * ----------------------------------------------------------
     * Informações do projeto
     * ----------------------------------------------------------
     */

    const tipo =
        tiposTrabalho[projeto.tipo]
        || projeto.tipo
        || "Não informado";


    const orientadores =
        Array.isArray(projeto.orientadores)
            ? projeto.orientadores.join(", ")
            : projeto.orientadores || "Não informado";


    const alunos =
        Array.isArray(projeto.alunos)
            ? projeto.alunos.join(", ")
            : projeto.alunos || "Não informado";


    /*
     * ----------------------------------------------------------
     * HTML DO CARD
     * ----------------------------------------------------------
     */

    card.innerHTML = `

        <div class="projeto-card-conteudo">

            <div class="projeto-card-principal">

                <h2 class="projeto-titulo">
                    ${escapeHTML(projeto.nome_tg)}
                </h2>


                <div class="projeto-info">

                    <p>
                        <strong>Tipo:</strong>
                        ${escapeHTML(tipo)}
                    </p>


                    <p>
                        <strong>Curso:</strong>
                        ${escapeHTML(projeto.curso)}
                    </p>


                    <p>
                        <strong>Ano:</strong>
                        ${escapeHTML(projeto.ano)}
                        <span class="separador">•</span>
                        <strong>Semestre:</strong>
                        ${escapeHTML(projeto.semestre)}
                    </p>


                    <p>
                        <strong>Orientador(es):</strong>
                        ${escapeHTML(orientadores)}
                    </p>


                    <p>
                        <strong>Aluno(s):</strong>
                        ${escapeHTML(alunos)}
                    </p>

                </div>

            </div>


            <!--
                Botão do PDF.
                Ele fica separado das informações do projeto.
            -->

            <div class="projeto-pdf-btn">

                <button
                    type="button"
                    title="Visualizar PDF"
                    aria-label="Visualizar PDF"
                    data-id="${projeto.id}"
                >

                    <img
                        src="assets/images/icon_baixar.png"
                        alt="Visualizar PDF"
                        width="24"
                        height="24"
                    >

                </button>

            </div>

        </div>

    `;


    /*
     * ----------------------------------------------------------
     * BOTÃO DO PDF
     * ----------------------------------------------------------
     */

    const botao =
    card.querySelector(
        ".projeto-pdf-btn button"
    );


    if (botao) {

        botao.addEventListener(
            "click",
            async function (evento) {

                /*
                 * Impede que o clique no botão seja
                 * interpretado como clique no card.
                 */

                evento.stopPropagation();


                try {

                    const possui =
                        await possuiPDF(
                            projeto.id
                        );


                    if (!possui) {

                        alert(
                            "Este trabalho não possui um PDF cadastrado."
                        );

                        return;

                    }


                    await abrirPDF(
                        projeto.id
                    );


                } catch (erro) {

                    console.error(
                        "Erro ao abrir o PDF:",
                        erro
                    );


                    alert(
                        "Não foi possível abrir o PDF."
                    );

                }

            }
        );

    }


    /*
     * ----------------------------------------------------------
     * CLIQUE NO CARD
     * ----------------------------------------------------------
     *
     * O card inteiro pode abrir os detalhes.
     * O botão de PDF possui comportamento próprio.
     */

    card.addEventListener(
        "click",
        function () {

            abrirDetalhes(
                projeto.id
            );

        }
    );


    return card;

}





/*
 * ============================================================
 * PAGINAÇÃO
 * ============================================================
 */

function renderizarPaginacao(totalPaginas) {

    const pagination =
        document.getElementById(
            "pagination"
        );


    if (!pagination) {

        return;

    }


    pagination.innerHTML = "";


    if (totalPaginas <= 1) {

        return;

    }


    /*
     * Botão anterior
     */

    if (paginaAtual > 1) {

        const anterior =
            criarBotaoPagina(
                "« Anterior",
                paginaAtual - 1
            );


        pagination.appendChild(
            anterior
        );

    }


    /*
     * Números das páginas
     */

    for (
        let i = 1;
        i <= totalPaginas;
        i++
    ) {

        const botao =
            criarBotaoPagina(
                i,
                i
            );


        if (i === paginaAtual) {

            botao.classList.add(
                "active"
            );

        }


        pagination.appendChild(
            botao
        );

    }


    /*
     * Próxima página
     */

    if (
        paginaAtual < totalPaginas
    ) {

        const proxima =
            criarBotaoPagina(
                "Próxima »",
                paginaAtual + 1
            );


        pagination.appendChild(
            proxima
        );

    }

}


/*
 * ============================================================
 * BOTÃO DE PAGINAÇÃO
 * ============================================================
 */

function criarBotaoPagina(
    texto,
    pagina
) {

    const botao =
        document.createElement(
            "button"
        );


    botao.type =
        "button";


    botao.textContent =
        texto;


    botao.addEventListener(
        "click",
        function () {

            paginaAtual =
                pagina;


            renderizarProjetos();


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );


    return botao;

}


/*
 * ============================================================
 * FILTROS
 * ============================================================
 */

function aplicarFiltros() {

    const ano =
        document.getElementById(
            "ano_conclusao"
        );


    const semestre =
        document.getElementById(
            "semestre"
        );


    const curso =
        document.getElementById(
            "curso"
        );


    const tipo =
        document.getElementById(
            "tipo_trabalho"
        );


    filtrosAtuais = {

        ano:
            ano
                ? ano.value
                : "",

        semestre:
            semestre
                ? semestre.value
                : "",

        curso:
            curso
                ? curso.value
                : "",

        tipo:
            tipo
                ? tipo.value
                : ""

    };


    paginaAtual = 1;


    fecharModalFiltro();


    renderizarProjetos();

}


/*
 * ============================================================
 * VERIFICA SE EXISTEM FILTROS
 * ============================================================
 */

function existemFiltros() {

    return Boolean(

        filtrosAtuais.ano ||
        filtrosAtuais.semestre ||
        filtrosAtuais.curso ||
        filtrosAtuais.tipo

    );

}


/*
 * ============================================================
 * LIMPAR FILTROS
 * ============================================================
 */

function limparFiltros() {

    filtrosAtuais = {

        ano: "",

        semestre: "",

        curso: "",

        tipo: ""

    };


    const campos = [

        "ano_conclusao",

        "semestre",

        "curso",

        "tipo_trabalho"

    ];


    campos.forEach(
        id => {

            const campo =
                document.getElementById(id);


            if (campo) {

                campo.value = "";

            }

        }
    );


    paginaAtual = 1;


    renderizarProjetos();

}


/*
 * ============================================================
 * MODAL DE FILTROS
 * ============================================================
 */

function abrirModalFiltro() {

    const modal =
        document.getElementById(
            "modal-filtro"
        );


    if (!modal) {

        return;

    }


    modal.classList.add(
        "active"
    );


    modal.setAttribute(
        "aria-hidden",
        "false"
    );

}


function fecharModalFiltro() {

    const modal =
        document.getElementById(
            "modal-filtro"
        );


    if (!modal) {

        return;

    }


    modal.classList.remove(
        "active"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );

}


/*
 * ============================================================
 * PREENCHER ANOS
 * ============================================================
 */

function preencherAnos() {

    const select =
        document.getElementById(
            "ano_conclusao"
        );


    if (!select) {

        return;

    }


    const anoAtual =
        new Date().getFullYear();


    for (
        let ano = anoAtual;
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
 * DETALHES
 * ============================================================
 */

function abrirDetalhes(id) {

    const projeto =
        obterProjeto(id);


    if (!projeto) {

        return;

    }


    const modal =
        document.getElementById(
            "detailsModal"
        );


    const conteudo =
        document.getElementById(
            "detailsContent"
        );


    if (!modal || !conteudo) {

        return;

    }


    const tipo =
        tiposTrabalho[projeto.tipo]
        || projeto.tipo;


    conteudo.innerHTML = `

        <h2>
            ${escapeHTML(projeto.nome_tg)}
        </h2>

        <p>
            <strong>Tipo:</strong>
            ${escapeHTML(tipo)}
        </p>

        <p>
            <strong>Ano:</strong>
            ${escapeHTML(projeto.ano)}
        </p>

        <p>
            <strong>Semestre:</strong>
            ${escapeHTML(projeto.semestre)}
        </p>

        <p>
            <strong>Curso:</strong>
            ${escapeHTML(projeto.curso)}
        </p>

        <p>
            <strong>Orientador(es):</strong>
            ${escapeHTML(
        projeto.orientadores.join(", ")
    )}
        </p>

        <p>
            <strong>Aluno(s):</strong>
            ${escapeHTML(
        projeto.alunos.join(", ")
    )}
        </p>

        ${projeto.arquivoNome
            ? `
                    <p>
                        <strong>Arquivo:</strong>
                        ${escapeHTML(
                projeto.arquivoNome
            )}
                    </p>
                  `
            : ""
        }

    `;


    modal.classList.add(
        "active"
    );


    modal.setAttribute(
        "aria-hidden",
        "false"
    );

}


/*
 * ============================================================
 * FECHAR DETALHES
 * ============================================================
 */

function fecharDetalhes() {

    const modal =
        document.getElementById(
            "detailsModal"
        );


    if (!modal) {

        return;

    }


    modal.classList.remove(
        "active"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );

}


/*
 * ============================================================
 * ESCAPE HTML
 * ============================================================
 *
 * Evita que textos cadastrados pelo usuário sejam interpretados
 * como HTML.
 * ============================================================
 */

function escapeHTML(valor) {

    return String(valor ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}

