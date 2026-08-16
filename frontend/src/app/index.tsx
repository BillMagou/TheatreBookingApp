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

export default function HomeScreen() {
  const [email, setEmail] = useState("nikos@test.com");
  const [password, setPassword] = useState("123456");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const [shows, setShows] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [seatSelections, setSeatSelections] = useState<Record<number, string>>({});
  const [reservationEdits, setReservationEdits] = useState<Record<number, string>>({});

  const [loggedIn, setLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [token, setToken] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        setLoggedIn(true);
        setIsRegistering(false);
        setMessage("Login successful");

        const showsResponse = await fetch(`${API_URL}/shows`);
        const showsData = await showsResponse.json();
        setShows(Array.isArray(showsData) ? showsData : []);
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      setMessage("Could not connect to backend");
    }
  };

  const handleRegister = async () => {
    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Registration successful. You can now login.");
        setIsRegistering(false);
      } else {
        setMessage(data.message || "Registration failed");
      }
    } catch (error) {
      setMessage("Could not connect to backend");
    }
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
        body: JSON.stringify({
          show_id: showId,
          seats
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Reservation created successfully");
        setSeatSelections((current) => ({ ...current, [showId]: "1" }));
        await loadReservations();
      } else {
        setMessage(data.message || data.error || "Reservation failed");
      }
    } catch (error) {
      setMessage("Could not create reservation");
    }
  };

  const loadReservations = async () => {
    try {
      const response = await fetch(`${API_URL}/reservations`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        const list = Array.isArray(data) ? data : [];
        setReservations(list);

        const editValues: Record<number, string> = {};
        list.forEach((reservation: any) => {
          editValues[reservation.reservation_id] = String(reservation.seats);
        });
        setReservationEdits(editValues);
        setMessage("Reservations loaded");
      } else {
        setMessage(data.message || data.error || "Could not load reservations");
      }
    } catch (error) {
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

      const data = await response.json();

      if (response.ok) {
        setMessage("Reservation updated successfully");
        await loadReservations();
      } else {
        setMessage(data.message || data.error || "Could not update reservation");
      }
    } catch (error) {
      setMessage("Could not connect to backend");
    }
  };

  const cancelReservation = async (reservationId: number) => {
    try {
      const response = await fetch(`${API_URL}/reservations/${reservationId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Reservation cancelled");
        await loadReservations();
      } else {
        setMessage(data.message || data.error || "Could not cancel reservation");
      }
    } catch (error) {
      setMessage("Could not connect to backend");
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setIsRegistering(false);
    setShows([]);
    setReservations([]);
    setSeatSelections({});
    setReservationEdits({});
    setToken("");
    setMessage("Logged out");
  };

  if (loggedIn) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Available Shows</Text>
        <Text style={styles.message}>{message}</Text>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.myReservationsButton} onPress={loadReservations}>
          <Text style={styles.buttonText}>My Reservations</Text>
        </TouchableOpacity>

        {reservations.map((reservation) => (
          <View key={reservation.reservation_id} style={styles.reservationCard}>
            <Text style={styles.showTitle}>
              {reservation.title || `Reservation #${reservation.reservation_id}`}
            </Text>
            <Text>Reservation ID: {reservation.reservation_id}</Text>
            <Text>Show ID: {reservation.show_id}</Text>
            {reservation.show_time ? <Text>Show Time: {String(reservation.show_time)}</Text> : null}

            <TextInput
              style={styles.input}
              placeholder="Number of seats"
              keyboardType="number-pad"
              value={reservationEdits[reservation.reservation_id] ?? String(reservation.seats)}
              onChangeText={(value) =>
                setReservationEdits((current) => ({
                  ...current,
                  [reservation.reservation_id]: value
                }))
              }
            />

            <TouchableOpacity
              style={styles.updateButton}
              onPress={() => updateReservation(reservation.reservation_id)}
            >
              <Text style={styles.buttonText}>Update Reservation</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={() => cancelReservation(reservation.reservation_id)}
            >
              <Text style={styles.buttonText}>Cancel Reservation</Text>
            </TouchableOpacity>
          </View>
        ))}

        {shows.map((show) => (
          <View key={show.show_id} style={styles.card}>
            <Text style={styles.showTitle}>{show.title}</Text>
            {show.description ? <Text>{show.description}</Text> : null}
            {show.duration ? <Text>Duration: {show.duration}</Text> : null}
            {show.age_rating ? <Text>Age Rating: {show.age_rating}</Text> : null}
            {show.show_time ? <Text>Show Time: {String(show.show_time)}</Text> : null}
            {show.available_seats !== undefined ? (
              <Text>Available Seats: {show.available_seats}</Text>
            ) : null}

            <TextInput
              style={styles.input}
              placeholder="Number of seats"
              keyboardType="number-pad"
              value={seatSelections[show.show_id] ?? "1"}
              onChangeText={(value) =>
                setSeatSelections((current) => ({
                  ...current,
                  [show.show_id]: value
                }))
              }
            />

            <TouchableOpacity
              style={styles.reserveButton}
              onPress={() => reserveShow(show.show_id)}
            >
              <Text style={styles.buttonText}>Reserve</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    );
  }

  if (isRegistering) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Register User</Text>

        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
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

        <TouchableOpacity
          style={styles.myReservationsButton}
          onPress={() => setIsRegistering(false)}
        >
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

      <TouchableOpacity
        style={styles.myReservationsButton}
        onPress={() => setIsRegistering(true)}
      >
        <Text style={styles.buttonText}>Register New User</Text>
      </TouchableOpacity>

      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20
  },
  input: {
    borderWidth: 1,
    padding: 12,
    marginTop: 10,
    marginBottom: 15,
    borderRadius: 8
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15
  },
  logoutButton: {
    backgroundColor: "#dc2626",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15
  },
  reserveButton: {
    backgroundColor: "#16a34a",
    padding: 12,
    borderRadius: 8,
    marginTop: 5
  },
  updateButton: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10
  },
  myReservationsButton: {
    backgroundColor: "#7c3aed",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold"
  },
  message: {
    marginVertical: 10,
    textAlign: "center",
    fontWeight: "bold"
  },
  card: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginBottom: 10
  },
  reservationCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#f3f4f6"
  },
  showTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5
  }
});
