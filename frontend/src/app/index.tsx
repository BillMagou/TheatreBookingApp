import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from "react-native";

const API_URL = "http://10.0.2.2:3000";

type Theatre = {
  theatre_id: number;
  name: string;
  location?: string;
  description?: string;
};

type Show = {
  show_id: number;
  theatre_id: number;
  title: string;
  duration?: number;
  rating?: string;
  show_time?: string;
  available_seats?: number;
  theatre_name?: string;
  theatre_location?: string;
};

export default function HomeScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [shows, setShows] = useState<Show[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedTheatreId, setSelectedTheatreId] = useState<number | null>(null);
  const [seatSelections, setSeatSelections] = useState<Record<number, string>>({});
  const [reservationEdits, setReservationEdits] = useState<Record<number, string>>({});

  const [loggedIn, setLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showReservations, setShowReservations] = useState(false);
  const [token, setToken] = useState("");

  const readJson = async (response: Response) => {
    try {
      return await response.json();
    } catch {
      return {};
    }
  };

  const loadTheatres = async (term = "") => {
    try {
      const query = term.trim() ? `?search=${encodeURIComponent(term.trim())}` : "";
      const response = await fetch(`${API_URL}/cinemas${query}`);
      const data = await readJson(response);

      if (response.ok) {
        setTheatres(Array.isArray(data) ? data : []);
      } else {
        setMessage(data.message || data.error || "Could not load cinemas");
      }
    } catch {
      setMessage("Could not load cinemas");
    }
  };

  const loadShows = async (theatreId?: number | null) => {
    try {
      const query = theatreId ? `?theatre_id=${theatreId}` : "";
      const response = await fetch(`${API_URL}/movies${query}`);
      const data = await readJson(response);

      if (response.ok) {
        setShows(Array.isArray(data) ? data : []);
      } else {
        setMessage(data.message || data.error || "Could not load movies");
      }
    } catch {
      setMessage("Could not load movies");
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await readJson(response);

      if (response.ok) {
        setToken(data.token);
        setLoggedIn(true);
        setIsRegistering(false);
        setShowReservations(false);
        setMessage("Login successful");
        await Promise.all([loadTheatres(), loadShows()]);
      } else {
        setMessage(data.message || data.error || "Login failed");
      }
    } catch {
      setMessage("Could not connect to backend");
    }
  };

  const handleRegister = async () => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const data = await readJson(response);

      if (response.ok) {
        setMessage("Registration successful. You can now login.");
        setIsRegistering(false);
      } else {
        setMessage(data.message || data.error || "Registration failed");
      }
    } catch {
      setMessage("Could not connect to backend");
    }
  };

  const selectTheatre = async (theatreId: number | null) => {
    setSelectedTheatreId(theatreId);
    setShowReservations(false);
    await loadShows(theatreId);
    setMessage(theatreId ? "Cinema selected" : "Showing movies from all cinemas");
  };

  const reserveShow = async (showId: number) => {
    const seats = Number(seatSelections[showId] || "1");

    if (!Number.isInteger(seats) || seats <= 0) {
      setMessage("Please enter a valid number of seats");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ show_id: showId, seats })
      });

      const data = await readJson(response);

      if (response.ok) {
        setMessage("Reservation created successfully");
        setSeatSelections((current) => ({ ...current, [showId]: "1" }));
        await loadReservations(false);
      } else {
        setMessage(data.message || data.error || "Reservation failed");
      }
    } catch {
      setMessage("Could not create reservation");
    }
  };

  const loadReservations = async (openSection = true) => {
    try {
      const response = await fetch(`${API_URL}/user/reservations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await readJson(response);

      if (response.ok) {
        const list = Array.isArray(data) ? data : [];
        setReservations(list);
        const editValues: Record<number, string> = {};
        list.forEach((reservation: any) => {
          editValues[reservation.reservation_id] = String(reservation.seats);
        });
        setReservationEdits(editValues);
        if (openSection) {
          setShowReservations(true);
          setMessage("Reservations loaded");
        }
      } else {
        setMessage(data.message || data.error || "Could not load reservations");
      }
    } catch {
      setMessage("Could not connect to backend");
    }
  };

  const updateReservation = async (reservationId: number) => {
    const seats = Number(reservationEdits[reservationId]);

    if (!Number.isInteger(seats) || seats <= 0) {
      setMessage("Please enter a valid number of seats");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/reservations/${reservationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ seats })
      });
      const data = await readJson(response);

      if (response.ok) {
        setMessage("Reservation updated successfully");
        await loadReservations(false);
      } else {
        setMessage(data.message || data.error || "Could not update reservation");
      }
    } catch {
      setMessage("Could not connect to backend");
    }
  };

  const cancelReservation = async (reservationId: number) => {
    try {
      const response = await fetch(`${API_URL}/reservations/${reservationId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await readJson(response);

      if (response.ok) {
        setMessage("Reservation cancelled");
        await loadReservations(false);
      } else {
        setMessage(data.message || data.error || "Could not cancel reservation");
      }
    } catch {
      setMessage("Could not connect to backend");
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setIsRegistering(false);
    setShowReservations(false);
    setTheatres([]);
    setShows([]);
    setReservations([]);
    setSearch("");
    setSelectedTheatreId(null);
    setSeatSelections({});
    setReservationEdits({});
    setToken("");
    setMessage("Logged out");
  };

  if (loggedIn) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Theatre Booking</Text>
        <Text style={styles.message}>{message}</Text>

        <View style={styles.row}>
          <TouchableOpacity style={[styles.topButton, styles.reservationsButton]} onPress={() => loadReservations(true)}>
            <Text style={styles.buttonText}>My Reservations</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.topButton, styles.logoutButton]} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {showReservations ? (
          <View>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>My Reservations</Text>
              <TouchableOpacity style={styles.smallButton} onPress={() => setShowReservations(false)}>
                <Text style={styles.buttonText}>Back to Movies</Text>
              </TouchableOpacity>
            </View>

            {reservations.length === 0 ? <Text style={styles.emptyText}>No reservations yet.</Text> : null}

            {reservations.map((reservation) => (
              <View key={reservation.reservation_id} style={styles.reservationCard}>
                <Text style={styles.showTitle}>{reservation.title || `Reservation #${reservation.reservation_id}`}</Text>
                {reservation.theatre_name ? <Text>Cinema: {reservation.theatre_name}</Text> : null}
                <Text>Reservation ID: {reservation.reservation_id}</Text>
                {reservation.show_time ? <Text>Show Time: {String(reservation.show_time)}</Text> : null}

                <TextInput
                  style={styles.input}
                  placeholder="Number of seats"
                  keyboardType="number-pad"
                  value={reservationEdits[reservation.reservation_id] ?? String(reservation.seats)}
                  onChangeText={(value) =>
                    setReservationEdits((current) => ({ ...current, [reservation.reservation_id]: value }))
                  }
                />

                <TouchableOpacity style={styles.updateButton} onPress={() => updateReservation(reservation.reservation_id)}>
                  <Text style={styles.buttonText}>Update Reservation</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => cancelReservation(reservation.reservation_id)}>
                  <Text style={styles.buttonText}>Cancel Reservation</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Find a Cinema</Text>
            <TextInput
              style={styles.input}
              placeholder="Search by cinema name or location"
              value={search}
              onChangeText={setSearch}
              onSubmitEditing={() => loadTheatres(search)}
            />
            <View style={styles.row}>
              <TouchableOpacity style={[styles.topButton, styles.searchButton]} onPress={() => loadTheatres(search)}>
                <Text style={styles.buttonText}>Search</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.topButton, styles.secondaryButton]}
                onPress={() => {
                  setSearch("");
                  loadTheatres("");
                }}
              >
                <Text style={styles.buttonText}>Clear</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.cinemaCard, selectedTheatreId === null && styles.selectedCinema]}
              onPress={() => selectTheatre(null)}
            >
              <Text style={styles.cinemaName}>All Cinemas</Text>
              <Text>Show every available movie</Text>
            </TouchableOpacity>

            {theatres.map((theatre) => (
              <TouchableOpacity
                key={theatre.theatre_id}
                style={[styles.cinemaCard, selectedTheatreId === theatre.theatre_id && styles.selectedCinema]}
                onPress={() => selectTheatre(theatre.theatre_id)}
              >
                <Text style={styles.cinemaName}>{theatre.name}</Text>
                {theatre.location ? <Text>Location: {theatre.location}</Text> : null}
                {theatre.description ? <Text>{theatre.description}</Text> : null}
              </TouchableOpacity>
            ))}

            <Text style={styles.sectionTitle}>{selectedTheatreId ? "Movies at Selected Cinema" : "Available Movies"}</Text>
            {shows.length === 0 ? <Text style={styles.emptyText}>No movies found.</Text> : null}

            {shows.map((show) => (
              <View key={show.show_id} style={styles.card}>
                <Text style={styles.showTitle}>{show.title}</Text>
                {show.theatre_name ? <Text>Cinema: {show.theatre_name}</Text> : null}
                {show.theatre_location ? <Text>Location: {show.theatre_location}</Text> : null}
                {show.duration !== undefined && show.duration !== null ? <Text>Duration: {show.duration} minutes</Text> : null}
                {show.rating ? <Text>Rating: {show.rating}</Text> : null}
                {show.show_time ? <Text>Show Time: {String(show.show_time)}</Text> : null}
                {show.available_seats !== undefined ? <Text>Available Seats: {show.available_seats}</Text> : null}

                <TextInput
                  style={styles.input}
                  placeholder="Number of seats"
                  keyboardType="number-pad"
                  value={seatSelections[show.show_id] ?? "1"}
                  onChangeText={(value) =>
                    setSeatSelections((current) => ({ ...current, [show.show_id]: value }))
                  }
                />

                <TouchableOpacity style={styles.reserveButton} onPress={() => reserveShow(show.show_id)}>
                  <Text style={styles.buttonText}>Reserve</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    );
  }

  if (isRegistering) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Register User</Text>
        <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reservationsButton} onPress={() => setIsRegistering(false)}>
          <Text style={styles.buttonText}>Back To Login</Text>
        </TouchableOpacity>
        <Text style={styles.message}>{message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Theatre Booking Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.reservationsButton} onPress={() => setIsRegistering(true)}>
        <Text style={styles.buttonText}>Register New User</Text>
      </TouchableOpacity>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  content: { paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginVertical: 20 },
  sectionTitle: { fontSize: 21, fontWeight: "bold", marginTop: 16, marginBottom: 8 },
  sectionHeaderRow: { marginBottom: 8 },
  input: { borderWidth: 1, padding: 12, marginTop: 8, marginBottom: 12, borderRadius: 8, backgroundColor: "white" },
  button: { backgroundColor: "#2563eb", padding: 15, borderRadius: 8, marginBottom: 15 },
  row: { flexDirection: "row", gap: 10, marginBottom: 10 },
  topButton: { flex: 1, padding: 12, borderRadius: 8 },
  searchButton: { backgroundColor: "#2563eb" },
  secondaryButton: { backgroundColor: "#475569" },
  reservationsButton: { backgroundColor: "#7c3aed", padding: 12, borderRadius: 8, marginBottom: 15 },
  logoutButton: { backgroundColor: "#dc2626" },
  reserveButton: { backgroundColor: "#16a34a", padding: 12, borderRadius: 8, marginTop: 5 },
  updateButton: { backgroundColor: "#2563eb", padding: 12, borderRadius: 8, marginBottom: 10 },
  cancelButton: { backgroundColor: "#dc2626", padding: 12, borderRadius: 8 },
  smallButton: { backgroundColor: "#475569", padding: 10, borderRadius: 8, marginBottom: 8 },
  buttonText: { color: "white", textAlign: "center", fontWeight: "bold" },
  message: { marginVertical: 8, textAlign: "center", fontWeight: "bold" },
  card: { borderWidth: 1, borderRadius: 8, padding: 15, marginBottom: 12, backgroundColor: "white" },
  reservationCard: { borderWidth: 1, borderRadius: 8, padding: 15, marginBottom: 12, backgroundColor: "#f3f4f6" },
  cinemaCard: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 8, backgroundColor: "white" },
  selectedCinema: { borderWidth: 3 },
  cinemaName: { fontSize: 17, fontWeight: "bold", marginBottom: 3 },
  showTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 5 },
  emptyText: { textAlign: "center", marginVertical: 12 }
});
