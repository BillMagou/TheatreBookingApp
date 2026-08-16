# Theatre Booking App

Εφαρμογή κράτησης θέσεων σε κινηματογράφο, η οποία αναπτύχθηκε στο πλαίσιο της εργασίας του μαθήματος **CN6035 - Mobile & Distributed Systems**.

Η εφαρμογή αποτελείται από:

* **Frontend:** React Native με Expo
* **Backend:** Node.js και Express
* **Βάση Δεδομένων:** MariaDB
* **Authentication:** JWT (JSON Web Token)

## Λειτουργίες εφαρμογής

Η εφαρμογή παρέχει τις παρακάτω βασικές λειτουργίες:

* Εγγραφή νέου χρήστη.
* Σύνδεση χρήστη.
* Authentication μέσω JWT.
* Προβολή διαθέσιμων προβολών.
* Δημιουργία κράτησης.
* Προβολή των κρατήσεων του χρήστη.
* Διαχείριση των δεδομένων μέσω REST API.
* Αποθήκευση χρηστών, προβολών, κινηματογράφων και κρατήσεων σε MariaDB.

---

# Δομή Project

```text
TheatreBookingApp/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── database/
│   └── setup.sql
│
├── frontend/
│   ├── src/
│   ├── assets/
│   ├── package.json
│   └── app.json
│
└── README.md
```

---

# Απαιτούμενα Προγράμματα

Πριν την εκτέλεση της εφαρμογής πρέπει να είναι εγκατεστημένα:

1. **Node.js και npm**
2. **MariaDB Server**
3. **Android Studio** με Android Emulator
4. **Git**

Το frontend χρησιμοποιεί **Expo**.

---

# 1. Λήψη του Project

Ανοίξτε PowerShell ή Command Prompt και εκτελέστε:

```bash
git clone https://github.com/BillMagou/TheatreBookingApp.git
```

Στη συνέχεια:

```bash
cd TheatreBookingApp
```

---

# 2. Δημιουργία Βάσης Δεδομένων

Το project περιλαμβάνει το αρχείο:

```text
database/setup.sql
```

Το συγκεκριμένο αρχείο δημιουργεί τη βάση:

```text
theatre_booking_db
```

καθώς και τους απαραίτητους πίνακες:

* `users`
* `theatres`
* `shows`
* `reservations`

Περιλαμβάνονται επίσης δοκιμαστικά δεδομένα για την εκτέλεση της εφαρμογής.

Από **MariaDB Command Prompt**, μεταβείτε στον φάκελο του project:

```cmd
cd C:\path\to\TheatreBookingApp
```

και εκτελέστε:

```cmd
mariadb -u root -p < database\setup.sql
```

Στη συνέχεια εισάγετε το password του χρήστη `root` της MariaDB.

---

# 3. Ρύθμιση Backend

Το backend χρησιμοποιεί αρχείο `.env`.

Το αρχείο πρέπει να βρίσκεται στο:

```text
backend/.env
```

Παράδειγμα ρυθμίσεων:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=1234
DB_NAME=theatre_booking_db
DB_PORT=3306

PORT=3000
JWT_SECRET=mysecretkey
```

**Σημαντικό:** Το `DB_PASSWORD` πρέπει να αντικατασταθεί με το password που έχει οριστεί για τον χρήστη `root` κατά την εγκατάσταση της MariaDB.

---

# 4. Εκκίνηση Backend

Ανοίξτε ένα terminal και μεταβείτε στον φάκελο:

```bash
cd TheatreBookingApp/backend
```

Εγκαταστήστε τα dependencies:

```bash
npm install
```

και ξεκινήστε τον server:

```bash
npm start
```

Εφόσον η εκκίνηση πραγματοποιηθεί σωστά, θα εμφανιστεί:

```text
Server running on http://localhost:3000
```

Το συγκεκριμένο terminal πρέπει να παραμείνει ανοιχτό κατά τη χρήση της εφαρμογής.

---

# 5. Εκκίνηση Frontend

Ανοίξτε **δεύτερο terminal** και μεταβείτε στον φάκελο:

```bash
cd TheatreBookingApp/frontend
```

Εγκαταστήστε τα dependencies:

```bash
npm install
```

Στη συνέχεια ξεκινήστε το Expo:

```bash
npx expo start
```

Θα ξεκινήσει ο Metro Bundler.

---

# 6. Εκτέλεση σε Android Emulator

Ανοίξτε το **Android Studio** και εκκινήστε έναν Android Emulator μέσω του Device Manager.

Για παράδειγμα μπορεί να χρησιμοποιηθεί συσκευή Pixel με εγκατεστημένο Android API.

Αφού ο emulator έχει ξεκινήσει και το Expo εκτελείται, στο terminal του Expo πατήστε:

```text
a
```

Το Expo θα ανοίξει την εφαρμογή στον Android Emulator.

### Σύνδεση Android Emulator με Backend

Για εκτέλεση μέσω Android Emulator, το frontend χρησιμοποιεί:

```text
http://10.0.2.2:3000
```

αντί για:

```text
http://localhost:3000
```

Το `10.0.2.2` επιτρέπει στον Android Emulator να επικοινωνεί με τον backend server που εκτελείται στον υπολογιστή.

---

# 7. Χρήση της Εφαρμογής

Μετά την εκκίνηση εμφανίζεται η οθόνη **Theatre Booking Login**.

### Δημιουργία λογαριασμού

Επιλέξτε:

```text
Register New User
```

και συμπληρώστε:

* Όνομα
* Email
* Password

Μετά την επιτυχημένη εγγραφή μπορείτε να επιστρέψετε στην οθόνη Login.

### Login

Εισάγετε το email και το password του λογαριασμού.

Μετά την επιτυχημένη σύνδεση εμφανίζονται οι διαθέσιμες προβολές.

### Κράτηση

Από τη λίστα διαθέσιμων προβολών μπορείτε να επιλέξετε:

```text
Reserve
```

για τη δημιουργία κράτησης.

### Προβολή κρατήσεων

Η επιλογή:

```text
My Reservations
```

εμφανίζει τις κρατήσεις του συνδεδεμένου χρήστη.

---

# REST API

Το backend υλοποιείται με **Node.js και Express** και χρησιμοποιεί REST API για την επικοινωνία με το frontend.

Η εφαρμογή υποστηρίζει λειτουργίες για:

* Register
* Login
* Προβολή διαθέσιμων δεδομένων
* Δημιουργία κρατήσεων
* Προβολή κρατήσεων χρήστη

Η πρόσβαση στις λειτουργίες που απαιτούν authentication προστατεύεται μέσω **JWT**.

---

# Βάση Δεδομένων

Χρησιμοποιείται **MariaDB**.

Η βάση δεδομένων περιλαμβάνει τους πίνακες:

### users

Αποθηκεύει τους εγγεγραμμένους χρήστες.

### theatres

Αποθηκεύει τα διαθέσιμα θέατρα/κινηματογράφους.

### shows

Αποθηκεύει τις διαθέσιμες προβολές.

### reservations

Αποθηκεύει τις κρατήσεις των χρηστών και συνδέεται με τους αντίστοιχους χρήστες και προβολές.

---

# Τεχνολογίες

* React Native
* Expo
* TypeScript / JavaScript
* Node.js
* Express
* MariaDB
* JWT
* REST API
* Git / GitHub

---

# Γρήγορη Εκτέλεση

Μετά την αρχική εγκατάσταση και δημιουργία της βάσης, για κάθε νέα εκτέλεση της εφαρμογής απαιτούνται μόνο δύο terminals.

**Terminal 1 — Backend**

```bash
cd TheatreBookingApp/backend
npm start
```

**Terminal 2 — Frontend**

```bash
cd TheatreBookingApp/frontend
npx expo start
```

Στη συνέχεια ανοίξτε τον Android Emulator και πατήστε `a` στο terminal του Expo.
