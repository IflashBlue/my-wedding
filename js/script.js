(function () {
  "use strict";

  const els = {
    body: document.body,
    bride: document.getElementById("brideName"),
    groom: document.getElementById("groomName"),
    dateLine: document.getElementById("dateLine"),
    locationLine: document.getElementById("locationLine"),
    message: document.getElementById("message"),
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds"),
    venueName: document.getElementById("venueName"),
    venueAddress: document.getElementById("venueAddress"),
    accessNotes: document.getElementById("accessNotes"),
    mapLink: document.getElementById("mapLink"),
    photo: document.getElementById("couplePhoto"),
    rsvpNote: document.getElementById("rsvpNote"),
    rsvpDeadline: document.getElementById("rsvpDeadline"),
    rsvpEmail: document.getElementById("rsvpEmail"),
    rsvpPhone: document.getElementById("rsvpPhone"),
    allergiesNote: document.getElementById("allergiesNote"),
    schedule: document.getElementById("schedule"),
    giftNote: document.getElementById("giftNote"),
    fundLink: document.getElementById("fundLink"),
  };

  function firstName(fullName) {
    return fullName ? fullName.trim().split(/\s+/)[0] : "";
  }

  function formatDateFR(date) {
    const formatted = new Intl.DateTimeFormat("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
    const time = new Intl.DateTimeFormat("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
    return `${formatted} · ${time}`;
  }

  function formatLocation(location) {
    if (!location) return "";
    const parts = [location.venue, location.city].filter(Boolean);
    return parts.join(", ");
  }

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function setOptionalText(el, text) {
    if (text) {
      el.textContent = text;
      el.hidden = false;
    } else {
      el.hidden = true;
    }
  }

  function renderSchedule(items) {
    els.schedule.textContent = "";
    (items || []).forEach((item) => {
      const li = document.createElement("li");
      li.className = "schedule__item";

      const time = document.createElement("span");
      time.className = "schedule__time";
      time.textContent = item.time || "";

      const track = document.createElement("span");
      track.className = "schedule__track";
      const dot = document.createElement("span");
      dot.className = "schedule__dot";
      track.appendChild(dot);

      const content = document.createElement("div");
      const title = document.createElement("p");
      title.className = "schedule__title";
      title.textContent = item.title || "";
      content.appendChild(title);

      if (item.description) {
        const description = document.createElement("p");
        description.className = "schedule__description";
        description.textContent = item.description;
        content.appendChild(description);
      }

      li.append(time, track, content);
      els.schedule.appendChild(li);
    });
  }

  function startCountdown(targetDate) {
    function tick() {
      const now = new Date();
      const diff = targetDate - now;

      if (diff <= 0) {
        els.body.classList.add("is-arrived");
        clearInterval(timer);
        els.days.textContent = "0";
        els.hours.textContent = "00";
        els.minutes.textContent = "00";
        els.seconds.textContent = "00";
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      els.days.textContent = String(days);
      els.hours.textContent = pad(hours);
      els.minutes.textContent = pad(minutes);
      els.seconds.textContent = pad(seconds);
    }

    tick();
    const timer = setInterval(tick, 1000);
  }

  function render(data) {
    const targetDate = new Date(data.date);

    els.bride.textContent = firstName(data.bride) || "Lina";
    els.groom.textContent = firstName(data.groom) || "Nathanaël";
    document.title = `${firstName(data.bride)} & ${firstName(data.groom)} — Compte à rebours`;

    els.dateLine.textContent = formatDateFR(targetDate);
    els.locationLine.textContent = formatLocation(data.location);
    els.message.textContent = data.message || "";

    const location = data.location || {};
    els.venueName.textContent = location.venue || "Lieu à confirmer";

    const streetLine = [location.address, [location.postalCode, location.city].filter(Boolean).join(" ")]
      .filter(Boolean)
      .join(", ");
    setOptionalText(els.venueAddress, streetLine);
    setOptionalText(els.accessNotes, location.accessNotes);

    if (location.mapUrl) {
      els.mapLink.href = location.mapUrl;
      els.mapLink.hidden = false;
    } else {
      els.mapLink.hidden = true;
    }

    if (data.photo && data.photo.src) {
      els.photo.src = data.photo.src;
    }
    els.photo.alt = (data.photo && data.photo.alt) || `${firstName(data.bride)} & ${firstName(data.groom)}`;

    const rsvp = data.rsvp || {};
    els.rsvpNote.textContent =
      rsvp.note || "Merci de nous confirmer votre présence, seul(e) ou accompagné(e).";
    setOptionalText(els.rsvpDeadline, rsvp.deadline ? `Réponse souhaitée avant le ${rsvp.deadline}` : "");

    if (rsvp.email) {
      els.rsvpEmail.href = `mailto:${rsvp.email}`;
      els.rsvpEmail.hidden = false;
    } else {
      els.rsvpEmail.hidden = true;
    }

    if (rsvp.phone) {
      els.rsvpPhone.href = `tel:${rsvp.phone.replace(/\s+/g, "")}`;
      els.rsvpPhone.hidden = false;
    } else {
      els.rsvpPhone.hidden = true;
    }

    renderSchedule(data.schedule);

    const allergies = data.allergies || {};
    els.allergiesNote.textContent =
      allergies.note ||
      "Une allergie ou un régime alimentaire particulier ? Merci de nous le préciser lors de votre confirmation de présence.";

    const gift = data.gift || {};
    els.giftNote.textContent =
      gift.note ||
      "Votre présence est le plus beau des cadeaux ! Une urne sera à votre disposition le jour J.";

    if (gift.fundUrl) {
      els.fundLink.href = gift.fundUrl;
      els.fundLink.hidden = false;
    } else {
      els.fundLink.hidden = true;
    }

    startCountdown(targetDate);
  }

  function renderError() {
    els.dateLine.textContent = "";
    els.locationLine.textContent = "";
    els.message.textContent =
      "Impossible de charger les données du mariage (data/wedding.json). " +
      "Ouvrez cette page via un serveur local (ex. l'extension Live Server, " +
      "ou la commande « python -m http.server ») plutôt qu'en double-cliquant sur le fichier.";
  }

  fetch("data/wedding.json", { cache: "no-store" })
    .then((res) => {
      if (!res.ok) throw new Error("Réponse réseau invalide");
      return res.json();
    })
    .then(render)
    .catch(renderError);
})();
