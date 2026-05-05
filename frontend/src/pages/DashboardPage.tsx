import { Card, Grid, Group, Paper, Progress, Stack, Text, Title } from '@mantine/core';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const kpis = [
  { label: 'Indice de Adesao', value: 68, color: 'teal' },
  { label: 'Polarizacao', value: 74, color: 'orange' },
  { label: 'Risco Social', value: 51, color: 'red' },
  { label: 'Confianca Institucional', value: 57, color: 'blue' },
];

const chartData = [
  { t: 'T1', adesao: 42 },
  { t: 'T2', adesao: 48 },
  { t: 'T3', adesao: 56 },
  { t: 'T4', adesao: 63 },
  { t: 'T5', adesao: 68 },
];

export function DashboardPage() {
  return (
    <Stack gap="lg">
      <div>
        <Title order={2}>Dashboard</Title>
        <Text c="dimmed">
          Visao inicial de indicadores sociopoliticos com placeholders para analise temporal,
          calor social e rede de influencia.
        </Text>
      </div>

      <Grid>
        {kpis.map((kpi) => (
          <Grid.Col key={kpi.label} span={{ base: 12, md: 6, lg: 3 }}>
            <Card withBorder radius="md" p="lg">
              <Group justify="space-between" mb="xs">
                <Text fw={600}>{kpi.label}</Text>
                <Text fw={700}>{kpi.value}%</Text>
              </Group>
              <Progress value={kpi.value} color={kpi.color} radius="xl" />
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      <Grid>
        <Grid.Col span={{ base: 12, lg: 7 }}>
          <Paper withBorder radius="md" p="md" h={320}>
            <Text fw={600} mb="md">
              Placeholder: Grafico Temporal
            </Text>
            <ResponsiveContainer width="100%" height="90%">
              <AreaChart data={chartData}>
                <XAxis dataKey="t" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Area type="monotone" dataKey="adesao" stroke="#0ca678" fill="#c3fae8" />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 5 }}>
          <Stack h="100%" gap="md">
            <Paper withBorder radius="md" p="md" h={150}>
              <Text fw={600}>Placeholder: Mapa de Calor</Text>
              <Text c="dimmed" mt="xs">
                Area reservada para intensidade regional de comportamento coletivo.
              </Text>
            </Paper>
            <Paper withBorder radius="md" p="md" h={150}>
              <Text fw={600}>Placeholder: Rede de Influencia</Text>
              <Text c="dimmed" mt="xs">
                Area reservada para visualizacao de grafo entre atores e instituicoes.
              </Text>
            </Paper>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
