import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [overdue, setOverdue] = useState([]);

  const headers = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const p = await axios.get(
        "http://localhost:5000/api/projects/all",
        headers
      );

      const t = await axios.get(
        "http://localhost:5000/api/tasks/all",
        headers
      );

      const o = await axios.get(
        "http://localhost:5000/api/tasks/overdue",
        headers
      );

      setProjects(p.data);
      setTasks(t.data);
      setOverdue(o.data);

    } catch (error) {
      alert("Failed to load dashboard");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Member specific data
  const myTasks = tasks.filter(
    (item) =>
      item.assignedUser &&
      item.assignedUser.toLowerCase() === user?.name.toLowerCase()
  );

  const pendingTasks = myTasks.filter(
    (item) => item.status === "pending"
  );

  const completedTasks = myTasks.filter(
    (item) => item.status === "completed"
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <div className="flex justify-between items-center px-8 py-5 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-bold text-cyan-400">
            Team Task Manager
          </h1>

          <p className="text-slate-400">
            Welcome {user?.name} • {user?.role}
          </p>
        </div>

        <button
          onClick={logout}
          className="bg-red-500 px-4 py-2 rounded-lg hover:scale-105 transition"
        >
          Logout
        </button>
      </div>

      <div className="p-8">

        {/* ADMIN DASHBOARD */}
        {user?.role === "admin" && (
          <>
            <div className="grid md:grid-cols-3 gap-6 mb-8">

              <div className="bg-slate-900 rounded-2xl p-6 border border-cyan-500">
                <h2 className="text-4xl font-bold text-cyan-400">
                  {projects.length}
                </h2>
                <p className="text-slate-400">Projects</p>
              </div>

              <div className="bg-slate-900 rounded-2xl p-6 border border-green-500">
                <h2 className="text-4xl font-bold text-green-400">
                  {tasks.length}
                </h2>
                <p className="text-slate-400">All Tasks</p>
              </div>

              <div className="bg-slate-900 rounded-2xl p-6 border border-red-500">
                <h2 className="text-4xl font-bold text-red-400">
                  {overdue.length}
                </h2>
                <p className="text-slate-400">Overdue</p>
              </div>

            </div>

            <div className="grid md:grid-cols-2 gap-6">

              <div className="bg-slate-900 p-6 rounded-2xl">
                <h2 className="text-2xl text-cyan-400 font-bold mb-4">
                  Active Projects
                </h2>

                {projects.map((item) => (
                  <div
                    key={item.id}
                    className="mb-3 bg-slate-800 p-4 rounded-xl"
                  >
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-slate-400">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-slate-900 p-6 rounded-2xl">
                <h2 className="text-2xl text-green-400 font-bold mb-4">
                  Task Pipeline
                </h2>

                {tasks.slice(0,8).map((task) => (
                  <div
                    key={task.id}
                    className="mb-3 bg-slate-800 p-4 rounded-xl"
                  >
                    <p className="font-semibold">{task.title}</p>
                    <p className="text-sm text-slate-400">
                      {task.assignedUser}
                    </p>
                    <p className="text-sm">{task.status}</p>
                  </div>
                ))}
              </div>

            </div>
          </>
        )}

        {/* MEMBER DASHBOARD */}
        {user?.role === "member" && (
          <>
            <div className="grid md:grid-cols-3 gap-6 mb-8">

              <div className="bg-slate-900 rounded-2xl p-6 border border-cyan-500">
                <h2 className="text-4xl font-bold text-cyan-400">
                  {myTasks.length}
                </h2>
                <p className="text-slate-400">My Tasks</p>
              </div>

              <div className="bg-slate-900 rounded-2xl p-6 border border-yellow-500">
                <h2 className="text-4xl font-bold text-yellow-400">
                  {pendingTasks.length}
                </h2>
                <p className="text-slate-400">Pending</p>
              </div>

              <div className="bg-slate-900 rounded-2xl p-6 border border-green-500">
                <h2 className="text-4xl font-bold text-green-400">
                  {completedTasks.length}
                </h2>
                <p className="text-slate-400">Completed</p>
              </div>

            </div>

            <div className="bg-slate-900 p-6 rounded-2xl">
              <h2 className="text-2xl text-cyan-400 font-bold mb-4">
                My Task Workspace
              </h2>

              {myTasks.map((task) => (
                <div
                  key={task.id}
                  className="mb-4 bg-slate-800 p-4 rounded-xl"
                >
                  <p className="font-semibold">{task.title}</p>

                  <p className="text-sm text-slate-400">
                    Project: {task.projectName}
                  </p>

                  <p className="text-sm">
                    Status: {task.status}
                  </p>

                  <p className="text-sm">
                    Due: {task.due_date?.slice(0,10)}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default Dashboard;