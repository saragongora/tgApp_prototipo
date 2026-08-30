
/*
 * ============================================================
 * TG APP — STORAGE
 * ============================================================
 *
 * Este arquivo substitui a comunicação com o banco de dados.
 *
 * Utilizamos localStorage para armazenar os dados dos
 * projetos criados ou modificados pelo usuário.
 *
 * IMPORTANTE:
 *
 * O localStorage pertence ao navegador.
 *
 * Portanto:
 *
 * - os dados permanecem após fechar o navegador;
 * - os dados não são compartilhados entre computadores;
 * - limpar os dados do navegador pode apagar os registros.
 * ============================================================
 */


const STORAGE_KEY = "tgApp_projetos";


/*
 * ============================================================
 * CARREGAR PROJETOS
 * ============================================================
 */

function carregarProjetos() {

    const dadosSalvos = localStorage.getItem(STORAGE_KEY);


    /*
     * Se ainda não existem dados no navegador,
     * criamos uma cópia dos projetos-base.
     */

    if (!dadosSalvos) {

        const projetosIniciais = projetosBase.map(projeto => ({
            ...projeto,

            orientadores: [
                ...projeto.orientadores
            ],

            alunos: [
                ...projeto.alunos
            ]
        }));


        salvarProjetos(projetosIniciais);

        return projetosIniciais;
    }


    try {

        const projetos = JSON.parse(dadosSalvos);

        return Array.isArray(projetos)
            ? projetos
            : [];

    } catch (erro) {

        console.error(
            "Erro ao carregar projetos:",
            erro
        );

        return [];

    }
}


/*
 * ============================================================
 * SALVAR PROJETOS
 * ============================================================
 */

function salvarProjetos(projetos) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(projetos)
    );

}


/*
 * ============================================================
 * ADICIONAR PROJETO
 * ============================================================
 */

function adicionarProjeto(projeto) {

    const projetos = carregarProjetos();


    /*
     * Gera um ID baseado no maior ID existente.
     */

    const maiorId = projetos.reduce(
        (maior, projetoAtual) => {

            return Math.max(
                maior,
                Number(projetoAtual.id) || 0
            );

        },
        0
    );


    const novoProjeto = {

        ...projeto,

        id: maiorId + 1

    };


    projetos.push(novoProjeto);


    salvarProjetos(projetos);


    return novoProjeto;
}


/*
 * ============================================================
 * BUSCAR PROJETO POR ID
 * ============================================================
 */

function obterProjeto(id) {

    const projetos = carregarProjetos();


    return projetos.find(
        projeto => String(projeto.id) === String(id)
    );

}


/*
 * ============================================================
 * EDITAR PROJETO
 * ============================================================
 */

function editarProjeto(id, dadosAtualizados) {

    const projetos = carregarProjetos();


    const indice = projetos.findIndex(
        projeto => String(projeto.id) === String(id)
    );


    if (indice === -1) {

        return null;

    }


    projetos[indice] = {

        ...projetos[indice],

        ...dadosAtualizados,

        id: projetos[indice].id

    };


    salvarProjetos(projetos);


    return projetos[indice];
}


/*
 * ============================================================
 * EXCLUIR PROJETO
 * ============================================================
 */

function excluirProjeto(id) {

    const projetos = carregarProjetos();


    const novosProjetos = projetos.filter(
        projeto =>
            String(projeto.id) !== String(id)
    );


    salvarProjetos(novosProjetos);


    return novosProjetos;

}


/*
 * ============================================================
 * RESTAURAR DADOS ORIGINAIS
 * ============================================================
 *
 * Útil durante o desenvolvimento.
 *
 * Isso apaga as alterações feitas no navegador e retorna
 * aos projetos-base.
 * ============================================================
 */

function restaurarDadosIniciais() {

    localStorage.removeItem(STORAGE_KEY);


    return carregarProjetos();

}


/*
 * ============================================================
 * CONTAGEM DE PROJETOS
 * ============================================================
 */

function quantidadeProjetos() {

    return carregarProjetos().length;

}
