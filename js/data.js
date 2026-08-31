
/*
 * ============================================================
 * TG APP — DADOS INICIAIS
 * ============================================================
 *
 * Estes são os registros que aparecem quando o protótipo
 * é utilizado pela primeira vez.
 *
 * Eles substituem os registros que anteriormente vinham
 * do banco de dados MySQL.
 *
 * Os usuários poderão adicionar, editar e excluir registros.
 * Essas alterações serão armazenadas no navegador.
 * ============================================================
 */

const projetosBase = [

    {
        id: 7,

        tipo: "pi",

        nome_tg: "EcoMap",

        curso: "Análise e Desenvolvimento de Sistemas",

        ano: 2024,

        semestre: "2",

        orientadores: [
            "Glauco Todesco"
        ],

        alunos: [
            "Sara Gongora",
            "Renan Mion",
            "Rebeca Ciriaca Santos",
            "Livia Sanches de Gonzaga Camargo"
        ],

        /*
         * O PDF será tratado posteriormente com IndexedDB.
         *
         * Por enquanto deixamos apenas a indicação de que
         * existe um arquivo associado ao projeto.
         */
        arquivo: null,

        arquivoNome: "EcoMap.pdf"
    },


    {
        id: 8,

        tipo: "pi",

        nome_tg: "TgApp",

        curso: "Análise e Desenvolvimento de Sistemas",

        ano: 2025,

        semestre: "1",

        orientadores: [
            "Jefferson Blait"
        ],

        alunos: [
            "Sara da Silva Gongora"
        ],

        arquivo: null,
        arquivoNome: "tgapp_doc.pdf"
    },


    {
        id: 9,

        tipo: "pi",

        nome_tg: "Projeto Integrador",

        curso: "Análise e Desenvolvimento de Sistemas",

        ano: 2024,

        semestre: "2",

        orientadores: [
            "Paulo Edson"
        ],

        alunos: [
            "Carla Amanda Nunes"
        ],

        arquivo: null,

        arquivoNome: "Projeto_Integrador.pdf"
    },


    {
        id: 10,

        tipo: "pi",

        nome_tg: "Projeto Integrador",

        curso: "Análise e Desenvolvimento de Sistemas",

        ano: 2024,

        semestre: "2",

        orientadores: [
            "Francisco Almeida"
        ],

        alunos: [
            "Sara Hernandez",
            "Sakuya da Silva"
        ],

        arquivo: null,

        arquivoNome: "Projeto_Integrador.pdf"
    }

];


/*
 * ============================================================
 * CURSOS
 * ============================================================
 */

const cursosDisponiveis = [

    "Análise e Desenvolvimento de Sistemas",

    "Polímeros",

    "Logística",

    "Gestão Empresarial",

    "Manufatura Avançada",

    "Projetos Mecânicos",

    "Gestão da Qualidade",

    "Mecatrônica Industrial"

];


/*
 * ============================================================
 * TIPOS DE TRABALHO
 * ============================================================
 */

const tiposTrabalho = {

    pi: "Projeto Integrador",

    tg: "TG",

    ic: "Iniciação Científica"

};

