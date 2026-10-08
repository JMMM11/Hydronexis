// HEADER: inserta el navbar antes de inicializar los plugins del tema.
const loadScriptOnce = (src) => new Promise((resolve, reject) => {
  const existing = [...document.scripts].find((script) =>
    new URL(script.src || "", document.baseURI).pathname.endsWith(`/${src}`));

  if (existing) {
    if (existing.dataset.hydronexisLoaded === "true" || !existing.dataset.hydronexisLoader) {
      resolve();
      return;
    }
    existing.addEventListener("load", resolve, { once: true });
    existing.addEventListener("error", reject, { once: true });
    return;
  }

  const script = document.createElement("script");
  script.src = src;
  script.dataset.hydronexisLoader = "true";
  script.onload = () => {
    script.dataset.hydronexisLoaded = "true";
    resolve();
  };
  script.onerror = () => reject(new Error(`No se pudo cargar ${src}`));
  document.body.appendChild(script);
});

let renderedSessionKey = null;


/* =====================================================
   DROPDOWN EXPLORE
===================================================== */

function initExploreDropdown(target) {

  const exploreNav =
    target.querySelector("#exploreNavItem");

  const exploreTrigger =
    target.querySelector("#exploreTrigger");

  const exploreMenu =
    target.querySelector("#exploreMenu");


  if (!exploreNav || !exploreTrigger || !exploreMenu) {

    console.warn(
      "Explore dropdown: no se encontraron los elementos."
    );

    return;

  }


  const closeExplore = () => {

    exploreNav.classList.remove("explore-open");

    exploreTrigger.setAttribute(
      "aria-expanded",
      "false"
    );

  };


  exploreTrigger.addEventListener(
    "click",
    (event) => {

      event.preventDefault();
      event.stopPropagation();

      const isOpen =
        exploreNav.classList.toggle("explore-open");

      exploreTrigger.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

    }
  );


  document.addEventListener(
    "click",
    (event) => {

      if (!exploreNav.contains(event.target)) {
        closeExplore();
      }

    }
  );


  document.addEventListener(
    "keydown",
    (event) => {

      if (event.key === "Escape") {
        closeExplore();
      }

    }
  );

}

function setCurrentNavigation(target) {
  const currentFile = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  const marketplaceChildren = new Set([
    "marketplace-product.html", "seller-detail.html", "cart-page.html",
    "checkout.html", "orders.html", "shop-list.html", "single-product.html"
  ]);
  const dashboardChildren = new Set(["profile.html", "process.html", "premium.html"]);
  const currentNavFile = currentFile.startsWith("sellers-") || marketplaceChildren.has(currentFile)
    ? "grid-shop.html"
    : dashboardChildren.has(currentFile)
      ? "dashboard2.html"
      : currentFile;

  target.querySelectorAll(".rd-navbar-nav .rd-nav-item").forEach((item) => item.classList.remove("active"));
  target
  .querySelectorAll(".rd-navbar-nav .rd-nav-link")
  .forEach((link) => {

    link.removeAttribute("aria-current");

    const href =
      link.getAttribute("href");

    if (!href) {
      return;
    }

    const hrefFile =
      new URL(href, document.baseURI)
        .pathname
        .split("/")
        .pop()
        .toLowerCase();

    if (hrefFile === currentNavFile) {

      link
        .closest(".rd-nav-item")
        ?.classList.add("active");

      link.setAttribute(
        "aria-current",
        "page"
      );

    }

  });

  const explorePages = new Set([
    "grid-shop.html",
    "maps.html",
    "community.html",
    "exchange.html",
    "seller.html",
    "grid-blog.html"
  ]);

  if (explorePages.has(currentNavFile)) {
    const exploreNav =
      target.querySelector("#exploreNavItem");

    const exploreLink =
      exploreNav?.querySelector(":scope > .rd-nav-link");

    exploreNav?.classList.add("active");
    exploreLink?.setAttribute("aria-current", "page");
  }
}

document.addEventListener("hydronexisSessionChanged", (event) => {
  if (!renderedSessionKey) return;
  const session = event.detail;
  const nextKey = `${session.user?.uid || "guest"}:${session.plan}:${session.status}`;
  if (nextKey !== renderedSessionKey) window.location.reload();
});

async function loadThemeScripts() {
  await loadScriptOnce("js/core.min.js");
  await loadScriptOnce("js/script.js");
}

document.addEventListener("DOMContentLoaded", async () => {
  const target = document.getElementById("header");
  let headerInserted = false;
  let user = null;
  let currentPlan = "guest";
  let currentProfile = null;

  try {
    if (!target) throw new Error("No existe el contenedor #header");
    target.setAttribute("aria-busy", "true");

    const response = await fetch("components/header.html");
    if (!response.ok) throw new Error("No se pudo cargar el header");
    target.innerHTML = await response.text();
    headerInserted = true;
    setCurrentNavigation(target);
    initExploreDropdown(target);
  } catch (error) {
    console.error("Error cargando el header:", error);
  }

  const globalCartPromise = headerInserted
    ? import("./global-cart.js")
      .then(({ initializeGlobalCart }) => initializeGlobalCart(target))
      .catch((error) => {
        console.error("No se pudo inicializar el carrito global:", error);
      })
    : Promise.resolve();

  // Los estilos ya mantienen visible el contenido. Estos plugins se cargan
  // aunque Firebase o el componente del header no esten disponibles.
  const themeScriptsPromise = loadThemeScripts().catch((error) => {
    console.error("No se pudieron inicializar los componentes visuales:", error);
  });

  if (headerInserted) {
  try {

    /* =====================================================
       SESIÓN Y PLAN
    ===================================================== */

    const {
      getCurrentUserPlan,
      applyPlanPermissions,
      signOutCurrentUser,
      getRequiredPlanForPermission,
      getPlanLabel
    } = await import("./plan-manager.js");

    const session = await getCurrentUserPlan();

    user = session.user;
    currentPlan = session.plan;
    currentProfile = session.profile;

    renderedSessionKey =
      `${session.user?.uid || "guest"}:${session.plan}:${session.status}`;

    applyPlanPermissions(currentPlan, target);

    /* =====================================================
      LINKS BLOQUEADOS POR PLAN
    ===================================================== */

    target
      .querySelectorAll("[data-requires-permission]")
      .forEach((link) => {

        const permission =
          link.dataset.requiresPermission;

        const requiredPlan =
          getRequiredPlanForPermission(permission);

        if (
          link.classList.contains("is-plan-locked") &&
          requiredPlan
        ) {

          const requiredPlanLabel =
            getPlanLabel(requiredPlan);

          link.title =
            `Available with ${requiredPlanLabel}`;

        }

        link.addEventListener("click", (event) => {

          if (!link.classList.contains("is-plan-locked")) {
            return;
          }

          event.preventDefault();
          event.stopPropagation();

          const plan =
            getRequiredPlanForPermission(permission);

          const label =
            getPlanLabel(plan);

          console.log(
            `${permission} requires ${label}`
          );

        });

      });


    /* =====================================================
       ELEMENTOS DEL PERFIL
    ===================================================== */

    const userTrigger =
      target.querySelector("#navbarUserTrigger");

    const userMenu =
      target.querySelector("#navbarUserMenu");

    const nameNode =
      target.querySelector("#navbarUserName");

    const avatarNode =
      target.querySelector("#navbarUserAvatar");

    const smallAvatarNode =
      target.querySelector("#navbarUserAvatarSmall");

    const badgeNode =
      target.querySelector("#navbarPlanBadge");

    const emailNode =
      target.querySelector("#navbarUserEmail");

    const logoutButton =
      target.querySelector("#navbarLogoutButton");


    /* =====================================================
       USUARIO AUTENTICADO
    ===================================================== */

    if (user) {

      const displayName =
        currentProfile?.name?.trim()
        || user.displayName?.trim()
        || user.email?.split("@")[0]
        || "Hydronexis user";


      const initials = displayName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("") || "HN";


      const planLabels = {
        sprout: "Sprout",
        blooming: "Blooming",
        go_green: "Go Green"
      };


      const profilePhoto =
        currentProfile?.photoUrl?.trim()
        || user.photoURL?.trim()
        || "";


      /* ===============================
         NOMBRE
      ================================ */

      if (nameNode) {
        nameNode.textContent = displayName;
      }


      /* ===============================
         PLAN
      ================================ */

      if (badgeNode) {
        badgeNode.textContent =
          planLabels[currentPlan]
          || "Access unavailable";
      }


      /* ===============================
         EMAIL
      ================================ */

      if (emailNode) {
        emailNode.textContent =
          user.email || "";
      }


      /* ===============================
         AVATAR GRANDE
      ================================ */

      if (avatarNode) {

        avatarNode.replaceChildren();

        if (profilePhoto) {

          const image = document.createElement("img");

          image.src = profilePhoto;
          image.alt = `${displayName} profile`;

          avatarNode.appendChild(image);

        } else {

          avatarNode.textContent = initials;

        }
      }


      /* ===============================
         AVATAR PEQUEÑO DEL NAVBAR
      ================================ */

      if (smallAvatarNode) {

        smallAvatarNode.replaceChildren();

        if (profilePhoto) {

          const image = document.createElement("img");

          image.src = profilePhoto;
          image.alt = `${displayName} profile`;

          smallAvatarNode.appendChild(image);

        } else {

          smallAvatarNode.textContent = initials;

        }
      }


      /* =====================================================
         ABRIR / CERRAR DROPDOWN
      ===================================================== */

      if (userTrigger && userMenu) {

        userTrigger.addEventListener("click", (event) => {

          event.stopPropagation();

          const isOpen =
            userMenu.classList.toggle("show");

          userTrigger.classList.toggle(
            "active",
            isOpen
          );

          userTrigger.setAttribute(
            "aria-expanded",
            String(isOpen)
          );

        });


        document.addEventListener("click", (event) => {

          if (
            !userMenu.contains(event.target) &&
            !userTrigger.contains(event.target)
          ) {

            userMenu.classList.remove("show");

            userTrigger.classList.remove("active");

            userTrigger.setAttribute(
              "aria-expanded",
              "false"
            );

          }

        });

      }


      /* =====================================================
         CERRAR SESIÓN
      ===================================================== */

      if (logoutButton) {

        logoutButton.hidden = false;

        logoutButton.classList.remove(
          "plan-protected"
        );

        logoutButton.addEventListener(
          "click",
          async () => {

            logoutButton.disabled = true;

            try {

              await signOutCurrentUser();

              window.location.replace(
                "index.html"
              );

            } catch (error) {

              console.error(
                "No se pudo cerrar la sesion.",
                error
              );

              logoutButton.disabled = false;

            }

          }
        );
      }


    /* =====================================================
       USUARIO NO AUTENTICADO
    ===================================================== */

    } else {

      /*
       * Si no hay usuario, al pulsar el icono
       * lo enviamos directamente al login.
       */

      if (userTrigger) {

        userTrigger.addEventListener(
          "click",
          () => {

            window.location.href =
              "login.html";

          }
        );

      }


      /*
       * El dropdown no debe aparecer
       * si no existe sesión.
       */

      if (userMenu) {
        userMenu.hidden = true;
      }

    }


  } catch (error) {

    console.error(
      "No se pudo resolver la sesion; se mantiene acceso publico.",
      error
    );

  }
}

  if (target) target.removeAttribute("aria-busy");
  await Promise.all([themeScriptsPromise, globalCartPromise]);
  document.dispatchEvent(new CustomEvent("headerLoaded", {
    detail: { user, profile: currentProfile, plan: currentPlan }
  }));
});
