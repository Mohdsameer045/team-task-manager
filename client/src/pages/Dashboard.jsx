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
  const [members, setMembers] = useState([]);

  const [projectForm, setProjectForm] = useState({
    title: "",
    description: ""
  });

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    project_id: "",
    assigned_to: "",
    due_date: ""
  });

  const API = "https://team-task-manager-production-030d.up.railway.app";

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
      const p = await axios.get(`${API}/api/projects/all`, headers);
      const t = await axios.get(`${API}/api/tasks/all`, headers);
      const o = await axios.get(`${API}/api/tasks/overdue`, headers);

      setProjects(p.data);
      setTasks(t.data);
      setOverdue(o.data);

      const uniqueUsers = [];
      t.data.forEach((item) => {
        if (
          item.assignedUser &&
          !uniqueUsers.includes(item.assignedUser)
        ) {
          uniqueUsers.push(item.assignedUser);
        }
      });

      setMembers(uniqueUsers);
    } catch (error) {
      alert("Failed to load dashboard");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const createProject = async () => {
    try {
      await axios.post(
        `${API}/api/projects/create`,
        projectForm,
        headers
      );

      alert("Project Created");
      setProjectForm({
        title: "",
        description: ""
      });
      loadData();
    } catch {
      alert("Project creation failed");
    }
  };

  const createTask = async () => {
    try {
      await axios.post(
        `${API}/api/tasks/create`,
        taskForm,
        headers
      );

      alert("Task Created");
      setTaskForm({
        title: "",
        description: "",
        project_id: "",
        assigned_to: "",
        due_date: ""
      });

      loadData();
    } catch {
      alert("Task creation failed");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `${API}/api/tasks/update/${id}`,
        { status },
        headers
      );

      loadData();
    } catch {
      alert("Status update failed");
    }
  };

  const myTasks = tasks.filter(
    (item) =>
      item.assignedUser &&
      item.assignedUser.toLowerCase() ===
        user?.name.toLowerCase()
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
          className="bg-red-500 px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      <div className="p-8">

        {/* ADMIN */}
        {user?.role === "admin" && (
          <>
            {/* Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">

              <div className="bg-slate-900 p-6 rounded-2xl border border-cyan-500">
                <h2 className="text-4xl text-cyan-400 font-bold">
                  {projects.length}
                </h2>
                <p>Projects</p>
              </div>

              <div className="bg-slate-900 p-6 rounded-2xl border border-green-500">
                <h2 className="text-4xl text-green-400 font-bold">
                  {tasks.length}
                </h2>
                <p>Tasks</p>
              </div>

              <div className="bg-slate-900 p-6 rounded-2xl border border-red-500">
                <h2 className="text-4xl text-red-400 font-bold">
                  {overdue.length}
                </h2>
                <p>Overdue</p>
              </div>

            </div>

            {/* Forms */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">

              {/* Create Project */}
              <div className="bg-slate-900 p-6 rounded-2xl">
                <h2 className="text-2xl text-cyan-400 font-bold mb-4">
                  Create Project
                </h2>

                <input
                  placeholder="Project Title"
                  className="w-full p-3 mb-3 bg-slate-800 rounded"
                  value={projectForm.title}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      title: e.target.value
                    })
                  }
                />

                <textarea
                  placeholder="Description"
                  className="w-full p-3 mb-3 bg-slate-800 rounded"
                  value={projectForm.description}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      description: e.target.value
                    })
                  }
                />

                <button
                  onClick={createProject}
                  className="bg-cyan-500 px-5 py-2 rounded"
                >
                  Create
                </button>
              </div>

              {/* Create Task */}
              <div className="bg-slate-900 p-6 rounded-2xl">
                <h2 className="text-2xl text-green-400 font-bold mb-4">
                  Assign Task
                </h2>

                <input
                  placeholder="Task Title"
                  className="w-full p-3 mb-3 bg-slate-800 rounded"
                  value={taskForm.title}
                  onChange={(e) =>
                    setTaskForm({
                      ...taskForm,
                      title: e.target.value
                    })
                  }
                />

                <input
                  placeholder="Description"
                  className="w-full p-3 mb-3 bg-slate-800 rounded"
                  value={taskForm.description}
                  onChange={(e) =>
                    setTaskForm({
                      ...taskForm,
                      description: e.target.value
                    })
                  }
                />

                <select
                  className="w-full p-3 mb-3 bg-slate-800 rounded"
                  value={taskForm.project_id}
                  onChange={(e) =>
                    setTaskForm({
                      ...taskForm,
                      project_id: e.target.value
                    })
                  }
                >
                  <option value="">Select Project</option>

                  {projects.map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {item.title}
                    </option>
                  ))}
                </select>

                <input
                  placeholder="Assign To (name)"
                  className="w-full p-3 mb-3 bg-slate-800 rounded"
                  value={taskForm.assigned_to}
                  onChange={(e) =>
                    setTaskForm({
                      ...taskForm,
                      assigned_to: e.target.value
                    })
                  }
                />

                <input
                  type="date"
                  className="w-full p-3 mb-3 bg-slate-800 rounded"
                  value={taskForm.due_date}
                  onChange={(e) =>
                    setTaskForm({
                      ...taskForm,
                      due_date: e.target.value
                    })
                  }
                />

                <button
                  onClick={createTask}
                  className="bg-green-500 px-5 py-2 rounded"
                >
                  Create Task
                </button>
              </div>

            </div>

            {/* Lists */}
            <div className="grid md:grid-cols-2 gap-6">

              <div className="bg-slate-900 p-6 rounded-2xl">
                <h2 className="text-cyan-400 text-2xl font-bold mb-4">
                  Projects
                </h2>

                {projects.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-800 p-4 mb-3 rounded"
                  >
                    <p className="font-bold">
                      {item.title}
                    </p>
                    <p className="text-sm text-slate-400">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-slate-900 p-6 rounded-2xl">
                <h2 className="text-green-400 text-2xl font-bold mb-4">
                  Tasks
                </h2>

                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-slate-800 p-4 mb-3 rounded"
                  >
                    <p className="font-bold">
                      {task.title}
                    </p>
                    <p>{task.assignedUser}</p>
                    <p>{task.status}</p>
                  </div>
                ))}
              </div>

            </div>
          </>
        )}

        {/* MEMBER */}
        {user?.role === "member" && (
          <>
            <div className="grid md:grid-cols-3 gap-6 mb-8">

              <div className="bg-slate-900 p-6 rounded-2xl border border-cyan-500">
                <h2 className="text-4xl text-cyan-400 font-bold">
                  {myTasks.length}
                </h2>
                <p>My Tasks</p>
              </div>

              <div className="bg-slate-900 p-6 rounded-2xl border border-yellow-500">
                <h2 className="text-4xl text-yellow-400 font-bold">
                  {pendingTasks.length}
                </h2>
                <p>Pending</p>
              </div>

              <div className="bg-slate-900 p-6 rounded-2xl border border-green-500">
                <h2 className="text-4xl text-green-400 font-bold">
                  {completedTasks.length}
                </h2>
                <p>Completed</p>
              </div>

            </div>

            <div className="bg-slate-900 p-6 rounded-2xl">
              <h2 className="text-2xl text-cyan-400 font-bold mb-4">
                My Tasks
              </h2>

              {myTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-slate-800 p-4 mb-4 rounded-xl"
                >
                  <p className="font-bold">
                    {task.title}
                  </p>

                  <p>
                    Due:
                    {task.due_date?.slice(0, 10)}
                  </p>

                  <p>Status: {task.status}</p>

                  <div className="flex gap-3 mt-3">

                    <button
                      onClick={() =>
                        updateStatus(
                          task.id,
                          "pending"
                        )
                      }
                      className="bg-yellow-500 px-3 py-1 rounded"
                    >
                      Pending
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(
                          task.id,
                          "in progress"
                        )
                      }
                      className="bg-blue-500 px-3 py-1 rounded"
                    >
                      Progress
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(
                          task.id,
                          "completed"
                        )
                      }
                      className="bg-green-500 px-3 py-1 rounded"
                    >
                      Complete
                    </button>

                  </div>
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