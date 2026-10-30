// Trish's Mountain Diner — mobile menu, scroll-spy, FAQ, lightbox, contact form.
(function () {
  "use strict";

  // Mobile menu: toggle + close on link tap, Escape, or outside tap.
  var toggle = document.querySelector("[data-menu-toggle]");
  var menu = document.querySelector("[data-mobile-menu]");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        closeLightbox();
      }
    });
  }

  // Scroll-spy: highlight the nav link for the section in view.
  var navLinks = document.querySelectorAll(".navlinks a[href^='#']");
  var sections = ["welcome", "menu", "signature", "visit-steps", "gallery", "visit", "faq"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach(function (s) { observer.observe(s); });
  }

  // FAQ accordion.
  document.querySelectorAll(".faq-q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".faq-item");
      var wasOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item").forEach(function (i) {
        i.classList.remove("open");
        i.querySelector(".faq-q").setAttribute("aria-expanded", "false");
      });
      if (!wasOpen) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  // Gallery lightbox with prev/next.
  var items = Array.prototype.slice.call(document.querySelectorAll(".g-item"));
  var lightbox = document.getElementById("lightbox");
  var lbImg = lightbox ? lightbox.querySelector(".lb-img") : null;
  var current = 0;
  function openLightbox(index) {
    current = (index + items.length) % items.length;
    lbImg.src = items[current].getAttribute("data-full");
    lbImg.alt = items[current].getAttribute("data-alt") || "";
    lightbox.hidden = false;
  }
  function closeLightbox() {
    if (lightbox) { lightbox.hidden = true; lbImg.src = ""; }
  }
  items.forEach(function (item, i) {
    item.addEventListener("click", function () { openLightbox(i); });
  });
  if (lightbox) {
    lightbox.querySelector(".lb-close").addEventListener("click", closeLightbox);
    lightbox.querySelector(".lb-prev").addEventListener("click", function (e) { e.stopPropagation(); openLightbox(current - 1); });
    lightbox.querySelector(".lb-next").addEventListener("click", function (e) { e.stopPropagation(); openLightbox(current + 1); });
    lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener("keydown", function (e) {
      if (lightbox.hidden) return;
      if (e.key === "ArrowLeft") openLightbox(current - 1);
      if (e.key === "ArrowRight") openLightbox(current + 1);
    });
  }

  // Contact form: opens the visitor's email app addressed to the diner.
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var message = form.message.value.trim();
      var subject = encodeURIComponent("Website enquiry from " + name);
      var body = encodeURIComponent("Name: " + name + "\nEmail: " + email + "\n\n" + message);
      window.location.href = "mailto:trishsmountaindiner@gmail.com?subject=" + subject + "&body=" + body;
    });
  }
})();
