import templateExecutionMockData from "./templateExecution.mock.json";

export function generateTemplateExecutionMock(count: number) {
  const baseWorkflows = templateExecutionMockData.workflows;

  const workflows = Array.from({ length: count }, (_, index) => {
    const workflow = baseWorkflows[index % baseWorkflows.length];

    return {
      ...workflow,

      itemId: `56-FFC${600 + index}`,

      workflow: {
        ...workflow.workflow,
        nodes: workflow.workflow.nodes.map((node) => ({
          ...node,
          id: `${node.id}-${index}`,
        })),

        edges: workflow.workflow.edges.map((edge) => ({
          ...edge,
          id: `${edge.id}-${index}`,
          source: `${edge.source}-${index}`,
          target: `${edge.target}-${index}`,
        })),
      },
    };
  });

  return {
    ...templateExecutionMockData,
    workflows,
  };
}
