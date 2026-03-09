function openContact() {
  const popupInfo = document.getElementById("popupInfo");
  popupInfo.style.visibility =
    popupInfo.style.visibility === "visible" ? "hidden" : "visible";

}

function copyText(){
  var copyText = document.getElementById("myText");

  copyText.select();
  copyText.setSelectionRange(0,9999)

  navigator.clipboard.writeText(copyText.value);

}

class NavigationSystem {
  constructor() {
    this.sidebar = document.querySelector(".sidebar");
    this.sidebarOverlay = document.querySelector(".sidebar-overlay");
    this.menuButton = document.querySelector(".menuButton");
    this.dropdownTriggers = document.querySelectorAll(".dropdown-trigger");
    this.navLinks = document.querySelectorAll('a[href^="#"]');

    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    this.menuButton.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleSidebar();
    });
    this.sidebarOverlay.addEventListener("click", () => {
      this.closeSidebar();
    });

    document.addEventListener("click", (e) => {
      if (
        !this.sidebar.contains(e.target) &&
        !this.menuButton.contains(e.target)
      ) {
        this.closeSidebar();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeSidebar();
        this.closeAllDropdowns();
      }
    });

    this.dropdownTriggers.forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleDropdown(trigger);
      });
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".dropdown-container")) {
        this.closeAllDropdowns();
      }
    });

    this.navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (href.startsWith("#")) {
          e.preventDefault();
          this.smoothScroll(href);
          if (link.closest(".sidebar")) {
            this.closeSidebar();
          }
          this.closeAllDropdowns();
        }
      });
    });
    
    window.addEventListener("resize", () => {
      if (window.innerWidth > 920) {
        this.closeSidebar();
      }
    });
  }

  toggleSidebar() {
    const isActive = this.sidebar.classList.contains("active");
    if (isActive) {
      this.closeSidebar();
    } else {
      this.openSidebar();
    }
  }

  openSidebar() {
    this.sidebar.classList.add("active");
    this.sidebarOverlay.classList.add("active");
    this.menuButton.classList.add("active");
    this.menuButton.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  closeSidebar() {
    this.sidebar.classList.remove("active");
    this.sidebarOverlay.classList.remove("active");
    this.menuButton.classList.remove("active");
    this.menuButton.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    this.sidebar
      .querySelectorAll(".dropdown-container.active")
      .forEach((container) => {
        container.classList.remove("active");
        const trigger = container.querySelector(".dropdown-trigger");
        if (trigger) {
          trigger.setAttribute("aria-expanded", "false");
        }
      });
  }

  toggleDropdown(trigger) {
    const container = trigger.closest(".dropdown-container");
    const isActive = container.classList.contains("active");
    this.closeAllDropdowns();
    if (!isActive) {
      container.classList.add("active");
      trigger.setAttribute("aria-expanded", "true");
    }
  }

  closeAllDropdowns() {
    document
      .querySelectorAll(".dropdown-container.active")
      .forEach((container) => {
        container.classList.remove("active");
        const trigger = container.querySelector(".dropdown-trigger");
        if (trigger) {
          trigger.setAttribute("aria-expanded", "false");
        }
      });
  }

  smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
      const headerHeight = document.querySelector(".header").offsetHeight;
      const elementPosition = element.offsetTop - headerHeight - 20;

      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new NavigationSystem();
});