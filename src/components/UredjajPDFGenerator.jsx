import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';

export default function GrupaPDFGenerator({ uredjaj, kategorija, status }) {

    const fetchFontAsBase64 = async (url) => {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Font nije pronađen: ${url}`);
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(blob);
        });
    };

    const generirajPDF = async () => {
        const [regBase64, boldBase64] = await Promise.all([
            fetchFontAsBase64('/fonts/Roboto-Regular.ttf'),
            fetchFontAsBase64('/fonts/Roboto-Bold.ttf')
        ]);

        const doc = new jsPDF();

        // 2. Registracija REGULAR verzije
        doc.addFileToVFS('Roboto-Regular.ttf', regBase64);
        doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');

        // 3. Registracija BOLD verzije
        // Ključno: isto ime 'Roboto', ali stil 'bold'
        doc.addFileToVFS('Roboto-Bold.ttf', boldBase64);
        doc.addFont('Roboto-Bold.ttf', 'Roboto', 'bold');

        // 4. Postavi defaultni font
        doc.setFont('Roboto', 'normal');
        // Dodaj logo - konvertiraj SVG u tekst (jednostavna verzija)
        doc.setFontSize(20);
        doc.setTextColor(105, 105, 105); 
        doc.text('Tvrtka d.o.o.', 20, 20);

        // Naslov dokumenta
        doc.setFont('Roboto', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text(`KARTICA UREĐAJA - ${uredjaj.model}, sn: ${uredjaj.serijskiBroj}`, 20, 45);

        // Linija ispod naslova
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.5);
        doc.line(20, 48, 190, 48);

        let yPosition = 60;

        // Podaci o uređaju
        doc.setFontSize(18);
        doc.setFont('Roboto', 'bold');
        doc.text('Podaci o uređaju:', 20, yPosition);
        yPosition += 15;

        doc.setFontSize(14);
        
        doc.text(`MODEL:  `, 25, yPosition)
        doc.setFont('Roboto', 'normal');
        doc.text(`${uredjaj.model}`, 65, yPosition)
        yPosition += 10;

        doc.setFont('Roboto', 'bold');
        doc.text(`SERIJSKI BROJ:`, 25, yPosition);
        doc.setFont('Roboto', 'regular');
        doc.text(`${uredjaj.serijskiBroj}`, 65, yPosition);
        yPosition += 15;

        doc.setFont('Roboto', 'bold');
        doc.text(`KATEGORIJA:`, 25, yPosition);
        doc.setFont('Roboto', 'regular');
        doc.text(`${kategorija.naziv}`, 65, yPosition);
        yPosition += 10;

        doc.setFont('Roboto', 'bold');
        doc.text(`STATUS:`, 25, yPosition);
        doc.setFont('Roboto', 'regular');
        doc.text(`${status.naziv}`, 65, yPosition);
        yPosition += 15;

        doc.setFont('Roboto', 'bold');
        doc.text(`NAPOMENA:`, 25, yPosition)
        yPosition += 10
        doc.setFont('Roboto', 'normal');
        doc.text(`${uredjaj.napomena}`, 65, yPosition)
        yPosition += 10

        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(128, 128, 128);
            doc.text(
                `Stranica ${i} od ${pageCount}`,
                doc.internal.pageSize.getWidth() / 2,
                doc.internal.pageSize.getHeight() - 10,
                { align: 'center' }
            );
            doc.text(
                `Generirano: ${new Date().toLocaleString('hr-HR')}`,
                20,
                doc.internal.pageSize.getHeight() - 10
            );
        }

        // Otvori PDF u novom prozoru
        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
    };

    return generirajPDF;
}
