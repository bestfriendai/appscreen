import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import { useAppStore } from '../../store/useAppStore';
import { BackgroundPanel } from '../sidebar/BackgroundPanel';
import { DevicePanel } from '../sidebar/DevicePanel';
import { TextPanel } from '../sidebar/TextPanel';

export function RightSidebar() {
  const { activeTab, setActiveTab } = useAppStore();

  return (
    <aside className="w-80 bg-bg-secondary border-l border-border flex flex-col h-full">
      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          setActiveTab(value as 'background' | 'device' | 'text')
        }
        className="flex flex-col h-full"
      >
        <div className="p-3 border-b border-border">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="background">Background</TabsTrigger>
            <TabsTrigger value="device">Device</TabsTrigger>
            <TabsTrigger value="text">Text</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <TabsContent value="background" className="m-0 h-full">
            <BackgroundPanel />
          </TabsContent>
          <TabsContent value="device" className="m-0 h-full">
            <DevicePanel />
          </TabsContent>
          <TabsContent value="text" className="m-0 h-full">
            <TextPanel />
          </TabsContent>
        </div>
      </Tabs>
    </aside>
  );
}
