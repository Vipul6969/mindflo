import { useEffect, useState, useCallback } from 'react';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import {
  Users,
  Brain,
  Mic,
  LayoutTemplateIcon as Template,
  Fingerprint,
  Network,
  Lightbulb,
  ArrowRightCircle,
} from 'lucide-react';
import { useRouter } from 'next/router';

import { socket } from '@/common/lib/socket';
import { useSetRoomId } from '@/common/recoil/room';
import { useModal } from '@/modules/modal';

import NotFoundModal from '../modals/NotFound';
import { HolographicText } from './holographic_text';
import { LiquidBlob } from './liquid_blob';
import { NeuralNode } from './neural_node';
import { ParticleSystem } from './particle_system';

const Home = () => {
  const { openModal } = useModal();
  const setAtomRoomId = useSetRoomId();

  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isClicked, setClicked] = useState(false);

  const router = useRouter();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const { clientX, clientY } = e;
      mouseX.set(clientX);
      mouseY.set(clientY);
    },
    [mouseX, mouseY]
  );

  useEffect(() => {
    socket.emit('leave_room');
    setAtomRoomId('');
  }, [setAtomRoomId]);

  useEffect(() => {
    socket.on('created', (roomIdFromServer) => {
      setAtomRoomId(roomIdFromServer);
      router.push(roomIdFromServer);
    });

    const handleJoinedRoom = (roomIdFromServer: string, failed?: boolean) => {
      setIsLoading(false);
      if (!failed) {
        setAtomRoomId(roomIdFromServer);
        router.push(roomIdFromServer);
      } else {
        openModal(<NotFoundModal id={roomId} />);
      }
    };

    socket.on('joined', handleJoinedRoom);

    return () => {
      socket.off('created');
      socket.off('joined', handleJoinedRoom);
    };
  }, [openModal, roomId, router, setAtomRoomId]);

  useEffect(() => {
    document.body.style.backgroundColor = '#000000';
    document.body.style.overflow = 'hidden';
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.style.overflow = 'auto';
    };
  }, [handleMouseMove]);

  const handleCreateRoom = () => {
    socket.emit('create_room', username);
  };

  const handleJoinRoom = () => {
    if (roomId && username) {
      const userId = crypto.randomUUID();
      socket.emit('join_room', {
        boardId: roomId,
        userId,
        username,
      });
    }
  };

  const features = [
    {
      icon: Brain,
      title: 'AI',
      desc: 'AI-powered intelligence',
      color: 'from-cyan-400 to-blue-500',
    },
    {
      icon: Mic,
      title: 'Voice Synthesis',
      desc: 'Natural language processing',
      color: 'from-purple-400 to-pink-500',
    },
    {
      icon: Template,
      title: 'Morphic Templates',
      desc: 'Adaptive design systems',
      color: 'from-green-400 to-emerald-500',
    },
    {
      icon: Users,
      title: 'Sync',
      desc: 'Instantaneous collaboration',
      color: 'from-orange-400 to-red-500',
    },
  ];

  // Neural network nodes positions
  const neuralNodes = Array.from({ length: 50 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    size: Math.random() * 6 + 2,
  }));

  return (
    <div className="relative min-h-screen overflow-hidden bg-black font-['Inter_Variable',_'SF_Pro_Display',_system-ui,_sans-serif]">
      {/* Advanced Particle System */}
      <ParticleSystem />

      {/* Neural Network Background */}
      <div className="absolute inset-0 opacity-20">
        {neuralNodes.map((node) => (
          <NeuralNode key={node.x} {...node} />
        ))}

        {/* Neural connections */}
        <svg className="absolute inset-0 h-full w-full">
          {neuralNodes.slice(0, 20).map((node, i) => {
            const nextNode = neuralNodes[(i + 1) % neuralNodes.length];
            return (
              <motion.line
                key={i}
                x1={`${node.x}%`}
                y1={`${node.y}%`}
                x2={`${nextNode.x}%`}
                y2={`${nextNode.y}%`}
                stroke="url(#neuralGradient)"
                strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.3 }}
                transition={{ duration: 2, delay: i * 0.1 }}
              />
            );
          })}
          <defs>
            <linearGradient
              id="neuralGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#00f5ff" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Liquid Background Blobs */}
      <div className="absolute inset-0">
        <LiquidBlob
          className="top-1/4 left-1/4 h-96 w-96 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 blur-3xl"
          delay={0}
        />
        <LiquidBlob
          className="bottom-1/4 right-1/4 h-80 w-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl"
          delay={2}
        />
        <LiquidBlob
          className="top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500/5 to-green-500/5 blur-3xl"
          delay={4}
        />
      </div>

      {/* Interactive Mouse Follower */}
      <motion.div
        className="pointer-events-none fixed z-50 h-8 w-8 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 opacity-50 blur-sm"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        {/* Revolutionary Header */}
        <motion.div
          initial={{ opacity: 0, y: -100, rotateX: 90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-20 text-center"
        >
          {/* Main Logo with 3D Effect */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotateY: -180 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ duration: 1.5, delay: 0.3, ease: 'backOut' }}
            className="mb-8 flex transform-gpu items-center justify-center"
          >
            <div>
              <HolographicText className="font-black tracking-tighter">
                MindFlo.ai
              </HolographicText>
            </div>
          </motion.div>

          {/* Subtitle with Typewriter Effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mb-12"
          >
            <p className="mb-4 bg-gradient-to-r from-gray-300 via-white to-gray-300 bg-clip-text text-2xl font-light text-transparent md:text-3xl">
              AI-Powered Collaborative Intelligence
            </p>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-400">
              Experience the future of whiteboarding with AI, real-time
              synchronization, and morphic design systems
            </p>
          </motion.div>

          {/* Advanced Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mx-auto mb-16 grid max-w-6xl grid-cols-2 gap-4 md:grid-cols-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30, rotateX: 45 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  delay: 1.3 + index * 0.1,
                  duration: 0.6,
                  ease: 'backOut',
                }}
                whileHover={{
                  scale: 1.05,
                  y: -10,
                  rotateY: 5,
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                }}
                className="group relative transform-gpu rounded-3xl border border-white/20 bg-gradient-to-br from-white/5 to-white/10 p-6 text-center backdrop-blur-xl transition-all duration-500 hover:border-white/40"
              >
                {/* Feature Icon with Glow */}
                <motion.div
                  className={`mx-auto mb-4 h-12 w-12 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <feature.icon className="h-6 w-6 text-white" />
                </motion.div>

                <h3 className="mb-2 text-sm font-bold text-white transition-colors group-hover:text-cyan-300">
                  {feature.title}
                </h3>
                <p className="text-xs leading-relaxed text-gray-400 transition-colors group-hover:text-gray-300">
                  {feature.desc}
                </p>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/0 to-purple-500/0 transition-all duration-500 group-hover:from-cyan-500/10 group-hover:to-purple-500/10" />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Revolutionary Form Interface */}
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: 'backOut' }}
          className="w-full max-w-lg"
        >
          {/* Quantum Glass Card */}
          <div className="relative rounded-[2rem] border border-white/30 bg-gradient-to-br from-white/10 via-white/5 to-white/10 p-10 shadow-2xl backdrop-blur-2xl">
            {/* Animated Border */}
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-cyan-500/50 via-purple-500/50 to-pink-500/50 opacity-0 blur-sm transition-opacity duration-500 group-hover:opacity-100" />

            {/* Username Input */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="mb-10"
            >
              <label className="mb-4 flex items-center text-sm font-bold uppercase tracking-[0.2em] text-white">
                <Fingerprint className="mr-2 h-4 w-4 text-cyan-400" />
                Identity
              </label>
              <input
                className="w-full rounded-2xl border border-white/30 bg-gradient-to-r from-white/5 to-white/10 px-6 py-5 text-lg font-medium backdrop-blur-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="relative mb-4 rounded-3xl bg-gradient-to-r from-white/5 to-white/10 p-2 backdrop-blur-sm"
            >
              <div className="relative flex w-full">
                {/* Sliding Indicator */}
                <motion.div
                  className="absolute inset-y-0 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 shadow-lg"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />

                {/* Create Workspace */}
                <button
                  onClick={() => {
                    handleCreateRoom();
                  }}
                  disabled={!username.trim() || isLoading}
                  className="relative z-10 flex flex-1 items-center justify-center rounded-2xl py-4 px-6 text-sm font-bold transition-all duration-300"
                >
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Create Workspace
                </button>

                {/* Join Workspace */}
                <button
                  onClick={() => {
                    setClicked(true);
                  }}
                  className="relative z-10 flex flex-1 items-center justify-center rounded-2xl py-4 px-6 text-sm font-bold transition-all duration-300"
                >
                  <Network className="mr-2 h-4 w-4" />
                  Join Workspace
                </button>
              </div>
            </motion.div>

            {isClicked && (
              <motion.div
                key="join"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-4 space-y-4"
              >
                <div className="relative">
                  <label className="mb-2 block font-bold text-white">
                    Workspace ID
                  </label>
                  <div className="relative flex items-center">
                    <input
                      className="w-full rounded-2xl border border-white/30 bg-gradient-to-r from-white/5 to-white/10 px-6 py-5 pr-14 text-lg font-medium backdrop-blur-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value)}
                      placeholder="Enter workspace ID"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setIsLoading(true);
                        handleJoinRoom();
                      }}
                      className="absolute top-1/2 right-4 -translate-y-1/2 text-cyan-400 transition-all hover:text-cyan-300"
                    >
                      <ArrowRightCircle className=" align-middle" />
                    </button>

                    {/* Icon Button (redirect trigger) */}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
