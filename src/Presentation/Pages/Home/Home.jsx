/* eslint-disable react/jsx-pascal-case */
import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../Data/FirebaseConfig";
import HomeView from "./HomeView";
import {
    loadProjects,
    pickRandomProjects,
    pickRandomVideo,
    getOrderedVideoSequence,
} from "../../model/HomeModel";

const Home = () => {
    const url = "https://aidesignarquitectonicos.github.io/arquitectura/";

    const [openQr, setOpenQr] = useState(false);
    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState([]);
    const [currentVideo, setCurrentVideo] = useState(null);
    const [videoPlaylist, setVideoPlaylist] = useState([]);
    const [randomProjects, setRandomProjects] = useState([]);

    const navigate = useNavigate();

    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                console.log("Cierre de sesión exitoso");
                navigate("/");
            })
            .catch((error) => {
                console.error("Error al cerrar sesión", error);
            });
    };

    const isAuthenticated = !!user;

    useEffect(() => {
        const fetchProjectVideos = async () => {
            const loadedProjects = await loadProjects();
            const playlist = getOrderedVideoSequence();
            setProjects(loadedProjects);
            setVideoPlaylist(playlist);
            setCurrentVideo(playlist[0] || null);
            setRandomProjects(pickRandomProjects(loadedProjects));
        };

        fetchProjectVideos();
    }, []);

    const handleVideoEnded = () => {
        if (videoPlaylist.length <= 1) return;

        setCurrentVideo((prevVideo) => {
            const currentIndex = videoPlaylist.indexOf(prevVideo);
            const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % videoPlaylist.length : 0;
            return videoPlaylist[nextIndex];
        });
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return unsubscribe;
    }, []);

    const handleNavigate = (path) => {
        navigate(path);
    };

    const handleNavigateToProject = (projectId) => {
        navigate(`/project/${projectId}`);
    };

    return (
        <HomeView
            url={url}
            openQr={openQr}
            setOpenQr={setOpenQr}
            isAuthenticated={isAuthenticated}
            user={user}
            currentVideo={currentVideo}
            randomProjects={randomProjects}
            onSignOut={handleSignOut}
            onNavigate={handleNavigate}
            onNavigateProject={handleNavigateToProject}
            onVideoEnded={handleVideoEnded}
        />
    );
};

export default Home;
