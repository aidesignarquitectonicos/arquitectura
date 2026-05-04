/* eslint-disable react/jsx-pascal-case */
import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../Data/FirebaseConfig";
import HomeView from "./HomeView";
import { loadProjects, pickRandomProjects, pickRandomVideo } from "../../model/HomeModel";

const Home = () => {
    const url = "https://aidesignarquitectonicos.github.io/arquitectura/";

    const [openQr, setOpenQr] = useState(false);
    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState([]);
    const [currentVideo, setCurrentVideo] = useState(null);
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
            setProjects(loadedProjects);
            setCurrentVideo(pickRandomVideo(loadedProjects));
            setRandomProjects(pickRandomProjects(loadedProjects));
        };

        fetchProjectVideos();
    }, []);

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
        />
    );
};

export default Home;
