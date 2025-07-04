import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

// Load environment variables
dotenv.config();

// Import routes after dotenv config
import weatherRoutes from './routes/weather';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/weather', weatherRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 