
import { useEffect, useState } from "react";

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
      onRequestCreated();

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

  const filteredDevices = devices.filter(
    (device) =>
      device.department?._id === formData.department
  );

  if (loading) {
    return <p>Loading form data...</p>;
  }

  return (
    <div>
      <h2>New Request</h2>

      {error && <p>{error}</p>}
      {success && <p>{success}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Request Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter request title"
            required
          />
        </div>

        <br />

        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your request"
            required
          />
        </div>

        <br />

        <div>
          <label>Request Type</label>
          <select
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

        <br />

        <div>
          <label>Department</label>
          <select
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
              <option key={department._id} value={department._id}>
                {department.name}
              </option>
            ))}
          </select>
        </div>

        <br />

        <div>
          <label>Device</label>
          <select
            name="device"
            value={formData.device}
            onChange={handleChange}
          >
            <option value="">Select device (Optional)</option>

            {filteredDevices.map((device) => (
              <option key={device._id} value={device._id}>
                {device.name} - {device.assetTag}
              </option>
            ))}
          </select>
        </div>

        <br />

        <div>
          <label>Requested By</label>
          <select
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

        <br />

        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
};

export default NewRequest;
