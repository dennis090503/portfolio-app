import { motion } from 'framer-motion';

export default function SectionHeading({ eyebrow, title, align = 'left' }) {
  const words = title.split(' ');

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.08 },
    },
  };

  const word = {
    hidden: { opacity: 0, y: 24, rotateX: -40 },
    show: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div className={align === 'center' ? 'text-center' : 'text-left'}>
      {eyebrow && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-accent text-sm font-medium tracking-[0.2em] uppercase mb-3"
        >
          {eyebrow}
        </motion.p>
      )}
      <motion.h2
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="text-4xl md:text-6xl font-bold tracking-tight flex flex-wrap gap-x-4"
        style={{ perspective: 800 }}
      >
        {words.map((w, i) => (
          <motion.span key={i} variants={word} className="inline-block">
            {w}
          </motion.span>
        ))}
      </motion.h2>
    </div>
  );
}