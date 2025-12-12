const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'http://localhost:5000';
const TEST_FILE_PATH = path.join(__dirname, 'test_sample.txt');

// Helper: Sleep
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
    console.log('🚀 Starting Integration Test...');

    // 1. Wait for Server Health
    let healthy = false;
    for (let i = 0; i < 10; i++) {
        try {
            const res = await fetch(BASE_URL + '/');
            if (res.ok) {
                console.log('✅ Server is up and running.');
                healthy = true;
                break;
            }
        } catch (e) {
            if (i === 0) console.log('Waiting for server...');
            await sleep(1000);
        }
    }

    if (!healthy) {
        console.error('❌ Server failed to start within 10 seconds.');
        process.exit(1);
    }

    // 2. Register
    const email = `test_${Date.now()}@example.com`;
    const password = 'password123';
    console.log(`\n👤 Registering user: ${email}`);

    let token = '';

    try {
        const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Test User', email, password })
        });
        const regData = await regRes.json();

        if (!regRes.ok) throw new Error(regData.message);
        token = regData.token;
        console.log('✅ Registration successful.');
    } catch (err) {
        console.error('❌ Registration failed:', err.message);
        process.exit(1);
    }

    // 3. Login (Optional, just verifying redundant login works)
    console.log('\n🔑 Logging in...');
    try {
        const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const loginData = await loginRes.json();
        if (!loginRes.ok) throw new Error(loginData.message);
        console.log('✅ Login successful.');
    } catch (err) {
        console.error('❌ Login failed:', err.message);
    }

    // 4. Create Dummy File
    fs.writeFileSync(TEST_FILE_PATH, 'This is a test file for the AI Knowledge Base extraction system.');

    // 5. Upload Text File
    console.log('\n📄 Uploading Text file...');
    try {
        const axios = require('axios');
        const FormData = require('form-data');

        // Text File
        const form = new FormData();
        form.append('file', fs.createReadStream(TEST_FILE_PATH));

        const uploadRes = await axios.post(`${BASE_URL}/api/files/upload`, form, {
            headers: { ...form.getHeaders(), 'Authorization': `Bearer ${token}` }
        });

        console.log('✅ Text Upload successful!');
        console.log(`📝 Extracted (Text): ${uploadRes.data.file.extractedText.substring(0, 50)}...`);

        // 6. Upload CSV File
        console.log('\n📊 Uploading CSV file...');
        const CSV_PATH = path.join(__dirname, 'test.csv');
        fs.writeFileSync(CSV_PATH, 'Name,Role\nAlice,Engineer\nBob,Manager');

        const csvForm = new FormData();
        csvForm.append('file', fs.createReadStream(CSV_PATH));

        const csvRes = await axios.post(`${BASE_URL}/api/files/upload`, csvForm, {
            headers: { ...csvForm.getHeaders(), 'Authorization': `Bearer ${token}` }
        });

        console.log('✅ CSV Upload successful!');
        const csvParams = csvRes.data.file.tableData || csvRes.data.file.extractedText; // Depending on implementation
        console.log(`📝 Extracted (CSV): ${JSON.stringify(csvParams).substring(0, 100)}...`);

        // Cleanup CSV
        if (fs.existsSync(CSV_PATH)) fs.unlinkSync(CSV_PATH);

    } catch (err) {
        console.error('❌ Upload failed:', err.response ? err.response.data : err.message);
        process.exit(1);
    } finally {
        // Cleanup Text
        if (fs.existsSync(TEST_FILE_PATH)) fs.unlinkSync(TEST_FILE_PATH);
    }

    console.log('\n🎉 All tests passed (Text & CSV)!');
}

main();
