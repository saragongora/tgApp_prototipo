
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
 * IndexedDB:
 * - suporta arquivos maiores;
 * - é próprio para armazenamento estruturado;
 * - funciona diretamente no navegador;
 * - não exige servidor ou banco de dados externo.
 * ============================================================
 */

const FILE_DB_NAME = "tgAppFiles";

const FILE_DB_VERSION = 1;

const FILE_STORE_NAME = "pdfs";


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


            /*
             * Executado somente na primeira criação
             * ou quando a versão do banco muda.
             */

            request.onupgradeneeded =
                function (evento) {

                    const db =
                        evento.target.result;


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

        return;

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
                        arquivo.type,

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
                        request.result || null
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
     * Libera o objeto depois de um tempo.
     */

    setTimeout(
        function () {

            URL.revokeObjectURL(url);

        },
        60000
    );

}


/*
 * ============================================================
 * BAIXAR PDF
 * ============================================================
 */

async function baixarPDF(
    projetoId
) {

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

            URL.revokeObjectURL(url);

        },
        1000
    );

}

