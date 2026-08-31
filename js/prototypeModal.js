/*
 * ============================================================
 * TG APP — MODAL DO PROTÓTIPO
 * ============================================================
 */


document.addEventListener(
    "DOMContentLoaded",
    iniciarPrototypeModal
);


function iniciarPrototypeModal() {

    const modal =
        document.getElementById(
            "prototypeModal"
        );


    const botaoFechar =
        document.getElementById(
            "prototypeClose"
        );


    if (!modal) {

        return;

    }


    /*
     * Fecha pelo botão X.
     */

    if (botaoFechar) {

        botaoFechar.addEventListener(
            "click",
            fecharPrototypeModal
        );

    }


    /*
     * Fecha clicando fora do card.
     */

    modal.addEventListener(
        "click",
        function (evento) {

            if (
                evento.target === modal
            ) {

                fecharPrototypeModal();

            }

        }
    );


    /*
     * Também permite fechar usando ESC.
     */

    document.addEventListener(
        "keydown",
        function (evento) {

            if (
                evento.key === "Escape"
            ) {

                fecharPrototypeModal();

            }

        }
    );

}


function fecharPrototypeModal() {

    const modal =
        document.getElementById(
            "prototypeModal"
        );


    if (!modal) {

        return;

    }


    modal.classList.add(
        "hidden"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );

}