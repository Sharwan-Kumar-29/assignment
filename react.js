

const url = "https://expenses-a565b-default-rtdb.firebaseio.com/users.json";

const styles = {
  button: {
    padding: "10px 20px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  card: {
    border: "1px solid #ddd",
    padding: "15px",
    borderRadius: "5px",
    marginBottom: "15px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  input: {
    width: "90%",
    padding: "10px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  modal: {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    content: {
      backgroundColor: "#fff",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 8px 15px rgba(0, 0, 0, 0.2)",
      width: "400px",
      textAlign: "center",
    },
  },
  form: {
    border: "1px solid #ddd",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
  },
  dangerButton: {
    padding: "8px 15px",
    backgroundColor: "#DC3545",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  successButton: {
    padding: "8px 15px",
    backgroundColor: "#28A745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

const Users = () => {
  const [users, setUsers] = React.useState([]);
  const [editData, setEditData] = React.useState({ id: null, username: "", email: "", phone: "", tags: [] });
  const [showModal, setShowModal] = React.useState(false);
  const [filterData, setFilterData] = React.useState([]); // State for filtered users

  const fetchData = async () => {
    try {
      const { data } = await axios.get(url);
      setUsers(Object.entries(data));
      setFilterData(Object.entries(data)); // Initially, set the filtered data to all users
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const updateUser = async (id) => {
    try {
      const { username, email, phone, tags } = editData;
      await axios.patch(`${url.replace(".json", `/${id}.json`)}`, { username, email, phone, tags });
      setUsers((prev) =>
        prev.map(([key, user]) => (key === id ? [key, { ...user, username, email, phone, tags }] : [key, user]))
      );
      setEditData({ id: null, username: "", email: "", phone: "", tags: [] });
      setShowModal(false);
      alert("User updated successfully!");
    } catch (error) {
      console.error("Error updating user", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${url.replace(".json", `/${id}.json`)}`);
      setUsers((prev) => prev.filter(([key]) => key !== id));
      alert("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  const handleEdit = (id, username, email, phone, tags) => {
    setEditData({ id, username, email, phone, tags });
    setShowModal(true);
  };

  const closeModal = () => {
    setEditData({ id: null, username: "", email: "", phone: "", tags: [] });
    setShowModal(false);
  };



  return (
    <div >
      <div style={{ display: "flex", gap: 22 }}>
        <button onClick={fetchData} style={styles.button}>
          Fetch Data
        </button>
       
      </div>

      <div style={{ marginTop: "20px" }}>
        {filterData.map(([id, user]) => ( // Display filtered users
          <div key={id} style={styles.card}>
            <p>
              <strong>Name:</strong> {user.username}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Phone:</strong> {user.phone}
            </p>
            <p>
              <strong>Tags:</strong> {Array.isArray(user.tags) ? user.tags.join(", ") : "No tags available"}
            </p>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => handleEdit(id, user.username, user.email, user.phone, user.tags)}
                style={styles.successButton}
              >
                Edit
              </button>
              <button onClick={() => deleteUser(id)} style={styles.dangerButton}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={styles.modal.overlay}>
          <div style={styles.modal.content}>
            <h3>Edit User</h3>
            <input
              type="text"
              value={editData.username}
              onChange={(e) => setEditData({ ...editData, username: e.target.value })}
              placeholder="User Name"
              style={styles.input}
            />
            <input
              type="text"
              value={editData.email}
              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
              placeholder="User Email"
              style={styles.input}
            />
            <input
              type="text"
              value={editData.phone}
              onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
              placeholder="Phone Number"
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Add a tag and press Enter"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value.trim()) {
                  setEditData((prev) => ({ ...prev, tags: [...prev.tags, e.target.value.trim()] }));
                }
              }}
              style={styles.input}
            />
            <div>
              <button
                onClick={() => updateUser(editData.id)}
                style={{ ...styles.button, marginRight: "10px" }}
              >
                Save
              </button>
              <button onClick={closeModal} style={styles.dangerButton}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


const AddUser = () => {
  const [user, setUser] = React.useState({ username: "", email: "", phone: "", tags: [] });

  function handleChange(e) {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  }

  async function handleAdd() {
    try {
      await axios.post(url, user);
      setUser({ username: "", email: "", phone: "", tags: [] });
      alert("User added successfully!");
    } catch (error) {
      console.error("Error adding user", error);
    }
  }

  function handleTagInput(e) {
    
    if (e.key === "Enter" && e.target.value.trim()) {
      setUser((prev) => ({
        ...prev,
        tags: [...prev.tags, e.target.value.trim()],
      }));
      // Now clear the input only after the value is added to the state
      
    }
  }

  return (
    <div style={styles.card}>
      <h1>Add User</h1>
      <input
        type="text"
        name="username"
        placeholder="User Name"
        value={user.username}
        onChange={handleChange}
        style={styles.input}/>
      <input
        type="text"
        name="email"
        placeholder="User Email"
        value={user.email}
        onChange={handleChange}
        style={styles.input}/>
      <input
        type="text"
        name="phone"
        placeholder="Phone Number"
        value={user.phone}
        onChange={handleChange}
        style={styles.input}/>
      <input
        type="text"
        placeholder="Add a tag and press Enter"
        onKeyDown={handleTagInput}
        style={styles.input}
      />
      
     <br/>

      <button onClick={handleAdd} style={styles.successButton}>Add User</button>
    </div>
  );
};




const App = () => (
  <div style={{ padding: "20px" }}>
    <h1>Axios CRUD</h1>
    <AddUser />
    <Users />
  </div>
);

const rootElem = ReactDOM.createRoot(document.getElementById("app"));
rootElem.render(<App />);

