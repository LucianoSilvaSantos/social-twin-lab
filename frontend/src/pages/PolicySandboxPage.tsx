import {
  Button,
  Card,
  Grid,
  Group,
  NumberInput,
  Slider,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
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
  runPolicySimulation,
  type PolicySimulationResponse,
} from '../services/simulation';

export function PolicySandboxPage() {
  const [result, setResult] = useState<PolicySimulationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      scenarioName: 'Nova UPA',
      populationSize: 1000,
      cycles: 30,
      institutionalTrustModifier: 0.3,
      mediaInfluence: 0.4,
      religiousInfluence: 0.2,
      economicStress: 0.1,
      policyIntensity: 0.7,
    },
    validate: {
      scenarioName: (value) => (value.trim().length ? null : 'Nome do cenario e obrigatorio.'),
      populationSize: (value) =>
        value < 10 || value > 10000 ? 'Populacao deve estar entre 10 e 10000.' : null,
      cycles: (value) => (value < 1 || value > 100 ? 'Ciclos deve estar entre 1 e 100.' : null),
    },
  });

  const comparisonData = result
    ? result.base_scenario.timeline.map((baseCycle) => {
        const policyCycle = result.policy_scenario.timeline[baseCycle.cycle - 1];
        return {
          cycle: baseCycle.cycle,
          supporters_base: baseCycle.supporters,
          supporters_policy: policyCycle?.supporters ?? 0,
          resistant_base: baseCycle.resistant,
          resistant_policy: policyCycle?.resistant ?? 0,
          hesitant_base: baseCycle.hesitant,
          hesitant_policy: policyCycle?.hesitant ?? 0,
        };
      })
    : [];

  const formatChange = (value: number) => (value >= 0 ? `+${value.toFixed(2)}` : value.toFixed(2));

  return (
    <Stack gap="lg">
      <div>
        <Title order={2}>Policy Sandbox</Title>
        <Text c="dimmed">
          Compare o cenario base com o cenario apos intervencao de politica publica.
        </Text>
      </div>

      <Card withBorder radius="md" p="lg">
        <form
          onSubmit={form.onSubmit(async (values) => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
              const response = await runPolicySimulation({
                scenario_name: values.scenarioName.trim(),
                population_size: values.populationSize,
                cycles: values.cycles,
                policy: {
                  institutional_trust_modifier: values.institutionalTrustModifier,
                  media_influence: values.mediaInfluence,
                  religious_influence: values.religiousInfluence,
                  economic_stress: values.economicStress,
                  policy_intensity: values.policyIntensity,
                },
              });
              setResult(response);
            } catch (error) {
              setResult(null);
              setErrorMessage(
                error instanceof Error
                  ? error.message
                  : 'Nao foi possivel executar a simulacao de politica.',
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
                placeholder="Ex: Nova UPA"
                required
                {...form.getInputProps('scenarioName')}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                min={10}
                max={10000}
                label="Tamanho da populacao"
                {...form.getInputProps('populationSize')}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                min={1}
                max={100}
                label="Numero de ciclos"
                {...form.getInputProps('cycles')}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Slider
                label={(value) => value.toFixed(2)}
                min={-1}
                max={1}
                step={0.05}
                marks={[
                  { value: -1, label: '-1.0' },
                  { value: 0, label: '0.0' },
                  { value: 1, label: '1.0' },
                ]}
                {...form.getInputProps('institutionalTrustModifier')}
              />
              <Text size="sm" c="dimmed" mt={6}>
                Confianca institucional
              </Text>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Slider
                label={(value) => value.toFixed(2)}
                min={0}
                max={1}
                step={0.05}
                marks={[
                  { value: 0, label: '0.0' },
                  { value: 0.5, label: '0.5' },
                  { value: 1, label: '1.0' },
                ]}
                {...form.getInputProps('mediaInfluence')}
              />
              <Text size="sm" c="dimmed" mt={6}>
                Influencia da midia
              </Text>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Slider
                label={(value) => value.toFixed(2)}
                min={0}
                max={1}
                step={0.05}
                marks={[
                  { value: 0, label: '0.0' },
                  { value: 0.5, label: '0.5' },
                  { value: 1, label: '1.0' },
                ]}
                {...form.getInputProps('religiousInfluence')}
              />
              <Text size="sm" c="dimmed" mt={6}>
                Influencia religiosa
              </Text>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Slider
                label={(value) => value.toFixed(2)}
                min={0}
                max={1}
                step={0.05}
                marks={[
                  { value: 0, label: '0.0' },
                  { value: 0.5, label: '0.5' },
                  { value: 1, label: '1.0' },
                ]}
                {...form.getInputProps('economicStress')}
              />
              <Text size="sm" c="dimmed" mt={6}>
                Estresse economico
              </Text>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Slider
                label={(value) => value.toFixed(2)}
                min={0}
                max={1}
                step={0.05}
                marks={[
                  { value: 0, label: '0.0' },
                  { value: 0.5, label: '0.5' },
                  { value: 1, label: '1.0' },
                ]}
                {...form.getInputProps('policyIntensity')}
              />
              <Text size="sm" c="dimmed" mt={6}>
                Intensidade da politica
              </Text>
            </Grid.Col>

            <Grid.Col span={12}>
              <Group justify="flex-start">
                <Button type="submit" loading={isLoading}>
                  Executar Simulacao de Politica
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
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card withBorder radius="md" p="md">
                <Title order={5}>Antes (Base)</Title>
                <Text>Apoiadores: {result.base_scenario.final_result.supporters_percentage.toFixed(2)}%</Text>
                <Text>Resistentes: {result.base_scenario.final_result.resistant_percentage.toFixed(2)}%</Text>
                <Text>Hesitantes: {result.base_scenario.final_result.hesitant_percentage.toFixed(2)}%</Text>
                <Text>Risco Social: {result.base_scenario.interpretation.social_risk}</Text>
                <Text>Polarizacao: {result.base_scenario.interpretation.polarization_level}</Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card withBorder radius="md" p="md">
                <Title order={5}>Depois (Politica)</Title>
                <Text>
                  Apoiadores: {result.policy_scenario.final_result.supporters_percentage.toFixed(2)}%
                </Text>
                <Text>
                  Resistentes: {result.policy_scenario.final_result.resistant_percentage.toFixed(2)}%
                </Text>
                <Text>
                  Hesitantes: {result.policy_scenario.final_result.hesitant_percentage.toFixed(2)}%
                </Text>
                <Text>Risco Social: {result.policy_scenario.interpretation.social_risk}</Text>
                <Text>Polarizacao: {result.policy_scenario.interpretation.polarization_level}</Text>
              </Card>
            </Grid.Col>
          </Grid>

          <Card withBorder radius="md" p="lg">
            <Title order={5} mb="sm">
              Impacto da politica
            </Title>
            <Table withTableBorder withColumnBorders>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Indicador</Table.Th>
                  <Table.Th>Variacao</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td>Adesao (Apoiadores)</Table.Td>
                  <Table.Td>{formatChange(result.difference.supporters_percentage_change)}%</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Resistencia</Table.Td>
                  <Table.Td>{formatChange(result.difference.resistant_percentage_change)}%</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Hesitacao</Table.Td>
                  <Table.Td>{formatChange(result.difference.hesitant_percentage_change)}%</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Mudanca de risco social</Table.Td>
                  <Table.Td>{result.difference.risk_change}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td>Mudanca de polarizacao</Table.Td>
                  <Table.Td>{result.difference.polarization_change}</Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </Card>

          <Card withBorder radius="md" p="lg">
            <Title order={5} mb="sm">
              Grafico comparativo
            </Title>
            <div style={{ width: '100%', height: 360 }}>
              <ResponsiveContainer>
                <LineChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="cycle" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="supporters_base" name="Apoiadores Base" stroke="#2f9e44" />
                  <Line
                    type="monotone"
                    dataKey="supporters_policy"
                    name="Apoiadores Politica"
                    stroke="#1c7ed6"
                  />
                  <Line type="monotone" dataKey="resistant_base" name="Resistentes Base" stroke="#e03131" />
                  <Line
                    type="monotone"
                    dataKey="resistant_policy"
                    name="Resistentes Politica"
                    stroke="#c2255c"
                  />
                  <Line type="monotone" dataKey="hesitant_base" name="Hesitantes Base" stroke="#f08c00" />
                  <Line
                    type="monotone"
                    dataKey="hesitant_policy"
                    name="Hesitantes Politica"
                    stroke="#5f3dc4"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </>
      ) : null}
    </Stack>
  );
}
