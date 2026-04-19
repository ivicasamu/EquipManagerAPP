import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';

export default function GrupaPDFGenerator({ event, klijent, uredjaji }) {

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
        const datum = new Date(event.datumPocetka)

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
        doc.text(`DETALJI EVENTA - ${event.lokacija}, ${datum.toLocaleDateString('hr-HR')}`, 20, 45);

        // Linija ispod naslova
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.5);
        doc.line(20, 48, 190, 48);

        let yPosition = 60;

        // Podaci o eventu
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Podaci o eventu:', 20, yPosition);
        yPosition += 10;

        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
        doc.text(`Datum početka: ${datum.toLocaleDateString('hr-HR')}`, 25, yPosition)
        yPosition += 7;
        doc.text(`Predviđeno trajanje: ${event.predvidenoTrajanje} dana`, 25, yPosition);
        yPosition += 15;

        // Podaci o klijentu
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Podaci o klijentu:', 20, yPosition);
        yPosition += 10;

        doc.setFontSize(11);
        doc.setFont(undefined, 'normal')
        doc.text(`Naziv: ${klijent.naziv}`, 25, yPosition)
        yPosition += 7
        doc.text(`Adresa: ${klijent.adresa}`, 25, yPosition)
        yPosition += 7
        doc.text(`OIB: ${klijent.oib}`, 25, yPosition)
        yPosition += 7
        doc.text(`Kontakt osoba: ${klijent.kontaktOsoba}`, 25, yPosition)
        yPosition += 7
        doc.text(`Telefon: ${klijent.tel}`, 25, yPosition)
        yPosition += 7
        doc.text(`Telefon: ${klijent.email}`, 25, yPosition)
        yPosition += 15

        // Popis polaznika
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text('Popis iznejmljene opreme:', 20, yPosition);
        yPosition += 20;

        if (uredjaji && uredjaji.length > 0) {
            // Tablica s polaznicima
            const tableData = uredjaji.map(uredjaj => [
                uredjaj.model,
                uredjaj.serijskiBroj
            ]);

            autoTable(doc,{
                startY: yPosition,
                head: [['Uređaj', 'Serijski broj']],
                body: tableData,
               // 1. Postavi ukupnu širinu tablice na širinu dostupnog prostora (npr. 180mm)
    tableWidth: 'auto', 
    
    // 2. Margine (lijevo, desno) - osiguraj da ima mjesta
    margin: { left: 25, right: 25 },

    styles: { 
        font: 'Roboto', 
        fontStyle: 'normal',
        fontSize: 10, // Smanji malo font ako i dalje ne stane (default je 12)
        overflow: 'linebreak' // Prebaci dugački tekst u novi red
    },
    
    headStyles: { 
        font: 'Roboto', 
        fontStyle: 'bold',
        fillColor: [105] 
    },

    // 3. Ručno podešavanje širine stupaca (ukupno cca 180mm za A4)
    columnStyles: {
        0: { cellWidth: 80 }, // Ime
        1: { cellWidth: 80 }, // Prezime
    }
            });
        } else {
            doc.setFontSize(11);
            doc.setFont(undefined, 'normal');
            doc.text('Nema uređaja na eventu.', 25, yPosition);
        }

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
