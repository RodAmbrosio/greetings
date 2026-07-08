# Auguri Gabriele

## Cosa è stato realizzato

### 🦈 Grafica rinnovata
- Tutte le schermate utilizzano la stessa immagine dello squaletto Baby Shark per dare continuità all'esperienza.
- Rimossi emoji e simboli (⭐🐬🌊 ecc.) sostituendoli con l'immagine dello squaletto.
- Animazioni più fluide con bolle, effetto galleggiante e transizioni tra le schermate.

### 🎵 Musica
- La musica **non parte più all'inizio**.
- Parte automaticamente solo dopo aver spento le candeline, rendendo il finale più emozionante.
- Nella schermata finale è presente un pulsante 🔊/🔇 per attivare o disattivare la musica.

### 🐠 Gioco dei pesciolini
- I pesciolini utilizzano la stessa immagine (`images/shark.png`) colorata tramite filtri CSS.
- Ogni pesciolino scompare immediatamente quando viene toccato.
- Rimangono gli effetti sonori e le stelline quando viene catturato.
- Al termine del gioco viene mostrata la schermata della torta.

### 🎂 Candeline
- Le candeline possono essere spente:
  - toccandole direttamente;
  - soffiando nel microfono (PC o smartphone).
- È presente una barra che mostra il livello del microfono mentre ascolta.
- Dopo lo spegnimento:
  - viene riprodotto il suono di vittoria;
  - parte la musica;
  - viene visualizzata la schermata finale.

### ❤️ Schermata finale
- Rimossi i coriandoli per ottenere un finale più pulito.
- Lo squaletto è il protagonista della schermata finale.
- È presente il pulsante per attivare/disattivare la musica.
- È stato aggiunto il pulsante **"Pesca i pesciolini"**, che permette di giocare nuovamente senza rifare tutta l'avventura.

### 📤 Condivisione
- Rimane disponibile la schermata "Condividi", dalla quale è possibile:
  - visualizzare il QR Code;
  - copiare il link della pagina;
  - condividere facilmente l'esperienza.

### 🔊 Effetti sonori
Sono stati aggiunti suoni generati direttamente dal browser:
- cattura del pesciolino;
- completamento del gioco;
- spegnimento delle candeline.

Non richiedono file audio aggiuntivi.

---

# Cosa devi fare

## 1. Audio

Inserisci il file

```
audio/ocean-song.mp3
```

all'interno della cartella `audio`.

Il nome deve essere esattamente quello (maiuscole e minuscole comprese), perché GitHub Pages distingue i nomi dei file.

---

## 2. Immagine dello squaletto

Assicurati che sia presente

```
images/shark.png
```

che viene utilizzata nelle schermate iniziale e finale.

---

## 3. Pesciolini

Per ora tutti i pesci utilizzano

```
images/shark.png
```

con colori ottenuti tramite CSS.

In futuro potrai sostituire facilmente ogni pesciolino con una propria immagine modificando soltanto l'array `FISH_CONFIG` in `script.js`.

---

## 4. GitHub Pages

Dopo il push su GitHub:

1. apri la pagina pubblicata;
2. verifica che l'audio venga riprodotto correttamente;
3. usa la schermata "Condividi" per ottenere il QR Code definitivo.

---

# Biglietto con QR Code

È stato creato anche un biglietto HTML separato (`biglietto.html`) che utilizza:

- gli stessi colori dell'esperienza;
- la stessa immagine dello squaletto;
- un QR Code generato automaticamente.

Per passare dall'ambiente locale a GitHub Pages sarà sufficiente modificare una sola variabile:

```javascript
const QR_URL = "https://rodambrosio.github.io/greetings/inviti/auguri-gabriele/";
```

Il QR Code verrà rigenerato automaticamente.

---

## Idee per le prossime versioni

- ⭐ Pesciolini che nuotano continuamente in modo casuale.
- ⭐ Bolle che scoppiano al tocco.
- ⭐ Voce che dice "Bravo Gabriele!" quando completa il gioco.
- ⭐ Medaglia finale "Super Pescatore".
- ⭐ Salvataggio del record di pesca direttamente nel browser.
- ⭐ Possibilità di creare facilmente nuovi auguri (compleanni, lauree, matrimoni, Natale, ecc.) riutilizzando la stessa struttura del progetto.