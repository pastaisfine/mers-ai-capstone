'use client';

import { ThemeProvider } from './context/theme/ThemeProvider';
import { TimeProvider } from './context/time/TimeProvider';
import { SimulatorProvider } from './context/simulator/SimulatorProvider';
import { IncidentProvider } from './context/incident/IncidentProvider';
import { TabProvider } from './context/tab/TabProvider';
import { TabName } from './types';
import { TabLayout } from './components/TabLayout';


export default function App() {
  return (
    <TimeProvider>
      <ThemeProvider defaultTheme='light'>
        <IncidentProvider>
          <SimulatorProvider>
            <TabProvider defaultTab={TabName.OPERATIONS}>
              <TabLayout />
            </TabProvider>
          </SimulatorProvider>
        </IncidentProvider>
      </ThemeProvider>
    </TimeProvider >
  );
}
