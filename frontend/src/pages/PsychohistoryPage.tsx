import { Card, Grid, Stack, Text, Title } from '@mantine/core';

const conceptualCards = [
  { title: 'Probabilidade de adesao alta', value: '68%' },
  { title: 'Risco de polarizacao', value: 'Alto' },
  { title: 'Tipping Point estimado', value: '43 ciclos' },
  { title: 'Tendencia dominante', value: 'Aceitacao gradual com resistencia inicial' },
];

export function PsychohistoryPage() {
  return (
    <Stack gap="lg">
      <div>
        <Title order={2}>Psychohistory Engine</Title>
        <Text c="dimmed">
          Modulo conceitual para leitura probabilistica de tendencias coletivas.
        </Text>
      </div>

      <Grid>
        {conceptualCards.map((card) => (
          <Grid.Col key={card.title} span={{ base: 12, md: 6 }}>
            <Card withBorder radius="md" p="lg">
              <Text size="sm" c="dimmed">
                {card.title}
              </Text>
              <Text fw={700} mt="xs">
                {card.value}
              </Text>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      <Card withBorder radius="md" p="lg">
        <Text>
          Este modulo nao preve comportamento individual. O objetivo e apontar apenas
          tendencias coletivas provaveis a partir de cenarios e execucoes multiplas.
        </Text>
      </Card>
    </Stack>
  );
}
