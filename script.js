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
    const activeModule = document.querySelector('.module.active');
    const modNum = activeModule.id.replace('mod-', '');
    const titles = ['formacion-docente', 'psicologia-aula', 'clases-memorables'];
    const filename = `yoyas-makeup-school-${titles[modNum] || modNum}.pdf`;

    // Cargar logo para el PDF
    const logoImg = new Image();
    logoImg.src = 'logo.png';

    const opt = {
        margin: [20, 18, 22, 18],
        filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'avoid-all'] }
    };

    // Activar modo de alta visibilidad para impresión
    document.body.classList.add('pdf-print-mode');

    html2pdf().set(opt).from(activeModule).toPdf().get('pdf').then(function (pdf) {
        const totalPages = pdf.internal.getNumberOfPages();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i);
            
            // Línea decorativa vibrante en el pie (Oro Profundo para impresión)
            pdf.setDrawColor(132, 99, 0); 
            pdf.setLineWidth(0.6);
            pdf.line(18, pageHeight - 15, pageWidth - 18, pageHeight - 15);

            // Logo de la academia
            try {
                pdf.addImage(logoImg, 'PNG', 18, pageHeight - 13, 25, 8);
            } catch (e) {
                pdf.setFontSize(8);
                pdf.setTextColor(194, 24, 91); // Rosa Intenso
                pdf.text("yoyas MAKEUP SCHOOL", 18, pageHeight - 10);
            }

            // Numeración fija en negro puro
            pdf.setFontSize(9);
            pdf.setTextColor(0, 0, 0);
            pdf.text(`Página ${i} de ${totalPages}`, pageWidth - 35, pageHeight - 10);
        }
    }).save().then(() => {
        // Restaurar modo normal
        document.body.classList.remove('pdf-print-mode');
        showToast('PDF descargado correctamente');
    });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    const mods = document.querySelectorAll('.module');
    let current = [...mods].findIndex(m => m.classList.contains('active'));
    if (e.key === 'ArrowRight' && current < mods.length - 1) showModule(current + 1, null);
    if (e.key === 'ArrowLeft'  && current > 0)               showModule(current - 1, null);
});
