import { defineStore } from "pinia";
import { http } from "../api/http";

export const useTasksStore = defineStore("tasks", {
  state: () => ({
    items: [],
    loading: false,
    error: "",
  }),
  actions: {
    async fetchAll() {
      this.loading = true;
      this.error = "";
      try {
        this.items = await http.get("/api/tasks");
      } catch (e) {
        this.error = e?.message ?? "Failed to fetch tasks";
      } finally {
        this.loading = false;
      }
    },
    async createTask(payload) {
      const created = await http.post("/api/tasks", payload);
      this.items = [created, ...this.items].sort((a, b) =>
        a.dueAt.localeCompare(b.dueAt),
      );
      return created;
    },
    async updateStatus(id, status) {
      const updated = await http.patch(`/api/tasks/${id}/status`, { status });
      this.items = this.items.map((t) => (t._id === id ? updated : t));
      return updated;
    },
    async updateTask(id, payload) {
      const updated = await http.patch(`/api/tasks/${id}`, payload);
      this.items = this.items.map((t) => (t._id === id ? updated : t));
      return updated;
    },
    async deleteTask(id) {
      await http.del(`/api/tasks/${id}`);
      this.items = this.items.filter((t) => t._id !== id);
    },
  },
});
