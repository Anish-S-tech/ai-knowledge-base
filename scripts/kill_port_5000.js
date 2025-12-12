const { exec } = require('child_process');

console.log("Searching for process on port 5000...");
exec('netstat -ano | findstr :5000', (err, stdout) => {
    if (err) {
        console.log("No process found or error:", err.message);
        return;
    }
    const lines = stdout.split('\n');
    // Look for LISTENING
    const line = lines.find(l => l.includes('LISTENING'));
    if (line) {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1]; // Last column is PID

        if (pid && /^\d+$/.test(pid)) {
            console.log(`Found Process PID: ${pid}. Killing it...`);
            exec(`taskkill /PID ${pid} /F`, (kErr, kOut) => {
                if (kErr) {
                    console.error('❌ Failed to kill:', kErr.message);
                } else {
                    console.log('✅ Killed process successfully.');
                }
            });
        } else {
            console.log("Could not parse PID from line:", line);
        }
    } else {
        console.log("No LISTENING process found on port 5000.");
    }
});
