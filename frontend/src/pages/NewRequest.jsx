
import { useEffect, useState } from "react";
import "./NewRequest.css";

const NewRequest = ({ onRequestCreated }) => {
  const [departments, setDepartments] = useState([]);
  const [devices, setDevices] = useState([]);
  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    department: "",
    device: "",
    requestedBy: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Get departments, devices and users
  useEffect(() => {
    Promise.all([
      fetch("http://localhost:5000/api/departments"),
      fetch("http://localhost:5000/api/devices"),
      fetch("http://localhost:5000/api/users"),
    ])
      .then(async ([departmentsResponse, devicesResponse, usersResponse]) => {
        if (
          !departmentsResponse.ok ||
          !devicesResponse.ok ||
          !usersResponse.ok
        ) {
          throw new Error("Failed to load data");
        }

        const departmentsData = await departmentsResponse.json();
        const devicesData = await devicesResponse.json();
        const usersData = await usersResponse.json();

        setDepartments(departmentsData.departments);
        setDevices(devicesData.devices);
        setUsers(usersData.users);
      })
      .catch(() => {
        setError("Could not load departments, devices and users");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Submit new request
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/requests",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            device: formData.device || null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create request");
      }

      setSuccess("Request created successfully!");

      if (onRequestCreated) {
        onRequestCreated();
      }

      setFormData({
        title: "",
        description: "",
        type: "",
        department: "",
        device: "",
        requestedBy: "",
      });
    } catch (error) {
      setError(error.message);
    }
  };

  // Filter devices by selected department
  const filteredDevices = devices.filter(
    (device) =>
      device.department?._id === formData.department
  );

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading form data...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">

          <div className="card shadow border-0 request-card">

            <div className="card-header request-header text-white p-4">
              <h2 className="mb-1">Create New Request</h2>
              <p className="mb-0">
                Submit a new hospital supply or equipment request
              </p>
            </div>

            <div className="card-body p-4">

              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Request Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter request title"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your request"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Request Type
                  </label>
                  <select
                    className="form-select"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select request type</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="supplies">Supplies</option>
                    <option value="IT Support">IT Support</option>
                    <option value="equipment">Equipment</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Department
                  </label>
                  <select
                    className="form-select"
                    name="department"
                    value={formData.department}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        department: e.target.value,
                        device: "",
                      });
                    }}
                    required
                  >
                    <option value="">Select department</option>

                    {departments.map((department) => (
                      <option
                        key={department._id}
                        value={department._id}
                      >
                        {department.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Device <span className="text-muted">(Optional)</span>
                  </label>
                  <select
                    className="form-select"
                    name="device"
                    value={formData.device}
                    onChange={handleChange}
                  >
                    <option value="">Select device</option>

                    {filteredDevices.map((device) => (
                      <option
                        key={device._id}
                        value={device._id}
                      >
                        {device.name} - {device.assetTag}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Requested By
                  </label>
                  <select
                    className="form-select"
                    name="requestedBy"
                    value={formData.requestedBy}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select employee</option>

                    {users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn submit-btn w-100"
                >
                  Submit Request
                </button>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRequest;
