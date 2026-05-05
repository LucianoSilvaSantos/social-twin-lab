import { Card, Grid, Group, Paper, Slider, Stack, Text, Title } from '@mantine/core';

const segments = [
  'Juventude urbana',
  'Trabalhadores formais',
  'Comunidades perifericas',
  'Liderancas comunitarias',
];

export function PopulationPage() {
  return (
    <Stack gap="lg">
      <div>
        <Title order={2}>Populacao Sintetica</Title>
        <Text c="dimmed">
          Estrutura inicial para segmentos populacionais e tracos comportamentais.
        </Text>
      </div>

      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder radius="md" p="lg">
            <Text fw={600} mb="sm">
              Segmentos Populacionais
            </Text>
            <Stack gap="xs">
              {segments.map((segment) => (
                <Paper key={segment} withBorder p="sm" radius="sm">
                  <Text>{segment}</Text>
                </Paper>
              ))}
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder radius="md" p="lg">
            <Text fw={600} mb="md">
              Tracos Comportamentais
            </Text>
            <Stack>
              <div>
                <Group justify="space-between">
                  <Text size="sm">Medo</Text>
                  <Text size="sm" c="dimmed">
                    45
                  </Text>
                </Group>
                <Slider defaultValue={45} min={0} max={100} />
              </div>
              <div>
                <Group justify="space-between">
                  <Text size="sm">Confianca</Text>
                  <Text size="sm" c="dimmed">
                    57
                  </Text>
                </Group>
                <Slider defaultValue={57} min={0} max={100} />
              </div>
              <div>
                <Group justify="space-between">
                  <Text size="sm">Abertura</Text>
                  <Text size="sm" c="dimmed">
                    62
                  </Text>
                </Group>
                <Slider defaultValue={62} min={0} max={100} />
              </div>
              <div>
                <Group justify="space-between">
                  <Text size="sm">Conformismo</Text>
                  <Text size="sm" c="dimmed">
                    39
                  </Text>
                </Group>
                <Slider defaultValue={39} min={0} max={100} />
              </div>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>

      <Paper withBorder radius="md" p="lg">
        <Text fw={600}>Placeholder: Upload CSV</Text>
        <Text c="dimmed" mt="xs">
          Area reservada para importacao futura de perfis populacionais em lote.
        </Text>
      </Paper>
    </Stack>
  );
}
