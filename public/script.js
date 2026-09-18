/* =====================================================
   1. PROJECT DATA
   Content lives here as DATA, and the page is generated from it.
   To add a project later, add one object to this array. No HTML editing.

   NOTE: These are PLACEHOLDERS. Replace them with your real projects
   (course projects count!) before sharing the site with employers.
   ===================================================== */
const projects = [
  {
    title: "Project One (placeholder)",
    description:
      "A full-stack MERN app. Replace this with what it does and the problem it solves.",
    tags: ["React", "Node.js", "MongoDB"],
    github: "https://github.com/tejpatel-github",
    demo: "", // an empty string means "no demo link", so the button is skipped
  },
  {
    title: "Project Two (placeholder)",
    description:
      "An Odoo module or automation. Describe the business workflow you improved.",
    tags: ["Python", "Odoo ORM", "XML"],
    github: "https://github.com/tejpatel-github",
    demo: "",
  },
  {
    title: "Project Three (placeholder)",
    description:
      "A frontend project. Describe the tech, the challenge, and the result.",
    tags: ["JavaScript", "HTML5", "CSS3"],
    github: "https://github.com/tejpatel-github",
    demo: "",
  },
];

/* =====================================================
   2. RENDER PROJECT CARDS
   ===================================================== */

// Small helper: builds an <a> that opens in a new tab.
function makeLink(url, label) {
  const a = document.createElement("a");
  a.href = url;
  a.textContent = label;
  a.target = "_blank";
  // "noopener noreferrer" stops the new tab from getting a handle back to
  // this page (a known attack called "tab-nabbing").
  a.rel = "noopener noreferrer";
  return a;
}

function renderProjects() {
  const grid = document.getElementById("project-grid");
  if (!grid) return; // safety: do nothing if the container is missing

  projects.forEach((project) => {
    const card = document.createElement("article");
    card.className = "card";

    // SECURITY: we use textContent (NOT innerHTML) to insert text.
    // textContent treats everything as plain text, so even if this data
    // ever came from an untrusted source, it couldn't inject a <script>
    // tag into your page (an attack called XSS).
    const title = document.createElement("h3");
    title.textContent = project.title;

    const desc = document.createElement("p");
    desc.textContent = project.description;

    const tagList = document.createElement("ul");
    tagList.className = "tags";
    project.tags.forEach((tag) => {
      const li = document.createElement("li");
      li.textContent = tag;
      tagList.appendChild(li);
    });

    const links = document.createElement("div");
    links.className = "card-links";
    if (project.github) links.appendChild(makeLink(project.github, "GitHub →"));
    if (project.demo) links.appendChild(makeLink(project.demo, "Live demo →"));

    card.append(title, desc, tagList, links);
    grid.appendChild(card);
  });
}

/* =====================================================
   3. TYPING EFFECT
   Types a word letter by letter, pauses, deletes it, then moves on
   to the next word, forever.
   ===================================================== */
function startTyping() {
  const target = document.getElementById("typed");
  if (!target) return;

  const roles = ["Web Developer", "Full-Stack Engineer", "Odoo ERP Developer"];

  // Accessibility: if the visitor's OS says "reduce motion", skip the
  // animation and just show the first role as plain text.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    target.textContent = roles[0];
    return;
  }

  let roleIndex = 0; // which word we're on
  let charIndex = 0; // how many letters of it are showing
  let deleting = false; // are we typing or erasing?

  function tick() {
    const word = roles[roleIndex];

    // slice(0, n) = "the first n letters", so growing/shrinking n
    // creates the typing/erasing animation.
    charIndex += deleting ? -1 : 1;
    target.textContent = word.slice(0, charIndex);

    let delay = deleting ? 40 : 90; // erasing is faster than typing

    if (!deleting && charIndex === word.length) {
      deleting = true; // finished typing: pause, then start erasing
      delay = 1500;
    } else if (deleting && charIndex === 0) {
      deleting = false; // finished erasing: move to the NEXT word
      roleIndex = (roleIndex + 1) % roles.length;
      // The % (modulo) wraps back to 0 after the last word, so it loops.
      delay = 400;
    }

    // setTimeout instead of setInterval because the delay CHANGES each
    // step (pauses, fast delete). setInterval only allows one fixed speed.
    setTimeout(tick, delay);
  }

  tick();
}

/* =====================================================
   4. SCROLL-REVEAL
   IntersectionObserver tells us when an element enters the screen, so
   we don't need to constantly check scroll position (which is slow).
   ===================================================== */
function setupReveal() {
  const items = document.querySelectorAll(".reveal");

  // Very old browsers lack IntersectionObserver. Show everything instead
  // of leaving sections hidden forever.
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible"); // CSS animates this change
          observer.unobserve(entry.target); // reveal once, then stop watching
        }
      });
    },
    { threshold: 0.1 }, // trigger when 10% of the section is visible
  );

  items.forEach((el) => observer.observe(el));
}

/* =====================================================
   5. MOBILE MENU
   The CSS does the visuals; JS only flips one class and one attribute.
   ===================================================== */
function setupMobileMenu() {
  const header = document.querySelector(".site-header");
  const button = document.getElementById("menu-toggle");
  const nav = document.getElementById("site-nav");
  if (!header || !button || !nav) return;

  // ONE function controls both the CSS class (drives the visuals) and the
  // aria-expanded attribute (drives screen readers AND the X animation),
  // so the two can never get out of sync.
  function setOpen(open) {
    header.classList.toggle("nav-open", open);
    button.setAttribute("aria-expanded", String(open));
  }

  button.addEventListener("click", () => {
    setOpen(button.getAttribute("aria-expanded") !== "true"); // flip current state
  });

  // Event delegation: ONE listener on the nav catches clicks on any link
  // inside it. closest("a") ignores clicks on empty space. Closing the
  // menu after a click stops it covering the section you just jumped to.
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });

  // Keyboard users expect Escape to close menus.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });
}

/* =====================================================
   6. INIT: run everything
   ===================================================== */
renderProjects();
startTyping();
setupReveal();
setupMobileMenu();
document.getElementById("year").textContent = new Date().getFullYear();
