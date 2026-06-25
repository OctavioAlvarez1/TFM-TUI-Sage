import Box from '@mui/material/Box';
import { motion } from 'framer-motion';

export default function LoadingDots() {
  return (
    <Box display="flex" gap={0.6} alignItems="center" py={0.5}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
          style={{
            display: 'block',
            width: 7,
            height: 7,
            borderRadius: '50%',
            backgroundColor: '#10B981',
            opacity: 0.8,
          }}
        />
      ))}
    </Box>
  );
}
