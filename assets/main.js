const $ = (selector) => document.querySelector(selector);

const page = document.body.dataset.page || "home";

const createElement = (tag, options = {}) => {
  const element = document.createElement(tag);
  if (options.className) element.className = options.className;
  if (options.text) element.textContent = options.text;
  if (options.html) element.innerHTML = options.html;
  if (options.href) {
    element.href = options.href;
    element.target = options.target || "_blank";
    element.rel = "noreferrer";
  }
  return element;
};

const icon = (className) => {
  const element = createElement("i", { className });
  element.setAttribute("aria-hidden", "true");
  return element;
};

const labelWithIcon = (className, text) => {
  const fragment = document.createDocumentFragment();
  fragment.append(icon(className), document.createTextNode(text));
  return fragment;
};

const iconForLabel = (label = "") => ({
  Home: "fa-solid fa-house",
  Education: "fa-solid fa-graduation-cap",
  Experience: "fa-solid fa-briefcase",
  Research: "fa-solid fa-microscope",
  Achievements: "fa-solid fa-award",
  Places: "fa-solid fa-map-location-dot",
  Resources: "fa-solid fa-headphones",
  Email: "fa-solid fa-envelope",
  "Google Scholar": "fa-solid fa-graduation-cap",
  LinkedIn: "fa-brands fa-linkedin",
  Facebook: "fa-brands fa-facebook",
  Twitter: "fa-brands fa-x-twitter"
})[label] || "fa-solid fa-arrow-up-right-from-square";

const iconForPlaceType = (type = "") => ({
  Travel: "fa-solid fa-plane-departure",
  Conference: "fa-solid fa-chalkboard-user",
  Training: "fa-solid fa-certificate"
})[type] || "fa-solid fa-location-dot";

const setText = (selector, value) => {
  const element = $(selector);
  if (element) element.textContent = value || "";
};

const renderLinks = (links, container) => {
  if (!container) return;
  links.forEach((link, index) => {
    const anchor = createElement("a", {
      className: `button ${index === 0 ? "primary" : ""}`.trim(),
      href: link.url
    });
    anchor.append(labelWithIcon(iconForLabel(link.label), link.label));
    container.append(anchor);
  });
};

const renderFacts = (facts) => {
  const container = $("#quickFacts");
  if (!container) return;
  facts.forEach((fact) => {
    const item = createElement("div", { className: "fact" });
    item.append(
      createElement("span", { text: fact.label }),
      createElement("strong", { text: fact.value })
    );
    container.append(item);
  });
};

const renderTimeline = (items, selector) => {
  const container = $(selector);
  if (!container) return;
  items.forEach((entry) => {
    const item = createElement("article", { className: "timeline-item" });
    const period = createElement("div", { className: "period", text: entry.period });
    const body = createElement("div");
    body.append(
      createElement("h3", { className: "item-title", text: entry.title }),
      createElement("p", { className: "item-meta", text: entry.organization })
    );

    if (entry.description) {
      body.append(createElement("p", { className: "item-detail", text: entry.description }));
    }

    if (entry.details?.length) {
      const list = createElement("ul", { className: "clean-list item-detail" });
      entry.details.forEach((detail) => list.append(createElement("li", { text: detail })));
      body.append(list);
    }

    item.append(period, body);
    container.append(item);
  });
};

const renderPublications = (publications) => {
  const container = $("#publicationList");
  if (!container) return;
  Object.entries(publications)
    .sort(([a], [b]) => Number(b) - Number(a))
    .forEach(([year, items]) => {
      const group = createElement("article", { className: "publication-year" });
      group.append(createElement("h3", { text: year }));
      const list = createElement("ol", { className: "publication-list" });

      items.forEach((paper) => {
        const item = createElement("li", { className: "publication" });
        item.append(
          createElement("div", { className: "publication-title", text: paper.title }),
          createElement("p", { className: "publication-authors", text: paper.authors }),
          createElement("p", { className: "publication-meta", text: paper.venue })
        );

        if (paper.doi) {
          const doi = createElement("a", { href: paper.url || `https://doi.org/${paper.doi}`, text: paper.doi });
          const wrapper = createElement("p", { className: "publication-meta" });
          wrapper.append("doi: ", doi);
          if (paper.note) wrapper.append(` (${paper.note})`);
          item.append(wrapper);
        }

        list.append(item);
      });

      group.append(list);
      container.append(group);
    });
};

const renderList = (items, selector) => {
  const container = $(selector);
  if (!container) return;
  items.forEach((item) => container.append(createElement("li", { text: item })));
};

const renderResources = (resources) => {
  const container = $("#resourceList");
  if (!container) return;
  resources.forEach((resource) => {
    const card = createElement("a", { className: "resource-card", href: resource.url });
    card.append(
      createElement("small", { text: resource.type }),
      createElement("strong", { text: resource.title }),
      createElement("span", { text: resource.label || "Open" })
    );
    container.append(card);
  });
};

const renderPlaces = (places) => {
  const container = $("#placeList");
  if (!container) return;
  places.forEach((place) => {
    const card = createElement("article", { className: "place-card" });
    const head = createElement("div", { className: "place-head" });
    const type = createElement("p", { className: "eyebrow icon-line" });
    type.append(labelWithIcon(iconForPlaceType(place.type), place.type));
    head.append(type, createElement("h2", { text: place.title }));

    const meta = createElement("div", { className: "place-meta" });
    meta.append(
      createElement("span", { text: place.period }),
      createElement("span", { text: place.location })
    );

    card.append(head, meta, createElement("p", { className: "place-note", text: place.description }));

    if (place.images?.length) {
      const gallery = createElement("div", { className: "place-gallery" });
      place.images.forEach((image) => {
        const figure = createElement("figure");
        const img = createElement("img");
        img.src = image.src;
        img.alt = image.alt || place.title;
        figure.append(img);
        if (image.caption) figure.append(createElement("figcaption", { text: image.caption }));
        gallery.append(figure);
      });
      card.append(gallery);
    }

    container.append(card);
  });
};

const renderContact = (contact) => {
  const container = $("#contactList");
  if (!container) return;
  container.innerHTML = `
    <div><i class="fa-solid fa-location-dot" aria-hidden="true"></i><span>${contact.office}</span></div>
    <div><i class="fa-solid fa-phone" aria-hidden="true"></i><span>${contact.phone}</span></div>
    <div><i class="fa-solid fa-envelope" aria-hidden="true"></i><a href="mailto:${contact.email}">${contact.email}</a></div>
  `;
};

const renderSocials = (socials) => {
  const container = $("#socialLinks");
  if (!container) return;
  socials.forEach((social) => {
    const anchor = createElement("a", { href: social.url });
    anchor.append(labelWithIcon(iconForLabel(social.label), social.label));
    container.append(anchor);
  });
};

const renderNavigation = (items) => {
  const container = $("#navLinks");
  if (!container) return;
  const nav = container.closest(".nav");
  const isMobile = () => window.matchMedia("(max-width: 820px)").matches;
  let backdrop = $(".nav-backdrop");

  const syncMenuVisibility = () => {
    const toggle = $(".menu-toggle");
    const expanded = toggle?.getAttribute("aria-expanded") === "true";
    const mobile = isMobile();
    if (toggle) toggle.hidden = !mobile;
    if (backdrop) backdrop.hidden = !mobile || !expanded;
    const mobileHead = container.querySelector(".mobile-menu-head");
    if (mobileHead) mobileHead.hidden = !mobile || !expanded;
    container.hidden = mobile && !expanded;
    container.toggleAttribute("inert", mobile && !expanded);
    container.setAttribute("aria-hidden", String(mobile && !expanded));
  };

  const setMenuOpen = (open) => {
    const toggle = $(".menu-toggle");
    if (toggle) toggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("nav-open", open);
    document.body.classList.toggle("no-scroll", open);
    syncMenuVisibility();
  };

  if (nav && !nav.querySelector(".menu-toggle")) {
    const button = createElement("button", { className: "menu-toggle" });
    button.append(labelWithIcon("fa-solid fa-bars", "Menu"));
    button.type = "button";
    button.setAttribute("aria-controls", "navLinks");
    button.setAttribute("aria-expanded", "false");
    button.addEventListener("click", () => {
      const expanded = button.getAttribute("aria-expanded") === "true";
      setMenuOpen(!expanded);
    });
    nav.insertBefore(button, container);

    if (!backdrop) {
      backdrop = createElement("button", { className: "nav-backdrop" });
      backdrop.type = "button";
      backdrop.setAttribute("aria-label", "Close menu");
      backdrop.addEventListener("click", () => setMenuOpen(false));
      document.body.append(backdrop);
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    });

    window.addEventListener("resize", syncMenuVisibility);
  }

  if (!container.querySelector(".mobile-menu-head")) {
    const head = createElement("div", { className: "mobile-menu-head" });
    head.append(
      createElement("strong", { text: "Menu" })
    );
    const close = createElement("button", { className: "menu-close" });
    close.type = "button";
    close.setAttribute("aria-label", "Close menu");
    close.append(icon("fa-solid fa-xmark"));
    close.addEventListener("click", () => setMenuOpen(false));
    head.append(close);
    container.append(head);
  }

  items.forEach((item) => {
    const anchor = createElement("a", { href: item.href, text: item.label, target: "_self" });
    if (item.page === page) anchor.setAttribute("aria-current", "page");
    anchor.addEventListener("click", () => {
      setMenuOpen(false);
    });
    container.append(anchor);
  });

  syncMenuVisibility();
};

const renderSectionCards = (items) => {
  const container = $("#sectionCards");
  if (!container) return;
  items
    .filter((item) => item.page !== "home")
    .forEach((item) => {
      const card = createElement("a", { className: "page-card", href: item.href, target: "_self" });
      card.append(
        icon(iconForLabel(item.label)),
        createElement("span", { className: "eyebrow", text: item.kicker || "Section" }),
        createElement("strong", { text: item.label }),
        createElement("p", { text: item.description || "" })
      );
      container.append(card);
    });
};

const renderHome = (data) => {
  setText("[data-field='headline']", data.profile.headline);
  setText("[data-field='name']", data.profile.name);
  setText("[data-field='summary']", data.profile.summary);

  const photo = $("#profilePhoto");
  if (photo) {
    photo.src = data.profile.photo;
    photo.alt = `${data.profile.name} portrait`;
  }

  renderLinks(data.profile.links, $("#heroActions"));
  renderFacts(data.profile.facts);
  renderSectionCards(data.navigation);
};

const renderSite = (data) => {
  document.title = page === "home" ? `${data.profile.name} | Academic CV` : document.title;
  setText("[data-field='shortName']", data.profile.shortName);
  renderNavigation(data.navigation);
  renderContact(data.contact);
  renderSocials(data.socials);

  const scholarLink = $("#scholarLink");
  if (scholarLink) scholarLink.href = data.scholarUrl;

  const renderers = {
    home: () => renderHome(data),
    education: () => renderTimeline(data.education, "#educationList"),
    experience: () => renderTimeline(data.experience, "#experienceList"),
    research: () => renderPublications(data.publications),
    achievements: () => {
      renderList(data.awards, "#awardList");
      renderList(data.certificates, "#certificateList");
    },
    places: () => renderPlaces(data.places),
    resources: () => renderResources(data.resources)
  };

  renderers[page]?.();
};

fetch("data.json")
  .then((response) => {
    if (!response.ok) throw new Error("Could not load data.json");
    return response.json();
  })
  .then(renderSite)
  .catch((error) => {
    document.body.prepend(createElement("p", {
      className: "data-error",
      text: `Unable to load CV data: ${error.message}`
    }));
  });
