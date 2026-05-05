import {
  Button,
  Card,
  Grid,
  Group,
  NumberInput,
  SimpleGrid,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
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
import { useState } from 'react';
import { runSimulation, type SimulationResponse } from '../services/simulation';

export function ScenariosPage() {
  const [result, setResult] = useState<SimulationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      scenarioName: 'Nova politica publica de vacinacao',
      populationSize: 1000,
      cycles: 30,
    },
    validate: {
      scenarioName: (value) => (value.trim().length === 0 ? 'Nome do cenario e obrigatorio.' : null),
      populationSize: (value) =>
        value < 10 || value > 10000 ? 'Populacao deve estar entre 10 e 10000.' : null,
      cycles: (value) => (value < 1 || value > 100 ? 'Ciclos deve estar entre 1 e 100.' : null),
    },
  });

  return (
    <Stack gap="lg">
      <div>
        <Title order={2}>Simulacao de Cenarios</Title>
        <Text c="dimmed">
          Configure o cenario e rode a simulacao para observar tendencias coletivas.
        </Text>
      </div>

      <Card withBorder radius="md" p="lg">
        <form
          onSubmit={form.onSubmit(async (values) => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
              const simulationResult = await runSimulation({
                scenario_name: values.scenarioName.trim(),
                population_size: values.populationSize,
                cycles: values.cycles,
              });
              setResult(simulationResult);
            } catch (error) {
              setResult(null);
              setErrorMessage(
                error instanceof Error ? error.message : 'Nao foi possivel executar a simulacao.',
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
                placeholder="Ex: Nova politica publica"
                required
                {...form.getInputProps('scenarioName')}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                min={10}
                max={10000}
                label="Tamanho da populacao"
                required
                {...form.getInputProps('populationSize')}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                min={1}
                max={100}
                label="Numero de ciclos"
                required
                {...form.getInputProps('cycles')}
              />
            </Grid.Col>

            <Grid.Col span={12}>
              <Group justify="flex-start">
                <Button type="submit" loading={isLoading}>
                  Executar Simulacao
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
          <SimpleGrid cols={{ base: 1, md: 3 }}>
            <Card withBorder radius="md" p="md">
              <Text size="sm" c="dimmed">
                Apoiadores
              </Text>
              <Title order={3}>{result.final_result.supporters_percentage.toFixed(2)}%</Title>
              <Text size="sm">Total: {result.final_result.supporters}</Text>
            </Card>
            <Card withBorder radius="md" p="md">
              <Text size="sm" c="dimmed">
                Resistentes
              </Text>
              <Title order={3}>{result.final_result.resistant_percentage.toFixed(2)}%</Title>
              <Text size="sm">Total: {result.final_result.resistant}</Text>
            </Card>
            <Card withBorder radius="md" p="md">
              <Text size="sm" c="dimmed">
                Hesitantes
              </Text>
              <Title order={3}>{result.final_result.hesitant_percentage.toFixed(2)}%</Title>
              <Text size="sm">Total: {result.final_result.hesitant}</Text>
            </Card>
          </SimpleGrid>

          <SimpleGrid cols={{ base: 1, md: 2 }}>
            <Card withBorder radius="md" p="md">
              <Text size="sm" c="dimmed">
                Risco Social
              </Text>
              <Title order={4}>{result.interpretation.social_risk}</Title>
            </Card>
            <Card withBorder radius="md" p="md">
              <Text size="sm" c="dimmed">
                Polarizacao
              </Text>
              <Title order={4}>{result.interpretation.polarization_level}</Title>
            </Card>
          </SimpleGrid>

          <Card withBorder radius="md" p="lg">
            <Text fw={600} mb="sm">
              Tendencia dominante: {result.interpretation.dominant_trend}
            </Text>
            <div style={{ width: '100%', height: 320 }}>
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

          <Card withBorder radius="md" p="lg">
            <Text fw={600} mb="sm">
              Resultado por ciclo
            </Text>
            <Table withTableBorder withColumnBorders striped>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Ciclo</Table.Th>
                  <Table.Th>Apoiadores</Table.Th>
                  <Table.Th>Resistentes</Table.Th>
                  <Table.Th>Hesitantes</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {result.timeline.map((cycle) => (
                  <Table.Tr key={cycle.cycle}>
                    <Table.Td>{cycle.cycle}</Table.Td>
                    <Table.Td>{cycle.supporters}</Table.Td>
                    <Table.Td>{cycle.resistant}</Table.Td>
                    <Table.Td>{cycle.hesitant}</Table.Td>
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
