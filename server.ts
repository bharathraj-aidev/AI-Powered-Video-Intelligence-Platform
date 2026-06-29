import express from "express";
import http from "http";
import path from "path";
import { WebSocketServer, WebSocket } from "ws";
import { GoogleGenerativeAI } from "@google/generai";
import Anthropic from "@anthropic-ai/sdk";

const app = express();
const PORT = 3000;

// Enable JSON body parsing
app.use(express.json());

// Serving the main dashboard HTML page
app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "index.html"));
});

// Mock camera definitions
const CAMERAS = [
  { id: "cam_01", name: "Main entrance" },
  { id: "cam_02", name: "Patio" },
  { id: "cam_03", name: "Camera 1" },
  { id: "cam_04", name: "Camera 2" },
  { id: "cam_05", name: "Camera 3" },
  { id: "cam_06", name: "Side entrance" },
  { id: "cam_07", name: "Garage" },
  { id: "cam_08", name: "Drive way" }
];

// Memory Data stores (Replacing async SQLite in live Node.js container)
const eventsHistory: any[] = [];
const activeRules: any[] = [];

// Fallback visual detection templates
const MOCK_SCENARIOS = [
  { desc: "No activity detected in the sector.", label: "NORMAL" },
  { desc: "Normal pedestrian movement observed.", label: "NORMAL" },
  { desc: "Staff member scanning badge at entry.", label: "NORMAL" },
  { desc: "Delivery vehicle arriving at dock area.", label: "WARNING" },
  { desc: "Unknown individual loitering near perimeter gate.", label: "WARNING" },
  { desc: "Brief flicker or static interference in feed.", label: "WARNING" },
  { desc: "Unauthorized personnel entering high security zone.", label: "CRITICAL" }
];
