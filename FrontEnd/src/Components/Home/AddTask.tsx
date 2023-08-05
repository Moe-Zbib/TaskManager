import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const Heading = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #007bff;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const TaskListContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin-top: 20px;
`;

const TaskItem = styled.div`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  display: flex;
  justify-content: space-between;
`;

const TaskText = styled.div`
  font-size: 16px;
`;

const DeleteButton = styled.button`
  background-color: red;
  color: white;
  margin-right: 10px;
  cursor: pointer;
`;

const EditButton = styled.button`
  background-color: orange;
  color: white;
  cursor: pointer;
`;

interface Task {
  task_id: number;
  title: string;
  description: string;
  done: boolean;
  due_time: string;
  created_at: string;
  side_notes: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

const TaskList: React.FC<{
  tasks: Task[];
  onEditTask: (taskId: number) => void;
  onDeleteTask: (taskId: number) => void;
  onToggleTask: (taskId: number, done: boolean) => void;
  onSortChange: (sortOption: string, sortOrder: string) => void;
}> = ({ tasks, onEditTask, onDeleteTask, onToggleTask, onSortChange }) => {
  return (
    <TaskListContainer>
      <div>
        <label>Sort By:</label>
        <select onChange={(e) => onSortChange(e.target.value, "asc")}>
          <option value="due_time">Due Time</option>
          <option value="created_at">Created At</option>
        </select>
        <select onChange={(e) => onSortChange("due_time", e.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      {tasks.map((task) => (
        <TaskItem key={task.task_id}>
          <TaskText>
            <strong>{task.title}</strong> - {task.description}
            <br />
            <span>Status: {task.done ? "Done" : "Not Done"}</span>
            <br />
            <span>Due Date: {formatDate(task.due_time)}</span>
            <br />
            <span>Created At: {formatDate(task.created_at)}</span>
          </TaskText>
          <div>
            <Button onClick={() => onToggleTask(task.task_id, task.done)}>
              {task.done ? "Undone" : "Done"}
            </Button>
            <EditButton onClick={() => onEditTask(task.task_id)}>
              Edit
            </EditButton>
            <DeleteButton onClick={() => onDeleteTask(task.task_id)}>
              Delete
            </DeleteButton>
          </div>
        </TaskItem>
      ))}
    </TaskListContainer>
  );
};

const AddTask: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [sideNotes, setSideNotes] = useState("");
  const [sortOption, setSortOption] = useState<string>("due_time");
  const [sortOrder, setSortOrder] = useState<string>("asc");

  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, [sortOption, sortOrder]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/task/get", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          sort: sortOption,
          order: sortOrder,
        },
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleAddTask = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/task/add",
        {
          title,
          description,
          due_time: dueTime,
          side_notes: sideNotes,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Task added successfully:", response.data);
      fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await axios.delete(`http://localhost:3001/api/task/delete/${taskId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Task deleted successfully");
      fetchTasks(); // Fetch tasks again after deleting a task
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleEditTask = async (taskId: number) => {
    console.log("Edit task:", taskId);
  };

  const handleToggleTask = async (taskId: number, done: boolean) => {
    try {
      await axios.put(
        `http://localhost:3001/api/task/toggle-status/${taskId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Task status toggled successfully");
      fetchTasks();
    } catch (error) {
      console.error("Error toggling task status:", error);
    }
  };

  const handleSortChange = (sortOption: string, sortOrder: string) => {
    setSortOption(sortOption);
    setSortOrder(sortOrder);
  };

  return (
    <Container>
      <Heading>Add New Task</Heading>
      <Form>
        <div>
          <label>Title:</label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label>Due Time:</label>
          <Input
            type="datetime-local"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
          />
        </div>
        <div>
          <label>Side Notes:</label>
          <textarea
            value={sideNotes}
            onChange={(e) => setSideNotes(e.target.value)}
          />
        </div>
        <Button type="button" onClick={handleAddTask}>
          Add Task
        </Button>
      </Form>
      <TaskList
        tasks={tasks}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
        onToggleTask={handleToggleTask}
        onSortChange={handleSortChange}
      />
    </Container>
  );
};

export default AddTask;
