
import { useEffect, useState } from "react";
import NewRequest from "./pages/NewRequest";

const App = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get all requests from backend
  const fetchRequests = () => {
    fetch("http://localhost:5000/api/requests")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch requests");
        }

        return response.json();
      })
      .then((data) => {
        setRequests(data.requests);
        setError("");
      })
      .catch(() => {
        setError("Could not load requests");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div>
      <h1>KAUH Request Management System</h1>

      <NewRequest onRequestCreated={fetchRequests} />

      <hr />

      <h2>All Requests</h2>

      {loading && <p>Loading requests...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && requests.length === 0 && (
        <p>No requests found.</p>
      )}

      {requests.map((request) => (
        <div key={request._id}>
          <h3>{request.title}</h3>
          <p>{request.description}</p>
          <p>Type: {request.type}</p>
          <p>Status: {request.status}</p>
          <p>
            Device: {request.device ? request.device.name : "No device selected"}
          </p>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default App;
