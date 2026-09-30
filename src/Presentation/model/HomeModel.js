import { getDatabase, ref, get } from "firebase/database";
import homeVideo1 from "../Assets/R/video_1.mp4";
import homeVideo2 from "../Assets/R/video_2.mp4";
import homeVideo3 from "../Assets/R/video_3.mp4";

const PROJECTS_STORAGE_KEY = "projects";
const HOME_VIDEO_SEQUENCE = [homeVideo1, homeVideo2, homeVideo3];

// Helper: Convertir Firebase object indexado a array
const convertToArray = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === "object") {
        return Object.values(data);
    }
    return [];
};

const normalizeMediaUrl = (media) => {
    if (!media) return null;
    if (typeof media === "string") return media.trim();
    if (typeof media === "object") {
        if (typeof media.url === "string" && media.url.trim())
            return media.url.trim();
        if (typeof media.src === "string" && media.src.trim())
            return media.src.trim();
    }
    return null;
};

export const normalizeMediaList = (mediaList) => {
    if (!Array.isArray(mediaList)) return [];

    return mediaList.map((media) => normalizeMediaUrl(media)).filter(Boolean);
};

export const normalizeProjectList = (projects) => {
    if (!Array.isArray(projects)) return [];

    return projects.map((project) => ({
        ...project,
        images: Array.isArray(project.images)
            ? project.images.map((image) => {
                if (typeof image === "string") return image;
                if (image && typeof image === "object")
                    return image.url || image.src || image;
                return image;
            })
            : [],
        videos: normalizeMediaList(project.videos || []),
    }));
};

export const getProjectVideoUrls = (projects) =>
    (projects || []).flatMap((project) =>
        normalizeMediaList(project.videos || []),
    );

export const getOrderedVideoSequence = () => HOME_VIDEO_SEQUENCE;

/**
 * Loads the projects list from localStorage if present, otherwise fetches from Firebase Realtime Database.
 * @returns {Promise<Array>} Array of project objects.
 */
export async function loadProjects() {
    const storedProjects = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (storedProjects) {
        try {
            const parsedProjects = JSON.parse(storedProjects);
            return normalizeProjectList(parsedProjects);
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
        images: convertToArray(projectData[key].images).map((image) => {
            if (typeof image === "string") return image;
            if (image && typeof image === "object")
                return image.url || image.src || image;
            return image;
        }),
        videos: normalizeMediaList(convertToArray(projectData[key].videos)),
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
    const orderedVideos = getOrderedVideoSequence(projects);
    return orderedVideos.length > 0 ? orderedVideos[0] : null;
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
