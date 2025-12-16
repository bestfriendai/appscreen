import Dexie, { type Table } from 'dexie';
import { v4 as uuidv4 } from 'uuid';
import type { Project, ProjectData } from '../types';

// Database schema
class AppDatabase extends Dexie {
  projects!: Table<Project>;
  projectData!: Table<ProjectData>;

  constructor() {
    super('ScreenshotGenerator');
    this.version(1).stores({
      projects: 'id, name, createdAt, updatedAt',
      projectData: 'id',
    });
  }
}

export const db = new AppDatabase();

// Get all projects (metadata only)
export async function getProjects(): Promise<Project[]> {
  try {
    const projects = await db.projects.orderBy('updatedAt').reverse().toArray();
    return projects;
  } catch (error) {
    console.error('Failed to get projects:', error);
    return [];
  }
}

// Create a new project
export async function createNewProject(name: string): Promise<Project> {
  const id = uuidv4();
  const now = Date.now();

  const project: Project = {
    id,
    name,
    createdAt: now,
    updatedAt: now,
    screenshotCount: 0,
  };

  const projectData: ProjectData = {
    id,
    name,
    screenshots: [],
    selectedIndex: 0,
    outputDevice: 'iphone-6.7',
    currentLanguage: 'en',
    projectLanguages: ['en'],
    defaults: {
      background: {
        type: 'gradient',
        color: '#1a1a2e',
        gradient: {
          type: 'linear',
          angle: 180,
          stops: [
            { id: '1', color: '#667eea', position: 0 },
            { id: '2', color: '#764ba2', position: 100 },
          ],
        },
        image: null,
        imageBlur: 0,
        imageOverlayColor: '#000000',
        imageOverlayOpacity: 0,
      },
      screenshot: {
        position: { x: 50, y: 50 },
        scale: 0.7,
        rotation: 0,
        cornerRadius: 40,
        shadow: {
          enabled: true,
          color: 'rgba(0, 0, 0, 0.4)',
          blur: 60,
          offsetX: 0,
          offsetY: 30,
          spread: 0,
        },
        border: {
          enabled: false,
          color: '#ffffff',
          width: 2,
        },
      },
      device: {
        mode: '2d',
        frame: 'none',
        showFrame: false,
        frameColor: '#1a1a1a',
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        scale3d: 1,
      },
      noise: {
        enabled: false,
        opacity: 0.05,
        scale: 1,
      },
      text: {
        headline: {
          enabled: true,
          fontFamily: 'SF Pro Display',
          fontSize: 72,
          fontWeight: 700,
          color: '#ffffff',
          alignment: 'center',
          position: 'top',
          offsetY: 120,
          letterSpacing: -1,
          lineHeight: 1.1,
          maxWidth: 90,
        },
        subheadline: {
          enabled: false,
          fontFamily: 'SF Pro Display',
          fontSize: 36,
          fontWeight: 400,
          color: 'rgba(255, 255, 255, 0.8)',
          alignment: 'center',
          position: 'top',
          offsetY: 200,
          letterSpacing: 0,
          lineHeight: 1.3,
          maxWidth: 80,
        },
        headlines: { en: '' },
        subheadlines: { en: '' },
        usePerScreenshot: false,
      },
    },
    export: {
      format: 'png',
      quality: 100,
      scale: 1,
      includeLanguages: 'current',
    },
    createdAt: now,
    updatedAt: now,
  };

  await db.projects.add(project);
  await db.projectData.add(projectData);

  return project;
}

// Save project data
export async function saveProject(id: string, data: ProjectData): Promise<void> {
  try {
    await db.projectData.put(data);
    await db.projects.update(id, {
      updatedAt: Date.now(),
      screenshotCount: data.screenshots.length,
    });
  } catch (error) {
    console.error('Failed to save project:', error);
    throw error;
  }
}

// Load project data
export async function loadProject(id: string): Promise<ProjectData | undefined> {
  try {
    return await db.projectData.get(id);
  } catch (error) {
    console.error('Failed to load project:', error);
    return undefined;
  }
}

// Delete project
export async function deleteProjectFromDB(id: string): Promise<void> {
  try {
    await db.projects.delete(id);
    await db.projectData.delete(id);
  } catch (error) {
    console.error('Failed to delete project:', error);
    throw error;
  }
}

// Rename project
export async function renameProject(id: string, name: string): Promise<void> {
  try {
    await db.projects.update(id, { name, updatedAt: Date.now() });
    const projectData = await db.projectData.get(id);
    if (projectData) {
      projectData.name = name;
      projectData.updatedAt = Date.now();
      await db.projectData.put(projectData);
    }
  } catch (error) {
    console.error('Failed to rename project:', error);
    throw error;
  }
}

// Check if database has any projects
export async function hasProjects(): Promise<boolean> {
  const count = await db.projects.count();
  return count > 0;
}

// Initialize database with default project if empty
export async function initializeDatabase(): Promise<void> {
  const hasAny = await hasProjects();
  if (!hasAny) {
    await createNewProject('My First Project');
  }
}

// Export database for backup
export async function exportDatabase(): Promise<{ projects: Project[]; data: ProjectData[] }> {
  const projects = await db.projects.toArray();
  const data = await db.projectData.toArray();
  return { projects, data };
}

// Import database from backup
export async function importDatabase(backup: {
  projects: Project[];
  data: ProjectData[];
}): Promise<void> {
  await db.transaction('rw', db.projects, db.projectData, async () => {
    await db.projects.clear();
    await db.projectData.clear();
    await db.projects.bulkAdd(backup.projects);
    await db.projectData.bulkAdd(backup.data);
  });
}
