import { RgbaColor } from 'react-colorful';

export type Shape = 'line' | 'circle' | 'rect' | 'image';
export type CtxMode = 'eraser' | 'draw' | 'select';

export interface CtxOptions {
  lineWidth: number;
  lineColor: RgbaColor;
  fillColor: RgbaColor;
  shape: Shape;
  mode: CtxMode;
  selection: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
}

export interface Move {
  // For freehand/line drawing
  path?: [number, number][];

  // For circle shape
  circle?: {
    cX: number;
    cY: number;
    radiusX: number;
    radiusY: number;
  };

  // For rectangle shape
  rect?: {
    width: number;
    height: number;
  };

  // For images
  img?: {
    base64: string;
  };

  // Common drawing settings
  options: CtxOptions;

  // Metadata
  timestamp?: number;
  id?: string;
}

export interface Room {
  usersMoves: Map<string, Move[]>;
  drawed: Move[];
  users: Map<string, string>;
}

export interface User {
  name: string;
  color: string;
}

export interface ClientRoom {
  id: string;
  usersMoves: Map<string, Move[]>;
  movesWithoutUser: Move[];
  myMoves: Move[];
  users: Map<string, User>;
}

export interface MessageType {
  userId: string;
  username: string;
  color: string;
  msg: string;
  id: number;
}

export interface ServerToClientEvents {
  room_exists: (exists: boolean) => void;
  joined: (roomId: string, failed?: boolean) => void;
  room: (room: Room, usersMovesToParse: string, usersToParse: string) => void;
  created: (roomId: string) => void;
  your_move: (move: Move) => void;
  user_draw: (move: Move, userId: string) => void;
  user_undo: (userId: string) => void;
  mouse_moved: (x: number, y: number, userId: string) => void;
  new_user: (userId: string, username: string) => void;
  user_disconnected: (userId: string) => void;
  new_msg: (userId: string, msg: string) => void;
}

export interface ClientToServerEvents {
  check_room: (roomId: string) => void;
  create_room: (username: string) => void;
  join_room: (data: {
    boardId: string;
    userId: string;
    username: string;
  }) => void;
  joined_room: () => void;
  draw: (move: Move) => void;
  undo: () => void;
  mouse_move: (x: number, y: number) => void;
  send_msg: (msg: string) => void;
  leave_room: () => void;
}
