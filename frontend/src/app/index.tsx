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
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        setLoggedIn(true);
        setIsRegistering(false);
        setMessage("Login successful");

        const showsResponse = await fetch(`${API_URL}/shows`);
        const showsData = await showsResponse.json();

        setShows(showsData);
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
        body: JSON.stringify({
          name,
          email,
          password
        })
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
    try {
      const response = await fetch(`${API_URL}/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          show_id: showId,
          seats: 1
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Reservation created successfully");
      } else {
        setMessage(data.message || "Reservation failed");
      }
    } catch (error) {
      setMessage("Could not create reservation");
    }
  };

  const cancelReservation = async (reservationId: number) => {
    try {

      const response = await fetch(
          `${API_URL}/reservations/${reservationId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
      );

      const data = await response.json();

      if (response.ok) {

        setMessage("Reservation cancelled");

        loadReservations();

      } else {

        setMessage(
            data.message || "Could not cancel reservation"
        );

      }

    } catch (error) {

      setMessage("Could not connect to backend");

    }
  };

  const loadReservations = async () => {
    try {

      const response = await fetch(
          `${API_URL}/reservations`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
      );

      const data = await response.json();

      if (response.ok) {

        setReservations(data);
        setMessage("Reservations loaded");

      } else {

        setMessage(
            data.message || "Could not load reservations"
        );

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

          <TouchableOpacity
              style={styles.myReservationsButton}
              onPress={loadReservations}
          >
            <Text style={styles.buttonText}>My Reservations</Text>
          </TouchableOpacity>

          {reservations.map((reservation) => (
              <View key={reservation.reservation_id} style={styles.reservationCard}>
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() => cancelReservation(reservation.reservation_id)}
                >
                  <Text style={styles.buttonText}>
                    Cancel Reservation
                  </Text>
                </TouchableOpacity>
                <Text style={styles.showTitle}>
                  Reservation #{reservation.reservation_id}
                </Text>
                <Text>Show ID: {reservation.show_id}</Text>
                <Text>Seats: {reservation.seats}</Text>
                <Text>User ID: {reservation.user_id}</Text>
              </View>
          ))}

          {shows.map((show) => (
              <View key={show.show_id} style={styles.card}>
                <Text style={styles.showTitle}>{show.title}</Text>
                <Text>{show.description}</Text>
                <Text>Duration: {show.duration}</Text>
                <Text>Age Rating: {show.age_rating}</Text>

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
    marginTop: 10
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