import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { randomUUID } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { mkdirSync } from 'node:fs';

const file = resolve(process.env.DATABASE_PATH ?? 'data/tectris.sqlite');
mkdirSync(dirname(file), { recursive: true });
const db = new Database(file);
db.pragma('journal_mode = WAL');
db.exec(`CREATE TABLE IF NOT EXISTS matches (
 id TEXT PRIMARY KEY, mode TEXT NOT NULL, players TEXT NOT NULL, score INTEGER NOT NULL,
 lines INTEGER NOT NULL, level INTEGER NOT NULL, result TEXT NOT NULL, played_at TEXT NOT NULL
)`);
const app = express();
app.use(cors()); app.use(express.json({ limit: '16kb' }));
app.get('/api/health', (_req,res)=>res.json({ok:true}));
app.get('/api/history', (req,res)=>{
  const mode = typeof req.query.mode==='string'?req.query.mode:undefined;
  const rows = mode ? db.prepare('SELECT * FROM matches WHERE mode=? ORDER BY played_at DESC LIMIT 200').all(mode) : db.prepare('SELECT * FROM matches ORDER BY played_at DESC LIMIT 200').all();
  res.json(rows.map((row:any)=>({...row, players:JSON.parse(row.players)})));
});
app.post('/api/history', (req,res)=>{
  const {mode='solo-c',players=['Jogador'],score,lines,level,result='Fim de jogo',playedAt=new Date().toISOString()}=req.body??{};
  if(!['solo-c','solo-easy','duel-c','duel-easy','classic','easy','local-duel'].includes(mode)||!Array.isArray(players)||players.length<1||players.length>2||players.some((p:unknown)=>typeof p!=='string'||p.trim().length>30)||![score,lines,level].every(Number.isInteger)||score<0||lines<0||level<1||typeof result!=='string') return res.status(400).json({error:'Dados da partida inválidos.'});
  const match={id:randomUUID(),mode,players:players.map((p:string)=>p.trim()||'Jogador'),score,lines,level,result:result.slice(0,50),played_at:new Date(playedAt).toISOString()};
  db.prepare('INSERT INTO matches (id,mode,players,score,lines,level,result,played_at) VALUES (@id,@mode,@players,@score,@lines,@level,@result,@played_at)').run({...match,players:JSON.stringify(match.players)});
  res.status(201).json({...match,playedAt:match.played_at});
});
app.get('/api/stats', (_req,res)=>{
 const rows=db.prepare('SELECT score,lines,level FROM matches').all() as {score:number;lines:number;level:number}[];
 if(!rows.length)return res.json({totalMatches:0,averageScore:0,bestScore:0,worstScore:0,standardDeviation:0,totalLines:0});
 const scores=rows.map(x=>x.score),averageScore=scores.reduce((a,b)=>a+b,0)/scores.length;
 res.json({totalMatches:rows.length,averageScore,bestScore:Math.max(...scores),worstScore:Math.min(...scores),standardDeviation:Math.sqrt(scores.reduce((a,b)=>a+(b-averageScore)**2,0)/Math.max(1,scores.length-1)),totalLines:rows.reduce((a,b)=>a+b.lines,0)});
});
const port=Number(process.env.PORT??3001); app.listen(port,'0.0.0.0',()=>console.log(`TECTRIS API listening on ${port}`));
