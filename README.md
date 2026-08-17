# Compte à rebours — Mariage de Lina & Nathanaël

Page statique, responsive, thème bohème, qui affiche un compte à rebours jusqu'au mariage.

## Modifier les informations

Toutes les données (date, lieu, message) se trouvent dans [data/wedding.json](data/wedding.json).
Modifiez ce fichier — aucune autre modification n'est nécessaire.

```json
{
  "bride": "Lina Mouss",
  "groom": "Nathanaël Schmitt",
  "date": "2027-06-19T15:00:00",
  "photo": {
    "src": "assets/couple-placeholder.svg",
    "alt": "Lina & Nathanaël"
  },
  "schedule": [
    { "time": "15:00", "title": "Cérémonie", "description": "" },
    { "time": "16:30", "title": "Cocktail", "description": "" },
    { "time": "19:30", "title": "Dîner", "description": "" },
    { "time": "22:30", "title": "Soirée dansante", "description": "" }
  ],
  "location": {
    "venue": "Lieu à confirmer",
    "address": "",
    "postalCode": "",
    "city": "France",
    "mapUrl": "",
    "accessNotes": "Les informations pratiques (parking, transports, hébergement) seront communiquées prochainement."
  },
  "rsvp": {
    "note": "Merci de nous confirmer votre présence, seul(e) ou accompagné(e), afin que nous puissions tout organiser au mieux.",
    "deadline": "",
    "email": "",
    "phone": ""
  },
  "allergies": {
    "note": "Une allergie ou un régime alimentaire particulier (végétarien, sans gluten...) ? Merci de nous le préciser lors de votre confirmation de présence."
  },
  "gift": {
    "note": "Votre présence est le plus beau des cadeaux ! Nous n'attendons pas de cadeau matériel : une urne sera à votre disposition le jour J pour celles et ceux qui souhaiteraient participer à notre cagnotte.",
    "fundUrl": ""
  },
  "message": "Nous avons hâte de célébrer ce jour avec vous !"
}
```

- `date` : format `AAAA-MM-JJTHH:MM:SS` (heure locale).
- `photo.src` : remplacez par le chemin de votre propre photo (ex. `assets/couple.jpg`) pour remplacer le cadre bohème placeholder.
- `schedule` : liste d'étapes `{ time, title, description }` affichées comme une frise chronologique ; ajoutez/retirez des entrées librement, `description` est optionnel.
- `location` : laissez `address`/`postalCode`/`mapUrl` vides (`""`) pour les masquer ; `mapUrl` affiche un bouton « Voir l'itinéraire » (lien Google Maps par exemple) s'il est renseigné.
- `rsvp.deadline` : texte libre (ex. `"1er mai 2027"`), masqué si vide.
- `rsvp.email` / `rsvp.phone` : affichent des boutons de contact (`mailto:` / `tel:`), masqués si vides.
- `allergies.note` : texte libre affiché dans l'encart « Allergies & Régimes alimentaires ».
- `gift.note` : texte libre affiché dans l'encart « Cadeaux » ; `gift.fundUrl` affiche un bouton « Participer à la cagnotte » (lien vers une cagnotte en ligne) s'il est renseigné.

## Lancer la page

Le fichier JSON est chargé via `fetch`, ce que les navigateurs bloquent si vous ouvrez
`index.html` directement (double-clic, `file://`). Servez le dossier avec un petit serveur local :

```bash
# Python
python -m http.server 8000
# puis ouvrez http://localhost:8000
```

Ou utilisez l'extension "Live Server" dans VS Code (clic droit sur `index.html` → *Open with Live Server*).

## Structure

```
index.html                     page principale
css/style.css                  thème bohème (couleurs terracotta, sauge, moutarde)
js/script.js                   logique du compte à rebours
data/wedding.json              données modifiables (date, photo, lieu, RSVP, message)
assets/couple-placeholder.svg  photo placeholder (à remplacer par une vraie photo)
```
