# Theatre Booking App

Εφαρμογή κράτησης θέσεων σε κινηματογράφο για το μάθημα **CN6035 - Mobile & Distributed Systems**.

Η εφαρμογή υλοποιεί mobile frontend, REST backend και σχεσιακή βάση δεδομένων:

- **Frontend:** React Native + Expo + TypeScript
- **Backend:** Node.js + Express
- **Database:** MariaDB
- **Authentication:** JWT

## Λειτουργίες

- Εγγραφή νέου χρήστη με όνομα, email και password.
- Σύνδεση χρήστη και έκδοση JWT authentication token.
- Προβολή λίστας κινηματογράφων.
- Αναζήτηση κινηματογράφου με βάση **όνομα ή τοποθεσία**.
- Επιλογή κινηματογράφου και προβολή των ταινιών/προβολών του.
- Προβολή ώρας προβολής και διαθέσιμων θέσεων.
- Επιλογή αριθμού θέσεων και δημιουργία κράτησης.
- Προβολή ιστορικού κρατήσεων του συνδεδεμένου χρήστη.
- Τροποποίηση αριθμού θέσεων υπάρχουσας κράτησης.
- Ακύρωση/διαγραφή κράτησης.
- Αυτόματη ενημέρωση διαθέσιμων θέσεων κατά τη δημιουργία, τροποποίηση και ακύρωση κράτησης.
- Προστασία των reservation endpoints μέσω JWT.

---

## Δομή Project

```text
TheatreBookingApp/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── database/
│   └── setup.sql
├── frontend/
│   ├── src/
│   ├── assets/
│   ├── package.json
│   └── app.json
└── README.md
```

---

## Απαιτούμενα Προγράμματα

Πριν την εκτέλεση χρειάζονται:

1. **Git**
2. **Node.js + npm**
3. **MariaDB Server**
4. **Android Studio** με Android Emulator

Το frontend χρησιμοποιεί Expo και τα dependencies εγκαθίστανται μέσω npm.

---

## 1. Λήψη του Project

```bash
git clone https://github.com/BillMagou/TheatreBookingApp.git
cd TheatreBookingApp
```

---

## 2. Δημιουργία Βάσης Δεδομένων

Το αρχείο `database/setup.sql` δημιουργεί αυτόματα:

- τη βάση `theatre_booking_db`
- τους πίνακες `users`, `theatres`, `shows`, `reservations`
- foreign-key relationships
- indexes για συχνά queries
- δοκιμαστικούς κινηματογράφους και προβολές

Από **MariaDB Command Prompt**:

```cmd
cd C:\path\to\TheatreBookingApp
mariadb -u root -p < database\setup.sql
```

Έπειτα εισάγετε το root password της MariaDB.

Το script χρησιμοποιεί `IF NOT EXISTS` όπου είναι δυνατό ώστε να μπορεί να εκτελεστεί ξανά χωρίς να διαγράφει υπάρχοντα δεδομένα.

---

## 3. Ρύθμιση Backend

Στον φάκελο `backend` υπάρχει το αρχείο `.env.example`.

Δημιουργήστε ένα νέο αρχείο:

```text
backend/.env
```

με βάση το `.env.example`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MARIADB_PASSWORD
DB_NAME=theatre_booking_db
DB_PORT=3306
PORT=3000
JWT_SECRET=change_this_secret_key
```

Αλλάξτε το `DB_PASSWORD` ώστε να είναι το password που ορίστηκε κατά την εγκατάσταση της MariaDB. Το `JWT_SECRET` μπορεί επίσης να αλλαχθεί σε οποιαδήποτε ιδιωτική τιμή.

---

## 4. Εκκίνηση Backend

Ανοίξτε terminal:

```bash
cd TheatreBookingApp/backend
npm install
npm start
```

Αναμενόμενο μήνυμα:

```text
Server running on http://localhost:3000
```

Για γρήγορο έλεγχο της βάσης, το `GET /` επιστρέφει μήνυμα `Database connected` όταν η σύνδεση MariaDB λειτουργεί.

Αφήστε αυτό το terminal ανοιχτό.

---

## 5. Εκκίνηση Frontend

Σε δεύτερο terminal:

```bash
cd TheatreBookingApp/frontend
npm install
npx expo start
```

Θα ξεκινήσει ο Metro Bundler.

---

## 6. Android Emulator

1. Ανοίξτε Android Studio.
2. Εκκινήστε Android Emulator από το Device Manager.
3. Επιστρέψτε στο terminal του Expo.
4. Πατήστε `a` για άνοιγμα της εφαρμογής στον Android emulator.

Το frontend χρησιμοποιεί:

```text
http://10.0.2.2:3000
```

Το `10.0.2.2` είναι η ειδική διεύθυνση με την οποία ο Android Emulator επικοινωνεί με τον localhost του υπολογιστή.

---

## 7. Δοκιμή της Εφαρμογής

### Register

Πατήστε **Register New User** και συμπληρώστε:

- Name
- Email
- Password

Μετά επιστρέψτε στο Login.

### Login

Συνδεθείτε με το email/password του χρήστη.

### Cinemas

Μετά το login εμφανίζονται οι κινηματογράφοι. Στο πεδίο αναζήτησης μπορείτε να γράψετε μέρος του ονόματος ή της τοποθεσίας, π.χ. `Athens`, `Marousi` ή `Odeon`.

Πατώντας έναν κινηματογράφο εμφανίζονται μόνο οι προβολές του. Η επιλογή **All Cinemas** εμφανίζει όλες τις προβολές.

### Reservation

Σε κάθε προβολή εμφανίζονται:

- τίτλος ταινίας
- κινηματογράφος
- τοποθεσία
- ώρα προβολής
- διαθέσιμες θέσεις

Εισάγετε αριθμό θέσεων και πατήστε **Reserve**.

### My Reservations

Πατήστε **My Reservations** για το ιστορικό κρατήσεων.

Για κάθε κράτηση μπορείτε:

- να αλλάξετε τον αριθμό θέσεων και να πατήσετε **Update Reservation**
- να πατήσετε **Cancel Reservation** για ακύρωση

Οι διαθέσιμες θέσεις ελέγχονται στο backend και ενημερώνονται με database transaction.

---

## REST API

Υποστηρίζονται τόσο τα αρχικά routes του project όσο και aliases που αντιστοιχούν στην εκφώνηση.

| Method | Endpoint | Περιγραφή |
|---|---|---|
| POST | `/register` | Δημιουργία χρήστη |
| POST | `/login` | Login και JWT token |
| POST | `/users/register` | Εναλλακτικό register route |
| POST | `/users/login` | Εναλλακτικό login route |
| GET | `/cinemas` | Λίστα κινηματογράφων |
| GET | `/cinemas?search=Athens` | Αναζήτηση βάσει ονόματος/τοποθεσίας |
| GET | `/theatres` | Εναλλακτικό cinema route |
| GET | `/movies` | Όλες οι προβολές |
| GET | `/movies?theatre_id=1` | Προβολές συγκεκριμένου κινηματογράφου |
| GET | `/shows` | Εναλλακτικό movies route |
| POST | `/reservations` | Δημιουργία κράτησης (JWT) |
| GET | `/reservations` | Κρατήσεις χρήστη (JWT) |
| GET | `/user/reservations` | Κρατήσεις χρήστη, route της εκφώνησης (JWT) |
| PUT | `/reservations/:id` | Τροποποίηση κράτησης (JWT) |
| DELETE | `/reservations/:id` | Ακύρωση κράτησης (JWT) |

---

## Database

### users

Αποθηκεύει στοιχεία χρηστών. Τα passwords αποθηκεύονται hashed από το backend.

### theatres

Αποθηκεύει όνομα, τοποθεσία και περιγραφή κινηματογράφου.

### shows

Συνδέεται με `theatres` και αποθηκεύει τίτλο ταινίας, ώρα προβολής και διαθέσιμες θέσεις.

### reservations

Συνδέει `users` με `shows` και αποθηκεύει τον αριθμό θέσεων της κράτησης.

Υπάρχουν foreign keys και indexes για τα βασικά πεδία αναζήτησης και σχέσεων.

---

## Τεχνολογίες

- React Native
- Expo
- TypeScript / JavaScript
- Node.js
- Express
- MariaDB
- JWT
- bcrypt
- REST API
- Git / GitHub

---

## Γρήγορη Εκτέλεση μετά το αρχικό Setup

**Terminal 1:**

```bash
cd TheatreBookingApp/backend
npm start
```

**Terminal 2:**

```bash
cd TheatreBookingApp/frontend
npx expo start
```

Μετά ανοίξτε τον Android Emulator και πατήστε `a` στο terminal του Expo.
