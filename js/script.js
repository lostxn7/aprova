const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const navLinks = document.querySelectorAll(".nav a");
const faqButtons = document.querySelectorAll(".faq-question");
const form = document.querySelector("#form-inscricao");
const successMessage = document.querySelector("#mensagem-sucesso");
const year = document.querySelector("#ano-atual");

if (year) {
  year.textContent = new Date().getFullYear();
}

function updateHeader() {
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 8);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");

    menuButton.classList.toggle("active", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
    document.body.classList.toggle("menu-open", isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuButton.classList.remove("active");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Abrir menu");
      document.body.classList.remove("menu-open");
    });
  });
}

faqButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const answer = item?.querySelector(".faq-answer");

    if (!item || !answer) return;

    const isOpen = item.classList.contains("open");

    document.querySelectorAll(".faq-item.open").forEach((openItem) => {
      if (openItem === item) return;

      openItem.classList.remove("open");

      const openButton = openItem.querySelector(".faq-question");
      const openAnswer = openItem.querySelector(".faq-answer");

      openButton?.setAttribute("aria-expanded", "false");

      if (openAnswer) {
        openAnswer.style.maxHeight = null;
      }
    });

    item.classList.toggle("open", !isOpen);
    button.setAttribute("aria-expanded", String(!isOpen));
    answer.style.maxHeight = isOpen ? null : `${answer.scrollHeight}px`;
  });
});

function setFieldError(field, message = "") {
  const wrapper = field.closest(".field");
  const error = wrapper?.querySelector(".field-error");

  wrapper?.classList.toggle("invalid", Boolean(message));

  if (error) {
    error.textContent = message;
  }
}

function validateForm() {
  if (!form) return false;

  const nameField = form.elements.namedItem("nome");
  const emailField = form.elements.namedItem("email");
  const objectiveField = form.elements.namedItem("objetivo");

  let valid = true;

  if (nameField instanceof HTMLInputElement) {
    if (nameField.value.trim().length < 2) {
      setFieldError(nameField, "Digite seu nome.");
      valid = false;
    } else {
      setFieldError(nameField);
    }
  }

  if (emailField instanceof HTMLInputElement) {
    const email = emailField.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setFieldError(emailField, "Digite um e-mail válido.");
      valid = false;
    } else {
      setFieldError(emailField);
    }
  }

  if (objectiveField instanceof HTMLSelectElement) {
    if (!objectiveField.value) {
      setFieldError(objectiveField, "Selecione seu objetivo.");
      valid = false;
    } else {
      setFieldError(objectiveField);
    }
  }

  return valid;
}

if (form) {
  ["input", "change"].forEach((eventName) => {
    form.addEventListener(eventName, (event) => {
      const target = event.target;

      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLSelectElement
      ) {
        setFieldError(target);
      }

      if (successMessage) {
        successMessage.hidden = true;
      }
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateForm()) {
      const firstInvalid = form.querySelector(".field.invalid input, .field.invalid select");
      firstInvalid?.focus();
      return;
    }

    if (successMessage) {
      successMessage.hidden = false;
    }

    form.reset();
  });
}

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("visible");
        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -30px 0px",
    }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}
