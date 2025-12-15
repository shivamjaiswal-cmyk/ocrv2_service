import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
import dotenv from 'dotenv';
import path from 'path';

// Load env before other imports might use it
dotenv.config({ path: path.resolve(__dirname, '../../.env') }); // It might be in server/ root, check paths

import { ocrController } from './controllers/ocrController';

const app = express();
const port = process.env.PORT || 3001; // Default to 3001 to avoid React conflict

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// File Upload
const upload = multer({ dest: 'uploads/' });

// Routes
app.get('/health', (req, res) => res.send('OCR Service Backend is Healthy'));

// Config APIs
app.get('/api/ocr/config', (req, res) => ocrController.getConfig(req, res));
app.post('/api/ocr/config', (req, res) => ocrController.saveConfig(req, res));
app.get('/api/ocr/configs', (req, res) => ocrController.listConfigs(req, res));

// OCR APIs
app.post('/api/ocr/test', upload.single('file'), (req, res) => ocrController.runTest(req, res));
app.post('/api/ocr/process-document', upload.single('file'), (req, res) => ocrController.processDocument(req, res));

// Start
app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
});
