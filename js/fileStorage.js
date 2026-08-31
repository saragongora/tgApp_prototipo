/*
 * ============================================================
 * TG APP — ARMAZENAMENTO DE ARQUIVOS
 * ============================================================
 *
 * Utilizamos IndexedDB para armazenar os arquivos PDF.
 *
 * O localStorage continua sendo utilizado para os dados
 * textuais dos projetos.
 *
 * Os PDFs podem vir de duas fontes:
 *
 * 1. PDFs pré-cadastrados no projeto;
 * 2. PDFs enviados pelo usuário através do formulário.
 *
 * Os dois tipos são armazenados da mesma maneira no
 * IndexedDB e ficam associados ao ID do projeto.
 * ============================================================
 */


const FILE_DB_NAME = "tgAppFiles";

const FILE_DB_VERSION = 1;

const FILE_STORE_NAME = "pdfs";

const FILE_CONFIG_STORE = "config";

const PDF_INICIAIS_IMPORTADOS =
    "pdfsIniciaisImportados";


/*
 * ============================================================
 * ABRIR BANCO
 * ============================================================
 */

function abrirBancoArquivos() {

    return new Promise(
        (resolve, reject) => {

            const request =
                indexedDB.open(
                    FILE_DB_NAME,
                    FILE_DB_VERSION
                );


            request.onupgradeneeded =
                function (evento) {

                    const db =
                        evento.target.result;


                    /*
                     * Store dos arquivos PDF.
                     */

                    if (
                        !db.objectStoreNames.contains(
                            FILE_STORE_NAME
                        )
                    ) {

                        db.createObjectStore(
                            FILE_STORE_NAME,
                            {
                                keyPath: "projetoId"
                            }
                        );

                    }


                    /*
                     * Store de configurações.
                     *
                     * Usada para registrar se os PDFs
                     * iniciais já foram importados.
                     */

                    if (
                        !db.objectStoreNames.contains(
                            FILE_CONFIG_STORE
                        )
                    ) {

                        db.createObjectStore(
                            FILE_CONFIG_STORE,
                            {
                                keyPath: "chave"
                            }
                        );

                    }

                };


            request.onsuccess =
                function () {

                    resolve(
                        request.result
                    );

                };


            request.onerror =
                function () {

                    reject(
                        request.error
                    );

                };

        }
    );

}


/*
 * ============================================================
 * SALVAR PDF
 * ============================================================
 */

async function salvarPDF(
    projetoId,
    arquivo
) {

    if (!arquivo) {

        return false;

    }


    const db =
        await abrirBancoArquivos();


    return new Promise(
        (resolve, reject) => {

            const transaction =
                db.transaction(
                    FILE_STORE_NAME,
                    "readwrite"
                );


            const store =
                transaction.objectStore(
                    FILE_STORE_NAME
                );


            const request =
                store.put({

                    projetoId:
                        Number(projetoId),

                    nome:
                        arquivo.name,

                    tipo:
                        arquivo.type ||
                        "application/pdf",

                    tamanho:
                        arquivo.size,

                    arquivo:
                        arquivo,

                    data:
                        new Date().toISOString()

                });


            request.onsuccess =
                function () {

                    resolve(true);

                };


            request.onerror =
                function () {

                    reject(
                        request.error
                    );

                };

        }
    );

}


/*
 * ============================================================
 * BUSCAR PDF
 * ============================================================
 */

async function obterPDF(
    projetoId
) {

    const db =
        await abrirBancoArquivos();


    return new Promise(
        (resolve, reject) => {

            const transaction =
                db.transaction(
                    FILE_STORE_NAME,
                    "readonly"
                );


            const store =
                transaction.objectStore(
                    FILE_STORE_NAME
                );


            const request =
                store.get(
                    Number(projetoId)
                );


            request.onsuccess =
                function () {

                    resolve(
                        request.result ||
                        null
                    );

                };


            request.onerror =
                function () {

                    reject(
                        request.error
                    );

                };

        }
    );

}


/*
 * ============================================================
 * EXCLUIR PDF
 * ============================================================
 */

async function excluirPDF(
    projetoId
) {

    const db =
        await abrirBancoArquivos();


    return new Promise(
        (resolve, reject) => {

            const transaction =
                db.transaction(
                    FILE_STORE_NAME,
                    "readwrite"
                );


            const store =
                transaction.objectStore(
                    FILE_STORE_NAME
                );


            const request =
                store.delete(
                    Number(projetoId)
                );


            request.onsuccess =
                function () {

                    resolve(true);

                };


            request.onerror =
                function () {

                    reject(
                        request.error
                    );

                };

        }
    );

}


/*
 * ============================================================
 * VERIFICAR SE EXISTE PDF
 * ============================================================
 */

async function possuiPDF(
    projetoId
) {

    const pdf =
        await obterPDF(
            projetoId
        );


    return pdf !== null;

}


/*
 * ============================================================
 * ABRIR PDF
 * ============================================================
 */

async function abrirPDF(
    projetoId
) {

    try {

        const registro =
            await obterPDF(
                projetoId
            );


        if (!registro) {

            alert(
                "Este trabalho não possui um PDF cadastrado."
            );

            return;

        }


        const url =
            URL.createObjectURL(
                registro.arquivo
            );


        window.open(
            url,
            "_blank"
        );


        /*
         * Libera o objeto depois de 60 segundos.
         */

        setTimeout(
            function () {

                URL.revokeObjectURL(
                    url
                );

            },
            60000
        );

    } catch (erro) {

        console.error(
            "Erro ao abrir PDF:",
            erro
        );


        alert(
            "Não foi possível abrir o PDF."
        );

    }

}


/*
 * ============================================================
 * BAIXAR PDF
 * ============================================================
 */

async function baixarPDF(
    projetoId
) {

    try {

        const registro =
            await obterPDF(
                projetoId
            );


        if (!registro) {

            alert(
                "Este trabalho não possui um PDF cadastrado."
            );

            return;

        }


        const url =
            URL.createObjectURL(
                registro.arquivo
            );


        const link =
            document.createElement(
                "a"
            );


        link.href =
            url;


        link.download =
            registro.nome ||
            `trabalho-${projetoId}.pdf`;


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();


        setTimeout(
            function () {

                URL.revokeObjectURL(
                    url
                );

            },
            1000
        );

    } catch (erro) {

        console.error(
            "Erro ao baixar PDF:",
            erro
        );


        alert(
            "Não foi possível baixar o PDF."
        );

    }

}


/*
 * ============================================================
 * VERIFICAR IMPORTAÇÃO DOS PDFs INICIAIS
 * ============================================================
 */

async function pdfsIniciaisJaImportados() {

    const db =
        await abrirBancoArquivos();


    return new Promise(
        (resolve, reject) => {

            const transaction =
                db.transaction(
                    FILE_CONFIG_STORE,
                    "readonly"
                );


            const store =
                transaction.objectStore(
                    FILE_CONFIG_STORE
                );


            const request =
                store.get(
                    PDF_INICIAIS_IMPORTADOS
                );


            request.onsuccess =
                function () {

                    resolve(
                        Boolean(
                            request.result
                        )
                    );

                };


            request.onerror =
                function () {

                    reject(
                        request.error
                    );

                };

        }
    );

}


/*
 * ============================================================
 * MARCAR PDFs COMO IMPORTADOS
 * ============================================================
 */

async function marcarPDFsIniciaisComoImportados() {

    const db =
        await abrirBancoArquivos();


    return new Promise(
        (resolve, reject) => {

            const transaction =
                db.transaction(
                    FILE_CONFIG_STORE,
                    "readwrite"
                );


            const store =
                transaction.objectStore(
                    FILE_CONFIG_STORE
                );


            const request =
                store.put({

                    chave:
                        PDF_INICIAIS_IMPORTADOS,

                    data:
                        new Date().toISOString()

                });


            request.onsuccess =
                function () {

                    resolve(true);

                };


            request.onerror =
                function () {

                    reject(
                        request.error
                    );

                };

        }
    );

}


/*
 * ============================================================
 * IMPORTAR PDFs INICIAIS
 * ============================================================
 *
 * Procura os PDFs indicados em projetosBase dentro de:
 *
 * ../assets/pdfs/
 *
 * ou:
 *
 * assets/pdfs/
 *
 * dependendo da página que executar a função.
 * ============================================================
 */

async function importarPDFsIniciais() {

    try {

        /*
         * Verifica se a importação já aconteceu.
         */

        const importados =
            await pdfsIniciaisJaImportados();


        if (importados) {

            return;

        }


        /*
         * Verifica se existem projetos-base.
         */

        if (
            typeof projetosBase ===
            "undefined"
        ) {

            console.warn(
                "projetosBase não foi encontrado."
            );

            return;

        }


        /*
         * Percorre os projetos-base.
         */

        for (
            const projeto
            of projetosBase
        ) {

            if (
                !projeto.arquivoNome
            ) {

                continue;

            }


            /*
             * Tenta localizar o PDF.
             *
             * Como o caminho depende da página,
             * usamos uma URL absoluta baseada no
             * endereço atual do site.
             */

            const caminhoPDF =
                obterCaminhoPDF(
                    projeto.arquivoNome
                );


            try {

                const resposta =
                    await fetch(
                        caminhoPDF
                    );


                if (
                    !resposta.ok
                ) {

                    console.warn(
                        `PDF não encontrado: ${projeto.arquivoNome}`
                    );

                    continue;

                }


                const blob =
                    await resposta.blob();


                /*
                 * Garante que o tipo seja PDF.
                 */

                const pdf =
                    new File(
                        [blob],
                        projeto.arquivoNome,
                        {
                            type:
                                "application/pdf"
                        }
                    );


                /*
                 * Salva usando o mesmo método
                 * dos PDFs enviados pelo usuário.
                 */

                await salvarPDF(
                    projeto.id,
                    pdf
                );


                console.log(
                    `PDF importado: ${projeto.arquivoNome}`
                );

            } catch (erro) {

                console.warn(
                    `Não foi possível importar ${projeto.arquivoNome}:`,
                    erro
                );

            }

        }


        /*
         * Marca a importação como concluída.
         */

        await marcarPDFsIniciaisComoImportados();


        console.log(
            "Importação dos PDFs iniciais concluída."
        );

    } catch (erro) {

        console.error(
            "Erro ao importar PDFs iniciais:",
            erro
        );

    }

}


/*
 * ============================================================
 * CAMINHO DOS PDFs
 * ============================================================
 */

function obterCaminhoPDF(
    nomeArquivo
) {

    /*
     * O projeto possui páginas dentro de
     * subpastas.
     *
     * Usamos ../assets/pdfs/ porque o cadastro.html
     * está dentro de uma pasta.
     *
     * Posteriormente podemos centralizar isso
     * se houver páginas em níveis diferentes.
     */

   function obterCaminhoPDF(
    nomeArquivo
) {

    return (
        "assets/pdfs/" +
        encodeURIComponent(
            nomeArquivo
        )
    );

}

}