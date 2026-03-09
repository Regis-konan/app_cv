/**
 * Convertit TOUJOURS l'image en JPEG RGB propre via canvas.
 * Même les JPEG natifs peuvent avoir des profils ICC/CMYK qui rendent
 * l'image sombre ou déformée dans react-pdf.
 */
export async function prepareImageForPdf(
  dataUrl: string | undefined
): Promise<string | undefined> {
  if (!dataUrl) return undefined;

  // URL distante → on laisse react-pdf la gérer directement
  if (dataUrl.startsWith('http://') || dataUrl.startsWith('https://')) {
    return dataUrl;
  }

  if (!dataUrl.startsWith('data:image/')) return undefined;

  // ✅ On passe TOUJOURS par canvas → JPEG RGB propre, sans profil ICC
  try {
    return await convertToJpegAsync(dataUrl);
  } catch {
    return undefined;
  }
}

function convertToJpegAsync(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') {
      reject(new Error('No DOM'));
      return;
    }

    const img = new window.Image();

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width  = img.naturalWidth  || 400;
        canvas.height = img.naturalHeight || 400;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('No canvas context')); return; }

        // ✅ Fond blanc obligatoire (évite le noir sur zones transparentes)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        resolve(canvas.toDataURL('image/jpeg', 0.92));
      } catch (e) {
        reject(e);
      }
    };

    img.onerror = () => reject(new Error('Image load failed'));
    // ✅ crossOrigin pour éviter les erreurs CORS sur les blob URLs
    img.crossOrigin = 'anonymous';
    img.src = dataUrl;
  });
}

export function formatDate(d: string): string {
  if (!d) return '';
  const [y, m] = d.split('-');
  const months = ['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Aoû','Sep','Oct','Nov','Déc'];
  return `${months[parseInt(m) - 1] ?? ''} ${y}`;
}

export function langLevelWidth(level: string): string {
  const map: Record<string, string> = {
    Débutant: '20%', Intermédiaire: '40%', Avancé: '60%', Courant: '80%', Natif: '100%',
  };
  return map[level] ?? '50%';
}

export function getInitials(firstName?: string, lastName?: string): string {
  return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
}

export function sanitizeForPdf(text: string): string {
  if (!text) return '';
  return text.replace(/[<>]/g, '').replace(/&/g, '&amp;').trim();
}

export function truncateForPdf(text: string, maxLength = 500): string {
  if (!text) return '';
  return text.length <= maxLength ? text : text.substring(0, maxLength).trim() + '...';
}