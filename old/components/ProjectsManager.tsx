import React, { useEffect, useState } from 'react';
import { X, FolderPlus, Save, Trash2, Copy } from 'lucide-react';
import Button from './Button';
import { getAllKeysFromIndexedDB, loadFromIndexedDB, saveToIndexedDB, deleteFromIndexedDB, compressData, decompressData } from '../utils/indexedDBStorage';
import { ProjectData } from '../utils/exportUtils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLoadProject: (data: ProjectData) => void;
  currentProject?: ProjectData | null;
}

export default function ProjectsManager({ isOpen, onClose, onLoadProject, currentProject }: Props) {
  const [projects, setProjects] = useState<string[]>([]);
  const [name, setName] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      const keys = await getAllKeysFromIndexedDB('PROJECTS');
      const list = keys.filter(k => k.startsWith('project:')).map(k => k.replace('project:', ''));
      setProjects(list);
    })();
  }, [isOpen]);

  const saveCurrent = async () => {
    if (!currentProject || !name.trim()) return;
    const key = `project:${name.trim()}`;
    await saveToIndexedDB('PROJECTS', key, compressData(currentProject));
    setName('');
    const keys = await getAllKeysFromIndexedDB('PROJECTS');
    setProjects(keys.filter(k => k.startsWith('project:')).map(k => k.replace('project:', '')));
  };

  const loadProject = async (n: string) => {
    const key = `project:${n}`;
    const data = await loadFromIndexedDB<string>('PROJECTS', key);
    if (data) onLoadProject(decompressData<ProjectData>(data));
    onClose();
  };

  const deleteProject = async (n: string) => {
    const key = `project:${n}`;
    await deleteFromIndexedDB('PROJECTS', key);
    const keys = await getAllKeysFromIndexedDB('PROJECTS');
    setProjects(keys.filter(k => k.startsWith('project:')).map(k => k.replace('project:', '')));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-xl p-6 shadow-2xl animate-in zoom-in-95 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">Projects</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
        </div>

        <div className="mb-4">
          <label className="text-xs text-gray-500 uppercase font-bold block mb-2">Save Current As</label>
          <div className="flex gap-2">
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Project name" className="flex-1 bg-black border border-white/10 rounded px-3 py-2 text-sm text-white"/>
            <Button onClick={saveCurrent} variant="primary" className="px-4"><Save className="w-4 h-4"/></Button>
          </div>
        </div>

        <div className="space-y-2">
          {projects.length === 0 && <div className="text-xs text-gray-500">No saved projects yet.</div>}
          {projects.map(n => (
            <div key={n} className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-black/20">
              <div className="text-sm text-white">{n}</div>
              <div className="flex gap-2">
                <Button onClick={()=>loadProject(n)} variant="secondary" className="px-3">Load</Button>
                <Button onClick={()=>deleteProject(n)} variant="danger" className="px-3"><Trash2 className="w-4 h-4"/></Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
