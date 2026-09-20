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

/* ==========================================================================
   Scène « enveloppe » : une seule progression de scroll pilote le sceau,
   le rabat, la mise en poche de l'enveloppe, la sortie des cartes une par
   une, puis la fermeture et le mot de fin.
   ========================================================================== */
(function () {
  "use strict";

  const scene = document.getElementById("scene");
  const stage = scene && scene.querySelector(".scene__stage");
  const back = document.getElementById("envelopeBack");
  const front = document.getElementById("envelopeFront");
  const lid = document.getElementById("envelopeLid");
  const flap = document.getElementById("envelopeFlap");
  const seal = document.getElementById("envelopeSeal");
  const sealArm = document.getElementById("envelopeSealArm");
  const hint = document.getElementById("scrollHint");
  const outro = document.getElementById("outro");
  const cards = scene ? Array.from(scene.querySelectorAll(".deck > .card")) : [];

  if (!scene || !stage || !back || !front || !lid || !flap || !seal || !sealArm || !hint || !outro) return;
  if (!cards.length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // Budget de scroll de chaque phase, en hauteurs d'écran.
  const FLAP_VH = 100;
  const DOCK_VH = 40;
  const CARD_VH = 110;
  const OUTRO_VH = 60;

  const OPEN_VH = FLAP_VH + DOCK_VH;
  const TOTAL_VH = OPEN_VH + cards.length * CARD_VH + OUTRO_VH;

  // Bornes de phase, en progression normalisée [0, 1] sur la scène.
  const flapEnd = FLAP_VH / TOTAL_VH;
  const dockEnd = OPEN_VH / TOTAL_VH;
  const cardSpan = CARD_VH / TOTAL_VH;
  const deckEnd = dockEnd + cards.length * cardSpan;
  const outroAt = (fraction) => deckEnd + (OUTRO_VH * fraction) / TOTAL_VH;

  // Positions clés, en pourcentage de la hauteur de scène.
  const DOCK_Y = 54; // enveloppe rangée en bas de l'écran
  const REST_TOP = 0.46; // centre de repos d'une carte
  const OUT_Y = -82; // carte sortie par le haut
  const OUT_S = 0.92;

  // Proportions de l'enveloppe, calées sur celles du CSS.
  const ENV_RATIO = 0.66; // hauteur / largeur
  const ENV_LIP = 0.26; // distance centre → creux du V de la face avant

  // Part de l'espace vertical qu'une carte au repos peut occuper.
  const FIT_HEIGHT = 0.82;
  const FIT_MIN = 0.45;

  // Découpage d'un segment de carte : sortie / repos (lecture) / envol.
  const RISE = 0.35;
  const REST = 0.75;

  const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
  const range = (v, a, b) => clamp01((v - a) / (b - a));
  const lerp = (a, b, v) => a + (b - a) * v;
  const easeOut = (v) => 1 - Math.pow(1 - v, 3);
  const easeInOut = (v) => (v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2);

  const fits = cards.map(() => 1);
  const dives = cards.map(() => 0);
  let stageH = window.innerHeight;
  let sceneTop = 0;
  let travel = 1;
  let flapIsBack = false;

  function measure() {
    stageH = stage.clientHeight || window.innerHeight;
    sceneTop = scene.getBoundingClientRect().top + window.scrollY;
    travel = Math.max(1, scene.offsetHeight - stageH);

    // Chaque carte est réduite juste ce qu'il faut pour tenir entière à
    // l'écran : rien n'est tronqué, et les cartes courtes gardent leur
    // taille normale.
    const room = stageH * FIT_HEIGHT;
    const envW = cards[0].offsetWidth || 1;
    const envCenter = (0.5 + DOCK_Y / 100) * stageH;

    for (let i = 0; i < cards.length; i++) {
      const natural = cards[i].offsetHeight || 1;
      const fit = Math.max(FIT_MIN, Math.min(1, room / natural));
      fits[i] = fit;

      // Enveloppe et carte partagent la même largeur et la même échelle :
      // la carte ne rétrécit donc pas en sortant, elle se contente de
      // remonter. Il faut alors l'enfoncer assez bas pour que son bord
      // supérieur passe sous la lèvre de la poche.
      const lip = envCenter - ENV_LIP * (envW * ENV_RATIO * fit);
      dives[i] = lip - REST_TOP * stageH + (natural * fit) / 2 + 0.02 * stageH;
    }
  }

  // Échelle de l'enveloppe : celle de la carte du moment, pour que les deux
  // largeurs coïncident exactement. Le raccord se fait pendant l'envol, quand
  // la carte a déjà quitté la poche.
  function envScale(t) {
    if (t <= dockEnd) return lerp(1, fits[0], easeInOut(range(t, flapEnd, dockEnd)));

    const last = cards.length - 1;
    const i = Math.min(last, Math.floor((t - dockEnd) / cardSpan));
    if (i === last) return lerp(fits[i], 1, easeInOut(range(t, deckEnd, outroAt(0.5))));

    const u = (t - dockEnd - i * cardSpan) / cardSpan;
    if (u <= REST) return fits[i];
    return lerp(fits[i], fits[i + 1], easeInOut((u - REST) / (1 - REST)));
  }

  function vh(percent) {
    return (percent / 100) * stageH;
  }

  function placeCard(el, ty, s, opacity, shadow) {
    el.style.setProperty("--ty", ty.toFixed(1) + "px");
    el.style.setProperty("--s", s.toFixed(4));
    el.style.setProperty("--sh", (shadow === undefined ? 1 : shadow).toFixed(3));
    el.style.opacity = opacity.toFixed(3);
    // Les cartes absentes sortent vraiment du flux : ni tabulation, ni
    // lecteur d'écran ; les liens ne redeviennent cliquables qu'au repos.
    el.style.visibility = opacity > 0.02 ? "visible" : "hidden";
    el.style.pointerEvents = opacity > 0.9 ? "auto" : "none";
  }

  function update() {
    const t = clamp01((window.scrollY - sceneTop) / travel);
    const style = stage.style;

    // 1. Le rabat s'ouvre dès le premier défilement — et se referme
    //    pendant le mot de fin.
    const closing = easeInOut(range(t, deckEnd, outroAt(0.5)));
    const open = easeInOut(range(t, 0, flapEnd)) * (1 - closing);
    style.setProperty("--flap", (-172 * open).toFixed(1) + "deg");
    // L'intérieur ne se découvre qu'avec le rabat.
    style.setProperty("--mouth", clamp01(open * 1.6).toFixed(3));

    // Le cachet bascule sur sa face arrière passé la verticale. On ne se
    // repose pas sur backface-visibility, que certains moteurs ignorent
    // dès qu'un filtre est appliqué : sans ça le sceau réapparaît à
    // l'envers au-dessus de l'enveloppe, donc par-dessus la carte.
    const sealOut = range(open, 0.4, 0.5);
    seal.style.setProperty("--seal-o", (1 - sealOut).toFixed(3));
    seal.style.visibility = sealOut < 1 ? "visible" : "hidden";

    // À mi-course le rabat est vu par la tranche : c'est le seul instant où
    // on peut le faire passer devant/derrière les cartes sans que ça se voie.
    const shouldBeBack = open > 0.5;
    if (shouldBeBack !== flapIsBack) {
      flapIsBack = shouldBeBack;
      if (shouldBeBack) back.appendChild(flap);
      else lid.insertBefore(flap, sealArm);
    }

    // 3. L'enveloppe descend et rapetisse, puis revient au centre à la fin.
    const dock = easeInOut(range(t, flapEnd, dockEnd)) * (1 - closing);
    style.setProperty("--ety", vh(dock * DOCK_Y).toFixed(1) + "px");
    style.setProperty("--es", envScale(t).toFixed(4));
    style.setProperty("--env-o", (1 - range(t, outroAt(0.45), outroAt(0.8))).toFixed(3));

    // 4. Les cartes sortent de la poche, se laissent lire, puis s'envolent.
    for (let i = 0; i < cards.length; i++) {
      const u = (t - (dockEnd + i * cardSpan)) / cardSpan;
      const rest = fits[i];

      if (u <= 0) {
        placeCard(cards[i], dives[i], rest, 0, 0);
      } else if (u >= 1) {
        placeCard(cards[i], vh(OUT_Y), rest * OUT_S, 0);
      } else if (u < RISE) {
        // Pas de fondu : la carte est réellement cachée par la face avant
        // tant qu'elle n'a pas franchi la lèvre de la poche.
        // easeInOut plutôt qu'easeOut : la carte démarre doucement, comme
        // une lettre qu'on tire, au lieu de bondir hors de la poche.
        const e = easeInOut(u / RISE);
        placeCard(cards[i], lerp(dives[i], 0, e), rest, 1, e);
      } else if (u < REST) {
        placeCard(cards[i], 0, rest, 1);
      } else {
        const e = easeInOut((u - REST) / (1 - REST));
        placeCard(cards[i], vh(lerp(0, OUT_Y, e)), lerp(rest, rest * OUT_S, e), clamp01(1 - e * 1.6));
      }
    }

    // 5. Indice de départ et mot de fin.
    hint.style.opacity = (1 - range(t, 0, 0.015)).toFixed(3);
    const bye = easeOut(range(t, outroAt(0.55), outroAt(0.95)));
    outro.style.opacity = bye.toFixed(3);
    outro.style.setProperty("--oy", ((1 - bye) * 26).toFixed(1) + "px");
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      update();
    });
  }

  function refresh() {
    measure();
    update();
  }

  document.body.classList.add("scene-on");
  scene.style.setProperty("--scene-vh", String(TOTAL_VH));

  refresh();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", refresh);
  window.addEventListener("load", refresh);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);

  // Les données arrivent en fetch : la hauteur des cartes change après coup.
  if (window.ResizeObserver) {
    let pending = false;
    const observer = new ResizeObserver(function () {
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () {
        pending = false;
        refresh();
      });
    });
    cards.forEach((el) => observer.observe(el));
  }
})();
