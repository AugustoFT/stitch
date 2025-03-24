
import React from 'react';
import { motion } from 'framer-motion';
import { Palmtree, Sun, Flower, Umbrella, Sailboat, Waves } from 'lucide-react';

const BackgroundElements: React.FC = () => {
  const floralVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 0.8, scale: 1, transition: { duration: 0.8 } }
  };

  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div 
          className="absolute top-0 left-0 w-full h-full opacity-[0.03]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.03 }}
          transition={{ duration: 2 }}
        >
          <Palmtree className="absolute top-[10%] left-[5%] text-stitch-teal w-40 h-40" />
          <Palmtree className="absolute top-[15%] right-[8%] text-stitch-teal w-32 h-32" />
          <Sun className="absolute top-[30%] left-[20%] text-stitch-yellow w-24 h-24" />
          <Umbrella className="absolute bottom-[20%] left-[15%] text-stitch-pink w-32 h-32" />
          <Sailboat className="absolute bottom-[25%] right-[10%] text-stitch-blue w-32 h-32" />
          <Waves className="absolute bottom-[5%] left-0 right-0 text-stitch-blue w-full h-16" />
          <Flower className="absolute top-[40%] right-[25%] text-stitch-pink w-20 h-20" />
          <Flower className="absolute bottom-[40%] left-[30%] text-stitch-yellow w-16 h-16" />
        </motion.div>
      </div>
      
      <motion.div 
        className="absolute top-20 left-0 text-stitch-teal/20 transform -rotate-12 z-0"
        variants={floralVariants}
        initial="hidden"
        animate="visible"
      >
        <Palmtree size={120} />
      </motion.div>
      
      <motion.div 
        className="absolute top-40 right-0 text-stitch-yellow/20 transform rotate-12 z-0"
        variants={floralVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
      >
        <Sun size={100} />
      </motion.div>
      
      <motion.div 
        className="absolute bottom-40 left-10 text-stitch-pink/20 transform -rotate-6 z-0"
        variants={floralVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.5 }}
      >
        <Flower size={80} />
      </motion.div>
    </>
  );
};

export default BackgroundElements;
