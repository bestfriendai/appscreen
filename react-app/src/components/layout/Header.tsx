import { Settings, Info, FolderOpen, Languages, Globe, Download } from 'lucide-react';
import { Button } from '../ui';
import { useAppStore } from '../../store/useAppStore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/Select';
import { OUTPUT_DEVICES, LANGUAGES, type OutputDevice } from '../../types';

export function Header() {
  const {
    projects,
    currentProjectId,
    outputDevice,
    currentLanguage,
    projectLanguages,
    setOutputDevice,
    setCurrentLanguage,
    setShowSettingsModal,
    setShowAboutModal,
    setShowProjectModal,
    setShowLanguageModal,
    setShowExportModal,
    switchProject,
  } = useAppStore();

  const currentProject = projects.find((p) => p.id === currentProjectId);
  const languageOptions = LANGUAGES.filter((l) => projectLanguages.includes(l.code));

  return (
    <header className="h-12 bg-bg-secondary border-b border-border flex items-center justify-between px-4">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-accent to-[#764ba2] flex items-center justify-center">
            <span className="text-white text-xs font-bold">S</span>
          </div>
          <span className="text-sm font-semibold text-text-primary">Screenshot</span>
        </div>

        <div className="w-px h-5 bg-border" />

        {/* Project selector */}
        <Select
          value={currentProjectId || ''}
          onValueChange={(id) => switchProject(id)}
        >
          <SelectTrigger className="w-48 h-8 text-xs">
            <SelectValue placeholder="Select project">
              {currentProject?.name}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                <div className="flex items-center justify-between w-full">
                  <span>{project.name}</span>
                  <span className="text-text-secondary text-xs ml-2">
                    {project.screenshotCount}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setShowProjectModal(true)}
        >
          <FolderOpen className="h-4 w-4" />
        </Button>
      </div>

      {/* Center - Output device selector */}
      <div className="flex items-center gap-2">
        <Select
          value={outputDevice}
          onValueChange={(value) => setOutputDevice(value as OutputDevice)}
        >
          <SelectTrigger className="w-40 h-8 text-xs">
            <SelectValue>
              {OUTPUT_DEVICES[outputDevice].name}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(OUTPUT_DEVICES).map(([key, device]) => (
              <SelectItem key={key} value={key}>
                <div className="flex flex-col">
                  <span>{device.name}</span>
                  <span className="text-text-secondary text-2xs">
                    {device.width} × {device.height}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Language selector */}
        <Select value={currentLanguage} onValueChange={setCurrentLanguage}>
          <SelectTrigger className="w-32 h-8 text-xs">
            <Globe className="h-3 w-3 mr-1" />
            <SelectValue>
              {LANGUAGES.find((l) => l.code === currentLanguage)?.name}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {languageOptions.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.nativeName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setShowLanguageModal(true)}
        >
          <Languages className="h-4 w-4" />
        </Button>

        <div className="w-px h-5 bg-border" />

        <Button
          variant="primary"
          size="sm"
          className="h-8"
          onClick={() => setShowExportModal(true)}
        >
          <Download className="h-3.5 w-3.5 mr-1.5" />
          Export
        </Button>

        <div className="w-px h-5 bg-border" />

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setShowSettingsModal(true)}
        >
          <Settings className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setShowAboutModal(true)}
        >
          <Info className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
