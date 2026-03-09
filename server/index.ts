import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer';

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const HOST = '0.0.0.0'; // Permet d'accéder au serveur depuis téléphone/tablette

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Pour recevoir du HTML volumineux

// Route pour générer un PDF à partir de HTML
app.post('/generate-pdf', async (req, res) => {
  const { html, filename } = req.body;

  // Vérifie si le HTML est fourni
  if (!html) {
    res.status(400).json({ error: 'html manquant' });
    return;
  }

  let browser;
  try {
    // Lance Puppeteer (version navigateur sans interface)
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    const page = await browser.newPage();

    // Charge le HTML dans la page
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Attend que toutes les polices soient chargées
    await page.evaluateHandle('document.fonts.ready');

    // Génère le PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true, // Garde les couleurs de fond
      margin: { top: '0', right: '0', bottom: '0', left: '0' }, // Pas de marges
    });

    // Envoie le PDF en réponse
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${filename ?? 'cv.pdf'}"`
    );
    res.end(pdfBuffer);

  } catch (err) {
    console.error('Erreur Puppeteer:', err);
    res.status(500).json({ error: 'Échec de la génération PDF' });
  } finally {
    // Ferme le navigateur dans tous les cas
    if (browser) await browser.close();
  }
});

// Route simple pour vérifier que le serveur tourne
app.get('/health', (_req, res) => res.json({ ok: true }));

// Démarre le serveur
app.listen(PORT, HOST, () => {
  console.log(`✅ Serveur PDF prêt sur http://192.168.100.69:${PORT}/`);
});