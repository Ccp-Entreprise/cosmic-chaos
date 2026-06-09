const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const filePath = path.resolve(__dirname, 'audit-template.html');
  await page.goto('file:///' + filePath.replace(/\\/g, '/'), { waitUntil: 'networkidle0' });

  // Remove the toolbar before printing
  await page.evaluate(() => {
    const toolbar = document.querySelector('.toolbar');
    if (toolbar) toolbar.remove();
    // Remove editable borders for clean PDF
    document.querySelectorAll('.editable').forEach(el => {
      el.style.border = 'none';
      el.style.padding = '0';
    });
  });

  const outputPath = path.resolve(__dirname, 'audit-template-cosmic-chaos-production.pdf');
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' }
  });

  console.log('PDF genere : ' + outputPath);
  await browser.close();
})();
