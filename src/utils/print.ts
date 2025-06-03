import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export async function printDocument(elementId: string): Promise<void> {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Print element not found');
    }

    // Add a class to the body to apply print-specific styles
    document.body.classList.add('is-printing');

    // Create a clone of the element to avoid modifying the original
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.visibility = 'hidden';
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    document.body.appendChild(clone);

    // Wait for images to load
    await Promise.all(
      Array.from(clone.getElementsByTagName('img')).map(img => {
        if (img.complete) {
          return Promise.resolve();
        }
        return new Promise(resolve => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      })
    );

    // Open print dialog
    window.print();

    // Cleanup
    document.body.removeChild(clone);
    document.body.classList.remove('is-printing');
  } catch (error) {
    console.error('Print error:', error);
    throw error;
  }
}

export async function generatePDF(elementId: string): Promise<void> {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save('quotation.pdf');
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
}