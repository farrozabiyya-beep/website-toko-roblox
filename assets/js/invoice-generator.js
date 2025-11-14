/**
 * Invoice Generator
 * Membuat dan mencetak invoice untuk pesanan
 */

class InvoiceGenerator {
    constructor() {
        this.invoiceNumber = 1000;
    }

    /**
     * Generate nomor invoice
     * Format: INV-YYYYMMDD-XXXX
     */
    generateInvoiceNumber() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const number = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
        
        return `INV-${year}${month}${day}-${number}`;
    }

    /**
     * Generate invoice HTML
     */
    generateInvoiceHTML(order, customer) {
        const invoiceNumber = this.generateInvoiceNumber();
        const currentDate = new Date().toLocaleDateString('id-ID');
        const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('id-ID');

        const subtotal = order.total;
        const tax = Math.round(subtotal * 0.1); // 10% tax
        const total = subtotal + tax;

        return `
            <!DOCTYPE html>
            <html lang="id">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Invoice - ${invoiceNumber}</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }

                    body {
                        font-family: 'Rajdhani', sans-serif;
                        color: #333;
                        line-height: 1.6;
                        background: #f5f5f5;
                    }

                    .invoice-container {
                        max-width: 800px;
                        margin: 20px auto;
                        background: white;
                        padding: 40px;
                        border-radius: 10px;
                        box-shadow: 0 0 20px rgba(0,0,0,0.1);
                    }

                    .invoice-header {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 40px;
                        margin-bottom: 40px;
                        border-bottom: 3px solid #007bff;
                        padding-bottom: 20px;
                    }

                    .logo {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }

                    .logo h1 {
                        font-size: 1.8rem;
                        color: #007bff;
                    }

                    .invoice-details {
                        text-align: right;
                    }

                    .invoice-details p {
                        margin-bottom: 5px;
                        color: #666;
                    }

                    .invoice-details strong {
                        display: block;
                        font-size: 1.1rem;
                        color: #333;
                    }

                    .invoice-body {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 40px;
                        margin-bottom: 40px;
                    }

                    .customer-info h3,
                    .company-info h3 {
                        color: #007bff;
                        margin-bottom: 10px;
                        font-size: 0.9rem;
                        text-transform: uppercase;
                    }

                    .customer-info p,
                    .company-info p {
                        margin-bottom: 5px;
                        font-size: 0.9rem;
                    }

                    .company-info p {
                        color: #666;
                    }

                    table {
                        width: 100%;
                        margin-bottom: 30px;
                        border-collapse: collapse;
                    }

                    table th {
                        background: #007bff;
                        color: white;
                        padding: 12px;
                        text-align: left;
                        font-weight: 600;
                    }

                    table td {
                        padding: 12px;
                        border-bottom: 1px solid #eee;
                    }

                    table tr:hover {
                        background: #f9f9f9;
                    }

                    .summary {
                        display: grid;
                        grid-template-columns: 2fr 1fr;
                        gap: 40px;
                        margin-bottom: 30px;
                    }

                    .summary-notes {
                        padding: 15px;
                        background: #f9f9f9;
                        border-radius: 5px;
                    }

                    .summary-notes h4 {
                        color: #007bff;
                        margin-bottom: 10px;
                        font-size: 0.9rem;
                    }

                    .summary-notes p {
                        font-size: 0.85rem;
                        color: #666;
                        line-height: 1.5;
                    }

                    .total-section {
                        text-align: right;
                    }

                    .total-row {
                        display: flex;
                        justify-content: flex-end;
                        margin-bottom: 8px;
                        gap: 20px;
                    }

                    .total-row span:first-child {
                        width: 100px;
                        text-align: left;
                    }

                    .total-row span:last-child {
                        width: 100px;
                        text-align: right;
                    }

                    .total-row.grand-total {
                        border-top: 2px solid #007bff;
                        border-bottom: 2px solid #007bff;
                        padding: 10px 0;
                        font-weight: 700;
                        font-size: 1.1rem;
                        color: #007bff;
                    }

                    .footer {
                        text-align: center;
                        padding-top: 30px;
                        border-top: 1px solid #eee;
                        color: #999;
                        font-size: 0.85rem;
                    }

                    .payment-status {
                        display: inline-block;
                        padding: 8px 15px;
                        background: #28a745;
                        color: white;
                        border-radius: 5px;
                        font-weight: 600;
                        margin-bottom: 20px;
                    }

                    .print-button {
                        text-align: center;
                        margin-bottom: 20px;
                    }

                    .print-button button {
                        padding: 10px 30px;
                        background: #007bff;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-weight: 600;
                    }

                    .print-button button:hover {
                        background: #0056b3;
                    }

                    @media print {
                        body {
                            background: white;
                        }
                        .print-button {
                            display: none;
                        }
                        .invoice-container {
                            box-shadow: none;
                            margin: 0;
                        }
                    }

                    @media (max-width: 600px) {
                        .invoice-container {
                            padding: 20px;
                        }
                        .invoice-header,
                        .invoice-body,
                        .summary {
                            grid-template-columns: 1fr;
                            gap: 20px;
                        }
                        .invoice-details {
                            text-align: left;
                        }
                        table {
                            font-size: 0.85rem;
                        }
                        table th, table td {
                            padding: 8px;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="print-button">
                    <button onclick="window.print()">🖨️ Cetak Invoice</button>
                </div>

                <div class="invoice-container">
                    <!-- Header -->
                    <div class="invoice-header">
                        <div class="logo">
                            <h1>DEV ROBLOX SHOP</h1>
                        </div>
                        <div class="invoice-details">
                            <p>Nomor Invoice</p>
                            <strong>${invoiceNumber}</strong>
                            <p style="margin-top: 15px;">Tanggal</p>
                            <strong>${currentDate}</strong>
                        </div>
                    </div>

                    <!-- Status -->
                    <div>
                        <span class="payment-status">✓ Pembayaran Dikonfirmasi</span>
                    </div>

                    <!-- Body -->
                    <div class="invoice-body">
                        <div class="customer-info">
                            <h3>Tagihan Kepada</h3>
                            <p><strong>${customer.fullname || customer.username}</strong></p>
                            <p>Email: ${customer.email}</p>
                            <p>WhatsApp: ${customer.phone}</p>
                            <p>Username Roblox: ${customer.robloxUsername || '-'}</p>
                        </div>
                        <div class="company-info">
                            <h3>Dari</h3>
                            <p><strong>DEV ROBLOX SHOP</strong></p>
                            <p>Penyedia Robux & Gamepass Terpercaya</p>
                            <p>WhatsApp: +62 812-1447-7714</p>
                            <p>Jam Operasional: 08:00 - 21:00 WIB</p>
                            <p>Senin - Minggu</p>
                        </div>
                    </div>

                    <!-- Items Table -->
                    <table>
                        <thead>
                            <tr>
                                <th>Deskripsi Produk</th>
                                <th style="text-align: center;">Qty</th>
                                <th style="text-align: right;">Harga</th>
                                <th style="text-align: right;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${order.productName || 'Produk Roblox'}</td>
                                <td style="text-align: center;">1</td>
                                <td style="text-align: right;">Rp${order.total.toLocaleString('id-ID')}</td>
                                <td style="text-align: right;">Rp${order.total.toLocaleString('id-ID')}</td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- Summary -->
                    <div class="summary">
                        <div class="summary-notes">
                            <h4>Catatan</h4>
                            <p>Terima kasih telah mempercayai DEV ROBLOX SHOP! Pesanan Anda akan diproses dalam 1-24 jam kerja. Anda akan menerima notifikasi melalui WhatsApp setelah pesanan selesai.</p>
                        </div>
                        <div class="total-section">
                            <div class="total-row">
                                <span>Subtotal:</span>
                                <span>Rp${subtotal.toLocaleString('id-ID')}</span>
                            </div>
                            <div class="total-row">
                                <span>PPN 10%:</span>
                                <span>Rp${tax.toLocaleString('id-ID')}</span>
                            </div>
                            <div class="total-row grand-total">
                                <span>Total:</span>
                                <span>Rp${total.toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="footer">
                        <p>Invoice ini dibuat otomatis oleh sistem DEV ROBLOX SHOP</p>
                        <p>Jika ada pertanyaan, hubungi customer service kami melalui WhatsApp: +62 812-1447-7714</p>
                        <p style="margin-top: 20px; font-size: 0.8rem;">© 2024 DEV ROBLOX SHOP. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    /**
     * Download invoice sebagai PDF/HTML
     */
    downloadInvoice(order, customer, format = 'html') {
        const html = this.generateInvoiceHTML(order, customer);

        if (format === 'print') {
            const printWindow = window.open('', '', 'height=600,width=800');
            printWindow.document.write(html);
            printWindow.document.close();
            printWindow.print();
            return;
        }

        // Download as HTML
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(html));
        element.setAttribute('download', `Invoice-${this.generateInvoiceNumber()}.html`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    /**
     * Show invoice preview dalam modal
     */
    showInvoicePreview(order, customer) {
        const html = this.generateInvoiceHTML(order, customer);
        
        const modal = document.createElement('div');
        modal.id = 'invoiceModal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        modal.innerHTML = `
            <div style="
                width: 90%;
                max-width: 900px;
                height: 90vh;
                background: white;
                border-radius: 10px;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            ">
                <div style="
                    padding: 20px;
                    background: #007bff;
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <h3>Preview Invoice</h3>
                    <button onclick="document.getElementById('invoiceModal').remove()" style="
                        background: white;
                        color: #007bff;
                        border: none;
                        padding: 8px 15px;
                        border-radius: 5px;
                        cursor: pointer;
                        font-weight: 600;
                    ">✕ Tutup</button>
                </div>
                <iframe style="
                    flex: 1;
                    border: none;
                    margin: 0;
                " srcdoc="${html.replace(/"/g, '&quot;')}"></iframe>
            </div>
        `;

        document.body.appendChild(modal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }
}

// Global instance
const invoiceGenerator = new InvoiceGenerator();

// Helper function untuk membuat invoice dari order
function generateAndDownloadInvoice(order, customer) {
    invoiceGenerator.downloadInvoice(order, customer, 'print');
}

// Helper function untuk preview
function previewInvoice(order, customer) {
    invoiceGenerator.showInvoicePreview(order, customer);
}
