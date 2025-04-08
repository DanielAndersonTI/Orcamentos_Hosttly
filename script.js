document.addEventListener("DOMContentLoaded", function () {
    const { jsPDF } = window.jspdf;

    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const totalSpan = document.getElementById("total");
    const paginasProntasInput = document.getElementById("paginasProntas");
    const servicosEssenciais = document.querySelectorAll(".pacote-basico");

    const scriptCheckbox = document.getElementById("scriptCheckbox");
    const quantidadeScripts = document.getElementById("quantidadeScripts");

    // Mostra ou esconde o campo de quantidade de scripts
    scriptCheckbox.addEventListener("change", () => {
        quantidadeScripts.style.display = scriptCheckbox.checked ? "inline-block" : "none";
        updateTotal();
    });

    quantidadeScripts.addEventListener("input", updateTotal);

    function updateTotal() {
        let total = 1040; // Valor base do pacote básico

        // Subtrai serviços essenciais desmarcados
        servicosEssenciais.forEach((checkbox) => {
            if (!checkbox.checked) {
                total -= parseFloat(checkbox.value) || 0;
            }
        });

        // Adiciona valores dos serviços adicionais
        checkboxes.forEach((checkbox) => {
            if (checkbox.checked && !checkbox.classList.contains("pacote-basico")) {
                if (checkbox === scriptCheckbox) {
                    const qtd = parseInt(quantidadeScripts.value) || 1;
                    total += qtd * parseFloat(checkbox.value);
                } else {
                    total += parseFloat(checkbox.value) || 0;
                }
            }
        });

        // Lógica das páginas
        const numPaginas = parseInt(paginasProntasInput.value) || 4;
        const paginasExtras = Math.max(numPaginas - 4, 0);
        const paginasReduzidas = Math.max(4 - numPaginas, 0);

        total += paginasExtras * 100;
        total -= paginasReduzidas * 100;

        total = Math.max(total, 0);
        totalSpan.textContent = total.toFixed(2);
    }

    paginasProntasInput.addEventListener("input", updateTotal);

    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", updateTotal);
    });

    document.querySelectorAll("nav ul li a").forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add("active");
        }
    });

    updateTotal();

    document.getElementById("gerarPDF").addEventListener("click", gerarPDF);
    document.getElementById("enviarWhatsApp").addEventListener("click", enviarWhatsApp);

    function gerarPDF() {
        const doc = new jsPDF();
        let y = 10;

        doc.setFont("helvetica");
        doc.setFontSize(12);

        doc.text("Orçamento Web Hosttly.com", 10, y);
        y += 10;

        doc.text("Serviços Selecionados:", 10, y);
        y += 10;

        checkboxes.forEach(cb => {
            if (cb.checked) {
                let label = cb.parentElement.textContent.trim();

                if (cb === scriptCheckbox) {
                    const qtd = parseInt(quantidadeScripts.value) || 1;
                    label += ` (Qtd: ${qtd})`;
                }

                doc.text("- " + label, 10, y);
                y += 8;
            }
        });

        y += 5;
        doc.text("Quantidade de páginas prontas: " + paginasProntasInput.value, 10, y);
        y += 10;

        const total = document.getElementById("total").textContent;
        doc.text("Total: R$ " + total, 10, y);

        doc.save("orcamento-web.pdf");
    }

    function enviarWhatsApp() {
        let mensagem = "*Orçamento Web Hosttly.com*%0A%0A";
        mensagem += "*Serviços Selecionados:*%0A";

        checkboxes.forEach(cb => {
            if (cb.checked) {
                let label = cb.parentElement.textContent.trim();
                if (cb === scriptCheckbox) {
                    const qtd = parseInt(quantidadeScripts.value) || 1;
                    label += ` (Qtd: ${qtd})`;
                }
                mensagem += "- " + label + "%0A";
            }
        });

        mensagem += `%0A*Quantidade de páginas:* ${paginasProntasInput.value}`;
        mensagem += `%0A*Total:* R$ ${document.getElementById("total").textContent}`;
        mensagem += `%0A%0A📎 Enviarei o PDF em seguida.`;

        const url = `https://wa.me/5583988660079?text=${mensagem}`;
        window.open(url, "_blank");
    }
});
