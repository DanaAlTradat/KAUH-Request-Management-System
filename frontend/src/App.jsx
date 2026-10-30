
import { useEffect, useState } from "react";
import NewRequest from "./pages/NewRequest";
import Devices from "./pages/Devices";
import "./App.css";

const App = () => {
  const [requests, setRequests] = useState([]);
  const [devicesCount, setDevicesCount] = useState(0);
  const [departmentsCount, setDepartmentsCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activePage, setActivePage] = useState("dashboard");

  // Get all requests
  const fetchRequests = () => {
    fetch("http://localhost:5000/api/requests")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch requests");
        }
        return response.json();
      })
      .then((data) => {
        setRequests(data.requests || []);
        setError("");
      })
      .catch(() => {
        setError("Could not load requests");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Get devices and departments count
  const fetchStatistics = async () => {
    try {
      const [devicesResponse, departmentsResponse] =
        await Promise.all([
          fetch("http://localhost:5000/api/devices"),
          fetch("http://localhost:5000/api/departments"),
        ]);

      if (!devicesResponse.ok || !departmentsResponse.ok) {
        throw new Error("Failed to load statistics");
      }

      const devicesData = await devicesResponse.json();
      const departmentsData = await departmentsResponse.json();

      setDevicesCount(devicesData.devices?.length || 0);
      setDepartmentsCount(departmentsData.departments?.length || 0);
    } catch (error) {
      console.error("Statistics error:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchStatistics();
  }, []);

  // Calculate request statistics
  const pendingCount = requests.filter(
    (request) => request.status?.toLowerCase() === "pending"
  ).length;

  const completedCount = requests.filter(
    (request) => request.status?.toLowerCase() === "completed"
  ).length;

  const approvedCount = requests.filter(
    (request) => request.status?.toLowerCase() === "approved"
  ).length;

  // Status badge
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

  // Request card
  const RequestCard = ({ request }) => (
    <div className="card request-item h-100">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <h5 className="request-title">{request.title}</h5>

          <span className={`status-badge ${getStatusClass(request.status)}`}>
            {request.status}
          </span>
        </div>

        <p className="request-description">{request.description}</p>

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
          {request.device?.name || "No device selected"}
        </p>
      </div>
    </div>
  );

  return (
    <div className="dashboard-layout">

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">K</div>
          <div>
            <h4>KAUH</h4>
            <span>RequestHub</span>
          </div>
        </div>

        <p className="sidebar-label">MAIN MENU</p>

        <button
          className={`sidebar-link ${
            activePage === "dashboard" ? "active" : ""
          }`}
          onClick={() => setActivePage("dashboard")}
        >
          <span>▦</span> Dashboard
        </button>

        <button
          className={`sidebar-link ${
            activePage === "newRequest" ? "active" : ""
          }`}
          onClick={() => setActivePage("newRequest")}
        >
          <span>＋</span> New Request
        </button>

        <button
          className={`sidebar-link ${
            activePage === "requests" ? "active" : ""
          }`}
          onClick={() => setActivePage("requests")}
        >
          <span>☷</span> All Requests
        </button>

        <button
  className={`sidebar-link ${
    activePage === "devices" ? "active" : ""
  }`}
  onClick={() => setActivePage("devices")}
>
  <span>▣</span> Devices
</button>

        <div className="sidebar-footer">
          <span>KAUH</span>
          <p>Hospital Management System</p>
        </div>
      </aside>

      {/* Main Area */}
      <div className="dashboard-main">

        {/* Top Bar */}
        <header className="dashboard-topbar">
          <div>
            <h5>KAUH Request Management System</h5>
            <p>Hospital Management Portal</p>
          </div>

          <div className="admin-label">
            <span className="admin-avatar">A</span>
            <span>Administrator</span>
          </div>
        </header>

        <main className="dashboard-content">

          {error && (
            <div className="alert alert-danger">{error}</div>
          )}

          {/* Dashboard Page */}
          {activePage === "dashboard" && (
            <>
              <div className="page-heading">
                <div>
                  <h2>Dashboard Overview</h2>
                  <p>Welcome to KAUH RequestHub</p>
                </div>
              </div>

              {loading ? (
                <p>Loading dashboard...</p>
              ) : (
                <>
                  {/* Statistics */}
                  <div className="row g-3 statistics-row">

                    <div className="col-md-6 col-xl-3">
                      <div className="stat-card">
                        <div className="stat-icon">☷</div>
                        <p>Total Requests</p>
                        <h3>{requests.length}</h3>
                        <span>All submitted requests</span>
                      </div>
                    </div>

                    <div className="col-md-6 col-xl-3">
                      <div className="stat-card">
                        <div className="stat-icon pending-icon">◷</div>
                        <p>Pending Requests</p>
                        <h3>{pendingCount}</h3>
                        <span>Waiting for action</span>
                      </div>
                    </div>

                    <div className="col-md-6 col-xl-3">
                      <div className="stat-card">
                        <div className="stat-icon completed-icon">✓</div>
                        <p>Completed Requests</p>
                        <h3>{completedCount}</h3>
                        <span>Successfully completed</span>
                      </div>
                    </div>

                    <div className="col-md-6 col-xl-3">
                      <div className="stat-card">
                        <div className="stat-icon devices-icon">▣</div>
                        <p>Total Devices</p>
                        <h3>{devicesCount}</h3>
                        <span>Registered devices</span>
                      </div>
                    </div>

                    <div className="col-md-6 col-xl-3">
                      <div className="stat-card">
                        <div className="stat-icon departments-icon">⌂</div>
                        <p>Total Departments</p>
                        <h3>{departmentsCount}</h3>
                        <span>Registered departments</span>
                      </div>
                    </div>

                    <div className="col-md-6 col-xl-3">
                      <div className="stat-card">
                        <div className="stat-icon approved-icon">✓</div>
                        <p>Approved Requests</p>
                        <h3>{approvedCount}</h3>
                        <span>Approved requests</span>
                      </div>
                    </div>

                  </div>

                  {/* Recent Requests */}
                  <section className="recent-section">
                    <div className="section-heading">
                      <div>
                        <h3>Recent Requests</h3>
                        <p>Latest submitted hospital requests</p>
                      </div>

                      <button
                        className="view-all-btn"
                        onClick={() => setActivePage("requests")}
                      >
                        View All
                      </button>
                    </div>

                    <div className="row g-3">
                      {requests.slice(-4).reverse().map((request) => (
                        <div className="col-lg-6" key={request._id}>
                          <RequestCard request={request} />
                        </div>
                      ))}

                      {requests.length === 0 && (
                        <div className="col-12">
                          <div className="empty-state">
                            No requests have been submitted yet.
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                </>
              )}
            </>
          )}

          {/* New Request Page */}
          {activePage === "newRequest" && (
            <section>
              <div className="page-heading">
                <div>
                  <h2>Create New Request</h2>
                  <p>Submit a new hospital request</p>
                </div>
              </div>

              <NewRequest
                onRequestCreated={() => {
                  fetchRequests();
                  fetchStatistics();
                }}
              />
            </section>
          )}

          {/* All Requests Page */}
          {activePage === "requests" && (
            <section>
              <div className="page-heading">
                <div>
                  <h2>All Requests</h2>
                  <p>View and follow up on submitted requests</p>
                </div>

                <span className="requests-count">
                  {requests.length} Requests
                </span>
              </div>

              {loading && <p>Loading requests...</p>}

              {!loading && requests.length === 0 && (
                <div className="empty-state">
                  No requests found.
                </div>
              )}

      
              <div className="row g-3">
                {requests.map((request) => (
                  <div className="col-lg-6" key={request._id}>
                    <RequestCard request={request} />
                  </div>
                ))}
              </div>
            </section>
          )}
                  {/* Devices Page */}
{activePage === "devices" && (
  <section>
    <Devices />
  </section>
)}


        </main>

        <footer className="dashboard-footer">
          KAUH Request Management System
          <span>King Abdullah University Hospital</span>
        </footer>

      </div>
    </div>
  );
};

export default App;
