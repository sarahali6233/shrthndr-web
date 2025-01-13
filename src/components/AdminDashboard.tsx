import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Alert,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import { getAdminTestData, createUser, getUsers, User } from "../services/api";
import ShorthandManager from "./ShorthandManager";

interface AdminDashboardProps {
  token: string;
  onLogout: () => void;
}

interface TestDataRow {
  id: string;
  timestamp: string;
  job_category: string;
  shorthand_test: {
    wpm: number;
    accuracy: number;
    time_in_seconds: number;
  };
  normal_test: {
    wpm: number;
    accuracy: number;
    time_in_seconds: number;
  };
  time_saved: {
    seconds: number;
    percentage: number;
  };
  user_id: string;
  created_at: string;
  updated_at: string;
  users: {
    email: string;
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ token, onLogout }) => {
  const [testData, setTestData] = useState<TestDataRow[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [addUserError, setAddUserError] = useState("");
  const [tabValue, setTabValue] = useState(0);

  const fetchData = async () => {
    try {
      const data = await getAdminTestData(token);
      setTestData(data);
    } catch (err) {
      setError("Failed to fetch test data");
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await getUsers(token);
      setUsers(data);
    } catch (err) {
      setError("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchData();
    fetchUsers();
  }, [token]);

  const handleAddUser = async () => {
    try {
      await createUser(token, newUserEmail, newUserPassword);
      setIsAddUserOpen(false);
      setNewUserEmail("");
      setNewUserPassword("");
      setAddUserError("");
      fetchUsers(); // Refresh the users list
    } catch (err) {
      setAddUserError("Failed to create user");
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Timestamp",
      "User",
      "Job Category",
      "Shorthand WPM",
      "Shorthand Accuracy",
      "Shorthand Time",
      "Normal WPM",
      "Normal Accuracy",
      "Normal Time",
      "Time Saved (s)",
      "Time Saved (%)",
      "Created At",
    ];
    const rows = testData.map((row) => [
      new Date(row.timestamp).toLocaleString(),
      row.users?.email || "Anonymous",
      row.job_category || "-",
      row.shorthand_test?.wpm || "",
      row.shorthand_test?.accuracy || "",
      row.shorthand_test?.time_in_seconds || "",
      row.normal_test?.wpm || "",
      row.normal_test?.accuracy || "",
      row.normal_test?.time_in_seconds || "",
      row.time_saved?.seconds || "",
      row.time_saved?.percentage || "",
      new Date(row.created_at).toLocaleString(),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `shrthnder_results_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Shrthnder Admin Dashboard</Typography>
        <Box>
          <Tooltip title="Add User">
            <IconButton onClick={() => setIsAddUserOpen(true)} sx={{ mr: 1 }}>
              <AddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export to CSV">
            <IconButton onClick={exportToCSV} sx={{ mr: 1 }}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Button variant="outlined" onClick={onLogout}>
            Logout
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Test Results" />
          <Tab label="Manage Shortcuts" />
          <Tab label="Manage Users" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Tooltip title="Export to CSV">
            <IconButton onClick={exportToCSV}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Job Category</TableCell>
                <TableCell>Shorthand Test</TableCell>
                <TableCell>Normal Test</TableCell>
                <TableCell>Time Saved</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {testData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    {new Date(row.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>{row.users?.email || "Anonymous"}</TableCell>
                  <TableCell>{row.job_category || "-"}</TableCell>
                  <TableCell>
                    {row.shorthand_test ? (
                      <>
                        WPM: {row.shorthand_test.wpm}
                        <br />
                        Accuracy: {row.shorthand_test.accuracy}%<br />
                        Time: {row.shorthand_test.time_in_seconds}s
                      </>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {row.normal_test ? (
                      <>
                        WPM: {row.normal_test.wpm}
                        <br />
                        Accuracy: {row.normal_test.accuracy}%<br />
                        Time: {row.normal_test.time_in_seconds}s
                      </>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {row.time_saved ? (
                      <>
                        {row.time_saved.seconds}s<br />(
                        {row.time_saved.percentage}%)
                      </>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(row.created_at).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <ShorthandManager token={token} />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsAddUserOpen(true)}
          >
            Add User
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.is_admin ? "Admin" : "User"}</TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <Dialog open={isAddUserOpen} onClose={() => setIsAddUserOpen(false)}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={newUserPassword}
            onChange={(e) => setNewUserPassword(e.target.value)}
          />
          {addUserError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {addUserError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddUserOpen(false)}>Cancel</Button>
          <Button onClick={handleAddUser} variant="contained">
            Add User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
