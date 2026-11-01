/**
 * MAIN.JS - LÓGICA FRONT-END Y EXPERIENCIA DE USUARIO (UX)
 * Vanilla JavaScript Modular | Tema 1: Componentes físicos de un ordenador actual
 */

document.addEventListener('DOMContentLoaded', () => {
  initReadingProgressBar();
  initSidebarToggle();
  initScrollSpy();
  initBackToTop();
  initFontSizeControls();
  initScrollAnimations();
  initSearch();
  initQuizzes();
  initImageLightbox();
  initLiveEditor();
});

/* --------------------------------------------------------------------------
 * 1. BARRA DE PROGRESO DE LECTURA
 * -------------------------------------------------------------------------- */
function initReadingProgressBar() {
  const progressBar = document.getElementById('readingProgress');
  if (!progressBar) return;

  const updateProgress = () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) return;
    const progress = (window.scrollY / totalHeight) * 100;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/* --------------------------------------------------------------------------
 * 2. NAVEGACIÓN Y MENÚ: DESKOPT DESPLEGABLE / OCULTO Y CAJÓN MÓVIL
 * -------------------------------------------------------------------------- */
function initSidebarToggle() {
  const sidebar = document.getElementById('sidebarNav');
  const backdrop = document.getElementById('sidebarBackdrop');
  
  // Controles móviles
  const menuToggle = document.getElementById('menuToggle');
  const mobileFloatingTocBtn = document.getElementById('mobileFloatingTocBtn');
  const sidebarCloseMobile = document.getElementById('sidebarCloseMobile');

  // Controles de escritorio
  const sidebarToggleDesktop = document.getElementById('sidebarToggleDesktop');
  const sidebarCollapseBtn = document.getElementById('sidebarCollapseBtn');
  const desktopFloatingTocBtn = document.getElementById('desktopFloatingTocBtn');

  if (!sidebar) return;

  // Inyectar bloque de navegación rápida del portal en el cajón móvil
  const sidebarContent = sidebar.querySelector('.sidebar-nav__content');
  if (sidebarContent && !sidebarContent.querySelector('.sidebar-mobile-portal-nav')) {
    const currentPath = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const portalLinks = [
      { href: 'index.html', label: 'Portal de Inicio', badge: 'Inicio' },
      { href: 'tema1.html', label: 'Sistemas: Hardware', badge: 'Tema 1' },
      { href: 'tema2.html', label: 'Sistemas: Redes', badge: 'Tema 2' },
      { href: 'bbdd-tema1.html', label: 'Bases de Datos: Modelo E/R', badge: 'BBDD' }
    ];
    const portalNav = document.createElement('div');
    portalNav.className = 'sidebar-mobile-portal-nav';
    portalNav.setAttribute('aria-label', 'Navegación rápida entre asignaturas y temas');
    portalNav.innerHTML = `
      <div class="sidebar-mobile-portal-nav__title">Navegación del Portal</div>
      <div class="sidebar-mobile-portal-nav__list">
        ${portalLinks.map(item => {
          const isCurrent = currentPath === item.href.toLowerCase();
          return `<a href="${item.href}" class="sidebar-mobile-portal-nav__link${isCurrent ? ' is-current' : ''}"${isCurrent ? ' aria-current="page"' : ''}>
            <span class="sidebar-mobile-portal-nav__label">${item.label}</span>
            <span class="sidebar-mobile-portal-nav__badge">${item.badge}</span>
          </a>`;
        }).join('')}
      </div>
    `;
    sidebarContent.prepend(portalNav);
  }

  // --- LÓGICA MÓVIL (Drawer que desliza de izquierda a derecha) ---
  const openMobileDrawer = () => {
    sidebar.classList.add('is-open');
    if (backdrop) backdrop.classList.add('is-visible');
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'true');
      menuToggle.classList.add('is-active');
    }
    document.body.style.overflow = 'hidden';
  };

  const closeMobileDrawer = () => {
    sidebar.classList.remove('is-open');
    if (backdrop) backdrop.classList.remove('is-visible');
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.classList.remove('is-active');
    }
    document.body.style.overflow = '';
  };

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024 && sidebar.classList.contains('is-open')) {
      closeMobileDrawer();
    }
  }, { passive: true });

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      if (sidebar.classList.contains('is-open')) {
        closeMobileDrawer();
      } else {
        openMobileDrawer();
      }
    });
  }

  if (mobileFloatingTocBtn) {
    mobileFloatingTocBtn.addEventListener('click', openMobileDrawer);
  }

  if (sidebarCloseMobile) {
    sidebarCloseMobile.addEventListener('click', closeMobileDrawer);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeMobileDrawer);
  }

  // Cerrar al pulsar un enlace del índice en pantallas táctiles
  sidebar.querySelectorAll('.nav-toc-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 1024) {
        closeMobileDrawer();
      }
    });
  });

  // --- LÓGICA ESCRITORIO (Sidebar colapsable de izquierda a derecha con persistencia) ---
  const applyDesktopSidebarState = (collapsed) => {
    if (collapsed) {
      document.body.classList.add('sidebar-collapsed');
      if (sidebarToggleDesktop) {
        sidebarToggleDesktop.setAttribute('aria-expanded', 'false');
        sidebarToggleDesktop.title = 'Mostrar índice lateral (Ctrl+B / Alt+S)';
      }
    } else {
      document.body.classList.remove('sidebar-collapsed');
      if (sidebarToggleDesktop) {
        sidebarToggleDesktop.setAttribute('aria-expanded', 'true');
        sidebarToggleDesktop.title = 'Ocultar índice lateral (Ctrl+B / Alt+S)';
      }
    }
  };

  const toggleDesktopSidebar = () => {
    const isCurrentlyCollapsed = document.body.classList.contains('sidebar-collapsed');
    const newState = !isCurrentlyCollapsed;
    applyDesktopSidebarState(newState);
    try {
      localStorage.setItem('hardware_sidebar_collapsed', newState ? 'true' : 'false');
    } catch (e) {
      /* Silencioso si almacenamiento local está bloqueado */
    }
  };

  // Restaurar preferencia guardada en PC
  if (window.innerWidth > 1024) {
    try {
      const savedState = localStorage.getItem('hardware_sidebar_collapsed');
      if (savedState === 'true') {
        applyDesktopSidebarState(true);
      }
    } catch (e) {}
  }

  if (sidebarToggleDesktop) {
    sidebarToggleDesktop.addEventListener('click', toggleDesktopSidebar);
  }

  if (sidebarCollapseBtn) {
    sidebarCollapseBtn.addEventListener('click', () => {
      applyDesktopSidebarState(true);
      try {
        localStorage.setItem('hardware_sidebar_collapsed', 'true');
      } catch (e) {}
    });
  }

  if (desktopFloatingTocBtn) {
    desktopFloatingTocBtn.addEventListener('click', () => {
      applyDesktopSidebarState(false);
      try {
        localStorage.setItem('hardware_sidebar_collapsed', 'false');
      } catch (e) {}
    });
  }

  // Atajos de teclado: Escape para cerrar en móvil, Ctrl+B / Alt+S para alternar en escritorio
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (sidebar.classList.contains('is-open')) {
        closeMobileDrawer();
      }
    }
    // Atajo Ctrl+B o Alt+S para alternar menú en PC
    if ((e.ctrlKey && e.key.toLowerCase() === 'b') || (e.altKey && e.key.toLowerCase() === 's')) {
      if (window.innerWidth > 1024) {
        e.preventDefault();
        toggleDesktopSidebar();
      }
    }
  });
}

/* --------------------------------------------------------------------------
 * 3. SCROLLSPY (RESALTADO DE SECCIÓN ACTIVA EN TOC)
 * -------------------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id], article[id]');
  const navLinks = document.querySelectorAll('.nav-toc-link');

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-80px 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('is-active');
            // Hacer scroll suave en el contenedor del sidebar para mantener visible el enlace activo
            const sidebarContent = document.querySelector('.sidebar-nav__content');
            if (sidebarContent && window.innerWidth > 1024) {
              const linkRect = link.getBoundingClientRect();
              const sidebarRect = sidebarContent.getBoundingClientRect();
              if (linkRect.top < sidebarRect.top || linkRect.bottom > sidebarRect.bottom) {
                link.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
              }
            }
          } else {
            link.classList.remove('is-active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/* --------------------------------------------------------------------------
 * 4. BOTÓN VOLVER ARRIBA
 * -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      backToTopBtn.classList.add('is-visible');
    } else {
      backToTopBtn.classList.remove('is-visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------------------------------
 * 5. CONTROLADOR DE TAMAÑO TIPOGRÁFICO
 * -------------------------------------------------------------------------- */
function initFontSizeControls() {
  const btnDecrease = document.getElementById('fontDecrease');
  const btnReset = document.getElementById('fontReset');
  const btnIncrease = document.getElementById('fontIncrease');
  const sizes = [14, 16, 18, 20];
  let currentIdx = 1; // Default 16px

  const updateFontSize = () => {
    document.documentElement.style.setProperty('--font-base-size', `${sizes[currentIdx]}px`);
  };

  if (btnDecrease) {
    btnDecrease.addEventListener('click', () => {
      if (currentIdx > 0) {
        currentIdx--;
        updateFontSize();
      }
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      currentIdx = 1;
      updateFontSize();
    });
  }

  if (btnIncrease) {
    btnIncrease.addEventListener('click', () => {
      if (currentIdx < sizes.length - 1) {
        currentIdx++;
        updateFontSize();
      }
    });
  }
}

/* --------------------------------------------------------------------------
 * 6. ANIMACIONES DE APARICIÓN AL HACER SCROLL (FADE IN)
 * -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in-on-scroll');
  if (!animatedElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  });

  animatedElements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
 * 7. BUSCADOR INTERNO CON SALTO DIRECTO Y RESALTADO
 * -------------------------------------------------------------------------- */
function initSearch() {
  const searchTrigger = document.getElementById('searchTrigger');
  const searchModal = document.getElementById('searchModal');
  const searchClose = document.getElementById('searchClose');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');

  if (!searchModal || !searchInput || !searchResults) return;

  // Construir índice de búsqueda a partir de elementos textuales del contenido
  const searchableElements = [];
  const contentContainer = document.querySelector('.main-content');
  
  if (contentContainer) {
    const blocks = contentContainer.querySelectorAll('.study-section, .hero-banner');
    blocks.forEach(block => {
      const sectionTitleEl = block.querySelector('.section-title, .main-title');
      const sectionName = sectionTitleEl ? sectionTitleEl.textContent.trim() : 'Contenido';
      
      const paragraphs = block.querySelectorAll('p, li, th, td');
      paragraphs.forEach((node, idx) => {
        const text = node.textContent.trim();
        if (text.length > 15) {
          // Asignar id si no tiene
          if (!node.id) {
            node.id = `search-target-${Math.random().toString(36).substring(2, 9)}`;
          }
          searchableElements.push({
            id: node.id,
            section: sectionName,
            text: text
          });
        }
      });
    });
  }

  const openSearch = () => {
    searchModal.classList.add('is-active');
    searchInput.value = '';
    searchResults.innerHTML = '<div class="search-empty">Escribe cualquier concepto, componente o término técnico para buscar...</div>';
    setTimeout(() => searchInput.focus(), 50);
  };

  const closeSearch = () => {
    searchModal.classList.remove('is-active');
  };

  const searchBackdrop = document.getElementById('searchBackdrop');

  if (searchTrigger) searchTrigger.addEventListener('click', openSearch);
  if (searchClose) searchClose.addEventListener('click', closeSearch);
  if (searchBackdrop) searchBackdrop.addEventListener('click', closeSearch);

  searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal || e.target === searchBackdrop) closeSearch();
  });

  // Atajo de teclado Ctrl+K o Cmd+K
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearch();
    } else if (e.key === 'Escape' && searchModal.classList.contains('is-active')) {
      closeSearch();
    }
  });

  // Filtrado reactivo en tiempo real
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    if (query.length < 2) {
      searchResults.innerHTML = '<div class="search-empty">Escribe al menos 2 caracteres...</div>';
      return;
    }

    const matches = searchableElements.filter(item => item.text.toLowerCase().includes(query)).slice(0, 20);

    if (matches.length === 0) {
      searchResults.innerHTML = `<div class="search-empty">No se encontraron resultados para "<strong>${escapeHtml(query)}</strong>"</div>`;
      return;
    }

    let html = '';
    matches.forEach(item => {
      const highlighted = highlightMatch(item.text, query);
      html += `
        <a href="#${item.id}" class="search-result-item" data-target-id="${item.id}">
          <div class="search-result-item__section">${escapeHtml(item.section)}</div>
          <div class="search-result-item__snippet">${highlighted}</div>
        </a>
      `;
    });

    searchResults.innerHTML = html;

    // Asignar evento click a los resultados
    searchResults.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = item.getAttribute('data-target-id');
        const targetEl = document.getElementById(targetId);
        closeSearch();
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          targetEl.classList.remove('search-highlight-target');
          void targetEl.offsetWidth; // trigger reflow
          targetEl.classList.add('search-highlight-target');
        }
      });
    });
  });

  function highlightMatch(text, query) {
    const lower = text.toLowerCase();
    const idx = lower.indexOf(query);
    if (idx === -1) return escapeHtml(text.slice(0, 160));

    const start = Math.max(0, idx - 45);
    const end = Math.min(text.length, idx + query.length + 65);
    const prefix = start > 0 ? '...' : '';
    const suffix = end < text.length ? '...' : '';

    const before = text.substring(start, idx);
    const match = text.substring(idx, idx + query.length);
    const after = text.substring(idx + query.length, end);

    return `${prefix}${escapeHtml(before)}<mark>${escapeHtml(match)}</mark>${escapeHtml(after)}${suffix}`;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}

/* --------------------------------------------------------------------------
 * 8. GESTIÓN INTERACTIVA DE AUTOEVALUACIONES
 * -------------------------------------------------------------------------- */
function initQuizzes() {
  const quizCards = document.querySelectorAll('.quiz-card');
  if (!quizCards.length) return;

  quizCards.forEach(card => {
    const checkBtn = card.querySelector('.btn-check-quiz, .btn-quiz-check');
    const resetBtn = card.querySelector('.btn-reset-quiz, .btn-quiz-reset');
    const feedback = card.querySelector('.quiz-feedback');
    const options = card.querySelectorAll('.quiz-option');

    if (!checkBtn) return;

    checkBtn.addEventListener('click', () => {
      let anySelected = false;
      let allCorrectlyHandled = true;
      const btnCorrectVal = (checkBtn.getAttribute('data-correct') || '').toLowerCase();

      options.forEach(opt => {
        const input = opt.querySelector('input');
        if (!input) return;

        const isCorrectOption = opt.getAttribute('data-correct') === 'true' || 
                                (btnCorrectVal && input.value.toLowerCase() === btnCorrectVal);
        
        opt.classList.remove('is-correct', 'is-incorrect');

        if (input.checked) {
          anySelected = true;
          if (isCorrectOption) {
            opt.classList.add('is-correct');
          } else {
            opt.classList.add('is-incorrect');
            allCorrectlyHandled = false;
          }
        } else {
          if (isCorrectOption) {
            allCorrectlyHandled = false;
            opt.classList.add('is-correct'); // Mostrar la respuesta correcta
          }
        }
      });

      if (!anySelected) {
        if (feedback) {
          feedback.textContent = 'Por favor selecciona al menos una respuesta para comprobar.';
          feedback.className = 'quiz-feedback quiz-feedback--info is-visible';
        }
        return;
      }

      if (feedback) {
        const explanation = card.getAttribute('data-explanation') || checkBtn.getAttribute('data-feedback') || '';
        if (allCorrectlyHandled) {
          feedback.innerHTML = `<strong>¡Excelente! Respuesta correcta.</strong><br>${explanation}`;
        } else {
          feedback.innerHTML = `<strong>Revisión de respuestas:</strong> Se ha resaltado en verde la opción correcta.<br>${explanation}`;
        }
        feedback.className = 'quiz-feedback quiz-feedback--info is-visible';
      }
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        options.forEach(opt => {
          const input = opt.querySelector('input');
          if (input) input.checked = false;
          opt.classList.remove('is-correct', 'is-incorrect');
        });
        if (feedback) {
          feedback.className = 'quiz-feedback';
          feedback.innerHTML = '';
        }
      });
    }
  });
}

/* --------------------------------------------------------------------------
 * 10. VISOR DE IMÁGENES AMPLIADAS (LIGHTBOX MINIMALISTA)
 * -------------------------------------------------------------------------- */
function initImageLightbox() {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('imageModalImg');
  const modalCaption = document.getElementById('imageModalCaption');
  const modalClose = document.getElementById('imageModalClose');
  const modalBackdrop = document.getElementById('imageModalBackdrop');

  if (!modal || !modalImg || !modalCaption) return;

  const openLightbox = (src, alt, captionText) => {
    modalImg.src = src;
    modalImg.alt = alt || 'Imagen ampliada de componente hardware';
    modalCaption.textContent = captionText || '';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    modalImg.src = '';
  };

  // Delegar eventos de apertura en todas las tarjetas de figuras
  document.querySelectorAll('.figure-card').forEach(card => {
    const imgContainer = card.querySelector('.figure-card__img-container');
    const img = card.querySelector('.figure-card__img');
    const caption = card.querySelector('.figure-card__caption');
    const zoomBtn = card.querySelector('.figure-card__zoom-btn');

    if (!imgContainer || !img) return;

    const handleOpen = () => {
      const captionText = caption ? caption.textContent.trim() : '';
      openLightbox(img.currentSrc || img.src, img.alt, captionText);
    };

    imgContainer.addEventListener('click', (e) => {
      // Si se pulsa el botón o cualquier parte del contenedor
      handleOpen();
    });

    if (zoomBtn) {
      zoomBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        handleOpen();
      });
    }
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeLightbox);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', closeLightbox);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeLightbox();
    }
  });
}


/* --------------------------------------------------------------------------
 * 10. MODO EDICIÓN EN VIVO (LIVE CONTENT EDITOR & DIRECT HTML PERSISTENCE)
 * -------------------------------------------------------------------------- */
function initLiveEditor() {
  let isEditing = false;
  let modifiedCount = 0;
  const originalValues = new Map();

  // 1. Inyectar botón de modo edición en la cabecera si no existe
  const headerActions = document.querySelector('.site-header__actions, .header-actions');
  let btnToggle = document.getElementById('btnEditMode');
  
  if (!btnToggle && headerActions) {
    btnToggle = document.createElement('button');
    btnToggle.type = 'button';
    btnToggle.id = 'btnEditMode';
    btnToggle.className = 'btn-edit-mode';
    btnToggle.title = 'Activar Modo Edición (Ctrl + E)';
    btnToggle.setAttribute('aria-label', 'Activar Modo Edición');
    btnToggle.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 20h9"></path>
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
      </svg>
      <span>Editar</span>
    `;
    const searchTrigger = document.getElementById('searchTrigger');
    if (searchTrigger) {
      headerActions.insertBefore(btnToggle, searchTrigger);
    } else {
      headerActions.appendChild(btnToggle);
    }
  }

  // 2. Crear e inyectar el Dock flotante inferior y el Modal de Confirmación
  const dock = document.createElement('div');
  dock.className = 'editor-dock';
  dock.id = 'editorDock';
  dock.innerHTML = `
    <div class="editor-dock__status">
      <span class="editor-dock__badge">✏️ Modo Edición</span>
      <span class="editor-dock__counter" id="editorCounter">0 cambios</span>
    </div>
    <div class="editor-dock__actions">
      <button type="button" class="editor-dock__btn editor-dock__btn--discard" id="btnDiscardEdits" title="Descartar los cambios hechos en esta sesión">Descartar</button>
      <button type="button" class="editor-dock__btn editor-dock__btn--save" id="btnSaveEdits" title="Guardar cambios permanentemente en el archivo HTML">Guardar en HTML</button>
      <button type="button" class="editor-dock__btn editor-dock__btn--exit" id="btnExitEditMode" title="Salir del modo edición">✕</button>
    </div>
  `;
  document.body.appendChild(dock);

  // Modal de confirmación
  const modalBackdrop = document.createElement('div');
  modalBackdrop.className = 'editor-modal-backdrop';
  modalBackdrop.id = 'editorModalBackdrop';
  modalBackdrop.innerHTML = `
    <div class="editor-modal" role="dialog" aria-modal="true" aria-labelledby="editorModalTitle">
      <div class="editor-modal__header">
        <div class="editor-modal__icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
        </div>
        <h3 class="editor-modal__title" id="editorModalTitle">Confirmar Guardado Permanente</h3>
      </div>
      <div class="editor-modal__body">
        <p>Estás a punto de sobreescribir permanentemente los textos de este archivo:</p>
        <div class="editor-modal__file-badge" id="editorTargetFilename">archivo.html</div>
        <p style="margin-top:10px;">
          Se guardarán <strong id="editorModalChangeCount">0 modificaciones</strong> directamente en el código fuente HTML del disco.
        </p>
      </div>
      <div class="editor-modal__footer">
        <button type="button" class="editor-modal__btn editor-modal__btn--cancel" id="btnCancelSave">Seguir editando</button>
        <button type="button" class="editor-modal__btn editor-modal__btn--confirm" id="btnConfirmSave">Confirmar y Guardar</button>
      </div>
    </div>
  `;
  document.body.appendChild(modalBackdrop);

  // Notificación flotante (Toast)
  const toast = document.createElement('div');
  toast.className = 'editor-toast';
  toast.id = 'editorToast';
  document.body.appendChild(toast);

  const showToast = (message, isError = false) => {
    toast.textContent = message;
    toast.className = `editor-toast is-visible ${isError ? 'editor-toast--error' : ''}`;
    setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 4500);
  };

  // Helper para identificar el archivo actual
  const getCurrentFilename = () => {
    let path = window.location.pathname;
    let filename = path.substring(path.lastIndexOf('/') + 1);
    if (!filename || filename === '') {
      filename = 'index.html';
    }
    return filename;
  };

  // Identificar elementos de texto editables (excluyendo controles, encabezados y modales)
  const getEditableElements = () => {
    const candidates = document.querySelectorAll(
      'main p, main h1, main h2, main h3, main h4, main h5, main li, main figcaption, main td, main th, .hero-banner p, .hero-banner h1, .portal-hero__title, .portal-hero__subtitle, .syllabus-item__title, .feature-box__title, .feature-box__desc, .note-box, .explicacion-box__body, .ejemplo-box__body, .quiz-option-text, .quiz-feedback'
    );
    return Array.from(candidates).filter(el => {
      if (el.closest('.btn-portal-back, .site-header, .sidebar-nav, .search-modal, .editor-dock, .editor-modal-backdrop, .quiz-card__actions, .btn-hero-primary, .btn-hero-secondary, .syllabus-action-btn, button, kbd, svg')) {
        return false;
      }
      return true;
    });
  };

  // Alternar el Modo Edición
  const toggleEditMode = (active) => {
    isEditing = (active !== undefined) ? active : !isEditing;
    document.body.classList.toggle('editor-mode-active', isEditing);
    if (btnToggle) {
      btnToggle.classList.toggle('is-active', isEditing);
      const span = btnToggle.querySelector('span');
      if (span) span.textContent = isEditing ? 'Editando...' : 'Editar';
    }
    dock.classList.toggle('is-visible', isEditing);

    const editables = getEditableElements();
    editables.forEach(el => {
      if (isEditing) {
        if (!originalValues.has(el)) {
          originalValues.set(el, el.innerHTML);
        }
        el.setAttribute('contenteditable', 'true');
        el.setAttribute('spellcheck', 'false');
        el.addEventListener('input', handleElementInput);
      } else {
        el.removeAttribute('contenteditable');
        el.removeAttribute('spellcheck');
        el.removeEventListener('input', handleElementInput);
      }
    });

    if (isEditing) {
      showToast('✏️ Modo Edición activado. Haz clic en cualquier texto para modificarlo.');
    }
  };

  const handleElementInput = (e) => {
    const el = e.currentTarget;
    const original = originalValues.get(el);
    if (original !== undefined && el.innerHTML !== original) {
      el.classList.add('is-modified');
    } else {
      el.classList.remove('is-modified');
    }
    updateModifiedCount();
  };

  const updateModifiedCount = () => {
    const modifiedElements = document.querySelectorAll('.is-modified');
    modifiedCount = modifiedElements.length;
    const counterEl = document.getElementById('editorCounter');
    if (counterEl) {
      counterEl.textContent = `${modifiedCount} cambio${modifiedCount === 1 ? '' : 's'}`;
    }
  };

  const discardEdits = () => {
    originalValues.forEach((html, el) => {
      el.innerHTML = html;
      el.classList.remove('is-modified');
    });
    updateModifiedCount();
    showToast('Modificaciones descartadas.');
  };

  const openConfirmModal = () => {
    const filename = getCurrentFilename();
    document.getElementById('editorTargetFilename').textContent = filename;
    document.getElementById('editorModalChangeCount').textContent = `${modifiedCount} texto${modifiedCount === 1 ? '' : 's'}`;
    modalBackdrop.classList.add('is-visible');
  };

  const closeConfirmModal = () => {
    modalBackdrop.classList.remove('is-visible');
  };

  // Guardado permanente y persistencia
  const saveChangesToDisk = async () => {
    closeConfirmModal();
    const filename = getCurrentFilename();

    // 1. Clonar el DOM para generar el HTML limpio sin artefactos del editor
    const cloneDoc = document.documentElement.cloneNode(true);

    cloneDoc.classList.remove('editor-mode-active');
    cloneDoc.querySelectorAll('[contenteditable]').forEach(el => {
      el.removeAttribute('contenteditable');
      el.removeAttribute('spellcheck');
      el.classList.remove('is-modified');
    });

    // Remover artefactos temporales inyectados
    const dockClone = cloneDoc.querySelector('#editorDock');
    if (dockClone) dockClone.remove();
    const modalClone = cloneDoc.querySelector('#editorModalBackdrop');
    if (modalClone) modalClone.remove();
    const toastClone = cloneDoc.querySelector('#editorToast');
    if (toastClone) toastClone.remove();

    // Revertir estado del botón de editar en la cabecera dentro del clon
    const btnClone = cloneDoc.querySelector('#btnEditMode');
    if (btnClone) {
      btnClone.classList.remove('is-active');
      const span = btnClone.querySelector('span');
      if (span) span.textContent = 'Editar';
    }

    const cleanHtml = '<!DOCTYPE html>\n' + cloneDoc.outerHTML;

    // 2. Intentar guardar mediante el servidor local (/api/save)
    try {
      const response = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: filename,
          html: cleanHtml
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          getEditableElements().forEach(el => {
            originalValues.set(el, el.innerHTML);
            el.classList.remove('is-modified');
          });
          updateModifiedCount();
          toggleEditMode(false);
          showToast(`✅ ¡Guardado con éxito! ${filename} actualizado permanentemente en disco.`);
          return;
        }
      }
      throw new Error('Servidor local no disponible');
    } catch (err) {
      // 3. Fallback cuando se abre vía file:/// (sin servidor corriendo)
      const blob = new Blob([cleanHtml], { type: 'text/html;charset=utf-8' });
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);

      showToast(`💾 Archivo descargado para reemplazar. Para guardado 100% automático sin descargas, inicia iniciar_editor.bat`);
      toggleEditMode(false);
    }
  };

  // Event Listeners
  if (btnToggle) {
    btnToggle.addEventListener('click', () => toggleEditMode());
  }

  const btnDiscard = document.getElementById('btnDiscardEdits');
  if (btnDiscard) {
    btnDiscard.addEventListener('click', discardEdits);
  }

  const btnSave = document.getElementById('btnSaveEdits');
  if (btnSave) {
    btnSave.addEventListener('click', () => {
      openConfirmModal();
    });
  }

  const btnExit = document.getElementById('btnExitEditMode');
  if (btnExit) {
    btnExit.addEventListener('click', () => toggleEditMode(false));
  }

  const btnCancelSave = document.getElementById('btnCancelSave');
  if (btnCancelSave) {
    btnCancelSave.addEventListener('click', closeConfirmModal);
  }

  const btnConfirmSave = document.getElementById('btnConfirmSave');
  if (btnConfirmSave) {
    btnConfirmSave.addEventListener('click', saveChangesToDisk);
  }

  // Atajos de teclado: Ctrl + E (o Alt + E) para alternar modo edición
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey || e.altKey) && e.key.toLowerCase() === 'e') {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
      e.preventDefault();
      toggleEditMode();
    }
    if (e.key === 'Escape') {
      if (modalBackdrop.classList.contains('is-visible')) {
        closeConfirmModal();
      }
    }
  });
}
