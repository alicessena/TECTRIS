export const W = 10, H = 20;
export type Cell = string | null;
export type Board = Cell[][];
export type Piece = { shape: number[][]; color: string; x: number; y: number };
export type Player = { board: Board; piece: Piece; next: Piece; score: number; lines: number; level: number; drop: number; elapsed: number; penalty: number; over: boolean };
const shapes = [
  [[1,1,1,1]], [[1,1],[1,1]], [[0,1,0],[1,1,1]], [[0,1,1],[1,1,0]],
  [[1,1,0],[0,1,1]], [[1,0,0],[1,1,1]], [[0,0,1],[1,1,1]],
];
const colors = ['#00f5ff','#ffe600','#d946ef','#19f58a','#ff4268','#4387ff','#ff9d38'];
export const emptyBoard = (): Board => Array.from({ length: H }, () => Array<Cell>(W).fill(null));
export function randomPiece(): Piece { const i = Math.floor(Math.random()*shapes.length); const shape = shapes[i].map(row => [...row]); return { shape, color: colors[i], x: Math.floor((W-shape[0].length)/2), y: 0 }; }
export function newPlayer(): Player { return { board: emptyBoard(), piece: randomPiece(), next: randomPiece(), score: 0, lines: 0, level: 1, drop: 1, elapsed: 0, penalty: 4, over: false }; }
export function collides(p: Player, dx=0, dy=0, shape=p.piece.shape): boolean { return shape.some((row, y) => row.some((v,x) => v && (p.piece.x+x+dx<0 || p.piece.x+x+dx>=W || p.piece.y+y+dy>=H || (p.piece.y+y+dy>=0 && p.board[p.piece.y+y+dy][p.piece.x+x+dx])))); }
function topOut(p: Player): boolean { return p.board.slice(0,p.penalty).some(row => row.some(Boolean)); }
function spawn(p: Player): Player { const next = p.next; const n = { ...p, piece: next, next: randomPiece() }; if(collides(n)) n.over=true; return n; }
export function move(p: Player, dx: number, dy=0): Player { if(p.over || collides(p,dx,dy)) return p; return { ...p, piece: { ...p.piece, x:p.piece.x+dx, y:p.piece.y+dy } }; }
export function rotate(p: Player): Player { const h=p.piece.shape.length,w=p.piece.shape[0].length; const shape=Array.from({length:w},(_,x)=>Array.from({length:h},(_,y)=>p.piece.shape[h-1-y][x])); for(const kick of [0,-1,1,-2,2]) if(!collides(p,kick,0,shape)) return {...p,piece:{...p.piece,shape,x:p.piece.x+kick}}; return p; }
function clearRows(board: Board): {board:Board;count:number} { const rows=board.filter(row=>!row.every(Boolean)); const count=H-rows.length; return {board:[...Array.from({length:count},()=>Array<Cell>(W).fill(null)),...rows],count}; }
export function lock(p: Player): Player { const board=p.board.map(row=>[...row]); p.piece.shape.forEach((r,y)=>r.forEach((v,x)=>{if(v && p.piece.y+y>=0) board[p.piece.y+y][p.piece.x+x]=p.piece.color;})); let n={...p,board}; if(topOut(n)) return {...n,over:true}; const cleared=clearRows(board); n={...n,board:cleared.board}; if(cleared.count){const pts=[0,100,300,500,800]; n.score+= (pts[Math.min(cleared.count,4)]??800)*n.level; n.lines+=cleared.count; n.level=1+Math.floor(n.lines/10); n.drop=Math.pow(.85,n.level-1);} return spawn(n); }
export function tick(p: Player, dt: number): Player { if(p.over)return p; const elapsed=p.elapsed+dt; if(elapsed<p.drop)return {...p,elapsed}; const fallen=move({...p,elapsed:0},0,1); return fallen===p || (fallen.piece.y===p.piece.y && collides(p,0,1)) ? lock({...p,elapsed:0}) : fallen; }
export function hardDrop(p: Player): Player { let n=p; while(!collides(n,0,1)) n={...n,piece:{...n.piece,y:n.piece.y+1}}; return lock(n); }
export function penalty(p: Player): Player { const hole=Math.floor(Math.random()*W); const board=[...p.board.slice(1).map(row=>[...row]),Array.from({length:W},(_,x)=>x===hole?null:'#646464')]; const n={...p,board,penalty:Math.min(H-2,p.penalty+1)}; return topOut(n)?{...n,over:true}:n; }
export function relieve(p: Player): Player { return {...p,penalty:Math.max(2,p.penalty-1)}; }
export function boardWithPiece(p: Player): Board { const board=p.board.map(row=>[...row]); p.piece.shape.forEach((r,y)=>r.forEach((v,x)=>{const by=p.piece.y+y,bx=p.piece.x+x;if(v&&by>=0&&by<H&&bx>=0&&bx<W)board[by][bx]=p.piece.color;})); return board; }
