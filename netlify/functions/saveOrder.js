// ========== NETLIFY SERVERLESS FUNCTION - SAVE ORDER ==========
// Endpoint: /.netlify/functions/saveOrder
// Method: GET (untuk retrieve orders) atau POST (untuk save orders)

const fs = require('fs');
const path = require('path');

// Path untuk file JSON data (dalam Netlify, gunakan /tmp untuk temporary storage)
const dataDir = '/tmp';
const ordersFile = path.join(dataDir, 'orders.json');

// Load orders dari file
function loadOrders() {
    try {
        if (fs.existsSync(ordersFile)) {
            const data = fs.readFileSync(ordersFile, 'utf8');
            return JSON.parse(data);
        }
        return [];
    } catch (error) {
        console.error('Error loading orders:', error);
        return [];
    }
}

// Save orders ke file
function saveOrders(orders) {
    try {
        // Ensure directory exists
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving orders:', error);
        return false;
    }
}

// Main handler
exports.handler = async (event, context) => {
    try {
        const { httpMethod, body } = event;

        // GET - Retrieve all orders
        if (httpMethod === 'GET') {
            const orders = loadOrders();
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(orders)
            };
        }

        // POST - Create or update order
        if (httpMethod === 'POST') {
            const orders = loadOrders();
            const newOrder = JSON.parse(body);

            // Validate order data
            if (!newOrder.id) {
                newOrder.id = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            }
            if (!newOrder.createdAt) {
                newOrder.createdAt = new Date().toISOString();
            }

            // Check if order already exists
            const existingIndex = orders.findIndex(o => o.id === newOrder.id);
            if (existingIndex >= 0) {
                // Update existing
                orders[existingIndex] = { ...orders[existingIndex], ...newOrder };
            } else {
                // Add new
                orders.push(newOrder);
            }

            // Save to file
            if (saveOrders(orders)) {
                return {
                    statusCode: 201,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({
                        success: true,
                        message: 'Order saved successfully',
                        order: newOrder
                    })
                };
            } else {
                return {
                    statusCode: 500,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({
                        success: false,
                        message: 'Failed to save order'
                    })
                };
            }
        }

        // DELETE - Delete order by ID
        if (httpMethod === 'DELETE') {
            const orderId = event.queryStringParameters?.id;
            if (!orderId) {
                return {
                    statusCode: 400,
                    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                    body: JSON.stringify({ success: false, message: 'Order ID required' })
                };
            }

            let orders = loadOrders();
            const originalLength = orders.length;
            orders = orders.filter(o => o.id !== orderId);

            if (orders.length < originalLength) {
                saveOrders(orders);
                return {
                    statusCode: 200,
                    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                    body: JSON.stringify({ success: true, message: 'Order deleted successfully' })
                };
            } else {
                return {
                    statusCode: 404,
                    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                    body: JSON.stringify({ success: false, message: 'Order not found' })
                };
            }
        }

        // Method not allowed
        return {
            statusCode: 405,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ success: false, message: 'Method not allowed' })
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({
                success: false,
                message: 'Internal server error',
                error: error.message
            })
        };
    }
};
