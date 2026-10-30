
import { useEffect, useState } from "react";
import "./Devices.css";

const Devices = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Fetch devices from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/devices")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch devices");
        }
        return response.json();
      })
      .then((data) => {
        setDevices(data.devices || []);
      })
      .catch(() => {
        setError("Could not load devices");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Get unique departments
  const departments = [
    ...new Set(
      devices
        .map((device) => device.department?.name)
        .filter(Boolean)
    ),
  ];

  // Filter devices
  const filteredDevices = devices.filter((device) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      device.name?.toLowerCase().includes(searchValue) ||
      device.assetTag?.toLowerCase().includes(searchValue) ||
      device.brand?.toLowerCase().includes(searchValue);

    const matchesDepartment =
      selectedDepartment === "All" ||
      device.department?.name === selectedDepartment;

    const matchesStatus =
      selectedStatus === "All" ||
      device.status === selectedStatus;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Status badge
  const getStatusClass = (status) => {
    switch (status) {
      case "Available":
        return "device-available";
      case "Under Maintenance":
        return "device-maintenance";
      case "Out of Service":
        return "device-out";
      default:
        return "device-default";
    }
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading devices...</p>
      </div>
    );
  }

  return (
    <div className="devices-page">

      {/* Page Heading */}
      <div className="page-heading">
        <div>
          <h2>Devices Management</h2>
          <p>View and manage hospital equipment</p>
        </div>

        <span className="devices-count">
          {filteredDevices.length} of {devices.length} Devices
        </span>
      </div>

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {/* Search and Filters */}
      <div className="card filter-card mb-4">
        <div className="card-body">
          <div className="row g-3">

            <div className="col-lg-4">
              <label className="form-label fw-semibold">
                Search Devices
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by name, asset tag or brand..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="col-lg-4">
              <label className="form-label fw-semibold">
                Department
              </label>
              <select
                className="form-select"
                value={selectedDepartment}
                onChange={(e) =>
                  setSelectedDepartment(e.target.value)
                }
              >
                <option value="All">All Departments</option>

                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-lg-4">
              <label className="form-label fw-semibold">
                Device Status
              </label>
              <select
                className="form-select"
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(e.target.value)
                }
              >
                <option value="All">All Statuses</option>
                <option value="Available">Available</option>
                <option value="Under Maintenance">
                  Under Maintenance
                </option>
                <option value="Out of Service">
                  Out of Service
                </option>
              </select>
            </div>

          </div>
        </div>
      </div>

      {/* Devices Table */}
      <div className="card devices-table-card">
        <div className="card-body">

          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Device Name</th>
                  <th>Asset Tag</th>
                  <th>Category</th>
                  <th>Department</th>
                  <th>Brand</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredDevices.map((device) => (
                  <tr key={device._id}>
                    <td className="fw-semibold">
                      {device.name}
                    </td>

                    <td>{device.assetTag}</td>

                    <td>{device.category}</td>

                    <td>
                      {device.department?.name || "Not specified"}
                    </td>

                    <td>{device.brand}</td>

                    <td>
                      <span
                        className={`device-status ${getStatusClass(
                          device.status
                        )}`}
                      >
                        {device.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {filteredDevices.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      No devices found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Devices;
