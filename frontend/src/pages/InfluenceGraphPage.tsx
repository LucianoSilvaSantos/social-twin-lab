import {
  Button,
  Card,
  Grid,
  Group,
  NumberInput,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMemo, useState } from 'react';
import ReactFlow, { Background, Controls, Edge, MiniMap, Node } from 'reactflow';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  runInfluenceSimulation,
  type InfluenceGraphEdge,
  type InfluenceGraphNode,
  type InfluenceSimulationResponse,
} from '../services/simulation';

const MAX_GRAPH_NODES = 100;

function stateColor(state: string): string {
  if (state === 'supporter') {
    return '#2f9e44';
  }
  if (state === 'resistant') {
    return '#e03131';
  }
  return '#f08c00';
}

function toReactFlowNode(node: InfluenceGraphNode, index: number): Node {
  const columns = 10;
  const spacingX = 130;
  const spacingY = 90;
  const x = (index % columns) * spacingX;
  const y = Math.floor(index / columns) * spacingY;

  return {
    id: node.id,
    position: { x, y },
    data: { label: node.label },
    style: {
      border: node.is_leader ? '2px solid #1c7ed6' : '1px solid #adb5bd',
      borderRadius: 10,
      background: stateColor(node.state),
      color: '#fff',
      fontWeight: node.is_leader ? 700 : 500,
      padding: 4,
      width: node.is_leader ? 120 : 100,
      textAlign: 'center',
    },
  };
}

function toReactFlowEdge(edge: InfluenceGraphEdge): Edge {
  return {
    id: edge.id,
    source: edge.source,
    target: edge.target,
    animated: edge.weight > 0.7,
    style: {
      opacity: Math.max(0.2, edge.weight),
      strokeWidth: Math.max(1, edge.weight * 3),
    },
  };
}

export function InfluenceGraphPage() {
  const [result, setResult] = useState<InfluenceSimulationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      scenarioName: 'Rede de influencia sobre vacinacao',
      populationSize: 1000,
      cycles: 30,
      leadersCount: 5,
    },
    validate: {
      scenarioName: (value) => (value.trim() ? null : 'Nome do cenario e obrigatorio.'),
      populationSize: (value) =>
        value < 10 || value > 10000 ? 'Populacao deve estar entre 10 e 10000.' : null,
      cycles: (value) => (value < 1 || value > 100 ? 'Ciclos deve estar entre 1 e 100.' : null),
      leadersCount: (value) => (value < 1 || value > 50 ? 'Lideres deve estar entre 1 e 50.' : null),
    },
  });

  const graphNodes = useMemo(() => {
    if (!result) {
      return [] as Node[];
    }

    const limitedNodes = result.network.nodes.slice(0, MAX_GRAPH_NODES);
    const allowedIds = new Set(limitedNodes.map((node) => node.id));
    const connectedEdges = result.network.edges
      .filter((edge) => allowedIds.has(edge.source) && allowedIds.has(edge.target))
      .slice(0, MAX_GRAPH_NODES * 3);

    const connectedNodeIds = new Set<string>();
    connectedEdges.forEach((edge) => {
      connectedNodeIds.add(edge.source);
      connectedNodeIds.add(edge.target);
    });

    return limitedNodes
      .filter((node) => connectedNodeIds.size === 0 || connectedNodeIds.has(node.id))
      .map((node, index) => toReactFlowNode(node, index));
  }, [result]);

  const graphEdges = useMemo(() => {
    if (!result) {
      return [] as Edge[];
    }

    const nodeIds = new Set(graphNodes.map((node) => node.id));
    return result.network.edges
      .filter((edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target))
      .slice(0, MAX_GRAPH_NODES * 3)
      .map(toReactFlowEdge);
  }, [result, graphNodes]);

  return (
    <Stack gap="lg">
      <div>
        <Title order={2}>Rede de Influencia</Title>
        <Text c="dimmed">
          Simule como lideres e conexoes sociais alteram o comportamento coletivo.
        </Text>
      </div>

      <Card withBorder radius="md" p="lg">
        <form
          onSubmit={form.onSubmit(async (values) => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
              const simulationResult = await runInfluenceSimulation({
                scenario_name: values.scenarioName.trim(),
                population_size: values.populationSize,
                cycles: values.cycles,
                leaders_count: values.leadersCount,
              });
              setResult(simulationResult);
            } catch (error) {
              setResult(null);
              setErrorMessage(
                error instanceof Error
                  ? error.message
                  : 'Nao foi possivel executar a simulacao de influencia.',
              );
            } finally {
              setIsLoading(false);
            }
          })}
        >
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label="Nome do cenario"
                placeholder="Ex: Rede de influencia sobre vacinacao"
                required
                {...form.getInputProps('scenarioName')}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 2 }}>
              <NumberInput min={10} max={10000} label="Populacao" {...form.getInputProps('populationSize')} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 2 }}>
              <NumberInput min={1} max={100} label="Ciclos" {...form.getInputProps('cycles')} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 2 }}>
              <NumberInput min={1} max={50} label="Lideres" {...form.getInputProps('leadersCount')} />
            </Grid.Col>
            <Grid.Col span={12}>
              <Group>
                <Button type="submit" loading={isLoading}>
                  Executar Simulacao de Influencia
                </Button>
              </Group>
              {errorMessage ? (
                <Text c="red" mt="sm">
                  {errorMessage}
                </Text>
              ) : null}
            </Grid.Col>
          </Grid>
        </form>
      </Card>

      {result ? (
        <>
          <Grid>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Card withBorder radius="md" p="md">
                <Text c="dimmed">Apoiadores</Text>
                <Title order={4}>{result.final_result.supporters_percentage.toFixed(2)}%</Title>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Card withBorder radius="md" p="md">
                <Text c="dimmed">Resistentes</Text>
                <Title order={4}>{result.final_result.resistant_percentage.toFixed(2)}%</Title>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Card withBorder radius="md" p="md">
                <Text c="dimmed">Hesitantes</Text>
                <Title order={4}>{result.final_result.hesitant_percentage.toFixed(2)}%</Title>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Card withBorder radius="md" p="md">
                <Text c="dimmed">Risco / Polarizacao</Text>
                <Text fw={700}>{result.interpretation.social_risk}</Text>
                <Text>{result.interpretation.polarization_level}</Text>
              </Card>
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Card withBorder radius="md" p="md">
                <Text c="dimmed">Nos</Text>
                <Title order={4}>{result.network_summary.nodes}</Title>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Card withBorder radius="md" p="md">
                <Text c="dimmed">Conexoes</Text>
                <Title order={4}>{result.network_summary.edges}</Title>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Card withBorder radius="md" p="md">
                <Text c="dimmed">Lideres</Text>
                <Title order={4}>{result.network_summary.leaders}</Title>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Card withBorder radius="md" p="md">
                <Text c="dimmed">Influencia media</Text>
                <Title order={4}>{result.network_summary.average_influence.toFixed(2)}</Title>
              </Card>
            </Grid.Col>
          </Grid>

          <Card withBorder radius="md" p="lg">
            <Text fw={600} mb="xs">
              Tendencia: {result.interpretation.dominant_trend}
            </Text>
            <Text size="sm" c="dimmed">
              Efeito da rede: {result.interpretation.network_effect}
            </Text>
            <div style={{ width: '100%', height: 320, marginTop: 12 }}>
              <ResponsiveContainer>
                <LineChart data={result.timeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="cycle" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="supporters" name="Apoiadores" stroke="#2f9e44" />
                  <Line type="monotone" dataKey="resistant" name="Resistentes" stroke="#e03131" />
                  <Line type="monotone" dataKey="hesitant" name="Hesitantes" stroke="#f08c00" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card withBorder radius="md" p="md" h={520}>
            <Text fw={600} mb="sm">
              Visualizacao da rede (amostra de ate {MAX_GRAPH_NODES} nos)
            </Text>
            <ReactFlow nodes={graphNodes} edges={graphEdges} fitView>
              <MiniMap />
              <Controls />
              <Background />
            </ReactFlow>
          </Card>

          <Card withBorder radius="md" p="md">
            <Text fw={600} mb="sm">
              Lideres
            </Text>
            <Table withTableBorder withColumnBorders>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Nome</Table.Th>
                  <Table.Th>Posicao</Table.Th>
                  <Table.Th>Poder de influencia</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {result.leaders.map((leader) => (
                  <Table.Tr key={leader.id}>
                    <Table.Td>{leader.name}</Table.Td>
                    <Table.Td>{leader.stance}</Table.Td>
                    <Table.Td>{leader.influence_power.toFixed(2)}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card>
        </>
      ) : null}
    </Stack>
  );
}
