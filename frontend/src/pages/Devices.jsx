import { useEffect, useState } from "react";
import "./Devices.css";


const Devices = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState(null);
  const [saving, setSaving] = useState(false);

  // Edit device states
  const [editingDeviceId, setEditingDeviceId] = useState(null);

  const [editFormData, setEditFormData] = useState({
    name: "",
    category: "",
    assetTag: "",
    brand: "",
    model: "",
    department: "",
    status: "Available",
    description: "",
  });

  // Add device form data
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    assetTag: "",
    brand: "",
    model: "",
    department: "",
    status: "Available",
    description: "",
  });

  // Fetch devices and departments
  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/api/devices"),
      fetch("http://localhost:5000/api/departments"),
    ])
      .then(async ([devicesResponse, departmentsResponse]) => {
        if (!devicesResponse.ok || !departmentsResponse.ok) {
          throw new Error("Failed to load data");
        }

        const devicesData = await devicesResponse.json();
        const departmentsData = await departmentsResponse.json();

        setDevices(devicesData.devices || []);
        setDepartments(departmentsData.departments || []);
      })
      .catch(() => {
        setError("Could not load devices and departments");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Get unique department names for filter
  const departmentNames = [
    ...new Set(
      devices.map((device) => device.department?.name).filter(Boolean),
    ),
  ];

  // Handle add form inputs
  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle edit form inputs
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;

    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  // Add new device
  const handleAddDevice = async (e) => {
    e.preventDefault();

    setSuccess("");
    setError("");
    setSaving(true);

    try {
      const response = await fetch("http://localhost:5000/api/devices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add device");
      }

      const devicesResponse = await fetch("http://localhost:5000/api/devices");

      if (!devicesResponse.ok) {
        throw new Error("Device added, but failed to refresh the list");
      }

      const devicesData = await devicesResponse.json();

      setDevices(devicesData.devices || []);

      setFormData({
        name: "",
        category: "",
        assetTag: "",
        brand: "",
        model: "",
        department: "",
        status: "Available",
        description: "",
      });

      setShowForm(false);
      setSuccess("Device added successfully!");
      setError("");
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  // Update existing device
  const handleUpdateDevice = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/devices/${editingDeviceId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editFormData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update device");
      }

      const devicesResponse = await fetch("http://localhost:5000/api/devices");

      if (!devicesResponse.ok) {
        throw new Error("Device updated, but failed to refresh the list");
      }

      const devicesData = await devicesResponse.json();

      setDevices(devicesData.devices || []);
      setEditingDeviceId(null);
      setSuccess("Device updated successfully!");
      setError("");
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };
  // Open delete confirmation
  const handleDeleteDevice = (device) => {
    setDeviceToDelete(device);
    setShowDeleteModal(true);
  };

  // Confirm device deletion
  const confirmDeleteDevice = async () => {
    if (!deviceToDelete) return;

    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/devices/${deviceToDelete._id}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete device");
      }

      setDevices((previousDevices) =>
        previousDevices.filter((device) => device._id !== deviceToDelete._id),
      );

      setSuccess("Device deleted successfully!");
      setShowDeleteModal(false);
      setDeviceToDelete(null);
    } catch (error) {
      setError(error.message);
    }
  };

  // Open edit form with current device data
  const handleEditClick = (device) => {
    setEditingDeviceId(device._id);

    setEditFormData({
      name: device.name || "",
      category: device.category || "",
      assetTag: device.assetTag || "",
      brand: device.brand || "",
      model: device.model || "",
      department: device.department?._id || "",
      status: device.status || "Available",
      description: device.description || "",
    });

    setShowForm(false);
    setSuccess("");
    setError("");
  };

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
      selectedStatus === "All" || device.status === selectedStatus;

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

        <div className="d-flex align-items-center gap-3">
          <span className="devices-count">
            {filteredDevices.length} of {devices.length} Devices
          </span>

          <button
            className="btn add-device-btn"
            onClick={() => setShowForm(!showForm)}
          >
            + Add New Device
          </button>
        </div>
      </div>

      {/* Add Device Form */}
      {showForm && (
        <div className="card add-device-card mb-4">
          <div className="card-header add-device-header">
            <h5 className="mb-0">Add New Device</h5>
            <p className="mb-0">Enter the device information below</p>
          </div>

          <div className="card-body p-4">
            <form onSubmit={handleAddDevice}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Device Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="Enter device name"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Category</label>
                  <input
                    type="text"
                    className="form-control"
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    placeholder="Enter category"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Asset Tag</label>
                  <input
                    type="text"
                    className="form-control"
                    name="assetTag"
                    value={formData.assetTag}
                    onChange={handleFormChange}
                    placeholder="Example: DEMO-071"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Brand</label>
                  <input
                    type="text"
                    className="form-control"
                    name="brand"
                    value={formData.brand}
                    onChange={handleFormChange}
                    placeholder="Enter brand"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Model</label>
                  <input
                    type="text"
                    className="form-control"
                    name="model"
                    value={formData.model}
                    onChange={handleFormChange}
                    placeholder="Enter model"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Department</label>
                  <select
                    className="form-select"
                    name="department"
                    value={formData.department}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">Select department</option>

                    {departments.map((department) => (
                      <option key={department._id} value={department._id}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Device Status
                  </label>
                  <select
                    className="form-select"
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                  >
                    <option value="Available">Available</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                    <option value="Out of Service">Out of Service</option>
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleFormChange}
                    placeholder="Enter device description"
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn add-device-btn"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Device"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="alert alert-success success-message">
          <strong>Success!</strong> {success}
        </div>
      )}

      {/* Edit Device Form */}
      {editingDeviceId && (
        <div className="card add-device-card mb-4">
          <div className="card-header add-device-header">
            <h5 className="mb-0">Edit Device</h5>
            <p className="mb-0">Update the device information below</p>
          </div>

          <div className="card-body p-4">
            <form onSubmit={handleUpdateDevice}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Device Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditFormChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Category</label>
                  <input
                    type="text"
                    className="form-control"
                    name="category"
                    value={editFormData.category}
                    onChange={handleEditFormChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Asset Tag</label>
                  <input
                    type="text"
                    className="form-control"
                    name="assetTag"
                    value={editFormData.assetTag}
                    onChange={handleEditFormChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Brand</label>
                  <input
                    type="text"
                    className="form-control"
                    name="brand"
                    value={editFormData.brand}
                    onChange={handleEditFormChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Model</label>
                  <input
                    type="text"
                    className="form-control"
                    name="model"
                    value={editFormData.model}
                    onChange={handleEditFormChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Department</label>
                  <select
                    className="form-select"
                    name="department"
                    value={editFormData.department}
                    onChange={handleEditFormChange}
                    required
                  >
                    <option value="">Select department</option>

                    {departments.map((department) => (
                      <option key={department._id} value={department._id}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Device Status
                  </label>
                  <select
                    className="form-select"
                    name="status"
                    value={editFormData.status}
                    onChange={handleEditFormChange}
                  >
                    <option value="Available">Available</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                    <option value="Out of Service">Out of Service</option>
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    rows="3"
                    value={editFormData.description}
                    onChange={handleEditFormChange}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => setEditingDeviceId(null)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn add-device-btn"
                  disabled={saving}
                >
                  {saving ? "Updating..." : "Update Device"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Search and Filters */}
      <div className="card filter-card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-lg-4">
              <label className="form-label fw-semibold">Search Devices</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by name, asset tag or brand..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="col-lg-4">
              <label className="form-label fw-semibold">Department</label>
              <select
                className="form-select"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="All">All Departments</option>

                {departmentNames.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-lg-4">
              <label className="form-label fw-semibold">Device Status</label>
              <select
                className="form-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Available">Available</option>
                <option value="Under Maintenance">Under Maintenance</option>
                <option value="Out of Service">Out of Service</option>
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
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredDevices.map((device) => (
                  <tr key={device._id}>
                    <td className="fw-semibold">{device.name}</td>

                    <td>{device.assetTag}</td>

                    <td>{device.category}</td>

                    <td>{device.department?.name || "Not specified"}</td>

                    <td>{device.brand}</td>

                    <td>
                      <span
                        className={`device-status ${getStatusClass(
                          device.status,
                        )}`}
                      >
                        {device.status}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEditClick(device)}
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteDevice(device)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredDevices.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      No devices found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <div className="delete-modal-icon">
              <span>!</span>
            </div>

            <h4>Delete Device?</h4>

            <p>
              Are you sure you want to delete
              <strong> {deviceToDelete?.name}</strong>? This action cannot be
              undone.
            </p>

            <div className="delete-modal-actions">
              <button
                className="cancel-delete-btn"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeviceToDelete(null);
                }}
              >
                Cancel
              </button>

              <button
                className="confirm-delete-btn"
                onClick={confirmDeleteDevice}
              >
                Delete Device
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Devices;
