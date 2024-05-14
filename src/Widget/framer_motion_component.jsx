import { motion } from "framer-motion";
import React from "react";

const Framer_motion_component = () => {
  return (
    <>
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        style={{ color: 'red' }} // Aplica color directamente al estilo del div
      >
        <h1>Hola, mundo!</h1>
      </motion.div>
    </>
  );
};

export default Framer_motion_component;
