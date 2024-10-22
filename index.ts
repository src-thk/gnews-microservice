import express from 'express';
import cors from 'cors';

const googleNewsScraper = require('google-news-scraper');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

const getResultsFromScraper = async (query: string) => {
    return await googleNewsScraper({
        searchTerm: query, puppeteerArgs: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ],
    });
};

app.get('/search/:query', async (req: { params: { query: any; }; }, res: { json: (arg0: any) => void; status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string; }): void; new(): any; }; }; }) => {
    const query = req.params.query;
    try {
        const data = await getResultsFromScraper(query);
        res.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: '503!' });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
