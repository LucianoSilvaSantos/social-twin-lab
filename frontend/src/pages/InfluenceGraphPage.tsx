import { Card, Stack, Text, Title } from '@mantine/core';
import ReactFlow, { Background, Controls, MiniMap, Node, Edge } from 'reactflow';

const nodes: Node[] = [
  { id: '1', data: { label: 'Instituicao' }, position: { x: 120, y: 40 } },
  { id: '2', data: { label: 'Midia' }, position: { x: 360, y: 40 } },
  { id: '3', data: { label: 'Comunidade' }, position: { x: 240, y: 200 } },
];

const edges: Edge[] = [
  { id: 'e1-3', source: '1', target: '3', animated: true },
  { id: 'e2-3', source: '2', target: '3' },
];

export function InfluenceGraphPage() {
  return (
    <Stack gap="lg">
      <div>
        <Title order={2}>Rede de Influencia</Title>
        <Text c="dimmed">
          Visualizacao inicial conceitual de relacoes entre atores coletivos.
        </Text>
      </div>

      <Card withBorder radius="md" p="md" h={500}>
        <ReactFlow nodes={nodes} edges={edges} fitView>
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </Card>
    </Stack>
  );
}
