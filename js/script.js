// Funciones principales para el sitio web
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar componentes interactivos
    initializeTooltips();
    highlightCurrentPage();
});

// Resaltar la página actual en el menú de navegación
function highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentPath.includes(linkPath) && linkPath !== '../index.html') {
            link.parentElement.classList.add('active');
        }
    });
}

// Inicializar tooltips
function initializeTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseover', function() {
            const tooltipText = this.getAttribute('data-tooltip');
            const tooltipElement = document.createElement('div');
            tooltipElement.className = 'tooltip';
            tooltipElement.textContent = tooltipText;
            
            document.body.appendChild(tooltipElement);
            
            const rect = this.getBoundingClientRect();
            tooltipElement.style.top = rect.bottom + 10 + 'px';
            tooltipElement.style.left = rect.left + (rect.width / 2) - (tooltipElement.offsetWidth / 2) + 'px';
            
            this.addEventListener('mouseout', function() {
                document.body.removeChild(tooltipElement);
            }, { once: true });
        });
    });
}

// Función de búsqueda
function search() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (searchTerm.trim() === '') {
        alert('Por favor, ingrese un término de búsqueda');
        return;
    }
    
    window.location.href = '/busqueda.html?q=' + encodeURIComponent(searchTerm);
}

// Permitir búsqueda al presionar Enter
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                search();
            }
        });
    }
});

// Función para copiar código al portapapeles
function copyCode(button) {
    const codeBlock = button.parentElement.querySelector('code');
    const textArea = document.createElement('textarea');
    textArea.value = codeBlock.textContent;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    
    // Cambiar texto del botón temporalmente
    const originalText = button.textContent;
    button.textContent = '¡Copiado!';
    setTimeout(() => {
        button.textContent = originalText;
    }, 2000);
}

// Función para mostrar/ocultar secciones
function toggleSection(button, sectionId) {
    const section = document.getElementById(sectionId);
    if (section.style.display === 'none') {
        section.style.display = 'block';
        button.textContent = 'Ocultar';
    } else {
        section.style.display = 'none';
        button.textContent = 'Mostrar';
    }
}
