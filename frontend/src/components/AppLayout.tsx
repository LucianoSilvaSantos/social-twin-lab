import {
  AppShell,
  Box,
  Burger,
  Divider,
  Group,
  NavLink,
  ScrollArea,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconActivityHeartbeat,
  IconChartBar,
  IconChartInfographic,
  IconCompass,
  IconFlask,
  IconNetwork,
  IconUsers,
} from '@tabler/icons-react';
import { Link, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';

type NavItem = {
  label: string;
  to: string;
  icon: ReactNode;
};

const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: <IconChartBar size={18} /> },
  { label: 'Cenarios', to: '/scenarios', icon: <IconCompass size={18} /> },
  { label: 'Populacao Sintetica', to: '/population', icon: <IconUsers size={18} /> },
  { label: 'Rede de Influencia', to: '/influence-graph', icon: <IconNetwork size={18} /> },
  { label: 'Policy Sandbox', to: '/policy-sandbox', icon: <IconFlask size={18} /> },
  {
    label: 'Psychohistory Engine',
    to: '/psychohistory',
    icon: <IconActivityHeartbeat size={18} />,
  },
  { label: 'Resultados', to: '/results', icon: <IconChartInfographic size={18} /> },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const location = useLocation();

  return (
    <AppShell
      header={{ height: 64 }}
      navbar={{ width: 280, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Title order={4}>Social Twin Lab</Title>
          </Group>
          <Text size="sm" c="dimmed">
            Iteration 03 - Influence Graph
          </Text>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section>
          <Title order={5}>Navegacao</Title>
          <Text size="sm" c="dimmed">
            Modulos iniciais da plataforma
          </Text>
        </AppShell.Section>

        <Divider my="sm" />

        <AppShell.Section grow component={ScrollArea}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              component={Link}
              to={item.to}
              label={item.label}
              leftSection={item.icon}
              active={location.pathname === item.to}
              variant="light"
              mb={6}
            />
          ))}
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>
        <Box>{children}</Box>
      </AppShell.Main>
    </AppShell>
  );
}
