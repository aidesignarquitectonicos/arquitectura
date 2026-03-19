import { getDatabase, ref, get } from "firebase/database";
import { sample } from "lodash";

const PROJECTS_STORAGE_KEY = "projects";

/**
 * Loads the projects list from localStorage if present, otherwise fetches from Firebase Realtime Database.
 * @returns {Promise<Array>} Array of project objects.
 */
export async function loadProjects() {
    const storedProjects = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (storedProjects) {
        try {
            return JSON.parse(storedProjects);
        } catch (e) {
            console.error("Error parsing stored projects", e);
        }
    }

    const database = getDatabase();
    const projectRef = ref(database, "Projects");
    const snapshot = await get(projectRef);

    if (!snapshot.exists()) {
        console.log("No se encontró el proyecto.");
        return [];
    }

    const projectData = snapshot.val();
    const updatedProjects = Object.keys(projectData).map((key) => ({
        uuid: key,
        ...projectData[key],
    }));

    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updatedProjects));

    return updatedProjects;
}

/**
 * Returns a random video URL from the list of projects.
 * @param {Array} projects
 * @returns {string|null}
 */
export function pickRandomVideo(projects) {
    const allVideos = projects.flatMap((project) => project.videos || []);
    if (allVideos.length === 0) return null;
    return sample(allVideos);
}

/**
 * Returns up to `count` random projects from the list.
 * @param {Array} projects
 * @param {number} count
 */
export function pickRandomProjects(projects, count = 3) {
    if (!Array.isArray(projects) || projects.length === 0) return [];

    const shuffled = [...projects].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}
