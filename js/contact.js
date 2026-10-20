// No mail backend: open the visitor's e-mail app with the message already written.
(() => {
  const CONTACT_EMAIL = "info.hydronexis@gmail.com";
  const TOPICS = {
    mentoring: "Mentoring request",
    maintenance: "Setup & maintenance visit"
  };

  const form = document.getElementById("contactForm");
  const status = document.getElementById("contactStatus");
  if (!form || !status) return;

  const topic = TOPICS[new URLSearchParams(window.location.search).get("topic")] || "";
  if (topic) form.elements.message.value = `${topic}: `;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const name = `${data.get("first-name")} ${data.get("last-name")}`.trim();
    const body = [
      `Name: ${name}`,
      `E-mail: ${data.get("email")}`,
      `Phone: ${data.get("phone") || "-"}`,
      "",
      data.get("message")
    ].join("\n");
    const subject = topic || `Contact from ${name}`;

    window.location.href =
      `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    status.textContent = "Your e-mail app opened with the message ready. Press send there to finish.";
    status.hidden = false;
  });
})();
