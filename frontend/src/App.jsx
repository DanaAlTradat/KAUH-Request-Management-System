
import { useEffect, useState } from "react";
import NewRequest from "./pages/NewRequest";
import "./App.css";

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

  // Get status badge style
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "status-approved";
      case "rejected":
        return "status-rejected";
      case "completed":
        return "status-completed";
      case "pending":
        return "status-pending";
      default:
        return "status-default";
    }
  };

  return (
    <div className="app-container">

      {/* Header */}
      <header className="main-header">
        <div className="container">
          <div className="header-content">
            <div className="brand">
              <div className="brand-logo">K</div>

              <div>
                <h1>KAUH</h1>
                <p>Request Management System</p>
              </div>
            </div>

            <div className="header-label">
              Hospital Management Portal
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container main-content">

        <div className="welcome-section">
          <h2>Welcome to KAUH RequestHub</h2>
          <p>
            Manage hospital supply and equipment requests efficiently.
          </p>
        </div>

        {/* New Request Form */}
        <NewRequest onRequestCreated={fetchRequests} />

        {/* All Requests */}
        <section className="requests-section">

          <div className="section-heading">
            <div>
              <h2>All Requests</h2>
              <p>View and follow up on submitted requests</p>
            </div>

            <span className="requests-count">
              {requests.length} Requests
            </span>
          </div>

          {loading && (
            <div className="alert alert-info">
              Loading requests...
            </div>
          )}

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          {!loading && !error && requests.length === 0 && (
            <div className="empty-state">
              <h5>No Requests Found</h5>
              <p>There are currently no requests to display.</p>
            </div>
          )}

          <div className="row g-3">
            {requests.map((request) => (
              <div className="col-md-6" key={request._id}>
                <div className="card request-item h-100">

                  <div className="card-body">

                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h5 className="request-title">
                        {request.title}
                      </h5>

                      <span className={`status-badge ${getStatusClass(request.status)}`}>
                        {request.status}
                      </span>
                    </div>

                    <p className="request-description">
                      {request.description}
                    </p>

                    <hr />

                    <p>
                      <strong>Type:</strong> {request.type}
                    </p>

                    <p>
                      <strong>Department:</strong>{" "}
                      {request.department?.name || "Not specified"}
                    </p>

                    <p>
                      <strong>Requested By:</strong>{" "}
                      {request.requestedBy?.name || "Not specified"}
                    </p>

                    <p className="mb-0">
                      <strong>Device:</strong>{" "}
                      {request.device
                        ? request.device.name
                        : "No device selected"}
                    </p>

                  </div>
                </div>
              </div>
            ))}
          </div>

        </section>
      </main>

      {/* Footer */}
      <footer className="main-footer">
        <p>KAUH Request Management System</p>
        <span>King Abdullah University Hospital</span>
      </footer>

    </div>
  );
};

export default App;
