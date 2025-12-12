const BASE_URL = 'http://localhost:5000';

async function main() {
    console.log('🚀 Starting Search (RAG) Test...');

    const email = `test_${Date.now()}@example.com`;
    const password = 'password123';
    let token = '';

    // 1. Register & Login (Need token)
    try {
        // Register
        const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Search Tester', email, password })
        });
        let data = await regRes.json();
        token = data.token;

        console.log('✅ Registered temporary user.');

        // 2. Ask Question
        // Note: This assumes you have already uploaded a file that contains relevant info.
        // If the DB is empty, it might say "I don't know", but it shouldn't crash.
        const question = "What is the content of the file I uploaded?";
        console.log(`\n❓ Asking: "${question}"`);

        const askRes = await fetch(`${BASE_URL}/api/search/ask`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ question })
        });

        const askData = await askRes.json();

        if (!askRes.ok) throw new Error(askData.message || 'Search failed');

        console.log('\n💬 AI Answer:', askData.answer);
        console.log('📚 Sources Used:', askData.sources ? askData.sources.length : 0);

        console.log('\n✅ Search endpoint is reachable and responding!');

    } catch (err) {
        console.error('❌ Search Test Failed:', err.message);
    }
}

main();
