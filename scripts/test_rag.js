const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

const BASE_URL = 'http://localhost:5000';

async function main() {
    console.log('🚀 Starting RAG Endpoint Test...');

    const email = `ragtest_${Date.now()}@example.com`;
    const password = 'password123';
    let token = '';
    let fileId = '';

    try {
        // 1. Register
        console.log('👤 Registering...');
        const regRes = await axios.post(`${BASE_URL}/api/auth/register`, {
            name: 'RAG Tester',
            email,
            password
        });
        token = regRes.data.token;
        console.log('✅ Registered.');

        // 2. Upload File
        console.log('📄 Uploading "RagTest.txt"...');
        const filePath = path.join(__dirname, 'RagTest.txt');
        fs.writeFileSync(filePath, 'The secret code is OMEGA-99. The project is called "Project Antigravity".');

        const form = new FormData();
        form.append('file', fs.createReadStream(filePath));

        const uploadRes = await axios.post(`${BASE_URL}/api/files/upload`, form, {
            headers: { ...form.getHeaders(), 'Authorization': `Bearer ${token}` }
        });

        fileId = uploadRes.data.file._id;
        console.log(`✅ Uploaded. FileID: ${fileId}`);

        // Cleanup temp file
        fs.unlinkSync(filePath);

        // 3. Test Query without FileID (Global context)
        console.log('\n❓ Test 1: Global Query "What is the secret code?"');
        const res1 = await axios.post(`${BASE_URL}/api/rag/query`, {
            query: "What is the secret code?"
        }, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log('💬 Answer:', res1.data.answer);
        console.log('📚 Chunks found:', res1.data.topChunks.length);

        // 4. Test Query WITH FileID (Specific context)
        console.log('\n❓ Test 2: Scoped Query (with fileId) "What is the project name?"');
        const res2 = await axios.post(`${BASE_URL}/api/rag/query`, {
            query: "What is the project name?",
            fileId: fileId
        }, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log('💬 Answer:', res2.data.answer);

        console.log('\n🎉 RAG Endpoint verified successfully!');

    } catch (err) {
        const msg = err.response ? JSON.stringify(err.response.data) : err.message;
        console.error('❌ RAG Test Failed:', msg);
        fs.writeFileSync('error_log.txt', msg);
    }
}

main();
