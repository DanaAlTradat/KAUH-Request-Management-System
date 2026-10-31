import { useEffect, useState } from "react";
import NewRequest from "./pages/NewRequest";
import Devices from "./pages/Devices";
import Login from "./pages/Login";
import "./App.css";

const App = () => {
  const [requests, setRequests] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); 
  const handleLoginSuccess = (data) => {
  localStorage.setItem("token", data.token);
  setCurrentUser(data.user);
};

const handleLogout = () => {
  localStorage.removeItem("token");
  setCurrentUser(null);
};

  // Request details modal
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [devicesCount, setDevicesCount] = useState(0);
  const [departmentsCount, setDepartmentsCount] = useState(0);
  const [departments, setDepartments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activePage, setActivePage] = useState("dashboard");
  // Request search and filters
  const [requestSearch, setRequestSearch] = useState("");
  const [selectedRequestStatus, setSelectedRequestStatus] = useState("All");
  const [selectedRequestDepartment, setSelectedRequestDepartment] =
    useState("All");

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

  // Update request status
  const handleUpdateRequestStatus = async (request, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/requests/${request._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: request.title,
            description: request.description,
            type: request.type,
            status: newStatus,
            department: request.department?._id,
            device: request.device?._id || null,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update request");
      }

      await fetchRequests();
      setError("");

      return true;
    } catch (error) {
      setError(error.message);
      return false;
    }
  };

  // Get devices and departments count
  const fetchStatistics = async () => {
    try {
      const [devicesResponse, departmentsResponse] = await Promise.all([
        fetch("http://localhost:5000/api/devices"),
        fetch("http://localhost:5000/api/departments"),
      ]);

      if (!devicesResponse.ok || !departmentsResponse.ok) {
        throw new Error("Failed to load statistics");
      }

      const devicesData = await devicesResponse.json();
      const departmentsData = await departmentsResponse.json();
      console.log("Departments received:", departmentsData.departments);

      setDevicesCount(devicesData.devices?.length || 0);
      setDepartmentsCount(departmentsData.departments?.length || 0);
      setDepartments(departmentsData.departments || []);
    } catch (error) {
      console.error("Statistics error:", error);
    }
  };

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    fetch("http://localhost:5000/api/users/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Invalid token");
        }
        return response.json();
      })
      .then((data) => {
        setCurrentUser(data.user);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setCurrentUser(null);
      });
  }
}, []);
 
  useEffect(() => {
  if (currentUser) {
    fetchRequests();
    fetchStatistics();
  }
}, [currentUser]);

  // Filter requests by search, status and department
  const filteredRequests = requests.filter((request) => {
    const searchValue = requestSearch.toLowerCase().trim();

    const matchesSearch =
      request.title?.toLowerCase().includes(searchValue) ||
      request.description?.toLowerCase().includes(searchValue) ||
      request.device?.name?.toLowerCase().includes(searchValue) ||
      request.requestedBy?.name?.toLowerCase().includes(searchValue);

    const matchesStatus =
      selectedRequestStatus === "All" ||
      request.status?.toLowerCase() === selectedRequestStatus.toLowerCase();

    const matchesDepartment =
      selectedRequestDepartment === "All" ||
      request.department?.name === selectedRequestDepartment;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  // Get unique department names from requests
  const requestDepartmentNames = departments.map(
  (department) => department.name
);
  // Calculate request statistics
  const pendingCount = requests.filter(
    (request) => request.status?.toLowerCase() === "pending",
  ).length;

  const completedCount = requests.filter(
    (request) => request.status?.toLowerCase() === "completed",
  ).length;

  const approvedCount = requests.filter(
    (request) => request.status?.toLowerCase() === "approved",
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
  const RequestCard = ({ request }) => {
    const currentStatus = request.status?.toLowerCase();

    return (
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

          <p>
            <strong>Device:</strong>{" "}
            {request.device?.name || "No device selected"}
          </p>

          <div className="mb-3">
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => setSelectedRequest(request)}
            >
              View Details
            </button>
          </div>

          <hr />

          <hr />

          <div className="d-flex gap-2 flex-wrap">
            {currentStatus === "pending" && (
              <>
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => handleUpdateRequestStatus(request, "Approved")}
                >
                  Approve
                </button>

                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleUpdateRequestStatus(request, "Rejected")}
                >
                  Reject
                </button>
              </>
            )}

            {currentStatus === "approved" && (
              <button
                className="btn btn-sm btn-primary"
                onClick={() => handleUpdateRequestStatus(request, "Completed")}
              >
                Mark as Completed
              </button>
            )}

            {currentStatus === "rejected" && (
              <span className="text-danger small">
                This request was rejected.
              </span>
            )}

            {currentStatus === "completed" && (
              <span className="text-success small">
                This request is completed.
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };
  return (
  <>
    {!currentUser ? (
      <Login onLoginSuccess={handleLoginSuccess} />
    ) : (
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
          className={`sidebar-link ${activePage === "devices" ? "active" : ""}`}
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
  <span className="admin-avatar">
    {currentUser.name?.charAt(0).toUpperCase()}
  </span>

  <span>{currentUser.name}</span>
  <span className="user-role">
  {currentUser.role}
</span>

  <button
    className="btn btn-outline-danger btn-sm ms-3"
    onClick={handleLogout}
  >
    Logout
  </button>
</div>
        </header>

        <main className="dashboard-content">
          {error && <div className="alert alert-danger">{error}</div>}

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
                      {requests
                        .slice(-4)
                        .reverse()
                        .map((request) => (
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

              {/* Search and Filters */}
              <div className="request-filters-card mb-4">
                <div className="row g-3">
                  <div className="col-lg-4">
                    <label className="form-label">Search Requests</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by title, device or employee..."
                      value={requestSearch}
                      onChange={(e) => setRequestSearch(e.target.value)}
                    />
                  </div>

                  <div className="col-lg-4">
                    <label className="form-label">Request Status</label>
                    <select
                      className="form-select"
                      value={selectedRequestStatus}
                      onChange={(e) => setSelectedRequestStatus(e.target.value)}
                    >
                      <option value="All">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div className="col-lg-4">
                    <label className="form-label">Department</label>
                    <select
                      className="form-select"
                      value={selectedRequestDepartment}
                      onChange={(e) =>
                        setSelectedRequestDepartment(e.target.value)
                      }
                    >
                      <option value="All">All Departments</option>

                      {requestDepartmentNames.map((department) => (
                        <option key={department} value={department}>
                          {department}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-3 d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    Showing {filteredRequests.length} of {requests.length}{" "}
                    requests
                  </small>

                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => {
                      setRequestSearch("");
                      setSelectedRequestStatus("All");
                      setSelectedRequestDepartment("All");
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
              {!loading && filteredRequests.length === 0 && (
                <div className="empty-state">No matching requests found.</div>
              )}

              <div className="row g-3">
                {filteredRequests.map((request) => (
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

          {/* Request Details Modal */}
          {selectedRequest && (
            <div className="request-modal-overlay">
              <div className="request-modal">
                <div className="request-modal-header">
                  <div>
                    <h4>Request Details</h4>
                    <p>Complete information about this request</p>
                  </div>

                  <button
                    className="close-modal-btn"
                    onClick={() => setSelectedRequest(null)}
                  >
                    &times;
                  </button>
                </div>

                <div className="request-modal-body">
                  <h5>{selectedRequest.title}</h5>

                  <p>{selectedRequest.description}</p>

                  <hr />

                  <p>
                    <strong>Status:</strong> {selectedRequest.status}
                  </p>

                  <p>
                    <strong>Type:</strong> {selectedRequest.type}
                  </p>

                  <p>
                    <strong>Department:</strong>{" "}
                    {selectedRequest.department?.name || "Not specified"}
                  </p>

                  <p>
                    <strong>Requested By:</strong>{" "}
                    {selectedRequest.requestedBy?.name || "Not specified"}
                  </p>

                  <p>
                    <strong>Email:</strong>{" "}
                    {selectedRequest.requestedBy?.email || "Not available"}
                  </p>

                  <p>
                    <strong>Device:</strong>{" "}
                    {selectedRequest.device?.name || "No device selected"}
                  </p>

                  <p>
                    <strong>Asset Tag:</strong>{" "}
                    {selectedRequest.device?.assetTag || "Not available"}
                  </p>

                  <p>
                    <strong>Created At:</strong>{" "}
                    {selectedRequest.createdAt
                      ? new Date(selectedRequest.createdAt).toLocaleString()
                      : "Not available"}
                  </p>

                  <p>
                    <strong>Last Updated:</strong>{" "}
                    {selectedRequest.updatedAt
                      ? new Date(selectedRequest.updatedAt).toLocaleString()
                      : "Not available"}
                  </p>
                </div>

                <div className="request-modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setSelectedRequest(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        <footer className="dashboard-footer">
          KAUH Request Management System
          <span>King Abdullah University Hospital</span>
               </footer>
      </div>
    </div>
    )}
  </>
  );
};

export default App;
