import { Card, Grid, Paper, Stack, Table, Text, Title } from '@mantine/core';

export function ResultsPage() {
  return (
    <Stack gap="lg">
      <div>
        <Title order={2}>Resultados</Title>
        <Text c="dimmed">
          Area inicial de consolidacao de saidas da simulacao e comparacao entre cenarios.
        </Text>
      </div>

      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper withBorder radius="md" p="lg" h={180}>
            <Text fw={600}>Placeholder: Linha temporal</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper withBorder radius="md" p="lg" h={180}>
            <Text fw={600}>Placeholder: Radar de polarizacao</Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={12}>
          <Paper withBorder radius="md" p="lg" h={180}>
            <Text fw={600}>Placeholder: Comparacao de cenarios</Text>
          </Paper>
        </Grid.Col>
      </Grid>

      <Card withBorder radius="md" p="lg">
        <Text fw={600} mb="sm">
          Placeholder: Tabela de resultados
        </Text>
        <Table withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Cenario</Table.Th>
              <Table.Th>Adesao</Table.Th>
              <Table.Th>Polarizacao</Table.Th>
              <Table.Th>Risco Social</Table.Th>
              <Table.Th>Tendencia</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>Politica A</Table.Td>
              <Table.Td>68%</Table.Td>
              <Table.Td>Alta</Table.Td>
              <Table.Td>Medio</Table.Td>
              <Table.Td>Aceitacao gradual</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Card>
    </Stack>
  );
}
