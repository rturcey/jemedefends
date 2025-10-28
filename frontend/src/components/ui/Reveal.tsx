'use client';
import {motion, useReducedMotion} from 'framer-motion';
import * as React from 'react';

interface RevealProps extends React.PropsWithChildren {
    delay?: number;
    y?: number;
    /**
     * Si true, le contenu est visible immédiatement (pas d'animation)
     * Utile pour le contenu above-the-fold
     */
    immediate?: boolean;
}

function Reveal({children, delay = 0, y = 16, immediate = false}: RevealProps) {
    const reduce = useReducedMotion();

    // Si immediate ou reduced motion, pas d'animation
    if (immediate || reduce) {
        return <>{children}</>;
    }

    return (
        <motion.div
            initial={{opacity: 0, y}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{
                once: true,
                amount: 0.1, // Réduit de 0.2 à 0.1 pour trigger plus tôt
                margin: '0px 0px -100px 0px', // Trigger avant que l'élément soit visible
            }}
            transition={{
                duration: 0.3, // Réduit de 0.5 à 0.3 pour plus de rapidité
                delay: Math.min(delay, 0.3), // Limite le délai max à 0.3s
                ease: 'easeOut',
            }}
        >
            {children}
        </motion.div>
    );
}

export default Reveal;
