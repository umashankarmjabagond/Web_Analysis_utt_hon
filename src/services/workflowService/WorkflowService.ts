import { BaseService } from "../BaseService";
import { API } from "../endpoints";

class WorkflowService extends BaseService {
  getAll() {
    return this.get(API.WORKFLOW.GET_ALL);
  }

  create(payload: unknown) {
    return this.post(
      API.WORKFLOW.CREATE,
      payload,
      "Workflow created successfully.",
    );
  }

  update(id: number, payload: unknown) {
    return this.put(
      API.WORKFLOW.UPDATE(id),
      payload,
      "Workflow updated successfully.",
    );
  }

  remove(id: number) {
    return this.delete(
      API.WORKFLOW.DELETE(id),
      "Workflow deleted successfully.",
    );
  }
}

export default new WorkflowService();
