const http = require('http');

const BASE_URL = 'http://localhost:3000';
const API_KEY = 'secret-api-key';

const request = (method, path, body = null, headers = {}) => {
    return new Promise((resolve, reject) => {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };

        const req = http.request(`${BASE_URL}${path}`, options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = data ? JSON.parse(data) : null;
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, data });
                }
            });
        });

        req.on('error', reject);

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
};

const runTests = async () => {
    console.log('Starting API Tests...\n');

    try {
        // 1. Health Check
        console.log('1. Testing Root Route...');
        const health = await request('GET', '/');
        console.log(`Status: ${health.status}, Response: ${typeof health.data === 'object' ? JSON.stringify(health.data) : health.data}`);
        if (health.status !== 200) throw new Error('Root route failed');
        console.log('✅ Passed\n');

        // 2. Get All Products (Initial)
        console.log('2. Testing Get All Products...');
        const initialProducts = await request('GET', '/api/products', null, { 'x-api-key': API_KEY });
        console.log(`Status: ${initialProducts.status}, Count: ${initialProducts.data.results}`);
        if (initialProducts.status !== 200) throw new Error('Get products failed');
        console.log('✅ Passed\n');

        // 3. Create Product (Auth Failure)
        console.log('3. Testing Create Product (No Auth)...');
        const noAuth = await request('POST', '/api/products', {
            name: 'Test Product',
            price: 100,
            category: 'Test'
        });
        console.log(`Status: ${noAuth.status}`);
        if (noAuth.status !== 401) throw new Error('Auth check failed');
        console.log('✅ Passed\n');

        // 4. Create Product (Success)
        console.log('4. Testing Create Product (With Auth)...');
        const newProduct = await request('POST', '/api/products', {
            name: 'New Test Product',
            description: 'A test description',
            price: 50.5,
            category: 'Electronics',
            inStock: true
        }, { 'x-api-key': API_KEY });
        console.log(`Status: ${newProduct.status}, ID: ${newProduct.data.id}`);
        if (newProduct.status !== 201) throw new Error('Create product failed');
        const createdId = newProduct.data.id;
        console.log('✅ Passed\n');

        // 5. Get Product By ID
        console.log('5. Testing Get Product By ID...');
        const fetchedProduct = await request('GET', `/api/products/${createdId}`, null, { 'x-api-key': API_KEY });
        console.log(`Status: ${fetchedProduct.status}, Name: ${fetchedProduct.data.name}`);
        if (fetchedProduct.status !== 200 || fetchedProduct.data.id !== createdId) throw new Error('Get by ID failed');
        console.log('✅ Passed\n');

        // 6. Update Product
        console.log('6. Testing Update Product...');
        const updatedProduct = await request('PUT', `/api/products/${createdId}`, {
            price: 75.0
        }, { 'x-api-key': API_KEY });
        console.log(`Status: ${updatedProduct.status}, New Price: ${updatedProduct.data.price}`);
        if (updatedProduct.status !== 200 || updatedProduct.data.price !== 75.0) throw new Error('Update failed');
        console.log('✅ Passed\n');

        // 7. Stats
        console.log('7. Testing Stats...');
        const stats = await request('GET', '/api/products/stats', null, { 'x-api-key': API_KEY });
        console.log(`Status: ${stats.status}, Data:`, stats.data);
        if (stats.status !== 200) throw new Error('Stats failed');
        console.log('✅ Passed\n');

        // 8. Delete Product
        console.log('8. Testing Delete Product...');
        const deleteRes = await request('DELETE', `/api/products/${createdId}`, null, { 'x-api-key': API_KEY });
        console.log(`Status: ${deleteRes.status}`);
        if (deleteRes.status !== 204) throw new Error('Delete failed');
        console.log('✅ Passed\n');

        // 9. Verify Delete
        console.log('9. Verifying Delete...');
        const checkDelete = await request('GET', `/api/products/${createdId}`, null, { 'x-api-key': API_KEY });
        console.log(`Status: ${checkDelete.status}`);
        if (checkDelete.status !== 404) throw new Error('Product still exists');
        console.log('✅ Passed\n');

        console.log('🎉 All Tests Completed Successfully!');
    } catch (error) {
        console.error('❌ Test Failed:', error);
        process.exit(1);
    }
};

// Wait a bit for server to start if running immediately
setTimeout(runTests, 2000);
