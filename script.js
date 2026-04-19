'use strict';

const PROGRESS = [33.3, 66.6, 100];

function showModule(index, btn) {
    document.querySelectorAll('.module').forEach((m, i) => {
        m.classList.toggle('active', i === index);
    });
    document.querySelectorAll('.nav-item').forEach((n, i) => {
        n.classList.toggle('active', i === index);
    });
    document.getElementById('progressBar').style.width = PROGRESS[index] + '%';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.innerWidth <= 768) closeSidebar();
}

function toggleSidebar() {
    const sb = document.getElementById('sidebar');
    const ov = document.getElementById('overlay');
    sb.classList.toggle('open');
    ov.classList.toggle('open');
}

function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('overlay').classList.remove('open');
}

function toggleShare() {
    const panel = document.getElementById('sharePanel');
    const isOpen = panel.style.display === 'flex';
    panel.style.display = isOpen ? 'none' : 'flex';
}

function compartirWhatsApp(e) {
    e.preventDefault();
    const url = encodeURIComponent(window.location.href);
    const msg = encodeURIComponent("✨ Material de Formación Docente — Yoya's Makeup School");
    window.open(`https://wa.me/?text=${msg}%20${url}`, '_blank');
}

function compartirEmail(e) {
    e.preventDefault();
    const subject = encodeURIComponent("Formación Maquilladora Docente — Yoya's Makeup School");
    const body = encodeURIComponent(`Te comparto este material de formación profesional:\n\n${window.location.href}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

function copiarEnlace(e) {
    e.preventDefault();
    navigator.clipboard.writeText(window.location.href)
        .then(() => showToast('Enlace copiado al portapapeles'))
        .catch(() => showToast('No se pudo copiar el enlace'));
}

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), 2800);
}

function descargarPDF() {
    showToast('Preparando PDF…');

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.onload = generatePDF;
    script.onerror = () => showToast('Error al cargar el generador de PDF');
    document.head.appendChild(script);
}

function generatePDF() {
    const content = document.getElementById('main');
    const filename = `yoyas-makeup-school-formacion-completa.pdf`;

    const logoImg = new Image();
    logoImg.src = 'logo.png';

    const opt = {
        margin: [16, 15, 18, 15],
        filename,
        image: { type: 'png', quality: 1 }, 
        html2canvas: { 
            scale: 2.0, 
            useCORS: true, 
            letterRendering: true,
            windowWidth: 1200,
            scrollY: 0,
            scrollX: 0
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
        pagebreak: { mode: ['css', 'avoid-all'] }
    };

    document.body.classList.add('pdf-print-mode');

    // Delay robusto para manual completo
    setTimeout(() => {
        html2pdf().set(opt).from(content).toPdf().get('pdf').then(function (pdf) {
            const totalPages = pdf.internal.getNumberOfPages();
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            for (let i = 1; i <= totalPages; i++) {
                pdf.setPage(i);
                pdf.setDrawColor(116, 66, 16); 
                pdf.setLineWidth(1.0); 
                pdf.line(15, pageHeight - 15, pageWidth - 15, pageHeight - 15);

                const logoScale = 0.33; 
                try {
                    pdf.addImage(logoImg, 'PNG', 15, pageHeight - 13, 26, 8.5);
                } catch (e) {
                    // Fallback silencioso
                }

                pdf.setFontSize(8);
                pdf.setTextColor(100, 100, 100);
                pdf.text(`Página ${i} de ${totalPages}`, pageWidth - 36, pageHeight - 10);
            }
        }).save().then(() => {
            document.body.classList.remove('pdf-print-mode');
            showToast('Manual Completo descargado');
        });
    }, 500); 
}

function imprimirPro() {
    showToast('Abriendo versión de imprenta pro…');
    setTimeout(() => {
        window.print();
    }, 300);
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    const mods = document.querySelectorAll('.module');
    let current = [...mods].findIndex(m => m.classList.contains('active'));
    if (e.key === 'ArrowRight' && current < mods.length - 1) showModule(current + 1, null);
    if (e.key === 'ArrowLeft'  && current > 0)               showModule(current - 1, null);
});
