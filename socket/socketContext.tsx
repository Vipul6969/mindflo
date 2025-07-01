import React, { createContext, useContext } from 'react';

import type { Socket } from 'socket.io-client';

import socket from './socket';

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
);
