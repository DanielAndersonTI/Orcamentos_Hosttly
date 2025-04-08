document.addEventListener("DOMContentLoaded", function () {
   
    const { jsPDF } = window.jspdf;

    const exclusivasEcommerce = [
        "siteLojaCompleta",
        "lojaSimplificada",
        "pagamentoSite",
        "fechamentoZap"
    ];

    const opcoesRestaurante = [
        "cardapioZap",
        "cardapioPagamento"
    ];

    const filterProdutos = document.getElementById("filtroProdutos");
    const filterCardapio = document.getElementById("filtroCardapio");
    const totalSpan = document.getElementById("ecom-total");

    function updateTotal() {
        let total = 0;

        // Soma valores dos itens de e-commerce
        exclusivasEcommerce.forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox.checked) {
                total += parseFloat(checkbox.value) || 0;
            }
        });

        // Soma valores dos itens para restaurantes
        opcoesRestaurante.forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox.checked) {
                total += parseFloat(checkbox.value) || 0;
            }
        });

        // Soma valores opcionais (filtros)
        if (filterProdutos.checked) {
            total += parseFloat(filterProdutos.value) || 0;
        }

        if (filterCardapio.checked) {
            total += parseFloat(filterCardapio.value) || 0;
        }

        // Atualiza o total na tela
        totalSpan.textContent = total.toFixed(2);
    }

    // Exclusividade entre opções de e-commerce
    exclusivasEcommerce.forEach(id => {
        const checkbox = document.getElementById(id);
        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
                exclusivasEcommerce.forEach(otherId => {
                    if (otherId !== id) {
                        document.getElementById(otherId).checked = false;
                    }
                });
            }
            updateTotal();
        });
    });

    // Exclusividade entre opções de restaurante
    opcoesRestaurante.forEach(id => {
        const checkbox = document.getElementById(id);
        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
                opcoesRestaurante.forEach(otherId => {
                    if (otherId !== id) {
                        document.getElementById(otherId).checked = false;
                    }
                });
            }
            updateTotal();
        });
    });

    // Eventos para filtros opcionais
    filterProdutos.addEventListener("change", updateTotal);
    filterCardapio.addEventListener("change", updateTotal);

    // Aplica a classe .active no link da página atual
    document.querySelectorAll("nav ul li a").forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add("active");
        }
    });
    
    // Inicializa com o total correto
    updateTotal();

    document.getElementById("gerarPDF").addEventListener("click", gerarPDFEcommerce);
document.getElementById("enviarWhatsApp").addEventListener("click", enviarWhatsAppEcommerce);

function gerarPDFEcommerce() {
    const doc = new jsPDF();
    let y = 10;

    doc.text("Orçamento de E-Commerce - Hosttly.com", 10, y);
    y += 10;

    doc.text("Serviços Selecionados:", 10, y);
    y += 10;

    const inputs = document.querySelectorAll('input[type="checkbox"]');
    inputs.forEach(cb => {
        if (cb.checked) {
            const label = cb.parentElement.textContent.trim();
            doc.text("- " + label, 10, y);
            y += 8;
        }
    });

    y += 5;
    const total = document.getElementById("ecom-total").textContent;
    doc.text("Total: R$ " + total, 10, y);

    doc.save("orcamento-ecommerce.pdf");
}

function enviarWhatsAppEcommerce() {
    const inputs = document.querySelectorAll('input[type="checkbox"]');
    let mensagem = "*Orçamento E-Commerce Hosttly.com*%0A%0A";
    mensagem += "*Serviços Selecionados:*%0A";

    inputs.forEach(cb => {
        if (cb.checked) {
            const label = cb.parentElement.textContent.trim();
            mensagem += "- " + label + "%0A";
        }
    });

    mensagem += `%0A*Total:* R$ ${document.getElementById("ecom-total").textContent}`;
    mensagem += `%0A%0A📎 Enviarei o PDF em seguida.`;

    const url = `https://wa.me/5583988660079?text=${mensagem}`;
    window.open(url, "_blank");
}

});
